<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" lg="11" xl="9">
        <!-- TAB -->
        <v-tabs v-model="active_tab" @change="edit_btn = true, edit_field = false" background-color="grey lighten-3" color="grey darken-2" light grow>
          <v-tab>Disclaimer</v-tab>
          <v-divider vertical></v-divider>
          <v-tab>About Us</v-tab>
          <v-divider vertical></v-divider>
          <v-tab v-if="this.$store.state.prv_config.eclaims_accre">Eclaims Cloud Storage</v-tab>
          <v-tabs-slider color="grey"></v-tabs-slider>
        </v-tabs>

        <div class="mt-8 text-center">
          <h4>{{ contents[active_tab].title }}</h4>
          <template v-if="active_tab === 0">
            <p v-if="$store.state.prv_config.provider_disclaimer" class="text-justify mb-7 white-space">{{ $store.state.prv_config.provider_disclaimer }}</p>
            <p v-else class="text-justify grey--text font-italic mb-7">No content for now</p>
            
            <div v-show="edit_btn" class="text-right mt-10 mb-7">
              <v-btn @click="edit_btn = false, edit_field = true" color="blue darken-3" dark>{{ $store.state.prv_config.provider_disclaimer ? 'Edit' : 'Create'}}</v-btn>
            </div>
          </template>

          <template v-else-if="active_tab === 1">
            <p v-if="$store.state.prv_config.provider_about_us" class="text-justify mb-7 white-space">{{ $store.state.prv_config.provider_about_us }}</p>
            <p v-else class="text-justify grey--text font-italic mb-7">No content for now</p>
            
            <div v-show="edit_btn" class="text-right mt-10 mb-7">
              <v-btn @click="edit_btn = false, edit_field = true" color="blue darken-3" dark>{{ $store.state.prv_config.provider_about_us ? 'Edit' : 'Create'}}</v-btn>
            </div>
          </template>

          <template v-else>
            <!-- <p v-if="$store.state.prv_config.acces_cloud_storage" class="text-justify mb-7 white-space">{{ $store.state.prv_config.acces_cloud_storage }}</p>
            <p v-else class="text-justify grey--text font-italic mb-7">No content for now</p>

            <div v-show="edit_btn" class="text-right mt-10 mb-7">
              <v-btn @click="edit_btn = false, edit_field = true" color="blue darken-3" dark>{{ $store.state.prv_config.acces_cloud_storage ? 'Edit' : 'Create'}}</v-btn>
            </div> -->
            <v-switch v-model="contents[active_tab].new_value" @change="updateDisclaimer(contents[active_tab].fkey)" inset label="Allow Cloud Storage Access" color="primary"/>
          </template>

          <div v-show="edit_field">
            <v-divider></v-divider>
            <h4 class="mt-7 mb-3 text-left">Edit {{ contents[active_tab].title }}:</h4>
            <v-textarea v-model="contents[active_tab].new_value" :placeholder="'Enter the new '+contents[active_tab].title+' here'" rows="12" outlined></v-textarea>
            <div class="text-right pb-5">
              <v-btn @click="edit_btn = true, edit_field = false" class="mr-3" color="grey darken-1" dark>Cancel</v-btn>
              <v-btn @click="checkEmptyFields(contents[active_tab])" color="green darken-3" dark>Save</v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    
    <Alert :alert="alert" @updateDisclaimer="updateDisclaimer" />
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue"

export default {
  components: {
    Alert
  },

  data(){
    return{
      contents: [
        { title: 'Disclaimer', new_value: null, fkey: 'update_provider_disclaimer' },
        { title: 'About Us', new_value: null, fkey: 'update_provider_about_us' },
        { title: 'Eclaims Cloud Storage', new_value: null, fkey: 'update_provider_eclaims_cloud_storage' }
      ],
      active_tab: 0,
      edit_btn: true,
      edit_field: false,
      alert: {}
    }
  },
  
  created(){
    this.contents[2].new_value = this.$store.state.prv_config.access_cloud_storage === '1';
  },

  methods:{
    // CHECK EMPTY FIELDS
    checkEmptyFields(item){
      if(item.new_value){
        this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-help-circle', color: 'primary', title: 'This will replace the content of '+item.title, body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_params: item.fkey, btn_pry_emt: 'updateDisclaimer', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }else{
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Field is empty/Invalid Value', body: 'Please enter the new '+item.title, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },
  
    async updateDisclaimer(fkey) {
      let new_value = {};

      if (fkey === 'update_provider_disclaimer') {
        new_value = { provider_disclaimer: this.contents[this.active_tab].new_value };
      } else if (fkey === 'update_provider_about_us') {
        new_value = { provider_about_us: this.contents[this.active_tab].new_value };
      } else {
        new_value = { access_cloud_storage: this.contents[this.active_tab].new_value ? '1': '0'};
      }

        let response = await this.$services.admUpdProviderConfig({
          provider_tin: this.$store.state.prv_data.provider_tin,
          provider_code: this.$store.state.prv_data.provider_code,
          process_by: this.$store.state.usr_credentials.user_name,
          fkey: fkey,
          ...(new_value)
        });

        if (response) {
          this.$store.state.prv_config.access_cloud_storage = this.contents[this.active_tab].new_value ? '1' : '0';
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Update Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
        } else {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
        }
        localStorage.removeItem('dskDo3Y');
    }
  }
};
</script>

<style scoped>
.white-space{
  white-space: pre-line
}
</style>