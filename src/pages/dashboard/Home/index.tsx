/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 18:27:59
 * @LastEditTime: 2023-06-25 21:54:46
 * @Description:
 * @FilePath: /umi-test/src/pages/Home/index.tsx
 */
import { useModel } from '@umijs/max'
import { Button, Col, Row,Form, Input, Space } from 'antd'
import React, { useState } from 'react'
import HeaderEdit from './HeaderEdit'
import './index.less'

const HomePage: React.FC = () => {
  const [complaintHeaderEdit, setComplaintHeaderEdit] = useState<boolean>(false)

  const onClose = () => {
    setComplaintHeaderEdit(false)
  }
  return (
    <>   <Row>
      <Col>
        <Button
          onClick={() => {
            setComplaintHeaderEdit(true)
          }}
        >
          Draggerable
        </Button>
      </Col>
      {complaintHeaderEdit && <HeaderEdit onClose={onClose} />}
    </Row>
    </>

  )
}

export default HomePage
