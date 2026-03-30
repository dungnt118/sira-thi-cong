/**
 * Một đối tượng history đơn giản để thay thế @history (Fuse template).
 * Sử dụng browser history API để đảm bảo tương thích với cả component và logic JS thuần.
 */
const history = {
    get location() {
        return window.location;
    },
    push(path: string) {
        // Nếu là relative path, ta có thể prepend origin nếu cần, nhưng browser handle được
        window.history.pushState({}, '', path);
        // Dispatch sự kiện popstate để các listener (nếu có) biết đã thay đổi URL
        window.dispatchEvent(new PopStateEvent('popstate'));
    },
    replace(path: string) {
        window.history.replaceState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    },
    listen(listener: (location: Location) => void) {
        const handler = () => listener(window.location);
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }
};

export default history;
