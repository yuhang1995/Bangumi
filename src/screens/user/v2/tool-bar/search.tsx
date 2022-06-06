/*
 * @Author: czy0729
 * @Date: 2022-06-06 08:38:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-06 08:39:49
 */
import React from 'react'
import { ToolBar } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'

function Search(props, { $ }) {
  const { showFilter } = $.state
  return (
    <ToolBar.Icon
      icon='md-search'
      iconColor={showFilter ? _.colorMain : _.colorDesc}
      onSelect={$.onToggleFilter}
    />
  )
}

export default obc(Search)
