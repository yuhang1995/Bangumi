/*
 * @Author: czy0729
 * @Date: 2022-06-19 12:57:35
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-09 11:31:05
 */
import { IOS, LIST_EMPTY } from '@constants'
import { StoreType, TabLabel } from '../types'
import { memoStyles } from './styles'

export const DEFAULT_PROPS = {
  styles: {} as ReturnType<typeof memoStyles>,
  connectRef: (() => {}) as (ref: any) => ReturnType<StoreType['connectRef']>,
  data: LIST_EMPTY as ReturnType<StoreType['currentCollection']>,
  title: '' as TabLabel,
  scrollToTop: false as boolean,
  showItem: (IOS ? false : true) as boolean,
  onHeaderRefresh: (() => {}) as StoreType['onHeaderRefresh'],
  onFooterRefresh: undefined as StoreType['onFooterRefresh']
}
