import { useState, useEffect } from 'react';

/**
 * You can use the useDeferredValue react when available.
 * https://reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue
 */

export default function useDebounce(value, delay=750) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(() => {
        const resValue = (value).constructor === Function ? value() : value;
        return resValue;
      });
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}
