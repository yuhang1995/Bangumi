/*
 * @Author: czy0729
 * @Date: 2022-11-05 22:03:57
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-08 16:14:54
 */
import React from 'react'
import { observer } from 'mobx-react'
import AntdModal from '../@/ant-design/modal'
import { Text } from '../text'
import { Props as ModalProps } from './types'

export { ModalProps }

export const Modal = observer(
  ({ style, visible, title, type = 'title', focus, onClose, children }: ModalProps) => {
    return (
      <AntdModal
        style={style}
        visible={visible}
        focus={focus}
        title={
          <Text type={type} size={16}>
            {title}
          </Text>
        }
        transparent
        blurView
        closable
        maskClosable
        onClose={onClose}
      >
        {children}
      </AntdModal>
    )
  }
)
