/*
 * @Author: czy0729
 * @Date: 2022-05-05 19:38:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-05-28 13:07:08
 */
import React from 'react'
import { observer } from 'mobx-react'
import { _ } from '@stores'
import { Flex } from '../flex'
import { Text } from '../text'
import { Popover } from '../popover/comp'
import { Iconfont } from '../iconfont'
import { Heatmap } from '../heatmap'
import { memoStyles } from './styles'
import { ToolBarPopoverProps } from './types'

export const ToolBarPopover = observer(
  ({
    data,
    icon,
    iconColor,
    iconSize = 18,
    type = 'sub',
    text,
    heatmap,
    transparent,
    onSelect
  }: ToolBarPopoverProps) => {
    const styles = memoStyles()
    return (
      <Popover
        style={[styles.touch, transparent && styles.transparentTouch]}
        data={data}
        onSelect={onSelect}
      >
        <Flex
          style={[styles.item, transparent && styles.transparentItem]}
          justify='center'
        >
          {!!icon && (
            <Iconfont
              style={!!text && _.mr.xs}
              name={icon}
              size={iconSize}
              color={iconColor}
            />
          )}
          {!!text && (
            <Text size={12} type={type} bold>
              {text}
            </Text>
          )}
        </Flex>
        {!!heatmap && <Heatmap id={heatmap} />}
      </Popover>
    )
  }
)
