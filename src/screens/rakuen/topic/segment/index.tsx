/*
 * @Author: czy0729
 * @Date: 2021-01-20 19:55:44
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-28 17:44:10
 */
import React from 'react'
import { View } from 'react-native'
import { SegmentedControl, Heatmap } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../types'
import { styles } from './styles'

function Segement(props, { $ }: Ctx) {
  global.rerender('Topic.Segement')

  const { filterMe, filterFriends } = $.state
  const hasLogin = !!$.myId

  const segmentedControlDS = ['全部']
  if (hasLogin && $.commentMeCount) segmentedControlDS.push(`我 ${$.commentMeCount}`)
  if (hasLogin && $.commentFriendsCount)
    segmentedControlDS.push(`好友 ${$.commentFriendsCount}`)

  let selectedIndex = 0
  if (segmentedControlDS.length > 1) {
    if (filterMe && segmentedControlDS.find(item => item.includes('我'))) {
      selectedIndex = 1
    } else if (filterFriends) {
      selectedIndex = segmentedControlDS.length - 1
    }
  }

  if (segmentedControlDS.length <= 1) return null

  return (
    <View>
      <SegmentedControl
        style={[
          styles.segmentedControl,
          {
            width: segmentedControlDS.length * _.r(56)
          }
        ]}
        size={11}
        values={segmentedControlDS}
        selectedIndex={selectedIndex}
        onValueChange={title => {
          if ((title.includes('我') && !filterMe) || (title === '全部' && filterMe)) {
            return $.toggleFilterMe()
          }

          if (
            (title.includes('好友') && !filterFriends) ||
            (title === '全部' && filterFriends)
          ) {
            $.toggleFilterFriends()
          }
        }}
      />
      <Heatmap right={74} bottom={24} id='帖子.好友相关' />
      <Heatmap right={24} bottom={24} id='帖子.与我相关' />
    </View>
  )
}

export default obc(Segement)
