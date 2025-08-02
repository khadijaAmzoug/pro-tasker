import { useState, useEffect } from "react";

/**
 * useLocalStorage
 * Stores and updates a value in localStorage
 */
export default function useLocalStorage(key, initialValue) {
  // Initialize the state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error("Error reading localStorage key:", key, err);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error("Error writing to localStorage key:", key, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
