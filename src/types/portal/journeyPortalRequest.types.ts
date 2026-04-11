export interface ICreatePortalJourneyRequestInput {
  fullName: string;
  phone: string;
  serviceType: string;
  description?: string;
  email?: string;
  address?: string;
  province?: string;
  ward?: string;
  requestTitle?: string;
  siteAddress?: string;
  serviceTypeId?: string;
  priority?: string;
  sourceChannel?: string;
}

export interface ICreatePortalJourneyRequestResult {
  success: boolean;
  message?: string;
  data?: {
    journeyId?: string;
    /** Một số phiên bản API trả _id journey thay cho journeyId */
    _id?: string;
    journeyCode?: string | null;
    customerId?: string;
    createdCustomer?: boolean;
    requestTitle?: string;
  };
}