import { ACCESS_TOKEN, BASE_URL, get, REGCODE } from 'app/services/storeService';
import { ApiResponseCode } from 'types/apis/ApiResponse';
import {
  ICreatePortalJourneyRequestInput,
  ICreatePortalJourneyRequestResult
} from 'types/portal/journeyPortalRequest.types';

const resolvePortalRequestUrl = (): string => {
  const base = get(BASE_URL);

  if (base && typeof base === 'string') {
    try {
      const url = new URL('api/apimodel/post/journey.create_portal_request_async', base);
      const regCode = get(REGCODE);
      if (regCode) {
        url.searchParams.set('regCode', String(regCode));
      }
      return url.toString();
    } catch {
      // fallback below
    }
  }

  return '/api/apimodel/post/journey.create_portal_request_async';
};

const getPortalRequestHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = get(ACCESS_TOKEN);
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  return headers;
};

const getPortalApiMessage = (value: any, fallback: string = 'Không thể gửi yêu cầu dịch vụ'): string => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (value && typeof value.message === 'string' && value.message.trim()) {
    return value.message.trim();
  }

  if (value && typeof value.error === 'string' && value.error.trim()) {
    return value.error.trim();
  }

  return fallback;
};

export const journeyPortalRequestService = {
  async createPortalRequest(input: ICreatePortalJourneyRequestInput): Promise<ICreatePortalJourneyRequestResult> {
    const response = await fetch(resolvePortalRequestUrl(), {
      method: 'POST',
      headers: getPortalRequestHeaders(),
      body: JSON.stringify(input)
    });

    const rawText = await response.text();
    let parsed: any = null;

    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      if (!response.ok) {
        throw new Error(getPortalApiMessage(rawText));
      }
    }

    const normalized = parsed && typeof parsed.response === 'object' ? parsed.response : parsed;
    const normalizedMessage = getPortalApiMessage(normalized, getPortalApiMessage(rawText));

    if (normalized && normalized.code !== undefined && normalized.code !== null) {
      const responseCode = Number(normalized.code);

      if (!Number.isNaN(responseCode) && responseCode !== ApiResponseCode.SUCCESS) {
        throw new Error(normalizedMessage);
      }

      const result = normalized.data as ICreatePortalJourneyRequestResult | undefined;
      if (!result?.success) {
        throw new Error(getPortalApiMessage(result, normalizedMessage));
      }

      return result;
    }

    if (!response.ok) {
      throw new Error(normalizedMessage);
    }

    if (normalized && typeof normalized.success === 'boolean') {
      const result = normalized as ICreatePortalJourneyRequestResult;
      if (!result.success) {
        throw new Error(getPortalApiMessage(result, normalizedMessage));
      }
      return result;
    }

    throw new Error(normalizedMessage || 'Không nhận được phản hồi hợp lệ từ API portal request');
  },
};

export default journeyPortalRequestService;