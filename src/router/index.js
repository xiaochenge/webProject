import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import javaList from '@/components/javaListProblems/javaList'
import contentProblem from '@/components/javaListProblems/content/ContentProblem'

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
      path: '/problem/javaList',
      name: 'javaList',
      component: javaList
    },
    {
      path: '/problem/javaList/contentProblem',
      name: 'problemId',
      component: contentProblem
    }
  ]
})
