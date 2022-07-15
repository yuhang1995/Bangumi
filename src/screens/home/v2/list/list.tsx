/*
 * @Author: czy0729
 * @Date: 2022-06-19 12:58:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-20 17:08:33
 */
import React from 'react'
import { PaginationList2 as ListView } from '@_'
import { _ } from '@stores'
import { memo } from '@utils/decorators'
import Filter from '../filter'
import Empty from '../empty'
import { keyExtractor, renderItem } from './utils'
import { DEFAULT_PROPS } from './ds'

const List = memo(
  ({
    // connectRef,
    styles,
    data,
    title,
    scrollToTop,
    onHeaderRefresh,
    onFooterRefresh
  }) => {
    global.rerender('Home.List.Main')

    const { length } = data.list
    const emptyComponent = <Empty title={title} length={length} />
    return (
      <ListView
        // ref={connectRef}
        style={styles.listView}
        contentContainerStyle={styles.contentContainerStyle}
        progressViewOffset={_.ios(styles.contentContainerStyle.paddingTop - _.sm, 0)}
        keyExtractor={keyExtractor}
        data={data.list}
        limit={10}
        scrollToTop={scrollToTop}
        ListHeaderComponent={<Filter length={length} />}
        renderItem={renderItem}
        footerEmptyDataComponent={emptyComponent}
        footerNoMoreDataComponent={emptyComponent}
        footerNoMoreDataText=''
        onHeaderRefresh={onHeaderRefresh}
        onFooterRefresh={onFooterRefresh}
      />
    )
  },
  DEFAULT_PROPS
)

export default List