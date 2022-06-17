/*
 * @Author: czy0729
 * @Date: 2022-06-17 12:52:18
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-06-17 12:52:18
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  touchable: {
    paddingLeft: _._wind
  },
  item: {
    paddingVertical: 12,
    paddingRight: _._wind
  },
  information: {
    maxWidth: '86%'
  }
}))
