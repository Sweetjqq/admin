<template>
  <div id="pdfDom">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="height: 35px">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索-->
    <el-form ref="form" :inline="true">
      <el-form-item label="用户名称:" style="text-align:left;">
        <el-input placeholder="请输入用户名称" v-model="m_Name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <!--<el-button type="primary" @click="pdf">导出pdf</el-button>-->
      </el-form-item>
      <el-button type="primary" style="float: right" @click="dialogFormVisible = true">添加新用户</el-button>
    </el-form>
    <!--tableData-->
    <el-table id="pdfTable" :data="tableData" ref="singleTable" border style="width: 100%">
      <el-table-column prop="UserId" label="登录账号">
      </el-table-column>
      <el-table-column prop="SystemName" width="150" label="所属系统">
      </el-table-column>
      <el-table-column prop="RoleName" label="用户角色">
      </el-table-column>
      <el-table-column prop="UserType" label="用户类型">
      </el-table-column>
      <el-table-column prop="DepartmentName" label="所属部门">
      </el-table-column>

      <el-table-column fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)" type="danger" size="mini"> 移除
          </el-button>
          <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div style="float: right;margin-top: 15px">
      <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next, jumper" :page-size="Number(m_Pagesize)"
        :current-page="1" :total="Number(total)">
      </el-pagination>
    </div>
    <!--添加新用户的弹窗-->
    <el-dialog title="添加新用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="AddUserId">
          <el-input v-model="form.AddUserId" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth" prop="AddPassword">
          <el-input type="password" v-model="form.AddPassword" placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" :label-width="formLabelWidth">
          <el-input placeholder="普通用户_角色" :disabled="true"></el-input>
          <!--<el-cascader-->
          <!--:options="Rolesoptions"-->
          <!--change-on-select-->
          <!--:props="Rolesprops"-->
          <!--@change="handleItemChangeRols"-->
          <!--&gt;</el-cascader>-->
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth" required prop="AddDepartmentId">
          <el-cascader :options="options" change-on-select :props="props" @change="handleItemChange" ref="cascader"
            filterable></el-cascader>
        </el-form-item>
        <el-form-item label="所属系统" :label-width="formLabelWidth" required prop="AddSystemId">
          <el-cascader :options="Systemoptions" :show-all-levels="false" :props="Systemprops" @change="handleItemChangeSystem"
            ref="cascader1" filterable></el-cascader>
        </el-form-item>
        <el-form-item label="用户类型" :label-width="formLabelWidth">
          <el-radio-group v-model="radio" @change="GetUserType">
            <el-radio :label="0"> 普通用户</el-radio>
            <el-radio :label="9">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible">取 消</el-button>
        <el-button type="primary" @click="AddUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑用户的弹窗-->
    <el-dialog title="编辑用户" :visible.sync="dialogTableVisible" :close-on-click-modal="false" :show-close="false">
      <el-form :model="form" :rules="rules" ref="ruleForms">
        <el-form-item label="登录账号" :label-width="formLabelWidth" prop="EditUserId">
          <el-input v-model="form.EditUserId" disabled placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth" prop="EditPassword">
          <el-input type="password" disabled v-model="form.EditPassword" placeholder="请输入6位数字密码"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth" required prop="EditDepartmentId">
          <el-cascader :options="options" change-on-select :props="props" @change="handleItemChangeEdit" v-model="form.DepartmentIdArray"
            filterable></el-cascader>
        </el-form-item>
        <el-form-item label="所属角色" :label-width="formLabelWidth">
          <el-input v-model="form.RoleName" :disabled="true"></el-input>
          <!--<el-cascader-->
          <!--:options="Rolesoptions"-->
          <!--change-on-select-->
          <!--:props="Rolesprops"-->
          <!--@change="handleItemChangeRolsEdit"-->
          <!--disabled-->
          <!--&gt;</el-cascader>-->
        </el-form-item>
        <el-form-item label="所属系统" :label-width="formLabelWidth" required prop="EditSystemId">
          <el-cascader :options="Systemoptions" :show-all-levels="false" :props="Systemprops" @change="handleItemChangeSystemEdit"
            v-model="form.SystemId" filterable></el-cascader>
        </el-form-item>
        <el-form-item label="用户类型" :label-width="formLabelWidth">
          <el-radio-group v-model="Editradio" @change="GetUserType">
            <el-radio :label="0"> 普通用户</el-radio>
            <el-radio :label="9">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit">取 消</el-button>
        <el-button type="primary" @click="EditUser('ruleForms')">确 定</el-button>
      </div>
    </el-dialog>
    <!--loadding-->
    <Loadding v-if="showLoadding" :loaddingMsg="loaddingMsg"></Loadding>
  </div>
