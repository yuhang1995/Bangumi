/*
 * OSS 快照
 *
 * @Author: czy0729
 * @Date: 2022-06-23 01:47:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-13 04:55:45
 */
import axios from '@utils/thirdParty/axios'
import { getTimestamp } from '../utils'
import { HOST } from './ds'

/** 获取 */
export async function get(key: string) {
  // @ts-ignore
  const { data } = await axios({
    method: 'get',
    url: `${HOST}/v1/get/${key}`
  })

  if (data?.code === 200) return data?.data

  return null
}

/** 批量获取 */
export async function gets(keys: string[]) {
  // @ts-ignore
  const { data } = await axios({
    method: 'post',
    url: `${HOST}/v1/get`,
    data: {
      keys
    }
  })

  if (data?.code === 200) return data?.data

  return null
}

/** 更新 */
export async function update(key: string, value: object, updateTS: boolean = true) {
  // @ts-ignore
  const { data } = await axios({
    method: 'post',
    url: `${HOST}/v1/update`,
    data: {
      key,
      value: updateTS
        ? {
            ...value,
            ts: getTimestamp()
          }
        : {
            ts: getTimestamp(),
            ...value
          }
    }
  })

  return data
}

export async function onlines() {
  // @ts-ignore
  const { data } = await axios({
    method: 'get',
    url: `${HOST}/v1/online/get`
  })

  if (data?.code === 200) return data?.data

  return null
}

export async function report(userID: string | number) {
  // @ts-ignore
  const { data } = await axios({
    method: 'post',
    url: `${HOST}/v1/online/report`,
    data: {
      userID
    }
  })

  return data
}
