import FuseUtils from '@fuse/FuseUtils';
import { showConfirmDialog } from '@fuse/components/Confirm/ConfirmDialog.action';
import history from '@history';
import { fetchDiscovery } from 'app/auth/oidc/oidcClient';
import {
    AUDIENCE,
    AUTH_FLOW,
    CLOUD_URL,
    get,
    ID_TOKEN,
    ISSUER,
    REGCODE,
    set,
    TENANT_KEY,
    TOKEN_ENDPOINT
} from 'app/services/storeService';
import { clearUserData } from '@/utils/authUtils';
import { hideLoading } from 'app/store/actions/fuse/loading.action';
import { showMessage } from 'app/store/actions/fuse/message.actions';
import moment from 'moment';
import type { OAuthClientConfig } from './config';


type ReduxStoreRef = {
    dispatch: (action: any) => any;
};

/** Mã lỗi API đồng bộ với backend (ResponseCode / tương đương). */
export const ElsagaResponseCode = {
    SUCCESS: 0,
    FAILURE: 1,
    NOT_AUTHORIZE: 2,
    EXISTED: 3,
    NOT_FOUND: 4,
    INTERNAL_ERROR: 5,
    SILENCE_FAILURE: 6,
    CONFIRMATION_REQUIRED: 7,
    ACCEPTED: 202,
    UNAUTHENTICATED: 401
} as const;

export type ElsagaResponseCodeValue = (typeof ElsagaResponseCode)[keyof typeof ElsagaResponseCode];

/** Toast cố định cho end-user khi INTERNAL_ERROR (không lộ chi tiết server). */
const INTERNAL_ERROR_USER_MESSAGE =
    'Yêu cầu không thể thực hiện vào lúc này, liên hệ quản trị viên để biết thêm thông tin!';

//đối tượng này sử dụng thư viện của fuse là: EventEmitter nó sẽ có chứa hàm không đồng bộ : on ("eventName"); tương tự như cách sử dụng redux
class elsagaService extends FuseUtils.EventEmitter {
    static readonly SUCCESS = ElsagaResponseCode.SUCCESS;
    static readonly FAILURE = ElsagaResponseCode.FAILURE;
    static readonly NOT_AUTHORIZE = ElsagaResponseCode.NOT_AUTHORIZE;
    static readonly EXISTED = ElsagaResponseCode.EXISTED;
    static readonly NOT_FOUND = ElsagaResponseCode.NOT_FOUND;
    static readonly INTERNAL_ERROR = ElsagaResponseCode.INTERNAL_ERROR;
    static readonly SILENCE_FAILURE = ElsagaResponseCode.SILENCE_FAILURE;
    static readonly CONFIRMATION_REQUIRED = ElsagaResponseCode.CONFIRMATION_REQUIRED;
    static readonly ACCEPTED = ElsagaResponseCode.ACCEPTED;
    static readonly UNAUTHENTICATED = ElsagaResponseCode.UNAUTHENTICATED;

    private reduxStore: ReduxStoreRef | null = null;

    setReduxStore(store: ReduxStoreRef | null) {
        this.reduxStore = store;
    }

    private dispatchToStore(action: any) {
        return this.reduxStore?.dispatch(action);
    }

    //hàm khởi tạo , hàm này được gọi khi đối tượng elsagaService được import từ 1 file khác vd trang Auth.js
    //chú ý để code nó gọi vào hàm này còn cần thêm 1 điều kiện khai báo nữa ở cuối file này const instance = new elsagaService(); thay vì export default elsagaService
    init() {
        //check xem phiên hiện tại có đang ở trạng thái đăng nhập không
        void this.handleAuthentication();
    }

