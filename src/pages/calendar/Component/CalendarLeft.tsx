import CalendarItem from './CalendarCell/CalendarItem'
import { CalendarData, DIVIDER_COLOR, ModeTypes, NoticeType, StockData } from './Types'
import type { BadgeProps, DividerProps } from 'antd'
import { Badge, Button, Calendar, Checkbox, Col, Divider, Dropdown, Popover, Radio, Row, Space } from 'antd'
import { CalendarMode } from 'antd/es/calendar/generateCalendar'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import type { Dayjs } from 'dayjs'
import React, { useState } from 'react'

const PersonalDivider: React.ReactNode = <Divider style={{ borderColor: DIVIDER_COLOR, margin: '16px 0' }} />
interface IProps {
  isTech: boolean
  modeType: ModeTypes
  setModeType: (e: ModeTypes) => void
  onPanelChange?: (value: Dayjs, mode: CalendarMode) => void
  stockList?: StockData[]
  stockListActiveKeys?: any[]
  setStockListActiveKeys?: (e) => void
  calendarList?: CalendarData[]
  dateDayjs: Dayjs
  area: string
  getDataList: () => void
}
export const ModalTitle = {
  [NoticeType.PUSH]: 'PUSH',
  [NoticeType.EMAIL_TEMPLATE]: 'Email-Unified template',
  [NoticeType.EMAIL_CONTENT]: 'Email-Custom content',
  [NoticeType.MARQUEE]: 'Marquee',
}

const App: React.FC<IProps> = (props) => {
  const {
    modeType,
    dateDayjs,
    stockList,
    calendarList,
    isTech,
    stockListActiveKeys,
    setModeType,
    onPanelChange,
    setStockListActiveKeys,
    getDataList,
    area,
  } = props
  const [noticeType, setNoticeType] = useState(null)
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setStockListActiveKeys(checkedValues)
  }

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
      {PersonalDivider}
      <CalendarItem modeType={modeType} headerRender={true} onPanelChange={onPanelChange} calendarList={calendarList} />
      <>
        {PersonalDivider}
        <h4 className='calendar-left-padding'>Notification</h4>
        <Row className='calendar-left-padding' justify='space-between'>
          <Button size='small' type='primary' onClick={() => setNoticeType(NoticeType.PUSH)}>
            Push
          </Button>
          <Popover
            content={
              <Space>
                <Button size='small' type='primary' onClick={() => setNoticeType(NoticeType.EMAIL_TEMPLATE)}>
                  Unified template
                </Button>
                <Button size='small' type='primary' onClick={() => setNoticeType(NoticeType.EMAIL_CONTENT)}>
                  Custom content
                </Button>
              </Space>
            }
            title={null}
          >
            <Button size='small' type='primary'>
              Email
            </Button>
          </Popover>
          <Button size='small' type='primary' onClick={() => setNoticeType(NoticeType.MARQUEE)}>
            Marquee
          </Button>
        </Row>
      </>
      {PersonalDivider}
      <h4 className='calendar-left-padding'>Calendar</h4>
      <Checkbox.Group className='calendar-left-padding' style={{ width: '100%' }} value={stockListActiveKeys} onChange={onChange}>
        <Row>
          {stockList
            ?.sort((a, b) => a.priority - b.priority)
            .map((v) => (
              <Col span={24} key={v.stockType}>
                <Checkbox key={v.stockType} value={v.stockType}>
                  {v.stockName}
                </Checkbox>
              </Col>
            ))}
        </Row>
      </Checkbox.Group>
    </>
  )
}

export default App
