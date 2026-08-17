<template>

    <div class="d-flex"> 
        <v-btn v-if="this.$store.state.prv_data.separate_ekas_epress != '1'" @click="viewForm('ekassepress')" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Ekas and Epress</v-btn>
        <v-btn v-if="this.$store.state.prv_data.separate_ekas_epress != '0'" @click="viewForm('ekass')" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Ekas</v-btn>
        <v-btn v-if="this.$store.state.prv_data.separate_ekas_epress != '0'" @click="viewForm('epress')" class="d-block mt-4 mb-6 mr-4" color="#367c9d" small dark>View Epress</v-btn>
        <Ekass 
            :patient_info="patient_info"
            :ekonsulta_data="ekonsulta_data"
            :diagnostic_procedure="diagnostic_procedure"
            :transaction_number="phic_transaction_number"
            :atc_code="atc_code"
            :history_and_pe="history_and_pe"
            :prescribed_doctor="prescribed_doctor"
            :loading_data="loading_data"
            :show_ekass="show_ekass"
            :phic_logo="phic_logo"
            @close_form="show_ekass = false"
        />
        <Epress 
            :patient_info="patient_info"
            :ekonsulta_data="ekonsulta_data"
            :prescribe_medicine="prescribe_medicine"
            :prescribed_doctor="prescribed_doctor"
            :doc_prc_license="doc_prc_license"
            :doc_ptr_no="doc_ptr_no"
            :doc_s2_no="doc_s2_no"
            :loading_data="loading_data"
            :transaction_number="phic_transaction_number"
            :show_epress="show_epress"
            :phic_logo="phic_logo"
            @close_form="show_epress = false"
        />
        <EkassEpress 
            :patient_info="patient_info"
            :ekonsulta_data="ekonsulta_data"
            :prescribe_medicine="prescribe_medicine"
            :prescribed_doctor="prescribed_doctor"
            :doc_prc_license="doc_prc_license"
            :doc_ptr_no="doc_ptr_no"
            :doc_s2_no="doc_s2_no"
            :diagnostic_procedure="diagnostic_procedure"
            :transaction_number="phic_transaction_number"
            :atc_code="atc_code"
            :history_and_pe="history_and_pe"
            :loading_data="loading_data"
            :show_ekass_epress="show_ekass_epress"
            :phic_logo="phic_logo"
            @close_form="show_ekass_epress = false"
        />
    </div>
</template>

<script>
import Ekass from '@/components/emr/printable-form/ekass-epress/Ekass'
import Epress from '@/components/emr/printable-form/ekass-epress/Epress'
import EkassEpress from '@/components/emr/printable-form/ekass-epress/EkassEpress'
import phic_logo from '@/assets/philhealth_3Dlogo.png'

export default {
    props: ['transaction_number', 'patient_info'],

    components: {
        Ekass,
        Epress,
        EkassEpress
    },

    data() {
        return {
            show_ekass: false,
            show_epress: false,
            show_ekass_epress: false,
            diagnostic_procedure: {},
            prescribe_medicine: [],
            history_and_pe: {},
            prescribed_doctor: '',
            phic_transaction_number: '',
            doc_prc_license: '',
            doc_ptr_no: '',
            doc_s2_no: '',
            atc_code: '',
            ekonsulta_data: sessionStorage.getItem('YETBS') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('YETBS'), 'ygrGk2dX').toString(this.$crypto.enc.Utf8)) : null,
            loading_data: false,
            phic_logo: phic_logo
        }
    },

    methods: {
        async viewForm(title_form) {
            this.loading_data = true;
            this.show_ekass = false;
            this.show_epress = false;
            this.show_ekass_epress = false;

            // Remove any existing print styles to avoid conflict
            let existing_style = document.getElementById("dynamic-print-style");
            if (existing_style) {
                existing_style.remove();
            }

            // Create a new print style based on the selected form
            let print_style = document.createElement("style");
            print_style.id = "dynamic-print-style";

            if (title_form === "ekass") {
                this.show_ekass = true;
                print_style.innerHTML = `
                    @media print {
                        @page {
                            size: letter portrait !important;
                            margin: 5mm !important;
                        }
                }
                `;
            } else if (title_form === "epress") {
                this.show_epress = true;
                print_style.innerHTML = `
                    @media print {
                        @page {
                            size: letter portrait !important;
                            margin: 5mm !important;
                        }
                    }
                `;
            } else if (title_form === "ekassepress") {
                this.show_ekass_epress = true;
                print_style.innerHTML = `
                    @media print {
                        @page {
                            size: letter landscape !important;
                            margin: 2mm !important;
                        }
                    }
                `;
            }

            // Append the new style to the head
            document.head.appendChild(print_style);

            let response = await this.$services.getPhicEkassEpressFormData({
                transaction_number: this.transaction_number, 
                pHciCaseNo: this.ekonsulta_data.pHciCaseNo
            });

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data);
                this.diagnostic_procedure = response.data.diagnostic_procedure;
                this.history_and_pe = response.data.history_and_physical_examination;
                this.prescribe_medicine = response.data.medicine;
                this.atc_code = response.data.atc;
                this.prescribed_doctor = response.data.doctor;
                this.doc_prc_license = response.data.doc_prc_license;
                this.doc_ptr_no = response.data.doc_ptr_no;
                this.doc_s2_no = response.data.doc_s2_no;
                this.phic_transaction_number = response.data.pHciTransNo;
                this.loading_data = false;
            } else {
                this.alert = response.error;
            }
        }

    }
}
</script>