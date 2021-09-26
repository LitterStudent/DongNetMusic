import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// // 导入全局初始化样式
import './assets/css/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)

// 导入图片懒加载依赖包
import VueLazyLoad from 'vue-lazyload'

import APlayer from '@moefe/vue-aplayer';
Vue.use(APlayer, {
  defaultCover: './assets/images/home.svg',
  productionTip: true,
});

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: import('./assets/images/error.svg'), //加载失败显示的图片
  loading: require('./assets/images/loadding.svg'), // 加载中显示的图片
  attempt: 3, 
  listenEvents: [ 'scroll' ],
  filter: {
    // progressive (listener, options) {
    //    listener.src = 
    //     console.log(listener,options)
    // },
    // webp (listener, options) {
    //   console.log(22)
    // }
  }
})

router.beforeEach((to,from,next)=>{
  console.log(to);
  console.log(from);
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
