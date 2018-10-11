<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索-->
    <el-form ref="form":inline="true">
      <el-form-item label="角色名称:" style="text-align:left;">
        <el-input placeholder="请输入角色名称" v-model="m_Name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-button type="primary" style="float: right" @click="dialogFormVisible = true">添加新角色</el-button>
    </el-form>
    <!--所有的表单数据-->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="RoleId"
        label="角色Id"
        width="100">
      </el-table-column>

      <el-table-column
        prop="FullName"
        label="角色全称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="ShortName"
        label="角色简称"
        width="160"
      >
      </el-table-column>

      <el-table-column
        prop="ParentName"
        label="所属角色"
        width="160"
      >
      </el-table-column>

      <el-table-column
        prop="Descripton"
        min-width="160"
        label="角色描述"
      >
      </el-table-column>

      <el-table-column
        prop="CreateTime"
        label="创建日期"
        width="180">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="140"
      >
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"  type="danger" size="mini"> 移除 </el-button>
          <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--分页-->
    <div style="float: right;margin-top: 15px">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :page-size="Number(m_Pagesize)"
        :current-page="1"
        :total="Number(total)">
      </el-pagination>
    </div>

    <!--添加新角色的弹窗-->
    <el-dialog title="添加新角色"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="角色全称" :label-width="formLabelWidth" prop="AddFullName">
          <el-input v-model="form.AddFullName" placeholder="请输入角色全称"></el-input>
        </el-form-item>
        <el-form-item label="角色简称" :label-width="formLabelWidth"  prop="AddShortName">
          <el-input v-model="form.AddShortName" placeholder="请输入角色简称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.AddDescription" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" :label-width="formLabelWidth">
          <el-cascader
            clearable
            :options="Rolesoptions"
            change-on-select
            :props="props"
            @change="handleItemChange"
            ref="cascader"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible">取 消</el-button>
        <el-button type="primary" @click="AddRole('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑角色-->
    <el-dialog title="编辑角色"
               :visible.sync="dialogTableVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForms">
        <el-form-item label="角色全称" :label-width="formLabelWidth" prop="EditFullName">
          <el-input v-model="form.EditFullName" placeholder="请输入角色全称"></el-input>
        </el-form-item>
        <el-form-item label="角色简称" :label-width="formLabelWidth" prop="EditShortName">
          <el-input v-model="form.EditShortName" placeholder="请输入角色简称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.EditDescription" placeholder="请输入角色描述"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" :label-width="formLabelWidth">
          <el-cascader
            :options="Rolesoptions"
            change-on-select
            :props="props"
            @change="handleItemChangeEdit"
            v-model="ParentIdArray"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit">取 消</el-button>
        <el-button type="primary" @click="EditRole('ruleForms')">确 定</el-button>
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
    methods: {
      handleClick(row) {
        console.log(row,"编辑的行数据");
        this.dialogTableVisible = true;
        this.ParentIdArray=row.ParentIdArray;

        this.form.EditFullName=row.FullName;
        this.form.EditShortName=row.ShortName;
        this.form.EditDescription=row.Descripton;
        this.form.EditRoleId=row.ParentId;
        this.form.RoleId=row.RoleId;
      },
      deleteRow(index, rows,row) {
        this.$confirm('确定删除本条数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row,"要删除的数据");
          let m_RoleId=row.RoleId;
          // 删除角色操作
          axios({
            method: 'post',
            url: IpUrl+'/DelPRole',
            headers: {
              'Authorization':"bearer " +getCookie("Token"),
            },
            data:{
              "AccountId": getCookie("Account"),//用户名
              "Token":getCookie("Token"),
              "SubParam":
                [{
                  "m_RoleId":m_RoleId,
                }]
            },
          }).then( (response)=> {
            if(response.data.ResultCode==200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              rows.splice(index, 1);
              this.getAllTotal();
              this.GetRolsAll();
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
      getRolData(){
        this.showLoadding=true;
        axios({
          method: 'get',
          url: IpUrl+'/GetPRolesPageData',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
            "m_Pagesize":this.m_Pagesize,
            "m_Pageindex":this.m_Pageindex,
            "m_Name":this.m_Name
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            this.showLoadding=false;
            console.log(response.data.ReturnParam,"获取角色数据列表");
            this.tableData=response.data.ReturnParam.$values;
            this.m_Name="";
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
      //获取总条数
      getAllTotal(){
        axios({
          method: 'get',
          url: IpUrl+'/GetPRolesCount',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
            "m_Name":this.m_Name
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            console.log(response.data.ReturnParam,"getAllTotal");
            this.total=response.data.ReturnParam;
            this.getRolData();
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
      },
      handleCurrentChange(val) {
        this.m_Pageindex=val;
        console.log(`当前页: ${val}`);
        this.getRolData();
      },
      search(){
        this.getAllTotal();
      },
      handleItemChange(val) {
        this.form.AddRoleId=val[val.length-1];
        console.log(this.form.AddRoleId,"44444444444");
      },
      handleItemChangeEdit(val) {
        this.form.EditRoleId=val[val.length-1];
        console.log(this.form.EditRoleId,"44444444444");
      },
      dialogVisible(){
        this.dialogFormVisible = false;
        this.$message('已取消添加新角色');
      },
      dialogVisibleEdit(){
        this.dialogTableVisible = false;
        this.$message('已取消编辑角色');
      },
      // 获取所有角色的数据
      GetRolsAll(){
        axios({
          method: 'get',
          url: IpUrl+'/GetPRolesAll',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            console.log(response.data.ReturnParam,"原始所有角色数据");
            this.Rolesoptions=response.data.ReturnParam.$values;
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
      },
    //添加新角色
      AddRole(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: IpUrl+'/AddPRole',
              headers: {
                'Authorization':"bearer " +getCookie("Token"),
              },
              data:{
                "AccountId": getCookie("Account"),//用户名
                "Token":getCookie("Token"),
                "SubParam":
                  [{
                    "m_Role":{
                      "FullName":this.form.AddFullName,
                      "ShortName":this.form.AddShortName,
                      "ParentId":this.form.AddRoleId=this.form.AddRoleId?this.form.AddRoleId:0,
                      "Descripton":this.form.AddDescription,
                      "CreateTime":format()
                    }
                  }]
              },
            }).then( (response)=> {
              if(response.data.ResultCode==200){
                this.dialogFormVisible = false;
                this.$message({
                  message: '恭喜你，添加新角色成功',
                  type: 'success'
                });
                this.getAllTotal();
                this.GetRolsAll();
                //角色添加成功后，清空输入内容
                this.form.AddFullName=this.form.AddShortName=this.form.AddDescription="";
                this.$refs.cascader.handlePick([],true);
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
      // 编辑角色
      EditRole(formName){
        if(this.form.EditRoleId==this.form.RoleId){
          this.$message({
            message: "相同角色不存所属关系",
            type: 'warning'
          });
        }
        else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              axios({
                method: 'post',
                url: IpUrl +'/SetPRole',
                headers: {
                  'Authorization':"bearer " +getCookie("Token"),
                },
                data:{
                  "AccountId":getCookie("Account"),//用户名
                  "Token": getCookie("Token"),
                  "SubParam":
                    [{
                      "m_Role":{
                        "RoleId": this.form.RoleId,
                        "FullName": this.form.EditFullName,
                        "ShortName": this.form.EditShortName,
                        "ParentId": this.form.EditRoleId,
                        "Descripton": this.form.EditDescription,
                        "CreateTime": format()
                      }
                    }]
                },
              }).then((response) => {
                if (response.data.ResultCode==200) {
                  this.dialogTableVisible = false;
                  this.$message({
                    message: '恭喜你，编辑角色成功',
                    type: 'success'
                  });
                  this.getAllTotal();
                  this.GetRolsAll();
                }
                else {
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

      }
    },

    data() {
      return {
        tableData: [],
        showLoadding:true,
        loaddingMsg:"正在获取角色列表数据，请稍后",//loadding提示信息
        m_Pagesize:"10",//每页多少条数据,
        m_Pageindex:"1",//当前第几页
        m_Name:"",
        total:"",
        dialogFormVisible: false,
        dialogTableVisible: false,
        formLabelWidth: '80px',
        options:[],
        form: {
          AddFullName: '',
          AddShortName: '',
          AddDescription: '',
          AddRoleId:"0",

          EditFullName: '',
          EditShortName: '',
          EditDescription: '',
          EditRoleId:"",
          RoleId:""
        },
        ParentIdArray:[],
        props: {
          label:'FullName',
          value:'RoleId',
          children: 'ChildrenItems'
        },
        Rolesoptions:[],
        rules:{}
      }
    },
    mounted:function () {
      this.getAllTotal();
      this.GetRolsAll();
      this.rules=rules;
    }
  }
</script>

<style>

</style>
