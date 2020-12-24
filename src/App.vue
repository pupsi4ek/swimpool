<template>
  <v-app id="inspire">
    <div v-if="loggedIn">
      <v-navigation-drawer v-model="drawer" app fluid>
        <Drawers />
      </v-navigation-drawer>
      <Header @updateDrawer="drawer = !drawer" />
      <v-main>
        <v-container>
          <router-view />
        </v-container>
      </v-main>
    </div>
    <Login v-else />
  </v-app>
</template>

<script>
import Drawers from './components/Drawers';
import Header from './components/Header';
import Login from './views/Login';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  components: {
    Drawers,
    Header,
    Login,
  },
  data: () => ({ drawer: null, loggedIn: true }),
  created: function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
        // var uid = user.uid;
      } else {
        this.loggedIn = false;
      }
    });
  },
};
</script>
