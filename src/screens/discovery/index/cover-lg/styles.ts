/*
 * @Author: czy0729
 * @Date: 2022-09-10 08:09:40
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-09-10 08:09:40
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  item: {
    marginTop: _.md,
    marginHorizontal: _.windSm,
    borderRadius: _.radiusMd,
    backgroundColor: _.colorBg,
    overflow: 'hidden',
    ..._.shadow
  },
  cover: {
    width: _.windowSm.contentWidth,
    height: _.windowSm.contentWidth * 1.38
  },
  linear: {
    position: 'absolute',
    zIndex: 1,
    height: 96,
    right: 0,
    bottom: 0,
    left: 0,
    marginBottom: -0.5
  },
  desc: {
    position: 'absolute',
    zIndex: 2,
    right: _._wind - 2,
    bottom: _.md - 2,
    left: _._wind - 2,
    opacity: 0.92
  },
  touch: {
    borderRadius: _.radiusMd,
    overflow: 'hidden'
  }
}))
