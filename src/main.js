import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(firestorePlugin)

firebase.initializeApp({
  apiKey: "AIzaSyDPXyAHTUhclYQtx91LQQgcmtXjJx09lBA",
  authDomain: "pool-miet.firebaseapp.com",
  projectId: "pool-miet",
  storageBucket: "pool-miet.appspot.com",
  messagingSenderId: "715291227957",
  appId: "1:715291227957:web:ceea5530bf7861e6cbfe7c",
  measurementId: "G-MFL1BYLEVW"
})

export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
