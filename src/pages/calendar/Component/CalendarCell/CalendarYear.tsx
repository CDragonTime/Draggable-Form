import React, { useState, useEffect } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Badge, BadgeProps, Row, Tooltip } from 'antd'
import { CalendarData, ColorStatus, MonthName, WEEK_TITLE_LIST } from '../Types'
import CellRender from './CellRender'

interface CalendarProps {
  current: Dayjs
  calendarList: CalendarData[]
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
const useCalendarMatrix = (year: number): CalendarMatrix[][] => {
  const calendarMatrix: CalendarMatrix[][] = []

  for (let month = 0; month < 12; month++) {
    const monthStart = dayjs().year(year).month(month).startOf('month')
    const monthEnd = dayjs().year(year).month(month).endOf('month')
    const startDayOfWeek = monthStart.day()
    const totalDaysInMonth = monthEnd.date()
    const totalWeeksInMonth = Math.ceil((totalDaysInMonth + startDayOfWeek) / 7)

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

const Calendar: React.FC<CalendarProps> = ({ current, calendarList }) => {
  const calendarMatrix = useCalendarMatrix(current.year())

  return (
    <div className='year-calendar'>
      {calendarMatrix.map((monthMatrix, monthIndex) => (
        <div key={monthIndex} className='month-container'>
          <h3>{`${MonthName[monthIndex]}`}</h3>
          <table>
            <thead>
              <tr>
                {WEEK_TITLE_LIST.map((v, index) => (
                  <th style={index === 0 ? { color: '#f5222d' } : {}} key={`${monthIndex}-head-${index}`}>
                    <div className='every'>{v?.[0]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthMatrix?.map((week: any, weekIndex) => (
                <tr key={weekIndex}>
                  {week?.map((day, colIndex) => {
                    return (
                      <td key={`${monthIndex}-${weekIndex}-${colIndex}`}>{<CellRender currentDate={day} calendarList={calendarList} />}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default Calendar
