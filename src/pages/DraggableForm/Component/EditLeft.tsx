import React from 'react'
import { Row, Button, Space } from 'antd'
import UseDrag from './Draggable/UseDrag'
import { DragItem, types } from './Types'
import * as Icon from '@ant-design/icons'
interface IProps {
  defaultList: any
  sortableList: DragItem[]
  setSortableList?: (data) => void
}
export const getIcon = (type) => {
  let iconElement = <></>
  try {
    iconElement = React.createElement(Icon[type])
    return iconElement
  } catch (e) {
    iconElement = <></>
    return iconElement
  }
}
const Index: React.FC<IProps> = (props) => {
  const { defaultList, setSortableList, sortableList } = props

  return (
    <div className='content-divider around'>
      <h3>Basic</h3>
      <Space direction='vertical' size={10} style={{ width: '100%' }}>
        {defaultList.map((item, index) => {
          return (
            <UseDrag key={index} data={item} sortableList={sortableList} setSortableList={setSortableList} type={types.BOX_TYPE}>
              <Row>
                <Button block className='dragger-title'>
                  {item?.iconType && getIcon(item?.iconType)}
                  {item.dragTitle}
                </Button>
              </Row>
            </UseDrag>
          )
        })}
      </Space>
    </div>
  )
}

export default Index
