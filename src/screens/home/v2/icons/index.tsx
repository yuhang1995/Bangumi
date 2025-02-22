/*
 * @Author: czy0729
 * @Date: 2020-04-21 10:28:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-19 17:28:31
 */
import React from 'react'
import { Flex } from '@components'
import { IconNotify, IconTinygrail, IconTabsHeader } from '@_'
import { _, systemStore } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { styles } from './styles'

const EVENT = {
  id: '首页.跳转'
} as const

function Icons(props, { navigation }) {
  global.rerender('Home.Icons')

  const { tinygrail } = systemStore.setting
  return (
    <Flex style={styles.icons}>
      <IconNotify
        style={[styles.icon, _.mr.sm]}
        navigation={navigation}
        event={EVENT}
      />
      {tinygrail ? (
        <IconTinygrail style={styles.icon} navigation={navigation} event={EVENT} />
      ) : (
        <IconTabsHeader
          style={styles.icon}
          name='md-search'
          onPress={() => {
            t('首页.跳转', {
              to: 'Search'
            })
            navigation.push('Search')
          }}
        />
      )}
    </Flex>
  )
}

export default obc(Icons)
