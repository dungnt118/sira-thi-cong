// Since there is no global loading state in a specific project-wide redux store,
// we just provide a dummy show/hide actions for backward compatibility with copied code.

export const showLoading = (message?: string) => {
    // console.debug('SHOW_LOADING called but not implemented with global store', message);
    return { type: 'SHOW_LOADING', payload: message };
};

export const hideLoading = () => {
    // console.debug('HIDE_LOADING called but not implemented with global store');
    return { type: 'HIDE_LOADING' };
};
