<template>

  <el-container>
    <div style="margin-top: 5em">
      <el-row><!-- 这一列为作者提问 -->
        <el-col :span="24">
          <div style="min-height: 15em; min-width:70em;">

            <div style="min-height: 1.5em;border-bottom:1px solid #000; ">
              <div class="tiezibiaoti">
                <h4>{{data.title}}
                </h4>
              </div>
            </div>

            <div style="background-color:#F5F8FB;">
              <el-row>
                <el-col :span="4">
                  <div style="min-height: 15em;margin-top: 1.3em;">
                    <img class="shadow" src="../../../assets/images/touxiang.jpg"/>
                    <div style="margin-top: 1.5em;">
                      楼主
                    </div>
                    <div style="margin-top: 1em;">
                      昵称 : {{data.creatorName}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="20" style="background-color:#F5F8FB;border-left:1px solid #C3DFFC;">
                  <div :id="data.id" v-html="data.showContent" style="min-height: 15em;">
                  </div>
                  <div v-if="data.problemstate == 'resolved'">
                    <img style="display:inline-block;" src="../../../assets/images/resolved.png"/>
                    <div style="float: right; margin-right: 0.7em;position: relative;top: 2em; "><a href="#go">
                      <el-button>回复问题</el-button>
                    </a></div>
                  </div>
                  <div v-else>
                    <img style="display:inline-block;" src="../../../assets/images/unsolved.png"/>
                    <div style="float: right; margin-right: 0.7em;position: relative;top: 2em; "><a href="#go">
                      <el-button>回复问题</el-button>
                    </a></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <!-- 这一列回答，此处需要循环和分页 -->
        <el-col :span="24" v-for="(item, index) in data.problemreplys" :key="index">
          <div class="huifutou">
            <div style="padding-bottom: 0.2em;padding-top: 0.2em;min-height: 1.5em;padding-left: 10em">
              <div>
                <el-button v-if="data.problemstate != 'resolved'" type="success" size="mini" plain
                           @click="Adopt(item.id)">采纳
                </el-button>
                <el-badge :value="item.supportNumber" class="item">
                  <el-button type="success" size="mini" plain @click="SupportReply(item.id,item.supportNumber++)">点赞
                  </el-button>
                </el-badge>
              </div>
            </div>
          </div>
          <el-col :span="24">
            <div class="huifuti">
              <el-col :span="24">

              </el-col>
              <el-row>
                <el-col :span="4">
                  <div style="min-height: 15em;margin-top: 2em;">
                    <img class="shadow" src="../../../assets/images/touxiang.jpg"/>
                    <div style="margin-top: 1em;">
                      昵称 : {{item.creatorName}}
                    </div>
                  </div>
                </el-col>
                <el-col :span="20" style="border-left:1px dashed #000;">

                  <div
                    style="min-height: 15em;line-height: 1.6em;  background-color:#F5F8FB; border-bottom:1px solid #C3DFFC;">
                    &nbsp;<span :id="item.id" v-html="item.showContent"></span>
                  </div>

                  <div v-for="(replys, ind) in item.problemreplyList" :key="ind" style="font-size:0.75em;">
                    <div>
                      <span style="float: left;margin-left: 1.5em;margin-top: 0.6em;">{{replys.creatorName}} ：</span>
                      <div style="line-height: 1.8em;"><span style="float: left;margin-left: 1.5em;margin-top: 0.6em;">{{replys.showContent}}</span>
                        <div style="text-align:right"> {{$Const.formatDateTime(replys.createTime)}}
                          <el-badge :value="replys.supportNumber" class="item">
                            <el-button size="mini" style="margin-bottom: 0.5em;margin-right:1em;margin-top: 0.6em;"
                                       round @click="SupportReply(replys.id),replys.supportNumber++"> 点赞
                            </el-button>
                          </el-badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="huifu">
                    <el-button size="mini" round @click=" openhuifu(item)">我来说一句</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-col>
      </el-row>

      <div v-if="data.problemreplys.length > 0">
        <el-footer>
          <el-pagination layout="prev, pager, next, jumper" :total="problem.problemreplys.length"
                         :pageSize=problem.pageSize @current-change="pageSelect"></el-pagination>
        </el-footer>
      </div>

      <div v-else style="margin-left:auto;margin-right:auto">
        <el-alert
          title="暂无数据"
          :closable="false"
          center
          type="info">
        </el-alert>
      </div>
      <el-button @click="sbmitPost" type="primary" style="float:left;height: 2rem;"><span style="margin-bottom: 2rem;">提交回复</span>
      </el-button>
      <div id="div3">
      </div>
      <a name="go"></a>
    </div>
    <el-dialog
      :title="huifuTitle"
      :visible.sync="dialogVisible1"
      width="30%"
      top="20em">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入要回复的内容"
        v-model="reply.showContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1 = false">取 消</el-button>
                        <el-button type="primary" @click="handleSubmit">确 定</el-button>
                      </span>
    </el-dialog>
  </el-container>
</template>

<script type="text/javascript">
  import E from 'wangeditor'

  export default {
    data() {
      return {
        dialogVisible1: false,
        user: null,
        visible2: true,
        editorMain: null,
        editorReply: null,
        post: {//提交回复表单
        },
        data: {//要展示的数据
          title: null,  //  标题
          creatorName: null,  //楼主名称
          showContent: null,  //内容
          creator: null,     // 楼主id
          problemreplys: [],
          problemstate: null
        },
        problemreply: {//提交回复
          id: null,  //主键
          problemId: null,  //帖子id
          parent: null,   //此回复的父id
          showContent: null,  //回复的内容
          creator: null, //登陆idnull
        },
        huifuTitle: '回复',
        reply: {
          showContent: null,//楼中楼回复的类容
          problemid: null,//主帖id
          parent: null,//上级评论id
          creator: null//创建者
        },
        //分页对象
        problem: {
          problemreplys: [],
          pageSize: 5,
        },
      }
    },
    methods: {
      //分页
      pageSelect(id) {
        let slice = this.$Const.pagePaging(this.problem.problemreplys, id, this.problem.pageSize);
        this.data.problemreplys = slice;
      },

      createReplyEditor() {
        this.editorReply = new E('#div3');
        this.editorReply.create()
      },
      //进入页面初始化数据
      initProblem(data) {
        if (data.status == 200) {
          this.problem.problemreplys = data.obj.problemreplys;
          this.data.showContent = data.obj.showContent;
          this.data.title = data.obj.title;
          this.data.creatorName = data.obj.creatorName;
          this.data.creator = data.obj.creator;
          this.data.problemstate = data.obj.problemstate;
          this.pageSelect(1);
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },
      //提交回复
      sbmitPost() {
        var html = this.editorReply.txt.html();
        var str1 = this.$Const.nonEmpty(html);
        var str2 = this.$Const.nonEmpty(this.problemreply.problemId)
        if (str1 && str2 && this.$Const.isLogin()) {
          this.problemreply.showContent = html;
          this.problemreply.creator = this.$Const.localStoreObj.getUser().id;
          this.$Const.doPost('iProblem/Problem/saveProblemreply', this.problemreply, this.sbmitReplyPost)
        } else {
          this.$notify.error({
            title: '警告',
            message: '请您填写回复内容或者先登陆再进行回复'
          })
        }
      },

      closePost() { // 清空文本
        this.editorReply.txt.clear()
      },
      sbmitReplyPost(data) {//提交回复
        if (data.status == 200) {
          this.data.problemreplys.push({
            id: data.obj,
            creator: this.user.id,
            showContent: this.problemreply.showContent,
            problemreplyList: new Array(),
            creatorName: this.$Const.localStoreObj.getUser().username,
            supportNumber: 0,
          });
          this.$message({
            message: '成功回复',
            type: 'success'
          });
          this.closePost();
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },

      //采纳本条回复
      Adopt(id) {
        if (!this.$Const.isLogin()) {
          this.$notify.error({
            title: '警告',
            message: "请您先点击右上角登陆"
          })
          return;
        }
        if (this.data.creator != this.$Const.localStoreObj.getUser().id) {
          this.$notify.error({
            title: '警告',
            message: "只有楼主才能采纳"
          })
          return;
        }
        let param = {
          id: id,
          problemId: this.problemreply.problemId,  //帖子id
          problemUserId: this.data.creator,
          creator: this.problemreply.creator,
        }
        this.$Const.doPost('iProblem/Problem/saveReplyAdopt', param, this.AdoptSuccess)
      },

      AdoptSuccess(data) {
        if (data.status == 200) {
          this.$message({
            message: '以成功采纳此回复',
            type: 'success'
          });
          this.data.problemstate = 'resolved';
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }

      },
      /**
       * 点赞某条回复
       * @constructor
       */
      SupportReply(id) {
        this.$Const.doPost('iProblem/Problem/SupportReply', {'id': id}, this.returnSupportReply)
      },

      /**
       * 点赞成功回调
       */
      returnSupportReply(data) {
        if (data.status == 200) {
          this.$message({
            message: '感谢您的点赞支持',
            type: 'success'
          });
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },
      //提交楼中楼回复
      handleSubmit() {
        this.$Const.doPost('iProblem/Problem/saveProblemreply', this.reply, this.returnHandleSubmit)
      },

      //提交楼中楼回复,提交成功
      returnHandleSubmit(data) {
        if (data.status == 200) {
          this.dialogVisible1 = false;
          this.$message({
            message: '成功回复',
            type: 'success'
          });
          let problemreplys = this.data.problemreplys;
          for (let i = 0; i < problemreplys.length; i++) {
            if (problemreplys[i].id == this.reply.parent) {
              if (problemreplys[i].problemreplyList == undefined)
                problemreplys[i]['problemreplyList'] = new Array();
              problemreplys[i].problemreplyList.push({
                id: data.obj,
                creatorName: this.user.username,
                showContent: this.reply.showContent,//楼中楼回复的类容
                problemid: this.problemreply.problemId,//主帖id
                createTime: new Date(),
                parent: this.reply.parent,//上级评论id
                creator: this.user.id,//创建者
                supportNumber: 0
              });
            }
          }
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },

      //打开回复的面板
      openhuifu(id) {
        this.reply.problemId = this.problemreply.problemId;
        this.reply.parent = id.id;//上级评论id
        this.reply.creator = this.user.id;
        this.dialogVisible1 = true;
      }

    },
    mounted() {
      this.dialogVisible = false
      this.createReplyEditor();
      this.problemreply.problemId = Number.parseInt(this.$route.query.problemId);
      this.$Const.doPost('iProblem/Problem/findByProblemId', {id: this.problemreply.problemId}, this.initProblem)
      this.user = this.$Const.localStoreObj.getUser();
    }
  }

</script>

<style scoped>
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
    height: 8em;
    width: 5em;
  }

  .huifutou {
    border-top: 1px solid #C3DFFC;
    border-left: 1px solid #C3DFFC;
    border-right: 1px solid #C3DFFC;
  }

  .huifuti {
    min-height: 15em;
    background-color: #F5F8FB;
    border-top: 1px solid #C3DFFC;
    border-left: 1px solid #C3DFFC;
    border-right: 1px solid #C3DFFC;
  }

  .tiezibiaoti {
    margin-top: 1em;
    line-height: 1.5em;
  }

  .huifu {
    text-align: right;
    margin-right: 0.3em;
    margin-bottom: 0.3em;
    margin-top: 0.3em;
  }

</style>
