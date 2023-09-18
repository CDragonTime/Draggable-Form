import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Dropdown } from 'antd'
import type { DropDownProps } from 'antd/es/dropdown'
import classNames from 'classnames'
import React from 'react'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import localeData from 'dayjs/plugin/localeData'
import dayLocaleData from 'dayjs/plugin/localeData'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'

// moment替换dayjs所需要的插件
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(isBetween)
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(dayLocaleData)
dayjs.extend(isSameOrBefore)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekdaysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
})


export type HeaderDropdownProps = {
  overlayClassName?: string
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'
} & Omit<DropDownProps, 'overlay'>

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`@media screen and (max-width: ${token.screenXS})`]: {
        width: '100%',
      },
    }
  })
  return <Dropdown overlayClassName={classNames(className, cls)} {...restProps} />
}

export default HeaderDropdown
