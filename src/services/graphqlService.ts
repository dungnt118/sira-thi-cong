import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import history from '@history';
import { ACCESS_TOKEN, get, GRAPHQL_ENDPOINT, REGCODE, SUBSCRIPTION_ENDPOINT, TENANT_KEY } from 'app/services/storeService';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import { DocumentNode } from 'graphql';
import { Client, ClientOptions, createClient } from 'graphql-ws';
import { Dispatch } from 'redux';
import { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import {
  CacheUpdateOption,
  ElsagaResponse,
  FragmentOption,
  QueryOptions
} from 'types/services/GraphQLService';
import elsagaService from './authenticationService';

type ReduxStoreRef = {
  dispatch: (action: any) => any;
};

let reduxStore: ReduxStoreRef | null = null;

export const setGraphqlServiceStore = (store: ReduxStoreRef | null) => {
  reduxStore = store;
};

const dispatchToStore = (action: any) => reduxStore?.dispatch(action);

const isBrowser = typeof window !== 'undefined';

let lastUnauthorizedHandledAt = 0;
const UNAUTHORIZED_COOLDOWN_MS = 1500;

const getHttpStatusCode = (err: unknown): number | undefined => {
  if (!err || (typeof err !== 'object' && typeof err !== 'function')) {
    return undefined;
  }

  const anyErr = err as any;

  if (typeof anyErr.statusCode === 'number') {
    return anyErr.statusCode;
  }

  if (typeof anyErr.status === 'number') {
    return anyErr.status;
  }

  if (anyErr.response && typeof anyErr.response.status === 'number') {
    return anyErr.response.status;
  }

  // Some Apollo errors nest networkError
  if (anyErr.networkError) {
    return getHttpStatusCode(anyErr.networkError);
  }

  return undefined;
};

const handleUnauthorized = (operationName?: string) => {
  if (!isBrowser) {
    return;
  }

  const now = Date.now();
  if (now - lastUnauthorizedHandledAt < UNAUTHORIZED_COOLDOWN_MS) {
    return;
  }
  lastUnauthorizedHandledAt = now;

  try {
    // Clear local session first
    elsagaService.setSession(null);
    elsagaService.emit('onAutoLogout', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
  } catch (e) {
    console.warn('Không thể auto-logout khi gặp 401:', e);
  }

  // Avoid redirect loops
  const currentPath = history.location?.pathname || window.location.pathname;
  if (currentPath.startsWith('/login')) {
    return;
  }

  const redirectPath = currentPath || '/';
  const target = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : '/login';
  try {
    history.push(target);
  } catch {
    window.location.assign(target);
  }

  // Optional: surface a single contextual message
  const opName = operationName ? ` (${operationName})` : '';
  dispatchToStore(showMessage({
    title: 'Hết phiên đăng nhập',
    message: `Vui lòng đăng nhập lại${opName}`.trim(),
    variant: 'warning',
  }));
};

let apolloClient: ApolloClient | null = null;
let activeWsUrl: string | null = null;
let activeWsTransport: Client | null = null;
let activeWsLink: GraphQLWsLink | null = null;

type ApolloClientListener = (client: ApolloClient) => void;
const apolloClientListeners = new Set<ApolloClientListener>();

const notifyApolloClientListeners = (client: ApolloClient) => {
  apolloClientListeners.forEach((listener) => {
    try {
      listener(client);
    } catch (error) {
      console.warn('Apollo client listener gặp lỗi:', error);
    }
  });
};

export const subscribeApolloClient = (listener: ApolloClientListener) => {
  apolloClientListeners.add(listener);
  return () => {
    apolloClientListeners.delete(listener);
  };
};

const disposeWsTransport = () => {
  if (activeWsTransport) {
    try {
      activeWsTransport.dispose();
    } catch (error) {
      console.warn('Không thể đóng WebSocket client hiện tại:', error);
    }
  }
  activeWsTransport = null;
  activeWsLink = null;
  activeWsUrl = null;
};

const buildWsLink = (): GraphQLWsLink | null => {
  if (!isBrowser) {
    return null;
  }

  const wsUrl = get(SUBSCRIPTION_ENDPOINT);
  if (typeof wsUrl !== 'string' || !wsUrl.startsWith('ws')) {
    return null;
  }

  if (activeWsLink && activeWsUrl === wsUrl) {
    return activeWsLink;
  }

  disposeWsTransport();

  const clientOptions: ClientOptions = {
    url: wsUrl,
    lazy: true,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    connectionParams: () => {
      const accessToken = get(ACCESS_TOKEN);
      const tenantId = get(TENANT_KEY);
      const regCode = get(REGCODE);

      const params: Record<string, string> = {};

      if (accessToken) {
        params.Authorization = `Bearer ${accessToken}`;
      }

      if (tenantId) {
        params.tenantId = String(tenantId);
      }

      if (regCode) {
        params.regCode = String(regCode);
      }

      return params;
    },
  };

  const wsClient = createClient(clientOptions);
  activeWsTransport = wsClient;
  activeWsLink = new GraphQLWsLink(wsClient);
  activeWsUrl = wsUrl;

  return activeWsLink;
};

const buildHttpLink = () => {
  const uri = get(GRAPHQL_ENDPOINT);
  console.log("Graphql endpoint:", uri);
  if (typeof uri !== 'string' || !uri) {
    console.warn('Không thể khởi tạo HttpLink: graphql_endpoint không hợp lệ hoặc chưa được thiết lập.');
  }

  return new HttpLink({
    uri: (typeof uri === 'string' && uri) ? uri : '/graphql',
  });
};

const buildTerminatingLink = (): ApolloLink => {
  const httpLink = buildHttpLink();
  const wsLink = buildWsLink();

  if (!wsLink) {
    return httpLink;
  }

  return ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );
};

// composeLinks removed as it was unused

const getPathHeader = () => (isBrowser ? window.location.pathname : undefined);

const buildRequestHeaders = (extraHeader?: { [key: string]: string }) => {
  const headers: Record<string, string> = {
    ...(extraHeader || {}),
  };

  const pathHeader = getPathHeader();
  if (pathHeader) {
    headers['X-Path'] = pathHeader;
  }

  return headers;
};

// =================== TYPENAME CLEANUP ===================

/**
 * Loại bỏ __typename khỏi object/array (deep recursive)
 * 
 * Per GraphQL spec: __typename is reserved for query OUTPUTS only, not valid in input types
 * __typename là metadata của Apollo cache, backend GraphQL không chấp nhận field này trong input
 * 
 * @param value - Giá trị cần clean (object/array/primitive)
 * @returns Giá trị đã loại bỏ tất cả __typename
 */
const isDateLike = (value: any): boolean => {
  if (!value) {
    return false;
  }

  if (value instanceof Date) {
    return true;
  }

  if (typeof value !== 'object') {
    return false;
  }

  if ((value as any)._isAMomentObject || typeof (value as any).toDate === 'function') {
    return true;
  }

  if (typeof (value as any).toISOString === 'function' && typeof (value as any).valueOf === 'function') {
    return true;
  }

  return false;
};

const normalizeDateLike = (value: any): any => {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof (value as any).toDate === 'function') {
    const dateValue = (value as any).toDate();
    return dateValue instanceof Date ? dateValue : dateValue;
  }

  if (value && typeof (value as any).toISOString === 'function') {
    try {
      const iso = (value as any).toISOString();
      if (typeof iso === 'string' && !Number.isNaN(Date.parse(iso))) {
        return iso;
      }
    } catch {
      // fall through and return raw value below
    }
  }

  return value;
};

