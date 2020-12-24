<template>
  <div>
    <v-combobox @input="UpdateType" v-model="select" :items="types" label="Выберите тип занятия" outlined dense></v-combobox>
  </div>
</template>

<script>
import { db } from '@/main';

export default {
  data() {
    return {
      select: '',
      workoutTypes: [],
    };
  },
  firestore() {
    return {
      workoutTypes: db.collection('workoutTypes'),
    };
  },
  computed: {
    types: function() {
      return this.workoutTypes.map(function(item) {
        return item.name;
      });
    },
  },
  methods: {
    UpdateType() {
      this.$emit('updateParent', {
        type: this.select,
      });
    },
  },
};
</script>
