<template>
  <el-container>
    <el-header height="5em"><el-button type="primary" plain  @click="openQuestionPage">回复此贴</el-button></el-header>
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
                    <div id="div1" style="display:none">
                    </div>
                    <div id="div2" style="border-left:1px dashed #000; min-height: 15em;">
                      以下为编辑内容 以下为编辑内容 以下为编辑内容 以下为编辑内容 以下为编辑内容
                    </div>
                  </el-col>
              </el-row>

            </div>
          </el-col>
          <!-- 这一列回答，此处需要循环和分页 -->
          <el-col :span="24">
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
                    <div id="div1" style="display:none">
                    </div>
                    <div id="div2" style="border-left:1px dashed #000; min-height: 15em;">
                      以下为编辑内容 以下为编辑内容 以下为编辑内容 以下为编辑内容 以下为编辑内容
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>

          </el-col>
        </el-row>

        <div id="div3" class="toolbar " >
        </div>
        <div style="padding: 5px 0; color: #ccc"></div>
        <div id="div4" style="min-height:15em; padding:1em;border:0.5em solid #96c2f1;background:#eff7ff"> <!--可使用 min-height 实现编辑区域自动增加高度-->
          <p>请输入内容</p>
        </div>
      </el-main>
    <el-footer>
    </el-footer>

  </el-container>
</template>


<script type="text/javascript">
  import E from 'wangeditor'
  export default {
    data() {
      return {
        visible2:true,
        editorMain: null,
        editorReply:null,
        dialogVisible:true
      }
    },
    methods : {
      //显示问题内容
      createMainEditor () {
        this.editorMain = new E('#div1','#div2')
        this.editorMain.customConfig.uploadImgServer = '/upload'
        this.editorMain.create()
        this.editorMain.$textElem.attr('contenteditable', false)
      },
      createReplyEditor () {
        this.editorReply = new E('#div3','#div4')
        this.editorReply.customConfig.uploadImgServer = '/upload'
        this.editorReply.create()
      },
      //进入页面初始化数据
      initProblem(data){
        this.createMainEditor();
      },
      //发起回复
      openQuestionPage () {
        if (this.editorReply == null) {
          this.createReplyEditor()
        }
      },

      closePost () { // 清空文本

      },
      sbmitReplyPost () {//提交回复

      },



      //以下存放工具
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

    },
    mounted () {
      this.dialogVisible=false
      this.postAjax({id:this.$route.params.problemId}, 'iProblem/Problem/findByProblemId',this.initProblem())
    }
  }
</script>

<style>
  .el-header {
    background-color: #EBEEF5;
    color: #333;
    text-align: center;
    line-height: 8em;
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

  .box2{
    margin: 20px auto;
    width: 300px;
    min-height: 150px;
    padding: 10px;
    position:relative;
    background: -webkit-gradient(linear, 0% 20%, 0% 92%, from(#f3f3f3), to(#fff), color-stop(.1,#f3f3f3));
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    -webkit-border-bottom-right-radius: 60px 60px;
    -webkit-box-shadow: -1px 2px 2px rgba(0, 0, 0, 0.2);

  }
  .box2:before{
    content:'';
    width: 25px;
    height: 20px;
    position: absolute;
    bottom:0;
    right:0;
    -webkit-border-bottom-right-radius: 30px;
    -webkit-box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.3);
    -webkit-transform:
      rotate(-20deg)
      skew(-40deg,-3deg)
      translate(-13px,-13px);
  }

  .box2:after{
    content: '';
    z-index: -1;
    width: 100px;
    height: 100px;
    position:absolute;
    bottom:0;
    right:0;
    background: rgba(0, 0, 0, 0.2);
    display: inline-block;
    -webkit-box-shadow: 20px 20px 8px rgba(0, 0, 0, 0.2);
    -webkit-transform: rotate(0deg)
    translate(-45px,-20px)
    skew(20deg);
  }

  .box2 img {
    width: 100%;
    margin-top: 15px;
  }

  p{
    margin-top: 15px;
    text-align: justify;
  }

  h1{
    font-size: 20px;
    font-weight: bold;
    margin-top: 5px;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
  }

  a{
    text-decoration: none;
    color: #4A4A4A !important;
  }

  a:hover{
    text-decoration: underline;
    color: #6B6B6B !important ;
  }

</style>
