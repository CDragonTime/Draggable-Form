import CalendarMonth from './Component/CalendarCell/CalendarMonth'
import CalendarYear from './Component/CalendarCell/CalendarYear'
import { CalendarData, ModeTypes } from './Component/Types'
import './index.less'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select, Card } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'

const { RangePicker } = DatePicker

const defaultYear = dayjs()

export default function ChatMgtList(props) {
  const { isTech, area, activeKey } = props
  const [modeType, setModeType] = useState(ModeTypes.MONTH)
  const [dateDayjs, setDateDayjs] = useState(defaultYear)
  const [calendarList, setCalendarList] = useState<CalendarData[]>([])

  return (
    <Row style={{ background: '#fff' }}>
      <Col span={24}>
        <Card>
          <Radio.Group
            defaultValue={modeType}
            onChange={(e) => {
              setModeType(e.target.value)
            }}
            buttonStyle='solid'
          >
            <Radio.Button key={ModeTypes.MONTH} value={ModeTypes.MONTH}>
              Month
            </Radio.Button>
            <Radio.Button key={ModeTypes.YEAR} value={ModeTypes.YEAR}>
              Year
            </Radio.Button>
          </Radio.Group>
        </Card>
      </Col>
      <Row>
        <Card>
          {modeType === ModeTypes.YEAR && <CalendarYear calendarList={calendarList} current={dateDayjs} />}
          {modeType === ModeTypes.MONTH && <CalendarMonth calendarList={calendarList} cellRender={null} current={dateDayjs} />}
        </Card>
      </Row>
    </Row>
  )
}
