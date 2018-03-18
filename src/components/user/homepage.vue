<template>
  <el-container >
    <el-header height="18em" style="z-index:2;"></el-header>
    <el-card :body-style="{ padding: '0px' }" class="portrait">
      <div style="padding: 1px;" >
        <img class="shadow" :src=this.$Const.userPortrait+this.user.portrait >
      </div>
    </el-card>
    <div class="mainTop">
      <el-button class="editingInformation" size="mini" round @click="innerVisible = true">编辑资料</el-button>
    </div>
    <el-container style="z-index:2;">
      <el-aside width="19.5em">
      </el-aside>
    <el-main>
      <el-card class="box-card userIntroduce">

          名称  年龄  性别

      </el-card>


      <el-row style="border-bottom:1px dashed #000;" v-for="(item,index) in findMyProblem" :key="index">
        <el-col :span="24" >
          <div style="float: left;margin-top:2em;margin-right: 1.8em;margin-bottom: 1em;  background-color: #D3DCE6;width: 5em;height: 7em;">楼主的头像</div>
          <div class="grid-content">
            <div style="text-align: center;"> <el-button type="text">{{$Const.gxSubstring(item.title,0,80)}}</el-button></div>
            {{$Const.gxSubstring($Const.filterHtml(item.showContent),0,80)}}
          </div>
          <div style="float: right">
            <el-button  size="mini" round>{{$Const.formatDateTime(item.creationtime)}}</el-button><el-button  size="mini" round>{{item.problemstate == 'resolved'?'已解决':'未解决'}}</el-button>  <el-button  size="mini" round>悬赏金额:{{item.money}}</el-button>
          </div>
        </el-col>
      </el-row>

      <el-footer style="text-align: center;margin-top: 2em;"><el-pagination background layout="total,prev, pager, next" :total="totalCount" :pageSize=problem.limit  @current-change="pageSelect"> </el-pagination></el-footer>
    </el-main>
    </el-container>


    <el-dialog width="42em"  title="修改资料" :visible.sync="innerVisible" append-to-body center>
      <!--这里填写内层div信息-->
      <el-card class="box-card" >
        <el-form :model="user" label-position="left" label-width="18%"  ref="user" :rules="rules">
          <el-form-item  label="头像">
              <el-card :body-style="{ padding: '0px' }">
                <el-upload
                  class="upload-demo"
                  :action=$Const.saveUserPortrait
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                  :on-remove="handleRemove"
                  :limit=1
                  :file-list="fileList"
                  :data="user"
                  list-type="picture">
                  <el-button size="small" style="margin-left: 2em;">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过50kb，更换头像请先删除</div>
                </el-upload>
              </el-card>
          </el-form-item>
          <el-form-item label="性别 *" prop="sex">
            <el-radio v-model="user.sex" label="man">小可爱</el-radio>
            <el-radio v-model="user.sex" label="lady">小公举</el-radio>
            <el-radio v-model="user.sex" label="Unknown">保持神秘</el-radio>
          </el-form-item>
            <el-form-item label="Phone" prop="phonenumber">
              <el-input v-model="user.phonenumber" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="e-mail" prop="email">
              <el-input v-model="user.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="username">
              <el-input v-model="user.username" placeholder="不填写将自动生成奇怪的昵称"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="skill">
              <el-input v-model="user.skill" placeholder="您是哪方面的专家"></el-input>
            </el-form-item>
          <el-form-item label="登陆密码 *" prop="password">
            <el-input v-model="user.password" type="password" placeholder="登陆密码"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="success" @click="submitForm('user')">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>




    </el-dialog>


  </el-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      //校验规则相关
      var loginname = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写登陆账号'));
        }else if (value.length < 4) {
          return callback(new Error('登录账户最少4个字符'));
        } else if(value.length > 20){
          return  callback(new Error('登录名不能超过20个字符'));
        }else{
          return callback();
        }

      };

      var password = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写密码'));
        }else if (value.length < 4) {
          return callback(new Error('密码账户最少4个字符'));
        } else if(value.length > 20){
          return  callback(new Error('密码不能超过20个字符'));
        }else{
          return callback();
        }

      };

      var zfbaccountJS = (rule, value, callback) => {//校验收款账号
        if (!value && this.registerType) {
          return callback(new Error('完整注册必须填写收款账号'));
        }else{
          return callback();
        }
      };

      var phonenumber = (rule, value, callback) => {//校验收款账号
        if (!value) {
          return callback();
        }else if(!this.$Const.isInteger(value)){
          return callback(new Error('请输入数字'));
        }else if(value.length!=11){
          return callback(new Error('手机号码长度不对'));
        }else{
          return callback();
        }
      };
      return {
        innerVisible:false,
        findMyProblem: null,
        problems: null,
        totalCount: null,
        problem : { // 查询条件
          creator: this.$Const.localStoreObj.getUser().id, //主键
          page: 1,
          limit: 10
        },
        user : {
          portrait:null,
          phonenumber:null,
          email:null,
          sex:this.sex,
          username:null,
          skill:null,
          detailedRegister:'simple',
        },
        rules: {//表单校验规则
          loginname: [
            { validator: loginname, trigger: 'blur' }
          ],
          password: [
            { validator: password, trigger: 'blur' }
          ],
          phonenumber: [
            {validator: phonenumber, trigger: 'blur'}
          ]
        },
        fileList: []
      }
    },
    methods: {
      //提交修改个人资料
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$Const.doPost('/user/insertUser',this.user,this.returnSubmitForm)
          } else {
            return false;
          }
        });
      },

      //得到与我相关的帖子
      findMyProblemAndReply(data){
        if(data.status==200){
          //初始化与我相关的帖子
          this.findMyProblem=data.obj.list;
          this.totalCount=data.obj.totalCount;
        }else{
          this.$notify.error({
            title: '警告',
            message:data.msg
          })
        }
    },
      //分页查询
      pageSelect(id){
        this.problem.page=id;
        this.$Const.doPost('/iProblem/Problem/findMyProblemAndReply',this.problem,this.findMyProblemAndReply)
      },
      beforeAvatarUpload(file) {
        let isJPG = file.type === 'image/jpeg';
        let isLt2M = file.size / 1024 < 50;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50kb!');
        }
        return isJPG && isLt2M;
      },
      /**
       * 删除图片
       * @param file
       */
      handleRemove(file) {
        this.$Const.doPost('/deleteFile/user/portrait',{id:this.user.id,portrait:file.response},this.deleteFile)
      },
      deleteFile(data){
        if(data.status==200){
        }else{
          this.$notify.error({
            title: '警告',
            message:data.msg
          })
        }
      },
      /**
       * 上传成功
      * @param res
       * @param file
       */
      handleAvatarSuccess(res, file) {
       // this.imageUrl = URL.createObjectURL(file.raw);
        this.user.portrait=file.response;
      },
      /**
       * 修改个人资料
       */
      returnSubmitForm(data){
        if(data.status==200){
          this.$message({
            message: '修改资料成功',
            type: 'success'
          });
          this.innerVisible = false;
        }else {
          this.$notify.error({
            title: '警告',
            message:data.msg
          })
        }
      }
    },
    mounted() {
      this.user=this.$Const.localStoreObj.getUser();
      this.fileList.push({name: '头像', url:this.$Const.userPortrait+this.user.portrait});
      if(this.problem.creator!=null)
        this.$Const.doPost('/iProblem/Problem/findMyProblemAndReply',this.problem,this.findMyProblemAndReply)
    }
  }
</script>

<style scoped>
  .el-header{
    width:100%;
    background-image: url('../../assets/images/background.jpg');
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    width:10%;
    background-image: url('../../assets/images/fpic10256.jpg');
    background-repeat:no-repeat;
    background-position:top;
  }
  .el-main {
    color: #333;
    text-align: left;
  }
  .userIntroduce{
    height: 8em;
    width:100%;
    background-image: url('../../assets/images/xpic7673.jpg');
  }
  .grid-content {
    margin-top: 1em;
    min-height: 5em;
  }
.editingInformation{
  margin-left: -42em;
  margin-top: 0.5em;
  margin-bottom: 0.7em;
}
  .background{
    z-index:1;
    width:100%;
    height: 100%;
    left:0px;
    top:0px;
    position: fixed;
    background-size:100%;
    background-image: url('../../assets/images/background.jpg');
  }
.portrait{
  z-index:10;
  left:24%;
  top:24%;
  position:absolute;
}
  img.shadow{
    margin-top: 0.3em;
    height:8em;
    width: 7em;
  }
</style>
