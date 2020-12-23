<template>
  <v-card height="100%" width="256" class="mx-auto">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Меню
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ dateTime }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link>
        <router-link :to=item.url>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </router-link>
      </v-list-item>
    </v-list>
  </v-card>
</template>


<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Посетители', icon: 'mdi-account-supervisor', url: '/' },
          { title: 'Тренеры', icon: 'mdi-account', url: '/coaches' },
          { title: 'Расписание занятий', icon: 'mdi-calendar', url: '/calendar' },
          { title: 'Отчеты', icon: 'mdi-book', url: '/reports' }
        ],
        dateTime: new Date().toLocaleString("default", { 
          weekday: "short", 
          day: "numeric", 
          month: "long",
          year: "numeric"
        }),
        right: null,
      }
    },
  }
</script>


<style scoped>
 .v-application a {
     text-decoration: none;
     display: flex;
 }
</style>