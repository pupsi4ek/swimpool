<template>
  <v-container>
    <v-row>
      <v-col>
        <v-combobox
        :items="reportType" 
        v-model="typeSelect" 
        label="Тип отчета"
        color="light-blue darken-4">
        </v-combobox>
      </v-col>
      <v-col>
        <v-text-field v-model="start" type="date" label="Начало периода (обязательно)"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="end" type="date" label="Конец периода (обязательно)"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="light-blue darken-4" small @click.stop="createReport">
          Сформировать отчет 
          <v-icon small>mdi-file-document-multiple</v-icon>
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn color="light-blue darken-4" small @click="reportNum+=1" v-show="dialog">
          <JsonExcel
          :data="reports"
          :fields="json_fields"
          :worksheet=filename
          :name=filename>
          Экспорт в Excel
          </JsonExcel>
          <v-icon>mdi-file-excel</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-sheet v-show="dialog">
      <v-list>
        <v-list-item v-for="(item, n) in reports" :key="n">
          <v-row>
            <v-col>
              <v-icon>mdi-file-document-outline</v-icon>
            </v-col>
            <v-col>              
              Отчет №{{ n+1 }} {{ item.type }}
            </v-col>
            <v-col class='d-flex felx-column'>
              <span>В период с {{ item.start }}</span>
              <span>по {{ item.end }}</span>               
            </v-col>
            <v-col>
              {{ calculateReport(item.type, item.workouts) }}
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-container>
</template>

<script>
import { db } from '@/main'
import JsonExcel from 'vue-json-excel'

export default {
  name: "Report",
  components: {JsonExcel},
  data() {
    return {
      reportType: ['по посетителям', 'по собранным средствам'],
      typeSelect: '',
      dialog: false,
      start: '',
      end: '',
      reports: [],
      pricelist: [],
      reportNum: 1,
      json_fields: {
        'Тип отчета': {
          field: 'type',
          callback: (value) => {
            return `Отчет ${value}`
          }
        },
        'Начало периода': 'start',
        'Конец периода': 'end',
        "Итог": {
          callback: (value) => {
            return this.calculateReport(value.type, value.workouts);
          },
        },
      },
    }
  },
  firestore () {
    return {
      pricelist: db.collection('workoutTypes')
    }
  },
  computed: {
    filename() {
      return 'Отчет №' + this.reportNum + '.xls'
    }
  },
  methods: {
    async createReport() {
      let startDate = new Date(this.start)
      let endDate = new Date(this.end)
      if (this.typeSelect && this.start && this.end) {
        if (startDate < endDate) {
          let temp = await db.collection('workouts')
          .where('start', '>=', startDate)
          .get()
          let workouts = []
          temp.forEach(doc => {
            if (doc.data().end.toDate() <= endDate) {
              workouts.push({
                id: doc.id,
                data: doc.data()
              })
            }
          })
          startDate = startDate.toLocaleString("default", {
            day: "numeric", 
            month: "long",
            year: "numeric" 
          })
          endDate = endDate.toLocaleString("default", {
            day: "numeric", 
            month: "long",
            year: "numeric" 
          })
          this.dialog = true 
          this.reports.push({ 
            start: startDate, 
            end: endDate, 
            type: this.typeSelect,
            workouts: workouts
          })
        } else {
          alert('Период выбран неверно, дата начала должна быть меньше, чем дата конца')
        }
      } else {
        alert('Выберите тип отчета и период времени, за который вы хотите сформировать отчет')
      }
      console.log(this.reports);
      console.log(this.json_data);
    },
    calculateClients(workouts) {
      if (workouts.length > 0) {
        let clientsQuantity = 0
        workouts.forEach(workout => {
          clientsQuantity += workout.data.guests.length
        })
        if (clientsQuantity) {
          return 'Прошло ' + workouts.length + ' занятий, пришли ' + clientsQuantity + ' посетителей'
        } else {
          return 'Прошло ' + workouts.length + ' занятий, посетителей не было'
        }
      } else {
        return 'Занятий не было'
      }
    },
    calculateIncome(workouts) {
      if (workouts.length > 0) {
        let income = 0
        workouts.forEach(workout => {
        income += this.pricelist.find(i => i.name === workout.data.name).price * workout.data.guests.length
        })
        if (income) {
          return 'Прошло ' + workouts.length + ' занятий, было собрано ' + income + ' руб.'
        } else {
          return 'Прошло ' + workouts.length + ' занятий, посетителей не было'
        }
      } else {
        return 'Занятий не было'
      }
    },
    calculateReport(type, workouts) {
      switch(type) {
        case 'по посетителям':
          return this.calculateClients(workouts)
        case 'по собранным средствам':
          return this.calculateIncome(workouts)
      }
    }
  }
};
</script>
