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

/**
 * 数字格式化
 * @param value
 * @returns
 */
export const handleChange = (value) => {
  if (value === null || value === undefined) {
    return
  }
  const intValue = parseInt(value.toString(), 10)
  if (isNaN(intValue) || intValue <= 0) {
    return
  }
  return intValue
}
export const formatter = (value) => {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  return String(value).replace(/[^0-9]/g, '')
}
export const parser = (value) => {
  return parseInt(value.toString().replace(/[^0-9]/g, ''), 10)
}
