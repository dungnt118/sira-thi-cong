/**
 * File này xử lý biến môi trường từ nhiều nguồn và cung cấp:
 * 1. Tương thích giữa process.env (CRA) và import.meta.env (Vite)
 * 2. Đối tượng cấu hình toàn cục cho ứng dụng
 */


import { BASE_URL, CLIENTS, EXPORT_EXCEL_ENDPOINT, FILE_PREVIEW_URL, GRAPHQL_ENDPOINT, SUBSCRIPTION_ENDPOINT, TOKEN_ENDPOINT, UPLOAD_URL } from "app/services/storeService";
export interface OAuthClientConfig {
  client_id: string;
  client_secret: string;
  scope: string;
  title?: string;
}


// NOTE: Không import từ storeService ở đây để tránh vòng lặp (storeService -> config -> storeService).

// console.log("========== CONFIG.JS LOADING ==========");

// ------------------------------ PHẦN XỬ LÝ BIẾN MÔI TRƯỜNG ------------------------------

// Tạo processEnv từ import.meta.env và window.env
const processEnv: Record<string, any> = {};

// Đọc window.env từ env.js public
let windowEnv: Record<string, any> = {};
try {
  if (typeof window !== 'undefined') {
    windowEnv = (window as any).env || {};
    // console.log("window.env từ public/env.js:", windowEnv);

    // Chuyển đổi các khóa từ window.env vào processEnv
    Object.keys(windowEnv).forEach(key => {
      // Giữ nguyên key gốc để các code cũ vẫn hoạt động
      processEnv[key] = windowEnv[key];
    });
  }
} catch (error) {
  console.error("Lỗi khi xử lý window.env:", error);
}

// Đọc import.meta.env từ Vite
let viteEnv: Record<string, any> = {};
try {
  viteEnv = import.meta.env || {};
  // console.log("import.meta.env từ Vite:", viteEnv);

  // Xử lý import.meta.env từ Vite
  for (const key in viteEnv) {
    if (key.startsWith('VITE_')) {
      // Chuyển VITE_REACT_APP_ thành REACT_APP_ nếu cần
      const newKey = key.replace(/^VITE_/, '');
      processEnv[newKey] = viteEnv[key];
    } else {
      processEnv[key] = viteEnv[key];
    }
  }
} catch (error) {
  console.error("Lỗi khi xử lý import.meta.env:", error);
}

// Đảm bảo NODE_ENV luôn có sẵn
try {
  processEnv.NODE_ENV = viteEnv.MODE === 'production' ? 'production' : 'development';
} catch (error) {
  processEnv.NODE_ENV = 'development'; // Giá trị mặc định
  console.error("Lỗi khi thiết lập NODE_ENV:", error);
}

// ------------------------------ PHẦN TẠO CẤU HÌNH ------------------------------

// Định nghĩa domain cơ sở - chỉ cần thay đổi giá trị này một lần
const getBaseUrl = (): string => windowEnv.base_url || viteEnv.VITE_BASE_URL || 'http://localhost:3000';
const getBaseChatUrl = (): string => windowEnv.chatDomain || viteEnv.VITE_CHAT_DOMAIN || 'chat.vn';

