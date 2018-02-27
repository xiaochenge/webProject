<template>

  <el-container>
    <el-header height="5em">
      <el-card class="box-card">
      <el-button-group style="float: left; padding-bottom: 1em; padding-top:0.7em; padding-left:9em;">
        <el-button type="primary" icon="el-icon-arrow-left">返回</el-button>
      </el-button-group>
      <div style="float: right; padding-top:0.7em; padding-bottom: 1em; padding-right: 3em"><el-button    type="success"  plain  @click="outerVisible = true">点击注册</el-button></div>
      </el-card>
    </el-header>
    <div style="margin-top: 5em">
      <el-main>

        <el-row><!-- 这一列为作者提问 -->
          <el-col :span="24">
            <div style="min-height: 15em; background-color:#F5F8FB;">
              <el-col :span="2">
                <div style=" font-size:8px">查看:321</div>
              </el-col>
              <el-col :span="2">
                <div style="font-size:8px">查看:321</div>
              </el-col>
              <el-col :span="24">
                <div style="border-bottom:1px solid #000;margin-top:-0.7em;  ">
                  此处暂时放标题
                </div>
              </el-col>
              <el-row>
                  <el-col :span="4" >
                    <div style="min-height: 15em;">
                      <img class="shadow" src="../../../assets/images/touxiang.jpg" />

                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div  :id="data.id" v-html="data.showContent">
                    </div>
                  </el-col>
              </el-row>

            </div>
          </el-col>
          <!-- 这一列回答，此处需要循环和分页 -->
          <el-col :span="24" v-for="(item, index) in data.problemreplys" :key="index">
            <div class="huifutou">
              <div style="padding-bottom: 0.2em;padding-top: 0.2em">
                <el-button type="success" size="mini" plain @click="text">采纳</el-button>
                <el-button type="success" size="mini" plain @click="text">公开</el-button>
                <el-button type="success" size="mini" plain @click="text">打赏</el-button>
              </div>
            </div>
            <el-col :span="24">
              <div class="huifuti">
                <el-col :span="24">

                </el-col>
                <el-row>
                  <el-col :span="4" >
                    <div style="min-height: 15em;">
                      <img class="shadow" src="../../../assets/images/touxiang.jpg" />
                    {{item.creator}}
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div style="border-left:1px dashed #000; min-height: 15em;">
                      <div :id="item.id" v-html="item.showContent"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-col>

        </el-row>

        <div id="div3" class="toolbar " >
          <el-button @click="sbmitPost" type="primary">提交回复</el-button>
        </div>
        <div style="padding: 5px 0; color: #ccc"></div>
        <div id="div4" style="min-height:15em; padding:1em;border:0.5em solid #96c2f1;background:#eff7ff"> <!--可使用 min-height 实现编辑区域自动增加高度-->
          <p>请输入内容</p>
        </div>

      </el-main>
    </div>
    <el-footer>
    </el-footer>
    <el-dialog title="注册" width="20%" :visible.sync="outerVisible">

      <el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body>
        <!--这里填写内层div信息-->
        <el-card class="box-card">
          <el-form :model="user" label-position="left" label-width="18%" :rules="rules" ref="user">
            <el-form-item label="登录名 *" prop="loginname">
              <el-input v-model="user.loginname" placeholder="登陆名"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码 *" prop="password">
              <el-input v-model="user.password" placeholder="登陆密码"></el-input>
            </el-form-item>
            <el-form-item label="sex *">
              <el-radio v-model="user.sex" label="lady">小可爱</el-radio>
              <el-radio v-model="user.sex" label="man">小公举</el-radio>
              <el-radio v-model="user.sex" label="Unknown">未知</el-radio>
            </el-form-item>
            <div>
              <el-form-item label="收款账户">
                <el-input v-model="user.zfbaccount" placeholder="收款账户(目前仅支持支付宝)"></el-input>
              </el-form-item>
            <el-form-item label="Phone">
              <el-input v-model="user.phonenumber" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item label="e-mail">
              <el-input v-model="user.email" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="user.username" placeholder="不填写将自动生成奇怪的昵称"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="user.skill" placeholder="您是哪方面的专家"></el-input>
            </el-form-item>
              <el-form-item >
                <el-button type="success" @click="submitForm('user')">立即注册</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </div>
          </el-form>

        </el-card>

      </el-dialog>
      <el-tooltip class="item" effect="dark" content="快速注册仅保存登陆相关信息，不能回帖" placement="top">
        <el-button type="success" @click="innerVisible = true">快速注册</el-button>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="请注意填写收款账号，参与回帖一旦采纳赏金直接打入您的账户" placement="top">
        <el-button type="success" @click="innerVisible = true">完整注册</el-button>
      </el-tooltip>

    </el-dialog>
  </el-container>