const removeTypename = (value: any): any => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(removeTypename);
  }

  if (isDateLike(value)) {
    return normalizeDateLike(value);
  }

  if (typeof value === 'object') {
    const cleaned: any = {};
    for (const key in value) {
      if (key !== '__typename') {
        cleaned[key] = removeTypename(value[key]);
      }
    }
    return cleaned;
  }

  return value;
};

/**
 * Apollo Link middleware để tự động loại bỏ __typename khỏi variables trước khi gửi lên server
 * 
 * Áp dụng cho TẤT CẢ GraphQL operations (query, mutation, subscription) tại 1 điểm duy nhất
 * → Không bao giờ bỏ sót, không cần gọi manual cleanup ở mỗi helper function
 * 
 * Lưu ý:
 * - Link này phải đứng ĐẦU TIÊN trong chain để clean trước khi các link khác xử lý
 * - Variables được clean NHƯNG responses vẫn giữ __typename cho Apollo cache normalization
 */
const cleanTypenameLink = new ApolloLink((_operation, forward) => {
  if (_operation.variables) {
    _operation.variables = removeTypename(_operation.variables);
  }
  return forward(_operation);
});

// ========================================================

const errorLink = new ErrorLink((errorResponse) => {
  const { error, operation, result } = errorResponse;
  let combinedMessage = '';

  // HTTP 401 (Unauthorized): auto logout + redirect to /login
  const httpStatus = getHttpStatusCode(error);
  if (httpStatus === 401) {
    handleUnauthorized(operation?.operationName);
    return;
  }

  if (CombinedGraphQLErrors.is(error)) {
    console.error('GraphQL errors:', error.errors);
    combinedMessage = error.errors
      .map((graphQLError) => graphQLError.message)
      .filter(Boolean)
      .join('\n');
  } else if (CombinedProtocolErrors.is(error)) {
    console.error('Protocol errors:', error.errors);
    combinedMessage = error.errors
      .map((protocolError) => protocolError.message)
      .filter(Boolean)
      .join('\n');
  } else if (error) {
    console.error('Network/Unknown error:', error);
    combinedMessage = error.message ?? String(error);
  }

  if (combinedMessage) {
    const opName = operation?.operationName ? ` (${operation.operationName})` : '';
    dispatchToStore(showMessage({
      title: 'Lỗi truy vấn',
      message: `${combinedMessage}${opName}`.trim(),
      variant: 'error'
    }));
  }

  if (result?.errors?.length) {
    console.warn('GraphQL result errors:', result.errors);
  }
});

