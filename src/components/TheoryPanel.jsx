import React, { useState } from 'react'
import styles from './TheoryPanel.module.css'

const SECTIONS = [
  {
    id: 'cfg',
    title: 'What is a CFG?',
    body: `A Context-Free Grammar (CFG) is a formal grammar used in TAFL (Theory of Automata, Formal Languages and Computation) to describe the syntax of programming languages, natural languages, and more.

A CFG G is defined as a 4-tuple G = (V, Σ, R, S) where:
• V — a finite set of variables (non-terminals), e.g. S, A, B
• Σ — a finite set of terminals (actual symbols), e.g. a, b, 0, 1
• R — a finite set of production rules of the form A → α
• S ∈ V — the designated start symbol

A string w is in the language L(G) if S ⟹* w using the production rules.`,
  },
  {
    id: 'why',
    title: 'Why simplify a CFG?',
    body: `Raw CFGs often contain redundant or problematic productions that complicate parsing and proofs. Simplification produces an equivalent grammar — one that generates exactly the same language — but without the noise.

The correct TAFL order of simplification is:
  1. Remove null (ε) productions
  2. Remove unit productions
  3. Remove useless symbols

This order is mandatory because:
• Removing ε-productions first may introduce new unit productions — which step 2 then cleans up
• Removing unit productions may leave behind useless symbols — which step 3 then cleans up
• Doing useless symbol removal first would be premature since steps 1 and 2 change reachability

Simplified grammars are required for converting to Chomsky Normal Form (CNF), Greibach Normal Form (GNF), and for efficient parser construction.`,
  },
  {
    id: 'step1',
    title: 'Step 1 — Eliminate null (ε) productions',
    body: `A variable A is nullable if A ⟹* ε. Productions of the form A → ε are called null productions and must be eliminated (except S → ε if ε ∈ L(G)).

Algorithm:
  1. Find all nullable variables:
     - If A → ε exists, A is nullable
     - If A → B₁B₂...Bₖ and every Bᵢ is nullable, A is nullable
     - Repeat until stable
  2. For each production A → α, add new alternatives by replacing each subset of nullable symbols with their absence
     e.g. A → BC where B and C are nullable adds:
       A → BC | B | C  (the ε case is removed)
  3. Remove all ε-productions
  4. If S was nullable, add S → ε back (since ε ∈ L(G))

Correctness: Every derivation that previously used A → ε is now handled by the new alternatives generated in step 2.`,
  },
  {
    id: 'step2',
    title: 'Step 2 — Remove unit productions',
    body: `A unit production is a rule of the form A → B where B is a single variable. They create unnecessary indirection in derivations and must be removed.

Unit pairs: (A, B) is a unit pair if A ⟹* B using only unit productions. Computed transitively:
  - (A, A) always holds (reflexive)
  - If A → B is a rule, then (A, B) is a unit pair
  - If (A, B) and B → C, then (A, C) is a unit pair

Algorithm:
  1. Compute all unit pairs using BFS/fix-point from each variable
  2. For each unit pair (A, B) and each non-unit production B → α, add A → α
  3. Remove all unit productions A → B

Correctness: Every derivation A ⟹* B ⟹ α is now captured directly by A → α, so the language is preserved.`,
  },
  {
    id: 'step3',
    title: 'Step 3 — Remove useless symbols',
    body: `A symbol X is useless if it is non-generating OR non-reachable. This step is done last because steps 1 and 2 may have already eliminated productions that were making certain variables reachable or generating.

Non-generating: A variable A is generating if A ⟹* w for some terminal string w.

Algorithm:
  1. Mark all terminals as generating
  2. If A → α and every symbol in α is generating, mark A as generating
  3. Repeat until stable; remove all non-generating variables and their productions

Non-reachable: After the above, a variable A is reachable if S ⟹* αAβ for some strings α, β.

Algorithm:
  1. Mark S as reachable
  2. If A is reachable and A → α, mark every variable in α as reachable
  3. Repeat until stable; remove all non-reachable variables

Correctness: Removing useless symbols produces an equivalent grammar because useless symbols contribute nothing to L(G).`,
  },
  {
    id: 'verify',
    title: 'How to verify the output',
    body: `After all three steps, the simplified grammar should satisfy:

✓ No ε-productions — no rule A → ε exists (except S → ε if ε ∈ L(G))
✓ No unit productions — no rule A → B where B is a single variable
✓ No useless symbols — every variable is both generating and reachable from S

Manual check:
1. Check each production — none should be A → ε (except possibly S → ε)
2. Check each production — none should be A → B where B is a single variable
3. Pick any variable and trace derivations — you should always reach terminals
4. Start from S and confirm every variable in the grammar is reachable

The simplified grammar generates exactly the same language as the original.`,
  },
]

export default function TheoryPanel() {
  const [open, setOpen] = useState(new Set(['cfg']))

  function toggle(id) {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function expandAll()   { setOpen(new Set(SECTIONS.map(s => s.id))) }
  function collapseAll() { setOpen(new Set()) }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>TAFL Theory Reference</span>
        <div className={styles.panelControls}>
          <button className={styles.ctrl} onClick={expandAll}>Expand all</button>
          <span className={styles.ctrlSep}>·</span>
          <button className={styles.ctrl} onClick={collapseAll}>Collapse all</button>
        </div>
      </div>

      {SECTIONS.map(sec => (
        <div key={sec.id} className={styles.section}>
          <button
            className={styles.sectionHead}
            onClick={() => toggle(sec.id)}
            aria-expanded={open.has(sec.id)}
          >
            <span className={styles.sectionTitle}>{sec.title}</span>
            <span className={styles.chevron}>{open.has(sec.id) ? '▲' : '▼'}</span>
          </button>
          {open.has(sec.id) && (
            <div className={styles.sectionBody}>
              {sec.body.split('\n').map((line, i) =>
                line.trim() === ''
                  ? <div key={i} className={styles.spacer} />
                  : <p key={i} className={styles.line}>{line}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}