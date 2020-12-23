import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Coaches from '@/views/Coaches'
import Calendar from '@/views/Calendar'
import Report from '@/views/Report'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/coaches',
    name: 'Coaches',
    component: Coaches
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Report
  }
]

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
