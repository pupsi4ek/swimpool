<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="blue darken-4">
          <v-btn color="primary" dark @click.stop="dialog = true">
            Добавить занятие
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Сегодня
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>День</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Неделя</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Месяц</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 дня</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <WorkoutTypePicker @updateParent="onUpdateType" />
              <CoachPicker @updateParent="onUpdateCoach" />
              <v-text-field v-model="details" type="text" label="Детали"></v-text-field>
              <v-text-field v-model="date" type="date" label="Дата (обязательно)"></v-text-field>
              <v-row>
                <v-col>
                  <v-text-field v-model="start" type="time" label="Время начала (обязательно)"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="end" type="time" label="Время окончания (обязательно)"></v-text-field>
                </v-col>
              </v-row>
              <v-text-field v-model="color" type="color" label="Цвет (нажмите, чтобы выбрать)"></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">
                Добавить занятие
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="dark" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id" dark>
                Детали: {{ selectedEvent.details }}
                <br />
                Тренер: {{ selectedEvent.coach }}
              </form>
              <form v-else>
                <textarea-autosize v-model="selectedEvent.details" type="text" style="width: 100%" :min-height="100" placeholder="add note">
                </textarea-autosize>
              </form>
              <GuestsPicker @updateParent="onUpdateGuest" :startGuests="selectedEvent.guests" :date="selectedEvent.start" />
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                close
              </v-btn>
              <v-btn v-if="currentlyEditing !== selectedEvent.id" text @click.prevent="editEvent(selectedEvent)">
                edit
              </v-btn>
              <v-btn text v-else type="submit" @click.prevent="updateEvent(selectedEvent)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '@/main';
import WorkoutTypePicker from './WorkoutTypePicker';
import CoachPicker from './CoachPicker';
import GuestsPicker from './GuestsPicker.vue';

export default {
  components: {
    WorkoutTypePicker,
    CoachPicker,
    GuestsPicker,
  },
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      '4day': '4 Дня',
    },
    name: null,
    details: null,
    date: null,
    start: null,
    end: null,
    color: '#1976D2', // default event color
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
    coach: null,
  }),
  mounted() {
    this.getEvents();
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return '';
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? '' : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? '' : endYear;
      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);
      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`;
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return '';
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long',
      });
    },
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection('workouts').get();
      const events = [];
      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        appData.start = this.normalizeDate(doc.data().start.toDate());
        appData.end = this.normalizeDate(doc.data().end.toDate());
        events.push(appData);
      });
      this.events = events;
    },
    normalizeDate(date) {
      let hours = date.getHours();
      let out = new Date(date.setHours(hours + 3)).toISOString();
      return out.substr(0, out.length - 5);
    },
    setDialogDate({ date }) {
      this.dialogDate = true;
      this.focus = date;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async addEvent() {
      if (this.name && this.date && this.start && this.end) {
        if (this.start < this.end) {
          const startTimestamp = this.date + 'T' + this.start;
          const endTimestamp = this.date + 'T' + this.end;
          const startDay = new Date(startTimestamp);
          const endDay = new Date(endTimestamp);
          await db.collection('workouts').add({
            name: this.name,
            coach: this.coach,
            details: this.details,
            start: startDay,
            end: endDay,
            color: this.color,
            guests: [],
          });
          this.getEvents();
          (this.name = ''), (this.coach = ''), (this.details = ''), (this.start = null), (this.end = null), (this.color = null);
        } else {
          alert('Время начала превышает время окончания!');
        }
      } else {
        alert('Пожалуйста, выберите тип тренировки и дату ее проведения');
      }
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    async updateEvent(ev) {
      await db
        .collection('workouts')
        .doc(this.currentlyEditing)
        .update({
          details: ev.details,
          guests: ev.guests,
        });
      this.selectedOpen = false;
      this.currentlyEditing = null;
      this.getEvents();
    },
    async deleteEvent(ev) {
      await db
        .collection('workouts')
        .doc(ev)
        .delete();
      this.selectedOpen = false;
      this.getEvents();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21 ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10];
    },
    onUpdateType(data) {
      this.name = data.type;
    },
    onUpdateCoach(data) {
      this.coach = data.coach;
    },
    async onUpdateGuest(data) {
      this.selectedEvent.guests = data.guest;
      this.selectedEvent.start = new Date(this.selectedEvent.start);
      this.selectedEvent.end = new Date(this.selectedEvent.end);
      await db
        .collection('workouts')
        .doc(this.selectedEvent.id)
        .set(this.selectedEvent);
      this.selectedEvent.start = this.normalizeDate(this.selectedEvent.start);
      this.selectedEvent.end = this.normalizeDate(this.selectedEvent.end);
    },
  },
};
</script>
