import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import homepage from '@/components/user/homepage'
import javaList from '@/components/javaListProblems/javaList'
import contentProblem from '@/components/javaListProblems/content/ContentProblem'
import problemsHeader from '@/components/ProblemsHeader'


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
      component: homepage
    },
    {
      path: '/problemsHeader',
      name: 'problemsHeader',
      component: problemsHeader,
      children:[
        {
          path: '/javaList',
          name: 'javaList',
          component: javaList
        },
        {
          path: '/javaList/contentProblem',
          name: 'problemId',
          component: contentProblem
        }
      ]
    },



  ]
})
