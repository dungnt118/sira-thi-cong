import { query, queryList } from 'app/services/graphqlService'; // TODO: Check path
import { GeneralCollectionFilter } from 'types/filters/GeneralCollectionFilter';
import {
  find_content,
  query_content,
  count_content,
  save_content,
  update_partial_content,
  delete_content,
  delete_multi_content,
  lock_content
} from 'app/store/actions/data/data.action'; // TODO: Check path

import { FIND_SERVICEREQUEST_DTO, QUERY_SERVICEREQUESTS_DTO } from '../queries/serviceRequest.queries';
import {
  IServiceRequest,
  ICreateServiceRequestInput,
  IServiceRequestListResponse
} from '../types/serviceRequest.types';

export const serviceRequestService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'ServiceRequest', _id: id });
    if (!response.data) throw new Error('Không tìm thấy ServiceRequest');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IServiceRequestListResponse> {
    return await query_content<IServiceRequest>({ schema: 'ServiceRequest', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'ServiceRequest', filter });
    return response?.data || 0;
  },

  async createServiceRequest(input: ICreateServiceRequestInput): Promise<IServiceRequest> {
    const response = await save_content({
      schema: 'ServiceRequest',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo ServiceRequest');
    return response.data as IServiceRequest;
  },

  async updateServiceRequest(id: string, input: Partial<ICreateServiceRequestInput>): Promise<IServiceRequest> {
    const response = await update_partial_content({
      schema: 'ServiceRequest',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật ServiceRequest');
    return response.data as IServiceRequest;
  },

  async deleteServiceRequest(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'ServiceRequest',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiServiceRequest(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'ServiceRequest',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockServiceRequest(id: string, locked: boolean = true): Promise<IServiceRequest> {
    const response = await lock_content({
      schema: 'ServiceRequest',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa ServiceRequest');
    return response.data as IServiceRequest;
  },

  async findServiceRequestDto(id: string): Promise<IServiceRequest> {
    const response = await query<IServiceRequest>(FIND_SERVICEREQUEST_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy ServiceRequest');
    return response.data;
  },
  async queryServiceRequestsDto(filter?: GeneralCollectionFilter): Promise<IServiceRequestListResponse> {
    return await queryList<IServiceRequest>(
      QUERY_SERVICEREQUESTS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default serviceRequestService;
