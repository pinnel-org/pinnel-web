import { Pin } from '@/types'

export interface DayCityEntry {
  cityId: number
  cityName: string
  expanded: boolean
  addedPins: Pin[]
}