    handleResponse = <T = any>(result: any, dispatch?: any, onError?: any): Promise<any> => {
        return new Promise((resolve, reject) => {

            // Chuẩn hoá response: ưu tiên result.data.response nếu là object, fallback sang result.data
            const resp: any = (result?.data && typeof result.data.response === 'object')
                ? result.data.response
                : (typeof result?.data === 'object' ? result.data : null);

            if (resp && typeof resp === 'object') {
                const code = resp?.code;

                if (code === ElsagaResponseCode.UNAUTHENTICATED) {
                    // TẠM THỜI DISABLE ĐỂ NGĂN CHẶN LOGOUT KHI CHUYỂN QUYỀN NHANH
                    // this.setSession(null);
                    // this.emit('onAutoLogout', resp.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    this.dispatchToStore(hideLoading());
                    if (!history.location.pathname.startsWith('/pages/errors')) {
                        if (!history.location.pathname.startsWith('/login')) {
                            // history.push(`/login?redirect=${history.location.pathname}`);
                        } else {
                            // history.push('/login');
                        }
                    }
                    resolve(resp);
                } else if (code === ElsagaResponseCode.SILENCE_FAILURE) {
                    // Không toast; log đầy đủ cho developer
                    // eslint-disable-next-line no-console -- chủ đích: chỉ dev xem console
                    console.error('[elsagaService] SILENCE_FAILURE', resp);
                    resolve(resp);
                } else if (code === ElsagaResponseCode.INTERNAL_ERROR) {
                    // Không hiển thị message từ server cho user; toast cố định + log chi tiết cho developer
                    // eslint-disable-next-line no-console -- chủ đích: chỉ dev xem console
                    console.error('[elsagaService] INTERNAL_ERROR', {
                        message: resp?.message,
                        response: resp,
                        raw: result?.data
                    });
                    this.dispatchToStore(hideLoading());
                    this.dispatchToStore(showMessage({
                        message: INTERNAL_ERROR_USER_MESSAGE,
                        variant: 'error',
                        duration: 10
                    }));
                    resolve(resp);
                } else if (code === ElsagaResponseCode.SUCCESS) {
                    resolve(resp);
                } else {
                    // Mọi mã còn lại (FAILURE, NOT_AUTHORIZE, EXISTED, NOT_FOUND, CONFIRMATION_REQUIRED, ACCEPTED, …): chỉ toast nội dung từ server, không dialog/onSubmit
                    this.dispatchToStore(hideLoading());
                    if (code === ElsagaResponseCode.FAILURE && onError) {
                        onError(resp);
                    } else if (typeof resp.message === 'string' && resp.message.length > 0) {
                        this.dispatchToStore(showMessage({
                            message: resp.message,
                            variant: 'error',
                            duration: 10
                        }));
                    }
                    resolve(resp);
                }

            } else {
                ///lỗi không xác định nếu response là null hoặc undefined
                // console.debug({ response: result.data?.response })
                if (result?.data)
                    reject(result.data);
                // message.info("Cấu trúc truy vấn chưa đúng định dạng")
            }
        })
    }
    //check phiên đăng nhập hiện tại thông qua check access_token và expires_at được lưu trong bộ nhớ trong: localStorage
    handleAuthentication = async () => {
        let access_token = this.getAccessToken();
        let expires_at = this.getExpiresAt();
        if (!access_token || access_token == null || access_token === '') {
            //nếu access_token không tồn tại chứng tỏ user chưa đăng nhập --> ta xóa toàn bộ thông tin trong localStorage và gửi lệnh logout ra ngoài
            // TẠM THỜI DISABLE ĐỂ NGĂN CHẶN LOGOUT KHI CHUYỂN QUYỀN NHANH
            // this.setSession(null);//xóa localStorage
            // this.emit('onAutoLogout', 'Vui lòng đăng nhập để sử dụng hệ thống');//gửi lệnh logout
            return;
        }

        // Token hết hạn: thử renewToken (nếu có refresh_token) trước khi auto logout
        if (expires_at < new Date()) {
            try {
                await this.renewToken();
                this.emit('onAutoLogin', true);
                return;
            } catch (e) {
                // renewToken đã tự handle setSession(null) + emit onAutoLogout khi lỗi
                return;
            }
        }

        this.emit('onAutoLogin', true);
    };
    signInCloud = (userName: any, password: any, closeLoading?: any) => {
        const tenantId = get(TENANT_KEY)
        console.log("signin cloud for tenant:", tenantId)
        return new Promise((resolve, reject) => {

            const params = {
                userName,
                password,
                tenantId,
                audience: get(AUDIENCE)
            }
            let formBody: any[] = [];
            for (let p in params) {
                var encodedKey = encodeURIComponent(p);
                var encodedValue = encodeURIComponent((params as any)[p]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            const formBodyString = formBody.join("&");
            console.log({ formBody: formBodyString })
            const request = {
                method: 'POST',
                body: formBodyString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
            };

            const loginUrl = `${get(CLOUD_URL)}/login`
            console.log("login with:", loginUrl, request)
            fetch(loginUrl, request)
                .then(res => {

                    if (res.ok) {
                        return res.json();
                    } else {
                        reject(`Request rejected with status ${res.status}`);
                        this.setSession(null);//xóa localStorage
                        this.emit('onAutoLogout', 'Tài khoản không hợp lệ hoặc đã bị vô hiệu')
                        closeLoading && closeLoading()
                    }
                })
                .then((data: any) => {
                    console.log("cloud login session data:", data)
                    this.setSession(data);
                    resolve(data)
                })
                .catch((error: any) => {
                    console.log(error);
                });
        })
    }
    
    signInWithEmailAndPassword = (email: any, password: any, client: OAuthClientConfig, closeLoading?: any) => {
        return new Promise((resolve, reject) => {
            const clientId = String(client?.client_id || '').trim();
            const clientSecret = String(client?.client_secret || '').trim();
            const scope = String(client?.scope || '').trim();

            if (!clientId || !clientSecret || !scope) {
                reject('Thiếu cấu hình OAuth client (client_id/client_secret/scope)');
                closeLoading && closeLoading();
                return;
            }

            const params = {
                'grant_type': "password",
                'username': email,
                'password': password,
                'client_secret': clientSecret,
                'client_id': clientId,
                'scope': scope
            };

            let formBody: any[] = [];
            for (let p in params) {
                var encodedKey = encodeURIComponent(p);
                var encodedValue = encodeURIComponent((params as any)[p]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            const formBodyString = formBody.join("&");
            const request = {
                method: 'POST',
                body: formBodyString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    "regCode": get(REGCODE)
                },
            };
            fetch(`${get(TOKEN_ENDPOINT)}`, request)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        reject(`Request rejected with status ${res.status}`);
                        this.setSession(null);//xóa localStorage
                        this.dispatchToStore(showConfirmDialog({
                            message: 'Tài khoản không hợp lệ hoặc đã bị vô hiệu',
                            title: "Truy cập lỗi",
                            onSubmit: () => {
                                history.push("/login")
                            }
                        }) as any)
                        closeLoading && closeLoading()
                    }
                })
                .then((data: any) => {
                    set(AUTH_FLOW, 'password');
                    this.setSession(data);
                    resolve(data)
                })
                .catch((error: any) => {
                    console.log(error);
                });
        });
    };

