/*
 * @Author: czy0729
 * @Date: 2019-03-13 08:34:37
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-06-23 00:48:23
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationEvents, SafeAreaView } from 'react-navigation'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Image } from '@components'
import { IconTabBar, IconTabsHeader, ManageModal } from '@screens/_'
import { inject, withTabsHeader } from '@utils/decorators'
import { analysis } from '@utils/fetch'
import { IOS } from '@constants'
import _ from '@styles'
import Tabs from './tabs'
import List from './list'
import Store, { tabs } from './store'

const title = '首页'

export default
@inject(Store)
@withTabsHeader()
@observer
class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <>
        <IconTabsHeader
          name='star-list'
          onPress={() => navigation.push('Discovery')}
        />
        <IconTabsHeader
          name='calendar'
          onPress={() => navigation.push('Calendar')}
        />
        <IconTabsHeader
          name='search'
          onPress={() => navigation.push('Search')}
        />
      </>
    ),
    tabBarIcon: ({ tintColor }) => <IconTabBar name='star' color={tintColor} />,
    tabBarLabel: '进度'
  })

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  async componentDidMount() {
    const { $, navigation } = this.context
    await $.init()

    // $不能通过contextType传递进去navigation里面, 只能通过下面的方法传递
    withTabsHeader.setTabs(navigation, <Tabs $={$} />)

    if ($.isLogin) {
      const { avatar } = $.userInfo
      navigation.setParams({
        headerLeft: (
          <View style={!IOS && styles.avatarAndroid}>
            <Image
              style={styles.avatar}
              size={28}
              src={avatar.medium}
              onPress={() => {
                navigation.push('User')
              }}
            />
          </View>
        )
      })
    }

    analysis('home', `${title} - ${$.userInfo.userId} | ${$.userInfo.nickname}`)
  }

  render() {
    const { $, navigation } = this.context
    if (!$.isLogin) {
      return (
        <NavigationEvents
          onWillFocus={() => {
            navigation.navigate('Auth')
          }}
        />
      )
    }

    const { visible, subjectId, _loaded } = $.state
    if (!_loaded) {
      return null
    }

    const { name, name_cn: nameCn } = $.subject(subjectId)
    return (
      <SafeAreaView style={_.container.screen} forceInset={{ top: 'never' }}>
        <Tabs $={$} tabBarStyle={withTabsHeader.tabBarStyle}>
          {tabs.map(item => (
            <List key={item.title} title={item.title} />
          ))}
        </Tabs>
        <ManageModal
          visible={visible}
          subjectId={subjectId}
          title={nameCn || name}
          desc={name}
          onSubmit={$.doUpdateCollection}
          onClose={$.closeManageModal}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 28,
    height: 28,
    marginLeft: _.sm,
    marginBottom: _.tabsHeight,
    borderRadius: 32,
    overflow: 'hidden'
  },
  avatarAndroid: {
    paddingTop: _.statusBarHeight + _.md
  }
})
