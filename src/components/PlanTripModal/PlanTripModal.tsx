import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { citiesApi } from '@/api/cities'
import { useCreateTrip } from '@/hooks/useUser'
import { CityDto, TripMood } from '@/types'
import styles from './PlanTripModal.module.css'

const TRAVEL_STYLES: { id: TripMood; label: string }[] = [
  { id: 'foodie', label: 'Foodie' },
  { id: 'budget', label: 'Budget' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'hidden-gems', label: 'Hidden Gems' },
  { id: 'slow-travel', label: 'Slow Travel' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const PlanTripModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate()
  const { mutate: createTrip, isPending, error } = useCreateTrip()

  const [cityQuery, setCityQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityDto | null>(null)
  const [suggestions, setSuggestions] = useState<CityDto[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [tripName, setTripName] = useState('')
  const [activeStyles, setActiveStyles] = useState<Set<TripMood>>(new Set())

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setCityQuery('')
      setSelectedCity(null)
      setSuggestions([])
      setShowDropdown(false)
      setTripName('')
      setActiveStyles(new Set())
    }
  }, [isOpen])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!cityQuery.trim() || selectedCity) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await citiesApi.search(cityQuery)
        setSuggestions(results)
        setShowDropdown(results.length > 0)
      } catch {
        setSuggestions([])
        setShowDropdown(false)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [cityQuery, selectedCity])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  if (!isOpen) return null

  const handleCitySelect = (city: CityDto) => {
    setSelectedCity(city)
    setCityQuery(`${city.name}, ${city.country}`)
    setShowDropdown(false)
    setSuggestions([])
  }

  const handleCityChange = (value: string) => {
    setCityQuery(value)
    if (selectedCity) setSelectedCity(null)
  }

  const toggleStyle = (id: TripMood) => {
    setActiveStyles((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const canSubmit = !!selectedCity && tripName.trim().length > 0
  const isSubmitDisabled = !canSubmit || isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    createTrip(
      { name: tripName.trim(), cityIds: [selectedCity!.id] },
      { onSuccess: (trip) => navigate(`/trip/${trip.id}`) },
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&#x2715;</button>

        <h2 className={styles.title}>Plan a trip.</h2>
        <p className={styles.subtitle}>Where are you headed?</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pt-city">City</label>
            <div className={styles.autocompleteWrap} ref={dropdownRef}>
              <input
                id="pt-city"
                className={styles.input}
                type="text"
                value={cityQuery}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="e.g. Milan"
                autoComplete="off"
                autoFocus
              />
              {showDropdown && (
                <ul className={styles.dropdown}>
                  {suggestions.map((city) => (
                    <li
                      key={city.id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleCitySelect(city)}
                    >
                      <span className={styles.cityName}>{city.name}</span>
                      <span className={styles.cityCountry}>{city.country}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="pt-name">
              Trip name
              <span className={styles.charCount}>{tripName.length} / 120</span>
            </label>
            <input
              id="pt-name"
              className={styles.input}
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              maxLength={120}
              placeholder="e.g. Milan Weekend"
              required
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Travel style</span>
            <div className={styles.chips}>
              {TRAVEL_STYLES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`${styles.chip} ${activeStyles.has(id) ? styles.chipActive : ''}`}
                  onClick={() => toggleStyle(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className={styles.error}>Failed to create trip. Please try again.</p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.startBtn} disabled={isSubmitDisabled}>
              {isPending ? 'Creating…' : 'Start Planning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
