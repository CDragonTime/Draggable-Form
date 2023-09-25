import { CalendarData, CellProps, ColorStatus, WEEK_TITLE_LIST, getListData, mockCalendarData, useCalendarMonthMatrix } from '../Types'
import { Badge, BadgeProps, Row, Tooltip } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import React from 'react'

interface CalendarProps {
  current: Dayjs // current是所选择对应的时间
  cellRender: (cell: CellProps) => void // 渲染单元格
  calendarList: CalendarData[]
}

const CalendarMatrix: React.FC<CalendarProps> = (props) => {
  const { current, cellRender, calendarList } = props
  const calendarMatrix = useCalendarMonthMatrix(current.year(), current.month())

  const defaultCellRender = (cell: CellProps) => {
    // const listData = getListData(cell.date, calendarList)
    const listData = getListData(cell.date, mockCalendarData)
    const isToday = cell.date?.format('YYYY-MM-DD') === dayjs().add(0, 'days').format('YYYY-MM-DD')

    return (
      <td key={cell.date?.valueOf()} className={`current-month  ${listData.length ? 'ul-events-data' : 'ul-normal'}`}>
        <div className={`${!cell.isCurrentMonth ? 'opacity-month' : ''}`} style={{ height: '100%' }}>
          <span className={`${isToday && 'is-today'}`}> {cell.date?.date()}</span>
          <ul className={`ul-events`}>
            {listData.map((item, index) => (
              <li key={`${item.stockType}-${index}`}>
                <Badge
                  status={ColorStatus[item.status]?.status as BadgeProps['status']}
                  text={
                    <>
                      {' '}
                      <span className='list-render'>{`${item.stockType} (${item.time})`}</span>
                      <div className={'list-show'} style={{ marginLeft: 14 }}>{`${item.holidayName}`}</div>
                    </>
                  }
                />
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
                {v?.slice(0, 3)}
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
