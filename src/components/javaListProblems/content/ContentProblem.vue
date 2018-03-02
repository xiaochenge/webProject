<template>

  <el-container>
    <div style="margin-top: 5em">
          <el-row><!-- 这一列为作者提问 -->
          <el-col :span="24">
            <div style="min-height: 15em; min-width:70em;">

                <div style="min-height: 1.5em;border-bottom:1px solid #000; ">
                  <div class="tiezibiaoti" >
                    <h4 >这个问题问的ask来得及ask来得及爱睡懒觉非流动快速减肥dasdask来得及克拉斯积分这
                    </h4>
                  </div>
                </div>

              <div style="background-color:#F5F8FB;">
              <el-row>
                  <el-col :span="4" >
                    <div style="min-height: 15em;margin-top: 1.3em;">
                      <img class="shadow" src="../../../assets/images/touxiang.jpg" />
                      <div style="margin-top: 1.5em;">
                         楼主
                      </div>
                      <div style="margin-top: 1em;">
                        昵称 : 阿萨大爱
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="20" style="background-color:#F5F8FB;border-left:1px solid #C3DFFC;">
                    <div  :id="data.id" v-html="data.showContent" style="min-height: 15em;">

                    </div>
                    <img src="../../../assets/images/resolved.png" />
                  </el-col>
              </el-row>
              </div>
            </div>
          </el-col>
          <!-- 这一列回答，此处需要循环和分页 -->
          <el-col :span="24" v-for="(item, index) in data.problemreplys" :key="index">
            <div class="huifutou">
              <div style="padding-bottom: 0.2em;padding-top: 0.2em;min-height: 1.5em;">
                <div>

                <el-button  type="success" size="mini" plain @click="Adopt()">采纳</el-button>
                <el-button  type="success" size="mini" plain @click="">公开</el-button>
                <el-button type="success" size="mini" plain @click="">点赞</el-button>
                </div>
              </div>
            </div>
            <el-col :span="24">
              <div class="huifuti">
                <el-col :span="24">

                </el-col>
                <el-row>
                  <el-col :span="4" >
                    <div style="min-height: 15em;margin-top: 2em;">
                      <img class="shadow" src="../../../assets/images/touxiang.jpg" />
                    {{item.creator}}
                      <div style="margin-top: 1em;">
                        昵称 : 阿萨大爱
                      </div>
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
        <div id="div4" style="min-height:15em; padding:1em;border:0.5em solid #96c2f1; background:#eff7ff; text-align:left;"> <!--可使用 min-height 实现编辑区域自动增加高度-->
          <p>请输入内容</p>
        </div>

    </div>

  </el-container>
</template>


<script type="text/javascript">
  import E from 'wangeditor'
  export default {
    data() {
      return {
        user : null,
        visible2:true,
        editorMain: null,
        editorReply:null,
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

      }
    },
    methods : {

      createReplyEditor () {
        this.editorReply = new E('#div3','#div4')
        this.editorReply.customConfig.uploadImgServer = '/upload'
        this.editorReply.create()
      },
      //进入页面初始化数据
      initProblem(data){
        if(data.status==200){
        this.data=data.obj;
        }else{
          this.$notify.error({
            title: '警告',
            message:data.msg
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
            message:data.msg
          })
        }
      },

      closePost () { // 清空文本
        this.editorReply.txt.clear()
      },
      sbmitReplyPost (data) {//提交回复
        if(data.status==200){
        this.data.problemreplys.push({
          id:data.obj,
          showContent:this.problemreply.showContent,
        })
       this.closePost();
      }else{
          this.$notify.error({
            title: '警告',
            message:data.msg
          })
        }
      },

      //采纳本条回复
      Adopt (){
        if(!this.$Const.isLogin()){
          this.$notify.error({
            title: '警告',
            message:"请您先点击右上角登陆"
          })
          return;
        }

        if(this.data.creator != this.$Const.localStoreObj.getUser().id){
          this.$notify.error({
            title: '警告',
            message:"只有楼主才能采纳"
          })
          return;
        }
        this.$Const.doPost('iProblem/Problem/saveProblemreply',this.problemreply,this.sbmitReplyPost)
      },

    },
    mounted () {
      this.dialogVisible=false
      this.createReplyEditor();
      this.problemreply.problemId=this.$Const.localStoreObj.getVal('problemId')
      this.$Const.doPost('iProblem/Problem/findByProblemId',{id:this.problemreply.problemId},this.initProblem)
      this.user=this.$Const.localStoreObj.getUser();
    },

  }

</script>

<style>
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
   min-height: 15em;
   background-color:#F5F8FB;
   border-top:1px solid #C3DFFC;
   border-left:1px solid #C3DFFC;
   border-right:1px solid #C3DFFC;
 }
.tiezibiaoti{
  margin-top:1em;
  line-height: 1.5em;
}
.ziti{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}


</style>
