import { CalendarData, CalendarMatrix, ColorStatus, MonthName, WEEK_TITLE_LIST, useCalendarMatrix } from '../Types'
import CellRender from './CellRender'
import { Badge, BadgeProps, Row, Tooltip } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState, useEffect } from 'react'

interface CalendarProps {
  current: Dayjs
  calendarList: CalendarData[]
}

const Calendar: React.FC<CalendarProps> = ({ current, calendarList }) => {
  const calendarMatrix = useCalendarMatrix(current.year())
  console.log(calendarMatrix, '-=--=-=-=-=calendarMatrix')

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
                  {week?.map((day: CalendarMatrix, colIndex) => {
                    return (
                      <td key={`${monthIndex}-${weekIndex}-${colIndex}`}>
                        <CellRender currentDate={day.isCurrentMonth ? day.date : null} calendarList={calendarList} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {/* {calendarMatrix.map((monthMatrix, monthIndex) => (
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
      ))} */}
    </div>
  )
}

export default Calendar
