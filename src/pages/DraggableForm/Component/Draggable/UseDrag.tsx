/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 22:45:13
 * @LastEditTime: 2023-06-24 23:02:23
 * @Description: 
 * @FilePath: /umi-test/src/pages/DraggableForm/Component/Draggable/UseDrag.tsx
 */
import React, { ReactNode, useEffect, useRef } from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd'
import { DragItem, Form_Type, getInitFormValue } from '../Types'

const draggableOpacity = 0.3

interface IProps {
  children: ReactNode
  data: DragItem
  type: string
  moveCard?: (a, b) => void
  sortableList: DragItem[]
  setSortableList?: (data) => void
}
const positionTxt = 'Place here...'

const CustDrag: React.FC<IProps> = (props) => {
  const { data, type, moveCard, setSortableList, sortableList } = props
  const ref = useRef(null)
  const [{ opacity, isDragging }, drag, preview] = useDrag({
    type,
    item: (_: unknown, monitor: DragSourceMonitor) => {
      // 在拖动操作开始时触发
      const useless = sortableList?.find((item: DragItem) => item?.index === -1)
      // 拖拽开始时，插入占位符
      if (!useless) {
        setSortableList([...sortableList, { title: positionTxt, index: -1, opacity: 0.1 }])
      }
      return data
    },
    end: (_: unknown, monitor: DragSourceMonitor) => {
      /**
       * 拖拽结束时，判断是否将拖拽元素放入了目标接收组件中
       *  1、如果是，则使用真正传入的 box 元素代替占位元素
       *  2、如果否，则将占位元素删除
       */
      const uselessIndex = sortableList.findIndex((item: DragItem) => item.title === positionTxt)
      if (monitor.didDrop()) {
        // 设置默认值
        let nums = sortableList.filter((v) => v.key === data.key)?.length
        nums++
        const initFormValue = getInitFormValue(data, nums)
        sortableList.splice(uselessIndex, 1, { ...monitor.getItem(), ...initFormValue })
      } else {
        sortableList.splice(uselessIndex, 1)
      }
      setSortableList(sortableList.slice())
    },

    collect: (monitor) => ({
      opacity: monitor?.isDragging() ? draggableOpacity : 1,
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <>
      <div ref={drag(ref) as any} style={{ opacity, cursor: 'move' }}>
        {props.children}
      </div>
    </>
  )
}
export default CustDrag
