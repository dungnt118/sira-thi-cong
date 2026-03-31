export const FETCH_ALL_SCHEMAS = '[SCHEMAS] FETCH ALL';

export const fetch_all_schemas = () => (dispatch: any) => {
  // Mock fetch
  dispatch({
    type: FETCH_ALL_SCHEMAS,
    payload: []
  });
};
