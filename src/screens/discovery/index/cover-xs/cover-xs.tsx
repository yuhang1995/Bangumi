/*
 * @Author: czy0729
 * @Date: 2022-09-10 06:52:24
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-10 07:08:41
 */
import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Flex, Text, UserStatus } from '@components'
import { Cover, Avatar } from '@_'
import { _, systemStore } from '@stores'
import { getCoverMedium, HTMLDecode } from '@utils'
import { memo } from '@utils/decorators'
import { t } from '@utils/fetch'
import { linearColor } from '../ds'
import { DEFAULT_PROPS } from './ds'
import { AVATAR_SIZE } from './styles'

export default memo(
  ({ navigation, styles, imageWidth, avatarRound, title, avatar, data }) => {
    global.rerender('Discovery.CoverXs.Main')

    const { coverRadius } = systemStore.setting
    const isMusic = title === '音乐'
    const imageHeight = imageWidth * 1.38
    return (
      <View>
        <View
          style={[
            styles.item,
            {
              borderRadius: coverRadius
            }
          ]}
        >
          <Cover
            src={getCoverMedium(data.cover)}
            width={imageWidth}
            height={isMusic ? imageWidth : imageHeight}
            radius
            placeholder={false}
            onPress={() => {
              t('发现.跳转', {
                to: 'Subject',
                from: title,
                type: 'xs',
                subjectId: data.id
              })

              navigation.push('Subject', {
                subjectId: data.id,
                _jp: data.name,
                _type: title,
                _image: data.cover
              })
            }}
          />
          <LinearGradient
            style={styles.linear}
            // @ts-ignores
            colors={linearColor}
            pointerEvents='none'
          />
          <Text
            style={styles.desc}
            size={8}
            type={_.select('plain', 'title')}
            numberOfLines={2}
            bold
            // @ts-ignores
            pointerEvents='none'
          >
            {HTMLDecode(data.name)}
          </Text>
        </View>
        {!!avatar && (
          <Flex
            style={[styles.fixed, avatarRound && styles.avatarRound]}
            justify='center'
          >
            <UserStatus userId={data.userId} mini>
              <Avatar
                navigation={navigation}
                style={styles.avatar}
                size={AVATAR_SIZE}
                src={avatar}
                userId={data.userId}
                name={data.userName}
                borderColor='transparent'
              />
            </UserStatus>
          </Flex>
        )}
      </View>
    )
  },
  DEFAULT_PROPS
)
