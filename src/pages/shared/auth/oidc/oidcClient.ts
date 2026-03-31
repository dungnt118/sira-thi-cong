export type OidcDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
};

export type PkcePair = {
  verifier: string;
  challenge: string;
  method: 'S256' | 'plain';
};

export type OidcTxn = {
  state: string;
  code_verifier: string;
  code_challenge_method: 'S256' | 'plain';
  createdAt: number;
  redirect?: string;
};

export const OIDC_TXN_STORAGE_KEY = 'oidc:txn';
export const OIDC_TXN_TTL_MS = 10 * 60 * 1000;

const base64UrlEncode = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const randomBytes = (length: number): Uint8Array => {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
};

export const generateState = (): string => base64UrlEncode(randomBytes(32));

const generateVerifier = (): string => {
  // RFC 7636: 43-128 chars. Dùng 64 bytes -> base64url ~ 86 chars.
  return base64UrlEncode(randomBytes(64));
};

const sha256 = async (value: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest);
};

export const generatePkcePair = async (): Promise<PkcePair> => {
  const verifier = generateVerifier();

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashed = await sha256(verifier);
    return { verifier, challenge: base64UrlEncode(hashed), method: 'S256' };
  }

  // Fallback cho môi trường không có WebCrypto
  return { verifier, challenge: verifier, method: 'plain' };
};

export const writeTxn = (txn: OidcTxn): void => {
  sessionStorage.setItem(OIDC_TXN_STORAGE_KEY, JSON.stringify(txn));
};

export const readTxn = (): OidcTxn | null => {
  try {
    const raw = sessionStorage.getItem(OIDC_TXN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OidcTxn;
    if (!parsed?.state || !parsed?.code_verifier || !parsed?.createdAt) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearTxn = (): void => {
  sessionStorage.removeItem(OIDC_TXN_STORAGE_KEY);
};

const isDiscoveryUrl = (value: string): boolean => value.includes('/.well-known/openid-configuration');

export const buildDiscoveryUrl = (issuerOrDiscovery: string): string => {
  if (isDiscoveryUrl(issuerOrDiscovery)) return issuerOrDiscovery;
  return issuerOrDiscovery.replace(/\/+$/, '') + '/.well-known/openid-configuration';
};

export const fetchDiscovery = async (issuerOrDiscovery: string): Promise<OidcDiscovery> => {
  const url = buildDiscoveryUrl(issuerOrDiscovery);
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Discovery failed (${res.status})`);
  }
  const json = (await res.json()) as Partial<OidcDiscovery>;
  if (!json.authorization_endpoint || !json.token_endpoint) {
    throw new Error('Discovery response thiếu authorization_endpoint/token_endpoint');
  }
  return {
    authorization_endpoint: json.authorization_endpoint,
    token_endpoint: json.token_endpoint,
    end_session_endpoint: json.end_session_endpoint,
  };
};

export const buildEndSessionUrl = (
  endSessionEndpoint: string,
  params: Record<string, string>,
): string => buildAuthorizeUrl(endSessionEndpoint, params);

export const buildAuthorizeUrl = (
  authorizationEndpoint: string,
  params: Record<string, string>,
): string => {
  const url = new URL(authorizationEndpoint);
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
};

export const exchangeCode = async (
  tokenEndpoint: string,
  params: Record<string, string>,
): Promise<any> => {
  const body = new URLSearchParams(params);
  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    body,
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    throw new Error(`Token exchange failed (${res.status}): ${message}`);
  }
  return payload;
};
