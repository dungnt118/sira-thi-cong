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

const tryParsePortalJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const decodeBackendEscapes = (value: string): string => {
  if (!value.trim()) {
    return value;
  }

  return value
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .trim();
};

const unwrapPortalPayload = (value: unknown): any => {
  let current = tryParsePortalJson(value);

  for (let index = 0; index < 3; index += 1) {
    if (typeof current === 'string') {
      const reparsed = tryParsePortalJson(current);
      if (reparsed === current) {
        return current;
      }
      current = reparsed;
      continue;
    }

    if (current && typeof current === 'object' && 'response' in current) {
      current = tryParsePortalJson((current as { response?: unknown }).response);
      continue;
    }

    return current;
  }

  return current;
};

const getPortalApiMessage = (value: any, fallback: string = 'Không thể gửi yêu cầu dịch vụ'): string => {
  const normalized = unwrapPortalPayload(value);
  const candidates = [
    normalized,
    normalized?.message,
    normalized?.error,
    normalized?.data?.message,
    normalized?.response?.message,
    value,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      const reparsed = tryParsePortalJson(candidate);
      if (reparsed && reparsed !== candidate) {
        const nestedMessage = getPortalApiMessage(reparsed, '');
        if (nestedMessage) {
          return nestedMessage;
        }
      }

      return decodeBackendEscapes(candidate);
    }
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
    const normalized = unwrapPortalPayload(rawText);
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