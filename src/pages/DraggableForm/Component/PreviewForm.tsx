import { isNull } from '@/public/fun'
import { Button, DatePicker, Form, Input, Radio, Row, Select, Space, message } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import { Base_Type, DragItem, Form_Type } from './Types'

const reg = /\.(png|jpe?g|gif|svg)(\?.*)?$/

const { RangePicker } = DatePicker
interface IProps {
  sortableList: DragItem[]
  isHaveSubmit?: boolean
  recordDetail?: any
  userId?: string
  bizId?: string
  formSpliceHead?: number
  isAdd?: boolean
  isPreview?: boolean
  onCancel?: () => void
  onReloadDetail?: () => void
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const paddingNumber = 10

const Index: React.FC<IProps> = (props) => {
  const [fileList, setFileList] = useState([])
  const [treeData, setTreeData] = useState(null)
  const targetRef = useRef(null)
  const { sortableList, isHaveSubmit, recordDetail, isAdd, userId, bizId, onCancel, formSpliceHead, onReloadDetail, isPreview } = props
  const [form] = Form.useForm()

  useEffect(() => {
    const { files = [] } = recordDetail || {}
    setFileList(files.map((item) => ({ ...item, response: { ...item } })))
  }, [recordDetail])

  const onSubmit = async () => {
    const values = await form.validateFields()
    const files = []
    if (fileList && fileList.length > 0) {
      fileList.forEach((item) =>
        files.push({
          name: item.response?.fileName || item.name,
          url: item.response?.fileUrl || item.url,
          type: item.type || 'local',
          fileSize: item.response?.fileSize || item.size,
        })
      )
    }
    const updateParams = {
      id: recordDetail?.id,
      remark: values.remark,
      others: '',
      files,
    }
    delete values.remark
    updateParams.others = JSON.stringify(values)

    if (isAdd) {
      const res = await new Promise(() => {})
      res && message.success('add success')
    } else {
      const res = await new Promise(() => {})
      res && message.success('update success')
    }
    onCancel && onCancel()
  }

  const onClose = async () => {
    const updateParams = {
      id: recordDetail?.id,
    }
    const res = await new Promise(() => {})
    res && message.success('close success')
    onReloadDetail && onReloadDetail()
  }

  const renderFormList = () => {
    let dataDetail = {}
    try {
      dataDetail = { ...JSON.parse(recordDetail.others) }
    } catch (e) {}
    return sortableList?.map((data: DragItem) => {
      const disabled = !Boolean(data?.[Form_Type.DISPLAY_EDIT]) || isPreview
      switch (data.type) {
        case Base_Type.INPUT === data.type || Base_Type.DATE === data.type ? data.type : -1:
          // Base_Type.INPUT:
          return (
            data.displayFrom && (
              <Form.Item
                label={data?.[Form_Type.FORM_TITLE]}
                name={data?.[Form_Type.CODE]}
                // tooltip={data?.[Form_Type.FORM_TITLE]}
                initialValue={dataDetail?.[data.code] || data?.[Form_Type.CONTENT]}
                rules={[data?.[Form_Type.MANDATORY] ? { required: true, message: 'input' } : null]}
              >
                <Input placeholder={data?.[Form_Type.TOOLTIP]} disabled={disabled} />
              </Form.Item>
            )
          )
        case Base_Type.FIX_CONTENT:
          return (
            data.displayFrom && (
              <Form.Item
                label={data?.[Form_Type.FORM_TITLE]}
                name={data?.[Form_Type.CODE]}
                initialValue={dataDetail?.[data.code] || data?.[Form_Type.CONTENT]}
                rules={[data?.[Form_Type.MANDATORY] ? { required: true, message: 'input' } : null]}
              >
                <Input placeholder={data?.[Form_Type.TOOLTIP]} disabled={disabled} />
              </Form.Item>
            )
          )
        case Base_Type.RADIO:
          return (
            data.displayFrom && (
              <Form.Item
                label={data?.[Form_Type.FORM_TITLE]}
                name={data?.[Form_Type.CODE]}
                initialValue={dataDetail?.[data.code] || data?.[Form_Type.CONTENT]}
                rules={[data?.[Form_Type.MANDATORY] ? { required: true, message: 'select' } : null]}
              >
                <Radio.Group disabled={disabled}>
                  {data?.[Form_Type.OPTIONS]?.map((item) => (
                    <Radio value={item.value}>{item.label}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            )
          )
        case Base_Type.SELECT:
          return (
            data.displayFrom && (
              <Form.Item
                label={data?.[Form_Type.FORM_TITLE]}
                name={data?.[Form_Type.CODE]}
                initialValue={dataDetail?.[data.code] || data?.[Form_Type.CONTENT]}
                rules={[data?.[Form_Type.MANDATORY] ? { required: true, message: 'input' } : null]}
              >
                {data?.[Form_Type.OPTIONS] ? (
                  <Select
                    showSearch
                    filterOption={(input, option) => {
                      return isNull(input) || (option.label || '')?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }}
                    allowClear
                    placeholder={data?.[Form_Type.TOOLTIP]}
                    options={data?.[Form_Type.OPTIONS]}
                    disabled={disabled}
                  />
                ) : (
                  <Input disabled={disabled} placeholder={data?.[Form_Type.TOOLTIP]} />
                )}
              </Form.Item>
            )
          )
        case Base_Type.DATE:
          const dateData = dataDetail?.[data.code] || data?.[Form_Type.CONTENT]
          let date = null
          if (dayjs(dateData).isValid()) {
            date = dayjs(dateData)
          } else {
            date = null
          }
          if (Array.isArray(dateData) || dayjs(dateData?.[0]).isValid()) {
            date = [dayjs(dateData?.[0]), dayjs(dateData?.[1])]
          }
          return (
            data.displayFrom && (
              <Form.Item
                label={data?.[Form_Type.FORM_TITLE]}
                name={data?.[Form_Type.CODE]}
                initialValue={date}
                rules={[data?.[Form_Type.MANDATORY] ? { required: true, message: 'input' } : null]}
              >
                <RangePicker format={'YYYY-MM-DD HH:mm:ss'} showTime placeholder={data?.[Form_Type.TOOLTIP]} disabled={disabled} />
              </Form.Item>
            )
          )
      }
    })
  }

  return (
    <>
      <div className={`content-divider-right around ${!isHaveSubmit ? 'scroll-content' : 'drawer-content'}`}>
        <Form
          style={isHaveSubmit ? { height: `calc(100vh - ${formSpliceHead || 146}px)`, padding: `0 ${paddingNumber}px` } : {}}
          form={form}
          labelWrap
          labelAlign='right'
          layout='horizontal'
          {...layout}
        >
          {renderFormList()}
          {isHaveSubmit && (
            <React.Fragment>
              <Form.Item initialValue={recordDetail?.remark} label={'Comments'} name='remark' rules={[{ required: false, message: '' }]}>
                <Input.TextArea disabled={isPreview} maxLength={500} autoFocus rows={4} placeholder={'please type comments'} />
                {/* <Input.TextArea ref={targetRef} maxLength={500} autoFocus rows={4} placeholder={'please type comments'} /> */}
              </Form.Item>
              {/* <Row justify='end'>
              <Space>
                <Upload
                  customRequest={attachmentCustomRequest}
                  action={`${domainSetting.UploadDomain}api/crm/suggestion/upload2Aws`}
                  listType='picture'
                  fileList={fileList}
                  onChange={onChangeUpload}
                  showUploadList={false}
                >
                  <Button disabled={fileList.length >= 5} icon={<UploadOutlined />}>
                    {appStore.$p('upLoad')}
                  </Button>
                </Upload>
              </Space>
            </Row> */}
              {/* <Row>
              <Col span={24}>
                <Upload style={{ width: '100%' }} listType='picture' fileList={fileList} onChange={onChangeUpload} onPreview={onPreview} />
              </Col>
            </Row>
            <PictureView visible={previewVisible} imageList={[previewImage]} onCancel={() => setPreviewVisible(false)} /> */}
            </React.Fragment>
          )}
        </Form>
      </div>
      {isHaveSubmit ? (
        <React.Fragment>
          <Row justify='space-between' style={isHaveSubmit ? { margin: `4px ${paddingNumber}px -4px ${paddingNumber}px` } : {}}>
            {/* {!isHideClose && !isAdd ? (
              // <Button type='primary' danger onClick={onClose} disabled={recordDetail?.status === 2}>
              //   Close
              // </Button>
              <p />
            ) : (
              )} */}
            <p />
            <Space>
              <Button type='default' onClick={onCancel}>
                Cancel
              </Button>
              <Button type='primary' onClick={onSubmit} disabled={isPreview}>
                Submit
              </Button>
            </Space>
          </Row>
        </React.Fragment>
      ) : null}
    </>
  )
}

export default Index
