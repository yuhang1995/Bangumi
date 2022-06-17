/*
 * @Author: czy0729
 * @Date: 2022-06-17 20:17:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-17 20:19:10
 */
import { _ } from '@stores'
import { AVATAR_WIDTH } from './ds'

export const memoStyles = _.memoStyles(() => ({
  item: {
    ..._.container.item,
    paddingVertical: _.xs
  },
  withoutAvatar: {
    marginTop: -_.md
  },
  scrollView: {
    marginTop: _.sm,
    marginRight: -40
  },
  images: {
    paddingTop: _.sm,
    paddingRight: _.sm,
    paddingBottom: _.md
  },
  avatar: {
    width: _.r(AVATAR_WIDTH),
    marginTop: 18,
    marginLeft: _.wind
  },
  content: {
    paddingTop: _.md,
    paddingRight: _.wind - _._wind,
    paddingBottom: _.md
  },
  noPR: {
    paddingVertical: _.md,
    paddingRight: _.wind - _._wind
  },
  hasPR: {
    paddingRight: _._wind
  },
  touch: {
    marginTop: -7,
    marginHorizontal: _.xs,
    borderRadius: 20,
    overflow: 'hidden'
  },
  extra: {
    width: 36,
    height: 36
  },
  more: {
    paddingHorizontal: 0
  }
}))
