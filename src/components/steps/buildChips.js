/**
 * buildChips(step) → Array<{ label, variant }>
 *
 * Correct TAFL order:
 *   step1 — null productions
 *   step2 — unit productions
 *   step3 — useless symbols
 */
export function buildChips(step) {
  const { id, info } = step
  if (!info) return []

  const chips = []

  /* ── Step 1: null (ε) productions ───────────────────── */
  if (id === 'step1') {
    const { nullable, addedProds, removedProds } = info

    if (nullable.length > 0) {
      chips.push({
        label: `Nullable: { ${nullable.join(', ')} }`,
        variant: 'info',
      })
    } else {
      chips.push({ label: 'No nullable variables', variant: 'muted' })
    }

    if (addedProds.length > 0) {
      chips.push({
        label: `+${addedProds.length} production${addedProds.length !== 1 ? 's' : ''} added`,
        variant: 'success',
      })
    }

    if (removedProds.length > 0) {
      chips.push({
        label: `${removedProds.length} ε-production${removedProds.length !== 1 ? 's' : ''} removed`,
        variant: 'danger',
      })
    }
  }

  /* ── Step 2: unit productions ────────────────────────── */
  if (id === 'step2') {
    const { unitPairs, addedProds, removedProds } = info

    if (unitPairs.length > 0) {
      const pairStr = unitPairs.map(([a, b]) => `(${a},${b})`).join('  ')
      chips.push({ label: `Unit pairs: ${pairStr}`, variant: 'info' })
    } else {
      chips.push({ label: 'No unit productions found', variant: 'muted' })
    }

    if (addedProds.length > 0) {
      chips.push({
        label: `+${addedProds.length} production${addedProds.length !== 1 ? 's' : ''} added`,
        variant: 'success',
      })
    }

    if (removedProds.length > 0) {
      chips.push({
        label: `${removedProds.length} unit production${removedProds.length !== 1 ? 's' : ''} removed`,
        variant: 'danger',
      })
    }
  }

  /* ── Step 3: useless symbols ─────────────────────────── */
  if (id === 'step3') {
    const { nonGenerating, nonReachable, removedProds } = info

    if (nonGenerating.length > 0) {
      chips.push({
        label: `Non-generating: { ${nonGenerating.join(', ')} }`,
        variant: 'danger',
      })
    }

    if (nonReachable.length > 0) {
      chips.push({
        label: `Non-reachable: { ${nonReachable.join(', ')} }`,
        variant: 'warning',
      })
    }

    if (removedProds.length > 0) {
      chips.push({
        label: `${removedProds.length} production${removedProds.length !== 1 ? 's' : ''} removed`,
        variant: 'danger',
      })
    }

    if (nonGenerating.length === 0 && nonReachable.length === 0) {
      chips.push({ label: 'No useless symbols found', variant: 'muted' })
    }
  }

  return chips
}