<template>

  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    line-height:1em;
    color: #2c3e50;
    margin-top: 1em;
    margin-bottom: 3em;
    margin-left:auto;
    margin-right:auto;
    width:70em;
  }
</style>
