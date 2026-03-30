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

import { FIND_DISTRIBUTOR_DTO, QUERY_DISTRIBUTORS_DTO } from '../queries/distributor.queries';
import {
  IDistributor,
  ICreateDistributorInput,
  IDistributorListResponse
} from '../types/distributor.types';

export const distributorService = {
  async findContent(id: string): Promise<any> {
    const response = await find_content<any>({ schema: 'Distributor', _id: id });
    if (!response.data) throw new Error('Không tìm thấy Distributor');
    return response.data;
  },
  async queryContent(filter?: GeneralCollectionFilter): Promise<IDistributorListResponse> {
    return await query_content<IDistributor>({ schema: 'Distributor', filter });
  },

  async countContent(filter?: GeneralCollectionFilter): Promise<number> {
    const response = await count_content({ schema: 'Distributor', filter });
    return response?.data || 0;
  },

  async createDistributor(input: ICreateDistributorInput): Promise<IDistributor> {
    const response = await save_content({
      schema: 'Distributor',
      data: input,
      update_if_duplicate: false
    });
    if (!response?.data) throw new Error('Không thể tạo Distributor');
    return response.data as IDistributor;
  },

  async updateDistributor(id: string, input: Partial<ICreateDistributorInput>): Promise<IDistributor> {
    const response = await update_partial_content({
      schema: 'Distributor',
      data: { ...input },
      _id: id
    });
    if (!response?.data) throw new Error('Không thể cập nhật Distributor');
    return response.data as IDistributor;
  },

  async deleteDistributor(id: string): Promise<boolean> {
    const response = await delete_content({
      schema: 'Distributor',
      _id: id
    });
    return response?.success || false;
  },

  async deleteMultiDistributor(ids: string[]): Promise<boolean> {
    const response = await delete_multi_content({
      schema: 'Distributor',
      _ids: ids
    });
    return response?.success || false;
  },

  async lockDistributor(id: string, locked: boolean = true): Promise<IDistributor> {
    const response = await lock_content({
      schema: 'Distributor',
      _id: id,
      locked: locked
    });
    if (!response?.data) throw new Error('Không thể khóa/mở khóa Distributor');
    return response.data as IDistributor;
  },

  async findDistributorDto(id: string): Promise<IDistributor> {
    const response = await query<IDistributor>(FIND_DISTRIBUTOR_DTO, { _id: id, custominput: {} });
    if (!response.data) throw new Error('Không tìm thấy Distributor');
    return response.data;
  },
  async queryDistributorsDto(filter?: GeneralCollectionFilter): Promise<IDistributorListResponse> {
    return await queryList<IDistributor>(
      QUERY_DISTRIBUTORS_DTO,
      { filter, custominput: {} }
    );
  },
};
export default distributorService;
