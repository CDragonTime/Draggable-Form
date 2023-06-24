import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { Form, Modal, message, Col, Row, Divider, DatePicker, Space, Empty, Button, Spin, Popconfirm } from 'antd'
import EditLeft from './Component/EditLeft'
import CenterList from './Component/CenterList'
import EditRight from './Component/EditRight'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DragItem, types, Form_Type, Base_Type, Drag_List, Base_Type_Value } from './Component/Types'
import PreviewForm from './Component/PreviewForm'
import { ContactsOutlined, FontColorsOutlined, SaveFilled, EyeFilled, FormOutlined } from '@ant-design/icons'

interface IProps {
  onClose?: () => void
}

const findKeyByValue = (obj, value) => {
  for (const key in obj) {
    if (obj[key] === value) {
      return key
    }
  }
  return null // 没有找到匹配的键
}

const Index: React.FC<IProps> = (props) => {
  const { onClose } = props
  const rightFormRef = useRef(null)
  const [selectData, setSelectData] = useState<DragItem>(null)
  const [isPreview, setIsPreview] = useState<DragItem[] | boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sortableList, setSortableList] = useState<DragItem[]>([])

  const onSubmit = async () => {
    onClose()
  }
  useEffect(() => {
    initJsonData()
  }, [])

  const initJsonData = async () => {
    setLoading(true)
    try {
      let res = []
      setSortableList(res)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }
  /**
   * 保存操作
   */
  const saveData = async () => {
    if (sortableList.some((v) => !v.code)) {
      message.error('Code is a unique field.')
      return
    }
    if (sortableList.some((v) => v.isValidateError)) {
      message.error('Please check and repair the red line configuration.')
      return
    }
    const columnList = sortableList.map((item: DragItem, index) => {
      return {
        ...item,
        sort: index,
        displayReport: item?.displayReport ? 1 : 0,
        displayFrom: item?.displayFrom ? 1 : 0,
        mandatory: item?.mandatory ? 1 : 0,
        edit: item?.edit ? 1 : 0,
        search: item?.search ? 1 : 0,
        type: Base_Type_Value[item.type],
      }
    })
    console.log(columnList, 'list-list-list-columnList')
    const res = await new Promise(()=>{})
    res && message.success('save success')
  }

  return (
    <Modal
      className='complaints-edit'
      style={{ top: '10vh' }}
      width={'80vw'}
      title={`Create new`}
      onCancel={() => onClose()}
      open={true}
      footer={false}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <DndProvider backend={HTML5Backend}>
          <Divider />
          <Row style={{ height: '80vh' }}>
            <Col span={5} className={'filled-area'}>
              <EditLeft sortableList={sortableList} setSortableList={setSortableList} defaultList={Drag_List} />
            </Col>
            <Col span={13} className={'filled-area'}>
              <div className='right-divider'>
                <Row justify='space-between' align='middle' className='list-divider'>
                  <h3>Form</h3>
                  <div className='cursor'>
                    <Space size={20}>
                      <Popconfirm
                        onConfirm={() => {
                          saveData()
                        }}
                        onCancel={() => {}}
                        title={'Confirm Save?'}
                      >
                        <Row align='middle'>
                          <SaveFilled />
                          &nbsp;Save
                        </Row>
                      </Popconfirm>
                      {isPreview && (
                        <Row
                          align='middle'
                          onClick={() => {
                            setIsPreview(null)
                          }}
                        >
                          <FormOutlined />
                          <>&nbsp;Back to edit</>
                        </Row>
                      )}
                      {!isPreview && (
                        <Row
                          align='middle'
                          onClick={() => {
                            setIsPreview(sortableList)
                          }}
                        >
                          <EyeFilled />
                          <>&nbsp;Preview</>
                        </Row>
                      )}
                    </Space>
                  </div>
                </Row>
                {!isPreview && (
                  <CenterList
                    selectData={selectData}
                    setSelectData={setSelectData}
                    sortableList={sortableList}
                    setSortableList={setSortableList}
                  />
                )}
                {isPreview && <PreviewForm sortableList={sortableList} onReloadDetail={initJsonData} />}
              </div>
            </Col>
            <Col span={6} className={'filled-area'}>
              {selectData ? (
                <EditRight
                  key={selectData?.createTime}
                  selectData={selectData}
                  sortableList={sortableList}
                  setSortableList={setSortableList}
                  setSelectData={setSelectData}
                />
              ) : (
                <Empty />
              )}
            </Col>
          </Row>
        </DndProvider>
      </Spin>
    </Modal>
  )
}

export default Index
