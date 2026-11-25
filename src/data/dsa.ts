import type { DsaProblem } from '../types'

type Seed = {
  name: string
  topic: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  slug: string
}

const seeds: Seed[] = [
  { name: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', slug: 'two-sum' },
  { name: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', slug: 'best-time-to-buy-and-sell-stock' },
  { name: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', slug: 'product-of-array-except-self' },
  { name: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', slug: 'maximum-subarray' },
  { name: 'Contains Duplicate', topic: 'Sets', difficulty: 'Easy', slug: 'contains-duplicate' },
  { name: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', slug: 'valid-anagram' },
  { name: 'Valid Palindrome', topic: 'Strings', difficulty: 'Easy', slug: 'valid-palindrome' },
  { name: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', slug: 'longest-substring-without-repeating-characters' },
  { name: 'Group Anagrams', topic: 'Hash Maps', difficulty: 'Medium', slug: 'group-anagrams' },
  { name: 'Top K Frequent Elements', topic: 'Hash Maps', difficulty: 'Medium', slug: 'top-k-frequent-elements' },
  { name: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', slug: '3sum' },
  { name: 'Container With Most Water', topic: 'Two Pointers', difficulty: 'Medium', slug: 'container-with-most-water' },
  { name: 'Longest Repeating Character Replacement', topic: 'Sliding Window', difficulty: 'Medium', slug: 'longest-repeating-character-replacement' },
  { name: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', slug: 'valid-parentheses' },
  { name: 'Min Stack', topic: 'Stack', difficulty: 'Medium', slug: 'min-stack' },
  { name: 'Implement Queue using Stacks', topic: 'Queue', difficulty: 'Easy', slug: 'implement-queue-using-stacks' },
  { name: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', slug: 'binary-search' },
  { name: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', slug: 'search-in-rotated-sorted-array' },
  { name: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', slug: 'climbing-stairs' },
  { name: 'Subsets', topic: 'Recursion', difficulty: 'Medium', slug: 'subsets' },
  { name: 'Permutations', topic: 'Recursion', difficulty: 'Medium', slug: 'permutations' },
  { name: 'Merge Intervals', topic: 'Arrays', difficulty: 'Medium', slug: 'merge-intervals' },
  { name: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', slug: 'maximum-depth-of-binary-tree' },
  { name: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', slug: 'binary-tree-level-order-traversal' },
  { name: 'Number of Islands', topic: 'Basic Graphs', difficulty: 'Medium', slug: 'number-of-islands' },
  { name: 'Course Schedule', topic: 'Basic Graphs', difficulty: 'Medium', slug: 'course-schedule' },
  { name: 'Word Break', topic: 'Dynamic Programming', difficulty: 'Medium', slug: 'word-break' },
  { name: 'Kth Largest Element in an Array', topic: 'Arrays', difficulty: 'Medium', slug: 'kth-largest-element-in-an-array' },
  { name: 'LRU Cache', topic: 'Hash Maps', difficulty: 'Medium', slug: 'lru-cache' },
  { name: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', slug: 'merge-two-sorted-lists' },
  { name: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', slug: 'reverse-linked-list' },
]

export const dsaTopics = [
  'Arrays',
  'Strings',
  'Hash Maps',
  'Sets',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Binary Search',
  'Recursion',
  'Trees',
  'Basic Graphs',
  'Linked List',
  'Dynamic Programming',
]

export const seedDsa = (): DsaProblem[] =>
  seeds.map((s, i) => ({
    id: `dsa-${i + 1}`,
    name: s.name,
    topic: s.topic,
    difficulty: s.difficulty,
    platform: 'LeetCode',
    link: `https://leetcode.com/problems/${s.slug}/`,
    dateAttempted: '',
    status: 'Not Started',
    timeTaken: '',
    notes: '',
    solutionLink: '',
  }))
