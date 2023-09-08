import { isArray, isEmptyObj, isNotNull, isNull } from '@/public/fun'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, DatePicker, Drawer, FormInstance, Space, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { deleteDataSource, getDataSourceList, getHeaderList } from '../../../utils/IndexDb'
import ComplaintHeaderEdit from '../Home/HeaderEdit'
import PreviewForm from './Component/PreviewForm'
import { DragItem, typeToFilterType } from './Component/Types'
import './index.less'
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
    width: 240,
    key: 'option',
    align:"center",
    valueType: 'option',
    fixed: 'right',
    render: (val, record) => [
      <Button
        onClick={() => {
          setRecordDetail(record)
          setIsPreview(true)
        }}
        type='link'
      >
        Preview
      </Button>,
      <Button
        onClick={() => {
          setRecordDetail(record)
        }}
        type='link'
      >
        Edit
      </Button>,
      <Button
        onClick={() => {
          deleteDataSource(record.id)
          onReload()
        }}
        type='link'
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
    const res = await getHeaderList()
    setSortableList(res)
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
          hideInTable: !v.displayFrom,
          hideInForm: !v.displayFrom,
          hideInSearch: !v.search,
          hideInSetting: !v.displayFrom,
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
      ...searchValue,
      // pageSize: params.pageSize,
      // pageIndex: params.current,
    }
    console.log(searchParams,"-=--=-=-=-")

    const res = await getDataSourceList(searchParams)
    let listData = []
    try {
      listData = res?.map((v) => {
        if (v.others) {
          return { ...v, ...JSON.parse(v.others) }
        } else {
          return { ...v }
        }
      })
    } catch (e) {}
    pageRef.current = {
      total: res?.length || 0,
      list: listData || [],
      pageIndex: searchValue.pageIndex,
      pageSize: searchValue.pageSize,
      query: params,
    }
    return { data: listData, total: res?.length, success: true }
  }

  // 刷新表格
  const onReload = () => {
    TableRef.current.reload()
  }

  // 解决分页冲突
  const changePage = (page, size) => {
    pageRef.current = {
      ...pageRef.current,
      pageIndex: page,
      pageSize: size,
    }
  }

  const onClose = () => {
    setComplaintHeaderEdit(false)
    initHeaderData()
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRow(selectedRowKeys)
    gidsRef.current = [...new Set(selectedRows)]
  }
  const rowSelection = {
    selectedRowKeys: selectedRow,
    onChange: onSelectChange,
  }
  const onExport = async () => {
    const values: any = {}
    const { pageSize, current, ...rest } = pageRef.current?.query
    try {
      const res = await new Promise(() => {})
      message.success('Export was successful')
      setSelectedRow([])
    } catch (error) {}
  }

  const isAdd = recordDetail && !recordDetail?.id

  return (
    <>
      <ProTable
        key={currentColumns.length}
        className={'complaints-detail-table'}
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
        }}
        dateFormatter='string'
        headerTitle={[
          <Space>
            <Button
              onClick={() => {
                setRecordDetail({})
              }}
            >
              add data
            </Button>
            {/* <Button onClick={()=>{setComplaintHeaderEdit(true)}}>edit the form</Button> */}
          </Space>,
        ]}
        toolBarRender={() => [<Space>{/* <Button onClick={()=>{onExport()}}>Export</Button> */}</Space>]}
        columnsState={{}}
      />
      {complaintHeaderEdit && <ComplaintHeaderEdit onClose={onClose} />}
      {recordDetail && (
        <Drawer
          open={Boolean(recordDetail)}
          title={`${isPreview ? 'Preview' : isAdd ? 'Add' : 'Edit'} Complaint`}
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
            isAdd={isAdd}
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
