<template>
  <div>
    <el-card class="el-header box-card" :body-style="{ padding: '0px' }">
      <el-button-group style="float: left; padding-bottom: 1em;  padding-left:9em;margin-top:1%;">
        <!--<el-button type="info" icon="el-icon-arrow-left">向后</el-button>-->
        <el-button type="info" @click="$router.push({path: '/'})">主页</el-button>
        <!--<el-button type="info">向前<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>-->
      </el-button-group>

      <el-tooltip class="item" effect="dark" content="点击进入个人中心" placement="top-start">
        <el-button v-if="$Const.isLogin()" style="margin-left:59%;margin-top: 1%;" type="text" @click="userHomePage">欢迎您
          : {{ $Const.localStoreObj.getUser().username }}
        </el-button>
      </el-tooltip>

      <div v-if='loginState' style="float: right;margin-top:1%;margin-right: 3.5%;">
        <el-button type="warning" @click="updateLoginState">退出</el-button>
      </div>
      <div v-else style="float: right;margin-top:1%;margin-right: 3.5%;">
        <el-button type="success" @click="loginUterVisible = true">登陆</el-button>
        <el-button type="success" plain @click="outerVisible = true">点击注册</el-button>
      </div>
    </el-card>
    <el-dialog title="注册" width="20em" :visible.sync="outerVisible">
      <el-tooltip class="item" effect="dark" content="快速注册仅保存登陆相关信息，不能回帖" placement="top">
        <el-button type="success" @click="register(false)">快速注册</el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="请注意gv填写收款账号，参与回帖一旦采纳赏金直接打入您的账户" placement="top">
        <el-button type="success" @click="register(true)">完整注册</el-button>
      </el-tooltip>
      <el-dialog width="42em" :title="registerTitle" :visible.sync="innerVisible" append-to-body center>
        <!--这里填写内层div信息-->
        <el-card class="box-card">
          <el-form :model="user" label-position="left" label-width="38%" ref="user" :rules="rules">
            <el-form-item label="登录名 *" prop="loginname">
              <el-input v-model="user.loginname" placeholder="登陆名"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码 *" prop="password">
              <el-input v-model="user.password" type="password" placeholder="登陆密码"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="username">
              <el-input v-model="user.username" placeholder="不填写将自动生成奇怪的昵称"></el-input>
            </el-form-item>
            <el-form-item label="性别 *" prop="sex">
              <el-radio v-model="sex" label="man">小可爱</el-radio>
              <el-radio v-model="sex" label="lady">小公举</el-radio>
              <el-radio v-model="sex" label="Unknown">保持神秘</el-radio>
            </el-form-item>
            <div v-if="registerType == true">
              <el-form-item label="收款账户" prop="zfbaccount">
                <el-input v-model="user.zfbaccount" placeholder="收款账户(目前仅支持支付宝)"></el-input>
              </el-form-item>
              <el-form-item label="Phone" prop="phonenumber">
                <el-input v-model="user.phonenumber" placeholder="手机号码"></el-input>
              </el-form-item>
              <el-form-item label="e-mail" prop="email">
                <el-input v-model="user.email" placeholder="电子邮箱"></el-input>
              </el-form-item>
              <el-form-item label="专业" prop="skill">
                <el-input v-model="user.skill" placeholder="您是哪方面的专家"></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="success" @click="submitForm('user')">立即注册</el-button>
              <el-button @click="resetForm('user')">重置</el-button>
            </el-form-item>
          </el-form>

        </el-card>
      </el-dialog>
    </el-dialog>

    <el-dialog title="用户登陆" :visible.sync="loginUterVisible" width="30%">
      <el-form :model="user" label-position="left" label-width="18%" ref="user" :rules="rules">
        <el-form-item label="登录名" prop="loginname">
          <el-input v-model="user.loginname"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-button type="success" @click="httpLogin('user')">登陆</el-button>
        <el-button type="success" @click="outerVisible = true">点击注册</el-button>
      </el-form>
    </el-dialog>

    <router-view></router-view>
  </div>
</template>


