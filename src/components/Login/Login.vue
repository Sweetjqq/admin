
<template>
  <div class="login"  @keyup.enter="Login()">
    <div class="login-head">
      <div class="login-head-a">
        <img src="../../../static/images/logo.png" title="" alt=""/>
      </div>
      <div class="login-head-b">
        admin后台管理
      </div>
    </div>
    <div class="login-con">
      <div class="login-a">
          <div class="login-b">
            <div class="login-b-a">用户登陆</div>
            <div class="login-b-b">
              <ul>
                <li>
                  <label for="userName" >用户名：</label><input type="text" id="userName" name="userName" v-model="m_UserId"/>
                  <h1 id="m-tip"></h1>
                </li>
                <li>
                  <label for="password">密 &nbsp;&nbsp;码：</label><input type="password" id="password" name="password" v-model="m_Password"/>
                  <h1 id="p-tip"></h1>
                </li>
                <li>
                  <label >验证码：</label>
                  <label>
                    <input type="text"  style="width: 55px;margin-right: 10px" v-model="readPool"/>
                    <canvas  id="checkCode"  width="120" height="40" style="float: right" ></canvas>
                  </label>
                  <a  @click="createCode()" style="cursor: pointer">看不清楚</a>
                  <h1 id="c-tip"></h1>
                </li>
                <li class="login-x">
                  <div class="login-x-a"><input type="submit" name="登录"value="登录" id="Button1"  @click="Login()"/><div class="x"></div></div>
                </li>
              </ul>
            </div>
            <div class="login-b-c">
              <a>是否有账号</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a @click="linkAdmin()">忘记登录密码？</a>
            </div>
          </div>
      </div>
    </div>
    <div class="login-foot">
      耀之基金:www.yzamc.com
    </div>
    <Loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></Loadding>
  </div>
