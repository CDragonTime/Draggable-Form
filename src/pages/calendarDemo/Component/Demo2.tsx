import type { BadgeProps, CalendarProps } from 'antd'
import { Badge } from 'antd'
import { MyCalendar } from "./Demo3"
import type { Moment } from 'moment';
import type { Dayjs } from 'dayjs'
import React from 'react'
import moment from 'moment';
import dayjs from 'dayjs';

const getListData = (value: Moment) => {
  // console.log(value.hours())
  if (value instanceof dayjs) {
    // 对象是dayjs对象
    console.log("This is a dayjs object.");
  } else if (value instanceof moment) {
    // 对象是moment对象
    console.log("This is a moment object.");
  } else {
    console.log("Unknown object type.");
  }
  return []
}

const getMonthData = (value: Moment) => {
  if (value.month() === 8) {
    return 1394
  }
}

const App: React.FC = () => {
  const monthCellRender = (value: Moment) => {
    const num = getMonthData(value)
    return num ? (
      <div className='notes-month'>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null
  }

  const dateCellRender = (value: Moment) => {
    const listData = getListData(value)
    return null
  }

  const cellRender: CalendarProps<Moment>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current)
    if (info.type === 'month') return monthCellRender(current)
    return info.originNode
  }

  return <MyCalendar className={'my-calendar'} cellRender={cellRender}/>
}

export default App
