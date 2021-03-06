/*
 * @Author: your name
 * @Date: 2020-04-28 15:28:09
 * @LastEditTime: 2020-06-14 17:46:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-manage-system\src\main.js
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/axios'

import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';

import BaiduMap from 'vue-baidu-map'
import echarts from 'echarts'

import Moment from 'moment'

import {
    messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import XLSX from 'xlsx'

import './assets/scss/style.scss'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
Vue.use(XLSX)
Vue.use(echarts)
// Vue.use(Moment)
Vue.config.productionTip = false;
Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'MrbZMmsfnNd32LhWaqtPgCCb7CKi4uvQ'
})
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
// Vue.use(Moment)
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
Vue.prototype.$echarts = echarts;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 设备远程管理系统`;
    const role = localStorage.getItem('role');
    if (!role && to.path !== '/login' && to.path !== '/register' ) {
        next('/login');
    // } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        // role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

//全局过滤器
Vue.filter('convertTime', function (data, formatStr) {
    return Moment(data, "YYYY-MM-DD HH:mm:ss").format(formatStr);
});
Vue.filter('convertTime2', function (data, formatStr) {
    return Moment(+data).format(formatStr)
})
Vue.mixin({
    methods: {
        getAuthHeaders() {
            return {
                Authorization: `Bearer ${localStorage.token || ''}`
            }
        }
    }
})

new Vue({

    router,
    i18n,
    render: h => h(App)
}).$mount('#app');