/**
 * Created by lwch on 2017/7/29.
 */
// tslint:disable
import dayjs from 'dayjs'
import qs from 'query-string'
import { v4 as uuidv4 } from 'uuid'
// 默认10M
const DefaultSize = 1024 * 1024 * 10

const isNumber = (value) => typeof value === 'number'

export const isNull = (value) => {
  const isEmpty = typeof value === 'string' && value === ''
  const isNotANumber = typeof value === 'number' && isNaN(value)
  return value === null || value === undefined || isEmpty || isNotANumber
}

export const convertTreeLabelValueField = (treeData, idField = 'id', nameField = 'name') => {
  if (isNull(treeData)) {
    return null
  }
  const loop = (dataList) => {
    dataList &&
      dataList.forEach((data) => {
        data.value = data[idField]
        data.label = data[nameField]
        if (isNotEmptyObj(data.children)) {
          loop(data.children)
        }
      })
  }
  loop(isArray(treeData) ? treeData : [treeData])
  return treeData
}

export const isNotNull = (value) => !isNull(value)

export const isEmptyObj = (value) => {
  if (typeof value === 'undefined' || value === null || typeof value !== 'object') {
    return true
  }
  let name
  for (name in value) {
    return false
  }
  return true
}

export const isNotEmptyObj = (value) => !isEmptyObj(value)

export const isPlainObject = (value) => isNotNull(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype

export const isArray = (value) => isNotNull(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Array.prototype

export const assign =
  Object.assign ||
  function (target, ...sources) {
    sources.forEach((source) => {
      const keys = Object.keys(source)
      keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      })
    })
    return target
  }

export const find = (array, callback) => {
  let val = null
  if (isNull(array)) {
    return val
  }
  for (let i = 0; i < array.length; i += 1) {
    if (callback(array[i])) {
      val = array[i]
      return val
    }
  }
  return val
}

export const findIndex = (array, callback) => {
  let val = -1
  if (isNull(array)) {
    return val
  }
  for (let i = 0; i < array.length; i += 1) {
    if (callback(array[i])) {
      val = i
      return val
    }
  }
  return val
}

export const addQueryParam = function (url, paramObj) {
  const urlQuery = url.indexOf('?') > -1 ? qs.parse(url.split('?')[1], { arrayFormat: 'index' }) : {}
  const objQuery = typeof paramObj === 'string' ? qs.parse(paramObj, { arrayFormat: 'index' }) : paramObj
  const query = assign(urlQuery, objQuery)
  for (const key in query) {
    if (query[key] === '') {
      delete query[key]
    }
  }
  const qString = qs.stringify(query)
  const seq = qString.length > 0 ? '?' : ''
  return `${url.split('?')[0]}${seq}${qString}`
}

export const getQuery = function (queryObj, queryKey = null) {
  let key
  let query = {}
  if (arguments.length === 1) {
    if (typeof location !== 'undefined') {
      key = queryObj
      query = qs.parse(location.search, { arrayFormat: 'index' })
    } else {
      throw new Error('window.location is undefined')
    }
  } else {
    if (typeof queryObj === 'string') {
      query = qs.parse(queryObj, { arrayFormat: 'index' })
    } else {
      query = queryObj
    }
    key = queryKey
  }
  return query[key]
}

export const parseUTCDate = function (dataString) {
  const strDateRegexp = /(\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)\.(\d+)\+(\d+)/
  const result = strDateRegexp.exec(dataString)
  // UTC时间，iOS Safari无法直接解析
  if (result !== null) {
    const date = new Date()
    date.setUTCFullYear(parseInt(result[1], 10))
    date.setUTCMonth(parseInt(result[2], 10) - 1)
    date.setUTCDate(parseInt(result[3], 10))
    date.setUTCHours(parseInt(result[4], 10))
    date.setUTCMinutes(parseInt(result[5], 10))
    date.setUTCSeconds(parseInt(result[6], 10))
    return date
  }
  return new Date(dataString)
}
/**
 * 空间复杂度O(n) 转换array to tree list
 * 将list对象转为tree对象
 * @param listData
 * @param idField
 * @param parentIdFiled
 * @param defaultParentId
 * @return {Array}
 */
