import CalendarMonth from './Component/CalendarCell/CalendarMonth'
import CalendarYear from './Component/CalendarCell/CalendarYear'
import CalendarLeft from './Component/CalendarLeft'
import { CalendarData, ModeTypes } from './Component/Types'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'
import './index.less'

const { RangePicker } = DatePicker

const defaultYear = dayjs()

export default function ChatMgtList(props) {
  const { isTech, area, activeKey } = props
  const [modeType, setModeType] = useState(ModeTypes.MONTH)
  const [dateDayjs, setDateDayjs] = useState(defaultYear)
  const [calendarList, setCalendarList] = useState<CalendarData[]>([])

  return (
    <Row>
      <Row>
        <CalendarLeft
          modeType={modeType}
          setModeType={setModeType}
        />
      </Row>
      <Row>
        {modeType === ModeTypes.YEAR && <CalendarYear calendarList={calendarList} current={dateDayjs} />}
        {modeType === ModeTypes.MONTH && <CalendarMonth calendarList={calendarList} cellRender={null} current={dateDayjs} />}
      </Row>
    </Row>
  )
}
