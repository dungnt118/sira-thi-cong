import {
  find_setting,
  save_setting
} from 'app/store/actions/data/data.action'; // TODO: Check path
import {
  ICustomerJourneySetting,
  ICreateCustomerJourneySettingInput
} from '../types/customerJourneySetting.types';

export const customerJourneySettingService = {

  /** Lấy document của CustomerJourneySetting (Single schema — không cần _id, chỉ có 1 document duy nhất) */
  async findSetting(): Promise<ICustomerJourneySetting | null> {
    const response = await find_setting<ICustomerJourneySetting>({ schema: 'CustomerJourneySetting' });
    return response?.data ?? null;
  },

  /** Lưu/cập nhật document của CustomerJourneySetting (Single schema — luôn upsert singleton, không cần _id) */
  async saveSetting(input: ICreateCustomerJourneySettingInput): Promise<ICustomerJourneySetting> {
    const response = await save_setting({
      schema: 'CustomerJourneySetting',
      data: input
    });
    if (!response?.data) throw new Error('Không thể lưu CustomerJourneySetting');
    return response.data as ICustomerJourneySetting;
  },

};
export default customerJourneySettingService;
