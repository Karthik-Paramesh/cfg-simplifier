import React from 'react'
import GrammarTable from './ui/GrammarTable'
import InfoChips    from './ui/InfoChips'
import styles       from './StepDisplay.module.css'
import { buildChips } from './steps/buildChips'

export default function StepDisplay({ step, index }) {
  const { label, badge, badgeVariant, desc, grammar, prevGrammar, info } = step
  const chips = buildChips(step)

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      {badge && (
        <span className={`${styles.badge} ${styles[badgeVariant]}`}>
          {badge}
        </span>
      )}

      <h2 className={styles.title}>{label}</h2>

      {desc && <p className={styles.desc}>{desc}</p>}

      {chips.length > 0 && <InfoChips chips={chips} />}

      <GrammarTable grammar={grammar} prevGrammar={prevGrammar} />

      {prevGrammar && (
        <div className={styles.legend}>
          <span className={styles.lgAdded}>
            <span className={styles.dot} data-variant="added" /> Added
          </span>
          <span className={styles.lgRemoved}>
            <span className={styles.dot} data-variant="removed" /> Removed
          </span>
        </div>
      )}
    </div>
  )
}