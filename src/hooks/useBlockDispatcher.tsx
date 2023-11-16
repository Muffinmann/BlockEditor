import { createContext, useState, useContext, PropsWithChildren, Dispatch } from "react";

const BlockUpdateDispatcherContext = createContext<Dispatch<unknown>>(() => { })

export const BlockDispatcherProvider = ({ children, dispatch }: PropsWithChildren<{ dispatch: ReturnType<typeof useState>['1'] }>) => {
  return (
    <BlockUpdateDispatcherContext.Provider value={dispatch}>
      {children}
    </BlockUpdateDispatcherContext.Provider>
  )
}

export const useBlockDispatcher = () => {
  const dispatch = useContext(BlockUpdateDispatcherContext)
  if (!dispatch) {
    throw new Error('useBlockDispatcher Hook has to be called within BlockDispatcherProvider')
  }
  return dispatch
};

