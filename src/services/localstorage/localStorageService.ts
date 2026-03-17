/**
 * Generic LocalStorage Service
 * Handles basic CRUD operations for localStorage with JSON serialization.
 */

export const localStorageService = {
    /**
     * Save data to localStorage
     */
    saveLocal<T>(key: string, data: T): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
        } catch (error) {
            console.error(`Error saving to localStorage [${key}]:`, error);
        }
    },

    /**
     * Retrieve data from localStorage
     */
    getLocal<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error reading from localStorage [${key}]:`, error);
            return null;
        }
    },

    /**
     * Remove a specific key from localStorage
     */
    removeLocal(key: string): void {
        localStorage.removeItem(key);
    },

    /**
     * Clear all items from localStorage
     */
    clearAllLocal(): void {
        localStorage.clear();
    },

    /**
     * Get all keys currently in localStorage
     */
    getAllKeys(): string[] {
        return Object.keys(localStorage);
    }
};

export default localStorageService;
