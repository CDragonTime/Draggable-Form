import Demo1 from './Component/Demo1'
import { DatePicker, TimePicker, Calendar } from './Component/index'
import './index.less'
import { FormInstance, message, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect, useState, useRef } from 'react'

export default function ChatMgtList(props) {
  return (
    <Row justify='space-between' wrap={true}>
      <Col span='8'>
        <Demo1 />
      </Col>
      <Col span='8'>
        <DatePicker defaultValue={moment('2022-04-02')} />
        {/* <TimePicker defaultValue={moment('2022-04-02')} /> */}
        <Calendar />
      </Col>
      <Col span='8'>
        {/* <Demo2 /> */}
      </Col>
    </Row>
  )
}
