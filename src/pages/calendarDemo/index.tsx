import Demo1 from './Component/Demo1'
import './index.less'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'

const { RangePicker } = DatePicker

const defaultYear = dayjs()

export default function ChatMgtList(props) {
  // 生成一个包含一整年所有日期的数组
  const getDaysInYear = (year) => {
    return Array.from({ length: 12 }, (_, i) => dayjs().year(year).month(i).startOf('month'))
  }
  console.log(getDaysInYear("2022"),"-=-==-=--=-=-=-=")

  return (
    <Row justify='space-between' wrap={true}>
      <Col span='8'>
        <Demo1 />
      </Col>
      <Col span='8'></Col>
      <Col span='8'></Col>
    </Row>
  )
}
