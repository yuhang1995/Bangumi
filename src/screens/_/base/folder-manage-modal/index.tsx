/*
 * 目录管理弹窗
 *
 * @Author: czy0729
 * @Date: 2021-05-27 14:20:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-07 04:59:46
 */
import React from 'react'
import { BackHandler, ScrollView, View } from 'react-native'
import { computed } from 'mobx'
import {
  Modal,
  Touchable,
  Flex,
  Text,
  Iconfont,
  Input,
  Divider,
  Empty
} from '@components'
import TextareaItem from '@ant-design/react-native/lib/textarea-item'
import { _, userStore, usersStore, discoveryStore, collectionStore } from '@stores'
import { getTimestamp, setStorage, getStorage, asc, desc } from '@utils'
import { ob } from '@utils/decorators'
import { queue, t } from '@utils/fetch'
import { info, feedback, confirm } from '@utils/ui'
import { HTMLDecode } from '@utils/html'
import { SCROLL_VIEW_RESET_PROPS } from '@constants'
import i18n from '@constants/i18n'
import { Cover } from '../cover'
import { Popover } from '../popover'
import { Tag } from '../tag'
import { IconTouchable } from '../../icon/touchable'
import { STORAGE_KEY, WIDTH, HEIGHT, CONTROL_DS } from './ds'
import { memoStyles } from './styles'
import { Props as FolderManageModalProps, State } from './types'

export { FolderManageModalProps }

let loaded = false

