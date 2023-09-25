import dayjs, { Dayjs } from 'dayjs'

export enum ModeTypes {
  MONTH = 'month',
  YEAR = 'year',
}

export const ColorStatus = {
  1: {
    status: 'success',
    color: '#3dd200',
  },
  0: {
    status: 'error',
    color: '#f5222d',
  },
  2: {
    status: 'warning',
    color: '#faad14',
  },
  3: {
    status: 'processing',
    color: '#1890ff',
  },
  4: {
    status: 'default',
    color: '#d9d9d9',
  },
}

export const MonthName = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

export const WEEK_TITLE_LIST = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export type CalendarData = {
  date: string
  items: CalendarDataList[]
}
export type CalendarDataList = {
  priority: number // 排序字段
  holidayName: string
  status: number
  stockType: string
  time: string
}

export declare type StockData = {
  priority: number // 排序字段
  createTime: string
  creatorId: string
  id: number
  status: number
  stockDesc: string
  stockName: string
  stockType: string
  timeZoneDesc: string
  updateTime: string
  updaterId: string
}

export enum OperationType {
  MAKE_EFFECTIVE = 'MAKE_EFFECTIVE',
  DISABLE = 'DISABLE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
}

export enum ListType {
  EFFECTIVE = 'Effective',
  APPROVAL = 'Approval',
}

/**
 *  获取当前value日期，对应的日历数据
 * @param value
 * @param calendarData
 * @returns
 */
export const getListData = (value: Dayjs, calendarData: CalendarData[]) => {
  const dataFind = calendarData?.find((v) => v.date === value?.format('YYYY-MM-DD'))
  let listData: CalendarDataList[] = []
  if (dataFind) {
    listData = dataFind.items
  }
  listData.sort((a, b) => a.priority - b.priority)
  return listData || []
}

interface CalendarMatrix {
  date: dayjs.Dayjs | null
  isCurrentMonth: boolean
}
/**
 * 获取对应年份枚举
 * @param year 对应年份
 * @returns
 */
export const useCalendarMatrix = (year: number): CalendarMatrix[][] => {
  const calendarMatrix: CalendarMatrix[][] = []

  for (let month = 0; month < 12; month++) {
    const monthStart = dayjs().year(year).month(month).startOf('month')
    const monthEnd = dayjs().year(year).month(month).endOf('month')
    const startDayOfWeek = monthStart.day()
    const totalDaysInMonth = monthEnd.date()
    const totalWeeksInMonth = Math.ceil((totalDaysInMonth + startDayOfWeek) / 7)

    // debugger
    const matrix: CalendarMatrix[] = []
    let weekNumber = 1
    let dateIndex = 1

    for (let week = 1; week <= totalWeeksInMonth; week++) {
      const dates: any = []
      for (let day = 0; day < 7; day++) {
        if ((week === 1 && day < startDayOfWeek) || dateIndex > totalDaysInMonth) {
          dates.push(null)
        } else {
          const date = dayjs().year(year).month(month).date(dateIndex)
          dates.push(date)
          dateIndex++
        }
      }
      matrix.push(dates)
      weekNumber++
    }

    calendarMatrix.push(matrix)
  }

  return calendarMatrix
}

export type CellProps = {
  date: Dayjs // 循环日期
  isCurrentMonth: boolean // 是否当月时间
}
// 获取日历二维数组
export const useCalendarMonthMatrix = (year: number, month: number): CellProps[][] => {
  const startDate = dayjs().year(year).month(month).startOf('month').startOf('week')

  const calendarMatrix: CellProps[][] = Array(6).fill(null).map((_, rowIndex) =>
    Array(7).fill(null).map((_, colIndex) => {
      const currentDate = startDate.add(rowIndex * 7 + colIndex, 'day')
      return {
        date: currentDate,
        isCurrentMonth: currentDate.month() === month,
      }
    })
  )
  return calendarMatrix
}





export const mockCalendarData = [
  {
      "date": "2023-01-16",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Martin Luther King Day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-01-02",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "New year's day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-06-19",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Juneteenth National Independence Day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-05-29",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Memorial day",
              "time": "00:00-23:59 ET",
              "status": 1
          }
      ]
  },
  {
      "date": "2023-04-07",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Good friday",
              "time": "00:00-23:59 ET",
              "status": 1
          }
      ]
  },
  {
      "date": "2023-02-20",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Presidents day",
              "time": "00:00-23:59 ET",
              "status": 1
          }
      ]
  },
  {
      "date": "2023-09-08",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          },
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0907-跨天-EN",
              "time": "00:00-23:59 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-07-04",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "American Independence Day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-09",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-06",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-不跨天-EN",
              "time": "00:00-23:59 ET",
              "status": 0
          },
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-07",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          },
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0907-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-04",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "labor day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-05",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Christmas day",
              "time": "00:00-23:59 ET",
              "status": 0
          },
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0905-EN",
              "time": "00:00-23:59 ET",
              "status": 1
          }
      ]
  },
  {
      "date": "2023-12-25",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Christmas",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-11",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-11-23",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "Thanksgiving Day",
              "time": "00:00-23:59 ET",
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-12",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-23:59 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-10-01",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "测试节日-01",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-10-02",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "测试节日-01",
              "time": "00:00-23:59 ET",
              "priority": 1,
              "status": 0
          }
      ]
  },
  {
      "date": "2023-09-10",
      "items": [
          {
              "stockType": "US_STOCK",
              "stockName": "US Stocks",
              "holidayName": "节日-0906-跨天-EN",
              "time": "00:00-24:00 ET",
              "priority": 1,
              "status": 0
          }
      ]
  }
]
