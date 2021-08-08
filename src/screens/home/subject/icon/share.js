/*
 * @Author: czy0729
 * @Date: 2021-07-09 23:45:15
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-07-29 13:57:29
 */
import React from 'react'
import { IconTouchable } from '@screens/_'
import { _ } from '@stores'
import { ob } from '@utils/decorators'
import { getCoverMedium, getCoverLarge, cnjp } from '@utils/app'
import { t } from '@utils/fetch'
import { loading } from '@utils/ui'
import axios from '@utils/thirdParty/axios'
import { HOST } from '@constants'
import { HOST_CDN, CDN_OSS_SUBJECT } from '@constants/cdn'

function IconShare({ $, navigation }) {
  return (
    <IconTouchable
      name='md-ios-share'
      color={_.__colorPlain__}
      size={19}
      onPress={async () => {
        if (!navigation) return

        const { images = {} } = $.subject
        let src = CDN_OSS_SUBJECT(getCoverMedium(images.common))
        if (!src.includes(HOST_CDN)) src = getCoverLarge(images.common)

        const hide = loading('下载封面中...')

        axios.defaults.withCredentials = false
        const { request } = await axios({
          method: 'get',
          url: src.replace('http://', 'https://'),
          responseType: 'arraybuffer'
        })
        hide()

        navigation.push('Share', {
          _url: `${HOST}/subject/${$.subjectId}`,
          _cover: `data:image/jpg;base64,${request._response}`,
          _title: cnjp($.cn, $.jp),
          _content: $.summary.replace(/\r\n\r\n/g, '\r\n'),
          _detail: $.tags
            .filter((item, index) => index <= 4)
            .map(item => item.name)
            .join(' · ')
        })

        t('条目.拼图分享', {
          subjectId: $.subjectId
        })
      }}
    />
  )
}

export default ob(IconShare)