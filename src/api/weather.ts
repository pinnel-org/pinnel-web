import axios from 'axios'

export interface WeatherDay {
  date: string
  tempMax: number
  weatherCode: number
}

interface OpenMeteoResponse {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    weathercode: number[]
  }
}

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherDay[]> => {
  const { data } = await axios.get<OpenMeteoResponse>(
    'https://api.open-meteo.com/v1/forecast',
    {
      params: {
        latitude: lat,
        longitude: lng,
        daily: 'temperature_2m_max,weathercode',
        timezone: 'auto',
        forecast_days: 7,
      },
    }
  )
  return data.daily.time.map((date, i) => ({
    date,
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    weatherCode: data.daily.weathercode[i],
  }))
}
