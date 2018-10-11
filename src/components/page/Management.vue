<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>子系统管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索-->
    <el-form ref="form":inline="true">
      <el-form-item label="系统名称:" style="text-align:left;">
        <el-input placeholder="请输入系统名称" v-model="m_Name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-button type="primary" style="float: right" @click="dialogFormVisible = true">添加新系统</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="SystemId"
        label="系统ID"
        width="160"
       >
      </el-table-column>
      <el-table-column
        prop="FullName"
        label="系统全称"
        min-width="160"
       >
      </el-table-column>
      <el-table-column
        prop="ShortName"
        label="系统简称"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        prop="Uri"
        label="系统地址"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        prop="Description"
        min-width="200"
        label="系统描述">
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow1(scope.row)"  type="primary" size="mini">查看</el-button>
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"  type="danger" size="mini"> 移除 </el-button>
          <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加新系统的弹窗-->
    <el-dialog title="添加新系统"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="系统ID" :label-width="formLabelWidth" prop="AddSystemId">
          <el-input v-model="form.AddSystemId" placeholder="请输入系统ID"></el-input>
        </el-form-item>
        <el-form-item label="系统全称" :label-width="formLabelWidth" prop="AddFullName">
          <el-input v-model="form.AddFullName" placeholder="请输入系统全称"></el-input>
        </el-form-item>
        <el-form-item label="系统简称" :label-width="formLabelWidth" prop="AddShortName">
          <el-input v-model="form.AddShortName" placeholder="请输入系统简称"></el-input>
        </el-form-item>
        <el-form-item label="系统地址" :label-width="formLabelWidth">
          <el-input v-model="form.AddUri" placeholder="请输入系统地址"></el-input>
        </el-form-item>
        <el-form-item label="系统描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.AddDescription" placeholder="请输入系统描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible">取 消</el-button>
        <el-button type="primary" @click="AddSys('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑系统-->
    <el-dialog title="编辑系统"
               :visible.sync="dialogTableVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForms">
        <el-form-item label="系统ID" :label-width="formLabelWidth">
          <el-input v-model="form.EditSystemId"  :disabled="true" placeholder="请输入系统ID"></el-input>
        </el-form-item>
        <el-form-item label="系统全称" :label-width="formLabelWidth" prop="EditFullName">
          <el-input v-model="form.EditFullName" placeholder="请输入系统全称"></el-input>
        </el-form-item>
        <el-form-item label="系统简称" :label-width="formLabelWidth" prop="EditShortName">
          <el-input v-model="form.EditShortName" placeholder="请输入系统简称"></el-input>
        </el-form-item>
        <el-form-item label="系统地址" :label-width="formLabelWidth">
          <el-input v-model="form.EditUri" placeholder="请输入系统地址"></el-input>
        </el-form-item>
        <el-form-item label="系统描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.EditDescription" placeholder="请输入系统描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit">取 消</el-button>
        <el-button type="primary" @click="EditSys('ruleForms')">确 定</el-button>
      </div>
    </el-dialog>
    <!--loadding-->
    <Loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></Loadding>
  </div>
</template>

