<template>
  <v-container fluid class="pa-0">

    <!-- FIRST SECTION -->
    <section class="mx-auto" style="max-width: 1400px;">
      <h1 class="font-weight-medium grey--text text--darken-3 mb-4 mt-5 text-h5 text-sm-h4"> News / Announcements</h1>

      <v-form ref="news_data" @submit.prevent="submitAnnouncement">
        <v-card class="py-4 mx-auto pa-2 pa-sm-4" flat>
          <v-row dense>
              <!-- TITLE -->
              <v-col cols="12" md="12">
                <v-text-field v-model="news_title" :prefix="$store.state.prv_data.provider_name + ': '" :rules="empty_validation" label="Title" hide-details outlined dense></v-text-field>
              </v-col>
          </v-row>

          <v-row dense>
              <!-- CATEGORY -->
              <v-col cols="12" md="12">
                <v-select v-model="selected_categories" :items="category_list" :rules="empty_validation" item-text="label" item-value="id" label="Target Audience" deletable-chips hide-no-data hide-selected multiple chips outlined hide-details small-chips dense></v-select>
              </v-col>
          </v-row>

          <v-row class="mb-1" dense>
              <!-- PLACE -->
              <v-col cols="12" md="6">
                <v-text-field v-model="news_place" :rules="empty_validation" hide-details label="Place" outlined dense></v-text-field>
              </v-col>

              <!-- DATE PICKER -->
              <v-col cols="12" md="6">
                <v-menu ref="menu" v-model="datetime_menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290" min-width="290" persistent>
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="news_datetime" :rules="empty_validation" hide-details label="Date & Time" outlined dense v-bind="attrs" v-on="on" readonly></v-text-field>
                  </template>

                  <v-card>
                    <v-date-picker v-if="!show_time" v-model="date_value" @input="goToTimePicker"></v-date-picker>
                    <v-time-picker v-if="show_time" v-model="time_value" format="ampm" full-width @change="saveDateTime"></v-time-picker>
                  </v-card>
                </v-menu>
              </v-col>
          </v-row>

              <!-- PLACE -->
              <!-- <v-col cols="12" md="3">
                <v-text-field v-model="news_place" label="Place" outlined dense></v-text-field>
              </v-col> -->

              <!-- DATE PICKER -->
              <!-- <v-col cols="12" md="2">
                <v-menu ref="menu" v-model="datetime_menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290" min-width="290" persistent>
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="news_datetime" label="Date & Time" outlined dense v-bind="attrs" v-on="on" readonly></v-text-field>
                  </template>

                  <v-card>
                    <v-date-picker v-if="!show_time" v-model="date_value" @input="goToTimePicker"></v-date-picker>
                    <v-time-picker v-if="show_time" v-model="time_value" format="ampm" full-width @change="saveDateTime"></v-time-picker>
                  </v-card>
                </v-menu>
              </v-col> -->


          <!-- DESCRIPTION -->
          <v-textarea v-model="news_announcement" :rules="empty_validation" hide-details outlined label="Description"></v-textarea>

          <!-- <h3 class="text-subtitle-1 font-weight-medium mb-2">Target Audience</h3> -->
        </v-card>

        <v-card-actions class="d-flex justify-end pr-2 pr-sm-4">
          <v-btn :loading="btn_loader" type="submit" class="primary mx-2">POST</v-btn>
        </v-card-actions>
      </v-form>
    </section>

    <!-- SECOND SECTION -->
    <section class="mx-auto mt-10" style="max-width: 1400px;">
      <h2 class="font-weight-medium grey--text text--darken-3 mb-4 text-h6 text-sm-h5"> List of Announcements </h2>

      <v-card class="mx-auto pa-2 pa-sm-4 overflow-x-auto" flat>
        <v-data-table :headers="announcement_headers" :items="announcement_list" :loading="loading_data" dense class="elevation-1">
            <template v-slot:item.categories="{ item }">{{ item.categories ? item.categories.map(c => c.label).join(', ') : '' }}</template>
          <template v-slot:item.datetime="{ item }"> {{ formatDateAndTime(item.datetime) }}</template>
          <template v-slot:item.date_created="{ item }"> {{ formatDateAndTime(item.date_created) }}</template>
          <template v-slot:item.date_updated="{ item }"> {{ formatDateAndTime(item.date_updated) }}</template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon small color="primary" @click="editRow(item)"> <v-icon small>mdi-pencil</v-icon> </v-btn>
            <!-- <v-btn icon small color="red" @click="deleteRow(item)"> <v-icon small>mdi-delete</v-icon> </v-btn> -->
          </template>
        </v-data-table>
      </v-card>
    </section>

    <Alert :alert="alert"/>
  </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue';

