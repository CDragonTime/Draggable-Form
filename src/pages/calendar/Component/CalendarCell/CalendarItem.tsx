import { CalendarData, ColorStatus, ModeTypes, getListData } from '../Types'
import CellRender from './CellRender'
import { Badge, BadgeProps, Calendar, Col, Row, Select, Tooltip, theme } from 'antd'
import type { CalendarMode } from 'antd/es/calendar/generateCalendar'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import React from 'react'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekdaysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
})

interface IProps {
  modeType: ModeTypes
  headerRender?: boolean
  calendarList?: CalendarData[]
  onPanelChange?: (value: Dayjs, mode: CalendarMode) => void
}
const App: React.FC<IProps> = (props) => {
  const { headerRender, onPanelChange, modeType, calendarList } = props
  const { token } = theme.useToken()
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
  }

  return (
    <div style={wrapperStyle}>
      {headerRender && <h3 />}
      <Calendar
        className={`calendar-month-item ${modeType === ModeTypes.YEAR && 'calendar-month-item-none'}`}
        dateFullCellRender={(current) => <CellRender currentDate={current} calendarList={calendarList} />}
        fullscreen={true}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          if (!headerRender) {
            return null
          }

          const start = 0
          const end = 12
          const monthOptions = []

          let current = value.clone()
          const localeData = value.localeData()
          const months = []
          for (let i = 0; i < 12; i++) {
            current = current.month(i)
            months.push(localeData.months(current))
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className='month-item'>
                {months[i]}
              </Select.Option>
            )
          }

          const year = value.year()
          const month = value.month()
          const options = []
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className='year-item'>
                {i}
              </Select.Option>
            )
          }
          return (
            <div style={{ padding: 8 }}>
              <Row gutter={8} justify='space-between'>
                <Col>
                  <Select
                    size='small'
                    dropdownMatchSelectWidth={false}
                    className='my-year-select'
                    value={year}
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear)
                      onChange(now)
                    }}
                  >
                    {options}
                  </Select>
                </Col>
                {modeType === ModeTypes.MONTH && (
                  <Col>
                    <Select
                      size='small'
                      dropdownMatchSelectWidth={false}
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth)
                        onChange(now)
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                )}
              </Row>
            </div>
          )
        }}
        onPanelChange={onPanelChange}
      />
    </div>
  )
}

export default App
