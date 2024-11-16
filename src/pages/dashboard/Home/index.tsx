/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 18:27:59
 * @LastEditTime: 2023-06-25 21:54:46
 * @Description:
 * @FilePath: /umi-test/src/pages/Home/index.tsx
 */
import { Button, Col, Row, Tabs } from 'antd'
import React, { useState } from 'react'
import HeaderEdit from './HeaderEdit'
import './index.less'
import IMChat from './IMChat'
import MQTTChat from './MQTTChat'
import MQTTChatAll from './MQTTChatAll'
import Editor from '../Editor/Editor'

const HomePage: React.FC = () => {
  const [complaintHeaderEdit, setComplaintHeaderEdit] = useState<boolean>(false)

  const onClose = () => {
    setComplaintHeaderEdit(false)
  }
  return (
    <>
      <Row>
        {/* <Col>
          <Button
            onClick={() => {
              setComplaintHeaderEdit(true)
            }}
          >
            Draggerable
          </Button>
        </Col> */}
        {/* {complaintHeaderEdit && <HeaderEdit onClose={onClose} />}
        <Tabs
          defaultActiveKey={'3'}
          items={[
            {
              key: '1',
              label: 'WebSocket',
              children: <IMChat />,
            },
            // {
            //   key: '2',
            //   label: 'MQTT',
            //   children: <MQTTChat />,
            // },
            {
              key: '3',
              label: 'MQTTALL',
              children: <MQTTChatAll />,
            },
          ]}
        ></Tabs> */}
        <Editor />
      </Row>
    </>
  )
}

export default HomePage
