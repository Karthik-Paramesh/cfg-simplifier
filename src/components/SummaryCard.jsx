import React from 'react'
import { fmtRhs } from '../lib/parser'
import styles from './SummaryCard.module.css'

/**
 * summary = {
 *   vars:          string[],
 *   prods:         Production[],
 *   nullableStart: boolean,
 *   startSymbol:   string,
 * }
 */
export default function SummaryCard({ summary }) {
  const { vars, prods, nullableStart, startSymbol } = summary

  /* Group productions by lhs, start symbol first */
  const order = [startSymbol, ...vars.filter(v => v !== startSymbol)]
  const byLhs = {}
  for (const v of order) byLhs[v] = []
  for (const p of prods) {
    if (!byLhs[p.lhs]) byLhs[p.lhs] = []
    byLhs[p.lhs].push(p)
  }

  const properties = [
    { label: 'Variables', value: `{ ${vars.join(', ')} }` },
    { label: 'Productions', value: prods.length },
    {
      label: 'Start symbol',
      value: `${startSymbol}${nullableStart ? '  (can derive ε)' : ''}`,
    },
    {
      label: 'Properties',
      value: [
        'No useless symbols',
        'No ε-productions' + (nullableStart ? ` (except ${startSymbol} → ε)` : ''),
        'No unit productions',
      ].join('  ·  '),
    },
  ]

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.badge}>Simplified grammar</span>
        <span className={styles.counts}>
          {vars.length} variable{vars.length !== 1 ? 's' : ''}
          &nbsp;·&nbsp;
          {prods.length} production{prods.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.body}>
        {/* Left: property table */}
        <div className={styles.props}>
          {properties.map(p => (
            <div key={p.label} className={styles.propRow}>
              <span className={styles.propLabel}>{p.label}</span>
              <span className={styles.propValue}>{p.value}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Right: final grammar box */}
        <div className={styles.gramBox}>
          {order.map(lhs => {
            const ps = byLhs[lhs]
            if (!ps || ps.length === 0) return null
            return (
              <div key={lhs} className={styles.prodRow}>
                <span className={`${styles.prodLhs} ${lhs === startSymbol ? styles.startLhs : ''}`}>
                  {lhs}
                </span>
                <span className={styles.prodArrow}>→</span>
                <span className={styles.prodAlts}>
                  {ps.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className={styles.altSep}>|</span>}
                      <span className={styles.altText}>{fmtRhs(p.rhs)}</span>
                    </React.Fragment>
                  ))}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}