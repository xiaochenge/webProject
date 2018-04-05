import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/user/homepage',
      name: 'homepage',
      component:  resolve => require(['../components/user/homepage.vue'], resolve),
    },
    {
      path: '/problemsHeader',
      name: 'problemsHeader',
      component: resolve => require(['../components/ProblemsHeader.vue'], resolve),
      children:[
        {
          path: '/javaList',
          name: 'javaList',
          component: resolve => require(['../components/javaListProblems/javaList.vue'], resolve),
        },
        {
          path: '/javaList/contentProblem',
          name: 'problemId',
          component: resolve => require(['../components/javaListProblems/content/ContentProblem.vue'], resolve),
        }
      ]
    },



  ]
})
