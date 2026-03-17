import { useState, useEffect } from 'react';
import { localStorageService } from '../services/localstorage/localStorageService';

/**
 * Custom hook to read and write data from LocalStorage reactively.
 * @param key LocalStorage key
 * @param defaultValue Default value if no data exists in LocalStorage
 */
export function useLocalStorageData<T>(key: string, defaultValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorageService.getLocal(key);
            return (item ? item : defaultValue) as T;
        } catch (error) {
            console.error(`Error reading LocalStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            // Save state
            setStoredValue(valueToStore);
            
            // Save to local storage
            localStorageService.saveLocal(key, valueToStore);
        } catch (error) {
            console.error(`Error writing LocalStorage key "${key}":`, error);
        }
    };

    // Optional: Sync between tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                setStoredValue(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue] as const;
}

export default useLocalStorageData;
