import React from 'react'
import styles from './GrammarInput.module.css'

export default function GrammarInput({ value, onChange, examples }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>
        Grammar productions
        <span className={styles.hint}>
          One rule per line &nbsp;·&nbsp; use <code>|</code> for alternatives &nbsp;·&nbsp;{' '}
          <code>eps</code> or <code>ε</code> for the empty string
        </span>
      </div>

      <textarea
        className={styles.textarea}
        value={value}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div className={styles.actions}>
        {examples.map((ex, i) => (
          <button
            key={i}
            className={styles.exBtn}
            onClick={() => onChange(ex)}
          >
            Example {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}