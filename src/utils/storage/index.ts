/*
 * 本地化
 *  - 写入本地动作会有合并逻辑和时间间隔，目的是避免短时间过度写入
 *
 * @Author: czy0729
 * @Date: 2022-04-13 04:14:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-29 20:50:19
 */
import AsyncStorage from '@components/@/react-native-async-storage'
import { DEV } from '@/config'
import { queue } from '../utils'
import { LAZY_SET_STORAGE_SIZE, LAZY_SET_STORAGE_INTERVAL } from './ds'

const SET_STORAGE_LAZY_MAP = {}

let setStorageInterval: number
if (setStorageInterval) clearInterval(setStorageInterval)

/** 读取数据 */
export async function getStorage(key: string) {
  try {
    if (!key) return null

    const data = await AsyncStorage.getItem(key)
    return Promise.resolve(JSON.parse(data))
  } catch (error) {
    return Promise.resolve(null)
  }
}

/** 保存数据到本地 (会对大于 LAZY_SET_STORAGE_SIZE 的操作进行延迟合并保存到本地) */
export async function setStorage(key: string, data: any) {
  if (!key) return

  const _data = JSON.stringify(data)
  if (_data.length >= LAZY_SET_STORAGE_SIZE) {
    SET_STORAGE_LAZY_MAP[key] = _data
    return
  }

  AsyncStorage.setItem(key, _data)

  // if (DEV) {
  //   console.info(
  //     'setStorage',
  //     key,
  //     `${(JSON.stringify(data).length / 1000).toFixed(2)}kb`
  //   )
  // }
}

/** 数据较大的键, 合并没必要的多次写入 */
setStorageInterval = setInterval(async () => {
  const keys = Object.keys(SET_STORAGE_LAZY_MAP)
  if (!keys.length) return

  const setItems = []
  keys.forEach(key => {
    setItems.push(async () => {
      AsyncStorage.setItem(key, SET_STORAGE_LAZY_MAP[key])
      delete SET_STORAGE_LAZY_MAP[key]

      if (DEV) {
        console.info(
          'setStorageLazy',
          key,
          `${(SET_STORAGE_LAZY_MAP[key].length / 1000).toFixed(2)}kb`
        )
      }
    })
  })

  queue(setItems, 1)
}, LAZY_SET_STORAGE_INTERVAL)
