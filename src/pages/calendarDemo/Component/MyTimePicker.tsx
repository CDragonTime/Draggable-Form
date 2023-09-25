import { DatePicker } from 'antd'
import type { Moment } from 'moment'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import React from 'react'

const Index = (props) => {
  const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig)
  return <MyDatePicker {...props} />
}
export default Index
