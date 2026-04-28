
'use client'
import { useQuery } from 'react-query';
import Nav from './users/components/Nav';
import axios from 'axios';
import { formatDate, formatISO, fromUnixTime } from 'date-fns';
import Container from './users/components/container';
import { ConvertToCelsius } from './utils/ConvertTokelvin';
import WeatherIcon from './users/components/weatherIcon';
import { CheckForNight } from './utils/CheckForNight';
import WeatherDetails from './users/components/WeatherDetails';
import { ConvertToKilometer } from './utils/ConvertToKiloMeter';
import { ConvertWindSpeed } from './utils/ConvertWindSpeed';
import SevenDaysWeatherData from './users/components/SevenDaysWeatherData';
import { useAtom } from 'jotai';
import { LoadingCity, placeAtom } from './atom';
import { useEffect } from 'react';

interface WeatherData {
  cod: number;
  message: number;
  cnt: number;
  list: Weather[];
  city: City;
}

interface Weather {
  dt: number;
  main: Main;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}





export default function Home() {
  const [Place , setPlace] = useAtom(placeAtom)
  const [Loading, setLoadingCity] = useAtom(LoadingCity)

  const ApiKey = process.env.NEXT_PUBLIC_WEATHER_KEY

  const { isLoading, data, refetch } = useQuery<WeatherData>('repoData', async () => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${Place}&appid=${ApiKey}&cnt=56`)

    return data;
  }


  )
  
  useEffect(()=>{
    refetch()

  },[Place,refetch])

 
  const firstData = data?.list[0]

  console.log(firstData);


  console.log('data', data);


  const UniqueDate = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split('T')[0]
      )
    )
  ];

  const FirstDataEachData = UniqueDate?.map((date) => {
    return data?.list.find(entry => {
      const entrydata = new Date(entry.dt * 1000).toISOString().split('T')[0]
      const entryTime = new Date(entry.dt * 1000).getHours()
      return entrydata === date && entryTime >= 6
    })

  })


   if(isLoading) return <h1 className='flex justify-center items-center text-2xl animate-bounce text-red-600 min-h-screen'>Loading... </h1>

  return (
    <main className='flex flex-col gap-4 bg-gray-100 min-h-screen'>
      <Nav location={data?.city.name} country={data?.city.country} />
      { Loading ? <SkeletonLoading/>
      :
      <>
  <main className="px-3 max-w-7xl mx-auto flex flex-col  gap-9 w-full pb-10 pt-4">
        <section className='space-y-4 '>
          <div className='space-y-2'>
            <h2 className="flex gap-1 text-2xl items-end">
              {firstData ? (<><span> {''} {formatDate(formatISO(firstData?.dt_txt ?? ''), 'EEEE')}</span>

                <span className='text-lg'> {''}{formatDate(formatISO(firstData?.dt_txt ?? ''), '(dd.MM.yyyy)')}</span></>) : 'Date'}

            </h2>
            <Container className='gap-10 px-6 items-center'>
              <div className="flex flex-col px-4 items-center">
                <span className='text-5xl' >{ConvertToCelsius(firstData?.main.temp ?? 293.45)}<sup>o</sup>c</span>
                <p className='text-xs space-x-1 whitespace-nowrap'>
                  <span>Feels Like</span>
                  <span>
                    {ConvertToCelsius(firstData?.main.feels_like ?? 300)}<sup>o</sup>c
                  </span>
                </p>
                <p className='text-xs space-x-2 '>
                  <span> {ConvertToCelsius(firstData?.main.temp_min ?? 300)}<sup>o</sup>c<strong className='text-red-600 text-xl'>↓</strong>  </span>
                  <span> {ConvertToCelsius(firstData?.main.temp_max ?? 300)}<sup>o</sup>c<strong className='text-green-600 text-xl'>↑</strong> </span>

                </p>

              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((weather, i) => {
                  return (
                    <div className='flex flex-col justify-between gap-2 items-center text-xs' key={i}>
                      <p className='whitespace-nowrap'>{formatDate(formatISO(weather.dt_txt), 'h:mm a')}</p>

                      <WeatherIcon iconname={CheckForNight(weather?.weather[0].icon ?? '', weather?.dt_txt ?? '')} />
                      <p>{ConvertToCelsius(weather?.main.temp ?? 0)}<sup>o</sup>c</p>

                    </div>
                  )
                })}
              </div>
            </Container>
          </div>
          <div className='flex gap-4'>
            <Container className='w-fit justify-center flex-col px-4 items-center'>
              <p className='capitalize text-center'>{firstData?.weather[0].description}</p>
              <span> <WeatherIcon iconname={CheckForNight(firstData?.weather[0].icon ?? '', firstData?.dt_txt ?? '')} alt='Weather-icon' /> </span>

            </Container>
            <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
              {data?.city ? <>  <WeatherDetails visibilty={ConvertToKilometer(firstData?.visibility ?? 1000)} airpressure={`${firstData?.main.pressure ?? 61} hPa`} humidity={`${firstData?.main.humidity ?? 61}%`} windSpeed={ConvertWindSpeed(firstData?.wind.speed ?? 5)} sunset={formatDate(fromUnixTime(data?.city.sunset), 'H:mm a')} sunrise={formatDate(fromUnixTime(data?.city.sunrise), 'H:mm a')} /></> : <WeatherDetails visibilty='25km' humidity='61%' windSpeed='7 km/h' airpressure='1012 hpa' sunrise='6:20 AM' sunset='18:48PM' />}


            </Container>

          </div>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <p className='text-2xl'> Forecast (7 days)</p>
          {(FirstDataEachData.length && FirstDataEachData )? FirstDataEachData?.map((data2, i) => {

            return (
             data2 && <SevenDaysWeatherData
                key={i}
                description={data2?.weather[0].description ?? 'weather-Description'}
                weatherIcon={data2?.weather[0].icon ?? '01d'}
                date={formatDate(formatISO(data2?.dt_txt ?? ''), 'dd:MM')}
                day={formatDate(formatISO(data2?.dt_txt ?? ''), 'EEEE')}
                temp={data2?.main.temp ?? 0} 
                feels_like={data2?.main.feels_like ?? 300}
                temp_min={data2?.main.temp_min ?? 300}
                temp_max={data2?.main.temp_max ?? 300}
                humidity={`${data2?.main.humidity ?? 45}%`}
                sunrise={formatDate(fromUnixTime(data?.city.sunrise ?? 1200), 'H:mm a')}
                sunset={formatDate(fromUnixTime(data?.city.sunset ?? 1200), 'H:mm a')}
                visibilty={`${ConvertToKilometer(data2?.visibility ?? 10000)}`}
                windSpeed={`${ConvertWindSpeed(data2?.wind.speed ?? 1.64)}`}
                airpressure={`${data2?.main.pressure} hpa`}



              />
            )

          }) : (<SevenDaysWeatherData  weatherIcon='' />)}

        </section>
      </main>

      </>
      
    
    
    
    
    }
    
    </main>
  );
}
// see if you add C to the temperatures

const SkeletonLoading = () => {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      <section className='space-y-4'>
        <div className='space-y-2'>
          <h2 className="flex gap-1 text-2xl items-end">
            <span className="skeleton-text"></span>
            <span className="skeleton-text"></span>
          </h2>
          
          <Container className='gap-10 px-6 items-center'>
            <div className="flex flex-col px-4 items-center">
              <span className='skeleton-text h-12 w-24'></span>
              <p className='skeleton-text h-4 w-20'></p>
              <p className='skeleton-text h-4 w-32'></p>
            </div>
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {/* Repeat the following for the number of hourly forecasts */}
              <div className='flex flex-col justify-between gap-2 items-center text-xs'>
                <p className='skeleton-text h-3 w-12'></p>
                <div className='skeleton-text h-12 w-12 rounded-full'></div>
                <p className='skeleton-text h-3 w-10'></p>
              </div>
            </div>
          </Container>
          <div className='flex gap-4'>
            <Container className='w-fit justify-center flex-col px-4 items-center'>
              <p className='skeleton-text h-4 w-24'></p>
              <div className='skeleton-text h-12 w-12 rounded-full'></div>
            </Container>
            <Container className='bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto'>
              {/* Repeat the following for the number of weather details */}
              <div className='skeleton-text h-4 w-20'></div>
            </Container>
          </div>
          </div>
        </section>
        <section className='flex w-full flex-col gap-4'>
          <p className='skeleton-text h-4 w-24'></p>
          {/* Repeat the following for the number of days in the forecast */}
          <div className='skeleton-card'>
            {/* Skeleton for a single day's forecast card */}
          </div>
        </section>
      </main>
    );
};



