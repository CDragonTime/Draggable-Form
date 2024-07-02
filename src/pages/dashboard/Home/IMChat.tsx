import { LoadingOutlined } from '@ant-design/icons'
import { Button, List, Avatar, Space } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useEffect } from 'react'
import { v4 } from 'uuid'

let ws

export enum Msg_Status {
  hide = -100,
  sendFail = -1,
  waitingSend = 0,
  success = 1,
  delete = 3, //删除
  revoke = 4, //撤回
}

const Chat = () => {
  const [messagesMap, setMessagesMap] = useState(new Map())
  const [newMessage, setNewMessage] = useState('')

  const connectWebSocket = () => {
    ws = new WebSocket('ws://localhost:1884')

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data)

      setMessagesMap((prevMap) => {
        const updatedMap = new Map(prevMap)
        const existingMessage = updatedMap.get(receivedData.id)

        if (existingMessage) {
          // Update the status of the existing message while keeping other properties unchanged
          existingMessage.status = receivedData.status
          updatedMap.set(receivedData.id, existingMessage)
        } else {
          updatedMap.set(receivedData.id, receivedData)
        }

        console.log('Message successfully received by server')
        return updatedMap
      })
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...')
      setTimeout(connectWebSocket, 3000) // 3秒后尝试重新连接
    }
  }

  useEffect(() => {
    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const handleSendMessage = (content, sender) => {
    const messageID = v4()
    const messagePublish = { id: messageID, content, sender, status: Msg_Status.waitingSend }
    const newMessagesMap = new Map(messagesMap)
    newMessagesMap.set(messageID, messagePublish)
    setMessagesMap(newMessagesMap)
    ws.send(JSON.stringify(messagePublish))
  }

  return (
    <div style={{ width: 1000, height: 800, position: 'relative' }}>
      <div style={{ padding: '16px', background: '#f0f2f5', overflowY: 'auto', height: 600 }}>
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
