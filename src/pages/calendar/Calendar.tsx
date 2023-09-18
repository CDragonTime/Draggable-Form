import CalendarMonth from './Component/CalendarCell/CalendarMonth'
import CalendarYear from './Component/CalendarCell/CalendarYear'
import CalendarLeft from './Component/CalendarLeft'
import { CalendarData, ModeTypes } from './Component/Types'
import { DownloadOutlined } from '@ant-design/icons'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import { CalendarMode } from 'antd/es/calendar/generateCalendar'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'
import './index.less'

const { RangePicker } = DatePicker

const defaultYear = dayjs()
const defaultMonth = new Date().getMonth()

export default function ChatMgtList(props) {
  const { isTech, area, activeKey } = props
  const [modeType, setModeType] = useState(ModeTypes.MONTH)
  const [dateDayjs, setDateDayjs] = useState(defaultYear)
  const [stockList, setStockList] = useState([])
  const [stockListActiveKeys, setStockListActiveKeys] = useState([])
  const [calendarList, setCalendarList] = useState<CalendarData[]>([])

  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    setDateDayjs(value)
  }
  const getDataList = () => {}

  return (
    <Row className='calendar-view'>
      <Col flex='200px' className='calendar-view-left'>
        <CalendarLeft
          isTech={isTech}
          area={area}
          stockList={stockList}
          stockListActiveKeys={stockListActiveKeys}
          setStockListActiveKeys={setStockListActiveKeys}
          modeType={modeType}
          setModeType={setModeType}
          onPanelChange={onPanelChange}
          calendarList={calendarList}
          dateDayjs={dateDayjs}
          getDataList={getDataList}
        />
      </Col>
      <Col flex='auto' style={{ overflowX: 'auto' }}>
        {modeType === ModeTypes.YEAR && <CalendarYear calendarList={calendarList} current={dateDayjs} />}
        {modeType === ModeTypes.MONTH && <CalendarMonth calendarList={calendarList} cellRender={null} current={dateDayjs} />}
      </Col>
    </Row>
  )
}
