import { Msg_Status } from './IMChat'
import { LoadingOutlined } from '@ant-design/icons'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useModel } from '@umijs/max'
import { Layout, Input, Button, List, Avatar, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import mqtt from 'mqtt'
import React, { useState, useEffect } from 'react'
import { v4 } from 'uuid'

const MQTT_HOST = 'ws://10.0.211.252:1883' // MQTT连接地址

// 限制全局window报错
declare global {
  interface Window {
    webull: any
    websocket: any
  }
}

const Chat = () => {
  const [messagesMap, setMessagesMap] = useState(new Map())
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // 初始化 FingerprintJS 实例
    const fpPromise = FingerprintJS.load()
    // 获取浏览器指纹
    fpPromise
      .then((fp) => fp.get())
      .then((result) => {
        // 这是访问者标识符
        const visitorId = result.visitorId
        console.log(visitorId)
        // 根据浏览器指纹生成唯一的用户名
        const uniqueUsername = 'user-' + visitorId
        window.webull = {
          username: uniqueUsername,
        }
        window.websocket = mqtt.connect(MQTT_HOST, {
          wsOptions: {}, //是WebSocket连接选项。默认为 {} 。它特定于 WebSocket。有关可能的选项，请查看：https://github.com/websockets/ws/blob/master/doc/ws.md。
          clientId: 'client_' + v4()?.slice(0, 10),
          // username: 'user-' + v4(), //用户名，后端用来集合是否多个长链接属于一个用户
          username: uniqueUsername,
          keepalive: 20, //心跳消息的频率
          reconnectPeriod: 1000,
        })
        window.websocket.on('connect', () => {
          console.log('connect success============' + new Date().toString())
        })
        window.websocket.on('reconnect', () => {
          console.log('reconnect ============' + new Date().toString())
        })
        window.websocket.on('error', (e: any) => {
          console.log('error============')
          // "Connection refused: Bad username or password"
          if (e.code === 4) {
            // 跳转到登录；
          }
        })
        window.websocket.on('message', (topic, message) => {
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
      })

    return () => {
      if (window.websocket.connected) {
        window.websocket.end() // 关闭 MQTT 连接
        console.log('MQTT connection closed')
      }
    }
  }, [])

  const handleSendMessage = (content) => {
    const messageID = v4()
    const messagePublish = { id: messageID, content, sender: window.webull?.username, status: Msg_Status.waitingSend }
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
            <List.Item style={{ background: item.sender === window.webull?.username ? 'rgba(0,0,0,0.1)' : '#fff' }}>
              <List.Item.Meta
                avatar={<Avatar icon={item.sender === 'Robot' ? 'robot' : 'user'} />}
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
            onPressEnter={() => handleSendMessage(newMessage)}
            placeholder='Type your message here...'
            style={{ marginBottom: '12px' }}
          />
          <Button type='primary' onClick={() => handleSendMessage(newMessage)} style={{ float: 'right' }}>
            Send
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default Chat
