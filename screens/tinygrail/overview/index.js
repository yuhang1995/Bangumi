/*
 * @Author: czy0729
 * @Date: 2019-08-25 19:12:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-09-15 13:01:37
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { StatusBarEvents } from '@components'
import { inject, withHeader } from '@utils/decorators'
import { hm } from '@utils/fetch'
import _ from '@styles'
import { colorContainer } from '../styles'
import Tabs from './tabs'
import List from './list'
import Store, { tabs } from './store'

export default
@inject(Store)
@withHeader({
  headerStyle: {
    backgroundColor: colorContainer,
    borderBottomColor: colorContainer
  },
  headerTitleStyle: {
    color: _.colorPlain
  },
  iconBackColor: _.colorPlain
})
@observer
class TinygrailOverview extends React.Component {
  static navigationOptions = {
    title: '交易榜单'
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  componentDidMount() {
    const { $ } = this.context
    $.init()

    hm('tinygrail/overview')
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.state
    if (!_loaded) {
      return null
    }

    return (
      <View
        style={[
          _.container.flex,
          {
            backgroundColor: colorContainer
          }
        ]}
      >
        <StatusBarEvents
          barStyle='light-content'
          backgroundColor={colorContainer}
        />
        <Tabs style={_.container.flex} $={$}>
          {tabs.map((item, index) => (
            <List key={item.key} index={index} />
          ))}
        </Tabs>
      </View>
    )
  }
}