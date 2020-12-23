<template>
  <div>
    <h1>я тута</h1>
    <ul v-for="(coach, idx) in coaches" :key="idx">
      <li>
        <span>{{coach.name + ' '}}</span>
        <span>{{coach.surname}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../main'

export default {
 name: 'Coach',
 components: {
 },

 data () {
   return {
     coaches: [],
     name: '', 
   }
 },
 firestore () {
   return {
     coaches: db.collection('coaches')
   }
 },
//  created: function () {
//     db.collection("coaches")
//     .get()
//     .then(function(querySnapshot) {
//         querySnapshot.forEach(function(doc) {
//             this.coaches.push(doc.data().name)
//         });
//     })
//     .catch(function(error) {
//         console.log("Error getting documents: ", error);
//     });

//   }
}
</script>