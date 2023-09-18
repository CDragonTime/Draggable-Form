import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { CalendarData, ColorStatus, WEEK_TITLE_LIST, getListData } from '../Types'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import { Badge, BadgeProps, Row, Tooltip } from 'antd'
import e from 'express'
import CellListRender from './CellListRender'

type CellProps = {
  date: Dayjs // 循环日期
  isCurrentMonth: boolean // 是否当月时间
}
interface CalendarProps {
  current: Dayjs // current是所选择对应的时间
  cellRender: (cell: CellProps) => void // 渲染单元格
  calendarList: CalendarData[]
}
// 获取日历二维数组
export const useCalendarMatrix = (year: number, month: number): CellProps[][] => {
  const startDate = dayjs().year(year).month(month).startOf('month').startOf('week')
  const endDate = dayjs().year(year).month(month).endOf('month').endOf('week')
  const diffInDays = endDate.diff(startDate, 'day') + 1

  const calendarMatrix: CellProps[][] = Array(6)
    .fill(null)
    .map((_, rowIndex) =>
      Array(7)
        .fill(null)
        .map((_, colIndex) => {
          const currentDate = startDate.add(rowIndex * 7 + colIndex, 'day')
          return {
            date: currentDate,
            isCurrentMonth: currentDate.month() === month,
          }
        })
    )
  return calendarMatrix
}

const CalendarMatrix: React.FC<CalendarProps> = (props) => {
  const { current, cellRender, calendarList } = props
  const calendarMatrix = useCalendarMatrix(current.year(), current.month())

  const defaultCellRender = (cell: CellProps) => {
    const listData = getListData(cell.date, calendarList)
    const isToday = cell.date?.format('YYYY-MM-DD') === dayjs().add(0, 'days').format('YYYY-MM-DD')

    return (
      <td key={cell.date?.valueOf()} className={`current-month  ${listData.length && 'ul-events-data'}`}>
        <div className={`${!cell.isCurrentMonth ? 'opacity-month' : ''}`} style={{ height: '100%' }}>
          <h4 className={`${isToday && 'is-today'}`}> {cell.date?.date()}</h4>
          <ul className={`ul-events`}>
            {listData.map((item, index) => (
              <li key={`${item.stockType}-${index}`}>
                <Tooltip
                  color={'#fff'}
                  title={
                    <ul className='ul-events'>
                      {listData.map((item, index) => (
                        <li key={`${item.stockType}-${index}`}>
                          <Badge
                            status={ColorStatus[item.status]?.status as BadgeProps['status']}
                            text={<CellListRender isTitle={true} {...item} />}
                          />
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <Badge status={ColorStatus[item.status]?.status as BadgeProps['status']} text={<CellListRender {...item} />} />
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      </td>
    )
  }

  return (
    <Row className='month-calendar'>
      <table>
        <thead>
          <tr>
            {WEEK_TITLE_LIST.map((v, index) => (
              <th style={index === 0 ? { color: '#f5222d' } : {}} key={index}>
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                if (cellRender && typeof cellRender === 'function') {
                  cellRender(cell)
                } else {
                  return defaultCellRender(cell)
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Row>
  )
}

export default CalendarMatrix
