export interface NavigationItem {
  id: string;
  title: string;
  type: string;
  icon?: string;
  url?: string;
  children?: NavigationItem[];
}
