export function normalTime(time: string): string {
    //if hour bw 0-11 return AM
    if(Number(time.split(":")[0]) == 0) {
        return "12:" + time.split(":")[1] + " AM";
    }
    if (Number(time.split(":")[0]) < 12) return time + " AM";
    //if hour bw 12-23 return PM
    if (Number(time.split(":")[0]) == 12) {
    return (parseInt(time.split(":")[0])) + ":" + time.split(":")[1] + " PM";
}
   return (parseInt(time.split(":")[0]) - 12) + ":" + time.split(":")[1] + " PM";
}