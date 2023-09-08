import { CopyOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { debounce } from '@/public/fun'
import { Button, Col, Form, Input, Row, Select, Space, Switch, Tooltip, message,Upload } from 'antd'
// import Upload from 'antd/es/upload/Upload'
import React, { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import * as XLSX from 'xlsx'
import { DragItem, Form_Type, MAX_INPUT_LENGTH, getInitFormValue } from './Types'
interface IProps {
  selectData: DragItem
  sortableList: DragItem[]
  setSortableList?: (data) => void
  setSelectData?: (data) => void
}

const Index: React.FC<IProps> = (props) => {
  const { selectData, sortableList, setSortableList, setSelectData } = props
  const { formInclude } = selectData
  const [form] = Form.useForm()

  useEffect(() => {
    initData()
  }, [selectData.createTime])

  const initData = async () => {
    // 初始化也需要校验
    onSubmit()
  }

  // 防抖更新值，实时更新列表
  const onSubmit = debounce(async () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values, 'values-=--=-=values')
        const newSortList = sortableList.slice()
        const index = newSortList.findIndex((item) => selectData?.createTime === item?.createTime)
        newSortList[index] = { ...newSortList[index], createTime: newSortList[index]?.createTime, ...values, isValidateError: false }

        // 如果列表中有option且当前没有则删除
        if (newSortList[index]?.options && !values.options) {
          delete newSortList[index].options
        }
        setSortableList(newSortList)
      })
      .catch((err) => {
        const newSortList = sortableList.slice()
        const index = newSortList.findIndex((item) => selectData?.createTime === item?.createTime)
        newSortList[index] = { ...newSortList[index], createTime: newSortList[index]?.createTime, ...err.values, isValidateError: true }
        setSortableList(newSortList)
      })
  }, 100)

  /**
   * 复制组件
   */
  const copySelectData = () => {
    form
      .validateFields()
      .then((values) => {
        const newSortList = sortableList.slice()
        const index = newSortList.findIndex((item) => selectData?.createTime === item?.createTime)
        let nums = sortableList.filter((v) => v.key === selectData.key)?.length
        nums++
        const initData = getInitFormValue(selectData, nums)
        const newData = { ...selectData, ...{ code: initData?.code, createTime: initData?.createTime }, title: selectData?.title + '_copy' }
        newSortList.splice(index + 1, 0, newData)
        setSortableList(newSortList)
        setSelectData(newData)
      })
      .catch(() => {
        message.error('Only after passing the verification can the copy be made')
      })
  }

  /**
   * 读取excel中port下拉数据
   */
  const beforeUpload = async (files) => {
    try {
      const reader = new FileReader()
      reader.onload = function (e) {
        const data = e.target.result
        // 读取二进制的excel
        const workbook = XLSX.read(data, { type: 'binary' })
        const excelList = []
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const res = XLSX.utils.sheet_to_json(worksheet)
          res.forEach((item: any) => {
            const obj = { label: Object.values(item)[1], value: Object.values(item)[0] }
            excelList.push(obj)
          })
        })
        form.setFieldValue(Form_Type.OPTIONS, excelList)
      }
      reader.readAsBinaryString(files)
    } catch (e) {
      message.error('Parsing failed')
    } finally {
      onSubmit()
    }
  }

  return (
    <div className='content-divider-right around'>
      <h3>
        {selectData?.dragTitle}
        <Tooltip title='copy'>
          <CopyOutlined disabled={selectData?.isValidateError} onClick={copySelectData} />
        </Tooltip>
      </h3>
      <Scrollbars autoHide autoHideTimeout={200} style={{ height: 'calc(100% - 40px)' }}>
        <Form form={form} layout='vertical' onFinish={onSubmit}>
          {formInclude?.includes(Form_Type.PORT_TYPE) && (
            <Form.Item
              name={Form_Type.CODE}
              initialValue={selectData?.[Form_Type.CODE]}
              label='Port type'
              rules={[{ required: true, message: 'input' }]}
            >
              <Select />
            </Form.Item>
          )}
          <Form.Item
            name={Form_Type.CODE}
            initialValue={selectData?.[Form_Type.CODE]}
            label={`Code(less than ${MAX_INPUT_LENGTH} words)`}
            rules={[
              { required: true, message: 'input' },
              {
                pattern: new RegExp(/^([a-zA-Z]){1}([0-9a-zA-Z]){0,}$/),
                message: 'Please enter a combination of numbers in English and start with English',
              },
              {
                message: 'Code is a unique field',
                validator: (rule, value) => {
                  // 过滤当前选择元素
                  const filterSortableList = sortableList.filter((v) => {
                    return v.createTime !== selectData.createTime
                  })
                  return filterSortableList.some((v) => v.code === value) ? Promise.reject('Code is a unique field') : Promise.resolve('')
                },
              },
            ]}
          >
            <Input disabled={true} maxLength={MAX_INPUT_LENGTH} placeholder='' onChange={onSubmit} />
          </Form.Item>
          {formInclude?.includes(Form_Type.FORM_TITLE) && (
            <Form.Item
              name={Form_Type.FORM_TITLE}
              initialValue={selectData?.[Form_Type.FORM_TITLE]}
              label={`Form Title(less than ${MAX_INPUT_LENGTH} words)`}
              rules={[{ required: true, message: 'input' }]}
            >
              <Input maxLength={MAX_INPUT_LENGTH} placeholder='input placeholder' onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.CONTENT) && (
            <Form.Item
              name={Form_Type.CONTENT}
              initialValue={selectData?.[Form_Type.CONTENT]}
              label={`Content(less than ${MAX_INPUT_LENGTH} words)`}
              rules={[{ required: true, message: 'input' }]}
            >
              <Input maxLength={MAX_INPUT_LENGTH} placeholder='input placeholder' onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.TOOLTIP) && (
            <Form.Item
              name={Form_Type.TOOLTIP}
              initialValue={selectData?.[Form_Type.TOOLTIP]}
              label={`Tool tip(less than ${MAX_INPUT_LENGTH} words)`}
            >
              <Input maxLength={MAX_INPUT_LENGTH} placeholder='input placeholder' onChange={onSubmit} />
            </Form.Item>
          )}

          {formInclude?.includes(Form_Type.OPTIONS) && (
            <Form.Item
              name={Form_Type.OPTIONS}
              label={
                <Row justify='space-between' align='middle'>
                  <Col>Option</Col>
                  <Upload showUploadList={false} beforeUpload={beforeUpload}>
                    <Col>
                      {formInclude?.includes(Form_Type.OPTIONS) && (
                        <Button type='link' block>
                          Batch Add
                        </Button>
                      )}
                    </Col>
                  </Upload>
                </Row>
              }
            >
              <Form.List
                name={Form_Type.OPTIONS}
                rules={[
                  // 颜色有bug,不使用ErrorList
                  {
                    message: 'Please add at least one.',
                    validator: async (_, names) => {
                      if (!names || names.length < 1) {
                        return Promise.reject(new Error())
                      }
                    },
                  },
                ]}
                initialValue={selectData?.[Form_Type.OPTIONS]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <React.Fragment>
                    {fields?.map(({ key, name, ...restField }) => {
                      return (
                        <React.Fragment>
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
                            <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true, message: 'input' }]}>
                              <Input placeholder='Label' onChange={onSubmit} />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              rules={[
                                { required: true, message: 'input' },
                                {
                                  message: 'value is a unique field',
                                  validator: (rule, value) => {
                                    const fieldValue = form.getFieldValue(Form_Type.OPTIONS)
                                    // console.log(fieldValue, fields, 'fieldValue-=-==--=')
                                    const isError = fieldValue?.some((v, index) => {
                                      return v?.value == value && index != name
                                    })
                                    if (value && isError && fieldValue?.every((v) => v?.value)) {
                                      return Promise.reject('value is a unique field')
                                    } else {
                                      return Promise.resolve('')
                                    }
                                  },
                                },
                              ]}
                            >
                              <Input placeholder='Value' onChange={onSubmit} />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, 'defaut']} style={{ display: 'none' }}>
                              <Input placeholder='Label' />
                            </Form.Item>
                            <MinusCircleOutlined
                              className='dynamic-delete-button'
                              onClick={() => {
                                remove(name)
                                onSubmit()
                              }}
                            />
                          </Space>
                        </React.Fragment>
                      )
                    })}
                    <Form.Item help={errors} validateStatus={errors ? 'error' : 'success'}>
                      <Button
                        type='dashed'
                        onClick={() => {
                          add()
                          onSubmit()
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add
                      </Button>
                    </Form.Item>
                  </React.Fragment>
                )}
              </Form.List>{' '}
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.MANDATORY) && (
            <Form.Item
              name={Form_Type.MANDATORY}
              initialValue={selectData?.[Form_Type.MANDATORY]}
              label='Mandatory'
              valuePropName='checked'
            >
              <Switch onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.DISPLAY_FORM) && (
            <Form.Item
              name={Form_Type.DISPLAY_FORM}
              initialValue={selectData?.[Form_Type.DISPLAY_FORM]}
              label='Display in the form'
              valuePropName='checked'
            >
              <Switch onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.DISPLAY_REPORT) && (
            <Form.Item
              name={Form_Type.DISPLAY_REPORT}
              initialValue={selectData?.[Form_Type.DISPLAY_REPORT]}
              label='Display in the report'
              valuePropName='checked'
            >
              <Switch onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.DISPLAY_EDIT) && (
            <Form.Item
              name={Form_Type.DISPLAY_EDIT}
              initialValue={selectData?.[Form_Type.DISPLAY_EDIT]}
              label='Editable'
              valuePropName='checked'
            >
              <Switch onChange={onSubmit} />
            </Form.Item>
          )}
          {formInclude?.includes(Form_Type.DISPLAY_FILTER) && (
            <Form.Item
              name={Form_Type.DISPLAY_FILTER}
              initialValue={selectData?.[Form_Type.DISPLAY_FILTER]}
              label='Set as the search filter'
              valuePropName='checked'
            >
              <Switch onChange={onSubmit} />
            </Form.Item>
          )}
        </Form>
      </Scrollbars>
    </div>
  )
}

export default Index
