<template>
  <el-container>
    <el-header  height="13em">
      <div>
        <h1>hello word</h1>
        在这个世界，知识是需要成本需要付费的
        在这个世界，知识是需要成本需要付费的
        在这个世界，知识是需要成本需要付费的      在这个世界，知识是需要成本需要付费的
        在这个世界，知识是需要成本需要付费的
      </div>
      <!--   <div class="regist">
           <el-button style="width:100px;">{{loginBuuto}}</el-button>
         </div>-->
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple"><router-link to="/problem/javaList"><img src='../assets/images/timg.jpg' class="homepageImg1 " /></router-link></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light"><img src='../assets/images/timg.jpg' class="homepageImg1 " /></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple"><img src='../assets/images/timg.jpg' class="homepageImg1 " /></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light"><img src='../assets/images/timg.jpg' class="homepageImg1 " /></div></el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        // 此变量说明是注册还是登陆
        loginBuuto: '注册'
      }
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
    background-color: #F2F6FC;
    color: #333;
    text-align: center;
    line-height: 3em;
  }

  .homepageImg1{
    width:18em;
    height:20em;
  }
  .regist{
    position: absolute;
    top: 10em;
    left: 70%;
  }
</style>
