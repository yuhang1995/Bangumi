/*
 * @Author: czy0729
 * @Date: 2021-01-25 11:50:57
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-09 06:55:42
 */
import React from 'react'
import { Flex, Touchable, Heatmap } from '@components'
import { obc } from '@utils/decorators'
import { memoStyles } from './styles'

function Btns({ style = undefined, children = undefined, ...other }) {
  const styles = memoStyles()
  return (
    <Flex style={[styles.btns, style]} justify='center' {...other}>
      {children}
    </Flex>
  )
}

Btns.Touchable = function Item({
  heatmap = undefined,
  onSelect = undefined,
  children = undefined
}) {
  const styles = memoStyles()
  return (
    <Touchable onPress={onSelect}>
      <Flex style={styles.item} justify='center'>
        {children}
      </Flex>
      {!!heatmap && <Heatmap id={heatmap} />}
    </Touchable>
  )
}

export default obc(Btns)
