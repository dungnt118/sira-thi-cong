import { query, queryList, mutate } from 'app/services/graphqlService';
import { gql } from '@apollo/client';

/**
 * find_content: Lấy một bản ghi theo schema và _id
 */
export async function find_content<T = any>(variables: { schema: string, _id: string }): Promise<{ data: T | null, code: number, message: string }> {
  const FIND_CONTENT = gql`
    query find_content($schema: String!, $_id: String!) {
      response: find_content(schema: $schema, _id: $_id) {
        code
        message
        data
      }
    }
  `;
  return query<T>(FIND_CONTENT, variables);
}

/**
 * query_content: Lấy danh sách bản ghi theo schema và filter
 */
export async function query_content<T = any>(variables: { schema: string, filter?: any }): Promise<{ data: T[] | null, code: number, message: string }> {
  const QUERY_CONTENT = gql`
    query query_content($schema: String!, $filter: JSON) {
      response: query_content(schema: $schema, filter: $filter) {
        code
        message
        data
      }
    }
  `;
  return queryList<T>(QUERY_CONTENT, variables);
}

/**
 * count_content: Đếm số lượng bản ghi theo schema và filter
 */
export async function count_content(variables: { schema: string, filter?: any }): Promise<{ data: number, code: number, message: string }> {
  const COUNT_CONTENT = gql`
    query count_content($schema: String!, $filter: JSON) {
      response: count_content(schema: $schema, filter: $filter) {
        code
        message
        data
      }
    }
  `;
  const response = await query<number>(COUNT_CONTENT, variables);
  return {
    ...response,
    data: response.data || 0
  };
}

/**
 * save_content: Lưu bản ghi mới (hoặc cập nhật nếu update_if_duplicate)
 */
export async function save_content<T = any>(variables: { schema: string, data: any, update_if_duplicate?: boolean }): Promise<{ data: T | null, code: number, message: string }> {
  const SAVE_CONTENT = gql`
    mutation save_content($schema: String!, $data: JSON, $update_if_duplicate: Boolean) {
      response: save_content(schema: $schema, data: $data, update_if_duplicate: $update_if_duplicate) {
        code
        message
        data
      }
    }
  `;
  return mutate<T>(SAVE_CONTENT, variables);
}

/**
 * update_partial_content: Cập nhật một phần bản ghi theo _id
 */
export async function update_partial_content<T = any>(variables: { schema: string, data: any, _id: string }): Promise<{ data: T | null, code: number, message: string }> {
  const UPDATE_PARTIAL_CONTENT = gql`
    mutation update_partial_content($schema: String!, $data: JSON, $_id: String!) {
      response: update_partial_content(schema: $schema, data: $data, _id: $_id) {
        code
        message
        data
      }
    }
  `;
  return mutate<T>(UPDATE_PARTIAL_CONTENT, variables);
}

/**
 * delete_content: Xóa một bản ghi theo _id
 */
export async function delete_content(variables: { schema: string, _id: string }): Promise<{ success: boolean, code: number, message: string }> {
  const DELETE_CONTENT = gql`
    mutation delete_content($schema: String!, $_id: String!) {
      response: delete_content(schema: $schema, _id: $_id) {
        code
        message
        data
        success
      }
    }
  `;
  const response = await mutate<any>(DELETE_CONTENT, variables);
  return {
    ...response,
    success: (response as any).success || false
  };
}

/**
 * delete_multi_content: Xóa nhiều bản ghi theo danh sách _ids
 */
export async function delete_multi_content(variables: { schema: string, _ids: string[] }): Promise<{ success: boolean, code: number, message: string }> {
  const DELETE_MULTI_CONTENT = gql`
    mutation delete_multi_content($schema: String!, $_ids: [String]) {
      response: delete_multi_content(schema: $schema, _ids: $_ids) {
        code
        message
        data
        success
      }
    }
  `;
  const response = await mutate<any>(DELETE_MULTI_CONTENT, variables);
  return {
    ...response,
    success: (response as any).success || false
  };
}

/**
 * lock_content: Khóa/Mở khóa một bản ghi
 */
export async function lock_content<T = any>(variables: { schema: string, _id: string, locked: boolean }): Promise<{ data: T | null, code: number, message: string }> {
  const LOCK_CONTENT = gql`
    mutation lock_content($schema: String!, $_id: String!, $locked: Boolean) {
      response: lock_content(schema: $schema, _id: $_id, locked: $locked) {
        code
        message
        data
      }
    }
  `;
  return mutate<T>(LOCK_CONTENT, variables);
}
