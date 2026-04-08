import { useMemo } from 'react'
import { parse }               from '../lib/parser'
import { removeUseless }       from '../lib/simplify'
import { eliminateNullProds }  from '../lib/simplify'
import { removeUnitProds }     from '../lib/simplify'

/**
 * useSimplify(rawText)
 *
 * Returns:
 *   steps   – array of { id, label, badge, desc, grammar, prevGrammar, info }
 *   summary – { vars, prods, nullableStart }  |  null
 *   error   – string  |  null
 */
export function useSimplify(rawText) {
  return useMemo(() => {
    try {
      const g0 = parse(rawText.trim())

      const r1 = removeUseless(g0)
      const r2 = eliminateNullProds(r1.grammar)
      const r3 = removeUnitProds(r2.grammar)

      const steps = [
        {
          id:          'original',
          label:       'Original grammar',
          badge:       null,
          desc:        null,
          grammar:     g0,
          prevGrammar: null,
          info:        null,
        },
        {
          id:          'step1',
          label:       'Step 1 — Remove useless symbols',
          badge:       'Step 1',
          badgeVariant:'danger',
          desc:        'Removes non-generating variables (those that can never derive a terminal string) and non-reachable variables (those unreachable from the start symbol). Any production that references a useless symbol is also eliminated.',
          grammar:     r1.grammar,
          prevGrammar: g0,
          info:        r1.info,
        },
        {
          id:          'step2',
          label:       'Step 2 — Eliminate ε-productions',
          badge:       'Step 2',
          badgeVariant:'info',
          desc:        'Computes the nullable set — variables that can derive ε directly or transitively. For every production containing nullable symbols, new alternatives are generated for each combination of those symbols being omitted. All ε-productions are then removed (except S → ε if the start symbol is nullable).',
          grammar:     r2.grammar,
          prevGrammar: r1.grammar,
          info:        r2.info,
        },
        {
          id:          'step3',
          label:       'Step 3 — Remove unit productions',
          badge:       'Step 3',
          badgeVariant:'success',
          desc:        'Computes all transitive unit pairs (A, B) — where A can unit-derive B. For each pair, every non-unit production B → α yields a new rule A → α. All unit productions are then removed.',
          grammar:     r3.grammar,
          prevGrammar: r2.grammar,
          info:        r3.info,
        },
      ]

      const summary = {
        vars:          r3.grammar.vars,
        prods:         r3.grammar.prods,
        nullableStart: r2.info.nullable.includes(g0.start),
        startSymbol:   g0.start,
      }

      return { steps, summary, error: null }
    } catch (e) {
      return { steps: [], summary: null, error: e.message }
    }
  }, [rawText])
}