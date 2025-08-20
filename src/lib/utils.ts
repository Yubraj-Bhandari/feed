import { clsx, type ClassValue } from "clsx"
//clsx is a utility to conditionally join class names
import { twMerge } from "tailwind-merge"

//utility to combine class names 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
  //twMerge ley classes haru conflict remove garxa
}

//custom utility for truncating text
export function truncateText(text:string, maxLength:number):string{
  if(text.length <= maxLength) return text
  //if text is short than max length, return text as it is 
  return text.slice(0,maxLength) + '...'
  //else cut it down and add ...
  
}
//format date utility
export function formatDate(date:Date| string):string{
  return new Intl.DateTimeFormat('en-US',{
    month:'short',
    day:'numeric',
    year:'numeric'
  }).format(new Date(date))
}
