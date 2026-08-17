<template>
    <div>
        <v-row class="px-1 mt-2" justify="space-between" align="center">
            <h2 class="font-weight-medium mb-5 align-self-end order-1 order-sm-0"> {{ header_title }}</h2>

            <v-col xs12 sm4 md3 class="order-0 order-sm-1 mb-5">
                <v-img v-if="prv_config && !is_doctor_transaction_record" :src="prv_config.provider_logo" class="ml-sm-auto mx-sm-0 mx-auto" height="60" width="180" max-width="200" alt="provider logo" contain></v-img>
            </v-col>
        </v-row>

        <v-row class="mt-n3 mb-5" justify="space-between" align="center" dense>
            <v-col cols="12" sm="12" md="10" lg="10" xl="10" pr-md="5">
                <v-text-field :value="search_tbl" @input="$emit('updateSearch', $event)" class="mb-2" placeholder="Search" outlined dense rounded hide-details></v-text-field>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2" class="text-right">
                <v-btn @click="$emit('resetTable')" color="secondary lighten-3">CLEAR SEARCHES<i class="fas fa-redo-alt pl-2 pt-1"></i></v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5" justify="space-between" align="start" dense>
            <v-col cols="12" xs="12" sm="12" md="5" lg="5" xl="5" >
                <v-row align="center" justify="space-between" dense>
                    <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2" align-self="center" pb-3>FILTER: <span class="pl-3">Date</span></v-col>

                    <v-col cols="12" xs="12" sm="6" md="5" lg="5" xl="5" pr-sm="2" mb-3>
                        <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="start_date_format" v-on="on" label="Start Date" outlined dense readonly hide-details></v-text-field>
                            </template>

                            <v-date-picker :value="start_date" :max="max_start_date" @input="$emit('updateStartDate', $event)"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" xs="12" sm="6" md="5" lg="5" xl="5" mb-3>
                        <v-menu :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="end_date_format" v-on="on" label="End Date" outlined dense readonly hide-details></v-text-field>
                            </template>
                            
                            <v-date-picker :value="end_date" :min="start_date" :disabled="!start_date" @input="$emit('updateEndDate', $event)"></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="5" lg="5" xl="5" align-self="end">
                <v-row dense>
                    <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6" pr-sm="2" >
                        <v-select v-if="!is_doctor_transaction_record && !is_childcare_and_services && !is_mortality && !is_natality && !is_teleconsult_que_list" :value="transaction_status" :items="trans_status" @input="$emit('updateTransactionStatus', $event)" item-text="selection" item-value="data" label="Transaction Status" height="10" outlined dense hide-details></v-select>
                        <v-select v-if="is_doctor_transaction_record" :value="transaction_type" :items="trans_type" @input="$emit('updateTransactionType', $event)" item-text="selection" item-value="data" label="Transaction Type" height="10" outlined dense hide-details></v-select>
                    </v-col>

                    <v-col v-if="!is_doctor_transaction_record && !is_childcare_and_services && !is_mortality && !is_natality && !is_teleconsult_que_list" cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                        <v-select :value="transaction_type" :items="trans_type" @input="$emit('updateTransactionType', $event)" item-text="selection" item-value="data" label="Transaction Type" height="10" outlined dense hide-details></v-select>
                    </v-col>

                    <v-col v-if="!is_teleconsult_patient_list && !is_patient_queue_list && !is_childcare_and_services && !is_mortality && !is_natality && !is_teleconsult_que_list" cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
                        <v-select :value="type_of_visit" :items="type_of_visit_items" @input="$emit('updateTypeOfVisit', $event)" label="Type of Visit" height="10" outlined dense hide-details></v-select>
                    </v-col>
                </v-row>

                <v-row justify="end" dense>
                    <v-col v-if="is_patient_queue_list" cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                        <v-select :value="type_of_visit" :items="type_of_visit_items" @input="$emit('updateTypeOfVisit', $event)" label="Type of Visit" height="10" outlined dense hide-details></v-select>
                    </v-col>               

                    <v-col v-if="is_childcare_and_services" cols="12" sm="12" md="6" lg="5" xl="5" class="text-right mt-n5 mb-2">
                        <v-btn @click="$emit('addChildCare')" color="primary" >Add Child Care and Services <v-icon color="white" right>mdi-plus</v-icon></v-btn>
                    </v-col>

                    <v-col v-if="is_mortality" cols="12" sm="12" md="6" lg="5" xl="5" class="text-right mt-n5 mb-2">
                        <v-btn @click="$emit('addMortality')" color="primary" style="width: 190px;" >Add Mortality <v-icon color="white" right>mdi-plus</v-icon></v-btn>
                    </v-col>

                    <v-col v-if="is_natality" cols="12" sm="12" md="6" lg="5" xl="5" class="text-right mt-n5 mb-2">
                        <v-btn @click="$emit('addNatality')" color="primary" style="width: 190px;" >Add Natality <v-icon color="white" right>mdi-plus</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" align-self="start">
                <!-- <v-row class="mt-2" justify="space-between" align="center" no-gutters dense>
                    <v-col v-if="is_teleconsult_patient_list || is_patient_queue_list && !is_teleconsult_que_list" cols="12" md="6" lg="6" xl="6">
                        <v-row align="baseline" no-gutters>
                            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                                <v-switch :disabled="loading_tbl" @click="$emit('getSelectQueue')" class="mx-1" height="41" color="success" label="Select Queue" inset dense hide-details></v-switch>
                            </v-col>
                            <v-col v-if="show_cancel_checkbox" cols="12" sm="2" md="2" lg="2" xl="2">
                                <v-btn :disabled="current_selected_queue.length === 0" @click="$emit('cancelQueue')" color="primary" height="41"> Cancel Selected Queue </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row> -->

                <v-row v-if="is_teleconsult_patient_list || is_patient_queue_list && !is_teleconsult_que_list" class="mt-1" justify="space-between" align="center" no-gutters dense>
                    <v-col cols="12" md="6" xs="12">
                        <v-switch :disabled="loading_tbl" @click="$emit('getSelectQueue')" class="mx-1" height="41" color="success" label="Select Queue" inset dense hide-details></v-switch>
                    </v-col>

                    <v-col cols="12" md="6" xs="12" class="d-flex  justify-start justify-md-end">
                        <template v-if="show_cancel_checkbox">
                            <v-btn :disabled="current_selected_queue.length === 0" @click="$emit('cancelQueue')" class="ml-2 mt-4" color="primary"  height="41">Cancel Selected Queue</v-btn>
                        </template>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: [
        'header_title',
        'search_tbl', 
        'start_date', 
        'end_date', 
        'max_start_date',
        'transaction_status', 
        'transaction_type', 
        'type_of_visit', 
        'trans_status', 
        'trans_type',
        'type_of_visit_items',
        'current_selected_queue',
        'is_teleconsult_patient_list', 
        'show_cancel_checkbox', 
        'loading_tbl',
        'is_doctor_transaction_record',
        'is_patient_queue_list',
        'prv_config',
        'is_childcare_and_services',
        'is_mortality',
        'is_natality',
        'is_teleconsult_que_list'
        ],
    
    computed: {
        start_date_format() {
            return this.start_date ? this.formatDate(this.start_date) : null
        },

        end_date_format() {
            return this.end_date ? this.formatDate(this.end_date) : null
        },
    }
};
</script>