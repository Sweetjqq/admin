// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import {getCookie} from './config/mUtils';
import {Fetch,Post,Delete} from './config/http';
import  axios from 'axios'

//引入element-ui的默认CSS样式
import 'element-ui/lib/theme-default/index.css';
import htmlToPdf from './config/htmlToPdf';
Vue.use(htmlToPdf);
Vue.use(ElementUI);
Vue.config.productionTip = false;

// 定义全局变量
Vue.prototype.$post=Post;
Vue.prototype.$get=Fetch;
Vue.prototype.$delete=Delete;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  beforeCreate:function(){
    console.log(this.$route.path);
    console.log('beforeCreated.....');
    // 登录页面不提示登录
    if(this.$route.path!='/'&&this.$route.path!='/Login'){
      // 是否存在Token
      // if(getCookie("Token")){
      //   console.log("11111");
      // }
      // else{
      //   this.$message({
      //     message: '小主，请记得先登录呦',
      //     type: 'warning'
      //   });
      //   this.$router.push('/Login');
      // }
    }
  }
})
router.beforeEach((to, from, next) => {
  console.log(to,"###to#####");
  if(getCookie("Token")){
    console.log("有Token，进行下一步操作");
    next();
  }
  else{
    console.log("没有Token，跳到登录页");
    next();
    router.push('/Login');
  }

})
