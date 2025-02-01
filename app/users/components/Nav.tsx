
'use client'


import React, { useState } from "react";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { LoadingCity, placeAtom } from "../../atom";
import { useAtom } from "jotai";

type Props = {
  location?: string
  country?: string
};



const NavBar = ({ location,country }: Props) => {

  const [City, SetCity] = React.useState('')
  const [Error, setError] = React.useState('')
  
  const [Suggestion, SetSuggestion] = React.useState<string[]>([])

  const [ShowSuggestion, SetShowSuggestion] = React.useState(false)
  const [Place, setPlace] = useAtom(placeAtom)
  const [Loading, setLoadingCity] = useAtom(LoadingCity)

  const Apikey = process.env.NEXT_PUBLIC_WEATHER_KEY

  // because the input data have to do with an api so we need to use aasync function
  async function GrabInputValue(value: string) {
    let Capitalisedvalue = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    SetCity(value)

    if (value.length >= 2) {
      try {

        const Response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${Capitalisedvalue}&appid=${Apikey}`)

        // this gives you  suggestion of location based on the possible location got fron the api
        const suggestion = Response?.data.list.map((item: any) => item.name)
        SetSuggestion(suggestion)
        SetShowSuggestion(true)

      } catch (error) {
        SetSuggestion([])
        SetShowSuggestion(false)

        console.log(error, Error);

      }
    } else {
      SetSuggestion([])
      SetShowSuggestion(false)
    }


  }


  function handleSuggestionClick(value: string) {
    SetCity(value)
    SetShowSuggestion(false)
  }

  function OnSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true)
    e.preventDefault()
    if (Suggestion.length === 0) {
      SetCity(City)
      setError('Location not found')
      setLoadingCity(false)
    } else {
      setError('')
      SetCity('')
      setTimeout(() => {
        setPlace(City)
        SetShowSuggestion(false)
        setLoadingCity(false)

      }, 500);

    }

  }

  function HandleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (Position) => {
        const { latitude, longitude } = Position.coords
        try {
          setLoadingCity(true)
          const Response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${Apikey}`)

            setTimeout(() => {
              setPlace(Response?.data.name)
              setLoadingCity(false)
            }, 500);

        } catch (error) {
            setLoadingCity(false)
        }
      })
    }


  }


  return (
    <>
       <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white border rounded-t-2xl">
      <div className="h-[80px]  w-full flex justify-between items-center max-w-7xl px-3 mx-auto">

        <span className=" flex items-center justify-start gap-2 ">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </span>

        <section className="flex items-center gap-2 justify-end">
          <MdMyLocation
            onClick={HandleCurrentLocation}
            title="Your Current Location"
            className="text-2xl text-gray-400 cursor-pointer hover:opacity-80" />
          <MdOutlineLocationOn className="text-3xl " />
          <p className="text-slate-900/80 text-sm">{`${location ? location : 'Lagos'},${country ? country :'Nigeria'}`}</p>

          <div className="relative hidden md:flex ">
            <SearchBox
              onChange={(e) => GrabInputValue(e.target.value)}
              value={City}
              onSubmit={OnSubmitSearch}
            />
            <SuggestionBox suggestion={Suggestion} error={Error} HandleSuggesstionClick={handleSuggestionClick} ShowSuggestion={ShowSuggestion} />
          </div>
        </section>
      </div>
    </nav>
    <section className="flex max-w-7xl px-3 md:hidden">
    <div className="relative ">
            <SearchBox
              onChange={(e) => GrabInputValue(e.target.value)}
              value={City}
              onSubmit={OnSubmitSearch}
            />
            <SuggestionBox suggestion={Suggestion} error={Error} HandleSuggesstionClick={handleSuggestionClick} ShowSuggestion={ShowSuggestion} />
          </div>
    </section>
    
    </>
 
  );
};

export default NavBar;

type SuggestionProps = {
  ShowSuggestion: boolean;
  suggestion: string[];
  HandleSuggesstionClick: (item: string) => void;
  error: string;
}



function SuggestionBox(props: SuggestionProps) {
  const {
    ShowSuggestion,
    suggestion,
    HandleSuggesstionClick,
    error,
  } = props


  return (<>{((suggestion.length > 1 && ShowSuggestion) || error) &&
    (<ul className="mb-4 bg-white absolute top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
      {(error && suggestion.length < 1) && (<li className="text-red-400 p-1">{error}</li>)}
      {suggestion.map((data, index) => {
        return (
          <>
            <li className="cursor-pointer p-1 rounded hover:bg-gray-200" key={index} onClick={() => HandleSuggesstionClick(data)}>
              {data}
            </li>
          </>
        )

      })}

    </ul>)

  }
  </>)
}