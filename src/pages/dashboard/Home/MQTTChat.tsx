import { Msg_Status } from './IMChat'
import { LoadingOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import { Layout, Input, Button, List, Avatar, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import mqtt from 'mqtt'
import React, { useState, useEffect } from 'react'
import { v4 } from 'uuid'

const MQTT_HOST = 'ws://localhost:1883' // MQTT连接地址

const Chat = () => {
  const [messagesMap, setMessagesMap] = useState(new Map())
  const [newMessage, setNewMessage] = useState('')
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  console.log(currentUser, '-=-=currentUser-=-=')

  useEffect(() => {
    // 建立一个 MQTT 连接
    window.websocket = mqtt.connect(MQTT_HOST, {
      clientId: 'client_' + v4()?.slice(0, 10),
      username: 'user-' + v4(),
      keepalive: 10,
      reconnectPeriod: 1000,
    })
    window.websocket.on('connect', () => {
      console.log('connect success============' + new Date().toString())
    })
    window.websocket.on('reconnect', () => {
      // console.log("reconnect ============" + new Date().toString());
    })
    window.websocket.on('error', (e: any) => {
      console.log('error============')
      // "Connection refused: Bad username or password"
      if (e.code === 4) {
        // 跳转到登录；
      }
    })
    window.websocket.on('message', (topic, message) => {
      // debugger

      const receivedData = JSON.parse(message)

      setMessagesMap((prevMap) => {
        const updatedMap = new Map(prevMap)
        const existingMessage = updatedMap.get(receivedData.id)

        if (existingMessage) {
          existingMessage.status = receivedData.status
          updatedMap.set(receivedData.id, existingMessage)
        } else {
          updatedMap.set(receivedData.id, receivedData)
        }

        console.log('Message successfully received by MQTT server')
        return updatedMap
      })
    })

    return () => {
      if (window.websocket.connected) {
        window.websocket.end() // 关闭 MQTT 连接
        console.log('MQTT connection closed')
      }
    }
  }, []) // 依赖数组为空，表示只在组件卸载时执行清理操作

  const handleSendMessage = (content, sender) => {
    const messageID = v4()
    const messagePublish = { id: messageID, content, sender, status: Msg_Status.waitingSend }
    const newMessagesMap = new Map(messagesMap)
    newMessagesMap.set(messageID, messagePublish)
    setMessagesMap(newMessagesMap)
    window.websocket.publish('SUPPORT', JSON.stringify(messagePublish))
  }

  return (
    <div style={{ width: 1000, height: 800, position: 'relative' }}>
      <div style={{ padding: '16px', background: '#d0f2f5', overflowY: 'auto', height: 600 }}>
        <List
          itemLayout='horizontal'
          dataSource={[...messagesMap.values()]}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: item.sender === 'CustomerService' ? 'flex-end' : 'flex-start' }}>
              <List.Item.Meta
                avatar={<Avatar icon={item.sender === 'User' ? 'user' : 'robot'} />}
                title={item.sender}
                description={
                  <Space size={20}>
                    <h4>{item.content}</h4>
                    {item.status === Msg_Status.waitingSend && <LoadingOutlined />}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <div style={{ padding: '16px', background: '#fff', position: 'sticky', bottom: 0 }}>
        <Space size={10}>
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={() => handleSendMessage(newMessage, 'User')}
            placeholder='Type your message here...'
            style={{ marginBottom: '12px' }}
          />
          <Button type='primary' onClick={() => handleSendMessage(newMessage, 'User')} style={{ float: 'right' }}>
            Send
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Chat
