type Date = {
  start_date: Date | string | globalThis.Date
  end_date: Date | string | globalThis.Date
}

export const FormatDate = (start_date: string, end_date: string, timezone = '-4'): Date => {
  let filter: Date = {
    start_date,
    end_date,
  }

  if (start_date && end_date) {
    if (start_date === end_date) {
      const [year, month, day] = start_date.split('-')

      const start = new Date(`${month}-${day}-${year} 00:00:00${timezone}`)
      const end = new Date(`${month}-${day}-${year} 23:59:59${timezone}`)

      filter = {
        start_date: start,
        end_date: end,
      }
    } else {
      const [startYear, startMonth, startDay] = start_date.split('-')
      const [endYear, endMonth, endDay] = end_date.split('-')

      const end = new Date(`${endMonth}-${endDay}-${endYear} 23:59:59${timezone}`)
      const start = new Date(`${startMonth}-${startDay}-${startYear} 00:00:00${timezone}`)

      filter = {
        start_date: start,
        end_date: end,
      }
    }
  }

  return filter
}