    ///cấp phát lại token dựa trên refresh_token đã lưu trữ
    renewToken = () => {

        ///đang phát triển
    };

    setSession = (data: any) => {
        console.debug("session data:", data);
        if (data && data.access_token) {
            localStorage.setItem('access_token', data.access_token);

            if (data.refresh_token) {
                localStorage.setItem("refresh_token", data.refresh_token)
            } else {
                localStorage.removeItem("refresh_token")
            }

            if (data.id_token) {
                set(ID_TOKEN, data.id_token);
            }

            if (data.expires_at) {
                localStorage.setItem('expires_at', data.expires_at);
            } else if (data.expires_in) {
                var expires_at = moment().add(data.expires_in, 'seconds').toDate();
                localStorage.setItem('expires_at', expires_at.toString());
            }

            localStorage.setItem('auth_time', ((new Date()).getTime() / 1000).toString());
        }
        else {

            localStorage.removeItem('access_token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('refresh_token');
            clearUserData();
            set(ID_TOKEN, null);
            set(AUTH_FLOW, null);
        }
    };

    logout = () => {
        const authFlow = String(get(AUTH_FLOW) || '').toLowerCase();
        const idToken = String(get(ID_TOKEN) || '').trim();
        const currentIssuer = String(get(ISSUER) || '').trim();

        this.setSession(null);

        // Best-effort OIDC RP-initiated logout
        if (authFlow === 'oidc' && currentIssuer) {
            void (async () => {
                try {
                    const discovery = await fetchDiscovery(currentIssuer);
                    const endSession = discovery.end_session_endpoint;
                    if (!endSession) return;

                    const postLogout = `${window.location.origin}/login`;
                    const params: Record<string, string> = {
                        post_logout_redirect_uri: postLogout,
                    };
                    if (idToken) {
                        params.id_token_hint = idToken;
                    }

                    const url = new URL(endSession);
                    for (const [k, v] of Object.entries(params)) {
                        url.searchParams.set(k, v);
                    }
                    window.location.href = url.toString();
                } catch {
                    // ignore
                }
            })();
        }
    };


    getAccessToken = () => {
        return window.localStorage.getItem('access_token');
    };
    getExpiresAt = () => {
        const expiresAt = window.localStorage.getItem("expires_at");
        return expiresAt ? new Date(expiresAt) : new Date(0);
    }
}
//new instance nhằm gọi hàm init
const instance = new elsagaService();

export default instance;
