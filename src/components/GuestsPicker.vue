<template>
  <v-row>
    <v-col cols="12">
      <v-combobox
        @input="UpdateGuest"
        v-model="select"
        :items="allGuests()"
        item-text="name"
        item-disabled="disable"
        label="Гости"
        multiple
        outlined
        dense
      ></v-combobox>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '../main';

export default {
  props: ['startGuests', 'date'],
  data() {
    return {
      clients: [],
      name: '',
      temp: '',
    };
  },
  firestore() {
    return {
      clients: db.collection('clients'),
    };
  },
  computed: {
    select: {
      get: function() {
        return this.startGuests;
      },
      set: function(newVal) {
        this.temp = newVal;
      },
    },
  },
  methods: {
    UpdateGuest() {
      this.$emit('updateParent', {
        guest: this.temp,
      });
    },
    allGuests() {
      let d = this.date;
      console.log(d);
      return this.clients.map(function(item) {
        return { name: item.fullName, disable: !(new Date(item.certificateEnd.toDate()).toISOString() > d) };
      });
    },
    calculateLimit(item) {
      if (item.certificateEnd > this.date) {
        return 'false';
      } else {
        return 'true';
      }
    },
  },
};
</script>
