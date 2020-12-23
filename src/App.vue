<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app fluid>
      <Drawers />
    </v-navigation-drawer>
      <Header @updateDrawer="drawer=!drawer" />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Drawers from './components/Drawers'
import Header from './components/Header'

  export default {
    components: {
      Drawers,
      Header
    },
    data: () => ({ drawer: null }),
  }
</script>