const authLink = new SetContextLink((operation, prevContext) => {
  const access_token = get(ACCESS_TOKEN);
  const tenantId = get(TENANT_KEY);
  const regCode = get(REGCODE) || '';

  // prevContext chứa context từ các links trước đó (có thể có headers)
  const existingHeaders = ((prevContext as any).headers || {}) as Record<string, string>;

  const mergedHeaders: Record<string, string> = {
    ...existingHeaders,
  };

  if (regCode !== undefined) {
    mergedHeaders.regCode = String(regCode ?? '');
  }

  if (tenantId) {
    mergedHeaders.tenantId = String(tenantId);
  }

  if (access_token) {
    mergedHeaders.authorization = `Bearer ${access_token}`;
  } else if (isBrowser) {
    try {
      localStorage.removeItem(ACCESS_TOKEN);
    } catch (error) {
      console.warn('Không thể xóa access token khỏi localStorage:', error);
    }
  }

  Object.keys(mergedHeaders).forEach((key) => {
    if (mergedHeaders[key] == null) {
      delete mergedHeaders[key];
    }
  });

  return {
    headers: mergedHeaders,
  };
});

//Basic cache configuration (rollback to safe defaults)
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network' as const,
    errorPolicy: 'ignore' as const, // ✅ Rollback về 'ignore' như cũ
  },
  query: {
    fetchPolicy: 'no-cache' as const, // ✅ Rollback về 'no-cache' như cũ để tránh conflict
    errorPolicy: 'all' as const,
  },
}

const createApolloClientInstance = () => {
  return new ApolloClient({
    link: ApolloLink.from([
      cleanTypenameLink,    // ← PHẢI đứng ĐẦU - Clean variables trước tiên
      authLink,             // ← Sau đó mới add auth headers
      errorLink,            // ← Xử lý errors
      buildTerminatingLink(), // ← Cuối cùng mới route đến HTTP/WS
    ]),
    cache: new InMemoryCache({
      // Apollo v3 luôn add __typename vào responses (không cần config)
      // cleanTypenameLink sẽ tự động loại bỏ __typename khỏi inputs
      typePolicies: {
        Query: {
          fields: {
            // Dự phòng cho việc tùy biến sau này
          },
        },
      },
    }),
    defaultOptions,
  });
};

export const getApolloClient = () => {
  if (!apolloClient) {
    apolloClient = createApolloClientInstance();
    notifyApolloClientListeners(apolloClient);
  }
  return apolloClient;
};

export const resetApolloClient = async (): Promise<ApolloClient> => {
  disposeWsTransport();
  const nextClient = createApolloClientInstance();
  apolloClient = nextClient;
  notifyApolloClientListeners(nextClient);

  // Không gọi clearStore/resetStore ở đây để tránh InvariantViolation khi vẫn còn query đang chạy.

  return nextClient;
};

// =================== QUERY OVERLOADS ===================

type VariablesMap = { [key: string]: any };
type HeaderMap = { [key: string]: string };

const buildContext = (extraHeader?: HeaderMap) => ({
  headers: buildRequestHeaders(extraHeader),
});

