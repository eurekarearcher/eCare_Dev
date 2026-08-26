<template>
  <v-container id="view-forms" fluid>
    <Navbar :navbar="navbar" id="navbar" />
    <v-row class="sticky" id="menubar" wrap>
      <div class="col-lg-1 col-sm-1 col-1"></div>
      <div v-if="$vuetify.breakpoint.mdAndUp" class="col-lg-10 col-sm-10 pb-0">
        <v-toolbar color="light-blue darken-2" dark>
          <v-btn @click="$route.path !== '/eclaims-migrated-cfforms/claim-info' ? $router.push('/eclaims-migrated-cfforms/claim-info') : $route.path" text dark :class="{'active-class' : $route.params.configuration === 'claim-info'}"  small>Claim Info</v-btn>
          <v-btn @click="$route.path !== '/eclaims-migrated-cfforms/cf1' ? $router.push('/eclaims-migrated-cfforms/cf1') : $route.path" text dark :class="{'active-class' : $route.params.configuration === 'cf1'}"  small>CF1</v-btn>
          <v-btn @click="$route.path !== '/eclaims-migrated-cfforms/cf2' ? $router.push('/eclaims-migrated-cfforms/cf2') : $route.path" text dark :class="{'active-class' : $route.params.configuration === 'cf2'}"  small>CF2</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-show="$route.path !== '/eclaims-migrated-cfforms/claim-info'" small text dark @click="save"><v-icon small left>fas fa-file-pdf</v-icon>SAVE</v-btn>
          <v-btn v-show="$route.path !== '/eclaims-migrated-cfforms/claim-info'" small text dark @click="print"><v-icon small left>fas fa-print</v-icon>PRINT</v-btn>
        </v-toolbar>
      </div>

    </v-row>

    <v-row wrap justify="center" class="px-4 mb-5" id="content"> <!-- HEADERS -->
      <v-col cols="12" sm="10" md="10" lg="10" xl="10" class="elevation-3 frm-overflow" id="content-box">
        <v-row v-if="data_loader === true" wrap align="center" justify="center" class="pa-5">
          <v-progress-circular v-if="data_loader === true && catchError === false"  color="primary" indeterminate ></v-progress-circular>
          <span v-if="data_loader === true && catchError === false" class="subtitle-1 grey--text text--darken-2 mx-3">Loading Forms.... Please Wait</span>
          <span v-else class="subtitle-1 grey--text text--darken-2 mx-3">Failed to load the data. Please refresh your browser</span>
        </v-row>
        <template>
          <ClaimInfo v-if="$route.params.configuration === 'claim-info'" :cf1_data="migrated_cf_data.CF1" :offline_documents="migrated_cf_data.offline_document" :claim_info="migrated_cf_data.claim_info" class="frm-width  untouchable" id="claim_info" ref="claim_info"/>
          <CF1 v-if="$route.params.configuration === 'cf1'" :cf1_data="migrated_cf_data.CF1" :claim_info="migrated_cf_data.claim_info" class="frm-width  untouchable" id="cf1_page1" ref="for_cf1"/>
          <CF2 v-if="$route.params.configuration === 'cf2'" :cf2_data="migrated_cf_data" class="frm-width  untouchable" id="cf2_page1" ref="for_cf2"/>
         </template>
      </v-col>  
    </v-row>
    <span id="bottom"></span>
  </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import CF1 from './CF1.vue'
import CF2 from './CF2.vue'
import ClaimInfo from './ClaimInfo'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  components: {
    Navbar,
    CF1,
    CF2,
    ClaimInfo
  },

  data() {
    return {
        migrated_cf_data: JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('MftrIDjk'), 'msjYdhl').toString(this.$crypto.enc.Utf8)),
        navbar: [
            { title: "Migrated Records", link: "/eclaims-migrated-records", icon: "fa-file-import" }
        ],

        data_loader: false,
        catchError: false
    }
  },

  methods: {
    save(){
      window.scrollTo(0, 0)
      
      const file_name_facility = this.$store.state.prv_data.provider_name
      const patient_name = `${this.migrated_cf_data.CF1.patient_first_name} ${this.migrated_cf_data.CF1.patient_middle_name} ${this.migrated_cf_data.CF1.patient_last_name}`

      this.save_loader = true;
      document.getElementById(this.$route.params.configuration+'_page1').classList.add('pdf-mode');
      this.$nextTick(() => {
        html2canvas(document.getElementById(this.$route.params.configuration+'_page1')).then((canvas) => {
            let margin = 12.7; 
            let img_data = canvas.toDataURL('image/png');
            let page_width = 216;
            let page_height = 356;
            let img_width = page_width - 2 * margin; 
            let img_height = canvas.height * img_width / canvas.width; 
            let doc = new jsPDF('p', 'mm', 'legal');
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
            
            doc.save(`${patient_name}_${file_name_facility}_${this.$route.params.configuration}.pdf`);
            
            document.getElementById(this.$route.params.configuration+'_page1').classList.remove('pdf-mode');
            this.save_loader = false;
        });
      });
    },
    
    print() {
      window.print();
    },
  }
};
</script>

<style scoped>
.sticky{
  background:white;
  padding-top: 20px;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 60px;
  z-index: 3;
}


.active-class{
  border-bottom:2px solid white;
  border-radius:0
}

.button-style {
  position: absolute;
  width: 6%;
}
.frm-overflow{overflow-x:scroll}
.frm-width{
  width: 1240px;
}
.m-auto{margin:auto}


#cf1_page1, #cf2_page1, #claim_info {
  margin:auto
}

@media print {
  #navbar, #footer, #menubar, #scroll-down, #scroll-up{
    display: none;
    padding:0 !important; 
    margin:0 !important
  }
  
  #content{
    visibility: hidden;
    padding:0 !important; 
    margin:10px !important;
  }

  .col-lg-10,
  .col-sm-10 {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }

  #cf1_page1, #cf2_page1,#claim_info {
    width:100%;
    visibility: visible;
  }
}

.print-button{
  cursor: pointer;
  margin-top: 265px;
  padding: 20px 37px;
  position: fixed;
}
@page {
  size: legal;
  margin: 5mm -15mm 5mm -15mm; 
}
</style>