<script type="text/javascript">
  export default {
    name: 'HelloWorld',
    data() {
      //校验规则相关
      var loginname = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写登陆账号'));
        } else if (value.length < 4) {
          return callback(new Error('登录账户最少4个字符'));
        } else if (value.length > 20) {
          return callback(new Error('登录名不能超过20个字符'));
        } else {
          return callback();
        }
      };

      var password = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写密码'));
        } else if (value.length < 4) {
          return callback(new Error('密码账户最少4个字符'));
        } else if (value.length > 20) {
          return callback(new Error('密码不能超过20个字符'));
        } else {
          return callback();
        }

      };

      var zfbaccountJS = (rule, value, callback) => {//校验收款账号
        if (!value && this.registerType) {
          return callback(new Error('完整注册必须填写收款账号'));
        } else {
          return callback();
        }
      };

      var phonenumber = (rule, value, callback) => {//校验收款账号
        if (!value) {
          return callback();
        } else if (!this.$Const.isInteger(value)) {
          return callback(new Error('请输入数字'));
        } else if (value.length != 11) {
          return callback(new Error('手机号码长度不对'));
        } else {
          return callback();
        }
      };

      return {
        loginUser: null,
        outerVisible: false, //注册外层
        innerVisible: false,//注册内层
        registerTitle: null,
        registerType: false,
        sex: 'Unknown',//性别
        loginState: false,
        loginUterVisible: false,
        user: {
          loginname: null,
          password: null,
          zfbaccount: null,
          phonenumber: null,
          email: null,
          sex: this.sex,
          username: null,
          skill: null,
          detailedRegister: 'simple',
        },
        rules: {//表单校验规则
          loginname: [
            {validator: loginname, trigger: 'blur'}
          ],
          password: [
            {validator: password, trigger: 'blur'}
          ],
          zfbaccount: [
            {validator: zfbaccountJS, trigger: 'blur'}
          ],
          phonenumber: [
            {validator: phonenumber, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      //选择注册类型
      register(Type) {
        this.user = {};
        this.user.sex = 'Unknown';
        this.registerType = Type;
        this.innerVisible = true;
        if (Type) {
          this.registerTitle = "完整注册";
          this.user.detailedRegister = "detailed";
        } else {
          this.registerTitle = "快速注册";
          this.user.detailedRegister = "simple";
        }
      },
      updateLoginState() {
        this.loginState = false;
        this.$Const.localStoreObj.clearUser();
      },
      userHomePage() {
        //     this.$router.push({name :'javaList',path :'/user/homepage'})
        window.open("/user/homepage")
      },

      //提交注册
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.user.sex = this.sex;
            this.$Const.doPost('/user/insertUser', this.user, this.returnSubmitForm)
          } else {
            return false;
          }
        });
      },
      //登陆
      httpLogin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj = {
              loginname: this.user.loginname,
              password: this.user.password,
            }

            this.$Const.doPost('/user/loginUser', obj, this.returnHttpLogin)
          } else {
            return false;
          }
        });
      },

      //登陆成功后回掉
      returnHttpLogin(data) {
        if (data.status == 200) {
          this.loginUterVisible = false;
          this.loginState = true;
          this.$message({
            message: '登陆成功',
            type: 'success'
          });
          //用户信息缓存
          this.user = data.obj;
          this.$Const.localStoreObj.setUser(data.obj);
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }


      },
      //提交注册返回后调用
      returnSubmitForm(data) {
        if (data.status == 200) {
          this.outerVisible = false; //注册外层
          this.innerVisible = false;//注册内层
          this.loginUterVisible = false;
          this.$message({
            message: '恭喜你，注册成功',
            type: 'success'
          });
          this.$Const.localStoreObj.setUser(data.obj);
          this.loginState = true;
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },
      //清空form表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    mounted() {
      this.loginUser = this.$Const.localStoreObj.getUser();
      if (this.loginUser != null)
        this.loginState = true;
    }
  }
</script>
<style scoped>
  .el-header {
    position: absolute;
    position: fixed;
    z-index: 10;
    width: 75%;
    left: 13%;
    top: 0em;
    height: 5em;
  }
</style>
