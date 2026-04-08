import React from 'react'
import styles from './InfoChips.module.css'

/**
 * chips: Array<{ label: string, variant: 'info' | 'danger' | 'success' | 'warning' | 'muted' }>
 */
export default function InfoChips({ chips }) {
  if (!chips || chips.length === 0) return null

  return (
    <div className={styles.row}>
      {chips.map((chip, i) => (
        <span key={i} className={`${styles.chip} ${styles[chip.variant] || styles.muted}`}>
          {chip.label}
        </span>
      ))}
    </div>
  )
}