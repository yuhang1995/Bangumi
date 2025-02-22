/*
 * @Author: czy0729
 * @Date: 2022-08-14 07:00:05
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-14 07:50:49
 */
import { factory } from '@utils'
import { Navigation } from '@types'
import Store from './store'
import { TABS } from './ds'

const f = factory(Store)

export type StoreType = typeof f

export type Ctx = {
  $: StoreType
  navigation?: Navigation
}

export type TabLabel = typeof TABS[number]['title']
