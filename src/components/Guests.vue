<template>
  <div class="px-4">
    <DialogGuest class="my-4"/>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              ФИО посетителя
            </th>
            <th class="text-left">
              Дата рождения
            </th>
            <th class="text-left">
              ФИО доктора
            </th>
            <th class="text-left">
              Окончание действия справки
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(guest, idx) in guests" :key="idx">
            <td>{{ guest.fullName }}</td>
            <td>{{ guest.birth.toDate().toLocaleString("default", { day: "numeric", month: "long", year: "numeric" }) }}</td>
            <td>{{ guest.doctor }}</td>
            <td>{{ guest.certificateEnd.toDate().toLocaleString("default", { day: "numeric", month: "long", year:"numeric" }) }}</td>
            <td class="text-right">
                <v-btn @click="deleteGuest(guest.id)" class="mx-2" fab dark x-small color="error">
                  <v-icon dark>
                      mdi-delete
                  </v-icon>
                  </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- Кичигин Эдуард Григорьевич -->
    <!-- Сидоров Петр Алексеевич -->
  </div>
</template>

<script>
import { db } from '../main'
import DialogGuest from './DialogGuest'

export default {
  name: 'Guests',
  components: {
    DialogGuest,
  },
  data () {
    return {
      guests: []
    }
  },
  firestore () {
    return {
      guests: db.collection('clients')
    }
  },
  methods: {
    deleteGuest(id) {
      db.collection('clients').doc(id).delete()
    }
  }, 
}
</script>
