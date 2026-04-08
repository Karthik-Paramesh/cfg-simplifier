/**
 * parse(text) → Grammar
 *
 * Grammar = {
 *   start: string,
 *   vars:  string[],       // ordered; start symbol first
 *   vset:  Set<string>,
 *   terms: Set<string>,
 *   prods: Production[],
 * }
 *
 * Production = { lhs: string, rhs: string[] }   // rhs=[] means ε
 *
 * Input format (one rule per line):
 *   S -> A B | a
 *   A -> a A | eps
 */
export function parse(text) {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))

  if (!lines.length) throw new Error('Grammar is empty.')

  const prods = []
  const vars  = []
  const vset  = new Set()

  for (const line of lines) {
    const arrowIdx = line.indexOf('->')
    if (arrowIdx < 0) throw new Error(`Missing "->" in: "${line}"`)

    const lhs = line.slice(0, arrowIdx).trim()
    if (!lhs) throw new Error(`Empty left-hand side in: "${line}"`)

    if (!vset.has(lhs)) { vars.push(lhs); vset.add(lhs) }

    const rhsPart = line.slice(arrowIdx + 2)
    for (const alt of rhsPart.split('|')) {
      const t = alt.trim()
      const isEps = !t || t === 'ε' || t === 'eps' || t === 'epsilon'
      prods.push({ lhs, rhs: isEps ? [] : t.split(/\s+/).filter(Boolean) })
    }
  }

  if (!vars.length) throw new Error('No variables found.')

  const terms = new Set()
  for (const p of prods)
    for (const s of p.rhs)
      if (!vset.has(s)) terms.add(s)

  return { start: vars[0], vars, vset, terms, prods }
}

/** Stable key for a production (used for set membership). */
export function prodKey(p) {
  return p.lhs + '\x00' + (p.rhs.length === 0 ? '\x01' : p.rhs.join(' '))
}

/** Human-readable RHS string. */
export function fmtRhs(rhs) {
  return rhs.length === 0 ? 'ε' : rhs.join(' ')
}