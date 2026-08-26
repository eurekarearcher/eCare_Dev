<template>
  <v-dialog v-model="show_philpen" class="d-print-none" width="1500" persistent>
    <div id="for-print-absolute">
      <v-card id="for-print-relative" class="px-8 pt-8 pb-3" flat>
          <div v-if="loading_data" class="text-center">
              <div class="my-16">
                  <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                  <h4 class="light-blue--text text--darken-4 mt-10 pl-5">Loading... Please wait...</h4>
              </div>
          </div>

          <div v-else id="for-print-philpen"> 
            <Header />

            <v-row dense class="mb-0">
              <v-col cols="12">
                <v-row class="mt-1" dense>
                  <v-col class="d-flex align-baseline" cols="12" xs="8" sm="8" md="8" lg="8" align-self="end">
                      NAME:
                      <span class="body-2 print-pat-info">{{ patient_info.mem_first_name + ' ' + (patient_info.mem_middle_name ? patient_info.mem_middle_name : '') + ' ' + patient_info.mem_last_name + ' ' + (patient_info.mem_suffix ? patient_info.mem_suffix : '') }}</span>
                  </v-col>
                  <v-col class="d-flex align-baseline" cols="12" xs="4" sm="4" md="4" lg="4" align-self="end"> 
                      AGE:
                      <span class="body-2 print-pat-info">{{  patient_info.mem_age  }}</span>
                  </v-col>
                  <v-col class="d-flex align-baseline" cols="12" align-self="end">
                      ADDRESS:
                      <span class="body-2 print-pat-info">{{ (patient_info.mem_home_bldgno ? patient_info.mem_home_bldgno + ' ' : '') + (patient_info.mem_home_bgy ? patient_info.mem_home_bgy + ' ' : '') + (patient_info.mem_home_city_municipality ? patient_info.mem_home_city_municipality + ' ' : '') + (patient_info.mem_home_province ? patient_info.mem_home_province + ' ' : '') + (patient_info.mem_home_zip ? patient_info.mem_home_zip + ' ' : '') }}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-card-title class="justify-center pt-12">NCD High-Risk Assessment</v-card-title>
            <v-card-subtitle class="text-center text-body-2 text-md-body-1 font-weight-medium grey--text text--darken-3">(Community Care Finding Form)</v-card-subtitle>
            <v-card-subtitle class="text-right text-body-2 text-md-body-1 font-weight-medium grey--text text--darken-3">Date: <span class="font-weight-regular">{{date_today}}</span></v-card-subtitle>

            <v-row dense>
             <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Family History</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">{{family_history !== ''? family_history : 'N/A'}}</v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Presence of absence of Diabetes</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">{{absence_of_diabetes !== ''? absence_of_diabetes : 'N/A'}}</v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Waist Circumference</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">
                  {{ riskAssessment(patient_info, pex_data, patient_social_history).waist }}
              </v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Systolic and Diastolic 1st reading</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">
                  {{ riskAssessment(patient_info, pex_data, patient_social_history).first_bp }}
              </v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Systolic and Diastolic 2nd reading</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">
                  {{ riskAssessment(patient_info, pex_data, patient_social_history).second_bp }}
              </v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Average Blood Pressure</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">
                  {{ riskAssessment(patient_info, pex_data, patient_social_history).average_bp }}
              </v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-3">Smoking (Tobacco / Cigarette)</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-3">
                  {{ riskAssessment(patient_info, pex_data, patient_social_history).smoking }}
              </v-col>

              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium mb-1">Alcoholic</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1 mb-1">{{alcoholic}}</v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-row dense>
              <v-col cols="12">
                <label class="text-body-2 text-md-body-1 font-weight-medium">High Fat / High Salt Food Intake</label>
                <v-row dense>
                  <v-col cols="8" sm="8" class="text-body-2 text-md-body-1">Eat processed food / fast food (e.g. instant noodles, hamburgers, fries, fried chicken skin, etc.) ihaw-ihaw (e.g. isaw, adidas, etc.) weekly</v-col>
                  <v-col cols="4" sm="4" class="text-body-2 text-md-body-1 text-center font-weight-medium">{{dietary_info.salt_intake}}</v-col>
                </v-row>
              </v-col>
            </v-row>
            
            <v-divider class="my-4"></v-divider>

            <v-row>
              <v-col cols="12">
                <label class="text-body-2 text-md-body-1 font-weight-medium">Dietary Fiber Intake</label>
                <v-row dense>
                  <v-col cols="8" sm="8" class="text-body-2 text-md-body-1 mb-2">2-3 serving of fruits daily</v-col>
                  <v-col cols="4" sm="4" class="text-body-2 text-md-body-1 text-center font-weight-medium mb-2">{{dietary_info.fruit_intake}}</v-col>

                  <v-col cols="8" sm="8" class="text-body-2 text-md-body-1">3 serving of vegetables daily</v-col>
                  <v-col cols="4" sm="4" class="text-body-2 text-md-body-1 text-center font-weight-medium">{{dietary_info.vegetable_intake}}</v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-row>
              <v-col cols="12">
                <label class="text-body-2 text-md-body-1 font-weight-medium">Physical Activity</label>
                <v-row dense>
                  <v-col cols="8" sm="8" class="text-body-2 text-md-body-1">Does atleast 2 1/2 hours a week of moderate intensity physical activity</v-col>
                  <v-col cols="4" sm="4" class="text-body-2 text-md-body-1 text-center font-weight-medium">{{dietary_info.physical}}</v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>


            <v-row dense>
              <v-col cols="5" sm="4" class="text-body-2 text-md-body-1 font-weight-medium">Risk Assessment Level:</v-col>
              <v-col cols="7" sm="8" class="text-body-2 text-md-body-1">
                  {{riskAssessment(patient_info, pex_data, patient_social_history).risk.value}}
                  <span v-if="riskAssessment(patient_info, pex_data, patient_social_history).risk.color" class="px-3 ml-5" :style="{'background-color' : riskAssessment(patient_info, pex_data, patient_social_history).risk.color}"></span>
              </v-col>
            </v-row>
          </div>
          <Footer @saveAsPDF="savePdf" @print="print" @close="show_philpen = false" :emr_params="emr_params"/>
      </v-card>  
    </div>
  </v-dialog>
