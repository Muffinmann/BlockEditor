import { createContext, useState, useContext, PropsWithChildren, Dispatch } from "react";
import { BlockNode } from "../types";

type BlockUpdateAction = {
  type: 'remove',
  payload: string,
} | {
  type: 'add',
  payload: {
    path: string,
    blockType: string,
  }
} | {
  type: 'updateValue',
  payload: {
    path: string,
    nextValue: string,
  }
} | {
  type: 'updateNode',
  payload: {
    path: string,
    callback: (n: BlockNode) => BlockNode
  }
}

const BlockUpdateDispatcherContext = createContext<Dispatch<BlockUpdateAction>>(() => { })

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

