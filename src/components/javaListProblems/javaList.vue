<template>
  <el-container>
    <el-header  height="13em">
      标题
       </el-header>

    <el-main>
        <el-row>
          <el-col :span="12">
            <el-radio size="mini" v-model="timeCondition" label="Lately">最近的提问</el-radio>
            <el-radio size="mini" v-model="timeCondition" label="earliest">最早的提问</el-radio>
            <el-radio size="mini" v-model="solve" label="noSolved">未解决的问题</el-radio>
            <el-radio size="mini" v-model="solve" label="solved">已解决的问题</el-radio>
          </el-col>

          <el-col :span="8">
            <el-input v-model="textCondition" placeholder="按条件查询(功能暂未实现)" style="width:15em "></el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" icon="el-icon-search" @click="openQuestionPage">发帖提问</el-button>
          </el-col>

        </el-row>

        <el-row>
        <el-col :span="24">
          <div class="problemSize">

            <el-row>
              <el-col :span="3">
                <el-badge :value="200" :max="99" class="item">
                  <el-button size="small">浏览次数</el-button>
                </el-badge>
                  <br/>
                <el-badge style="margin-top: 1em;" :value="200" :max="99" class="item">
                  <el-button size="small">评论次数</el-button>
                </el-badge>
              </el-col>

              <el-col :span="17">
                <span style="font-size:1.3em;"> 标题标题标题标题标题标题标题标题标题标题</span>
                <br/>
                <span style="font-size:0.8em;">帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打帖子内容阿三大苏打</span>
              </el-col>

              <el-col :span="4">
                <el-button size="mini">发起人:{{creator}}</el-button>
                <br/>
                {{creationTime}}
              </el-col>

            </el-row>
          </div>
        </el-col>

          <el-col :span="24">
            <div class="problemSize">
              <el-row>
                <el-col :span="2">浏览</el-col>
                <el-col :span="18">提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问提问</el-col>
                <el-col :span="4">{{creationTime}}</el-col>
              </el-row>
            </div>
          </el-col>

      </el-row>

    </el-main>

    <el-dialog :visible.sync="dialogVisible"  width="80em"  :close-on-press-escape=false :close-on-click-modal=false>
      <el-row>
        <el-col :span="24">
            <el-row :gutter="20" style="margin-bottom:2em;">
            <el-col :span="10" :offset="2">
              <el-input placeholder="请给出具体的标题，以便其他人通过搜索到您更快的回答你" v-model="post.title"> </el-input>
            </el-col>


            <el-col :span="3" :offset="2"><el-tooltip class="item" effect="dark" content="请您慎重选择金额，我们不接受高于50元的打赏金额，具体规则请登陆个人中心查看" placement="top-start"> <el-input-number v-model="post.money"  :min="0.5" :max="50" label="悬赏金额"></el-input-number></el-tooltip></el-col>
          </el-row>

        </el-col>
          <div id='editorElem' style="text-align:left"> </div>

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
  data () {
    return {
      dialogVisible: true,
      visible2: false,
      timeCondition: 'Lately',
      solve: 'noSolved',
      textCondition: '',
      creationTime: '2018-2-21 18:21:34',
      creator: '晨雾',
      editor: null, //  富文本对象
      post: {
        money: '', // 发帖的金额
        editorContent: '', // 发帖内容
        title: '' // 提问帖子的标题
      }
    }
  },
  beforeDestroy () {
    this.destroyEditor()
  },
  methods: {
    openQuestionPage () {
      this.dialogVisible = true
      if (this.editor == null) {
        this.createEditor()
      }
    },

    createEditor () {
      this.editor = new E('#editorElem')
      this.editor.customConfig.uploadImgServer = '/upload'
      this.editor.customConfig.onchange = (html) => {
        this.post.editorContent = html
      }
      this.editor.create()

    },
    sbmitPost () {
      if (this.post.title.length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题'
        })
        // 金额不能为空
      } else if (this.post.money.length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题发帖必须填写金额'
        })
      } else if (this.editor.txt.text().length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题发帖必须填写内容'
        })
      }
      this.postAjax(this.post);
    },
    postAjax (data) {
   var result;
     this.$ajax({
        method: 'post',
        url: 'http://192.168.0.102:9000/text/B',
        data: JSON.stringify(data),
       dataType: "json",
      }).then(function(res){
       result=res.data
     })
       .catch(function(err){
         this.$notify.error({
           title: '警告',
           message: err.message
         })
         console.log(err);
       })
      return result;
    },



    closePost () { // 清空文本
      this.editor.txt.clear()
    }

  },

  mounted () {
    this.dialogVisible = false
  }

}
</script>
<style scoped>
  .el-header {
    background-color: #EBEEF5;
    color: #333;
    text-align: center;
    line-height: 8em;
  }
  .el-main {
    color: #333;
    text-align: center;
    line-height: 2em;
  }
  .problemSize{
    margin-top: 1em;
    border-bottom:1px dashed #000;
  }
</style>
