<template>
  <div class="px-4">
    <DialogCoach class="my-4"/>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              ФИО тренера
            </th>
            <th class="text-left">
              Опыт работы
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(coach, idx) in coaches" :key="idx">
            <td>{{ coach.fullName }}</td>
            <td>{{ coach.experience }} года</td>
            <td class="text-right">
              <v-btn @click="deleteCoach(coach.id)" class="mx-2" fab dark x-small color="red lighten-1">
                  <v-icon dark>
                      mdi-delete
                  </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { db } from '@/main'
import DialogCoach from '@/components/DialogCoach'

export default {
  name: 'Coach',
  components: {
    DialogCoach,
  },
  data () {
    return {
      coaches: [],
      fullName: '', 
      experience: ''
    }
  },
  firestore () {
    return {
      coaches: db.collection('coaches')
    }
  },
  methods: {
    deleteCoach (id) {
      db.collection('coaches').doc(id).delete()
    }
  },
}
</script>