<template>
  <v-container>
    <v-icon @click="toggleTranslationMode" class="mdi mdi-cog" color="light-blue darken-4" small></v-icon>

    <v-dialog v-model="translation_dialog" persistent width="925">
      <v-card class="elevation-1" height="480">
        <h3 class="font-weight-regular light-blue darken-4 text-center white--text py-2">Settings</h3>

        <v-tabs v-model="tabs_value" vertical>
          <v-tab class="d-flex justify-start"> 
            <v-icon class="pr-4" size="20"> mdi mdi-translate </v-icon>
            Display Settings
          </v-tab>
          <v-tab class="d-flex justify-start"> 
            <v-icon class="pr-4" size="20"> mdi mdi-page-layout-body </v-icon>
            Change Layout
          </v-tab>
          <v-tab class="d-flex justify-start"> 
            <v-icon class="pr-4" size="20"> mdi mdi-cellphone-link </v-icon>
            eCare App
          </v-tab>
          
          <v-tab-item>
            <v-row style="margin-bottom: 12.95rem;" no-gutters dense>
              <v-col cols="12" sm="9" md="9" lg="9" xl="9" class="d-flex flex-column mx-2 pl-1" align-self="center">
                <label class="my-4 mx-1">Filipino Word <span class="body grey--text text--darken-1">(Display all the titles in Filipino Word)</span></label>
                <label class="my-3 mx-1">Save as PDF <span class="body grey--text text--darken-1">(Hide all the buttons of the Save as PDF)</span></label>
                <label class="my-3 mx-1">Help <span class="body grey--text text--darken-1">(Display the help icon <v-icon medium color="primary mt-700" class="help-icon">mdi-help-circle-outline</v-icon> in the bottom right of the page)</span></label>
              </v-col>

              <v-col cols="12" sm="auto" md="auto" lg="auto" xl="auto" class="d-flex flex-column mx-3" >
                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="select_language" @change="toggleLanguage" :loading="loading_language" class="my-4" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>

                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="save_as_pdf_disabled" @change="toggleSaveAsPDF" :loading="loading_pdf" class="my-2" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>

                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="help_button" @change="toggleHelpButton" :loading="loading_btn" class="my-2" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- <v-tab-item>
            <v-row style="margin-bottom: 9.9rem;" no-gutters dense>
              <v-col cols="12" sm="9" md="9" lg="9" xl="9" class="d-flex flex-column mx-2 pl-1" align-self="center">
                <label class="my-4 mx-1">Filipino Word <span class="body grey--text text--darken-1">(Display all the titles in Filipino Word)</span></label>
                <label class="my-3 mx-1">Help <span class="body grey--text text--darken-1">(Display the help icon <v-icon medium color="primary mt-700" class="help-icon">mdi-help-circle-outline</v-icon> in the bottom right of the page)</span></label>
                <label class="my-3 mx-1">Save as PDF <span class="body grey--text text--darken-1">(Hide all the buttons of the Save as PDF)</span></label>
                <label class="my-3 mx-1">Unit Conversion <span class="body grey--text text--darken-1">(Display the unit conversion in the diagnostic exam form)</span></label>
              </v-col>

              <v-col cols="12" sm="auto" md="auto" lg="auto" xl="auto" class="d-flex flex-column mx-3" >
                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="select_language" @change="toggleLanguage" :loading="loading_language" class="my-4" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>

                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="save_as_pdf_disabled" @change="toggleSaveAsPDF" :loading="loading_pdf" class="my-2" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>

                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">OFF</h5>
                  <v-switch v-model="help_button" @change="toggleHelpButton" :loading="loading_btn" class="my-2" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">ON</h5>
                </v-row>

                <v-row align="center" no-gutters dense>
                  <h5 class="body grey--text text--darken-6 mx-4">SIU</h5>
                  <v-switch v-model="unit_conversion" @change="toggleUnitConversion" :loading="loading_unit_conversion" class="my-2" color="success" inset dense hide-details></v-switch>
                  <h5 class="body grey--text text--darken-6">CU</h5>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item> -->

          <v-tab-item>
              <v-row dense>
                <v-col class="mt-6" cols="12" sm="12" md="6">
                  <v-hover v-slot="{ hover }">
                    <v-card @click="selectColumn('type_a')" :disabled="column_selected" :class="[selected_column === 'type_a' ? 'card-border-active' : 'card-border-inactive', hover ? 'hover-class' : '']" class="ml-4 mt-4 mb-6" height="300" width="330" color="grey lighten-3">
                      <v-row dense>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                          <div class="mt-5 mx-5 my-2" style="width: 289px; height: 63px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>
                      </v-row>

                      <v-row dense>
                        <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                          <div class="mx-5 my-2" style="width: 80px; height: 165px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>

                        <v-col cols="6" sm="4" md="5">
                          <div class="mx-auto my-2" style="width: 197px; height: 165px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>
                      </v-row>

                      <div class="d-flex align-end justify-end mt-n2 mr-1">
                        <template v-if="loading_a">
                          <v-progress-circular indeterminate size="15" color="light-blue darken-4"></v-progress-circular>
                        </template>
                        <template v-else-if="selected_column === 'type_a'">
                          <v-icon class="mdi mdi-check-circle" color="light-blue darken-4" small></v-icon>
                        </template>
                      </div>
                    </v-card>
                  </v-hover>
                </v-col>

                <v-col class="mt-6" cols="12" sm="12" md="6">
                  <v-hover v-slot="{ hover }">
                    <v-card @click="selectColumn('type_b')" :disabled="column_selected" :class="[selected_column === 'type_b' ? 'card-border-active' : 'card-border-inactive', hover ? 'hover-class' : '']" class="ml-1 mt-6 mb-6" height="300" width="330" color="grey lighten-3">
                      <v-row>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                          <div class="mt-3 mx-5 my-2" style="width: 290px; height: 55px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>

                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                          <div class="mt-n4 mx-5 my-2" style="width: 290px; height: 90px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>

                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                          <div class="mt-n4 mx-5 my-2" style="width: 290px; height: 75px; background-color: #a9a9a9; border-radius: 5px;"></div>
                        </v-col>
                      </v-row>

                      <div class="d-flex align-end justify-end mt-n4 mr-1">
                        <template v-if="loading_b">
                          <v-progress-circular indeterminate size="15" color="light-blue darken-4"></v-progress-circular>
                        </template>
                        <template v-else-if="selected_column === 'type_b'">
                          <v-icon class="mdi mdi-check-circle" color="light-blue darken-4" small></v-icon>
                        </template>
                      </div>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
          </v-tab-item>

          <v-tab-item>
              <v-row class="d-flex justify-center align-center" style="height: 368px;" dense>
                  <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="text-center">
                    <QrcodeVue :value="data_url" :size="150" renderAs="svg"/> 
                    <br/>
                    <h4 class="text-body-2 font-italic">For mobile user, please scan this Qr code to download the eCare App. </h4>
                    <br/>
                    <v-btn @click="proceedToEcareApp" color="blue darken-3" class="white--text"> proceed to eCare App</v-btn>
                  </v-col>
              </v-row>
          </v-tab-item>
        </v-tabs>

        <v-card-actions>
          <v-row justify="end" dense>
            <v-col cols="6" sm="5" md="3" lg="4" xl="4">
                <div class="d-flex justify-end mr-1">
                  <v-btn @click="closeTranslationDialog" :disabled="column_selected" class="grey white--text mr-2 mt-3" outlined>Close</v-btn>
                </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Alert :alert="alert" @leavePage="leavePage" />
  </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue';
