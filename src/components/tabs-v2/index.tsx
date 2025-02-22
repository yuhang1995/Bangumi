/*
 * @Author: czy0729
 * @Date: 2020-09-24 16:31:53
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-19 05:09:00
 */
import React, { useMemo } from 'react'
import { SceneMap } from 'react-native-tab-view'
import TabBar from '@components/@/react-native-tab-view/TabBar'
import TabView from '@components/@/react-native-tab-view/TabView'
import { _ } from '@stores'
import { TextStyle } from '@types'
import { Flex } from '../flex'
import { Text } from '../text'
import { W_INDICATOR, memoStyles } from './styles'
import { Props as TabsV2Props } from './types'

export { TabsV2Props }

export const TabsV2 = ({
  routes = [],
  tabBarLength,
  page = 0,
  textColor,
  backgroundColor,
  borderBottomColor,
  underlineColor,
  renderItem,
  renderLabel,
  onChange = () => {},
  ...other
}: TabsV2Props) => {
  const styles = memoStyles()
  const renderScene = useMemo(
    () =>
      SceneMap(
        Object.assign(
          {},
          ...routes.map(item => ({
            [item.key]: () => renderItem(item)
          }))
        )
      ),
    [renderItem, routes]
  )
  const W_TAB = useMemo(
    () => _.window.width / (tabBarLength || routes.length),
    [tabBarLength, routes]
  )
  const tabBarStyle = useMemo(
    () => [
      styles.tabBar,
      backgroundColor && {
        backgroundColor
      },
      borderBottomColor && {
        borderBottomColor
      }
    ],
    [styles, backgroundColor, borderBottomColor]
  )
  const tabStyle = useMemo(
    () => [
      styles.tab,
      {
        width: W_TAB
      }
    ],
    [styles, W_TAB]
  )
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        marginLeft: (W_TAB - W_INDICATOR) / 2
      },
      underlineColor && {
        backgroundColor: underlineColor
      }
    ],
    [styles, W_TAB, underlineColor]
  )
  const textStyle = useMemo<TextStyle>(
    () =>
      textColor
        ? {
            color: textColor
          }
        : undefined,
    [textColor]
  )
  return (
    <TabView
      lazyPreloadDistance={0}
      navigationState={{
        index: page,
        // @ts-ignore
        routes
      }}
      renderTabBar={props => (
        // @ts-ignore
        <TabBar
          {...props}
          style={tabBarStyle}
          tabStyle={tabStyle}
          labelStyle={styles.label}
          indicatorStyle={indicatorStyle}
          pressOpacity={1}
          pressColor='transparent'
          scrollEnabled
          renderLabel={
            renderLabel ||
            (({ route, focused }) => (
              <Flex style={styles.labelText} justify='center'>
                <Text style={textStyle} type='title' size={13} bold={focused}>
                  {route.title}
                </Text>
              </Flex>
            ))
          }
        />
      )}
      renderScene={renderScene}
      onIndexChange={onChange}
      {...other}
    />
  )
}
