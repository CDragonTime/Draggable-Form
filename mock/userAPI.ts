/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 18:27:59
 * @LastEditTime: 2023-06-24 18:54:36
 * @Description: 
 * @FilePath: /umi-test/mock/userAPI.ts
 */
const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
};
