/*
 * @Author: czy0729
 * @Date: 2019-05-26 02:46:44
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-04 20:54:48
 */
import React from 'react'
import { View } from 'react-native'
import { ToolBar as CompToolBar } from '@components'
import { obc } from '@utils/decorators'
import Filter from '../filter'
import { Ctx } from '../types'
import Sort from './sort'
import Tag from './tag'
import Search from './search'
import More from './more'
import { memoStyles } from './styles'

function ToolBar({ page, onToggleList }, { $ }: Ctx) {
  global.rerender('User.ToolBar')

  const styles = memoStyles()
  const { list } = $.state
  return (
    <View style={[styles.container, list && styles.list]}>
      <CompToolBar>
        <Sort />
        <Tag page={page} />
        <Search />
        <More
          onToggleList={() => {
            onToggleList()
            $.onToggleList()
          }}
        />
      </CompToolBar>
      <Filter page={page} />
    </View>
  )
}

export default obc(ToolBar)
