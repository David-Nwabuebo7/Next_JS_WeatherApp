import React from 'react'
import {IoSearch} from 'react-icons/io5'
import { cn } from '../../utils/cn'

type Props = {
    className?:string
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>| undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement>| undefined;


    

}
//https://api.openweathermap.org/data/2.5/forecast?q=lagos&appid=4d2f63c69d5a1b17a46f14c361211092&cnt=2
const SearchBox = (props: Props) => {
  return (
    <form className={cn('flex relative items-center justify-center h-10',props.className)} onSubmit={props.onSubmit}>
        <input type="text" name="" className="px-4 py-2 w-[230px] border border-gray-300  focus:outline-none focus:border-blue-500 h-full rounded-l-md" placeholder='Search Location..' id='' onChange={props.onChange} value={props.value}/>
        <button className='px-4 py-[9px] bg-blue-500   items-center rounded-r-md focus:outline-none hover:bg-blue-600 h-full '><IoSearch className='text-white'/></button>
    </form>
  )
}

export default SearchBox