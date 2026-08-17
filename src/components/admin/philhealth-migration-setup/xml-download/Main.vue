<template>
  <v-container class="home fill-height">

    <div class="mx-auto">
        <v-card width="830" class="py-5">
            <v-tabs v-model="tab_type" class="px-3">
                <v-tab v-if="$store.state.prv_data.ekonsulta_phic_acc_no">Yakap</v-tab>
                <v-tab v-if="$store.state.prv_data.eclaim_phic_acc_no">E-Claims</v-tab>
            </v-tabs>
            
            <v-divider class="mt-3"/>

            <v-tabs-items v-model="tab_type" @change="downloadXmlFile">
                <v-tab-item>
                    <h1 class="primary--text font-weight-medium text-center mt-10">YAKAP</h1>
                    <h3 class="text-center font-weight-regular mb-5">Downloading of Encrypted Xml File</h3>
                </v-tab-item>
                    
                <v-tab-item>
                    <h1 class="primary--text font-weight-medium text-center mt-10">e-Claims</h1>
                    <h3 class="text-center font-weight-regular mb-5">Downloading of Encrypted Xml File</h3>
                </v-tab-item>
            </v-tabs-items>

            <v-form ref="xml" class="px-15">
                <div class="d-flex align-center mb-2">
                    <div style="width: 120px;">
                    <label>Start Date</label>
                    </div>

                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="start_date" v-mask="date_mask" :rules="field_rules" placeholder="MM-DD-YYYY" class="ml-2" readonly/>
                    </template>

                    <v-date-picker v-model="start_date_picker" @change="start_date = formatDate(start_date_picker)" :max="max_start_date" no-title />
                    </v-menu>
                </div>
  
                <div class="d-flex align-center mb-2">
                    <div style="width: 120px;">
                    <label>End Date</label>
                    </div>

                    <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="end_date" v-mask="date_mask" :rules="field_rules" placeholder="MM-DD-YYYY" class="ml-2" readonly/>
                    </template>
                    <v-date-picker v-model="end_date_picker" @change="end_date = formatDate(end_date_picker)" :max="max_start_date" :min="start_date_picker" no-title />
                    </v-menu>
                </div>

                <div v-if="this.tab_type === 0" class="d-flex align-center mb-2">
                    <div style="width: 120px;">
                    <label>Tranche #</label>
                    </div>
                    <v-select v-model="tranch_no" :items="yakap_items" item-value="value" item-text="type" :rules="field_rules" class="ml-2" max-width="290px" min-width="290px"  dense/>
                </div>

                <div class="d-flex align-start mb-3">
                    <v-checkbox v-model="agree_checkbox" :rules="field_rules" hide-details class="mt-0 pt-0 mr-2"/>
                    <h4 class="caption red--text text--darken-2">
                        I agree to proceed with the XML download and understand that all our accounts will be deactivated within 24 hours.
                    </h4>
                </div>

                <v-btn class="primary mt-5 mb-15" large block @click="downloadXmlFile">
                    DOWNLOAD ENCRYPTED XML
                </v-btn>
            </v-form>
        </v-card>
    </div>

    <Alert :alert="alert" />
  </v-container>
</template>

<script>
import Alert from '@/components/Alert'

export default {
  components: {
    Alert
  },

  data() {
    return {
        tab_type: 0,
        start_date: '',
        start_date_picker: '',
        end_date: '',
        end_date_picker: '',
        max_start_date: this.$moment().format('YYYY-MM-DD'),
        agree_checkbox: false,
        field_rules: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],
        alert : {},

        tranch_no: "",
        yakap_items: [
            { type: 'Tranche 1', value: 1 },
            { type: 'Tranche 2', value: 2 }
        ],
    }
  },
  
  watch: {
    tab_type() {
        this.$refs.xml.reset()
    }
  },

  methods: {
    async downloadXmlFile() {
        if (this.$refs.xml.validate()) {  
            this.$emit("downloadOverlayValue",true)

            const payload = {
                provider_code: this.$store.state.prv_data.provider_code,
                start_date: this.start_date,
                end_date: this.end_date,
                phic_accre_no: this.tab_type === 0 ? this.$store.state.prv_data.ekonsulta_phic_acc_no : undefined,
                report_tagging: this.tab_type === 0 ? this.tranch_no : undefined
            }

            let response = await (this.tab_type === 0 ? this.$services.downloadYakapDisengagementXml(payload) : this.$services.eclaimsMigrationDownload(payload))

            if (response.status === 200) {
                if (response.data.success) {

                    const url = response.data.file_url
                    const data = await fetch(url);
                    const blob = await data.blob();
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    
                    let filename = ""
                    if(this.tab_type === 0) {
                        filename = new URL(url).searchParams.get("file")
                    } else {
                        filename = new URL(url).pathname.split("/").pop();
                    }
                   
                    link.download = filename
                   
                    link.click();
                    URL.revokeObjectURL(link.href);

                    this.$emit("downloadOverlayValue",false)
                    this.$refs.xml.reset()
                    
                } else { 
                    this.$emit("downloadOverlayValue",false)
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data.message, body: 'Please try again',  btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
                }
            } else{ 
                this.$emit("downloadOverlayValue",false)
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something is wrong', body: "Failed to generate the xml encrypted file",  btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' };
            }
        }
    }
  }
}
</script>