import QrcodeVue from 'qrcode.vue'

export default {
  components: {
    Alert,
    QrcodeVue
  },

  data() {
    const settings = this.$store.state.usr_credentials.user_settings;

    return {
      translation_dialog: false,
      select_language: this.getSetting(settings.display_filipino_word),
      save_as_pdf_disabled: this.getSetting(settings.save_as_pdf_disabled),
      help_button: this.getSetting(settings.display_help),
      unit_conversion: settings.unit_conversion,
      alert: {},
      selected_column: settings.user_layout,
      tabs_value: 0,
      data_url: window.location.protocol + "//" + window.location.host + '/#/ecare-app',
      loading_language : false,
      loading_pdf: false,
      loading_btn: false,
      loading_a: false,
      loading_b: false,
      loading_unit_conversion: false,
      column_selected: false
    };
  },

  methods: {
    getSetting(value) {
      return value === "1" ? 1 : 0;
    },

    toggleTranslationMode() {
      this.translation_dialog = true;
    },

    toggleLanguage() {
      this.loading_language = true;

      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
       this.saveChanges();
      } else {
       this.leavePage();
      }

      this.loading_language = false;
    },

    toggleSaveAsPDF() {
      this.loading_pdf = true;

      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
       this.saveChanges();
      } else {
       this.leavePage();
      }

      this.loading_pdf = false;
    },

    toggleHelpButton() {
      this.loading_btn = true;

      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
       this.saveChanges();
      } else {
       this.leavePage();
      }

      this.loading_btn = false;
    },

    toggleUnitConversion() {
      this.loading_unit_conversion = true;

      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
       this.saveChanges();
      } else {
       this.leavePage();
      }

      this.loading_unit_conversion = false;
    },

    selectColumn(type) {
      if (type === this.selected_column) return; 

      if (type === 'type_a') {
        this.loading_a = true; 
        this.selected_column = 'type_a';
      } else {
        this.loading_b = true;  
        this.selected_column = 'type_b';
      }

      this.column_selected = true 
      
      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
        this.saveChanges();
      } else {
        this.leavePage();
      }

    },

    async saveChanges() {
      if (this.$router.currentRoute.path.includes('/emr-consultation')) {
        const body = 'This action will redirect you to the patient queue list page. Do you want to continue?';
        this.translation_dialog = true;

        this.alert = {
          display: true,
          type: 'standard',
          width: '420',
          icon: 'mdi-help-circle',
          color: 'blue darken-1',
          title: 'Display Change',
          body: body,
          btn_pry_txt: 'YES',
          btn_pry_color: 'primary',
          btn_pry_otl: false,
          btn_pry_act: 'closeAlert', 
          btn_pry_emt: 'leavePage',
          btn_sec_txt: 'NO',
          btn_sec_color: 'grey darken-2',
          btn_sec_otl: true,
          btn_sec_act: 'closeAlert'
        };

      } 
    },

    async leavePage() {
      const user_settings = {
        display_filipino_word : this.select_language ? "1" : "0",
        user_layout: this.selected_column,
        save_as_pdf_disabled : this.save_as_pdf_disabled ? "1" : "0",
        display_help : this.help_button ? "1" : "0",
        unit_conversion : this.unit_conversion ? "CU" : "SIU"
      };

      let response = await this.$services.usrUpdateSettings({
        user_settings: {
          provider_code: this.$store.state.prv_data.provider_code,
          user_code: this.$store.state.usr_credentials.user_code,
          ...user_settings,
        },
      });

      if (response.status === 200) {
        this.column_selected = false
        this.loading_a = false;
        this.loading_b = false;

        this.$store.dispatch('updateUserSettings', { user_settings });
        if (this.$router.currentRoute.path.includes('/emr-consultation')) {
          this.translation_dialog = true;
          this.$router.push('/patient-queue-list');
        } 
      } else {
        this.alert = response.error;
      }
    },

    closeTranslationDialog() {
      const settings = this.$store.state.usr_credentials.user_settings;

      this.translation_dialog = false;
      this.selected_column = settings.user_layout;
      this.select_language = this.getSetting(settings.display_filipino_word);
      this.save_as_pdf_disabled = this.getSetting(settings.save_as_pdf_disabled);
      this.help_button = this.getSetting(settings.display_help);
      this.unit_conversion = settings.unit_conversion;
      this.tabs_value = 0;
    },

    proceedToEcareApp() {
      window.open(this.data_url, '_blank')
    }
  }
};
</script>

<style scoped>
.card-border-inactive-top {
  background: #bedfff !important;
}

.card-border-active {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 60%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

.card-border-inactive {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}

.hover-class:hover {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

::v-deep .v-slide-group__wrapper {
  border-right: 1px solid rgb(0 0 0 / 20%);
}

</style>