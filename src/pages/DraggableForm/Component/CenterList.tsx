import React, { useEffect, useState, useCallback } from 'react'
import { Spin, DatePicker, List, Row, Space, message, Popconfirm, Col, Empty, Button, Tooltip } from 'antd'
import { DeleteOutlined, MenuOutlined, FormOutlined } from '@ant-design/icons'
import { useDrop, useDrag } from 'react-dnd'
import UseDrop from './Draggable/UseDrop'
import { DragItem, Form_Type, types } from './Types'
import Input from 'antd/es/input/Input'
import { getIcon } from './EditLeft'

interface IProps {
  selectData: DragItem
  setSelectData?: (data) => void
  sortableList: DragItem[]
  setSortableList?: (data) => void
}
const { RangePicker } = DatePicker

const Index: React.FC<IProps> = (props) => {
  const { setSelectData, selectData, sortableList, setSortableList } = props
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: types.BOX_TYPE,
    collect: (monitor) => ({
      // 是否放置在目标上
      isOver: monitor.isOver(),
      // 是否开始拖拽
      canDrop: monitor.canDrop(),
    }),
    hover: () => {
      // setSortableList(
      //   sortableList.map((item) => {
      //     return item.index === -1 ? { ...item, opacity: 0.3 } : item
      //   })
      // )
    },
  })

  // 是否拖拽到指定位置
  const showCanDrop = () => {
    return canDrop && isOver
  }

  /**
   * 删除数据
   * @param {DragItem} item //点击索引
   */
  const delItem = (item: DragItem) => {
    // 删除了选择的则清空右侧
    if (item?.createTime === selectData?.createTime) {
      setSelectData(null)
    }

    const newValue = sortableList.filter((v) => v?.createTime !== item?.createTime)
    setSortableList(newValue)
  }

  // 移动
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      /**
       * 1、如果此时拖拽的组件是 new 组件，则 dragIndex 为 undefined，则此时修改，则此时修改 cardList 中的占位元素的位置即可
       * 2、如果此时拖拽的组件是 old 组件，则 dragIndex 不为 undefined，此时替换 dragIndex 和 hoverIndex 位置的元素即可
       */
      const dragCard = sortableList[dragIndex]
      if (dragIndex === undefined) {
        // 占位排序
        const lessIndex = sortableList.findIndex((item: any) => item.index === -1)
        const positionData = sortableList[lessIndex]

        const newSortableList = sortableList.slice()
        newSortableList.splice(lessIndex, 1)
        newSortableList.splice(hoverIndex, 0, positionData)
        setSortableList(newSortableList)
      } else {
        const newSortableList = sortableList.slice()
        newSortableList.splice(dragIndex, 1)
        newSortableList.splice(hoverIndex, 0, dragCard)
        setSortableList(newSortableList)
      }
    },
    [sortableList]
  )

  return (
    <div ref={drop} className={`${showCanDrop() ? 'drag-in-color' : ''} scroll-content`}>
      {sortableList.map((item, index) => {
        const style = { opacity: item?.opacity || 1, background: 'rgba(64,155,255,0.0)' }
        if (selectData?.createTime === item?.createTime) {
          style.background = 'rgba(64,155,255,0.1)'
        }
        return (
          <UseDrop key={index} data={{ ...item, index }} type={types.BOX_TYPE} moveCard={moveCard}>
            <Row
              onClick={() => {
                setSelectData({ ...item, index })
              }}
              justify='space-between'
              align='middle'
              className={`sortable-every ${item.isValidateError ? 'error-validate' : ''}`}
              style={style}
            >
              <Col span={3} className='center-text'>
                <Row>
                  {/* {item.dragTitle} */}
                  {item?.iconType && getIcon(item?.iconType)}
                </Row>
              </Col>
              <Col span={5} className='center-text center-overflow-text'>
                {' '}
                <Tooltip placement='bottomLeft' title={item?.[Form_Type.FORM_TITLE]}>
                  {item?.[Form_Type.FORM_TITLE]}
                </Tooltip>
              </Col>
              <Col span={12}>
                {' '}
                <Input disabled placeholder={item?.[Form_Type.TOOLTIP]} />
              </Col>
              <Col span={4} className='center-text flex-justify'>
                <MenuOutlined className='sortable-icon' />
                <Popconfirm
                  title='sure delete?'
                  onConfirm={(e) => {
                    e.stopPropagation()
                    delItem(item)
                  }}
                  onCancel={() => {}}
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Col>
            </Row>
          </UseDrop>
        )
      })}
    </div>
  )
}

export default Index
