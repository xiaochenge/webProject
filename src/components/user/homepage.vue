<template >
  <el-container class="background">
    <el-header height="13em">Header</el-header>
    <div class="mainTop">
      <el-button class="editingInformation" size="mini" round>编辑资料</el-button>
    </div>
    <el-container>
      <el-aside width="17em">
      </el-aside>
    <el-main>
      <div class="userIntroduce">
      </div>

      <el-row style="border-bottom:1px dashed #000;" v-for="(item,index) in findMyProblem" :key="index">
        <el-col :span="24" >
          <div style="float: left;margin-top:2em;margin-right: 1.8em; background-color: #D3DCE6;width: 5em;height: 7em;">楼主的头像</div>
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
  </el-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        findMyProblem: null,
        problems: null,
        totalCount: null,
        problem : { // 查询条件
          creator: this.$Const.localStoreObj.getUser().id, //主键
          page: 1,
          limit: 15
        }
      }
    },
    methods: {
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
    },
    mounted() {
      if(this.problem.creator!=null)
        this.$Const.doPost('/iProblem/Problem/findMyProblemAndReply',this.problem,this.findMyProblemAndReply)
    }
  }
</script>

<style scoped>
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;

    line-height: 200px;
  }
  .el-main {
    color: #333;
    text-align: left;
  }
  .userIntroduce{
    height: 8em;
    background-color: #22282F;
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

    background-image: url('../../assets/images/background.jpg');
    background-color: #000000;
  }
</style>
