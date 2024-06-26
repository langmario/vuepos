/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '//checkout/': RouteRecordInfo<'//checkout/', '/checkout', Record<never, never>, Record<never, never>>,
    '//checkout/[table]': RouteRecordInfo<'//checkout/[table]', '/checkout/:table', { table: ParamValue<true> }, { table: ParamValue<false> }>,
    '//create-order': RouteRecordInfo<'//create-order', '/create-order', Record<never, never>, Record<never, never>>,
    '//my-orders/': RouteRecordInfo<'//my-orders/', '/my-orders', Record<never, never>, Record<never, never>>,
    '//my-orders/[id]': RouteRecordInfo<'//my-orders/[id]', '/my-orders/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/login': RouteRecordInfo<'/login', '/login', Record<never, never>, Record<never, never>>,
  }
}