export function arrayToTree(items: any[], idField = 'id', parentIdFiled = 'parentId', defaultParentId: any = '_auto') {
  const result = [] // 存放结果集
  const itemMap = {} //
  const root = defaultParentId === '_auto' ? 0 : defaultParentId
  for (const item of items) {
    const id = item[idField]
    const pid = item[parentIdFiled]
    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }
    // 如果已知是叶子节点则不生成子数组 --> item.leafNode
    itemMap[id] = {
      ...item,
      children: item.leafNode ? null : itemMap[id]['children'],
    }

    const treeItem = itemMap[id]
    if (pid === root) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result
}

/**
 * 将list对象转为tree对象 (不推荐)
 * @param listData
 * @param idField
 * @param parentIdFiled
 * @param defaultParentId
 * @return {Array}
 */
export const convertListToTreeData = (listData, idField = 'id', parentIdFiled = 'parentId', defaultParentId: any = '_auto') => {
  const treeData = []
  const dataObj = {}
  if (isEmptyObj(listData)) {
    return treeData
  }
  if (defaultParentId === '_auto' && listData) {
    const idList = listData.map((item) => item[idField]) || []
    const item = find(listData, (item) => idList.indexOf(item[parentIdFiled]) === -1)
    defaultParentId = item[parentIdFiled]
  }
  listData &&
    listData.forEach((item) => {
      if (dataObj[item[idField]]) {
        // 手动创建的父级元素被遍历到时，将遍历到的父级元素的属性复制到创建对象上
        dataObj[item[idField]] = assign(item, dataObj[item[idField]])
        if (item[parentIdFiled] == defaultParentId) {
          treeData.push(item)
        } else {
          if (dataObj[item[parentIdFiled]]) {
            // 父级元素已经缓存
            const pData = dataObj[item[parentIdFiled]]
            if (!pData.children) {
              pData.children = [item]
            } else {
              pData.children.push(item)
            }
          } else {
            // 父级元素没有缓存缓存，则手动创建一个缓存
            dataObj[item[parentIdFiled]] = { [idField]: item[parentIdFiled], children: [item] }
          }
        }
        return
      }
      dataObj[item[idField]] = item
      if (item[parentIdFiled] == defaultParentId) {
        // 如果是最上级的父元素
        treeData.push(item)
      } else {
        if (dataObj[item[parentIdFiled]]) {
          // 父级元素已经缓存
          const pData = dataObj[item[parentIdFiled]]
          if (!pData.children) {
            pData.children = [item]
          } else {
            pData.children.push(item)
          }
        } else {
          // 父级元素没有缓存缓存，则手动创建一个缓存
          dataObj[item[parentIdFiled]] = { [idField]: item[parentIdFiled], children: [item] }
        }
      }
    })
  return treeData
}
/**
 * 根据目标id隐藏tree对象children
 * 特定需求添加，不通用，慎用
 *  */

export const hiddenTreeChildrenData = (listdata, targetId = 0) => {
  targetId &&
    listdata.map((item) => {
      if (item.id !== targetId) {
        delete item.children
      }
    })
  return listdata
}

/**
 * 将list对象转为tree对象children中添加隐藏选项
 * @param listData
 * @param idField
 * @param parentIdFiled
 * @param defaultParentId
 * @return {Array}
 */
