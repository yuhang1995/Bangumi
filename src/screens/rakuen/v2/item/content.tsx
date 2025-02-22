/*
 * @Author: czy0729
 * @Date: 2021-01-21 17:55:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-03 11:10:57
 */
import React from 'react'
import { Flex, Touchable } from '@components'
import { _ } from '@stores'
import { open } from '@utils'
import { obc } from '@utils/decorators'
import { appNavigate, confirm } from '@utils'
import { t } from '@utils/fetch'
import { HOST, LIMIT_TOPIC_PUSH } from '@constants'
import { Ctx } from '../types'
import Title from './title'
import Detail from './detail'

function Content(
  {
    avatar,
    group,
    groupCn,
    href = '',
    replyCount,
    time,
    title,
    topicId,
    userId,
    userName,
    isReaded,
    isGroup
  },
  { $, navigation }: Ctx
) {
  // 帖子点击
  const go = () => {
    appNavigate(
      href,
      navigation,
      {
        _title: title,
        _replies: `+${replyCount}`,
        _group: group,
        _time: time,
        _avatar: avatar,
        _userName: userName,
        _userId: userId
      },
      {
        id: '超展开.跳转'
      }
    )

    setTimeout(() => {
      // 记录帖子查看历史详情
      $.onItemPress(topicId, replyCount)
    }, 400)
  }
  return (
    <Touchable
      style={styles.item}
      onPress={() => {
        if (replyCount > LIMIT_TOPIC_PUSH) {
          confirm(
            '帖子内容基于网页分析, 帖子回复数过大可能会导致闪退, 仍使用App打开?',
            () => go(),
            undefined,
            () => {
              const url = `${HOST}${href}`
              t('超展开.跳转', {
                to: 'WebBrowser',
                url
              })
              setTimeout(() => {
                open(url)
              }, 800)
            }
          )
          return
        }

        go()
      }}
    >
      <Flex align='start'>
        <Flex.Item>
          <Title
            topicId={topicId}
            title={title}
            replyCount={replyCount}
            isReaded={isReaded}
            isGroup={isGroup}
          />
          <Detail time={time} groupCn={groupCn} userName={userName} userId={userId} />
        </Flex.Item>
      </Flex>
    </Touchable>
  )
}

export default obc(Content)

const styles = _.create({
  item: {
    paddingVertical: _.md,
    paddingLeft: _.sm,
    borderRadius: _.radiusXs,
    overflow: 'hidden'
  }
})