<script>
  import Loadding from '@/components/common/loadding';
  import {IpUrl,rules} from '../../config/IpUrl';
  import axios from 'axios';
  import {format,setCookie,getCookie} from '../../config/mUtils';
  export default {
    components:{
      Loadding
    },
    data() {
      return {
        showLoadding:false,
        loaddingMsg:"正在获取系统列表数据，请稍后",//loadding提示信息
        tableData: [],
        m_Name:"",
        dialogFormVisible: false,
        dialogTableVisible: false,
        formLabelWidth: '80px',
        form: {
          AddFullName: '',
          AddShortName: '',
          AddDescription: '',
          AddSystemId:"",
          AddUri:"",

          EditFullName: '',
          EditShortName: '',
          EditDescription: '',
          EditSystemId:"",
          EditUri:""
        },
        rules:{}
      }
    },
    methods:{
      //获取子系统列表数据
      getSysData(){
        this.showLoadding=true;
        axios({
          method: 'get',
          url: IpUrl+'/GetPSbuSystemAll',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
            "m_Name":this.m_Name
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            this.showLoadding=false;
            console.log(response.data.ReturnParam,"获取子系统列表");
            this.tableData=response.data.ReturnParam.$values;
          }
          else{
            this.showLoadding=false;
            this.$message({
              message: response.data.ResultMessage,
              type: 'warning'
            });
          }
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      // 系统搜索
      search(){
        this.getSysData();
        this.m_Name="";
      },
      deleteRow(index, rows,row) {
        this.$confirm('确定删除本条数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row,"要删除的数据");
          let m_SbuSystem=row.SystemId;
          // 删除子系统操作
          axios({
            method: 'post',
            url: IpUrl+'/DelPSbuSystem',
            headers: {
              'Authorization':"bearer " +getCookie("Token"),
            },
            data:{
              "AccountId": getCookie("Account"),//用户名
              "Token":getCookie("Token"),
              "SubParam":[{
                "m_SbuSystem":m_SbuSystem,
                }]
            },
          }).then( (response)=> {
            if(response.data.ResultCode==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              rows.splice(index, 1);
              this.getSysData();
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteRow1(row) {
        this.$confirm('确定跳转至此系统, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Uri=row.Uri;
          console.log(Uri,"要跳转的URI");
          window.location.href=Uri;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消跳转'
          });
        });
      },
      handleClick(row) {
        console.log(row,"编辑的行数据");
        this.dialogTableVisible = true;
        this.form.EditFullName=row.FullName;
        this.form.EditShortName=row.ShortName;
        this.form.EditDescription=row.Description;
        this.form.EditSystemId=row.SystemId;
        this.form.EditUri=row.Uri;
      },
      dialogVisible(){
        this.dialogFormVisible = false;
        this.$message('已取消添加新系统');
      },
      dialogVisibleEdit(){
        this.dialogTableVisible = false;
        this.$message('已取消编辑系统');
      },
      //添加新系统
      AddSys(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: IpUrl+'/AddPSbuSystem',
              headers: {
                'Authorization':"bearer " +getCookie("Token"),
              },
              data:{
                "AccountId":getCookie("Account"),//用户名
                "Token":getCookie("Token"),
                "SubParam":[{
                    "m_SbuSystem":{
                      "SystemId":this.form.AddSystemId,
                      "FullName":this.form.AddFullName,
                      "ShortName":this.form.AddShortName,
                      "Description":this.form.AddDescription,
                      "Uri":this.form.AddUri,
                      "CreateTime":format()
                    }
                  }]
              },
            }).then( (response)=> {
              if(response.data.ResultCode==200){
                this.dialogFormVisible = false;
                this.$message({
                  message: '恭喜你，添加新系统成功',
                  type: 'success'
                });
                this.form.AddSystemId=this.form.AddFullName=this.form.AddShortName=this.form.AddDescription=this.form.AddUri="";
                this.getSysData();
              }
              else{
                this.$message({
                  message: response.data.ResultMessage?response.data.ResultMessage:"当前没有权限，请重新登录",
                  type: 'warning'
                });
              }
            })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      // 编辑系统
      EditSys(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: IpUrl+'/SetPSbuSystem',
              headers: {
                'Authorization':"bearer " +getCookie("Token"),
              },
              data:{
                "AccountId": getCookie("Account"),//用户名
                "Token":getCookie("Token"),
                "SubParam":
                  [{
                    "m_SbuSystem":{
                      "SystemId":this.form.EditSystemId,
                      "FullName":this.form.EditFullName,
                      "ShortName":this.form.EditShortName,
                      "Description":this.form.EditDescription,
                      "Uri":this.form.EditUri,
                      "CreateTime":format()
                    }
                  }]
              },
            }).then( (response)=> {
              if(response.data.ResultCode==200){
                this.dialogTableVisible = false;
                this.$message({
                  message: '恭喜你，编辑系统成功',
                  type: 'success'
                });
                this.getSysData();
              }
              else{
                this.$message({
                  message: response.data.ResultMessage?response.data.ResultMessage:"当前没有权限，请重新登录",
                  type: 'warning'
                });
              }
            })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      }
    },
    mounted:function () {
      this.getSysData();
      this.rules=rules;
    }
  }
</script>

<style>

</style>
