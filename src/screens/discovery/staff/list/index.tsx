/*
 * @Author: czy0729
 * @Date: 2019-10-01 15:44:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-26 14:08:09
 */
import React from 'react'
import { Loading, ListView } from '@components'
import { ItemCatalog } from '@_'
import { _ } from '@stores'
import { keyExtractor } from '@utils'
import { obc } from '@utils/decorators'
import { Ctx } from '../types'

const EVENT = {
  id: '新番档期.跳转',
  data: {
    userId: 'lilyurey'
  }
} as const

function List(props, { $ }: Ctx) {
  const { _loaded } = $.catalogs
  if (!_loaded) return <Loading style={_.container.plain} />

  return (
    <ListView
      style={_.container.plain}
      keyExtractor={keyExtractor}
      data={$.catalogs}
      lazy={6}
      scrollToTop
      renderItem={renderItem}
      onHeaderRefresh={() => $.fetchCatalogs(true)}
      onFooterRefresh={() => $.fetchCatalogs()}
    />
  )
}

export default obc(List)

function renderItem({ item }) {
  return <ItemCatalog {...item} name='优莉雅' isUser event={EVENT} />
}
