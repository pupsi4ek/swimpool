<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="light-blue darken-4" dark v-bind="attrs" v-on="on">
          Добавить посетителя
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="light-blue darken-4">
          Добавить посетителя
        </v-card-title>
        
        <div class="px-4">
            <form @submit="addGuest(fullName, birth, doctor, certificateEnd)">
            <v-text-field v-model="fullName" label="ФИО посетителя"></v-text-field>
            <v-text-field v-model="birth" type="date" label="Дата рождения"></v-text-field>
            <v-text-field v-model="doctor" label="ФИО доктора"></v-text-field>
            <v-text-field v-model="certificateEnd" type="date" label="Окончание действия справки"></v-text-field>
            <v-btn color="indigo lighten-1" dark type="submit" @click="dialog = false">
                Создать
            </v-btn>
            </form>
        </div>
        <br>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <!-- Курносенко Анна Дмитриевна" "Валилуев Дмитрий Сергеевич" -->
</template>


<script>
import { db } from '../main'

export default {
  data () {
    return {
      dialog: false,
      fullName: '',
      birth: '',
      doctor: '',
      certificateEnd: ''
    }
  },
  methods: {
    addGuest(fullName, birth, doctor, certificateEnd) {
      const createdAt = new Date();
      birth = new Date(birth+'T00:00:00Z');
      certificateEnd = new Date(certificateEnd+'T00:00:00Z');
      db.collection('clients').add({ fullName, birth, doctor, certificateEnd, createdAt });
    }
  }
}
</script>