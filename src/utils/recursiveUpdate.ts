import { BlockNode } from "../types";

export const buildBlockNodePath = (obj: BlockNode | BlockNode[], path: string, nodePath: (BlockNode | BlockNode[])[] = []): (BlockNode | BlockNode[])[] => {
  if (path === '' || obj === null) {
    return [obj]
  }

  const segEnd = path.indexOf('.')

  if (segEnd > -1) {
    const currentSeg = path.slice(0, segEnd)

    // if 'root' is used in the path, the root object in included in the path
    if (currentSeg === 'root') {
      return buildBlockNodePath(obj, path.slice(segEnd + 1), [obj])
    }

    const currentNode = obj[currentSeg as keyof typeof obj]
    return buildBlockNodePath(currentNode, path.slice(segEnd + 1), [...nodePath, currentNode])
  }

  // the last segment in path
  if (path.length) {
    return [...nodePath, obj[path as keyof typeof obj]]
  }


  // incomplete path like 'children.' or '0.' returns the lastest complete node path
  return nodePath
}

const recursiveUpdate = (obj: BlockNode | BlockNode[], path: string[], onReachTarget: (t: BlockNode | BlockNode[]) => BlockNode | BlockNode[] | null): null | BlockNode | BlockNode[] | BlockNode[keyof BlockNode] => {
  if (!path) {
    console.error("Expected 'path' argument to be type 'string[]', got 'undefined'.")
    return obj;
  }

  if (!path.length) {
    return onReachTarget(obj)
  }

  const currentSeg = path.shift()

  if (currentSeg === undefined) {
    console.error("Path segment is undefined")
    return obj
  }

  if (currentSeg === 'root') {
    return recursiveUpdate(obj, path, onReachTarget)
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    // If obj is an array, update it without converting to an object
    const updatedArray = obj.map((o, index) => {
      const i = parseInt(currentSeg, 10)
      if (index === i) {
        return recursiveUpdate(obj[i], path, onReachTarget)
      }
      return o
    })

    // return updatedArray.filter(Boolean) as BlockNode[];
    return updatedArray as BlockNode[];
  }


  return {
    ...obj,
    [currentSeg]: recursiveUpdate(obj[currentSeg as keyof BlockNode], path, onReachTarget)
  } as BlockNode;

}

export default recursiveUpdate;