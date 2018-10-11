<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索-->
    <el-form ref="form":inline="true">
      <el-form-item label="部门名称:" style="text-align:left;">
        <el-input placeholder="请输入部门名称" v-model="m_Name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-button type="primary" style="float: right" @click="dialogFormVisible = true">添加新部门</el-button>
    </el-form>
    <!--所有的表单数据-->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="DepartmentId"
        label="部门Id"
        width="100">
      </el-table-column>

      <el-table-column
        prop="FullName"
        label="部门全称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="ShortName"
        label="部门简称"
        width="160"
      >
      </el-table-column>

      <el-table-column
        prop="ParentName"
        label="所属部门"
        width="140"
      >
      </el-table-column>

      <el-table-column
        prop="Description"
        label="部门描述"
        min-width="160"
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

    <!--添加新部门的弹窗-->
    <el-dialog title="添加新部门"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="部门全称" :label-width="formLabelWidth" prop="AddFullName">
          <el-input v-model="form.AddFullName" placeholder="请输入部门全称"></el-input>
        </el-form-item>
        <el-form-item label="部门简称" :label-width="formLabelWidth"  prop="AddShortName">
          <el-input v-model="form.AddShortName" placeholder="请输入部门简称"></el-input>
        </el-form-item>
        <el-form-item label="部门描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.AddDescription" placeholder="请输入部门描述"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-cascader
            :options="options"
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
        <el-button type="primary" @click="AddDashboard('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑部门-->
    <el-dialog title="编辑部门"
               :visible.sync="dialogTableVisible"
               :close-on-click-modal="false"
               :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="ruleForms">
        <el-form-item label="部门全称" :label-width="formLabelWidth" prop="EditFullName">
          <el-input v-model="form.EditFullName"></el-input>
        </el-form-item>
        <el-form-item label="部门简称" :label-width="formLabelWidth" prop="EditShortName">
          <el-input v-model="form.EditShortName"></el-input>
        </el-form-item>
        <el-form-item label="部门描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.EditDescription"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <span style="color: #20a0ff;display: none">{{form.ParentNameEdit}}</span>&nbsp;&nbsp;&nbsp;
          <el-cascader
            :options="options"
            :props="props"
            @change="handleItemChangeEdit"
            change-on-select
            v-model="selectedOptions"
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Visible">取 消</el-button>
        <el-button type="primary" @click="editDashboard('ruleForms')">确 定</el-button>
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
      handleCurrentChange(val) {
        this.m_Pageindex=val;
        console.log(`当前页: ${val}`);
        this.getData();
      },
      handleClick(row) {
        console.log(row,"编辑获取数据");
        this.dialogTableVisible=true;
        this.form.ParentNameEdit=row.ParentName;
        this.form.EditFullName=row.FullName;
        this.form.EditShortName=row.ShortName;
        this.form.EditDescription=row.Description;
        this.form.DepartmentId=row.DepartmentId;
        this.form.SelectParentIdEdit=row.ParentId;
        this.selectedOptions=row.ParentIdArray;
      },
