export interface YearRange {
  min: number | null
  max: number | null
}

export const EMPTY_YEAR_RANGE: YearRange = { min: null, max: null }

export function getReleaseYear(releaseDate?: string | null): number | null {
  const year = releaseDate?.slice(0, 4)?.trim()
  return year && /^\d{4}$/.test(year) ? Number.parseInt(year, 10) : null
}

export function isYearRangeActive(range: YearRange): boolean {
  return range.min !== null || range.max !== null
}

export function matchesYearRange(releaseDate: string | null | undefined, range: YearRange): boolean {
  if (!isYearRangeActive(range)) {
    return true
  }

  const year = getReleaseYear(releaseDate)
  if (year === null) {
    return false
  }

  const lowerBound =
    range.min !== null && range.max !== null ? Math.min(range.min, range.max) : range.min
  const upperBound =
    range.min !== null && range.max !== null ? Math.max(range.min, range.max) : range.max

  if (lowerBound !== null && year < lowerBound) {
    return false
  }
  if (upperBound !== null && year > upperBound) {
    return false
  }

  return true
}
