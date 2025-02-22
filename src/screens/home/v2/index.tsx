/*
 * @Author: czy0729
 * @Date: 2019-03-13 08:34:37
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-28 01:09:13
 */
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Page } from '@components'
import { EVENT_APP_TAB_PRESS } from '@src/navigations/tab-bar'
import { privacy } from '@utils'
import { ic } from '@utils/decorators'
import { useRunAfter, useObserver } from '@utils/hooks'
import { Track } from '@components'
import { StatusBarEvents, Auth, NavigationBarEvents, LoginNotice } from '@_'
import { _ } from '@stores'
import { IOS } from '@constants'
import Header from './header'
import Tab from './tab-wrap'
import Tips from './tips'
import Modal from './modal'
import Heatmaps from './heatmaps'
import Store from './store'
import { Ctx } from './types'

const Home = (props, { $, navigation }: Ctx) => {
  useRunAfter(() => {
    if (!IOS && !$.isLogin) privacy()
    $.updateInitialPage(navigation)

    navigation.addListener(`${EVENT_APP_TAB_PRESS}|Home`, () => {
      $.onRefreshThenScrollTop()
    })
  })

  useFocusEffect(() => {
    $.init()
  })

  return useObserver(() => (
    <>
      <StatusBarEvents backgroundColor='transparent' />
      <Page style={_.ios(_.container.bg, _.container.plain)}>
        {$.isLogin ? (
          <>
            <Header />
            {$.state._loaded && <Tab length={$.tabs.length} />}
            <Tips />
            <Modal />
            <Track title='首页' hm={[`?id=${$.userId}`, 'Home']} />
          </>
        ) : (
          <Auth />
        )}
      </Page>
      <LoginNotice navigation={navigation} />
      <NavigationBarEvents />
      <Heatmaps />
    </>
  ))
}

export default ic(Store, Home)