export default {
  components: { Alert },

  data() {
    return {
      news_title: '',
      news_announcement: '',
      news_place: '',
      news_datetime: "",
      datetime_menu: false,
      date_value: null,
      time_value: null,
      show_time: false,
      loading_data: false,
      btn_loader: false,
      edit_announcement: false,
      announcement_list: [],
      alert: {},

      announcement_headers: [
        { text: 'Title', value: 'title', width: '250px' },
        { text: 'Place', value: 'location', width: '250px' },
        { text: 'Description', value: 'message', width: '350px' },
        { text: 'Categories', value: 'categories', width: '350px' },
        { text: 'Date and Time', value: 'datetime', width: '200px' },
        { text: 'Date Created', value: 'date_created', width: '200px' },
        { text: 'Date Updated', value: 'date_updated', width: '200px' },
        { text: 'Created By', value: 'created_by', width: '200px' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' },
      ],

      selected_categories: [],
      category_list: [
        { id: 1, label: "ALL USERS" },
        { id: 2, label: "FEMALE" },
        { id: 3, label: "MALE" },
        { id: 4, label: "PWD" },
        { id: 5, label: "SENIOR CITIZEN" },
        { id: 6, label: "AGE 18 BELOW" },
        { id: 7, label: "AGE 18 ABOVE" },
        { id: 8, label: "AGE 5 BELOW" },
      ],

      // FORM VALIDATION
      empty_validation: [
          v => !!v && !/^ *$/.test(v) || 'Required Field',
      ],
    };
  },

  mounted() {
    this.getAnnouncementList();
  },

  // computed: {
  //   news_title_full: {
  //     get() {
  //       return `${this.$store.state.prv_data.provider_name}: ${this.news_title}`
  //     },
  //     set(val) {
  //       const prefix = `${this.$store.state.prv_data.provider_name}: `
  //       this.news_title = val.replace(prefix, '')
  //     }
  //   }
  // },

  methods: {
    goToTimePicker() {
      this.show_time = true;
    },

    saveDateTime() {
      const date = this.$moment(this.date_value).format("YYYY-MM-DD");
      const time = this.$moment(this.time_value, "hh:mm A").format("hh:mm A");
      this.news_datetime = `${date} ${time}`;
      this.datetime_menu = false;
      this.show_time = false;
    },

    async submitAnnouncement() {
      if (this.$refs.news_data.validate()) {
       this.btn_loader = true;

        const date_and_time = this.news_datetime ? this.$moment(this.news_datetime, "YYYY-MM-DD hh:mm A").format("YYYY-MM-DD HH:mm:ss") : this.$moment().format("YYYY-MM-DD HH:mm:ss");
        const selected_category_details = this.category_list.filter(cat => this.selected_categories.includes(cat.id)).map(cat => ({ id: cat.id, label: cat.label }));

        const full_title = `${this.$store.state.prv_data.provider_name}: ${this.news_title}`

        const payload = {
          request_key: this.edit_announcement ? "update" : "insert",
          title: full_title,
          place: this.news_place,
          announcement: this.news_announcement,
          created_by: this.$store.state.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code,
          datetime: date_and_time,
          categories: selected_category_details,
          ...(this.edit_announcement && { announcement_id: this.announcement.id })
        };

        const response = await this.$services.trnAddAppAnnouncement(payload);

        if (response.status === 200) {
          if(response.data.success){
            this.alert = { display: true, type: "standard", width: "400", icon: "mdi-check-circle", color: "green", title: "Announcement Posted Successfully", body: "Please check on the table below", btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "reloadPage"}
            this.selected_categories = [];
          } else {
          this.alert =  { display: true, type: "standard", width: "400", icon: "mdi-alert-circle", color: "red", title: "Failed to Post Announcement", body: "Please Try Again.", btn_pry_txt: "OK", btn_pry_color: "primary", btn_pry_otl: false, btn_pry_act: "closeAlert" };
          }
        } else {
          this.alert = response.error;
        }

        this.btn_loader = false;
      }
    },

    async getAnnouncementList() {
      this.loading_data = true;

      let response = await this.$services.getAppAnnouncement({
        request_key: "web",
        provider_code: this.$store.state.prv_data.provider_code
      });

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data);

        this.announcement_list = response.data.sort((a, b) => {
          return new Date(b.date_created) - new Date(a.date_created);
        });

      } else {
        this.alert = response.error;
      }

      this.loading_data = false;
    },

    editRow(item) {
      this.edit_announcement = true;
      this.news_title = item.title;
      this.news_announcement = item.message;
      this.news_place = item.location;
      this.news_datetime = item.datetime;
      this.selected_categories = (item.categories || []).map(c => Number(c.id));
      this.announcement = { id: item.announcement_id };
    },

    deleteRow(item) {
      console.log('Delete', item);
    }
  }
};
</script>

