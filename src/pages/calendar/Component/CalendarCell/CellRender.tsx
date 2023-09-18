import { ColorStatus, ModeTypes, getListData } from '../Types'
import CellListRender from './CellListRender'
import { Badge, BadgeProps, Calendar, Col, Row, Select, Tooltip, theme } from 'antd'
import type { CalendarMode } from 'antd/es/calendar/generateCalendar'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { CellRenderInfo } from 'rc-picker/lib/interface'
import React from 'react'

interface IProps {
  currentDate?: Dayjs
  calendarList: any
}
const cellRender: React.FC<IProps> = (props) => {
  const { currentDate, calendarList } = props
  if (!currentDate) {
    return <div className='every'>{''}</div>
  }

  const listData = getListData(currentDate, calendarList)
  const maxList = listData.map((v) => v.status)
  const isToday = currentDate?.format('YYYY-MM-DD') === dayjs().add(0, 'days').format('YYYY-MM-DD')

  if (!listData.length) {
    return (
      <div
        className={`every ${isToday && 'every-today'}`}
        style={{ border: `${listData.length ? 2 : 0}px solid ${ColorStatus[Math.min(...maxList)]?.color}` }}
      >
        {currentDate?.date()}
      </div>
    )
  }
  return (
    <Tooltip
      color={'#fff'}
      title={
        <ul className='ul-events'>
          {listData.map((item, index) => (
            <li key={`${item.stockType}-${index}`}>
              <Badge status={ColorStatus[item.status]?.status as BadgeProps['status']} text={<CellListRender isTitle={true} {...item} />} />
              {/* <CellListRender {...item} /> */}
            </li>
          ))}
        </ul>
      }
    >
      <div
        className={`every ${isToday && 'every-today'}`}
        style={{ border: `${listData.length ? 2 : 0}px solid ${ColorStatus[Math.min(...maxList)]?.color}` }}
      >
        {currentDate?.date() || ''}
      </div>
    </Tooltip>
  )
}
export default cellRender
