export enum types {
  BOX_TYPE = 'Field',
  SORT_TYPE = 'Field',
}

export enum DragConfig {
  DRAG_OPACITY = 0.3,
}

// 设置字符限制
export const MAX_INPUT_LENGTH = 50

export declare type DragItem = {
  key: string
  index?: number
  opacity?: number
  formInclude: Form_Type[]
  dragTitle: string
  createTime: string // 唯一值
  iconType: string
  isValidateError: boolean

  code: string // 排序依据
  title: string
  type?: number | string // 类型，可能转化为自定义映射    1、text，2、radiobutton,3、checkbox,4、date，5、port
  tipValue?: string // place holder配置
  mandatory?: number
  displayFrom?: number
  displayReport?: number
  sort?: number // 排序依据
  options?: { label: string; value: string }[] // 下拉框名字
  edit?: number
  status?: number
  search?: number
}

export enum Form_Type {
  CODE = 'code', // 唯一值
  FORM_TITLE = 'title', // 列名称
  TOOLTIP = 'tips', // 输入框的placeholder
  CONTENT = 'value', // list的key
  PORT_TYPE = 'portType', // 下拉
  OPTIONS = 'options', // 下拉框枚举
  MANDATORY = 'mandatory', // 字段是否必填
  DISPLAY_FORM = 'displayFrom', // 控制是否显示在动态form
  DISPLAY_REPORT = 'displayReport', // 控制是否导出
  DISPLAY_EDIT = 'edit', // 控制是否可编辑
  DISPLAY_FILTER = 'search', // 控制是否显示在搜索
}

export enum Base_Type {
  INPUT = 'text',
  RADIO = 'checkbox',
  SELECT = 'radiobutton',
  DATE = 'date',
  VARIABLE = 'port',
  FIX_CONTENT = 'fixedtext',
  RCA = 'RCA',
}
export const Base_Type_Value = {
  [Base_Type.INPUT]: 1,
  [Base_Type.FIX_CONTENT]: 2,
  [Base_Type.SELECT]: 3,
  [Base_Type.RADIO]: 4,
  [Base_Type.DATE]: 5,
  [Base_Type.VARIABLE]: 6,
  [Base_Type.RCA]: 7,
}

export const Drag_List = [
  {
    key: '10001',
    type: Base_Type.INPUT,
    dragTitle: 'Aa Text Input Box',
    iconType: 'FontSizeOutlined',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.TOOLTIP,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10002',
    type: Base_Type.FIX_CONTENT,
    iconType: 'FontColorsOutlined',
    dragTitle: 'Fix Content',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.CONTENT,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10003',
    type: Base_Type.RADIO,
    iconType: 'CheckCircleOutlined',
    dragTitle: 'Radio Button',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.OPTIONS,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10004',
    type: Base_Type.SELECT,
    iconType: 'AimOutlined',
    dragTitle: 'Drop-down Box',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.TOOLTIP,
      Form_Type.OPTIONS,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10005',
    type: Base_Type.DATE,
    iconType: 'ScheduleOutlined',
    dragTitle: 'Date',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.TOOLTIP,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10006',
    type: Base_Type.VARIABLE,
    iconType: 'BlockOutlined',
    dragTitle: 'Variable Field',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.PORT_TYPE,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
  {
    key: '10007',
    type: Base_Type.RCA,
    iconType: 'WalletOutlined',
    dragTitle: 'Root Cause analysis',
    formInclude: [
      Form_Type.CODE,
      Form_Type.FORM_TITLE,
      Form_Type.MANDATORY,
      Form_Type.DISPLAY_EDIT,
      Form_Type.DISPLAY_FILTER,
      Form_Type.DISPLAY_FORM,
      Form_Type.DISPLAY_REPORT,
    ],
  },
]
/**
 * 搜索的配置
 * @param v
 * @returns
 */
export const typeToFilterType = (v) => {
  const valueTypeEnum = {
    1: 'text',
    2: 'text',
    3: 'select',
    4: 'select',
    5: 'text',
    // 5: 'dateTime',
    6: v.options ? 'select' : 'text',
    7: 'treeSelect',
  }
  const type = Base_Type_Value[v?.type]
  return {
    valueType: valueTypeEnum[type],
  }
}

/**
 * 设置拖拉初始值
 * @param data 当前类型数据
 * @param nums 索引
 * @returns
 */
export const getInitFormValue = (data, nums) => {
  const initFormValue: any = {}
  const time = new Date().getTime()
  initFormValue.createTime = time
  data?.formInclude?.forEach((v: Form_Type, index) => {
    // 此处制定默认字段
    if (v === Form_Type.OPTIONS) {
      initFormValue[v] = [{ label: data?.dragTitle + `${nums}`, value: data?.dragTitle + `${nums}` }]
    } else if (v === Form_Type.PORT_TYPE) {
      // initFormValue[v] = true
    } else if ([Form_Type.CONTENT, Form_Type.FORM_TITLE, Form_Type.TOOLTIP].includes(v)) {
      initFormValue[v] = data?.dragTitle + `${nums}`
    } else if ([Form_Type.CODE].includes(v)) {
      if (data?.formInclude?.includes(Form_Type.PORT_TYPE)) {
        initFormValue[v] = ''
      } else {
        initFormValue[v] = Form_Type.CODE + time
      }
    } else if (
      [Form_Type.DISPLAY_FILTER, Form_Type.DISPLAY_EDIT, Form_Type.DISPLAY_FORM, Form_Type.DISPLAY_REPORT, Form_Type.MANDATORY].includes(v)
    ) {
      initFormValue[v] = true
    }
  })
  return initFormValue
}
