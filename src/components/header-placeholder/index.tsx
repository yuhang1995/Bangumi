/*
 * App Header占位
 * @Author: czy0729
 * @Date: 2019-04-28 17:04:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-19 13:54:37
 */
import React from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { _ } from '@stores'
import { Props as HeaderPlaceholderProps } from './types'

export { HeaderPlaceholderProps }

export const HeaderPlaceholder = observer(
  ({ style, tabs = false }: HeaderPlaceholderProps) => {
    let height = _.headerHeight
    if (tabs) height += _.tabsHeight
    return (
      <View
        style={[
          {
            height
          },
          style
        ]}
      />
    )
  }
)
