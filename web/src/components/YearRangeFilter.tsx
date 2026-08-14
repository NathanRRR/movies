import { useId, useState } from 'react'
import { isYearRangeActive, type YearRange } from '../utils/yearFilter'

interface YearRangeFilterProps {
  range: YearRange
  onChange: (range: YearRange) => void
}

function parseYearInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export default function YearRangeFilter({ range, onChange }: YearRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const minInputId = useId()
  const maxInputId = useId()
  const isActive = isYearRangeActive(range)

  const handleReset = () => {
    onChange({ min: null, max: null })
  }

  const toggleLabel = isActive
    ? `Période : ${range.min ?? '…'} – ${range.max ?? '…'}`
    : 'Filtrer par période'

  return (
    <div className="yearFilterWrap">
      <button
        type="button"
        className={`yearFilterButton ${isActive ? 'yearFilterButtonActive' : ''}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        {toggleLabel}
      </button>

      {isOpen ? (
        <div className="yearFilterPanel">
          <label htmlFor={minInputId}>De</label>
          <input
            id={minInputId}
            type="number"
            inputMode="numeric"
            placeholder="Ex: 2010"
            value={range.min ?? ''}
            onChange={(event) => onChange({ ...range, min: parseYearInput(event.target.value) })}
            className="yearFilterInput"
          />
          <label htmlFor={maxInputId}>à</label>
          <input
            id={maxInputId}
            type="number"
            inputMode="numeric"
            placeholder="Ex: 2019"
            value={range.max ?? ''}
            onChange={(event) => onChange({ ...range, max: parseYearInput(event.target.value) })}
            className="yearFilterInput"
          />
          {isActive ? (
            <button type="button" className="yearFilterResetButton" onClick={handleReset}>
              Réinitialiser
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
