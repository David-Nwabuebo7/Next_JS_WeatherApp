import React from 'react'
import {LuEye} from 'react-icons/lu'
import {FiDroplet} from 'react-icons/fi'
import { MdAir } from 'react-icons/md';
import { ImMeter } from 'react-icons/im';
import { LuSunrise,LuSunset } from 'react-icons/lu';

export interface WeatherDetailsProps{
visibilty: string;
humidity:string;
windSpeed :string;
airpressure: string;
sunrise: string;
sunset:string;


}



const WeatherDetails = (props:WeatherDetailsProps) => {
 const {
    visibilty = '25km',
    humidity ='61%',
    windSpeed = '7 km/h',
    airpressure = '1012 hpa',
    sunrise = '6:20 AM',
    sunset ='18:48 PM'

 } = props;


    const WeatherDeatilsArray = [
        {value:visibilty,information:'Visbility', icon:<LuEye/>},
        {value:humidity,information:'Humidiity', icon:<FiDroplet/>},
        {value:windSpeed,information:'WindSpeed', icon:<MdAir/>},
        {value:airpressure,information:'AirPressure', icon:<ImMeter/>},
        {value:sunrise,information:'SunRise', icon:<LuSunrise/>},
        {value:sunset,information:'SunSet', icon:<LuSunset/>}

    ]
    return (
        <>
          {WeatherDeatilsArray&& WeatherDeatilsArray.map((Details,i)=>{
             const{value , information , icon} = Details;
             return(
                <>
                  <SingleWeatherDeatails icon={icon} information={information} value={value} key={i}/>
                </>
             )
          })}

       
        </>
     
    )
}

export default WeatherDetails


export interface SingleWeatherDeatailsProps {
    information: string;
    icon: React.ReactNode;
    value: string;

}

function SingleWeatherDeatails(props:SingleWeatherDeatailsProps) {
    return (
        <div className=' flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80 pr-10'>
            <p className='whitespace-nowrap'>{props.information} </p>
            <div className='text-3xl'>{props.icon}</div>
            <p>{props.value}</p>

        </div>
    )
    
}