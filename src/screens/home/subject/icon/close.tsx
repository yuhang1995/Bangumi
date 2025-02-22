/*
 * @Author: czy0729
 * @Date: 2021-01-16 19:14:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-06 03:04:50
 */
import React from 'react'
import { Heatmap } from '@components'
import { IconTouchable } from '@_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { confirm, info } from '@utils/ui'
import i18n from '@constants/i18n'
import { Ctx } from '../types'

function IconClose(props, { $ }: Ctx) {
  const { status = { name: '未收藏' } } = $.collection
  const { formhash } = $.subjectFormHTML
  return (
    <IconTouchable
      style={_.mr._sm}
      name='md-close'
      color={_.colorIcon}
      onPress={() => {
        if (status.name === '未收藏') {
          info('当前未收藏')
          return
        }

        if (!formhash) {
          info(`无法操作, 请检查${i18n.login()}状态`)
          return
        }

        confirm('确定删除收藏?', () => $.doEraseCollection())
      }}
    >
      <Heatmap id='条目.删除收藏' />
    </IconTouchable>
  )
}

export default obc(IconClose)
