export type TripMood = 'foodie' | 'budget' | 'luxury' | 'architecture' | 'hidden-gems' | 'slow-travel'

export interface Trip {
  id: string
  title: string
  city: string
  country: string
  days: number
  authorId: string
  authorName: string
  cloneCount: number
  mood: TripMood[]
  budgetPerDay: number | null
  currency: string
  isPublic: boolean
  places: Place[]
  slug: string
  createdAt: string
}

export interface Place {
  id: string
  tripId: string
  name: string
  address: string
  lat: number
  lng: number
  note: string | null
  cost: number | null
  durationMinutes: number | null
  dayNumber: number
  orderIndex: number
}

export interface User {
  id: string
  cognitoId: string
  email: string
  username: string
  displayName: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export interface UpdateUserDto {
  username: string
  displayName: string
  bio: string
}

export interface CityDto {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
  population: number
}

// Matches backend PinDto
export interface Pin {
  id: number
  name: string
  overview: string | null
  visitorTips: string | null
  history: string | null
  latitude: number
  longitude: number
  isPublic: boolean
  cityId: number
  userId: number | null
  createdAt: string
  updatedAt: string
  logoUrlSmall: string | null
  logoUrlBig: string | null
}

// Matches backend TripDto — used for user's own trip list (GET /api/trips)
export interface TripSummary {
  id: number
  name: string
  budget: number | null
  userId: number
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
}

// Matches backend TripDetailDto
export interface TripDetail {
  id: number
  tripId: number
  userId: number
  visitDate: string   // "YYYY-MM-DD"
  cityId: number
  cityOrder: number
}

// Matches backend TripDetailPinDto
export interface TripDetailPin {
  id: number
  tripDetailId: number
  userId: number
  pinId: number
  pinOrder: number
  visitTime: string | null  // "HH:mm"
  budget: number | null
}

export interface CreateTripDto {
  name: string
  cityIds: number[]
  budget?: number | null
}

export interface CreatePlaceDto {
  tripId: string
  name: string
  address: string
  lat: number
  lng: number
  note?: string
  cost?: number
  durationMinutes?: number
  dayNumber: number
}
