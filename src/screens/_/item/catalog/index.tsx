/*
 * @Author: czy0729
 * @Date: 2020-01-03 11:23:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-08 16:42:24
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, Highlight, Touchable, UserStatus } from '@components'
import { _, discoveryStore } from '@stores'
import { lastDate, getTimestamp, HTMLDecode, removeHTMLTag } from '@utils'
import { t } from '@utils/fetch'
import { obc } from '@utils/decorators'
import { EVENT } from '@constants'
import { Avatar } from '../../base'
import Covers from './covers'
import { AVATAR_WIDTH } from './ds'
import { memoStyles } from './styles'
import { Props as ItemCatalogProps } from './types'

export { ItemCatalogProps }

export const ItemCatalog = obc(
  (
    {
      event = EVENT,
      id,
      name,
      userName,
      title,
      info,
      book,
      anime,
      music,
      game,
      real,
      time,
      last,
      isUser,
      hideScore = false,
      filter,
      children
    }: ItemCatalogProps,
    { navigation }
  ) => {
    if (!isUser && !book && !anime && !music && !game && !real) return null

    const styles = memoStyles()
    const detail = discoveryStore.catalogDetail(id)
    const oss = discoveryStore.catalogDetailFromOSS(id)

    let data: any
    if (detail._loaded) {
      data = detail
    } else if (oss._loaded) {
      data = oss
    } else {
      data = detail
    }

    const { list, collect, content, avatar, userId, time: detailTime } = data
    const _avatar = avatar || data?.avatar
    const _userId = userId || data?.userId
    const _name = HTMLDecode(name || userName || data?.nickname)
    const _collect = collect || data?.collect
    const _title = HTMLDecode(title || data?.title)
    let _desc = HTMLDecode(
      removeHTMLTag(info || content || data?.desc || oss?.info)
    ).replace(/\n/g, ' ')
    if (_desc === 'undefined') _desc = ''

    let dateText = ''
    if (last) {
      dateText = `创建于 ${last}`
    } else if (time && !time.includes('创建于')) {
      dateText = `最后更新 ${lastDate(getTimestamp(time))}`
    } else if (detailTime) {
      dateText = `创建于 ${lastDate(getTimestamp(detailTime))?.slice(0, 10)}`
    }

    return (
      <Touchable
        style={styles.container}
        onPress={() => {
          const { id: eventId, data: eventData } = event
          t(eventId, {
            to: 'CatalogDetail',
            catalogId: id,
            ...eventData
          })

          navigation.push('CatalogDetail', {
            catalogId: id,
            _hideScore: hideScore
          })
        }}
      >
        <Flex style={styles.wrap} align='start'>
          <Covers list={list} total={oss?.total} />
          <Flex.Item>
            <Flex
              style={styles.content}
              direction='column'
              justify='between'
              align='start'
            >
              <View>
                <Highlight bold numberOfLines={3} value={filter} t2s={false}>
                  {_title}
                </Highlight>
                {!!_desc && _desc !== _title && (
                  <Text style={_.mt.sm} size={11} numberOfLines={2}>
                    {_desc}
                  </Text>
                )}
                {!!_collect && (
                  <Text style={_.mt.xs} size={10} lineHeight={14} type='sub' bold>
                    {_collect}人收藏
                  </Text>
                )}
              </View>
              <Flex style={_.mt.md}>
                <View style={_.mr.sm}>
                  <UserStatus userId={_userId}>
                    <Avatar
                      key={_avatar}
                      navigation={navigation}
                      size={AVATAR_WIDTH}
                      userId={_userId}
                      name={_name}
                      src={_avatar}
                      event={event}
                    />
                  </UserStatus>
                </View>
                <Flex.Item>
                  {!!_name && (
                    <Text style={_.mb.xxs} size={12} bold numberOfLines={1}>
                      {_name}
                    </Text>
                  )}
                  {!!dateText && (
                    <Text size={10} type='sub'>
                      {dateText}
                    </Text>
                  )}
                </Flex.Item>
              </Flex>
            </Flex>
          </Flex.Item>
        </Flex>
        {children}
      </Touchable>
    )
  }
)
