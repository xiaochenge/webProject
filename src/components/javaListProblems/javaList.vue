<template>
  <el-container>
    <div class="mainheight" style="margin-top: 5em;width: 80em;" v-loading.fullscreen.lock="fullscreenLoading">
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="problem.problemstate" @change="changeProblemState()">
            <el-radio size="mini" label="Unsolved">未解决的问题</el-radio>
            <el-radio size="mini" label="resolved">已解决的问题</el-radio>
          </el-radio-group>
        </el-col>

        <el-col :span="8" style=" margin-bottom:0.2em;">
          <!--<el-input v-model="textCondition" placeholder="按条件查询(功能暂未实现)" style="width:15em "></el-input>-->

        </el-col>

        <el-col :span="4" style=" margin-bottom:1em;">
          <el-button type="primary" icon="el-icon-search" @click="openQuestionPage">发帖提问</el-button>
        </el-col>

      </el-row>

      <el-row>
        <el-col class="background" :span="24" v-for="(item,index) in problems" :key="index">
          <div class="problemSize" style="min-width:70em;">

            <el-row>
              <el-col :span="3">
                <el-badge :value="item.viewingtimes == null ? 0 : item.viewingtimes" :max="99" class="item">
                  <el-button size="small">浏览次数</el-button>
                </el-badge>

                <el-badge style="margin-top: 0.3em; margin-bottom:0.2em;" :value=item.numberComments :max="99"
                          class="item">
                  <el-button size="small">评论次数</el-button>
                </el-badge>
              </el-col>
              <div @click="openProblem(item.id)">
                <el-col :span="17">
                  <span style="font-size:1.3em;">{{item.title}}</span>
                  <br/>
                  <br/>
                  <span style="font-size:0.9em;"
                        v-html=$Const.gxSubstring($Const.filterHtml(item.showContent),0,100)></span>
                </el-col>

                <el-col :span="4">
                  <!--<el-tooltip class="item" effect="dark" :content="item.creator+''" placement="top-start">-->
                  <el-button size="mini">发帖人: {{$Const.gxSubstring(item.creatorName,0,6)}}</el-button>
                  <!--</el-tooltip>-->
                  <br/>
                  <div style="font-size:1.05em; margin-top:0.5em;">{{$Const.formatDateTime(item.createTime)}}</div>
                </el-col>
              </div>
            </el-row>
          </div>
        </el-col>

      </el-row>
      <div v-if="totalCount > 0">
        <el-footer style="margin-top: 2em;">
          <el-pagination background layout="total,prev, pager, next" :total="totalCount" :pageSize="problem.limit"
                         @current-change="pageSelect"></el-pagination>
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
    </div>

    <el-dialog :visible.sync="dialogVisible" width="80em" :close-on-press-escape=false :close-on-click-modal=false>
      <el-row>
        <el-col :span="24">
          <el-row :gutter="20" style="margin-bottom:2em;">
            <el-col :span="10" :offset="2">
              <el-input placeholder="请给出具体的标题，以便其他人通过搜索到您更快的回答你" v-model="post.title"></el-input>
            </el-col>
            <el-col :span="3" :offset="2">
              <el-tooltip class="item" effect="dark" content="请您慎重选择金额，我们不接受高于50元的打赏金额，具体规则请登陆个人中心查看"
                          placement="top-start">
                <el-input-number v-model="post.money" :min="0.2" :max="50" label="悬赏金额"></el-input-number>
              </el-tooltip>
            </el-col>
          </el-row>

        </el-col>
        <div id="div1">
        </div>

        <el-row>
          <el-col :span="24">
            <el-popover
              ref="popover5"
              placement="top"
              width="160"
              v-model="visible2">
              <p>请注意，一旦您发起求助帖子，有超过60字的回复，您的求助帖将无法修改</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="sbmitPost">确定</el-button>
              </div>
            </el-popover>
            <el-button type="primary" style="margin-top:1em;" v-popover:popover5>提交帖子</el-button>

            <el-button type="danger" style="margin-top:1em;" @click="closePost">清空文本</el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-dialog>
  </el-container>
