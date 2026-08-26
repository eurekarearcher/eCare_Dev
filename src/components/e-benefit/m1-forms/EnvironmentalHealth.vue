<template>
  <v-container fluid>
    <Navbar  :navbar="navbar" />

    <v-card class="mx-auto mt-8" width="880" >
        <div class="py-4 primary white--text text-center">
        <h4><v-icon size="18" left dark>fas fa-hand-holding-medical</v-icon>Questionaire for Environmental Health and Sanitation Services</h4>
        </div>
        <v-form @submit.prevent="proceedNextStep" ref="ehss_form" class="pa-7">
            <v-row dense>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mr-4"> 1. No. of household with access to basic safe water supply? </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4" class="d-flex"> 
                    <v-text-field v-model="level_1" class="mr-1" placeholder="Level 1" underlined dense> </v-text-field>
                    <v-text-field v-model="level_2" class="mx-1" placeholder="Level 2" underlined dense> </v-text-field>
                    <v-text-field v-model="level_3" class="ml-1" placeholder="Level 3" underlined dense> </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mr-4"> 2. No. of household with basic sanitation facility? </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mx-4"> a. No. of household with pour/flush toilet connected to septic tank?  </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4" class="d-flex"> 
                    <v-text-field v-model="flush_toilet_septic_tank" @keypress="numberOnly" underlined dense> </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mx-4"> b. No. of household with pour/flush toilet connected to community sewer/sewerage system or any other approved treatment system? </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4" class="d-flex"> 
                    <v-text-field v-model="flush_toilet_sewer" @keypress="numberOnly" underlined dense> </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mx-4"> c. No. of household with ventilated improved pit latrine </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4" class="d-flex"> 
                    <v-text-field v-model="vip" @keypress="numberOnly" underlined dense> </v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="8" align-self="center"> 
                    <h5 class="font-weight-medium mr-3"> 3. No. of household industrial establishment issued with sanitary permit? </h5>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4" class="d-flex"> 
                    <v-text-field v-model="issued_sanitary_permit" @keypress="numberOnly" underlined dense> </v-text-field>
                </v-col>
            </v-row>

            <div class="d-flex justify-end align-center ml-4">
                <v-radio-group v-model="select_option" row :error="selected_option" dense>
                    <v-radio label="Add" value="add"></v-radio>
                    <v-radio label="Replace" value="replace"></v-radio>
                </v-radio-group>
            </div>

            <v-card-actions class="justify-center pt-2 pb-5">
                <v-btn type="submit" class="primary elevation-0 px-5" :loading="loading_btn">Submit</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>

    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue'
import Navbar from '@/components/Navbar.vue'

export default {
    components: {
        Alert,
        Navbar
    },

    data() {
        return {
            loading_btn: false,
            level: '',
            flush_toilet_septic_tank: '',
            flush_toilet_sewer: '',
            vip: '',
            issued_sanitary_permit: '',
            level_1: '',
            level_2: '',
            level_3: '',

            alert: {},
            get_session: {},

            navbar: [
                { title: "Child Care and Services", link: "/child-care-and-services", icon: "fas fa-folder" },
                { title: "Mortality", link: "/mortality", icon: "fas fa-folder" },
                { title: "Natality", link: "/natality", icon: "fas fa-folder" },
                { title: "EHSS", link: "/ehss", icon: "fas fa-folder" },
                { title: "Home", link: "/code-scanning", icon: "fas fa-home" },
            ],

            ehss_level: [
                { title: 'Level 1', value: '1'},
                { title: 'Level 2', value: '2'},
                { title: 'Level 3', value: '3'},
            ],

            select_option: null,
            selected_option: false

        }
    },

    methods: {
        async proceedNextStep() {
            this.loading_btn = true
            let response = await this.$services.trnAddM1EnvironmentalHealth({
                provider_code: this.$store.state.prv_data.provider_code,
                level_1: this.level_1,
                level_2: this.level_2,
                level_3: this.level_3,
                flush_toilet_septic_tank: this.flush_toilet_septic_tank,
                flush_toilet_sewer: this.flush_toilet_sewer,
                vip: this.vip,
                issued_sanitary_permit: this.issued_sanitary_permit,
                add_replace: this.select_option,
                created_by: this.$store.state.usr_credentials.user_name
            })

            if(response.status === 200) {
                this.loading_btn = false

                if(!response.data.success) {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'yellow', title: 'Something went wrong!', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                } else {
                    this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-check-circle', color: 'success', title: 'Environmental Health and Sanitation Services', body: 'Form has been successfully submitted', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
                }
                
                this.$refs.ehss_form.reset()
            } else {
                this.alert = response.error
            }
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        }
    }
}
</script>

<style scoped>
.ehss-input {
    width: 120px;
}
</style>