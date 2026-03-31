export interface UserSessionContext {
  user: {
    _id: string;
    username: string;
    userName?: string;
    avatar?: string;
    email?: string;
    isActive?: boolean;
    roles?: string[];
  };
  tenants?: Array<{
    _id: string;
    name: string;
    code: string;
  }>;
  welcome_url?: string;
  favourist_menus?: any[];
  menuGraph?: any[];
  settings?: Record<string, any>;
  shortcuts?: string[];
}
