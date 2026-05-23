import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { citiesApi } from '@/api/cities'
import { useCreateTrip } from '@/hooks/useUser'
import { CityDto } from '@/types'
import styles from './PlanTripModal.module.css'

const ISO_TO_NAME: Record<string, string> = {
  AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AR: 'Argentina', AU: 'Australia',
  AT: 'Austria', AZ: 'Azerbaijan', BE: 'Belgium', BR: 'Brazil', BG: 'Bulgaria',
  CA: 'Canada', CL: 'Chile', CN: 'China', CO: 'Colombia', HR: 'Croatia',
  CZ: 'Czech Republic', DK: 'Denmark', EG: 'Egypt', FI: 'Finland', FR: 'France',
  DE: 'Germany', GH: 'Ghana', GR: 'Greece', HU: 'Hungary', IN: 'India',
  ID: 'Indonesia', IR: 'Iran', IQ: 'Iraq', IE: 'Ireland', IL: 'Israel',
  IT: 'Italy', JP: 'Japan', JO: 'Jordan', KZ: 'Kazakhstan', KE: 'Kenya',
  KR: 'South Korea', KW: 'Kuwait', LB: 'Lebanon', MY: 'Malaysia', MX: 'Mexico',
  MA: 'Morocco', NL: 'Netherlands', NZ: 'New Zealand', NG: 'Nigeria', NO: 'Norway',
  PK: 'Pakistan', PE: 'Peru', PH: 'Philippines', PL: 'Poland', PT: 'Portugal',
  RO: 'Romania', RU: 'Russia', SA: 'Saudi Arabia', SG: 'Singapore', ZA: 'South Africa',
  ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', TW: 'Taiwan', TH: 'Thailand',
  TR: 'Turkey', UA: 'Ukraine', AE: 'UAE', GB: 'United Kingdom', US: 'United States',
  UZ: 'Uzbekistan', VN: 'Vietnam', MZ: 'Mozambique', RS: 'Serbia', SK: 'Slovakia',
  SI: 'Slovenia', BA: 'Bosnia', MK: 'North Macedonia', ME: 'Montenegro', XK: 'Kosovo',
}

const isoToFlag = (iso: string): string => {
  if (!iso || iso.length !== 2) return '📍'
  return iso.toUpperCase().split('').map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('')
}

const isoToName = (iso: string): string => ISO_TO_NAME[iso.toUpperCase()] ?? iso

const TRAVEL_STYLES: { id: string; emoji: string; label: string }[] = [
  { id: 'food',        emoji: '🍽️', label: 'Food' },
  { id: 'art',         emoji: '🌸', label: 'Art & Museums' },
  { id: 'nature',      emoji: '🌿', label: 'Nature' },
  { id: 'nightlife',   emoji: '🎵', label: 'Nightlife' },
  { id: 'shopping',    emoji: '🛍️', label: 'Shopping' },
  { id: 'history',     emoji: '🏛️', label: 'History' },
  { id: 'beach',       emoji: '⚓', label: 'Beach' },
  { id: 'adventure',   emoji: '▲', label: 'Adventure' },
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
  const [activeStyles, setActiveStyles] = useState<Set<string>>(new Set())

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
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
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
    setCityQuery(city.name)
    setShowDropdown(false)
    setSuggestions([])
  }

  const handleCityChange = (value: string) => {
    setCityQuery(value)
    if (selectedCity) setSelectedCity(null)
  }

  const toggleStyle = (id: string) => {
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
      { name: tripName.trim(), cityIds: [selectedCity!.id], pinIds: [] },
      { onSuccess: (trip) => navigate(`/trip/${trip.id}`) },
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&#x2715;</button>

        <div className={styles.decorNumber}>01</div>

        <div className={styles.header}>
          <p className={styles.step}>STEP 01 · WHERE TO</p>
          <h2 className={styles.title}>
            Pick a <em className={styles.titleAccent}>city.</em>
          </h2>

          <div className={styles.cityCard} ref={dropdownRef}>
            <div className={styles.cityInputWrap}>
              {selectedCity && <span className={styles.cityFlag}>{isoToFlag(selectedCity.country)}</span>}
              <input
                className={styles.cityInput}
                type="text"
                value={cityQuery}
                onChange={(e) => handleCityChange(e.target.value)}
                placeholder="e.g. Milan"
                autoComplete="off"
                autoFocus
              />
              {selectedCity && (
                <span className={styles.cityCountryLabel}>{isoToName(selectedCity.country)}</span>
              )}
            </div>
            {showDropdown && (
              <ul className={styles.dropdown}>
                {suggestions.map((city) => (
                  <li
                    key={city.id}
                    className={styles.dropdownItem}
                    onMouseDown={() => handleCitySelect(city)}
                  >
                    <span className={styles.dropCityName}>{city.name}</span>
                    <span className={styles.dropCityCountry}>{isoToFlag(city.country)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formColumns}>
            <div className={styles.colLeft}>
              <label className={styles.label} htmlFor="pt-name">
                TRIP NAME <span className={styles.required}>*</span>
              </label>
              <input
                id="pt-name"
                className={styles.nameInput}
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                maxLength={120}
                placeholder="e.g. Milan Weekend"
              />
              <p className={styles.hint}>Something memorable — you'll see this on your home page.</p>
            </div>

            <div className={styles.colRight}>
              <span className={styles.label}>TRAVEL STYLE</span>
              <div className={styles.chips}>
                {TRAVEL_STYLES.map(({ id, emoji, label }) => (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.chip} ${activeStyles.has(id) ? styles.chipActive : ''}`}
                    onClick={() => toggleStyle(id)}
                  >
                    <span className={styles.chipEmoji}>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className={styles.error}>Failed to create trip. Please try again.</p>
          )}

          <div className={styles.footer}>
            <span className={styles.readyLabel}>
              {canSubmit && '✓ READY TO PLAN'}
            </span>
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                CANCEL
              </button>
              <button type="submit" className={styles.startBtn} disabled={isSubmitDisabled}>
                {isPending ? 'CREATING…' : 'START PLANNING →'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