export const convertListToTreeNoneData = (listData, idField = 'id', parentIdFiled = 'parentId', defaultParentId: any = '_auto') => {
  const treeData = []
  const dataObj = {}
  if (isEmptyObj(listData)) {
    return treeData
  }
  if (defaultParentId === '_auto' && listData) {
    const idList = listData.map((item) => item[idField]) || []
    const item = find(listData, (item) => idList.indexOf(item[parentIdFiled]) == -1)
    defaultParentId = item[parentIdFiled]
  }
  listData &&
    listData.forEach((item) => {
      if (dataObj[item[idField]]) {
        // 手动创建的父级元素被遍历到时，将遍历到的父级元素的属性复制到创建对象上
        dataObj[item[idField]] = assign(item, dataObj[item[idField]])
        if (item[parentIdFiled] == defaultParentId) {
          treeData.push(item)
        } else {
          if (dataObj[item[parentIdFiled]]) {
            // 父级元素已经缓存
            const pData = dataObj[item[parentIdFiled]]
            if (!pData.children) {
              pData.children = [item]
            } else {
              pData.children.push(item)
            }
          } else {
            // 父级元素没有缓存缓存，则手动创建一个缓存
            dataObj[item[parentIdFiled]] = { [idField]: item[parentIdFiled], children: [item] }
          }
        }
        return
      }
      dataObj[item[idField]] = item
      if (item[parentIdFiled] == defaultParentId) {
        // 如果是最上级的父元素
        treeData.push(item)
      } else {
        if (dataObj[item[parentIdFiled]]) {
          // 父级元素已经缓存
          const pData = dataObj[item[parentIdFiled]]
          if (!pData.children) {
            pData.children = [item]
          } else {
            pData.children.push(item)
          }
        } else {
          // 父级元素没有缓存缓存，则手动创建一个缓存
          dataObj[item[parentIdFiled]] = { [idField]: item[parentIdFiled], children: [item] }
        }
      }
    })
  const array = treeData
  ;(function addChildren(data) {
    data.forEach((item) => {
      const noneData = { parentId: item.id }
      if (isNotNull(item.children)) {
        item.children.push(noneData)
        addChildren(item.children)
      }
    })
    return treeData
  })(array)
  return array
}

/**
 * 从tree对象中，找到某个id的节点
 * @param treeData
 * @param id
 * @param idField
 * @return {null}
 */
export const findTreeData = (treeData, id, idField = 'id') => {
  let pData = null
  const loop = (dataList) => {
    if (isNotNull(pData)) {
      return
    }
    dataList.forEach((data) => {
      if (data[idField] === id) {
        pData = data
      } else if (isNotEmptyObj(data.children)) {
        loop(data.children)
      }
    })
  }
  loop(isArray(treeData) ? treeData : [treeData])
  return pData
}

/**
 * 从tree对象中，删除某个id的节点
 * @param treeData
 * @param id
 * @param idField
 * @return {boolean}
 */
export const deleteTreeData = (treeData, id, idField = 'id') => {
  let hasDel = false
  const loop = (parent, dataList) => {
    if (hasDel) {
      return
    }
    let index = null

    dataList.forEach((data, idx) => {
      if (index !== null) {
        return
      }
      if (data[idField] === id) {
        index = idx
      } else if (isNotEmptyObj(data.children)) {
        loop(data, data.children)
      }
    })
    if (index !== null) {
      dataList.splice(index, 1)
      if (dataList.length === 0 && isNotNull(parent)) {
        // 子节点全部被删除时，删除children属性
        delete parent.children
      }
      hasDel = true
    }
  }
  loop(null, isArray(treeData) ? treeData : [treeData])
  return hasDel
}

/**
 * 从list对象中，删除某个id的节点
 * @param listData
 * @param id
 * @param idField
 * @return {boolean}
 */
export const deleteListData = (listData, id, idField = 'id') => {
  let hasDel = false
  const find = (dataList) => {
    if (hasDel) {
      return
    }
    let index = null
    dataList.forEach((data, idx) => {
      if (data[idField] === id) {
        index = idx
      }
    })
    if (index !== null) {
      dataList.splice(index, 1)
      hasDel = true
      return
    }
  }
  find(isArray(listData) ? listData : [listData])
  return hasDel
}

