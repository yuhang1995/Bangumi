/*
 * @Author: czy0729
 * @Date: 2019-09-20 22:05:50
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-11 06:40:28
 */
import React from 'react'
import { View } from 'react-native'
import {
  Flex,
  Input,
  Text,
  Button,
  Slider as CompSlider,
  Switch,
  Touchable
} from '@components'
import { IconTouchable } from '@_'
import { _ } from '@stores'
import { formatNumber, lastDate, confirm } from '@utils'
import { obc } from '@utils/decorators'
import { Ctx } from '../types'
import { memoStyles } from './styles'

function Slider({ style }, { $ }: Ctx) {
  const styles = memoStyles()
  const { showSacrifice, loading, amount, isSale, lastSacrifice } = $.state
  const { amount: userAmount, sacrifices = 0 } = $.userLogs
  const { current } = $.chara
  return (
    <View style={[styles.container, style]}>
      <Flex>
        <Flex.Item>
          <Text type='tinygrailPlain' size={13}>
            {showSacrifice
              ? isSale
                ? '出售：出售给英灵殿获得现金'
                : '献祭：转化为固定资产并获得现金道具'
              : '献祭'}
          </Text>
        </Flex.Item>
        {showSacrifice && (
          <Switch style={styles.switch} checked={isSale} onChange={$.switchIsSale} />
        )}
        <IconTouchable
          style={_.mr._sm}
          name={showSacrifice ? 'md-keyboard-arrow-up' : 'md-keyboard-arrow-down'}
          color={_.colorTinygrailText}
          onPress={$.toggleSacrifice}
        />
      </Flex>
      {showSacrifice && (
        <>
          <Flex style={_.mt.sm}>
            <Flex.Item>
              <View style={styles.inputWrap}>
                <Input
                  style={styles.input}
                  keyboardType='numeric'
                  value={String(Math.floor(amount))}
                  clearButtonMode='never'
                  onChangeText={$.changeAmount}
                />
                {!!sacrifices && (
                  <Text
                    style={styles.sacrifices}
                    type='ask'
                    size={12}
                    // @ts-ignore
                    pointerEvent='none'
                  >
                    已献祭{formatNumber(sacrifices, 0)}股
                  </Text>
                )}
              </View>
            </Flex.Item>
            <View style={[styles.btnSubmit, _.ml.md]}>
              <Button
                style={styles.btnAsk}
                type='ask'
                radius={false}
                loading={loading}
                onPress={() => {
                  if (loading) return

                  confirm(`确定献祭 ${amount}股?`, () => $.doSacrifice(), '小圣杯助手')
                }}
              >
                确定
              </Button>
            </View>
          </Flex>
          <Flex style={_.mt.sm}>
            <Touchable
              onPress={() => {
                if (loading) return

                confirm(
                  `当前角色测试献祭效率至少需要先献祭 (${$.testAmount}) 股, 确定?`,
                  () => $.doTestSacrifice(),
                  '小圣杯助手'
                )
              }}
            >
              <Text type='tinygrailText' size={12}>
                [效率]
              </Text>
            </Touchable>
            {!!lastSacrifice.time && (
              <Text style={_.ml.xs} type='tinygrailText' size={12}>
                最近 (单价
                {formatNumber(
                  Number(lastSacrifice.total) / Number(lastSacrifice.amount),
                  1
                )}{' '}
                / 效率
                {formatNumber(
                  (Number(lastSacrifice.total) /
                    Number(lastSacrifice.amount) /
                    current) *
                    100,
                  0
                )}
                % / {lastDate(lastSacrifice.time)})
              </Text>
            )}
          </Flex>
          <Flex style={[styles.slider, _.mt.sm]}>
            <Flex.Item>
              <View style={_.container.block}>
                <CompSlider
                  value={amount}
                  step={1}
                  min={0}
                  max={Math.floor(userAmount)}
                  minimumTrackTintColor={_.colorAsk}
                  maximumTrackTintColor={_.colorTinygrailBorder}
                  onChange={value => $.changeAmount(value)}
                />
              </View>
            </Flex.Item>
            <Touchable style={_.ml.sm} onPress={() => $.changeAmount(userAmount)}>
              <Text
                style={{
                  paddingVertical: _.sm
                }}
                type='tinygrailText'
                size={13}
              >
                [最大]
              </Text>
            </Touchable>
          </Flex>
          <Flex>
            <Flex.Item>
              <Text type='tinygrailText' size={12}>
                可用 0
              </Text>
            </Flex.Item>
            <Text type='tinygrailText' size={12}>
              {formatNumber(userAmount, 0)}股
            </Text>
          </Flex>
        </>
      )}
    </View>
  )
}

export default obc(Slider)
