/*
 * @Author: czy0729
 * @Date: 2022-06-12 16:04:38
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-01 10:43:26
 */
import { ColorValue, EventType, Navigation, ViewStyle, Fn } from '@types'

export type Props = {
  /** 图片容器样式 */
  style?: ViewStyle

  /** 路由 */
  navigation?: Navigation

  /** 用户 id, 存在则允许点击进入用户空间 */
  userId?: number | string

  /** 用户昵称 */
  name?: string

  /** 头像地址 */
  src?: string

  /** 大小 */
  size?: number

  /** 边框大小 */
  borderWidth?: number

  /** 边框颜色 */
  borderColor?: ColorValue

  /** 埋点事件 */
  event?: EventType

  /** 路由跳转额外传递参数 */
  params?: object

  /** 是否强制圆形 */
  round?: boolean

  /** 圆角大小 */
  radius?: number | boolean

  /** 是否显示底色 */
  placeholder?: boolean

  fallbackSrc?: string

  /** 点击回调, 会覆盖跳转到用户空间的事件 */
  onPress?: Fn

  /** 长按回调 */
  onLongPress?: Fn
}
