/***
 * 访问服务器的Ip地址
 * */
//export const IpUrl="http://10.21.10.192";//测试环境 API Gateway地址(接口访问地址)

// export const IpUrl="http://192.168.10.91";//Uat API Gateway地址(接口访问地址)

 export const IpUrl="https://api.fw-fintech.com";//Uat API Gateway地址(接口访问地址)

/***
 * 表单验证
 * */
export const rules= {
  // 用户
  AddUserId: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
     // { min: 3, max: 10, message: '长度在 3 到 100 个字符', trigger: 'blur' }
  ],
  EditUserId: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
     // { min: 3, max: 10, message: '长度在 3 到 100个字符', trigger: 'blur' }
  ],
  AddPassword: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
  ],
  EditPassword: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
  ],
  AddDepartmentId: [
    { required: true, message: '请选择所属部门',},
  ],
  EditDepartmentId: [
    { required: true, message: '请选择所属部门', },
  ],

  AddFullName:[
    { required: true, message: '请输入全称', trigger: 'blur' },
  ],
  EditFullName:[
    { required: true, message: '请输入全称', trigger: 'blur' },
  ],
  AddShortName:[
    { required: true, message: '请输入简称', trigger: 'blur' },
  ],
  EditShortName:[
    { required: true, message: '请输入简称', trigger: 'blur' },
  ],
  AddSystemId:[
    { required: true, message: '请输入系统ID', trigger: 'blur' },
  ],
  AddSystemId:[
    { required: true, message: '请选择所属系统'},
  ],
  EditSystemId:[
    { required: true, message: '请选择所属系统'},
  ]
}
