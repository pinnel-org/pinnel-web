import { useState, useEffect, useRef } from 'react'
import styles from './CitySearch.module.css'
import { citiesApi } from '@/api/cities'
import { CityDto } from '@/types'

const isoToFlag = (iso: string): string => {
  if (!iso || iso.length !== 2) return '📍'
  return iso.toUpperCase().split('').map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('')
}

interface CitySearchProps {
  onSelect: (city: CityDto) => void
  onClose: () => void
}

export const CitySearch = ({ onSelect, onClose }: CitySearchProps) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CityDto[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState<CityDto | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim() || selectedCity) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await citiesApi.search(query)
        setSuggestions(results)
        setShowDropdown(results.length > 0)
      } catch {
        setSuggestions([])
        setShowDropdown(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selectedCity])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSelect = (city: CityDto) => {
    setSelectedCity(city)
    setQuery(city.name)
    setShowDropdown(false)
    setSuggestions([])
  }

  const handleConfirm = () => {
    if (selectedCity) onSelect(selectedCity)
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (selectedCity) setSelectedCity(null)
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>&#x2715;</button>
        <p className={styles.step}>ADD CITY</p>
        <h2 className={styles.title}>Pick a <em className={styles.titleAccent}>city.</em></h2>

        <div className={styles.cityCard}>
          <div className={styles.cityInputWrap}>
            {selectedCity && <span className={styles.cityFlag}>{isoToFlag(selectedCity.country)}</span>}
            <input
              className={styles.cityInput}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="e.g. Milan"
              autoComplete="off"
              autoFocus
            />
            {selectedCity && (
              <span className={styles.cityCountryLabel}>{selectedCity.country}</span>
            )}
          </div>
          {showDropdown && (
            <ul className={styles.dropdown}>
              {suggestions.map(city => (
                <li
                  key={city.id}
                  className={styles.dropdownItem}
                  onMouseDown={() => handleSelect(city)}
                >
                  <span className={styles.dropCityName}>{city.name}</span>
                  <span className={styles.dropCityCountry}>{isoToFlag(city.country)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedCity && (
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            ADD CITY →
          </button>
        )}
      </div>
    </>
  )
}
