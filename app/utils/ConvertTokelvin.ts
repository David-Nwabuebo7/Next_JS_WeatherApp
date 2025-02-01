



 export function ConvertToCelsius(tempKelvin:number):number {
    const celsuis = tempKelvin - 273.15
    const WholeNumber = Math.floor(celsuis)
     return WholeNumber;
    
 }