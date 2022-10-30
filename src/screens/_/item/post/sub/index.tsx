/*
 * @Author: czy0729
 * @Date: 2020-12-21 16:03:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-18 04:39:01
 */
import React from 'react'
import { rakuenStore } from '@stores'
import { obc } from '@utils/decorators'
import { isBlockUser } from '../utils'
import ItemSub from './item'
import { memoStyles } from './styles'

export default obc(
  (
    {
      authorId,
      avatar,
      erase,
      floor,
      id,
      matchLink,
      message,
      postId,
      readedTime,
      replySub,
      showFixedTextare,
      time,
      uid,
      url,
      userId,
      userName,
      event
    },
    { $, navigation }
  ) => {
    global.rerender('Topic.ItemSub')

    // 屏蔽脏数据
    if (!userId) return null

    if (isBlockUser(userId, userName, replySub)) return null

    const { translateResultFloor } = $.state
    const { blockKeywords, quote, quoteAvatar, wide } = rakuenStore.setting
    return (
      <ItemSub
        navigation={navigation}
        styles={memoStyles()}
        authorId={authorId}
        avatar={avatar}
        blockKeywords={blockKeywords}
        erase={erase}
        filterDelete={$.filterDelete}
        floor={floor}
        id={id}
        isBlockUser={$.isBlockUser}
        matchLink={matchLink}
        message={message}
        myFriendsMap={$.myFriendsMap}
        postId={postId}
        postUsersMap={$.postUsersMap}
        quote={quote}
        quoteAvatar={quoteAvatar}
        wide={wide}
        readedTime={readedTime}
        replySub={replySub}
        showFixedTextare={showFixedTextare}
        time={time}
        translate={translateResultFloor?.[id]}
        uid={uid}
        url={url}
        userId={userId}
        userName={userName}
        event={event}
      />
    )
  }
)