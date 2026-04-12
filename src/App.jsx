import React, { useState } from 'react'
import GrammarInput from './components/GrammarInput'
import StepDisplay from './components/StepDisplay'
import SummaryCard from './components/SummaryCard'
import TheoryPanel from './components/TheoryPanel'
import { useSimplify } from './hooks/useSimplify'
import { EXAMPLES } from './lib/examples'
import styles from './styles/App.module.css'

export default function App() {
  const [raw, setRaw]           = useState(EXAMPLES[0])
  const [submitted, setSubmitted] = useState(EXAMPLES[0])
  const [showTheory, setShowTheory] = useState(false)

  const { steps, summary, error } = useSimplify(submitted)

  function handleSimplify(value) {
    setSubmitted(value)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>CFG Simplification</h1>
          <button
            className={styles.theoryBtn}
            onClick={() => setShowTheory(v => !v)}
          >
            {showTheory ? 'Hide theory' : 'What is this?'}
          </button>
        </div>
        <p className={styles.subtitle}>
          Enter any context-free grammar below and click <strong>Simplify</strong> to
          see it transformed — removing useless symbols, ε-productions, and unit
          productions — one step at a time.
        </p>
      </header>

      {showTheory && <TheoryPanel />}

      <main className={styles.main}>
        <GrammarInput
          value={raw}
          onChange={setRaw}
          onSimplify={handleSimplify}
          examples={EXAMPLES}
        />

        {error && <p className={styles.error}>{error}</p>}

        {!error && steps.map((step, i) => (
          <StepDisplay key={i} step={step} index={i} />
        ))}

        {!error && summary && <SummaryCard summary={summary} />}
      </main>
    </div>
  )
}