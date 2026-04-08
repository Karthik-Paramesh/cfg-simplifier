import { prodKey } from './parser'

/**
 * Each step returns:
 *   { grammar: Grammar, info: StepInfo }
 *
 * StepInfo varies per step — see individual functions below.
 */

// ─── Step 1: Remove useless symbols ──────────────────────────────────────────

export function removeUseless(g) {
  const { vars, vset, terms, start, prods } = g

  /* 1a. Non-generating variables */
  const generating = new Set([...terms])
  let changed = true
  while (changed) {
    changed = false
    for (const p of prods) {
      if (vset.has(p.lhs) && !generating.has(p.lhs) &&
          p.rhs.every(s => generating.has(s))) {
        generating.add(p.lhs)
        changed = true
      }
    }
  }
  const nonGenerating = vars.filter(v => !generating.has(v))

  /* 1b. Non-reachable variables (after removing non-generating) */
  const reachable = new Set([start])
  changed = true
  while (changed) {
    changed = false
    for (const p of prods) {
      if (reachable.has(p.lhs)) {
        for (const s of p.rhs) {
          if (!reachable.has(s)) { reachable.add(s); changed = true }
        }
      }
    }
  }
  const nonReachable = vars.filter(v => !reachable.has(v) && generating.has(v))

  const useful = s => reachable.has(s) && (generating.has(s) || terms.has(s))

  const newProds = prods.filter(p => useful(p.lhs) && p.rhs.every(s => useful(s)))
  const newVars  = vars.filter(v => useful(v))
  const newTerms = new Set([...terms].filter(t => reachable.has(t)))

  return {
    grammar: { start, vars: newVars, vset: new Set(newVars), terms: newTerms, prods: newProds },
    info: {
      nonGenerating,
      nonReachable,
      removedProds: prods.filter(
        p => !useful(p.lhs) || p.rhs.some(s => !useful(s))
      ),
    },
  }
}

// ─── Step 2: Eliminate null (ε) productions ───────────────────────────────────

export function eliminateNullProds(g) {
  const { vars, vset, terms, start, prods } = g

  /* Compute nullable set */
  const nullable = new Set()
  for (const p of prods) if (p.rhs.length === 0) nullable.add(p.lhs)
  let changed = true
  while (changed) {
    changed = false
    for (const p of prods) {
      if (!nullable.has(p.lhs) && p.rhs.length > 0 &&
          p.rhs.every(s => nullable.has(s))) {
        nullable.add(p.lhs); changed = true
      }
    }
  }

  if (nullable.size === 0) {
    return { grammar: g, info: { nullable: [], addedProds: [], removedProds: [] } }
  }

  const prevKeys = new Set(prods.map(prodKey))
  const seen = new Map()
  const add = (lhs, rhs) => {
    if (rhs.length === 0) return
    const k = prodKey({ lhs, rhs })
    if (!seen.has(k)) seen.set(k, { lhs, rhs })
  }

  for (const p of prods) {
    if (p.rhs.length === 0) continue
    const nullPos = p.rhs
      .map((s, i) => (nullable.has(s) ? i : -1))
      .filter(i => i >= 0)
    const n = nullPos.length

    /* Enumerate every subset of nullable positions to omit */
    for (let mask = 0; mask < (1 << n); mask++) {
      const omit = new Set(nullPos.filter((_, bit) => (mask >> bit) & 1))
      add(p.lhs, p.rhs.filter((_, i) => !omit.has(i)))
    }
  }

  const newProds = [...seen.values()]
  if (nullable.has(start)) newProds.push({ lhs: start, rhs: [] })

  const newKeys = new Set(newProds.map(prodKey))

  return {
    grammar: { start, vars, vset, terms, prods: newProds },
    info: {
      nullable: [...nullable],
      addedProds:   newProds.filter(p => !prevKeys.has(prodKey(p))),
      removedProds: prods.filter(p => !newKeys.has(prodKey(p))),
    },
  }
}

// ─── Step 3: Remove unit productions ─────────────────────────────────────────

export function removeUnitProds(g) {
  const { vars, vset, terms, start, prods } = g

  const isUnit = p => p.rhs.length === 1 && vset.has(p.rhs[0])

  /* Build direct unit adjacency */
  const adj = new Map(vars.map(v => [v, []]))
  for (const p of prods) if (isUnit(p)) adj.get(p.lhs).push(p.rhs[0])

  /* Compute transitive unit pairs (A, B): A can unit-derive B */
  const unitPairs = []
  for (const v of vars) {
    const seen = new Set([v])
    const queue = [v]
    while (queue.length) {
      const cur = queue.shift()
      unitPairs.push([v, cur])
      for (const nx of (adj.get(cur) || [])) {
        if (!seen.has(nx)) { seen.add(nx); queue.push(nx) }
      }
    }
  }

  const prevKeys = new Set(prods.map(prodKey))
  const seen2 = new Map()
  const add = (lhs, rhs) => {
    const k = prodKey({ lhs, rhs })
    if (!seen2.has(k)) seen2.set(k, { lhs, rhs })
  }

  for (const [A, B] of unitPairs) {
    for (const p of prods) {
      if (p.lhs === B && !isUnit(p)) add(A, p.rhs)
    }
  }

  const newProds = [...seen2.values()]
  const newKeys  = new Set(newProds.map(prodKey))

  return {
    grammar: { start, vars, vset, terms, prods: newProds },
    info: {
      unitPairs: unitPairs.filter(([a, b]) => a !== b),
      addedProds:   newProds.filter(p => !prevKeys.has(prodKey(p))),
      removedProds: prods.filter(p => !newKeys.has(prodKey(p))),
    },
  }
}