const runQuery = (
  options: Parameters<ApolloClient['query']>[0],
  dispatch?: Dispatch,
  onError?: (error: any) => void,
) =>
  getApolloClient()
    .query(options)
    .then((result) => elsagaService.handleResponse(result, dispatch, onError));

const runMutation = (
  options: Parameters<ApolloClient['mutate']>[0],
  dispatch?: Dispatch,
) =>
  getApolloClient()
    .mutate(options) // ← cleanTypenameLink tự động xử lý
    .then((result) => elsagaService.handleResponse(result, dispatch));

// Legacy JS compatibility 
export function query(
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap,
  onError?: (error: any) => void
): Promise<any>;

// TypeScript single data
export function query<T>(
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap,
  onError?: (error: any) => void
): Promise<ApiResponse<T>>;

// Implementation
export function query<_T = any>(
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap,
  onError?: (error: any) => void
): Promise<any> {
  try {
    // Debug guard: log if a mutation document is accidentally passed into query()
    try {
      const def: any = getMainDefinition(query as any);
      if (def && def.kind === 'OperationDefinition') {
        const op = def.operation;
        const opName = def.name?.value || (def.selectionSet?.selections?.[0]?.name?.value) || 'anonymous';
        if (op !== 'query') {
          // Do not auto-fix; just log a clear diagnostic to locate the caller in console with stack
          // eslint-disable-next-line no-console
          console.error(
            `[graphqlService.query] Non-query document passed in: operation=${op}, name=${opName}. This will cause Apollo invariant error.`,
            { variables }
          );
          // Optional stack for pinpointing the caller
          // eslint-disable-next-line no-console
          console.trace('[graphqlService.query] call stack');
        }
      }
    } catch {
      // ignore debug analyzer errors
    }
    return runQuery(
      {
        query,
        variables,
        context: buildContext(extraHeader),
      },
      dispatch,
      onError,
    );
  } catch (error) {
    console.log("graphqlService.query: Catch error:", error);
    return Promise.resolve({
      data: null,
      error: error
    });
  }
}

// TypeScript list data
export function queryList<T>(
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap,
  onError?: (error: any) => void
): Promise<ApiListResponse<T>> {
  try {
    return runQuery(
      {
        query,
        variables,
        context: buildContext(extraHeader),
      },
      dispatch,
      onError,
    ) as Promise<ApiListResponse<T>>;
  } catch (error) {
    console.log("error:", error);
    return Promise.resolve({
      data: null,
      error: error
    } as any);
  }
}

export const queryWithOption = (
  query: DocumentNode,
  variables?: VariablesMap,
  options?: QueryOptions,
  dispatch?: Dispatch
): Promise<ElsagaResponse> => {
  const requestOptions = {
    query,
    variables,
    ...(options as any),
    context: {
      ...(options?.context || {}),
      headers: buildRequestHeaders(
        ((options?.context as any)?.headers as HeaderMap) || undefined,
      ),
    },
  };

  return runQuery(requestOptions, dispatch);
}

export const query_no_cache = (
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch
): Promise<ElsagaResponse> => {
  return runQuery(
    {
      query,
      variables,
      fetchPolicy: 'no-cache',
      context: buildContext(),
    },
    dispatch,
  );
}

