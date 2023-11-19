import { createContext, useContext, PropsWithChildren, Dispatch } from "react";
import { BlockUpdateAction } from "../types";


const BlockUpdateDispatcherContext = createContext<Dispatch<BlockUpdateAction>>(() => {console.log("Default block dispatcher is not implemented.")})

export const BlockDispatcherProvider = ({ children, dispatch }: PropsWithChildren<{ dispatch: Dispatch<BlockUpdateAction> }>) => {
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