</template>

<script type="text/javascript">
  import E from 'wangeditor'

  export default {
    name: 'HelloWorld',
    data() {
      return {
        fullscreenLoading: false,
        dialogVisible: true,
        visible2: false,
        textCondition: null,
        editor: null, //  富文本对象
        post: {
          money: null, // 发帖的金额
          showContent: null, // 发帖内容
          title: null, // 提问帖子的标题
          creator: null, //发帖人
          problemType: 'Servlet'
        },
        problem: { // 查询条件
          id: null, //主键
          problemstate: 'Unsolved', //是否解决
          page: 1,
          limit: 10
        },
        problems: null,//帖子集合
        totalCount: null//总记录数
      }
    },
    methods: {
      openQuestionPage() {
        //先判断是否登陆
        if (this.$Const.isLogin()) {
          this.dialogVisible = true
          if (this.editor == null) {
            this.createEditor()
          }

        } else {
          this.$message({
            message: '登陆后才能发帖，登陆按钮在右上角',
            type: 'warning'
          });
        }
      },

      createEditor() {
        this.editor = new E('#div1');
        this.editor.customConfig.onchange = (html) => {
          this.post.showContent = html
        }
        this.editor.create();
      },
      sbmitPost() {
        var result = true;
        if (this.post.title == null) {
          this.$message({
            message: '发帖必须填写标题',
            type: 'warning'
          });
          result = false
          // 金额不能为空
        } else if (this.post.money.length == 0) {
          this.$message({
            message: '发帖必须填写标题发帖必须填写金额',
            type: 'warning'
          });
          result = false
        } else if (this.editor.txt.text().length < 4) {
          this.$message({
            message: '您发表的帖子过短',
            type: 'warning'
          });
          result = false
        }
        if (result) {
          let user = this.$Const.localStoreObj.getUser()
          this.post.creator = user.id;
          this.$Const.doPost('iProblem/insert/Problem', this.post, this.returnSbmitPost)
        }
      },
      closePost() { // 清空文本
        this.editor.txt.clear()
      },
      shouProblem(data) {
        this.fullscreenLoading = false;
        if (data.status == 200) {
          this.problems = data.obj.list;
          this.totalCount = data.obj.total;
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }
      },
      returnSbmitPost(data) {
        if (data.status == 200) {
          this.visible2 = false;
          this.dialogVisible = false;
          this.$message({
            message: '发帖成功',
            type: 'success'
          });
          if (this.problems.length > 0) {
            this.problems.splice(0, 0, {
              id: data.obj,
              title: this.post.title,
              createTime: new Date(),
              viewingtimes: 0,
              numberComments: 0,
              showContent: this.post.showContent,
              money: this.post.money,
              creator: this.$Const.localStoreObj.getUser().username
            })
          } else {
            this.problems.push({
              id: data.obj,
              title: this.post.title,
              creationtime: new Date().getTime(),
              showContent: this.post.showContent,
              money: this.post.money,
              creator: this.$Const.localStoreObj.getUser().username
            })
          }
        } else {
          this.$notify.error({
            title: '警告',
            message: data.msg
          })
        }

      },
      openProblem(problemId) {
        this.$router.push({
          name: 'problemId',
          query: {problemId: problemId}
        })
      },
      pageSelect(page) {
        this.problem.page = page;
        this.initSelect();
      },
      initSelect() {
        this.$Const.doPost('iProblem/selectAll/Problem', this.problem, this.shouProblem)
      },
      changeProblemState() {
        this.problem.page = 1;
        this.initSelect();
      }
    },
    mounted() {
      this.fullscreenLoading = true;
      this.dialogVisible = false
      this.initSelect();
    }
  }
</script>
<style scoped>
  .problemSize {
    margin-top: 0.5em;
    border-bottom: 1px dashed #000;
  }

  .mainheight {
    height: 42em;
  }

  .background:hover {
    background-color: #F2F6FC;
    cursor: pointer;
  }
</style>
