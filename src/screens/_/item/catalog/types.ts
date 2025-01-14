/*
 * @Author: czy0729
 * @Date: 2022-06-16 23:36:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-06 19:37:24
 */
import { EventType, Id } from '@types'

export type Props = {
  event?: EventType
  id?: Id
  name?: string

  /** 目录编纂者 (别人的才存在) */
  userName?: string
  title?: string
  info?: string
  book?: any
  anime?: any
  music?: any
  game?: any
  real?: any

  /** 最后更新时间 */
  time?: string
  last?: string

  /** 标题高亮值 */
  filter?: string

  /** 是否自己创建的目录 */
  isUser?: boolean
  hideScore?: boolean
  children?: any
}
