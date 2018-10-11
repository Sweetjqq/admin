<template>
    <div class="header">
        <el-row :gutter="10">
            <!--Logo area-->
            <el-col :xs="12" :sm="12" :md="8">
                <div class="logo">
                  <img src="../../../static/images/logo.png" title="" alt=""/>
                </div>
            </el-col>
            <!-- header right area-->
            <el-col :xs="24" :sm="12" :md="14">
                <div class="website">
                  <span class="logo_prefix">欢迎&nbsp;&nbsp;<span class="name">{{Account}}</span>&nbsp;&nbsp;登录权限主系统</span>
                </div>
            </el-col>
         <el-col :xs="8" :sm="8" :md="2" >
            <div class="user-header">
                <el-dropdown trigger="click" menu-align="start">
                    <img src="../../../static/images/b_header.jpg" width="50px" />
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item >
                            <div class="setting-div">
                                <span class="setting-string"><i class="el-icon-star-on"></i>&nbsp;&nbsp;个人中心</span>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <div class="setting-div">
                                <span class="setting-string"><i class="el-icon-setting"></i>&nbsp;&nbsp;基本设置</span>
                            </div>

                        </el-dropdown-item>
                        <el-dropdown-item divided >
                            <div class="setting-div" @click="Logout">
                                <span class="setting-string"> <i class="el-icon-warning"></i>&nbsp;&nbsp;安全退出</span>
                            </div>
                        </el-dropdown-item>

                    </el-dropdown-menu>
                </el-dropdown>
            </div>
         </el-col>
        </el-row>
    </div>
</template>
<script>
  import {getCookie,removeCookie} from '../../config/mUtils';
  import {IpUrl,OuthIpUrl,LogotUrl} from '../../config/IpUrl';
  import axios from 'axios';
    export default {
        data() {
            return {
                Account: '',
            }
        },
        methods:{
          Logout:function () {
            axios({
              method: 'post',
              headers:{
                'Authorization':'bearer '+getCookie("Token"),
              },
              url: IpUrl+'/exit',
//              params: {
//                token:getCookie("Token")
//              }
              data:'token='+getCookie("Token")
            }).then((res)=>{
              if(getCookie("Token")){
                removeCookie("Token");
                this.$router.push('/Login');
              }
              else{
                this.$router.push('/Login');
              }

              })
              .catch(function(error) {
                console.log(error);
              });
          }
        },
        mounted:function () {
         this.Account=getCookie("Account")?getCookie("Account"):""
      }
    }
</script>
<style scoped>
    .website .name{
      color: #209e91!important;
      font-size: 16px;
    }
    .header {
        position: fixed;
        box-sizing: border-box;
        width: 100%;
        height:66px;

        font-size: 14px;
        line-height: 66px;
        background-color:#324157;
        box-shadow:2px 0 3px rgba(0,0,0,.5);
        z-index:1000;
        padding:0 32px 0 40px;
        overflow:hidden;

    }
    .header .logo{
        float: left;
        cursor:pointer;
        font-size: 22px;
    }
    .logo_prefix{
        color:#209e91;
    }
    .logo_suffix{
        color:#fff;
    }
    .header .search{
        float: left;
        color:#fff;
        font-size:14px;
    }
    .website span{
        display:inline-block;
        color:#209e91;
    }
    .website span:first-child{
        color:#fff;
    }
    .header-right{
        padding-top:25px;
        line-height:10px;
    }
    .header-right span{
        display:inline-block;
        margin-left:14px;
        font-size:18px;
        color:#fff;
        line-height:1px;
        height:18px;
        cursor:pointer;

    }
    .header-right span:hover{
        color:#209e91;

    }
    .user-header{
        line-height:10px;
        padding-top:7px;
        font-size:12px;
    }
    .user-header img{
        border-radius:50%;
        cursor:pointer;
    }
    .pop-image{
        display:block;
        float:left;
    }
    .pop-image img{
        border-radius:50%;
    }
    .pop-div{
        height:55px;
        clear:both;
    }
    .pop-content{
        display:block;
        font-size:12px;
        line-height:14px;
        padding-top:15px;
        margin-left:60px;
    }
    .pop-time{
        display:block;
        float:right;
        font-size:10px;
        color:#ccc;

    }
    .pop-title{
        font-size:12px;
        color:#209e91;
    }
    .task-div{
        clear:both;
        height:55px;
    }
    .task-span{
        display:block;
        float:left;
        font-size:12px
    }

    .task-content{
        width:160px;
        line-height:16px;
        margin-left:10px;
        padding:5px;
    }
    .task-time{
        clear:both;
        float:right;
        color:#ccc;

    }
    .setting-div{
        height:30px;
        line-height:30px;
        clear:both;
    }
    .setting-div span{
        display:block;
        float:left;
        font-size:12px;
    }
    .setting-icon{
        padding-top:3px;
        padding-right:3px;
    }



</style>
