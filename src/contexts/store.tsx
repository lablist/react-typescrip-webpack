import React, {FC, createContext, useReducer, ReactNode, useContext, Dispatch, useCallback} from 'react';
import StoreReducer from '../reducers/store'

interface iAction {
  type: string,
  payload?: object | string | string[] | number | number[]
}

interface iStoreContext {
  state: iStoreContextProps;
  dispatch: Dispatch<iAction>;
}

interface iStoreProps {
  children?: ReactNode;
}

interface iStoreContextProps {
  user: {
    id: string,
    token: string,
  },
  error: object,
}

const storeInicial: iStoreContextProps = {
  user: {
    id: "",
    token: "",
  },
  error: {}
}

export const StoreContext = createContext<iStoreContext>({
  state: storeInicial,
  dispatch: (type) => console.error("Dispatched action outside of an StoreProvider", type),
});

export const StoreProvider: FC = ({children}: iStoreProps) => {
  const [state, dispatch] = useReducer(StoreReducer, storeInicial)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
};

export const useStore = () => {
  const store = useContext(StoreContext);

  const setUser = useCallback((user) => store.dispatch({type: 'SET_USER', payload: user}), []);
  const removeUser = useCallback(() => store.dispatch({type: 'REMOVE_USER'}), []);

  return {
    setUser,
    removeUser,
    store: store.state
  };
};
