/*
 * @Author: czy0729
 * @Date: 2019-05-25 22:03:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-06 05:34:06
 */
import React from 'react'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import ParallaxImage from './parallax-image'
import { memoStyles } from './styles'

export default obc(({ scrollY, fixed }, { $, navigation }) => {
  global.rerender('User.ParallaxImage')

  const { id, avatar = {}, nickname, username } = $.usersInfo
  return (
    <ParallaxImage
      navigation={navigation}
      themeStyles={memoStyles()}
      parallaxImageHeight={_.parallaxImageHeight}
      avatar={avatar}
      bg={$.bg}
      fixed={fixed}
      id={id}
      myUserId={$.myUserId}
      nickname={nickname}
      paramsUserId={$.params.userId}
      scrollY={scrollY}
      src={$.avatar || avatar.large}
      textType={_.select('plain', 'title')}
      userId={$.userId}
      username={username}
    />
  )
})
