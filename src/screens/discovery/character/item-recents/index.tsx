/*
 * @Author: czy0729
 * @Date: 2019-10-01 22:12:14
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-28 01:12:50
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Flex, Katakana, Text, Heatmap } from '@components'
import { Tag, Stars, Cover } from '@_'
import { _ } from '@stores'
import { cnjp, HTMLDecode, x18 } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { MODEL_SUBJECT_TYPE, IMG_WIDTH_LG, IMG_HEIGHT_LG } from '@constants'
import { SubjectTypeCn } from '@types'
import { Ctx } from '../types'
import { memoStyles } from './styles'

function ItemRecents(
  { index, id, cover, name, nameJP, type, info, star, starInfo, actors = [] },
  { navigation }: Ctx
) {
  const styles = memoStyles()
  const isFirst = index === 0
  const onPress = () => {
    t('收藏的人物.跳转', {
      to: 'Subject',
      subjectId: id
    })
    navigation.push('Subject', {
      subjectId: id,
      _jp: nameJP,
      _cn: name,
      _image: cover
    })
  }
  const typeCn = MODEL_SUBJECT_TYPE.getTitle<SubjectTypeCn>(type)

  const left = cnjp(name, nameJP)
  const right = cnjp(nameJP, name)
  return (
    <View style={styles.container}>
      <Flex align='start' style={[styles.wrap, !isFirst && !_.flat && styles.border]}>
        <View style={styles.imgContainer}>
          {!!cover && (
            <Cover
              src={cover}
              width={IMG_WIDTH_LG}
              height={IMG_HEIGHT_LG}
              radius
              shadow
              type={typeCn}
              onPress={onPress}
            />
          )}
        </View>
        <Flex.Item>
          <Touchable onPress={onPress}>
            <Flex direction='column' justify='between' align='start'>
              <View>
                <Flex style={_.container.block} align='start'>
                  <Flex.Item>
                    <Katakana.Provider size={15} numberOfLines={2}>
                      <Katakana size={15} bold>
                        {left}
                      </Katakana>
                      {!!right && (
                        <Katakana type='sub' size={11} lineHeight={15}>
                          {' '}
                          {right}
                        </Katakana>
                      )}
                    </Katakana.Provider>
                  </Flex.Item>
                  <Flex style={_.mt.xxs}>
                    {x18(id, name || nameJP) && <Tag style={_.ml.sm} value='NSFW' />}
                    {!!type && <Tag style={_.ml.sm} value={typeCn} />}
                  </Flex>
                </Flex>
                {!!info && (
                  <Text style={_.mt.sm} size={12} lineHeight={14} numberOfLines={4}>
                    {HTMLDecode(info)}
                  </Text>
                )}
              </View>
              {!!star && !!starInfo && (
                <Flex style={_.mt.sm}>
                  {!!star && <Stars style={_.mr.xs} value={star} />}
                  <Text style={_.mr.sm} type='sub' size={12}>
                    {starInfo}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Touchable>
          <Flex style={_.mt.sm} wrap='wrap'>
            {actors.map(item => (
              <Flex key={item.id} style={[actors.length > 1 && styles.actors, _.mt.md]}>
                <Cover
                  src={item.avatar}
                  size={_.r(40)}
                  radius
                  shadow
                  onPress={() => {
                    t('收藏的人物.跳转', {
                      to: 'Mono',
                      monoId: item.id
                    })

                    navigation.push('Mono', {
                      monoId: item.id
                    })
                  }}
                />
                <Flex.Item style={_.ml.sm}>
                  <Text size={12} numberOfLines={1} bold>
                    {item.name}
                  </Text>
                  <Text size={10} lineHeight={12} type='sub' numberOfLines={1}>
                    {item.info}
                  </Text>
                </Flex.Item>
              </Flex>
            ))}
          </Flex>
        </Flex.Item>
      </Flex>
      {!index && <Heatmap id='收藏的人物.跳转' />}
    </View>
  )
}

export default obc(ItemRecents)
