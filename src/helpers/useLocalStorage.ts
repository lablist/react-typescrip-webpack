import { useEffect, useState, useCallback } from 'react';
import useCustomEvent from './useCustomEvent';

interface IProxyStorage {
  getItem(key: string): string | null;
  setItem(Key: string, value: string): void;
  removeItem(key: string): void;
}

class LocalStorageProxy implements IProxyStorage {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

const storage = new LocalStorageProxy();
const tryParse = (value: string, defaultValue) => {
  if (value === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const useLocalStorage = (key: string, defaultValue) => {
  const [localStorageChange, setLocalStorageChange] = useCustomEvent(
    'onLocalStorageChange',
  );
  const [localState, updateLocalState] = useState(
    tryParse(storage.getItem(key), defaultValue),
  );

  const writeStorage = (key: string, value) => {
    storage.setItem(key, (typeof value === 'string') ? value : JSON.stringify(value));
    setLocalStorageChange({key, value});
  };

  const deleteFromStorage = (key: string) => {
    storage.removeItem(key);
    setLocalStorageChange({key, value: null});
  };

  const onLocalStorageChange = () => {
    if (localStorageChange?.key === key) {
      updateLocalState(localStorageChange.value);
    }
  };

  useEffect(() => {
    onLocalStorageChange();
  }, [key, localStorageChange]);

  const writeState = useCallback(
    (value) => {
      const valueToStore = (typeof value === 'function') ? value(getCurentState()) : value;
      writeStorage(key, valueToStore);
    },
    [key],
  );

  const deleteState = useCallback(() => deleteFromStorage(key), [key]);
  const getCurentState = useCallback(() => {
    return localState;
  }, [key, localState]);
  const curentState = getCurentState();

  return [curentState, writeState, deleteState];
};

export default useLocalStorage;
