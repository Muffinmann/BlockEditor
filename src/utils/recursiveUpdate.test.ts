import { test, expect, describe } from 'vitest';
import recursiveUpdate, { buildBlockNodePath } from "./recursiveUpdate";
import { BlockNode } from '../types';


const testVar: BlockNode = {
  id: '1',
  type: "Var",
  children: ["test"]
}
const testCategory: BlockNode = {
  id: '2',
  type: "Category",
  name: "Cat 1",
  children: [
    testVar
  ]
}

describe('build block node path', () => {
  test('return empty array when input is null', () => {
    expect(buildBlockNodePath(null, '')).toStrictEqual([null])
  })
  test('return root node path when path is emplty', () => {
    expect(buildBlockNodePath(testCategory, '')).toStrictEqual([testCategory])
  })
  test('return node path without root', () => {
    expect(buildBlockNodePath(testCategory, 'children.0')).toStrictEqual([[testVar], testVar])
  })
  test('return node path with root', () => {
    expect(buildBlockNodePath(testCategory, 'root.children.0')).toStrictEqual([testCategory, [testVar], testVar])
  })
  test('return latest node path when path is incomplete (ends with ".")', () => {
    expect(buildBlockNodePath(testCategory, 'children.')).toStrictEqual([[testVar]])
  })
})

describe('recursive update object', () => {
  test("recursive update", () => {
    expect(recursiveUpdate(testCategory, 'children.0.children.0'.split('.'), () => "updated")).toStrictEqual({
      type: "Category",
      name: "Cat 1",
      children: [
        {
          type: "Var",
          children: ["updated"]
        }
      ]
    })
  })
})


