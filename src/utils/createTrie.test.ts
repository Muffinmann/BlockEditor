import { expect, test } from "vitest";
import createTrie from "./createTrie"; 

test("Should add new input successfully", () => {
  const trie = createTrie()
  const res = trie.add("test")
  expect(res).toStrictEqual({
    t: {
      e: {
        s:{
          t: "test"
        }
      }
    }
  })
})

test("Should search by input correctly", () => {
  const trie = createTrie()
  trie.add('test')
  const res =  trie.search('test')
  expect(res).toStrictEqual(['test'])
})

test("Should be able to return all endpoints", () => {
  const trie = createTrie()
  trie.add('test')
  trie.add('tip')
  const res = trie.search('t')
  expect(res).toStrictEqual(['test', 'tip'])
})

test('Should return empty string if input does not match', () => {
  const trie = createTrie()
  trie.add('test')
  const res = trie.search('tests')
  expect(res).toStrictEqual([])

  const res2 = trie.search("bar")
  expect(res2).toStrictEqual([])
})