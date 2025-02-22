/*
 * @Author: czy0729
 * @Date: 2021-07-12 09:55:15
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-01 12:10:34
 */
import React from 'react'
import { Page } from '@components'
import { ic } from '@utils/decorators'
import { useRunAfter, useObserver } from '@utils/hooks'
import Header from './header'
import List from './list'
import Store from './store'
import { Ctx } from './types'

const SubjectWiki = (props, { $ }: Ctx) => {
  useRunAfter(() => {
    $.init()
  })

  return useObserver(() => (
    <>
      <Header />
      <Page>
        <List />
      </Page>
    </>
  ))
}

export default ic(Store, SubjectWiki)
