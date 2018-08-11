<template>

     <el-container>
     <el-header  height="17em">
       <div>
         <h1> 冉冉， 欢迎你以后主页留给你</h1>
       </div>
     </el-header>
     <el-main>
       <el-row>
         <el-col :span="12"><div class="grid-content bg-purple"><router-link to="/problemsHeader"><img src='../assets/images/timg.jpg' class="homepageImg1 " /></router-link></div></el-col>
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
