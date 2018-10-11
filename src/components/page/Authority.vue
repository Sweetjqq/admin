<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="border-card">
      <el-tab-pane label="用户权限">
        <el-table
        :data="UserData"
        border
        style="width: 100%">
        <el-table-column
          prop="UserId"
          label="用户名"
          width="180">
        </el-table-column>
          <el-table-column
            prop="SystemId"
            label="所属系统ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="FunctionKey"
            label="权限类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Privilege"
            label="权限展示数据"
          >
          </el-table-column>
      </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色权限">
        <el-table
          :data="RoleData"
          border
          style="width: 100%">
          <el-table-column
            prop="RoleId"
            label="角色ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="SystemId"
            label="所属系统ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="FunctionKey"
            label="权限类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="Privilege"
            label="权限展示数据"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--loadding-->
    <Loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></Loadding>
  </div>
</template>

<script>
  import Loadding from '@/components/common/loadding';
  import {IpUrl} from '../../config/IpUrl';
  import axios from 'axios';
  import {format,setCookie,getCookie} from '../../config/mUtils';
  export default {
    components:{
      Loadding
    },
    data() {
      return {
        showLoadding:true,
        loaddingMsg:"正在获取权限列表数据，请稍后",//loadding提示信息
        RoleData: [],
        UserData:[]
      }
    },
    methods:{
      //获取用户权限列表数据
      getUserData(){
        this.showLoadding=true;
        axios({
          method: 'get',
          url: IpUrl+'/GetPUserPrivilegeConfigBySystemId',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
            "m_SystemId":"DemoSysIdentifier"
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            console.log(response.data.ReturnParam.$values,"获取用户权限");
            this.UserData=response.data.ReturnParam.$values;
            this.showLoadding=false;
          }
          else{
            this.showLoadding=false;
            this.$message({
              message: response.data.ResultMessage?response.data.ResultMessage:"当前没有权限，请重新登录",
              type: 'warning'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取角色权限列表数据
      getRoleData(){
        this.showLoadding=true;
        axios({
          method: 'get',
          url: IpUrl+'/GetPRolePrivilegeConfigBySystemId',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
            "m_SystemId":"DemoSysIdentifier"
          },
        }).then( (response)=> {
          if(response.data.Result.ResultCode==0){
            console.log(response.data.ReturnParam,"获取角色权限");
            this.RoleData=response.data.ReturnParam.$values;
            this.showLoadding=false;
          }
          else{
            this.showLoadding=false;
            this.$message({
              message: response.data.ResultMessage?response.data.ResultMessage:"当前没有权限，请重新登录",
              type: 'warning'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      },
    },
    mounted:function () {
      this.getUserData();
      this.getRoleData();
    },
    computed:{

    }
  }
</script>

<style>

</style>
