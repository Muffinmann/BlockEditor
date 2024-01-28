type Trie = {
  [k in string]: string | Trie
}

const createTrie = () => {
  const trie: Trie = {}
  return {
    add(input: string){
      let current = trie
      for (let i = 0; i < input.length; i++) {
        const char = input[i] 
        if (char in current) {
          current = current[char] as Trie
        } else if (i < input.length - 1) {
          current[char] = {}
          current = current[char] as Trie
        } else {
          current[char] = input
        }
      }
      return trie;
    },
    search(input: string) {
      let target: Trie | string = trie
      for (let i = 0; i < input.length; i++) {
        const char = input[i]
        if (typeof target === 'string') {
          if (i === target.length - 1) {
            return [target]
          }
          return []
        }
        if (char in target) {
          target = target[char]
        } else {
          return []
        }
      }
      if (typeof target === 'string') {
        return [target]
      }

      const recursiveSearch = (t: Trie | string): string | string[] => {
        if (typeof t === 'string') {
          return [t]
        }
        if (typeof t === 'object' && t !== null) {
          return Object.values(t).flatMap(recursiveSearch) 
        }
        return [];
      };

      if (typeof target === 'object' && target !== null) {
        return recursiveSearch(target) 
      }
      return []
    }
  }
}

export default createTrie;