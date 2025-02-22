/*
 * @Author: czy0729
 * @Date: 2019-03-24 05:24:48
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-26 01:33:06
 */
import React from 'react'
import { systemStore } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../types'
import Summary from './summary'

export default obc((props, { $ }: Ctx) => {
  global.rerender('Subject.Summary')

  const { showSummary } = systemStore.setting
  if (showSummary === -1 || ($.subject._loaded && !$.summary)) return null

  return (
    <Summary
      showSummary={showSummary}
      translateResult={$.state.translateResult}
      content={$.summary.replace(/\r\n\r\n/g, '\r\n')}
      onSwitchBlock={$.onSwitchBlock}
    />
  )
})
