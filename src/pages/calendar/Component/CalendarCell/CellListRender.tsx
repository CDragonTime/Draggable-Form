import { Badge, BadgeProps, Calendar, Col, Row, Select, Tooltip, theme } from 'antd'
import React from 'react'

const CellListRender = (props) => {
  const { stockType, holidayName, time, isTitle } = props

  return (
    <>
      <span className='list-render'>{`${stockType} (${time})`}</span>
      <div className={isTitle ? 'list-render' : 'list-show'} style={{ marginLeft: 14 }}>{`${holidayName}`}</div>
    </>
  )
}
export default CellListRender
