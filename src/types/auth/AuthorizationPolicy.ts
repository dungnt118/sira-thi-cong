/**
 * Authorization policy identifier used for permission-bypass and role resolution.
 *
 * NOTE: Backend treats this as extensible; keep `string` in the union for forward compatibility.
 */
export type AuthorizationPolicy =
  | 'none'
  | 'user'
  | 'staff'
  | 'customer'
  | 'admin'
  | 'root'
  | 'system'
  | string;
