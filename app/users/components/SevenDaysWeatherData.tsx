import React from 'react'
import Container from './container'
import WeatherIcon from './weatherIcon'
import { WeatherDetailsProps } from './WeatherDetails'
import { ConvertToCelsius } from '../../utils/ConvertTokelvin'
import WeatherDetails from './WeatherDetails'

export interface SevenDaysWeatherDataProps extends WeatherDetailsProps {
  weatherIcon: string
  date: string
  day: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  description: string

}

const SevenDaysWeatherData = (props: SevenDaysWeatherDataProps) => {
  const {
    weatherIcon = '02d',
    date = '19:09',
    day = 'Tuesday',
    temp,
    feels_like,
    temp_min,
    temp_max,
    description
  } = props;
  return (
    <Container className='gap-4'>
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col gap-1 items-center'>
          <WeatherIcon iconname={weatherIcon}  alt='weather-icon'/>
          <p>{date}</p>
          <p className='text-sm'> {day} </p>
        </div>

        <div className="flex flex-col px-45 items-center ">
          <span className='text-5xl'>{ConvertToCelsius(temp ?? 300)}<sup>o</sup>c</span>
          <p className='text-xs space-x-1 whitespace-nowrap'>
            <span className='text-xs'>Feels Like</span>
            <span>{ConvertToCelsius(feels_like ?? 300)}<sup>o</sup>c</span>
          </p>
          <p className='text-xs space-x-2 '>
            <span> {ConvertToCelsius(temp_min ?? 300)}<sup>o</sup>c<strong className='text-red-600 text-xl'>↓</strong>  </span>
            <span> {ConvertToCelsius(temp_max ?? 300)}<sup>o</sup>c<strong className='text-green-600 text-xl'>↑</strong> </span>
          </p>
          <p className='capitalize text-sm flex items-center w-40 justify-center'>{description ?? 'Broken Clouds'}</p>
        </div>
      </section>
      <section className='overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
        <WeatherDetails  {...props} />
      </section>
    </Container>
  )
}

export default SevenDaysWeatherData