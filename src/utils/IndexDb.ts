import Dexie from 'dexie';

const HEADER_TABLE = "header_table"
const DATA_SOURCE_TABLE = "data_source_table"

export const db = new Dexie('myDatabase');

// 设计两张表
db.version(1).stores({
  [HEADER_TABLE]: '++id,code,title,tipValue,options,status,type, sort, displayReport,displayFrom,mandatory,edit,search', // Primary key and indexed props
  [DATA_SOURCE_TABLE]: '++id, others, comment',
});

/**
 * 表头配置保存
 * @param columnList 
 * @returns 
 */
export const saveHeaderList = async (columnList) => {
  db.open();
  return new Promise(async (resolve, reject) => {
    try {
      // const list = await getHeaderList()
      // db.table(HEADER_TABLE).bulkDelete(list.map((v) => v.id))
      await db.table(HEADER_TABLE).clear()
      columnList?.forEach((item) => {
        db.table(HEADER_TABLE).add(item);
      })
      resolve({ message: "success" })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 表头配置获取
 * @returns 
 */
export const getHeaderList = async () => {
  db.open();
  const res = await db.table(HEADER_TABLE).toArray()
  return res
}


/**
 * 查询
 * @returns 
 */
export const getDataSourceList = async (params) => {
  db.open();
  const res = await db.table(DATA_SOURCE_TABLE).toArray()
  //自定义模糊查询
  return res.filter((v) => {
    const jsonOther = JSON.parse(v.others)
    return Object.keys(params).every((item) => {
      return jsonOther[item].includes(params[item]) > 0
    })
  })
}
/**
 * 添加
 * @item 
 */
export const addDataSource = async (item) => {
  db.open();
  const res = await db.table(DATA_SOURCE_TABLE).add(item);
  return res
}
/**
 * 修改
 * @item 
 */
export const updateDataSource = async (item) => {
  db.open();
  const res = await db.table(DATA_SOURCE_TABLE).update(item.id, item);
  return res
}
/**
 * 删除
 * @item 
 */
export const deleteDataSource = async (id) => {
  db.open();
  const res = await db.table(DATA_SOURCE_TABLE).delete(id);
  return res
}

