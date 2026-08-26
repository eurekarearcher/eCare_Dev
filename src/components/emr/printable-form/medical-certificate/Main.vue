<template>
   <v-dialog v-model="show_dialog" :width="'215.9mm'" persistent>
   <!-- <v-dialog v-model="show_dialog" :width="1400" persistent> -->
   
        <template v-if="$store.state.usr_credentials.lgu_host_code === 'BT'">
            <Bataan @close="close" :jspdf="jspdf" :data="data" :select_management="select_management" :doctor_notes="doctor_notes" :emr_params="emr_params"/>
        </template>

        <template v-else-if="$store.state.usr_credentials.lgu_host_code === 'AT'">
            <Antipolo @close="close" :jspdf="jspdf" :data="data" :select_management="select_management" :doctor_notes="doctor_notes" :input_undersigned="input_undersigned" :input_remarks="input_remarks" :medical_certificate_qr_value="medical_certificate_qr_value" :emr_params="emr_params"/>
        </template>

        <template v-else-if="this.$store.state.usr_credentials.lgu_host_code === 'SR'"> 
            <SantaRosa @close="close" :jspdf="jspdf" :data="data" :select_management="select_management" :doctor_notes="doctor_notes" :input_remarks="input_remarks"  :input_diagnose="input_diagnose" :emr_params="emr_params"/>
        </template>

        <template v-else-if="$store.state.usr_credentials.lgu_host_code === 'LC'">
            <template v-if="$store.state.prv_data.municipality === 'PAGBILAO'"> 
                <PagBilao @close="close" :jspdf="jspdf" :data="data" :doctor_notes="doctor_notes" :emr_params="emr_params"/>
            </template>
            
            <template v-else-if="$store.state.prv_data.municipality === 'ATIMONAN'"> 
                <Atimonan @close="close" :jspdf="jspdf" :data="data" :input_remarks="input_remarks" :emr_params="emr_params"/>
            </template>

            <template v-else> 
                <Quezon @close="close" :jspdf="jspdf" :data="data" :input_remarks="input_remarks" :emr_params="emr_params"/>
            </template>
        </template>

        <template v-else-if="$store.state.usr_credentials.lgu_host_code === 'PQ'">
            <template>
                <Paranaque @close="close" :jspdf="jspdf" :data="data" :input_diagnose="input_diagnose" :input_due="input_due" :emr_params="emr_params"/>
            </template>
        </template>

        <template v-else-if="$store.state.usr_credentials.lgu_host_code === 'PTB'">
            <template>
                <Labworx @close="close" :jspdf="jspdf" :data="data" :input_remarks="input_remarks" :emr_params="emr_params"/>
            </template>
        </template>

        <template v-else>
            <Bataan @close="close" :jspdf="jspdf" :data="data" :select_management="select_management" :doctor_notes="doctor_notes" :emr_params="emr_params"/>
        </template>
   </v-dialog>
</template>

<script>
import Antipolo from '@/components/emr/printable-form/medical-certificate/Antipolo.vue'
import Bataan from '@/components/emr/printable-form/medical-certificate/Bataan.vue'
import Quezon from '@/components/emr/printable-form/medical-certificate/quezon/QMC.vue'
import PagBilao from '@/components/emr/printable-form/medical-certificate/quezon/PagBliao'
import Atimonan from '@/components/emr/printable-form/medical-certificate/quezon/Atimonan.vue'
import Paranaque from '@/components/emr/printable-form/medical-certificate/Paranaque.vue'
import SantaRosa from '@/components/emr/printable-form/medical-certificate/SantaRosa.vue'
import Labworx from '@/components/emr/printable-form/medical-certificate/Labworx.vue'

export default {
    props: ['doctor_notes', 'select_management', 'emr_params', 'jspdf'],

    components: {
        Antipolo,
        Bataan,
        Quezon,
        PagBilao,
        Atimonan,
        Paranaque,
        SantaRosa,
        Labworx
    },

    data() {
        return {
            show_dialog: false,
            include_lab_and_prescription: false,
            data: {
                date_admitted: '',
                patient_name: '',
                address: '',
                age: '',
                ek_lgu_id: '',
                impression_diagnosis: [],
                laboratory_request: [],
                selected_medicine: [],
                doctor_name: '',
                doctor_specialization: '',
                doctor_prc_license: '',
                input_undersigned_field: '',
                input_remarks_field: '',
                input_due_field: '',
                input_diagnose_field: ''
            },
            input_undersigned: false,
            input_remarks: false,
            input_diagnose: false,
            input_due: false,
            print_own: false,
            medical_certificate_qr_value: '',
        }
    },

    methods: {
        editForms() {
            this.input_undersigned = !this.input_undersigned
            this.input_remarks = !this.input_remarks
            this.input_diagnose = !this.input_diagnose
            this.input_due = !this.input_due
        },

        openMedicalCertificate(data) {
            this.data = data;
            this.medical_certificate_qr_value =`City: ${this.$store.state.prv_data.municipality}\nProvince: ${this.$store.state.prv_data.province}\nProvider Name: ${this.$store.state.prv_data.provider_name}\nMember Name: ${this.data.patient_name}\nMember ID: ${this.data.ek_lgu_id}\nCertificate Date Issued: ${this.formatDate(this.data.date_admitted)}`;
            this.show_dialog = true;
        },
        
        print() {
            window.scrollTo(0, 0);
            window.print();
        },

        close() {
            this.show_dialog = false;
        }
    }
}
</script>