</template>
<script>
  import Loadding from '@/components/common/loadding';
  import {IpUrl,OuthIpUrl} from '../../config/IpUrl';
  import axios from 'axios';
  import {format,setCookie,getCookie} from '../../config/mUtils';
  export default {
    components:{
      Loadding
    },
    data(){
      return{
        showLoadding:false,//控制loadding显隐
        loaddingMsg:"正在登录，请稍后",//loadding提示信息
        m_UserId:"",//用户名
        m_Password:"",//密码
        TruePool:"",//真实的验证码
        readPool:"",//读入的验证码
      }
    },
    methods: {
      rn:function (min,max) {//生成随机数
        return  parseInt(Math.random()*(max-min)+min);
      },
      rc:function (min,max) {//生成随机颜色
        var r=this.rn(min,max);
        var g=this.rn(min,max);
        var b=this.rn(min,max);
        return `rgb(${r},${g},${b})`;
      },
      createCode:function(){
        var w=120;
        var h=40;
        var c1=document.getElementById("checkCode");
        var ctx=c1.getContext("2d");
        ctx.fillStyle=this.rc(180,230);
        ctx.fillRect(0,0,w,h);
        //随机产生字符串
        var pool="ABCDEFGHIJKLIMNOPQRSTUVWSYZ1234567890";
        var TruePool=[];
        for(var i=0;i<4;i++){
          var c=pool[this.rn(0,pool.length)];//随机的字
          var fs=this.rn(25,40);//字体的大小
          var deg=this.rn(-30,30);//字体的旋转角度
          ctx.font=fs+'px Simhei';
          ctx.textBaseline="top";
          ctx.fillStyle=this.rc(80,150);
          ctx.save();
          ctx.translate(30*i+15,15);
          ctx.rotate(deg*Math.PI/180);
          ctx.fillText(c,-15+5,-15);
          ctx.restore();
          TruePool.push(c);
        }
        this.TruePool=TruePool.join("");
        //随机产生5条干扰线,干扰线的颜色要浅一点
        for(var i=0;i<5;i++){
          ctx.beginPath();
          ctx.moveTo(this.rn(0,w),this.rn(0,h));
          ctx.lineTo(this.rn(0,w),this.rn(0,h));
          ctx.strokeStyle=this.rc(180,230);
          ctx.closePath();
          ctx.stroke();
        }
        //随机产生40个干扰的小点
        for(var i=0;i<40;i++){
          ctx.beginPath();
          ctx.arc(this.rn(0,w),this.rn(0,h),1,0,2*Math.PI);
          ctx.closePath();
          ctx.fillStyle=this.rc(150,200);
          ctx.fill();
        }
  },
//      从验证服务器获取token
      Login:function () {
        if(this.TruePool.toLowerCase()==this.readPool.toLowerCase()){//验证输入的验证码是否正确
          this.showLoadding=true;
          axios({
            method: 'post',
            url:IpUrl+'/auth/oauth/token',
            headers: {
              'Authorization': "Basic " + btoa("beehiveAC:com.yzamc.beehiveAC"),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
//            data:'grant_type=password&username='+this.m_UserId+'##MasterSysIdentifier&password='+this.m_Password,
            data:{
              "grant_type":"password",
              "username":this.m_UserId+'##MasterSysIdentifier',
              "password":this.m_Password
            },
            transformRequest: [function (data) {
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }],
          }).then( (response)=> {
            console.log(response.data,"6666666666");
            setCookie("Token",response.data.access_token);
            if(getCookie("Token")!='undefined'){
              setCookie("Account",this.m_UserId);
              this.$router.push('/DashBoard');
//              this.VerLogin();
            }
          })
            .catch( (error)=> {
              console.log(error);
            });
        }
        else{
          this.$message({
            message: "验证码不正确",
            type: 'warning'
          });
          this.createCode();
        }
      },
      linkAdmin:function () {
        this.$message({
          message: '请电话联系管理员',
          type: 'warning'
        });
      },
//      获取token成功后，验证账号登录
      VerLogin:function () {
        axios({
          method: 'post',
          url: IpUrl+'/grain/IPrivilegeControlGrain/'+this.m_UserId+'/VerifySysAccount',
          headers: {},
          data:JSON.stringify({
            "Account":this.m_UserId,//用户名
            "SessionId":"",
            "Token":getCookie("Token"),
            "MothodName":"VerifySysAccount",
            "TimeStamp":format(),
            "VersionNum":"1.0.0.0",
            "JosnParamBody":JSON.stringify({
              "m_SysId":"MasterSysIdentifier",//权限主系统Id
              "m_UserId":this.m_UserId,//用户名
              "m_Password":this.m_Password,//密码
            })
          }),
        }).then( (response)=> {
          if(response.data.Result.ResultCode==0){
            setCookie("Account",this.m_UserId);
            this.$router.push('/DashBoard');
          }
          else{
            this.showLoadding=false;
            this.$message({
              message: response.data.Result.ResultMessage,
              type: 'warning'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      loginOK:function () {
        if(getCookie("Token")){
          this.$router.push('/DashBoard');
        }
      }
    },
    mounted:function () {
      this.createCode();
//      如果token存在直接进去系统
      this.loginOK();
    }
  }
</script>

<style scoped>
  .login .login-head{width:960px;margin:20px auto;height: 70px;}
  .login .login-head .login-head-a{text-align: center;float: left;}
  .login .login-head .login-head-a p{font-size: 20px;margin: 0;}
  .login .login-head .login-head-b{border-left: 1px solid #666666;float: left;height: 75px;line-height: 75px;margin-left: 20px;padding-left: 30px;width: 200px;font-size: 25px;}
  .login .login-con{text-align: center;background-color: #efefef;height:450px;}
  .login .login-con .login-a{background: url(../../../static/images/pay-bg-3.jpg)no-repeat;width:1000px;margin: 0 auto;text-align: left;padding-top: 0px;min-height: 450px;}
  .login .login-con .login-a .login-b{float: right;width: 344px;height: 387px;border: solid 2px #e6e5e5;margin-right: 60px;margin-top: 20px;background: #fff;}
  .login .login-con .login-a .login-b .login-b-a{background-color: #E3E3E3;height: 46px;line-height: 46px;font-size: 16px;font-weight: bold;padding-left: 15px;}
  .login .login-con .login-a .login-b .login-b-b{padding: 20px;height: 255px;box-sizing: border-box}
  .login .login-con .login-a .login-b .login-b-b ul li{height: 65px;_height: 60px;list-style-type: none;font-family: "微软雅黑","宋体",Arial;font-size: 14px;}
  .login .login-con .login-a .login-b .login-b-b ul li label{display: inline-block;font-size: 16px;color: #666666;}
  .login .login-con .login-a .login-b .login-b-b ul li input{width: 180px;color: rgb(153, 153, 153);height: 32px;line-height: 32px;border: solid 1px #d3d3d3;font-size: 14px;padding-left: 6px}
  .login .login-con .login-a .login-b .login-b-b ul li h1{font-weight: normal;color: #ff0000;background: url(../../../static/images/icon.png)no-repeat 95px -28px;font-size: 12px;padding-left: 120px;padding-top: 6px;margin: 3px 0px 0px -30px;}
  .login .login-con .login-a .login-b .login-b-b ul li #checkCode{height: 32px;line-height: 32px;width: 60px;}
  .login .login-con .login-a .login-b .login-b-b ul li img{vertical-align: middle;width: 76px;height: 33px;}
  .login .login-con .login-a .login-b .login-b-b ul li a{color: #447bd6;font-family: "微软雅黑","宋体",Arial;font-size: 12px;}
  .login .login-con .login-a .login-b .login-b-b ul .login-x{padding-left: 65px;padding-top: 0px;height: 65px;}
  .login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a{width: 100px;height: 50px;float: left;}
  .login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a .x{background-position: right -208px;background-image: url(../../../static/images/btn-type2.png);background-repeat: no-repeat;height: 37px;float: left;width: 3px;}
  .login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a input{width:80px;float: left;border: none;background-position: 0 -120px;background-image: url(../../../static/images/btn-type2.png);background-repeat: no-repeat;height: 37px;line-height: 37px;color: #fff;font-size: 14px;font-weight: bold;}
  .login .login-con .login-a .login-b .login-b-c a{color: #447bd6;font-family: "微软雅黑","宋体",Arial;font-size: 12px;}
  .login .login-con .login-a .login-b .login-b-c a:hover{color: #f3ab3a;}
  .login .login-foot{ text-align: center;font-size: 14px;color: #666666;margin-top: 50px;}
  .login .login-con .login-a .login-b .login-b-c{text-align: center;padding-top: 10px;border-top: solid 1px #f0f0f0;}
  .login .login-con .login-a .login-b .login-b-c a{color: #447bd6;font-family: "微软雅黑","宋体",Arial;font-size: 12px;}
  .login .login-con .login-a .login-b .login-b-c a:hover{color: #f3ab3a;}
  #Button1:focus{outline:0;}
</style>
