<template>
  <v-row>
    <v-col cols="12">
      <v-combobox
        @input="UpdateGuest"
        v-model = select
        :items="allGuests"
        label="Гости"
        multiple
        outlined
        dense
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '../main'

export default {
  props: ['startGuests'],
  data () {
    return {
      clients: [],
      name: '',
      temp: ''
    }
  },
  firestore() {
    return {
      clients: db.collection('clients')
    }
  },
  computed: {
    allGuests: function () {
      return this.clients.map(function(item) {
        return item.fullName;
      });
    },
    select: {
      get: function() {
        return this.startGuests
      },
      set: function(newVal) {
        this.temp = newVal
      }
    }
  },
  methods: {
    UpdateGuest() {
      this.$emit('updateParent', {
        guest: this.temp
      })
    }
  },
}
</script>