</template>

<script>
// import * as risk_list from "@/reference/risk-assessment-level.json"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'
import { mapState } from "vuex";
import Header from '@/components/emr/printable-form/Header.vue';
import Footer from '@/components/emr/printable-form/Footer.vue'

export default {
  props:["date_today","patient_name", 'family_medical_history', 'patient_social_history', "pex_data", "dietary_information",  "jspdf" , "patient_info", "emr_params", "loading_data"],

  components: {
    Header,
    Footer
  },

  data() {
    return {
      medical_certificate: '',
      show_philpen: false
    }
  },

  computed: {
    ...mapState(['usr_credentials']),
    
    family_history() {
      const map = this.family_medical_history.map(element => element.description)
      
      return map.join(', ')
    },

    absence_of_diabetes() {
      const map = this.family_medical_history.map(element => element.description)
      const result = map.some(element => element.includes('DIABETES'))
      
      if (result) return 'Yes'
      else return 'N/A'
    },

    alcoholic() {
      let value = 'No'
      this.patient_social_history.map(item => {
        if (item.social_history === 'ALCOHOLIC' || item.social_history === 'OCCASIONAL ALCOHOLIC')  value =  item.social_history
      })
      return value
    },

    dietary_info() {
      const {high_fat_salt_intake, fiber_intake_fruit, fiber_intake_vegetable, physical_activity} = this.dietary_information
      let salt_intake = 'N/A', fruit_intake = 'N/A', vegetable_intake = 'N/A', physical = 'N/A'
      
      if (high_fat_salt_intake) {
        salt_intake = high_fat_salt_intake == '1' ? 'YES' : 'NO'
      }

      if (fiber_intake_fruit) {
        fruit_intake = fiber_intake_fruit == '1' ? 'YES' : 'NO'
      }

      if (fiber_intake_vegetable) {
        vegetable_intake = fiber_intake_vegetable == '1' ? 'YES' : 'NO'
      }

      if (physical_activity) {
        physical = physical_activity == '1' ? 'YES' : 'NO'
      }

      return {salt_intake, fruit_intake, vegetable_intake, physical}
    },

  },

  methods: {
    displayPhilpen(data) {
      this.show_philpen = data
    },

    print() {
      window.print()
    },

    savePdf() {
      html2canvas(document.getElementById('for-print-philpen')).then((canvas) => {
        let margin = 12.7; 
        let img_data = canvas.toDataURL('image/png');
        let page_width = 216;
        let page_height = 356;
        let img_width = page_width - 2 * margin; 
        let img_height = canvas.height * img_width / canvas.width; 
        let doc = new jsPDF('p', 'mm', 'a4');
        let height_left = img_height;
        let position = margin; 

        doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
        height_left -= page_height;
        while (height_left > 0) {
          position = height_left - img_height + margin;
          doc.addPage();
          doc.addImage(img_data, 'PNG', margin, position, img_width, img_height);
          height_left -= page_height;
        }

        doc.save(`${this.patient_info.mem_first_name} ${this.patient_info.mem_middle_name || ''} ${this.patient_info.mem_last_name} PHILPEN ${this.date_today}.pdf`)
      });
    }
  }
}
</script>

<style scoped>
.print-border-bottom{
    background: grey !important;
}
.print-pat-info{
    border-bottom: 1px solid grey; 
    margin: 18px 0 0 8px; 
    padding: 5px 0px 0px 0px; 
    width: 100%;
}
@media print{
    body *{
        background: white;
        width: 100% !important;
    }

    ::v-deep .v-dialog {
        box-shadow: none;
    }

    #for-print-philpen {
        width: 100%;
        padding: 0 !important;
    }

    #for-print-absolute{
        left: 0;
        position: absolute !important; 
        top: 0;
    }
}
</style>