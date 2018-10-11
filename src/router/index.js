import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/common/Home';//主体框架
import User from '@/components/page/User';//用户管理
import Role from '@/components/page/Role';//角色管理
import Authority from '@/components/page/Authority';//权限管理
import DashBoard from '@/components/page/DashBoard';//部门管理
import Management from '@/components/page/Management';//子系统管理
import Login from '@/components/Login/Login';//登录
import Error from '@/components/Error';//未知页面
Vue.use(Router);

const VueRouter=new Router({
  mode:'history',
  base:__dirname,
  routes:[
    {
      path:'',
      name: 'Login',
      component:Login
    },
    {
      path: '/',
      name:'系统设置',
      component: Home,
      children:[
        {
          path: '/Dashboard',
          name: 'Dashboard',
          component:DashBoard
        },
        {
          path:'/User',
          name: 'User',
          component: User
        },{
          path:'/Role',
          name: 'Role',
          component: Role
        },
        {
          path:'/Authority',
          name: 'Authority',
          component: Authority
        },
        {
          path:'/Management',
          name: 'Management',
          component:Management
        }
      ]
    },
    {
      path:'*',
      component:Login
    },
    {
      path:'/Login',
      component:Login
    },
    {
      path:'/Error',
      component:Error
    },
  ]
})
export default VueRouter;
