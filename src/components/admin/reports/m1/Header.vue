<template>
    <div>
        <table class="mb-4" cellspacing="0">
            <tr class="darken-3 blue">
                <td colspan="41">
                    <h6 class="font-weight-bold white--text body-1 pl-1">M1 REPORT</h6>
                </td>
            </tr>
        </table>
        
        <table cellspacing="0">
            <tr>
                <td style="width: 20%">
                    <h6 class="font-weight-bold text-center display-4 my-n2">M1</h6>
                    <h6 class="font-weight-black text-center display-1">{{ $store.state.usr_credentials.provider_reg_type }}</h6>
                </td>

                <td style="width: 60%">
                    <v-card class="elevation-0" >
                        <div cols="12" class="mt-2" >
                            <v-row>
                                <v-col cols="5">
                                    <!-- Filter Tabs -->
                                    <v-tabs class="tab-filter" v-model="tab">
                                        <v-tab v-for="(filter, index) in filters" :key="index">{{ filter.name }}</v-tab>
                                    </v-tabs>

                                    <v-tabs-items v-model="tab">
                                        <!-- Monthly Report Tab -->
                                        <v-tab-item>
                                            <v-row>
                                                <v-col cols="6">
                                                    <h6 class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                                        Month:
                                                        <v-select v-model="selected_month" :items="month_items"
                                                                :disabled="loading_data"
                                                                class="body-2 px-2"
                                                                style="width: 150px"
                                                                hide-details dense />
                                                        Year: 
                                                        <v-select v-model="selected_year" :items="year_items"
                                                                :disabled="loading_data"
                                                                class="body-2 px-2"
                                                                style="width: 150px"
                                                                hide-details dense />
                                                    </h6>
                                                </v-col>
                                            </v-row>
                                        </v-tab-item>

                                        <!-- Quarterly Report Tab -->
                                        <v-tab-item>
                                            <v-row>
                                                <v-col cols="6">
                                                    <h6 class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                                        Quarter:
                                                        <v-select v-model="selected_quarter" :items="[1, 2, 3, 4]"
                                                                :disabled="loading_data"
                                                                class="body-2 px-2"
                                                                style="width: 150px"
                                                                hide-details dense />
                                                        Year: 
                                                        <v-select v-model="selected_quarter_year" :items="year_items"
                                                                :disabled="loading_data"
                                                                class="body-2 px-2"
                                                                style="width: 150px"
                                                                hide-details dense />
                                                    </h6>
                                                </v-col>
                                            </v-row>
                                        </v-tab-item>

                                        <!-- Annual Report Tab -->
                                        <v-tab-item>
                                            <v-row>
                                                <v-col cols="6">
                                                    <h6 class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                                        Year:
                                                        <v-select v-model="selected_annual"
                                                                class="body-2 px-2"
                                                                :items="year_items"
                                                                :disabled="loading_data"
                                                                style="width: 150px"
                                                                hide-details dense />
                                                    </h6>
                                                </v-col>
                                            </v-row>
                                        </v-tab-item>
                                    </v-tabs-items>
                                </v-col>

                                <v-col cols="6" class="pt-16 pl-1">
                                    <v-btn :disabled="loading_data" @click="onLoadData" class="white--text" color="primary" small>
                                        <v-icon color="white" left>mdi-update</v-icon>
                                        <span>LOAD SELECTED DATES</span>
                                    </v-btn>
                                    <v-btn @click="exportToExcel" class="ml-3" color="success" :disabled="!is_excel_button_enabled" small>
                                        <v-icon left>mdi-microsoft-excel</v-icon> Excel
                                    </v-btn>
                                </v-col>
                            </v-row>
                    
                            <!-- FOR BRGY -->
                            <template v-if="$store.state.usr_credentials.provider_reg_type === 'BRGY'">
                                <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                    Name of Barangay:
                                    <span class="font-weight-bold text-decoration-underline text-uppercase">{{ $store.state.prv_data.provider_name }}</span>
                                </h6>

                                <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                    Name of BHS:
                                    <span class="font-weight-bold text-decoration-underline text-uppercase">{{ $store.state.prv_data.provider_name }}</span>
                                </h6>
                            </template>

                            <!-- FOR RHU -->
                            <template v-else-if="$store.state.usr_credentials.provider_reg_type === 'RHU'">
                                <h6 class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                    Name of BRGY:
                                    <span v-if="$store.state.usr_credentials.lgu_host_code === 'AT'" class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_list[1] ? prv_list[1].prv_barangay :'' }}</span>
                                    <v-autocomplete v-else v-model="selected_prv_filter" :items="prv_list" :loading="loading_prv_list" :disabled="loading_data" class="body-2 px-2" item-text="prv_name" hide-no-data return-object hide-details dense></v-autocomplete>
                                </h6>

                            <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                    Name of BHS<span v-if="$store.state.usr_credentials.lgu_host_code === 'AT'">/RHU</span>:
                                    <span v-if="$store.state.usr_credentials.lgu_host_code === 'AT'" class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_list[1] ? prv_list[1].prv_bhs :'' }}</span>
                                    <span v-else class="font-weight-bold text-decoration-underline text-uppercase">{{ selected_prv_filter.prv_name === 'ALL' ? '' : selected_prv_filter.prv_name }}</span>
                                </h6>
                            </template>

                            <!-- FOR PHO -->
                            <h6 v-else-if="$store.state.usr_credentials.provider_reg_type === 'PHO'" class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                Name of MHO/CHO:
                                <v-autocomplete v-model="selected_prv_filter" :items="prv_list" :loading="loading_prv_list" :disabled="loading_data" class="body-2 px-2" item-text="prv_name" hide-no-data return-object hide-details dense></v-autocomplete>
                            </h6>

                            <!-- FOR MHO -->
                            <h6 v-else class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                Name of RHU:
                                <v-autocomplete v-model="selected_prv_filter" :items="prv_list" :loading="loading_prv_list" :disabled="loading_data" class="body-2 px-2" item-text="prv_name" hide-no-data return-object hide-details dense></v-autocomplete>
                            </h6>

                            <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                Name of Municipality / City:
                                <span class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_data.municipality }}</span>
                            </h6>

                            <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                Name of Province:
                                <span class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_data.province }}</span>
                            </h6>
                        </div>
                    </v-card>
                </td>
                
                
                <td style="width: 20%">
                    <v-img class="mx-auto" src="@/assets/ecare-logo.png" height="140" width="140" contain></v-img>
                </td>
            </tr>
        </table>

        <!-- GENERATE EXCEL LOADER -->
        <v-dialog v-model="generate_excel_loader" width="500" persistent>
            <v-card class="text-center py-12">
                <v-progress-circular color="primary" width="6" size="80" indeterminate></v-progress-circular>
                <h3 class="light-blue--text text--darken-4 pl-5 mt-5">Generating Excel...</h3>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            tab: 0,
            year_items:  [...Array(5)].map((a, b)=> new Date().getFullYear() - b),
            selected_year: new Date().getFullYear(),
            
            month_items: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            selected_month: this.$moment().format('MMMM'),
            selected_annual: new Date().getFullYear(),
            selected_quarter: 1,
            selected_quarter_year: new Date().getFullYear(),
            filters: [
                { name: 'Monthly' },
                { name: 'Quarterly' },
                { name: 'Annually' },
            ],
            selected_filter_type: '',
            
            loading_prv_list: true,
            prv_list: [],
            selected_prv_filter: {
                provider_code: '',
                provider_tin: '',
                prv_name: 'ALL',
                prv_type: '',
                prv_barangay: '',
                prv_bhs: ''
            },
            
            loading_data: false,
            disabled_btn: true,
            generate_excel_loader: false,
            annual_data_loaded: false,
            quarterly_data_loaded: false,
            monthly_data_loaded: false,
        }
    },

    created() {
        if (this.$store.state.usr_credentials.provider_reg_type !== 'BRGY') {
            this.getProviderListByFacility();
        }
    },

    watch: {
        tab(newVal) {
            let selected_filter_type = '';
            if (newVal === 0) {
                selected_filter_type = 'monthly';
            } else if (newVal === 1) {
                selected_filter_type = 'quarterly';
            } else if (newVal === 2) {
                selected_filter_type = 'annually';
            }
            this.$emit('filterTypeChanged', selected_filter_type);
        }
    },

    computed: {
        ...mapState(['usr_credentials', 'prv_data']),

        is_excel_button_enabled() {
            if (this.tab === 0) return this.monthly_data_loaded 
            if (this.tab === 1) return this.quarterly_data_loaded
            if (this.tab === 2) return this.annual_data_loaded
            return false
        }
    },

    methods: {
        onLoadData() {
            if (this.tab === 0) {
                this.selected_filter_type = 'monthly'
                this.monthly_data_loaded = true
            } else if (this.tab === 1) {
                this.selected_filter_type = 'quarterly'
                this.quarterly_data_loaded = true
            } else if (this.tab === 2) {
                this.selected_filter_type = 'annually'
                this.annual_data_loaded = true
            }

            this.loadSelectedDate();
        },

        async getProviderListByFacility() {
            let response = await this.$services.getProviderListByFacility({
                key: this.$store.state.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            })

            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                                    
                if (response.data.has_data) {
                    response.data.provider_list.push({
                        provider_code: this.$store.state.prv_data.provider_code,
                        provider_tin: '',
                        prv_name: this.$store.state.prv_data.provider_name,
                        prv_type: '',
                        prv_barangay: response.data.provider_list[0].prv_barangay,
                        prv_bhs: response.data.provider_list[0].prv_bhs
                    })
                    this.prv_list.push({
                        provider_code: this.$store.state.prv_data.provider_code,
                        provider_tin: '',
                        prv_name: this.$store.state.prv_data.provider_name,
                        prv_type: '',
                        prv_barangay: response.data.provider_list[0].prv_barangay,
                        prv_bhs: response.data.provider_list[0].prv_bhs},
                        ...response.data.provider_list
                    )
                }

                this.prv_list.unshift(this.selected_prv_filter)
                this.loading_prv_list = false
            } else {
                this.alert = response.error
            }  
        },

        loadSelectedDate() {
            this.disabled_btn = false;

            const selected_month = this.month_items.indexOf(this.selected_month) + 1;

            let payload = {
                provider: this.selected_prv_filter
            };

            switch (this.selected_filter_type) {
                case 'monthly':
                    payload.request_key = 'monthly';
                    payload.month = selected_month;
                    payload.year = this.selected_year; 
                    break;
                
                case 'quarterly':
                    payload.request_key = 'quarterly';
                    payload.quarter = this.selected_quarter; 
                    payload.year = this.selected_quarter_year; 
                    break;

                case 'annually':
                    payload.request_key = 'annually';
                    payload.year = this.selected_annual;
                    break;
            }
            this.$emit('filters', {
                    selected_filter_type: this.selected_filter_type,
                    month: selected_month,
                    year: this.selected_year,
                    annual: this.selected_annual,
                    quarter: this.selected_quarter,
                    quarter_year: this.selected_quarter_year,
                });
            this.$emit('loadSelectedDate', payload);
        },

        exportToExcel() {
            this.generate_excel_loader = true
            setTimeout(() => {
                this.generate_excel_loader = false
                this.$emit('exportExcel')
            }, 1000)
        }
    }
}
</script>

<style scoped>
table { width: 100%; }
table, th, td { 
    border-collapse: separate; 
    border: 1px solid lightgrey; 
}
td { padding: 5px; }
#content {
    overflow-x: auto; 
    overflow-y: hidden; 
}
#content table { min-width: 1400px; }
</style>