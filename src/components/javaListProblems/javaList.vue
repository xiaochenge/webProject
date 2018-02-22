<template>
  <el-container>
    <el-header  height="5em">
      标题
       </el-header>

    <el-main>
      <div class="mainheight">
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
        <el-col :span="24" v-for="item in problems">
          <div class="problemSize">

            <el-row>
              <el-col :span="3">
                <el-badge :value="item.viewingtimes" :max="99" class="item">
                  <el-button size="small">浏览次数</el-button>
                </el-badge>
                  <br/>
                <el-badge style="margin-top: 0.3em; margin-bottom: 0.2em;" :value="200" :max="99" class="item">
                  <el-button size="small">评论次数</el-button>
                </el-badge>
              </el-col>

              <el-col :span="17">
                <span style="font-size:1.05em;">{{item.title}}</span>
                <br/>
                <span style="font-size:0.8em;">{{filterHtml(item.showContent) }}</span>
              </el-col>

              <el-col :span="4">
                发起人: <el-button size="mini" :value="item.creator">阿三大苏打撒</el-button>
                <br/>
                1293-22-32 12:32:21
              </el-col>
            </el-row>
          </div>
        </el-col>

      </el-row>
      </div>
    </el-main>
    <el-footer><el-pagination background layout="prev, pager, next" :total="1000"> </el-pagination></el-footer>
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
      editor: null, //  富文本对象
      post: {
        money: '', // 发帖的金额
        showContent: '', // 发帖内容
        title: '' // 提问帖子的标题
      },
      problems:null
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
        this.post.showContent = html
      }
      this.editor.create()

    },
    sbmitPost () {
      var result=true;
      if (this.post.title.length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题'
        })
        result = false
        // 金额不能为空
      } else if (this.post.money.length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题发帖必须填写金额'
        })
        result = false
      } else if (this.editor.txt.text().length === 0) {
        this.$notify.error({
          title: '警告',
          message: '发帖必须填写标题发帖必须填写内容'
        })
        result = false
      }
      if(result){
      this.postAjax(this.post,'iProblem/insert/Problem');
      }
    },
    postAjax (data,url,callback) {
   var result;
     this.$ajax({
        method: 'post',
        url: 'http://192.168.0.102:9000/'+url,
        data: JSON.stringify(data),
       dataType: "json",
       async:false,
      }).then(function(res){
       callback(res.data)
     }).catch(function(err){

       })
    },
    closePost () { // 清空文本
      this.editor.txt.clear()
    },
    shouProblem(data){
      this.problems=data.list;
    },
    filterHtml(str){
      var reg=/<[^<>]+>/g;
      return str.replace(reg,'');
    }
  },

  mounted () {
    this.dialogVisible = false
    this.postAjax(this.post,'iProblem/selectAll/Problem',this.shouProblem);

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
    line-height: 1.5em;
  }
  .problemSize{
    margin-top: 0.5em;
    border-bottom:1px dashed #000;
  }
  .mainheight{
    height:42em;
  }
</style>
