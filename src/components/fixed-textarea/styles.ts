/*
 * @Author: czy0729
 * @Date: 2022-05-06 20:33:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-16 04:25:43
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  maskContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  mask: {
    height: _.window.height,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  container: {
    position: 'absolute',
    zIndex: 1001,
    right: 0,
    bottom: 0,
    left: 0,
    paddingTop: 2,
    paddingBottom: _.ios(20, 0),
    marginBottom: -1,
    backgroundColor: 'transparent',
    border: 0,
    borderRadius: 0
  },
  plain: {
    backgroundColor: _.select(_.colorPlain, _._colorDarkModeLevel1),
    borderTopWidth: _.select(_.hairlineWidth, 0),
    borderTopColor: _.colorBorder
  },
  toolBar: {
    paddingVertical: _.sm,
    paddingHorizontal: _.wind,
    marginLeft: -_.sm
  },
  toolBarBtn: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  bgmContainer: {
    paddingVertical: _.sm
  },
  bgms: {
    paddingHorizontal: _.wind - _._wind
  },
  bgm: {
    width: _.isLandscape ? '7.14%' : '14.28%',
    paddingVertical: _.md
  },
  replyHistory: {
    paddingHorizontal: _.wind,
    paddingVertical: _.sm
  },
  textareaContainer: {
    paddingHorizontal: _.wind,
    border: 0,
    borderBottomColor: 'transparent'
  },
  textarea: {
    minHeight: 48,
    paddingTop: 12,
    paddingHorizontal: 0,
    paddingBottom: 8,
    marginBottom: -_.hairlineWidth,
    color: _.colorDesc,
    fontSize: 14 + _.fontSizeAdjust,
    lineHeight: 22,
    backgroundColor: 'transparent'
  },
  touchSend: {
    marginTop: _.ios(8, 4),
    marginLeft: _.sm,
    marginRight: -4,
    borderRadius: 20,
    overflow: 'hidden'
  },
  send: {
    width: 36,
    height: 36,
    marginTop: _.platforms(0, 0, _.device(0, _.xs), 0)
  },
  touchSource: {
    padding: _.xs,
    marginRight: -_.sm,
    borderRadius: _.radiusSm,
    overflow: 'hidden'
  },
  source: {
    position: 'absolute',
    zIndex: 2,
    right: 4,
    bottom: _.md,
    left: 2
  },
  opacity: {
    opacity: 0.8
  },
  hide: {
    display: 'none'
  }
}))
