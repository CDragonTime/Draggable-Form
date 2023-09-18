import CalendarItem from './CalendarCell/CalendarItem'
import { CalendarData, ModeTypes, StockData } from './Types'
import { Badge, Button, Calendar, Checkbox, Col, Divider, Dropdown, Modal, Popover, Radio, Row, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import React, { useState } from 'react'

interface IProps {
  modeType: ModeTypes
  setModeType: (e: ModeTypes) => void
}

const App: React.FC<IProps> = (props) => {
  const { modeType, setModeType } = props
  const [calendarDemo, setCalendarDemo] = useState(0)

  return (
    <>
      <h2 />
      <Row justify='space-between' align='middle' className='calendar-left-padding'>
        <Col>
          <h4>Display:</h4>
        </Col>
        <Col>
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
        </Col>
      </Row>
    </>
  )
}

export default App