/**
 * 从tree对象中，找到某个id节点及所有子节点的id数组
 * @param treeData
 * @param id
 * @param idField
 * @return {Array}
 */
export const flatTreeDataIdArray = (treeData, id, idField = 'id') => {
  const idArray = []
  const rData = findTreeData(treeData, id, idField)
  const loop = (dataList) => {
    dataList.forEach((data) => {
      idArray.push(data.id)
      if (isNotEmptyObj(data.children)) {
        loop(data.children)
      }
    })
  }
  if (rData) {
    idArray.push(rData.id)
    if (isNotEmptyObj(rData.children)) {
      loop(rData.children)
    }
  }
  return idArray
}

export const convertLabelValueField = (treeData, idField = 'id', nameField = 'name') => {
  if (isNull(treeData)) {
    return null
  }
  const loop = (dataList) => {
    dataList &&
      dataList.forEach((data) => {
        data.label = data[nameField]
        data.title = data[nameField]
        data.value = String(data[idField])
        data.key = String(data[idField])
        if (isNotEmptyObj(data.children)) {
          loop(data.children)
        }
      })
  }
  loop(isArray(treeData) ? treeData : [treeData])
  return treeData
}

export const compareUrl = (url1, url2) => {
  url1 = url1 && url1.indexOf('/') !== 0 ? `/${url1}` : url1
  url2 = url2 && url2.indexOf('/') !== 0 ? `/${url2}` : url2
  return url1 === url2
}

export function objectShallowEqual(objA, objB, compare = null, compareContext = null) {
  let ret = compare ? compare.call(compareContext, objA, objB) : void 0
  if (ret !== void 0) {
    return !!ret
  }
  if (objA === objB) {
    return true
  }
  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
    return false
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)
  // Test for A's keys different from B.
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx]
    if (!bHasOwnProperty(key)) {
      return false
    }
    const valueA = objA[key]
    const valueB = objB[key]
    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0
    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false
    }
  }
  return true
}

export const getProp = (data, key, def = '-') => {
  return isNotNull(data) && isNotNull(data[key]) ? data[key] : def
}

export const setContent = (val) => {
  if (isNotNull(val) && !isNumber(val)) {
    return val.split('{_materialId_}')[val.split('{_materialId_}').length - 1]
  }
}
export const setViewId = (val) => {
  if (isNotNull(val) && !isNumber(val)) {
    const tmepArr = val.split('{_materialId_}')
    if (tmepArr.length > 1) {
      return `{_materialId.${val.split('{_materialId_}')[0]}}`
    } else {
      return val
    }
  }
}

export const getViewId = (val) => {
  if (isNotNull(val)) {
    val = val.substring(0, val.length - 1)
    const itemArr = val.split('{_materialId.')
    if (itemArr.length > 1) {
      return `ID:${itemArr[1]}`
    } else {
      return ''
    }
  }
}

// 起始日期限制
export function disabledDate(
  value: dayjs.Dayjs,
  limitValue: dayjs.Dayjs,
  isStartDate: boolean = true,
  disabledFuture: boolean | number = false
) {
  if (!value) return false
  if (isStartDate) {
    // 设置开始时间
    if (!limitValue) {
      // 如果没有结束日期的情况
      if (typeof disabledFuture === 'boolean') {
        if (disabledFuture) {
          // 如果有未来限制
          return value.valueOf() > new Date().valueOf()
        }
      } else {
        // 如果有未来限制
        return value.valueOf() > dayjs().subtract(disabledFuture, 'days').valueOf()
      }
    } else {
      // 如果有结束日期的情况
      return value.valueOf() > limitValue.valueOf()
    }
  } else {
    // 设置结束时间
    if (!limitValue) {
      // 如果没有开始日期
      if (typeof disabledFuture === 'boolean') {
        if (disabledFuture) {
          // 如果没有开始日期的情况下并且设置限制，结束时间不能大于当前时间
          return value.valueOf() > new Date().valueOf()
        }
      } else {
        // 如果有未来限制
        return value.valueOf() > dayjs().add(disabledFuture, 'days').valueOf()
      }
    } else {
      if (!disabledFuture) {
        return value.valueOf() < limitValue.valueOf()
      } else {
        // 如果有开始时间，结束时间 要大于开始时间 也要小于当前时间
        if (typeof disabledFuture === 'boolean') {
          return value.valueOf() < limitValue.valueOf() || value.valueOf() > new Date().valueOf()
        } else {
          // 如果有未来限制
          return value.valueOf() < limitValue.valueOf() || value.valueOf() > dayjs().add(disabledFuture, 'days').valueOf()
        }
      }
    }
  }
}

