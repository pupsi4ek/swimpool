<template>
  <v-container class="d-flex justify-center align-center">
    <v-col lg="4">
      <h1>Вход</h1>
      <v-form @submit.prevent="login">
        <v-text-field label="Адрес электронной почты" type="email" v-model="email"></v-text-field>
        <v-text-field label="Пароль" type="password" v-model="pass"></v-text-field>
        <v-btn color="indigo lighten-1" type="submit">Логин</v-btn>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      pass: '',
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.pass)
        // .then((user) => {
        //   console.log(user.uid);
        // })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    },
  },
};
</script>
