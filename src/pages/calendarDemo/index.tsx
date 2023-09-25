import moment from 'moment'
import Demo1 from './Component/Demo1'
import Demo2 from './Component/Demo2'
import MyDatePicker from './Component/MyTimePicker'
import './index.less'
import { FormInstance, message, DatePicker, Tooltip, Modal, Space, Drawer, Col, Row, Button, Radio, Divider, Select } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function ChatMgtList(props) {
  return (
    <Row justify='space-between' wrap={true}>
      <Col span='8'>
        <Demo1 />
      </Col>
      <Col span='8'>
        <MyDatePicker onChange={(e)=>{
          console.log(moment.isMoment(e),"-=-=-=-=-==--=-=")
          console.log(dayjs.isDayjs(e),"-=-=-=-=sdflj-==--=-=")
        }}/>
      </Col>
      <Col span='8'>
        <Demo2 />
      </Col>
    </Row>
  )
}
