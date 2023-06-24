/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 18:27:59
 * @LastEditTime: 2023-06-24 23:05:10
 * @Description: 
 * @FilePath: /umi-test/.umirc.ts
 */
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: 'IndexDB 操作',
      path: '/indexdbAndDraggable',
      component: './DraggableForm/DraggableList',
    },
  ],
  npmClient: 'cnpm',
});