export const query_cache = (
  query: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ElsagaResponse> => {
  return runQuery(
    {
      query,
      variables,
      fetchPolicy: 'cache-first',
      context: buildContext(extraHeader),
    },
    dispatch,
  );
}

// =================== MUTATE OVERLOADS ===================

// Legacy JS compatibility
export function mutate(
  mutation: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<any>;

// TypeScript single data
export function mutate<T>(
  mutation: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ApiResponse<T>>;

// Implementation  
export function mutate<_T = any>(
  mutation: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<any> {
  try {
    return runMutation(
      {
        mutation,
        variables,
        context: buildContext(extraHeader),
      },
      dispatch,
    );
  } catch (error) {
    console.log("error:", error);
    return Promise.resolve({
      data: null,
      error: error
    });
  }
}

// TypeScript list data
export function mutateList<T>(
  mutation: DocumentNode,
  variables?: VariablesMap,
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ApiListResponse<T>> {
  try {
    return runMutation(
      {
        mutation,
        variables,
        context: buildContext(extraHeader),
      },
      dispatch,
    ) as Promise<ApiListResponse<T>>;
  } catch (error) {
    console.log("error:", error);
    return Promise.resolve({
      data: null,
      error: error
    } as any);
  }
}

//hàm này chuyên để xóa data, data lấy về bắt bộc phải có _id để có thể xóa
export const mutate_remove_fragment = (
  mutation: DocumentNode,
  variables?: VariablesMap,
  options?: FragmentOption | FragmentOption[],
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ElsagaResponse> => {
  const request = getApolloClient().mutate({
    mutation,
    variables, // ← cleanTypenameLink tự động xử lý
    context: {
      headers: buildRequestHeaders(extraHeader),
    },
    update: (cache, mutationResult: any) => {
      if (mutationResult.data.response.code == 0) {
        const data = mutationResult.data.response.data;
        try {
          if (Array.isArray(options)) {
            options.forEach(function (option: FragmentOption) {
              let fragmentQuery = { id: data._id, fragment: option.fragment, fragmentName: option.fragmentName };

              const fragmentData = cache.readFragment(fragmentQuery, true);
              if (fragmentData && (fragmentData as any)._id) {
                //apollo chưa xây dựng hàm cụ thể để xóa fragment nên buộc phải sử dụng biến _deleted để đánh dấu
                //lợi ích của biến đánh dấu này là--> ta có thể khôi phục lại như cũ nếu như nhỡ tay xóa
                cache.writeFragment({
                  ...fragmentQuery,
                  data: {
                    ...data,
                    _id: null//nhận diện đã xóa
                  }
                })
              } else
                console.log(`there is no fragmentdata for _id:${data._id}`);
            })
          } else if (options) {
            let fragmentQuery = { id: data._id, fragment: options.fragment };
            const fragmentData = cache.readFragment(fragmentQuery, true);
            if (fragmentData && (fragmentData as any)._id) {
              //apollo chưa xây dựng hàm cụ thể để xóa fragment nên buộc phải sử dụng biến _deleted để đánh dấu
              //lợi ích của biến đánh dấu này là--> ta có thể khôi phục lại như cũ nếu như nhỡ tay xóa
              cache.writeFragment({
                ...fragmentQuery,
                data: {
                  ...data,
                  _id: null//thêm biến này để nhận diện đã xóa
                }
              })
            } else
              console.log(`there is no fragmentdata for _id:${data._id}`);
          }

        } catch (err) {
          console.log("error:", err);
        }
      }
    }
  });
  return request.then(result => elsagaService.handleResponse(result, dispatch));
}

///hàm này để giao diện chủ động update fragment
export const mutate_update_fragment = (
  mutation: DocumentNode,
  variables?: VariablesMap,
  options?: FragmentOption | FragmentOption[],
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ElsagaResponse> => {
  const request = getApolloClient().mutate({
    mutation,
    variables, // ← cleanTypenameLink tự động xử lý
    context: {
      headers: buildRequestHeaders(extraHeader),
    },
    update: (proxy, mutationResult: any) => {
      if (mutationResult.data.response.code == 0) {
        const data = mutationResult.data.response.data;
        try {
          if (Array.isArray(options)) {
            options.forEach(function (option: FragmentOption) {
              let fragmentQuery = { id: data._id, fragment: option.fragment, fragmentName: option.fragmentName };
              const fragmentData = proxy.readFragment(fragmentQuery, true);
              if (fragmentData && (fragmentData as any)._id) {
                //neu co gia triata need to update=", fragmentData);
                proxy.writeFragment({
                  ...fragmentQuery,
                  data,
                });
                console.log("write data successed", data);
              } else
                console.log(`there is no fragmentdata for _id:${data._id}`);
            })
          } else if (options) {
            let fragmentQuery = { id: data._id, fragment: options.fragment };

            const fragmentData = proxy.readFragment(fragmentQuery, true);
            if (fragmentData && (fragmentData as any)._id) {
              //neu co gia triata need to update=", fragmentData);
              proxy.writeFragment({
                ...fragmentQuery,
                data
              })
              console.log("write data successed", data);
            } else
              console.log(`there is no fragmentdata for _id:${data._id}`);
          }

        } catch (err) {
          console.log("error:", err);
        }
      }
    }
  });
  return request.then(result => elsagaService.handleResponse(result, dispatch));
}

///hàm này phải khai báo được các query có liên hệ với mutation này để tiến hành việc update dữ liệu thông qua hàm update
///relateQueries là 1 mảng các phần tử {query,variables}
///chưa có điều kiện hợp lý để dùng hàm này thay vì đó nên dung hàm mutate_update_fragment
export const mutate_update_cache = (
  mutation: DocumentNode,
  variables?: VariablesMap,
  options?: CacheUpdateOption | CacheUpdateOption[],
  dispatch?: Dispatch,
  extraHeader?: HeaderMap
): Promise<ElsagaResponse> => {
  const request = getApolloClient().mutate({
    mutation,
    variables, // ← cleanTypenameLink tự động xử lý
    context: {
      headers: buildRequestHeaders(extraHeader),
    },
    update: (proxy, mutationResult: any) => {
      if (mutationResult.data.response.code == 0) {
        const data = mutationResult.data.response.data;
        if (Array.isArray(options)) {
          options.forEach(function (option: CacheUpdateOption) {
            try {
              const existingData: any = proxy.readQuery(option, true);
              //modify data thông qua trường _id:
              //CHECK if data is array            
              if (Array.isArray(existingData.response.data)) {
                const found = existingData.response.data.find((d: any) => d._id == data._id);
                if (found) {
                  //copy all field
                  const keys = Object.keys(data);
                  keys.forEach(function (key) {
                    found[key] = data[key];
                  })
                } else {
                  existingData.response.data.push(data);
                }
                //finish
                proxy.writeQuery({ ...option, data: { ...existingData } });
              } else {
                //if existing data is object
                proxy.writeQuery({ ...option, data: mutationResult.data });
              }

              // console.log("write data success:", existingData);
            } catch (err) {
              console.log("read cache error:", err);
            }
          })
        } else if (options) {
          try {
            const existingData: any = proxy.readQuery(options, true);
            //modify data thông qua trường _id:
            //CHECK if data is array            
            if (Array.isArray(existingData.response.data)) {
              const found = existingData.response.data.find((d: any) => d._id == data._id);
              if (found) {
                //copy all field
                const keys = Object.keys(data);
                keys.forEach(function (key) {
                  found[key] = data[key];
                })
              } else {
                existingData.response.data.push(data);
              }
              //finish
              proxy.writeQuery({ ...options, data: { ...existingData } });
            } else {
              //if existing data is object
              proxy.writeQuery({ ...options, data: mutationResult.data });
            }

            // console.log("write data success:", existingData);
          } catch (err) {
            console.log("read cache error:", err);
          }
        }
      }
    }
  });

  return request.then(result => elsagaService.handleResponse(result, dispatch));
}

// =================== CACHE UTILITIES ===================

/**
 * Clear specific cache entries
 */
export const clearCache = (typename?: string, id?: string) => {
  const clientInstance = getApolloClient();
  if (typename && id) {
    // Clear specific entity
    clientInstance.cache.evict({ id: `${typename}:${id}` });
  } else if (typename) {
    // Clear all entities of type
    clientInstance.cache.modify({
      fields: {
        [typename.toLowerCase()]: () => undefined
      }
    });
  } else {
    // Clear entire cache
    clientInstance.cache.reset();
  }
  clientInstance.cache.gc(); // Garbage collect
};

/**
 * Optimistically update cache for mutations
 */
export const optimisticUpdate = <T>(
  typename: string,
  id: string,
  updateFields: Partial<T>
) => {
  const cacheId = `${typename}:${id}`;
  getApolloClient().cache.modify({
    id: cacheId,
    fields: updateFields as any
  });
};

/**
 * Prefetch data for better UX
 */
export const prefetchQuery = async <T>(
  query: DocumentNode,
  variables?: { [key: string]: any }
): Promise<T | null> => {
  try {
    const result = await getApolloClient().query({
      query,
      variables,
      fetchPolicy: 'cache-first' // Check cache first
    });
    return (result.data ?? null) as T | null;
  } catch (error) {
    console.warn('Prefetch failed:', error);
    return null;
  }
};

/**
 * Cache-aware query với automatic refresh
 */
export const queryWithAutoRefresh = <T>(
  query: DocumentNode,
  variables?: { [key: string]: any },
  refreshInterval?: number // seconds
): Promise<ApiResponse<T>> => {
  const clientInstance = getApolloClient();
  const request = clientInstance.query({
    query,
    variables,
    fetchPolicy: 'cache-and-network' as any // Get cache + refresh
  });

  // Auto refresh nếu cần
  if (refreshInterval) {
    setTimeout(() => {
      clientInstance.query({
        query,
        variables,
        fetchPolicy: 'network-only' // Force refresh
      });
    }, refreshInterval * 1000);
  }

  return request.then(result => elsagaService.handleResponse(result)) as Promise<ApiResponse<T>>;
};
