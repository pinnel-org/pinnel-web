import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudSnow, CloudLightning } from 'lucide-react'
import { WeatherDay } from '@/api/weather'
import styles from './WeatherStrip.module.css'

interface Props {
  days: WeatherDay[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getWeatherIcon = (code: number) => {
  if (code === 0)                        return <Sun size={16} color="#f0a830" />
  if (code <= 2)                         return <CloudSun size={16} color="#f0a830" />
  if (code <= 3)                         return <Cloud size={16} color="#8a7a66" />
  if (code <= 48)                        return <Cloud size={16} color="#8a7a66" />
  if (code <= 55)                        return <CloudDrizzle size={16} color="#6a9ab0" />
  if (code <= 65)                        return <CloudRain size={16} color="#4a7aa0" />
  if (code <= 77)                        return <CloudSnow size={16} color="#8ab0d0" />
  if (code <= 82)                        return <CloudRain size={16} color="#4a7aa0" />
  return                                        <CloudLightning size={16} color="#7a5a9a" />
}

const getWeatherLabel = (code: number): string => {
  if (code === 0)   return 'Clear'
  if (code <= 2)    return 'Mostly clear'
  if (code <= 3)    return 'Cloudy'
  if (code <= 48)   return 'Foggy'
  if (code <= 55)   return 'Drizzle'
  if (code <= 65)   return 'Rain'
  if (code <= 77)   return 'Snow'
  if (code <= 82)   return 'Showers'
  return 'Storm'
}

export const WeatherStrip = ({ days }: Props) => (
  <div className={styles.strip}>
    {days.map((day) => {
      const d = new Date(day.date)
      const dayLabel = DAY_LABELS[d.getUTCDay()]
      const dateLabel = `${d.toLocaleString('en', { month: 'short', timeZone: 'UTC' })} ${d.getUTCDate()}`
      return (
        <div key={day.date} className={styles.day}>
          <span className={styles.dayName}>{dayLabel}</span>
          <span className={styles.date}>{dateLabel}</span>
          <span className={styles.icon}>{getWeatherIcon(day.weatherCode)}</span>
          <span className={styles.temp}>{day.tempMax}°</span>
          <span className={styles.label}>{getWeatherLabel(day.weatherCode)}</span>
        </div>
      )
    })}
  </div>
)