// Tạo URL dựa trên domain
const normalizeUrl = (baseUrl: string, path: string = '', protocol: string = 'https'): string => {
  const rawBase = (baseUrl || '').trim();
  const rawPath = (path || '').trim();

  if (!rawBase) {
    return rawPath ? `${protocol}://${rawPath.replace(/^\/+/, '')}` : '';
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawBase);
  const baseWithoutProtocolRelative = rawBase.replace(/^\/\//, '');
  const base = hasScheme ? rawBase : `${protocol}://${baseWithoutProtocolRelative}`;

  if (!rawPath) {
    return base.replace(/\/+$/, '');
  }

  const baseNoTrailing = base.replace(/\/+$/, '');
  const pathNoLeading = rawPath.replace(/^\/+/, '');
  return `${baseNoTrailing}/${pathNoLeading}`;
};

// Tạo WebSocket URL
const normalizeWsUrl = (baseUrl: string, path: string = ''): string => {
  const rawBase = (baseUrl || '').trim();
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//.exec(rawBase);
  if (match) {
    const scheme = match[1].toLowerCase();
    const wsScheme = scheme === 'https' ? 'wss' : scheme === 'http' ? 'ws' : (scheme === 'wss' || scheme === 'ws') ? scheme : 'wss';
    const rest = rawBase.slice(match[0].length);
    return normalizeUrl(`${wsScheme}://${rest}`, path, wsScheme);
  }

  return normalizeUrl(rawBase, path, 'wss');
};

interface OidcProviderConfig {
  clientId: string;
  provider: string;
}

const parseClients = (raw: unknown): OAuthClientConfig[] => {
  const normalize = (list: unknown[]): OAuthClientConfig[] =>
    list
      .filter((v) => v && typeof v === 'object')
      .map((v) => v as Partial<OAuthClientConfig> & Record<string, unknown>)
      .map((v) => ({
        client_id: String((v as any).client_id ?? '').trim(),
        client_secret: String((v as any).client_secret ?? '').trim(),
        scope: String((v as any).scope ?? '').trim(),
        title: typeof (v as any).title === 'string' ? String((v as any).title).trim() : undefined,
      }))
      .filter((v) => v.client_id.length > 0 && v.client_secret.length > 0 && v.scope.length > 0);

  if (Array.isArray(raw)) {
    return normalize(raw);
  }

  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      return Array.isArray(parsed) ? normalize(parsed) : [];
    } catch {
      return [];
    }
  }

  return [];
};

// Interface cho config object
interface AppConfig {
  base_url: string;
  chatDomain: string;
  auth_url: string;
  oidc_providers?: OidcProviderConfig[];
  clients?: OAuthClientConfig[];
  graphql_endpoint: string;
  subscription_endpoint: string;
  admin_graphql_endpoint: string;
  upload_url: string;
  file_preview_url: string;
  token_endpoint: string;
  export_excel_endpoint: string;
  PublicVapidKey: string;
  chat_endpoint: string;
  upload_file_capacity: number;
  cloud_enable: boolean;
  cloud_url: string;
}

// Các key sẽ được seed từ appconfig vào localStorage khi app refresh.
// Mặc định để rỗng để bạn tự điền theo nhu cầu.
export const seed_keys: string[] = [BASE_URL, TOKEN_ENDPOINT, CLIENTS, UPLOAD_URL, FILE_PREVIEW_URL,
  GRAPHQL_ENDPOINT, EXPORT_EXCEL_ENDPOINT, SUBSCRIPTION_ENDPOINT];

