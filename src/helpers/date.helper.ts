export const dateToMiliseconds = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-")
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

//   export const validatyeRangeRecords 