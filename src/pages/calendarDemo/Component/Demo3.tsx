import { Calendar, ConfigProvider } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'
import momentGenerateConfig from 'rc-picker/es/generate/moment'
import React from 'react'

export const MyCalendar = (props) => {
  const CustomCalendar = Calendar.generateCalendar<Moment>(momentGenerateConfig)

  return (
    <ConfigProvider components={{ Calendar: CustomCalendar }}>
      <Calendar {...props} />
    </ConfigProvider>
  )
}