</template>

<script>
  import Loadding from '@/components/common/loadding';
  import {
    IpUrl,
    rules
  } from '../../config/IpUrl';
  import axios from 'axios';
  import {
    format,
    setCookie,
    getCookie
  } from '../../config/mUtils';

  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import {
    autoTableHtmlToJson,
    autoTable
  } from '../../../static/js/autotable.js'
  export default {
    components: {
      Loadding
    },
    methods: {
      pdf() {
        var title = this.htmlTitle;
        html2Canvas(document.querySelector('#pdfDom'), {
          allowTaint: true
        }).then((canvas) => {
          let contentWidth = canvas.width;
          let contentHeight = canvas.height;
          let pageHeight = contentWidth / 592.28 * 841.89;
          let leftHeight = contentHeight;
          let position = 0;
          let imgWidth = 595.28;
          let imgHeight = 592.28 / contentWidth * contentHeight;
          let pageData = canvas.toDataURL('image/png', 1.0);
          let PDF = new JsPDF('', 'pt', 'a4');
          // //这里就是把将table写入到pdf里面。
          //           var res = PDF.autoTableHtmlToJson(document.getElementsByClassName("table")[0], true);
          //           PDF.autoTable(res.columns, res.data);
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 841.89;
              if (leftHeight > 0) {
                PDF.addPage();
              }
            }
          }

          PDF.save(title + '.pdf');
        })
        //        this.getPdf();
      },
      handleCurrentChange(val) {
        this.m_Pageindex = val;
        console.log(`当前页: ${val}`);
        this.getAllTotal();
      },
      //      点击获取行数据
      handleClick(row) {
        console.log(row, "编辑需要的行数据");
        this.form.EditPassword = row.Password;
        this.form.EditUserId = row.UserId;
        this.form.EditUserType = row.UserType;
        this.form.EditRoleId = row.RoleId;

        this.form.DepartmentId = row.DepartmentId;
        this.form.EditDepartmentId = row.DepartmentId;
        this.form.EditSystemId = row.SystemId;
        this.form.DepartmentIdArray = row.DepartmentIdArray;
        this.form.RoleName = row.RoleName;
        this.form.SystemId = [];
        this.form.SystemId.push(row.SystemId);
        this.dialogTableVisible = true;
        if (row.UserType == "普通用户") {
          this.Editradio = 0;
        } else {
          this.Editradio = 9;
        }
      },
      //      删除行数据
      deleteRow(index, rows, row) {
        this.$confirm('确定删除本条数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row, "要删除的数据");
          let m_UserId = row.UserId;
          let m_SysId = row.SystemId;
          axios({
              method: 'post',
              url: IpUrl + '/DelPUser',
              headers: {
                'Authorization': "bearer " + getCookie("Token"),
              },
              data: {
                "AccountId": getCookie("Account"), //用户名
                "Token": getCookie("Token"),
                "SubParam": [{
                    "m_UserId": m_UserId,
                  },
                  {
                    "m_SysId": m_SysId,
                  }
                ]
              },
            }).then((response) => {
              if (response.data.ResultCode == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                rows.splice(index, 1);
                this.getAllTotal();
              } else {
                this.$message({
                  message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
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
      // 获取用户列表数据
      getUserData() {
        axios({
            method: 'get',
            url: IpUrl + '/GetPUsersPageData',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            params: {
              "AccountId": getCookie("Account"), //用户名
              "m_Pagesize": this.m_Pagesize,
              "m_Pageindex": this.m_Pageindex,
              "m_Name": this.m_Name,
              "m_SysId": ""
            },
          }).then((response) => {
            if (response.data.ResultCode == 200) {
              this.showLoadding = false;
              console.log(response.data.ReturnParam, "$$$$$$$$$$$$");
              this.tableData = response.data.ReturnParam.$values;
              for (let item of this.tableData) {
                if (item.UserType == 0) {
                  item.UserType = "普通用户";
                }
                if (item.UserType == 9) {
                  item.UserType = "管理员";
                }
              }
              this.m_Name = "";
            } else {
              this.showLoadding = false;
              this.$message({
                message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取总条数
      getAllTotal() {
        this.showLoadding = true;
        axios({
            method: 'get',
            url: IpUrl + '/GetPUsersCount',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            params: {
              "AccountId": getCookie("Account"), //用户名
              "m_Name": this.m_Name,
              "m_SysId": ""
            },
          }).then((response) => {
            if (response.data.ResultCode == 200) {
              console.log(response.data.ReturnParam, "getAllTotal");
              this.total = response.data.ReturnParam;
              this.getUserData();
            } else {
              this.$message({
                message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      search() {
        this.getAllTotal();
      },
      // 获取所有部门的数据
      GetDepartmentsAll() {
        axios({
            method: 'get',
            url: IpUrl + '/GetPDepartmentsAll',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            params: {
              "AccountId": getCookie("Account"), //用户名
            },
          }).then((response) => {
            if (response.data.ResultCode == 200) {
              console.log(response.data, "原始所有部门数据");
              this.options = response.data.ReturnParam.$values;
            } else {
              this.$message({
                message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      // 获取所有角色的数据
      GetRolsAll() {
        axios({
            method: 'get',
            url: IpUrl + '/GetPRolesAll',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            params: {
              "AccountId": getCookie("Account"), //用户名
            },
          }).then((response) => {
            if (response.data.ResultCode == 200) {
              console.log(response.data.ReturnParam, "原始所有角色数据");
              this.Rolesoptions = response.data.ReturnParam.$values;
            } else {
              this.$message({
                message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //获取所有子系统
      GetSystemAll() {
        axios({
            method: 'get',
            url: IpUrl + '/GetPSbuSystemAll',
            headers: {
              'Authorization': "bearer " + getCookie("Token"),
            },
            params: {
              "AccountId": getCookie("Account"), //用户名
              "m_Name": ""
            },
          }).then((response) => {
            if (response.data.ResultCode == 200) {
              console.log(response.data.ReturnParam.$values, "原始所有子系统数据");
              this.Systemoptions = response.data.ReturnParam.$values;;
            } else {
              this.$message({
                message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleItemChange(val) {
        console.log(val, "选择的部门");
        this.form.AddDepartmentId = val[val.length - 1];
        console.log(this.form.AddDepartmentId, "选择的部门");
      },
      handleItemChangeRols(val) {
        console.log(val, "选择的角色");
        this.form.AddRoleId = val[val.length - 1];
      },
      handleItemChangeSystem(val) {
        console.log(val, "选择的子系统");
        this.form.AddSystemId = val[val.length - 1];
      },

      handleItemChangeEdit(val) {
        console.log(val, "选择的部门");
        this.form.EditDepartmentId = val[val.length - 1];
        console.log(this.form.EditDepartmentId, "选择的部门");
      },
      handleItemChangeRolsEdit(val) {
        console.log(val, "选择的角色");
        this.form.EditRoleId = val[val.length - 1];
      },
      handleItemChangeSystemEdit(val) {
        console.log(val, "选择的子系统");
        this.form.EditSystemId = val[val.length - 1];
      },
      dialogVisible() {
        this.dialogFormVisible = false;
        this.$message('已取消添加新用户');
      },
      dialogVisibleEdit() {
        this.dialogTableVisible = false;
        this.$message('已取消编辑用户');
      },
      // 验证密码合法
      isPsdAvailable(str) {
        var myreg = /^\d{6}$/;
        if (!myreg.test(str)) {
          return false;
        } else {
          return true;
        }
      },
      //添加用户
      AddUser(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.isPsdAvailable(this.form.AddPassword)) {
            axios({
                method: 'post',
                url: IpUrl + '/AddPUser',
                headers: {
                  'Authorization': "bearer " + getCookie("Token"),
                },
                data: {
                  "AccountId": getCookie("Account"), //用户名
                  "Token": getCookie("Token"),
                  "SubParam": [{
                      "m_User": {
                        "SystemId": "",
                        "UserId": this.form.AddUserId,
                        "Password": this.form.AddPassword,
                        "DepartmentId": this.form.AddDepartmentId,
                        "RoleId": "2", //this.form.AddRoleId,创建用户时，角色默认为普通
                        "UserType": this.radio,
                      }
                    },
                    {
                      "m_SysId": this.form.AddSystemId,
                    }
                  ]
                },
              }).then((response) => {
                if (response.data.ResultCode == 200) {
                  this.dialogFormVisible = false;
                  this.$message({
                    message: '恭喜你，添加新用户成功',
                    type: 'success'
                  });
                  this.form.AddUserId = this.form.AddPassword = "";
                  this.getAllTotal();
                  this.$refs.cascader.handlePick([], true);
                  this.$refs.cascader1.handlePick([], true);
                } else {
                  this.$message({
                    message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            this.$message({
              message: "无效密码,请重新设置",
              type: 'warning'
            });
            console.log(valid, 'error submit!!');
            return false;
          }
        });
      },
      //编辑用户
      EditUser(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios({
                method: 'post',
                url: IpUrl + '/SetPUser',
                headers: {
                  'Authorization': "bearer " + getCookie("Token"),
                },
                data: {
                  "AccountId": getCookie("Account"), //用户名
                  "Token": getCookie("Token"),
                  "SubParam": [{
                      "m_User": {
                        "SystemId": "",
                        "UserId": this.form.EditUserId,
                        "Password": this.form.EditPassword,
                        "DepartmentId": this.form.EditDepartmentId,
                        "RoleId": this.form.EditRoleId,
                        "UserType": this.Editradio,
                      }
                    },
                    {
                      "m_SysId": this.form.EditSystemId,
                    }
                  ]
                },
              }).then((response) => {
                if (response.data.ResultCode == 200) {
                  this.dialogTableVisible = false;
                  this.$message({
                    message: '恭喜你，编辑用户成功',
                    type: 'success'
                  });
                  this.form.AddUserId = this.form.AddPassword = "";
                  this.getAllTotal();
                } else {
                  this.$message({
                    message: response.data.ResultMessage ? response.data.ResultMessage : "当前没有权限，请重新登录",
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
      GetUserType(value) {
        console.log(this.radio, "用户类型");
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        htmlTitle: 'shc',
        showLoadding: false,
        loaddingMsg: "正在获取用户列表数据，请稍后", //loadding提示信息
        m_Name: "",
        m_Pagesize: "10", //每页多少条数据,
        m_Pageindex: "1", //当前第几页，
        total: "",
        tableData: [],
        dialogFormVisible: false,
        dialogTableVisible: false,
        formLabelWidth: '80px',
        radio: 0,
        Editradio: "",
        form: {
          AddPassword: '',
          AddUserId: '',
          AddRoleId: "",
          AddDepartmentId: "",
          Addm_SysId: "",
          AddSystemId: "",
          DepartmentId: "",

          EditPassword: '',
          EditUserId: '',
          EditUserType: "",
          EditRoleId: "",
          EditDepartmentId: "",
          Editm_SysId: "",
          EditSystemId: "",
          DepartmentIdArray: [],
          SystemId: [],
          RoleName: ""
        },
        options: [],
        Rolesoptions: [],
        Systemoptions: [],
        props: {
          label: 'FullName',
          value: 'DepartmentId',
          children: 'ChildrenItems'
        },
        Rolesprops: {
          label: 'FullName',
          value: 'RoleId',
          children: 'ChildrenItems'
        },
        Systemprops: {
          label: 'FullName',
          value: 'SystemId',
        },
        rules: {}
      }
    },
    created: function () {

    },
    mounted: function () {
      this.getAllTotal();
      this.GetDepartmentsAll();
      this.GetRolsAll();
      this.GetSystemAll();
      this.rules = rules;
    }
  }

</script>

<style>

</style>
