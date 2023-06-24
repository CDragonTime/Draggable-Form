import { getQuery, isArray, isEmptyObj, isNotNull, isNull } from '@/public/fun'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, DatePicker, Drawer, FormInstance, Modal, Space, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import PreviewForm from './Component/PreviewForm'
import { Base_Type, DragItem, typeToFilterType } from './Component/Types'
import ComplaintHeaderEdit from './HeaderEdit'
import React from 'react'

const { RangePicker } = DatePicker

interface DataSource {
  id: string
  dimension: string
  type: string
  caseId: string
  index: string
  startTime: string
  endTime: string
  timeZone: string
  note: string
  optId: number
  optName: string
  status: number
  createTime?: string
}

export default function ChatMgtList(params) {
  const gidsRef = useRef([])
  const [treeData, setTreeData] = useState(null)
  const TableRef = useRef<ActionType>()
  const pageRef = useRef({ total: 0, list: [], pageIndex: 1, pageSize: 20, query: null })
  const TableFormRef = useRef<FormInstance>()
  const [selectedRow, setSelectedRow] = useState([])
  const [recordDetail, setRecordDetail] = useState<DataSource | boolean>(null)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [complaintHeaderEdit, setComplaintHeaderEdit] = useState<boolean>(false)
  const [columns, setColumns] = useState<ProColumns[]>([])
  const [sortableList, setSortableList] = useState<DragItem[]>([])

  const currentColumns = columns?.filter(Boolean)?.concat({
    title: 'Operation',
    width: 180,
    key: 'option',
    valueType: 'option',
    fixed: 'right',
    render: (val, record) => [
      <Button
        onClick={() => {
          setRecordDetail(record)
          setIsPreview(true)
        }}
      >
        Edit
      </Button>,
        <Button
        onClick={() => {
          
        }}
      >
        Delete
      </Button>,
    ],
  })

  useEffect(() => {
    initHeaderData()
  }, [])
  useEffect(() => {
    onReload()
  }, [columns])

  const initHeaderData = async () => {
    const res = []
    // if (res.every((v) => v.code !== 'UserId') && getQuery('userId')) {
    //   message.warning('UserId query is not supported. Please configure it first.')
    // }
    const headerList: ProColumns[] = res
      ?.filter((v) => v.code)
      ?.map((v) => {
        const data: ProColumns = {
          title: v.title,
          valueType: typeToFilterType(v)?.valueType,
          fieldProps: {
            options: v.options,
            showSearch: true,
            optionFilterProp: 'label',
          },
          // initialValue: v.code === 'UserId' && getQuery('userId') ? getQuery('userId') : '',
          dataIndex: v.code,
          width: 180,
          order: 18,
          ellipsis: true,
          // hideInTable: !v.displayFrom,
          hideInForm: !v.displayFrom,
          hideInSearch: !v.search || v.type === Base_Type.DATE,
          hideInSetting: !v.displayFrom,
          render: (val: any, red) => {
            return <div style={{ cursor: 'pointer' }}>{val}</div>
          },
        }
        return data
      })
    setColumns(headerList)
  }

  async function search(params, sorter, filter) {
    // 表单搜索项会从 params 传入，传递给后端接口。
    const { pageSize, current, ...rest } = params
    const searchValue = rest
    for (const valueItem in searchValue) {
      if (isNotNull(valueItem)) {
        if (isNull(searchValue[valueItem]) || (isArray(searchValue[valueItem]) && isEmptyObj(searchValue[valueItem]))) {
          delete searchValue[valueItem]
        }
      }
    }
    const searchParams = {
      searchList: searchValue,
      pageSize: params.pageSize,
      pageIndex: params.current,
    }
    const res = null
    let listData = []
    try {
      listData = res?.rows?.map((v) => {
        if (v.others) {
          return { ...v, ...JSON.parse(v.others) }
        } else {
          return { ...v }
        }
      })
    } catch (e) {}
    pageRef.current = {
      total: res?.total || 0,
      list: listData || [],
      pageIndex: searchValue.pageIndex,
      pageSize: searchValue.pageSize,
      query: params,
    }
    return { data: listData, total: res?.total, success: true }
  }

  // 刷新表格
  const onReload = () => {
    TableRef.current.reload()
    // TableFormRef.current.submit()
  }

  // 解决分页冲突
  const changePage = (page, size) => {
    pageRef.current = {
      ...pageRef.current,
      pageIndex: page,
      pageSize: size,
    }
  }
  /**
   * 删除行
   * @param record
   */
  const deleteComplaint = async (record) => {
    const res = await new Promise(() => {})
    if (res) {
      message.success('delete success')
    }
    onReload()
  }
  // 关闭行
  const closeComplaint = async (record) => {
    const res = await new Promise(() => {})
    if (res) {
      message.success('close success')
    }
    setTimeout(() => {
      onReload()
    }, 1000)
  }

  const onClose = () => {
    setComplaintHeaderEdit(false)
    initHeaderData()
  }

  // 二次确认
  const confirm = (fn, tip) => {
    return () =>
      Modal.confirm({
        title: tip,
        onOk: fn,
      })
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRow(selectedRowKeys)
    gidsRef.current = [...new Set(selectedRows)]
  }
  const rowSelection = {
    selectedRowKeys: selectedRow,
    onChange: onSelectChange,
  }
  const onExport = async (data) => {
    const values: any = {}
    const { pageSize, current, ...rest } = pageRef.current?.query
    values.searchList = rest
    values.report = data.report
    if (selectedRow && selectedRow.length > 0) {
      values.ids = selectedRow
    }
    try {
      const res = await new Promise(() => {})
      message.success('Export was successful')
      setSelectedRow([])
    } catch (error) {
    } finally {
    }
  }

  return (
    <>
      <ProTable
        key={currentColumns.length}
        className='complaints-detail-table'
        scroll={{ x: 1400 }}
        defaultSize='large'
        revalidateOnFocus={false}
        formRef={TableFormRef}
        columns={currentColumns}
        request={search}
        actionRef={TableRef}
        rowKey='id'
        // loading={loading}
        rowSelection={rowSelection}
        pagination={{
          onChange: changePage,
          showQuickJumper: true,
          showSizeChanger: true,
          size: 'small',
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
          // className: 'chat-mgr-form',
        }}
        dateFormatter='string'
        headerTitle={[
          <Space>
            <Button onClick={()=>{setComplaintHeaderEdit(true)}}>edit the form</Button>
          </Space>,
        ]}
        toolBarRender={() => [
          <Space>
            <Button>???????</Button>
          </Space>,
        ]}
        columnsState={{}}
      />
      {complaintHeaderEdit && <ComplaintHeaderEdit onClose={onClose} />}
      {recordDetail && (
        <Drawer
          open={Boolean(recordDetail)}
          title={`${isPreview ? 'Preview' : 'Edit'} Complaint`}
          width='40vw'
          onClose={() => {
            setRecordDetail(false)
            setIsPreview(false)
          }}
          footer={false}
        >
          <PreviewForm
            recordDetail={recordDetail}
            isPreview={isPreview}
            isHaveSubmit={true}
            sortableList={sortableList}
            onCancel={() => {
              setRecordDetail(null)
              setIsPreview(false)
              onReload()
            }}
          />
        </Drawer>
      )}
    </>
  )
}
