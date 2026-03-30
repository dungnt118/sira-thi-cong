import {
  find_setting,
  save_setting
} from 'app/store/actions/data/data.action'; // TODO: Check path
import {
  IMailSystem,
  ICreateMailSystemInput
} from '../types/mailSystem.types';

export const mailSystemService = {

  /** Lấy document của MailSystem (Single schema — không cần _id, chỉ có 1 document duy nhất) */
  async findSetting(): Promise<IMailSystem | null> {
    const response = await find_setting<IMailSystem>({ schema: 'MailSystem' });
    return response?.data ?? null;
  },

  /** Lưu/cập nhật document của MailSystem (Single schema — luôn upsert singleton, không cần _id) */
  async saveSetting(input: ICreateMailSystemInput): Promise<IMailSystem> {
    const response = await save_setting({
      schema: 'MailSystem',
      data: input
    });
    if (!response?.data) throw new Error('Không thể lưu MailSystem');
    return response.data as IMailSystem;
  },

};
export default mailSystemService;
