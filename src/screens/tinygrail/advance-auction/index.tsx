/*
 * @Author: czy0729
 * @Date: 2020-01-09 19:50:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-11 04:59:25
 */
import React from 'react'
import { Header, Page } from '@components'
import { IconHeader } from '@_'
import { _ } from '@stores'
import { alert } from '@utils'
import { inject, obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import StatusBarEvents from '@tinygrail/_/status-bar-events'
import ToolBar from '@tinygrail/_/tool-bar'
import List from './list'
import Store, { sortDS } from './store'
import { Ctx } from './types'

class TinygrailAdvanceAuction extends React.Component {
  componentDidMount() {
    const { $ }: Ctx = this.context
    $.init()
  }

  render() {
    const { $ }: Ctx = this.context
    const { level, sort } = $.state
    return (
      <>
        <StatusBarEvents />
        <Header
          title='拍卖推荐'
          hm={['tinygrail/advance-auction', 'TinygrailAdvanceAuction']}
          statusBarEvents={false}
          statusBarEventsType='Tinygrail'
          headerRight={() => (
            <IconHeader
              name='md-info-outline'
              color={_.colorTinygrailPlain}
              onPress={() => {
                t('竞拍推荐.提示', {
                  type: 1
                })

                alert(
                  '从英灵殿里面查找前 2000 条\n可竞拍数量 > 80, \n实时股息 / 竞拍底价 * 100 = 分数',
                  '当前计算方式'
                )
              }}
            />
          )}
        />
        <Page style={_.container.tinygrail}>
          <StatusBarEvents />
          <ToolBar
            level={level}
            levelMap={$.levelMap}
            data={sortDS}
            sort={sort}
            direction={sort ? 'down' : undefined}
            onLevelSelect={$.onLevelSelect}
            onSortPress={$.onSortPress}
          />
          <List />
        </Page>
      </>
    )
  }
}

export default inject(Store)(obc(TinygrailAdvanceAuction))
