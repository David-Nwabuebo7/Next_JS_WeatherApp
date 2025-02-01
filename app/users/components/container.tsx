import React from 'react'
import { cn } from '../../utils/cn'


const container = (props:React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} className={cn('w-full bg-white flex py-4 rounded-xl border shadow-sm ',props.className)}   />

  )
}

export default container