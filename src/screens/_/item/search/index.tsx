/*
 * @Author: czy0729
 * @Date: 2019-05-15 16:26:34
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-23 14:25:01
 */
import React from 'react'
import { ob } from '@utils/decorators'
import Item from './item'
import { memoStyles } from './styles'
import { Props as ItemSearchProps } from './types'

export { ItemSearchProps }

export const ItemSearch = ob(
  ({
    navigation,
    style,
    id,
    name,
    nameCn,
    cover,
    typeCn,
    tip,
    rank,
    score,
    total,
    comments,
    collection,
    collected,
    position,
    event,
    onManagePress
  }: ItemSearchProps) => {
    global.rerender('Component.ItemSearch')

    return (
      <Item
        navigation={navigation}
        styles={memoStyles()}
        style={style}
        id={id}
        name={name}
        nameCn={nameCn}
        cover={cover}
        typeCn={typeCn}
        tip={tip}
        rank={rank}
        score={score}
        total={total}
        comments={comments}
        collection={collection}
        collected={collected}
        position={position}
        event={event}
        onManagePress={onManagePress}
      />
    )
  }
)