//      删除部门
      deleteRow(index, rows,row) {
        this.$confirm('确定删除本条数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row,"要删除的数据");
          let m_DepartmentId=row.DepartmentId;
          // 删除部门操作
          axios({
            method: 'post',
            url: IpUrl+'/DelPDepartment',
            headers: {
              'Authorization':"bearer " +getCookie("Token"),
            },
            data:{
              "AccountId":getCookie("Account"),//用户名
              "Token":getCookie("Token"),
              "SubParam":[{
                "m_DepartmentId":m_DepartmentId,
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
      //获取分页中的每一页的数据
      getData(){
        axios({
          method: 'get',
          url: IpUrl+'/GetPDepartmentsPageData',
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
            console.log(response.data,"$$$$$$$$$$$$");
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
        this.showLoadding=true;
        axios({
          method: 'get',
          url: IpUrl+'/GetPDepartmentsCount',
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
            this.getData();
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
//      添加部门弹框
      AddDashboard(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: IpUrl+'/AddPDepartment',
              headers: {
                'Authorization':"bearer " +getCookie("Token"),
              },
              data:{
                "AccountId":getCookie("Account"),//用户名
                "Token":getCookie("Token"),
                "SubParam":[
                  {
                    "m_Department":{
                      "FullName":this.form.AddFullName,
                      "ShortName":this.form.AddShortName,
                      "Description":this.form.AddDescription,
                      "ParentId":this.form.SelectDepartmentId,
                      "CreateTime":format()
                    }
                  }, {
                  "m_SysId":""
                }
                ],
              },
            }).then( (response)=> {
              if(response.data.ResultCode==200){
                this.dialogFormVisible = false;
                this.$message({
                  message: '恭喜你，添加新部门成功',
                  type: 'success'
                });
                this.form.AddFullName=this.form.AddShortName=this.form.AddDescription="";
                this.$refs.cascader.handlePick([],true);
                this. GetDepartmentsAll();//获取所有部门
                this.getAllTotal();
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
      dialogVisible(){
        this.dialogFormVisible = false;
        this.$message('已取消添加新部门');
      },
//      编辑部门
      editDashboard(formName){
        if(this.form.SelectParentIdEdit==this.form.DepartmentId){
          this.$message({
            message: "相同部门不存所属关系",
            type: 'warning'
          });
        }
        else{
          this.$refs[formName].validate((valid) => {
            if (valid) {
              axios({
                method: 'post',
                url: IpUrl+'/SetPDepartment',
                headers: {
                  'Authorization':"bearer " +getCookie("Token"),
                },
                data:{
                  "AccountId":getCookie("Account"),//用户名
                  "Token":getCookie("Token"),
                  "SubParam":[{
                      "m_Department":{
                        "DepartmentId":this.form.DepartmentId,
                        "FullName":this.form.EditFullName,
                        "ShortName":this.form.EditShortName,
                        "Description":this.form.EditDescription,
                        "ParentId":this.form.SelectParentIdEdit,
                        "CreateTime":format()
                      }
                    }]
                },
              }).then( (response)=> {
                if(response.data.ResultCode==200){
                  this.dialogTableVisible = false;
                  this.$message({
                    message: '恭喜你,编辑部门成功',
                    type: 'success'
                  });

                  this.getAllTotal();
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
      Visible(){
        this.dialogTableVisible = false;
        this.$message('已取消编辑部门');
      },
//      搜索
      search(){
        this.getAllTotal();
      },
      // 获取所有部门的数据
      GetDepartmentsAll(){
        axios({
          method: 'get',
          url: IpUrl+'/GetPDepartmentsAll',
          headers: {
            'Authorization':"bearer " +getCookie("Token"),
          },
          params:{
            "AccountId":getCookie("Account"),//用户名
          },
        }).then( (response)=> {
          if(response.data.ResultCode==200){
            console.log(response.data,"原始所有部门数据");
            this.options=response.data.ReturnParam.$values;
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
      handleItemChange(val) {
        this.form.SelectDepartmentId=val[val.length-1];
        console.log(this.form.SelectDepartmentId,"44444444444");
      },
      handleItemChangeEdit(val) {
        this.form.SelectParentIdEdit=val[val.length-1];
        console.log(val,"6666666666");
        setTimeout(()=>{
          var label=document.getElementsByClassName("el-cascader__label")[0].innerHTML;
          this.form.ParentNameEdit=label;
        },100)

      }
    },

    data() {
      return {
        showLoadding:true,
        loaddingMsg:"正在获取部门列表数据，请稍后",//loadding提示信息
        m_Name:"",
        m_Pagesize:"10",//每页多少条数据,
        m_Pageindex:"1",//当前第几页
        total:"",//总条数
        tableData: [],
        dialogFormVisible: false,
        dialogTableVisible: false,
        formLabelWidth: '80px',
        form: {
          AddFullName: '',
          AddShortName: '',
          AddDescription: '',

          EditFullName: '',
          EditShortName: '',
          EditDescription: '',
          DepartmentId:"",
          SelectParentId:"",
          SelectParentIdEdit:"",
          SelectDepartmentId:"0",
          ParentNameEdit:""
        },
        options:[],
        props: {
          label:'FullName',
          value:'DepartmentId',
          children: 'ChildrenItems'
        },
        selectedOptions:[],//默认选择的数据
        rules:{}
      }
    },
    created:function () {
    },
    mounted:function () {
      this.getAllTotal();
      this.GetDepartmentsAll();
      this.rules=rules;
    }
  }
</script>

<style>

</style>
