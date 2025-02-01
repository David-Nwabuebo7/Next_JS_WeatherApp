

 export function ConvertWindSpeed(SpeedInMeterPerSeconds:number):string {
     const SpeedInKilometerPerHour = SpeedInMeterPerSeconds * 3.6
     return `${SpeedInKilometerPerHour.toFixed(0)}Km/h`
    
 }