import React, { useState } from 'react'
import styles from './GrammarInput.module.css'

export default function GrammarInput({ value, onChange, onSimplify, examples }) {
  const [focused, setFocused] = useState(false)

  function handleKey(e) {
    // Ctrl+Enter or Cmd+Enter triggers simplify
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onSimplify(value)
    }
  }

  function handleClear() {
    onChange('')
  }

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.label}>
          Grammar productions
          <span className={styles.hint}>
            One rule per line &nbsp;·&nbsp; use <code>|</code> for alternatives
            &nbsp;·&nbsp; <code>eps</code> or <code>ε</code> for empty string
            &nbsp;·&nbsp; <kbd>Ctrl+Enter</kbd> to simplify
          </span>
        </div>
        {value.trim() && (
          <button className={styles.clearBtn} onClick={handleClear} title="Clear input">
            Clear
          </button>
        )}
      </div>

      <textarea
        className={`${styles.textarea} ${focused ? styles.focused : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={
          'Write your own grammar here, e.g.:\n' +
          'S -> A B | a\n' +
          'A -> a A | eps\n' +
          'B -> b B | b'
        }
      />

      <div className={styles.formatGuide}>
        <span className={styles.guideItem}><code>S -&gt; A B | a</code> — variables are uppercase, terminals lowercase</span>
        <span className={styles.guideSep}>·</span>
        <span className={styles.guideItem}><code>eps</code> — represents the empty string ε</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.simplifyBtn}
          onClick={() => onSimplify(value)}
          disabled={!value.trim()}
        >
          Simplify →
        </button>
        <div className={styles.exGroup}>
          <span className={styles.exLabel}>Presets:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              className={styles.exBtn}
              onClick={() => { onChange(ex); onSimplify(ex) }}
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}