import React from 'react'
import { prodKey, fmtRhs } from '../../lib/parser'
import styles from './GrammarTable.module.css'

export default function GrammarTable({ grammar, prevGrammar }) {
  const { vars, vset, start, prods } = grammar

  const prevKeySet = prevGrammar ? new Set(prevGrammar.prods.map(prodKey)) : null
  const curKeySet  = new Set(prods.map(prodKey))

  /* Build a display order that starts with the start symbol */
  const order = [start, ...vars.filter(v => v !== start)]

  /* Group current productions by lhs */
  const byLhs = {}
  for (const v of order) byLhs[v] = []
  for (const p of prods) {
    if (!byLhs[p.lhs]) byLhs[p.lhs] = []
    byLhs[p.lhs].push(p)
  }

  /* Removed productions by lhs (appear strikethrough) */
  const remByLhs = {}
  if (prevGrammar) {
    for (const p of prevGrammar.prods) {
      if (!curKeySet.has(prodKey(p))) {
        if (!remByLhs[p.lhs]) remByLhs[p.lhs] = []
        remByLhs[p.lhs].push(p)
      }
    }
  }

  const allLhs = new Set([...order, ...Object.keys(remByLhs)])
  const displayLhs = [...order, ...[...allLhs].filter(l => !order.includes(l))]

  return (
    <div className={styles.box}>
      {displayLhs.map(lhs => {
        const cur = byLhs[lhs] || []
        const rem = remByLhs[lhs] || []
        if (!cur.length && !rem.length) return null

        const parts = [
          ...cur.map(p => ({
            key: prodKey(p),
            text: fmtRhs(p.rhs),
            added: prevKeySet && !prevKeySet.has(prodKey(p)),
            removed: false,
          })),
          ...rem.map(p => ({
            key: 'rem-' + prodKey(p),
            text: fmtRhs(p.rhs),
            added: false,
            removed: true,
          })),
        ]

        return (
          <div key={lhs} className={styles.row}>
            <span className={`${styles.lhs} ${lhs === start ? styles.startVar : ''}`}>
              {lhs}
            </span>
            <span className={styles.arrow}>→</span>
            <span className={styles.alts}>
              {parts.map((p, i) => (
                <React.Fragment key={p.key}>
                  {i > 0 && <span className={styles.sep}>|</span>}
                  <span
                    className={[
                      styles.alt,
                      p.added   ? styles.added   : '',
                      p.removed ? styles.removed : '',
                    ].join(' ')}
                  >
                    {p.text}
                  </span>
                </React.Fragment>
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}