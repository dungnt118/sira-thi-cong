/// - Nguồn sự thật cho cấu hình: appconfig (bootstrap từ window.env trong public/env.js)
/// - Runtime override: localStorage

const appconfig = (window as any).env || {};

export const ADMIN_GRAPHQL_ENDPOINT = "admin_graphql_endpoint";
export const UPLOAD_URL = "upload_url";
export const FILE_PREVIEW_URL = "file_preview_url";
export const CLIENTS = "clients";
export const LOGO_KEY = "logo";
export const ISSUER = "issuer";
export const REDIRECT_URI = "redirect_uri";
export const AUTH_FLOW = "auth_flow";
export const ID_TOKEN = "id_token";
export const PublicVapidKey = "PublicVapidKey";
export const CLOUD_ENABLE = "cloud_enable";
export const CLOUD_URL = "cloud_url";
export const EXPORT_EXCEL_ENDPOINT = "export_excel_endpoint";
export const TENANT_LABEL = "tenantLabel";
export const TENANT_KEY = "tenantId";
export const AUTHENTICATION_MODE = "authMode";
export const REGCODE = "regcode";
export const REGISTRATION_ID = "registrationId";
export const UPLOAD_FILE_CAPACITY = "upload_file_capacity";
export const CHAT_ENDPOINT = "chat_endpoint";
export const GRAPHQL_ENDPOINT = "graphql_endpoint";
export const BASE_URL="base_url";
export const TOKEN_ENDPOINT = "token_endpoint";
export const SUBSCRIPTION_ENDPOINT = "subscription_endpoint";
export const ACCESS_TOKEN = "access_token";
export const AUDIENCE = "audience";
export const CLOUD_PREVIEW_URL = "cloud_preview_url";
export const AUTHORIZATION_ENDPOINT = "auth_url";
export const OIDC_PROVIDERS = "oidc_providers";
export const ENABLE_TENANT_SWITCHER = "enable_tenant_switcher";
export const FEDERATE_SUBSCRIBE_HOST = "federate_subscribe_host";
export const IS_FEDERATE_SUBSCRIBE = "is_federate_subscribe";
export const FOLD_MENU = "fold_menu";
const localStoreKeys = [ACCESS_TOKEN, AUTH_FLOW, ID_TOKEN];

function coerceFromLocalStorage(raw: string, appValue: any): any {
    if (appValue == null) {
        return raw;
    }

    if (typeof appValue === 'boolean') {
        const lower = raw.trim().toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
        return Boolean(raw);
    }

    if (typeof appValue === 'number') {
        const asNumber = Number(raw);
        return Number.isFinite(asNumber) ? asNumber : raw;
    }

    if (typeof appValue === 'object') {
        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }

    return raw;
}

export function get(key: string, defaultValue?: any): any {
    if (localStoreKeys.includes(key)) {
        const stored = localStorage.getItem(key);
        if (stored == null || stored === 'undefined') {
            return defaultValue;
        }
        return stored;
    }

    const stored = localStorage.getItem(key);
    const appValue = (appconfig as any)?.[key];

    if (stored == null || stored === 'undefined' || stored.trim() === '') {
        return (appValue ?? defaultValue);
    }

    return (coerceFromLocalStorage(stored, appValue) ?? appValue ?? defaultValue);
}

export function set(key: string, value: any): void {
    if (value == null || value == undefined) {        
        localStorage.removeItem(key);
    } else {
        if (typeof value === 'string') {
            localStorage.setItem(key, value);
            return;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            localStorage.setItem(key, String(value));
            return;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            localStorage.setItem(key, String(value));
        }
    }
}

///hỗ trợ trả về link file preview chuẩn
export function getFileLink(fileId: string | null | undefined, defaultImage?: string): string | undefined {
    if (typeof fileId !== "string") {
        return defaultImage;
    }

    if (!fileId || fileId.startsWith("http") || fileId.startsWith("data:image")) {
        return fileId;
    }
    
    let baseUrl = get(FILE_PREVIEW_URL) as string | undefined;
    if (baseUrl && !baseUrl.endsWith("?load=")) {
        baseUrl += "?load=";
    }
    
    // Encode fileId và regCode để xử lý các ký tự đặc biệt trong đường dẫn (vd: data/image.png)
    const encodedFileId = encodeURIComponent(fileId);
    const regCode = (get(REGCODE) as string) || '';
    const encodedRegCode = regCode ? encodeURIComponent(regCode) : '';
    
    return `${baseUrl ?? ''}${encodedFileId}&regCode=${encodedRegCode}`;
}

/// Alias cho getFileLink để đồng bộ với cách gọi ở các module exts
export const getFileUrl = getFileLink;

export function get_auth_type(): string {
    const authType = (appconfig as any)?.auth_type;
    return authType ? String(authType) : 'oauth2';
}

export function GET_USER_SESSION_INFO_QUERY(): string {
    const authMe = (appconfig as any)?.auth_me;
    if (authMe) {
        return `mutation ($tenantId:String){
            response: ${authMe} (tenantId: $tenantId ) {
                code
                message
                data
            }
          }`;
    } else {
        return `query ($tenantId:String){
            response: get_user_session_info (tenantId: $tenantId ) {
                code
                message
                data
            }
          }`;
    }
} 