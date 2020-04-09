import Vue from 'vue'
import Router from 'vue-router'
import Gallery from '@/views/Gallery'
import MemeDetailView from '@/views/MemeDetailView'
import ConfirmActionView from '@/views/ConfirmActionView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gallery',
      component: Gallery
    },
    {
      path: '/view/:memeId',
      name: 'MemeDetailView',
      component: MemeDetailView
    },
    {
      path: '/confirm/:actionId',
      name: 'ConfirmActionView',
      component: ConfirmActionView
    }
  ]
})