export function isOfficeDoc(file: string) {
  if (isNull(file)) {
    return false
  }
  const reg = /(xls|doc|ppt)[x]?$/
  return reg.test(file)
}

export function byte(limit) {
  var size = ''
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  var sizeStr = size + '' //转成字符串
  var index = sizeStr.indexOf('.') //获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}
// 反转义html
export function htmlDecode(text) {
  if (isNull(text)) {
    return ''
  }
  var temp = document.createElement('div')
  temp.innerHTML = text
  var output = temp.innerText || temp.textContent
  temp = null
  return output
}

// 截取字符串中的数字(包含负数，小数)
export function getNumberInStr(val, negative = true) {
  if (isNull(val)) return val
  const reg = negative ? /[^0-9|.|-]/gi : /[^0-9|.]/gi
  return String(val).replace(reg, '')
}

// Table排序处理 type: text/number/date/array
export function sortFun(prevVal, nextVal, type: 'text' | 'number' | 'date' | 'array' = 'text') {
  switch (type) {
    case 'number':
      return getNumberInStr(prevVal) - getNumberInStr(nextVal)
    case 'date':
      return dayjs(prevVal).valueOf() - dayjs(nextVal).valueOf()
    case 'array':
      return prevVal.length - nextVal.length
    default:
      return String(prevVal).localeCompare(String(nextVal))
  }
}

// 将每一个单词首字母大写  ps:切割仅针对空格和下划线，可|拓展
export function upperCaseFirst(value) {
  if (!value || typeof value !== 'string') return value
  const result = value
    .split(/ |_/)
    .map((itm) => itm.toLowerCase().replace(/^\S/, (s) => s.toUpperCase()))
    .join(' ')
  return result
}

// 获取响应头返回的文件名
export function getHeaderName(headers, fullname?) {
  if (!headers || !headers.get('Content-Disposition')) return ''
  if (fullname) {
    const fileNameArr = headers.get('Content-Disposition').split(';')[1].split('=')[1]
    return fileNameArr
  } else {
    const fileNameArr = headers.get('Content-Disposition').split(';')[1].split('=')[1].split('/')
    return fileNameArr[fileNameArr.length - 1]
  }
}
// 格式化Side Type
export function formartSideType(type) {
  switch (type) {
    case 'P':
      return 'Opening'
    case 'C':
      return 'Closing'
    case 'CP':
      return 'Closing first and Opening'
    default:
      return ''
  }
}

// 格式化Side Short Type
export function formartShortType(type, side, open, cover) {
  return type === 'CP' && side === 'Sell'
    ? `Partial short@${open}`
    : type === 'P' && side === 'Sell'
    ? `Short`
    : type === 'C' && side === 'Buy'
    ? `Cover`
    : type === 'CP' && side === 'Buy'
    ? `Partial cover@${cover}`
    : ''
}

// 时长转换
export function formatTime(value) {
  if (isNull(value) || value < 0) {
    return ''
  }
  value = Math.floor(value)
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = value % 60
  const arr = [minutes, seconds]
  if (hours > 0) {
    arr.unshift(hours)
  }
  return arr.map((v) => (v < 10 ? `0${v}` : v)).join(':')
}
/**
 * @desc 函数防抖:指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * @param func 函数
 * @param wait 延迟执行毫秒数，控制次数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * @desc 函数节流:连续触发事件但是在 n 秒中只执行一次函数
 * @param func 函数
 * @param wait 延迟执行毫秒数，控制频率
 */
export const throttle = (func, wait) => {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

//判断类型
export const getType = (obj) => {
  let type = typeof obj
  if (type !== 'object') {
    return type
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}

export const getUrllink = (url, obj) => {
  let str = ''
  for (let key in obj) {
    if (obj[key] && obj[key] !== '') {
      str = str + `&${key}=${obj[key]}`
    }
  }
  str = str.substring(1)
  return `${url}?${str}`
}

// 去除字符串中的字符，返回一个数组
export function stringToArray(data: string) {
  if (isNull(data)) {
    return []
  }
  let str = data.replace(/\n/g, ';')
  str = str.replace(/,/g, ';')
  str = str.replace(/。/g, ';')
  str = str.replace(/，/g, ';')
  str = str.replace(/\./g, ';')
  str = str.replace(/\s/g, ';')
  let arr = str ? str.split(';') : []
  arr = arr.filter(Boolean)
  return arr
}
// 邮件类型工单
export const isFromEmail = (data) => {
  return !!(data && data.feedbackRouteId && [2, 12, 13].indexOf(data.feedbackRouteId) !== -1)
}

export const isFunction = (value) => {
  return typeof value === 'function'
}

export const formateTime = (value: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (isNull(value)) return null
  return dayjs(value).format(format)
}

export interface ChunkPart {
  file: Blob
  chunkNumber: number
  totalChunks: number
  md5?: any
  fileName: string
}

export const createChunks = (file: File) => {
  // 文件分片
  let current = 0
  let currentIndex = 1
  const totalChunks = Math.ceil(file.size / DefaultSize)
  const partList: ChunkPart[] = []
  while (current < file.size) {
    const chunk = file.slice(current, DefaultSize + current)
    partList.push({ fileName: file.name, file: chunk, chunkNumber: currentIndex, totalChunks })
    current += DefaultSize
    currentIndex++
  }
  return partList
}
/**
 * 获取id
 */
export function guid() {
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //   const r = (Math.random() * 16) | 0,
  //     v = c == 'x' ? r : (r & 0x3) | 0x8
  //   return v.toString(16)
  // })
  return uuidv4()
}
/**
 * 是否是图片后缀
 */
export function verifySuffix(fileName) {
  const suffix = `(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)`
  const regular = new RegExp(`.*\.${suffix}`)
  return regular.test(fileName)
}

const globalConfig = {
  dc_us1: 'US',
  dc_us_tech1: 'US_TECH',
  dc_pay_g000: 'PAY_G000',
  dc_hk1: 'HK',
  dc_hk_tech1: 'HK_TECH',
  dc_jp1: 'JP',
  dc_jp_tech1: 'JP_TECH',
  dc_sg1: 'SG',
  dc_sg_tech1: 'SG_TECH',
  dc_au1: 'AU',
  dc_au_tech1: 'AU_TECH',
  dc_za_tech1: 'ZA_TECH',
  dc_uk_tech1: 'UK_TECH',
}
// 全球分单地区映射
export const showGlobalConfig = (area: string) => {
  if (typeof area === 'string') {
    // return globalConfig[area]   计算规则不满足时采用上方写死配置
    switch (area) {
      case 'dc_pay_g000':
        return 'US_PAY'
      default:
        return area.replaceAll('dc_', '')?.toUpperCase()?.replaceAll('1', '')
    }
  }
  return area
}

// 最快的数组去重
export const unique = (arr) => {
  const map = {}
  const result = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const item = arr[i]
    if (!map[item]) {
      map[item] = true
      result.push(item)
    }
  }
  return result
}
