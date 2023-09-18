import Demo1 from './Component/Demo1'
import './index.less'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState, useRef } from 'react'

const { RangePicker } = DatePicker

const defaultYear = dayjs()

export default function ChatMgtList(props) {
  return (
    <Row justify='space-between' wrap={true}>
      <Col span='8'>
        <Demo1 />
      </Col>
      <Col span='8'>
        <Demo1 />
      </Col>
      <Col span='8'>
        <Demo1 />
      </Col>
    </Row>
  )
}
