export const SET_FAVORITE_MENUS = '[NAVIGATION] SET FAVORITE MENUS';
export const SET_FAVORITE_MENUS_FORM = '[NAVIGATION] SET FAVORITE MENUS FORM';
export const SET_NAVIGATION = '[NAVIGATION] SET NAVIGATION';
export const SET_NAVIGATION_LIST = '[NAVIGATION] SET NAVIGATION LIST';

export const setFavoriteMenus = (menus: any) => ({
  type: SET_FAVORITE_MENUS,
  payload: menus
});

export const setFavoriteMenusForm = (menus: any) => ({
  type: SET_FAVORITE_MENUS_FORM,
  payload: menus
});

export const setNavigation = (navigation: any) => ({
  type: SET_NAVIGATION,
  payload: navigation
});

export const setNavigationList = (navigation: any) => ({
  type: SET_NAVIGATION_LIST,
  payload: navigation
});
