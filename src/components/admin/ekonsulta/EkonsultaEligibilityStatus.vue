<template>
  <v-container class="pa-0">
    <section class="mx-auto">
        <v-card class="py-5 mx-auto" flat>
            <h1 class="font-weight-medium grey--text text--darken-3 mb-4">Yakap Eligibility Status</h1>
        
            <v-divider class="pb-5"></v-divider>
        
            <v-card width="100%" height="auto"> 
                <v-card-title class="d-flex justify-center"> VALIDATE PATIENT PINS </v-card-title>
                
                <v-form ref="pin_form" v-model="eligibility_form">
                    <div  class="px-5 py-5"  style="height: auto;">
                        <v-row v-for="(value, index) in pin" :key="index + '-' + value" align="center" justify="center">
                            <v-col cols="12" sm="5" class="d-flex align-center">
                                <v-text-field v-model="pin[index]" :rules="[required_validation]" maxlength="12" @keypress="numberOnly" dense placeholder="Input PIN" autofocus class="flex-grow-1"/>
                                <v-icon title="Delete" v-if="pin.length > 1" class="ml-2" @click="removePin(index)">mdi-delete</v-icon>
                            </v-col>
                        </v-row>
                    </div>
                </v-form>
                    
                <div class="d-flex justify-center py-5"> 
                    <v-btn color="primary" @click="validateEligibilityStatus"> VALIDATE PINS</v-btn>
                    <v-btn color="primary" outlined class="ml-2"  @click="addPin">
                        Add PIN
                    </v-btn>
               </div>
            </v-card>

            <v-divider class="mt-5 mb-3"/>

            <v-col class="text-right" cols="12" md="12" lg="12">
                EXPORT: <v-btn :disabled="this.patient_eligibility_status.length === 0" @click="exportToExcel" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
            </v-col>

            <v-data-table :headers="headers_eligibility_status" class="mt-4" :items="patient_eligibility_status" item-key="pin">
                  <template  v-slot:item="{ item }"> 
                    <tr> 
                        <td>{{item.pin}}</td>
                        <td>{{item.first_name}}</td>
                        <td>{{item.middle_name}}</td>
                        <td>{{item.last_name}}</td>
                        <td>
                            {{ item.status === "1" ? "Eligible" : "Not Eligible" }}<br>
                            {{ item.first_name ? "Registered in Ecare" : "Not Registered in Ecare" }}
                        </td>
                    </tr>
                  </template>
            </v-data-table>
           
            <v-overlay v-if="eligibility_validation_loader" z-index="9999"> 
                <v-progress-circular indeterminate size="35"></v-progress-circular>
                <span  class="ml-3 text-h6 font-weight-regular" >Validating... Please Wait...</span>
            </v-overlay>

            <v-dialog v-model="generate_excel_loader" width="500" persistent>
                <v-card class="text-center py-12">
                    <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                    <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
                </v-card>
            </v-dialog>
        </v-card>

        <Alert :alert="alert" />

    </section>
  </v-container>
</template>

<script>
import Alert from '@/components/Alert'

export default {
    components: { Alert },
    data() {
        return {
            pin:[''],
            patient_eligibility_status:[],

            headers_eligibility_status:[
                { text: 'Patient PIN', value: 'pin',sortable: true, align:'center'},
                { text: 'First Name', value: 'first_name', sortable: true, align:'center'},
                { text: 'Middle Name', value: 'middle_name', sortable: true, align:'center'},
                { text: 'Last Name', value: 'last_name', sortable: true, align:'center'},
                { text: 'Status', value: 'status', sortable: true, align:'center'},
            ],

            display_eligibility_validation: false,
            eligibility_validation_loader:false,
            eligibility_form: false,
            generate_excel_loader: false,
            alert: {},

            required_validation: v => !!v || 'PIN is required'
        }
    },

    methods: {
        eligibilityStatusDialog(val) {
            this.display_eligibility_validation = val
            this.patient_eligibility_status = []
            this.pin = ['']
        },

        async validateEligibilityStatus() {
            if (this.$refs.pin_form.validate()) {
                this.eligibility_validation_loader=true  
                
                let response = await this.$services.getEligibilityStatus({
                    pin: this.pin,
                    phic_token: this.$store.state.prv_data.phic_token
                })
                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
                    this.patient_eligibility_status = response.data
                    this.pin = ['']
                } else {
                    this.alert = { display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'Unable to validate Yakap due to PhilHealth server connection failure.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage'}
                } 
                this.eligibility_validation_loader  = false
                this.display_eligibility_validation = false
            }
        },

        addPin() {
            this.pin.push('')
        },

        removePin(index) {
            this.pin.splice(index, 1)
        },

        exportToExcel() {
            if (this.patient_eligibility_status) {
                this.generate_excel_loader = true
                const data_style = {
                    align: 'center',
                    alignVertical: 'center',
                    borderColor: '#000000',
                    wrap: true
                }

                let schema = [
                    { ...data_style, column: 'Patient PIN', value: value => value.pin, width: 30,},
                    { ...data_style, column: 'First Name', value: value => value.first_name, width: 30},
                    { ...data_style, column: 'Middle Name', value: value => value.middle_name, width: 30},
                    { ...data_style, column: 'Last Name', value: value => value.last_name, width: 30},
                    { ...data_style, column: 'Status', value: value => value.status === "1" ? 'Eligible' : value.status === "0" && value.first_name !== null ? 'Not Eligible' : 'Not Registed in Ecare'  , width: 30},
                ]

                const file_name_date = this.$moment().format('MM-DD-YYYY');
                const file_name_facility = this.$store.state.prv_data.provider_name;

                this.$excel_file(this.patient_eligibility_status, {
                    schema,
                    headerStyle: {
                        alignVertical: 'center',
                        borderColor: '#FFFFFF', 
                        fontWeight: 'bold',
                        backgroundColor: '#1565C0',
                        color:'#FFFFFF',
                        align: 'center',
                        wrap: true
                    },
                    fileName: `${file_name_facility} - Yakap Eligibility Status - ${file_name_date}.xlsx`
                })

                setTimeout(() => this.generate_excel_loader = false , 1000)
            }
        },

        numberOnly(event){
            if((event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        }
    }
}
</script>
