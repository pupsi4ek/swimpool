<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="light-blue darken-4" dark v-bind="attrs" v-on="on">
          Добавить тренера
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="light-blue darken-4">
          Добавить тренера
        </v-card-title>

        <div class="px-4">
          <form @submit.prevent="AddCoach(fullName, experience)">
            <v-text-field v-model="fullName" label="ФИО тренера"></v-text-field>
            <v-text-field v-model="experience" label="Опыт работы"></v-text-field>
            <v-btn color="indigo lighten-1" dark type="submit" @click="dialog = false">
              Создать
            </v-btn>
          </form>
        </div>
        <br />
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '../main';

export default {
  data() {
    return {
      dialog: false,
      // coaches: [],
      fullName: '',
      experience: '',
    };
  },
  methods: {
    AddCoach(fullName, experience) {
      const createdAt = new Date();
      db.collection('coaches').add({ fullName, experience, createdAt });
    },
  },
};
</script>
