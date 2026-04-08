import React, { useState } from 'react'
import GrammarInput from './components/GrammarInput'
import StepDisplay from './components/StepDisplay'
import SummaryCard from './components/SummaryCard'
import { useSimplify } from './hooks/useSimplify'
import { EXAMPLES } from './lib/examples'
import styles from './styles/App.module.css'

export default function App() {
  const [raw, setRaw] = useState(EXAMPLES[0])
  const { steps, summary, error } = useSimplify(raw)

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>CFG Simplifier</h1>
        <p className={styles.subtitle}>
          Visualise how a context-free grammar is simplified — removing useless
          symbols, null productions, and unit productions — step by step.
        </p>
      </header>

      <main className={styles.main}>
        <GrammarInput
          value={raw}
          onChange={setRaw}
          examples={EXAMPLES}
        />

        {error && <p className={styles.error}>{error}</p>}

        {steps.map((step, i) => (
          <StepDisplay key={i} step={step} index={i} />
        ))}

        {summary && <SummaryCard summary={summary} />}
      </main>
    </div>
  )
}