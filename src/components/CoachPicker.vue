<template>
  <div>
    <v-combobox 
      @input="UpdateCoach"
      v-model="select"
      :items="coachNames"
      label="Выберите тренера"
      outlined
      dense
    ></v-combobox>
  </div>
</template>

<script>
import { db } from '@/main'

export default {
  data () {
    return {
      select: '',
      coaches: []
    }
  },
  firestore () {
    return {
      coaches: db.collection('coaches')
    }
  },
  computed: {
    coachNames: function () {
      return this.coaches.map(function(item) {
        return item.fullName;
      });
    }
  },
  methods: {
    UpdateCoach() {
      this.$emit('updateParent', {
        coach: this.select
      })
    }
  }
}
</script>