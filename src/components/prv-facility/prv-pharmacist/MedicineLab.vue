<template>
    <v-container fluid class="height-100 color-text px-7 px-lg-7">
        <Navbar :navbar="navbar"/>
        <ViewMedicine ref="view"/>
        <Alert :alert="alert"/>
    </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue'
import ViewMedicine from '@/components/e-benefit/dispense-medicine/ViewMedicine.vue'
import Navbar from '@/components/Navbar.vue'
import { mapState } from 'vuex'


export default {

    components : {
        Alert,
        Navbar,
        ViewMedicine
    },

    data() { 
        return {
            tbl_items: [],
            navbar: [
                { title: "HOME", link: "/pvt-pharmacist", icon: "mdi-home" },
            ],
            dispense_btn_loader: false,
            alert: {},
            edit_med: true,
            tbl_loading: true,
        }
    },

    computed: {
        ...mapState(['pvt_facility_data', 'usr_credentials'])
    },

    mounted() {
        this.getMedicinePrescribed();
    },

    methods : {
        async getMedicinePrescribed() {
            this.tbl_loading = true;
        
            let response = await this.$services.getPvtFacilityTransaction({
                request_key: 'prescribed_medicine',
                transaction_number: this.pvt_facility_data.transaction_number,
                ek_lgu_id: this.pvt_facility_data.ek_lgu_id
            });

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data);
                this.tbl_loading = false;
                if (response.data.has_data) {
                    const patient_name = this.combineString([response.data.first_name, response.data.middle_name, response.data.last_name, response.data.suffix]);
                    const medicines = Array.isArray(response.data.transaction_medicine) ? response.data.transaction_medicine.map(medicine => ({
                        ...medicine,
                        available_to_dispensed: medicine.total_dispensed_medicine ? medicine.total_prescribed_medicine - medicine.total_dispensed_medicine : medicine.total_prescribed_medicine - 0
                    })) : [];

                    const data = {
                        patient_name: patient_name,
                        medicines: medicines,
                        transaction_number: this.pvt_facility_data.transaction_number
                    };

                    this.$refs.view.openViewMedicine(data);
                }
            } else {
                this.alert = response.error;
            }
        },
    }
}
</script>
