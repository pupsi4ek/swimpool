<template>
  <v-app-bar app color="light-blue darken-3">
    <v-app-bar-nav-icon @click="changeDrawer"></v-app-bar-nav-icon>

    <v-toolbar-title>Бассейн</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon @click="logOut">
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>

    <!-- <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="n in 5" :key="n" @click="() => {}">
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
  </v-app-bar>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Header',
  data: () => ({ drawer: null }),
  methods: {
    changeDrawer() {
      this.$emit('updateDrawer');
    },
    logOut() {
      firebase.auth().signOut();
    },
  },
};
</script>

<style></style>