export const FolderManageModal = ob(
  class FolderManageModalComponent extends React.Component<
    FolderManageModalProps,
    State
  > {
    static defaultProps = {
      id: 0,
      defaultExpand: 0,
      defaultEditItem: null,
      visible: false,
      title: '目录',
      onSubmit: Function.prototype,
      onClose: Function.prototype
    }

    state: State = {
      visible: false,
      expand: [],
      create: false,
      title: '',
      desc: '',
      edit: 0,
      content: '',
      order: '0'
    }

    formhash

    textareaRef

    async componentDidMount() {
      const expand = await getStorage(STORAGE_KEY)
      if (Array.isArray(expand)) {
        this.setState({
          expand
        })
      }

      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid)
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
      const { visible } = nextProps
      this.setState({
        visible
      })

      if (!this.props.visible && nextProps.visible) {
        this.fetchCatalogs()

        setTimeout(() => {
          const { defaultExpand, defaultEditItem } = nextProps
          if (defaultExpand) {
            this.setState({
              expand: [String(defaultExpand)],
              edit: 0,
              content: '',
              order: '0'
            })
          }

          if (defaultEditItem) {
            this.onSubjectEdit(defaultEditItem)
          }
        }, 80)
      }
    }

    componentWillUnmount() {
      this.setState({
        visible: false
      })
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid)
    }

    onBackAndroid = () => {
      const { visible, onClose } = this.props
      if (visible) {
        onClose()
        return true
      }
      return false
    }

    /**
     * 请求目录列表
     */
    fetchCatalogs = async () => {
      const data = await usersStore.fetchCatalogs(
        {
          isCollect: false
        },
        true
      )

      // 目录是有分页的比较麻烦, 暂时只判断是否存在第二页, 后面忽略
      if (data.pagination.pageTotal > 1) {
        await usersStore.fetchCatalogs({
          isCollect: false
        })
      }

      const { list } = this.catalogs
      queue(list.map(item => () => this.fetchCatalogDetail(item.id, !loaded)))
      loaded = true

      return true
    }

    /**
     * 请求目录详情
     */
    fetchCatalogDetail = async (id, refresh) => {
      if (!refresh) {
        const data = discoveryStore.catalogDetail(id)
        const { _loaded } = data
        if (_loaded && getTimestamp() - Number(_loaded) <= 300) return true
      }

      await discoveryStore.fetchCatalogDetail({
        id
      })

      // 缓存最新formhash
      const { list } = this.catalogDetail(id)
      if (list && list.length) {
        const { erase } = list[0]
        const formhash = erase?.split('?gh=')[1]
        if (formhash) {
          this.formhash = formhash
        }
      }

      return true
    }

    /**
     * track
     */
    t(value, other = {}) {
      const { id } = this.props
      t('其他.管理目录', {
        subjectId: id,
        value,
        ...other
      })
    }

    /**
     * 目录展开
     */
    onExpand = item => {
      const { expand } = this.state
      this.setState(
        {
          expand: expand.includes(item.id)
            ? expand.filter(i => !(i == item.id))
            : [...expand, item.id],
          edit: 0,
          content: '',
          order: '0'
        },
        () => {
          setStorage(STORAGE_KEY, this.state.expand)
        }
      )
    }

    /**
     * 添加/移出
     */
    onToggle = (item, detail, isIn) => {
      if (!isIn) {
        discoveryStore.doCatalogAddRelate(
          {
            catalogId: item.id,
            subjectId: this.props.id,
            formhash: this.formhash || userStore.formhash
          },
          () => {
            info('已添加')
            feedback()
            this.fetchCatalogDetail(item.id, true)
            this.t('onToggle:in')
          }
        )
        return
      }

      const { id } = this.props
      const find = detail.list.find(i => i.id == id)
      if (!find || !find.erase) {
        info('目录信息有误, 暂不能把该条目移出目录, 请重新进入页面')
        return
      }

      confirm('移出会同时删除目录评价, 确定?', () => {
        discoveryStore.doCatalogDeleteRelate(
          {
            erase: find.erase
          },
          () => {
            info('已移出')
            feedback()
            this.fetchCatalogDetail(item.id, true)
            this.t('onToggle:out')
          }
        )
      })
    }

    /**
     * 更多菜单
     */
    onControl = (title, item) => {
      const detail = this.catalogDetail(item.id)
      switch (title) {
        case '修改':
          this.setState({
            create: item.id,
            title: item.title || '',
            desc: detail.content || ''
          })
          break

        case '删除':
          if (!(this.formhash || userStore.formhash)) {
            info(`授权信息有误, 无法操作, 请尝试重新${i18n.login()}`)
            return
          }

          confirm(
            `删除目录[${item.title}], 操作将抹掉所有关联数据以及用户留言, 是否要继续?`,
            () => {
              discoveryStore.doCatalogDelete(
                {
                  catalogId: item.id,
                  formhash: this.formhash || userStore.formhash
                },
                () => {
                  info('已删除')
                  feedback()
                  this.fetchCatalogs()
                  this.t('onControl:delete')
                }
              )
            }
          )
          break

        default:
          break
      }
    }

    /**
     * 创建目录
     */
    onCreate = isNew => {
      if (isNew) {
        if (!(this.formhash || userStore.formhash)) {
          info(`授权信息有误, 无法操作, 请尝试重新${i18n.login()}`)
          return
        }

        this.setState({
          create: true
        })
      } else {
        this.setState({
          create: false,
          title: '',
          desc: ''
        })
      }
    }

    /**
     * 提交创建/修改目录
     */
    onSubmitCatalog = () => {
      if (!(this.formhash || userStore.formhash)) {
        info(`授权信息有误, 无法操作, 请尝试重新${i18n.login()}`)
        return
      }

      const { create, title, desc } = this.state
      if (!title.length) {
        info('请填写目录标题')
        return
      }

      if (!desc.length) {
        info('请填写目录介绍')
        return
      }

      if (create === true) {
        discoveryStore.doCatalogCreate(
          {
            formhash: this.formhash || userStore.formhash,
            title: title || '',
            desc: desc || ''
          },
          () => {
            info('已创建')
            this.fetchCatalogs()
            this.onCreate(false)
            feedback()
            this.t('onSubmitCatalog:create')
          }
        )
        return
      }

      discoveryStore.doCatalogEdit(
        {
          catalogId: create as string,
          formhash: this.formhash || userStore.formhash,
          title: title || '',
          desc: desc || ''
        },
        () => {
          this.fetchCatalogDetail(create, true)
          this.onCreate(false)
          feedback()
          this.t('onSubmitCatalog:edit')
        }
      )
    }

    /**
     * 条目更多菜单
     */
    onSubjectControl = (title, item, pItem) => {
      const detail = this.catalogDetail(pItem.id)
      const current = fixedOrder(item.order)
      let order = 0
      let temp
      let flag

      switch (title) {
        case '置顶':
          temp = detail.list.sort((a, b) => asc(a, b, item => Number(item.sort)))[0]
          order = Number(temp.order)
          if (Number.isNaN(order)) {
            order = 0
          } else {
            order -= 10
          }

          this.onSort(item, order, pItem)
          this.t('onSubjectControl:top')
          break

        case '上移':
          if (current == 0) {
            order = -10
          } else {
            temp = detail.list.map(i => fixedOrder(i.order)).sort((a, b) => desc(a, b))
            temp.forEach(i => {
              if (!flag && current > i) {
                order = i - 10
                flag = true
              }
            })

            if (!flag) {
              order = (temp[temp.length - 1] || 0) - 10
            }
          }

          this.onSort(item, order, pItem)
          this.t('onSubjectControl:up')
          break

        case '下移':
          detail.list
            .map(i => fixedOrder(i.order))
            .sort((a, b) => asc(a, b))
            .forEach(i => {
              if (!flag && current < i) {
                order = i + 10
                flag = true
              }
            })
          if (!flag) {
            order = current + 10
          }

          this.onSort(item, order, pItem)
          this.t('onSubjectControl:down')
          break

        case '置底':
          temp = detail.list.sort((a, b) => desc(a, b, item => Number(item.sort)))[0]
          order = Number(temp.order)
          if (Number.isNaN(order)) {
            order = 10
          } else {
            order += 10
          }

          this.onSort(item, order, pItem)
          this.t('onSubjectControl:bottom')
          break

        case '修改':
          this.onSubjectEdit(item)
          this.t('onSubjectControl:edit')
          break

        case '移出':
          confirm('确定移出目录?', () => {
            discoveryStore.doCatalogDeleteRelate(
              {
                erase: item.erase
              },
              () => {
                info('已移出')
                feedback()
                this.fetchCatalogDetail(pItem.id, true)
                this.t('onSubjectControl:remove')
              }
            )
          })
          break

        default:
          break
      }
    }

    /**
     * 编辑项
     */
    onSubjectEdit = (item?) => {
      if (item) {
        this.setState({
          edit: item.id,
          content: item.comment || '',
          order: item.order || '0'
        })

        setTimeout(() => {
          try {
            if (typeof this?.textareaRef?.textAreaRef?.focus === 'function') {
              this.textareaRef.textAreaRef.focus()
            }
          } catch (error) {}
        }, 160)
        return
      }

      this.setState({
        edit: 0,
        content: '',
        order: '0'
      })
    }

    /** 改变文字 */
    onChange = (value: string, key = 'content') => {
      // @ts-ignore
      this.setState({
        [key]: value
      })
    }

    /**
     * 改变排序
     */
    onOrder = order => {
      if (!order) {
        this.setState({
          order: ''
        })
        return
      }

      const _order = Number(order)
      if (Number.isNaN(_order)) return

      this.setState({
        order: _order == 0 ? '' : _order
      })
    }

    /**
     * 直接提交顺序
     */
    onSort = (item, order, pItem) => {
      const { modify, erase } = item
      const formhash = erase?.split('?gh=')[1]
      if (!formhash) {
        info('目录信息有误, 暂不能修改条目, 请重新进入页面')
        return
      }

      discoveryStore.doCatalogModifySubject(
        {
          modify,
          formhash,
          content: item.comment || '',
          order: order || '0'
        },
        () => {
          feedback()
          this.fetchCatalogDetail(pItem.id, true)
        }
      )
    }

    /**
     * 提交
     */
    onSubmit = (item, pItem) => {
      const { modify, erase } = item
      const { content, order } = this.state
      const formhash = erase?.split('?gh=')[1]
      if (!formhash) {
        info('目录信息有误, 暂不能修改条目, 请重新进入页面')
        return
      }

      discoveryStore.doCatalogModifySubject(
        {
          modify,
          formhash,
          content: content || '',
          order: String(order || '0')
        },
        () => {
          feedback()
          this.fetchCatalogDetail(pItem.id, true)
          this.onSubjectEdit()
          this.t('onSubmit:subject')
        }
      )
    }

    get userCollectionsMap() {
      return collectionStore.userCollectionsMap
    }

    get catalogs() {
      return usersStore.catalogs()
    }

    catalogDetail(id) {
      return computed(() => ({
        ...discoveryStore.catalogDetail(id),
        id
      })).get()
    }

    renderBtnCreate() {
      const { edit, create } = this.state
      if (edit || create) return null

      return (
        <View style={this.styles.btnCreate}>
          <IconTouchable
            name='md-add'
            size={24}
            color={_.colorSub}
            onPress={() => this.onCreate(true)}
          />
        </View>
      )
    }

    renderCreate() {
      const { create, title, desc } = this.state
      if (create !== true) {
        return null
      }

      return (
        <View style={this.styles.create}>
          <Text bold>新建目录</Text>
          <Input
            style={[this.styles.textarea, _.mt.md]}
            defaultValue={title}
            placeholder='输入标题'
            showClear
            onChangeText={text => this.onChange(text, 'title')}
          />
          <TextareaItem
            style={[this.styles.textarea, _.mt.md]}
            value={desc}
            placeholder='输入介绍'
            placeholderTextColor={_.colorDisabled}
            rows={3}
            selectionColor={_.colorMain}
            clear
            onChange={text => this.onChange(text, 'desc')}
          />
          <View style={this.styles.btnCreateCancel}>
            <IconTouchable
              name='md-close'
              size={22}
              color={_.colorSub}
              onPress={() => this.onCreate(false)}
            />
          </View>
          <View style={this.styles.btnCreateSubmit}>
            <IconTouchable
              name='md-check'
              size={22}
              color={_.colorSub}
              onPress={this.onSubmitCatalog}
            />
          </View>
        </View>
      )
    }

    renderList() {
      const { create, expand } = this.state
      const { list } = this.catalogs
      return (
        <ScrollView style={this.styles.scrollView} {...SCROLL_VIEW_RESET_PROPS}>
          {create === true
            ? this.renderCreate()
            : list
                .sort((a, b) => {
                  const { id, defaultExpand } = this.props
                  if (defaultExpand == a.id) return -1

                  const detailA = this.catalogDetail(a.id)
                  const detailB = this.catalogDetail(b.id)
                  const isInA = detailA?.list?.some(i => i.id == id)
                  const isInB = detailB?.list?.some(i => i.id == id)
                  if (isInA && isInB) {
                    return desc(String(b.time || ''), String(a.time || ''))
                  }
                  if (isInA && !isInB) return -1
                  return 1
                })
                .map(item => {
                  const detail = this.catalogDetail(item.id)
                  const showDivider = expand.includes(item.id)
                  return (
                    <View key={item.id}>
                      {this.renderCatalog(item, detail)}
                      {this.renderSubjects(item, detail)}
                      {showDivider && <Divider style={_.mb.md} />}
                    </View>
                  )
                })}
          {!create && !list.length && <Empty text='还没有创建过目录' />}
        </ScrollView>
      )
    }

    renderCatalog(item, detail) {
      const { id } = this.props
      const { expand, create, edit, desc } = this.state
      const isIn = detail?.list?.some(i => i.id == id)
      const date = item.time?.split(' ')[0]?.replace('创建于:', '') || ''
      return (
        <Flex style={this.styles.catalog}>
          <Flex.Item>
            {create == item.id ? (
              <View style={_.mb.sm}>
                <Text bold>编辑目录</Text>
                <Input
                  style={[this.styles.textarea, _.mt.md]}
                  defaultValue={item.title}
                  placeholder='输入标题'
                  showClear
                  onChangeText={text => this.onChange(text, 'title')}
                />
                <TextareaItem
                  style={[this.styles.textarea, _.mt.md]}
                  value={desc}
                  placeholder='输入介绍'
                  placeholderTextColor={_.colorDisabled}
                  rows={3}
                  selectionColor={_.colorMain}
                  clear
                  onChange={text => this.onChange(text, 'desc')}
                />
              </View>
            ) : (
              <Touchable onPress={() => this.onExpand(item)}>
                <Flex>
                  <Text bold>
                    {item.title}{' '}
                    <Text size={11} lineHeight={14} type='sub' bold>
                      ({detail.list.length})
                    </Text>
                  </Text>
                  <Iconfont
                    style={_.ml.sm}
                    name={
                      expand.includes(item.id)
                        ? 'md-keyboard-arrow-down'
                        : 'md-navigate-next'
                    }
                    size={22}
                    lineHeight={24}
                  />
                </Flex>
                <Text style={_.mt.xs} size={11} type='sub' numberOfLines={2}>
                  {date} / {detail.content}
                </Text>
              </Touchable>
            )}
          </Flex.Item>
          <Flex style={this.styles.control} justify='end'>
            {!edit && !create && (
              <>
                {!!id && (
                  <IconTouchable
                    style={_.ml.sm}
                    name={isIn ? 'md-star' : 'md-star-outline'}
                    size={18}
                    color={isIn ? _.colorWarning : _.colorSub}
                    onPress={() => this.onToggle(item, detail, isIn)}
                  />
                )}
                {/** @ts-ignore */}
                <Popover.Old
                  style={this.styles.btnPopover}
                  data={CONTROL_DS.root}
                  onSelect={title => this.onControl(title, item)}
                >
                  <Flex style={this.styles.touch} justify='center'>
                    <Iconfont name='md-more-vert' size={18} color={_.colorSub} />
                  </Flex>
                  {/** @ts-ignore */}
                </Popover.Old>
              </>
            )}
            {item.id == create && (
              <>
                <View style={this.styles.btnCreateCancel}>
                  <IconTouchable
                    name='md-close'
                    size={22}
                    color={_.colorSub}
                    onPress={() => this.onCreate(false)}
                  />
                </View>
                <View style={this.styles.btnCreateSubmit}>
                  <IconTouchable
                    name='md-check'
                    size={22}
                    color={_.colorSub}
                    onPress={this.onSubmitCatalog}
                  />
                </View>
              </>
            )}
          </Flex>
        </Flex>
      )
    }

    renderSubjects(item, detail) {
      const { id } = this.props
      const { expand, create, edit, content, order } = this.state
      if (!(expand.includes(item.id) || create == item.id)) return null

      return (
        <View style={this.styles.subjects}>
          {detail.list.map((i, index) => {
            const isEditing = !!edit && edit == i.id
            const { length } = detail.list
            let data
            if (length <= 1) {
              data = CONTROL_DS.single
            } else if (index === 0) {
              data = CONTROL_DS.top
            } else if (index === length - 1) {
              data = CONTROL_DS.bottom
            } else {
              data = CONTROL_DS.middle
            }

            const align = isEditing || i.comment ? 'start' : 'center'
            const collection = this.userCollectionsMap[i.id]
            const indent = collection ? '　　　' : ''
            return (
              <Flex style={this.styles.subject} align={align}>
                <Cover
                  src={i.image}
                  size={WIDTH}
                  height={HEIGHT}
                  radius
                  type={i.type === '音乐' ? i.type : undefined}
                />
                <Flex.Item style={this.styles.subjectContent}>
                  <View>
                    {!!collection && (
                      <Tag style={this.styles.collection} value={collection} />
                    )}
                    <Text
                      size={11}
                      lineHeight={13}
                      type={i.id == id ? 'warning' : 'desc'}
                      bold
                      numberOfLines={1}
                    >
                      {indent}
                      {HTMLDecode(i.title)}
                    </Text>
                  </View>
                  <Text
                    style={_.mt.xs}
                    size={10}
                    lineHeight={12}
                    type='sub'
                    numberOfLines={2}
                  >
                    [{i.order}] {i.info}
                  </Text>
                  {!isEditing && !!i.comment && (
                    <Text style={this.styles.comment} size={10}>
                      {i.comment}
                    </Text>
                  )}
                  {isEditing && (
                    <>
                      <TextareaItem
                        ref={ref => (this.textareaRef = ref)}
                        style={this.styles.textarea}
                        value={content}
                        placeholder='输入评价'
                        placeholderTextColor={_.colorDisabled}
                        rows={3}
                        selectionColor={_.colorMain}
                        clear
                        onChange={this.onChange}
                      />
                      <Input
                        style={[this.styles.textarea, _.mt.md]}
                        defaultValue={String(order == '0' ? '' : order)}
                        keyboardType='number-pad'
                        placeholder='输入排序 (数字越小越前)'
                        onChangeText={this.onOrder}
                      />
                    </>
                  )}
                </Flex.Item>
                <Flex style={this.styles.control} justify='end'>
                  {isEditing && (
                    <View style={this.styles.editWrap}>
                      <IconTouchable
                        name='md-close'
                        size={18}
                        color={_.colorSub}
                        onPress={() => this.onSubjectEdit()}
                      />
                      <View style={this.styles.btnSubmit}>
                        <IconTouchable
                          name='md-check'
                          size={18}
                          color={_.colorSub}
                          onPress={() => this.onSubmit(i, detail)}
                        />
                      </View>
                    </View>
                  )}
                  {!edit && !create && (
                    // @ts-ignore
                    <Popover.Old
                      style={this.styles.btnPopover}
                      data={data}
                      onSelect={title => this.onSubjectControl(title, i, item)}
                    >
                      <Flex style={this.styles.touch} justify='center'>
                        <Iconfont name='md-more-vert' size={18} color={_.colorSub} />
                      </Flex>
                      {/** @ts-ignore */}
                    </Popover.Old>
                  )}
                </Flex>
              </Flex>
            )
          })}
        </View>
      )
    }

    render() {
      const { title, onClose } = this.props
      const { visible } = this.state
      return (
        <Modal
          style={this.styles.modal}
          visible={visible}
          title={title}
          onClose={onClose}
        >
          {this.renderBtnCreate()}
          {this.renderList()}
        </Modal>
      )
    }

    get styles() {
      return memoStyles()
    }
  }
)

function fixedOrder(order) {
  const _order = Number(order)
  return Number.isNaN(_order) ? 10 : _order
}
