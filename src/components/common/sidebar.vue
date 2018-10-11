<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
          <template v-for="(item,index) in MenuData">
            <el-submenu :index="String(index)" :key="index" v-if="item.child && item.child.length>0&&!item.hiddenAll">
              <!--一级标题-->
              <template slot="title">
                <span class="sb-icon"><i class="el-icon-setting"></i></span>
                <span class="sb-cn">{{item.name}}</span>
              </template>
              <!--二级标题-->
              <template>
                <el-menu-item v-if="items.hidden" :index="items.component" :key="items.name" v-for="items in item.child">{{items.name}}</el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-menu>
    </div>
</template>
<script>
    export default {
      data(){
        return{
            MenuData:[
              {
                "name":"系统设置",
                "hiddenAll":false,
                "child":[{
                  "name":"用户管理",
                  "component":"User",
                  "hidden":true,
                },{
                  "name":"角色管理",
                  "component":"Role",
                  "hidden":true,
                  "authority":[],
                },{
                  "name":"部门管理",
                  "component":"DashBoard",
                  "hidden":true,
                },{
                  "name":"权限管理",
                  "component":"Authority",
                  "hidden":true,
                  "authority":[],
                },
                  {
                    "name":"系统管理",
                    "component":"Management",
                    "hidden":true,
                  }]
              },
            ]
        }
      },
      computed:{
        onRoutes(){
          return this.$route.path.replace('/','');
        },
      },
      mounted(){

      }
    }
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 66px;
        bottom:0;
        background: #324157;
    }
    .sidebar > ul {
        height:100%;
    }
   .el-menu-item, .el-submenu__title{
       font-size:14px;
   }
    .material-icons {font-size:12px;}
</style>