</template>


<script type="text/javascript">
  import E from 'wangeditor'
  export default {
    data() {
      //校验规则相关
      var loginname = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写登陆账号'));
        }
        setTimeout(() => {
            if (value.length < 4) {
              callback(new Error('登录账户最少4个字符'));
            } else if(value.length > 20){
              callback(new Error('登录名不能超过20个字符'));
            }else{
              callback();
            }
        }, 1000);
      };

      var password = (rule, value, callback) => {//用户名校验
        if (!value) {
          return callback(new Error('必须填写密码'));
        }
        setTimeout(() => {
          if (value.length < 4) {
            callback(new Error('密码账户最少4个字符'));
          } else if(value.length > 20){
            callback(new Error('密码不能超过20个字符'));
          }else{
            callback();
          }
        }, 1000);
      };

      return {
        rules: {//表单校验规则
          loginname: [
            { validator: loginname, trigger: 'blur' }
          ],
          password: [
            { validator: password, trigger: 'blur' }
          ]
        },


        visible2:true,
        editorMain: null,
        editorReply:null,
        outerVisible:true, //注册外层
        innerVisible:false,//注册内层
        post:{//提交回复表单

        },
        data:{//要展示的数据
          showContent:null,
          problemreplys:[],
        },
        problemreply :{//提交回复
          id:null,  //主键
          problemId:null,  //帖子id
          parent:null,   //此回复的父id
          showContent:null,  //回复的内容
        },
        user : {
          loginname:null,
          password:null,
          sex:null,
          zfbaccount:null,
          phonenumber:null,
          email:null,
          username:null,
          skill:null,
        }
      }
    },
    methods : {
      createReplyEditor () {
        this.editorReply = new E('#div3','#div4')
        this.editorReply.customConfig.uploadImgServer = '/upload'
        this.editorReply.create()
      },
      //进入页面初始化数据
      initProblem(stats,data){
        if(stats==200){
        this.data=data;
        }else{
          this.$notify.error({
            title: '警告',
            message: '获取失败请联系管理员'
          })
        }
      },
      //提交回复
      sbmitPost () {
        var html=this.editorReply.txt.html();
        var str1= this.$Const.nonEmpty(html);
        var str2= this.$Const.nonEmpty(this.problemreply.problemId)
        if(str1 && str2){
          this.problemreply.showContent=html;
          this.$Const.doPost('iProblem/Problem/saveProblemreply',this.problemreply,this.sbmitReplyPost)
        }else{
          this.$notify.error({
            title: '警告',
            message: '内部错误，请联系管理员'
          })
        }
      },

      closePost () { // 清空文本
        this.editorReply.txt.clear()
      },
      sbmitReplyPost (stats,data) {//提交回复
        this.data.problemreplys.push({
          id:data,
          showContent:this.problemreply.showContent,
        })
       this.closePost();
      },
      submitForm(formName) {
        this.$Const.doPost('/user/insertUser',this.user)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$Const.doPost('/user/insertUser',this.user)
          } else {
            return false;
          }
        });
      },
      text(){

      },
      resetForm(formName) {

      },


    },
    mounted () {
      this.dialogVisible=false
      this.createReplyEditor();
      this.problemreply.problemId=this.$Const.localStoreObj.getVal('problemId')
      this.$Const.doPost('iProblem/Problem/findByProblemId',{id:this.problemreply.problemId},this.initProblem)
    },

  }

</script>

<style>
  .el-header {
    position: absolute;
    position:fixed;
    z-index:10;
    width: 90%;
    left: 5%;
    top: 0em;
  }
  .el-main {
    color: #333;
    text-align: center;
    line-height: 1em;
  }
  .el-row {
    margin-bottom: 1em;
  }
  .el-col {
    border-radius: 1em;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .grid-content {
    border-radius: 1em;
    min-height: 1em;
  }
  img.shadow {
    margin-top: 0.3em;
    height:8em;
    width: 5em;
  }
 .huifutou{
   border-top:1px solid #C3DFFC;
   border-left:1px solid #C3DFFC;
   border-right:1px solid #C3DFFC;
 }
 .huifuti{
   min-height: 15em; background-color:#F5F8FB;
   border-top:1px solid #C3DFFC;
   border-left:1px solid #C3DFFC;
   border-right:1px solid #C3DFFC;
 }




</style>
