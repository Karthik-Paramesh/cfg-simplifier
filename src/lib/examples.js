export const EXAMPLES = [
  // Example 1 — classic nullable + unreachable
  `S -> A B | a
A -> a A | B | eps
B -> b B | eps
C -> c C | d`,

  // Example 2 — unit chain + nullable cascade
  `S -> A B | C
A -> a A | eps
B -> b B | b
C -> A | B
D -> d D | e`,

  // Example 3 — interleaved unit & null
  `S -> A a | B
A -> B | a
B -> b B | eps
C -> c | eps`,
]