// Tạo config với các giá trị được sinh từ domain cơ sở
const config: AppConfig = {
  // Các giá trị domain cơ sở
  base_url: getBaseUrl(),
  chatDomain: getBaseChatUrl(),

  // Backend auth (SSO login_code flow)
  // Lưu ý: `auth_url` là full URL (có thể gồm http/https), đọc trực tiếp từ env.
  auth_url: windowEnv.auth_url || viteEnv.VITE_AUTH_URL || windowEnv.base_url || viteEnv.VITE_BASE_URL || '',
  oidc_providers: windowEnv.oidc_providers || viteEnv.VITE_OIDC_PROVIDERS || '',
  clients: parseClients(windowEnv.clients ?? viteEnv.VITE_CLIENTS ?? ''),

  // API GraphQL và đường dẫn
  graphql_endpoint: windowEnv.graphql_endpoint || viteEnv.VITE_GRAPHQL_ENDPOINT || normalizeUrl(getBaseUrl(), 'graphql'),
  subscription_endpoint: windowEnv.subscription_endpoint || viteEnv.VITE_WS_HOST || normalizeWsUrl(getBaseUrl(), 'ws/graphql'),
  admin_graphql_endpoint: windowEnv.admin_graphql_endpoint || viteEnv.VITE_ADMIN_API || normalizeUrl(getBaseUrl(), 'headless/graphql'),
  // Upload và File URLs
  upload_url: windowEnv.upload_url || viteEnv.VITE_UPLOAD_URL || normalizeUrl(getBaseUrl(), 'api/file/upload'),
  file_preview_url: windowEnv.file_preview_url || viteEnv.VITE_FILE_PREVIEW_URL || normalizeUrl(getBaseUrl(), 'api/file/preview'),

  // Identity và Authentication
  token_endpoint: windowEnv.token_endpoint || viteEnv.VITE_API_LOGIN || normalizeUrl(getBaseUrl(), 'identity/connect/token'),
  export_excel_endpoint: windowEnv.export_excel_endpoint || viteEnv.VITE_EXPORT_EXCEL_ENDPOINT || normalizeUrl(getBaseUrl(), 'headless'),
  // VAPID key
  PublicVapidKey: windowEnv.PublicVapidKey || viteEnv.VITE_PUBLIC_VAPID_KEY || "BKi3dJK8IiwbY2QqFZDJ7hOA5Yus7PpkS7kVNH0zvMBQ_h51soB1OLCYu108W7530hXoU8Lp-g8BmkwZUMvar-Y",

  // Chat settings
  chat_endpoint: windowEnv.chat_endpoint || viteEnv.VITE_CHAT_ENDPOINT || normalizeUrl(getBaseChatUrl(), 'api/v1'),

  // Misc settings
  upload_file_capacity: windowEnv.upload_file_capacity || viteEnv.VITE_UPLOAD_FILE_CAPACITY || 15,
  cloud_enable: windowEnv.cloud_enable || (viteEnv.VITE_CLOUD_ENABLE === "true" ? true : false),
  cloud_url: windowEnv.cloud_url || viteEnv.VITE_CLOUD_URL || normalizeUrl(getBaseUrl(), 'tenant-manager/api')
};
console.log("appconfig:", config);
// ------------------------------ PHẦN BOOTSTRAP (SEED) ------------------------------

// Seed một số key cấu hình từ appconfig sang localStorage nếu localStorage đang thiếu/invalid.
// Quy tắc: localStorage là runtime override, nhưng không nên giữ giá trị rác.
try {
  const isDevLike = processEnv.NODE_ENV !== 'production';
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (isDevLike) {
      console.log('[seed] start', { seed_keys });
    }

    if (seed_keys.length === 0) {
      if (isDevLike) {
        console.log('[seed] skipped (seed_keys empty)');
      }
      // không làm gì thêm
    } else {
      let seededCount = 0;
      let skippedCount = 0;

      for (const key of seed_keys) {
        const value = (config as any)[key];
        if (value == null) {
          skippedCount++;
          continue;
        }

        if (typeof value === 'string') {
          if (value.trim() === '') continue;
          localStorage.setItem(key, value);
          seededCount++;
          continue;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
          localStorage.setItem(key, String(value));
          seededCount++;
          continue;
        }

        try {
          localStorage.setItem(key, JSON.stringify(value));
          seededCount++;
        } catch {
          // nếu không stringify được thì bỏ qua
          skippedCount++;
        }
      }

      if (isDevLike) {
        console.log('[seed] done', { seededCount, skippedCount });
      }
    }
  } else {
    console.log('[seed] skipped (localStorage not available)');
  }
} catch (error) {
  console.error('Lỗi khi seed localStorage từ appconfig:', error);
}

// Thiết lập process.env cho CRA compatibility
try {
  if (typeof window !== 'undefined') {
    if (typeof (window as any).process === 'undefined') {
      (window as any).process = { env: processEnv };
      console.log("window.process.env được tạo mới:", (window as any).process.env);
    } else if (!(window as any).process.env) {
      (window as any).process.env = processEnv;
      console.log("process.env được tạo mới:", (window as any).process.env);
    } else {
      // Gộp với process.env hiện có
      (window as any).process.env = { ...(window as any).process.env, ...processEnv };
      // console.log("process.env được cập nhật:", process.env);
    }
  }
} catch (error) {
  console.error("Lỗi khi thiết lập process.env:", error);
}
console.log("test get graphql_endpoint:", localStorage.getItem(GRAPHQL_ENDPOINT));
console.log("======================================");

// Xuất cả config và processEnv để sử dụng ở những nơi khác
export { processEnv };
export default config;
