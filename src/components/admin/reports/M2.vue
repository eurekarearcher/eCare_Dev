<template>
    <div id="content">
        <table class="mb-4" cellspacing="0">
            <tr class="darken-3 blue">
                <td colspan="41">
                    <h6 class="font-weight-bold white--text body-1 pl-1">M2 REPORT</h6>
                </td>
            </tr>
        </table>

        <table cellspacing="0" style="width: 100%">
            <tr>
                <td style="width: 20%">
                    <h6 class="font-weight-bold text-center display-4 my-n2">M2</h6>
                    <h6 class="font-weight-black text-center display-1">{{ usr_credentials.provider_reg_type }}</h6>
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
                                    <v-btn @click="exportToExcel" class="ml-3" color="success" :disabled="!is_excel_button_enabled"  small>
                                        <v-icon left>mdi-microsoft-excel</v-icon> Excel
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <!-- FOR BRGY -->
                            <template v-if="usr_credentials.provider_reg_type === 'BRGY'">
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
                            <template v-else-if="usr_credentials.provider_reg_type === 'RHU'">
                                <h6 class="text-body-2 text--darken-3 blue--text d-inline-flex align-baseline mb-1">
                                    Name of BRGY:
                                    <span v-if="usr_credentials.lgu_host_code === 'AT'" class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_list[1] ? prv_list[1].prv_barangay :'' }}</span>
                                    <v-autocomplete v-else v-model="selected_prv_filter" :items="prv_list" :loading="loading_prv_list" :disabled="loading_data" class="body-2 px-2" item-text="prv_name" hide-no-data return-object hide-details dense></v-autocomplete>
                                </h6>

                                <h6 class="text-body-2 text--darken-3 blue--text mb-1">
                                    Name of BHS<span v-if="usr_credentials.lgu_host_code === 'AT'">/RHU</span>:
                                    <span v-if="usr_credentials.lgu_host_code === 'AT'" class="font-weight-bold text-decoration-underline text-uppercase">{{ prv_list[1] ? prv_list[1].prv_bhs :'' }}</span>
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
                                <v-autocomplete v-model="selected_prv_filter" :items="prv_list" :loading="loading_prv_list" :disabled="loading_data" class="body-2 px-2" item-text="prv_name" return-object hide-details dense></v-autocomplete>
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

        <table class="mt-4" cellspacing="0">
            <tr class="white--text text-center darken-3 blue">
                <td colspan="41">
                    <h6 class="font-weight-bold body-1">Section A.1. Morbidity Report</h6>
                </td>
            </tr>
        
            <!-- AGE GROUP -->
            <tr class="font-weight-medium white--text text-center body-2 darken-3 blue">
                <th rowspan="2" style="min-width: 150px">DISEASE</th>
                <th rowspan="2" style="min-width: 120px">ICD-10 CODE</th>
                <th colspan="2" style="min-width: 40px">0-6 Days</th>
                <th colspan="2" style="min-width: 40px">7-28 Days</th>
                <th colspan="2" style="min-width: 40px">29 Days <br>- 11 Mos</th>
                <th colspan="2" style="min-width: 40px">1-4 y/o</th>
                <th colspan="2" style="min-width: 40px">5-9 y/o</th>
                <th colspan="2" style="min-width: 40px">10-14 y/o</th>
                <th colspan="2" style="min-width: 40px">15-19 y/o</th>
                <th colspan="2" style="min-width: 40px">20-24 y/o</th>
                <th colspan="2" style="min-width: 40px">25-29 y/o</th>
                <th colspan="2" style="min-width: 40px">30-34 y/o</th>
                <th colspan="2" style="min-width: 40px">35-39 y/o</th>
                <th colspan="2" style="min-width: 40px">40-44 y/o</th>
                <th colspan="2" style="min-width: 40px">45-49 y/o</th>
                <th colspan="2" style="min-width: 40px">50-54 y/o</th>
                <th colspan="2" style="min-width: 40px">55-59 y/o</th>
                <th colspan="2" style="min-width: 40px">60-64 y/o</th>
                <th colspan="2" style="min-width: 40px">65-69 y/o</th>
                <th colspan="2" style="min-width: 40px">>= 70 y/o</th>
                <th colspan="2" style="min-width: 40px">TOTAL</th>
                <th colspan="2" rowspan="2" style="min-width: 40px">TOTAL BOTH SEX</th>
            </tr>

            <tr class="font-weight-medium white--text text-center body-2 darken-3 blue">
                <template v-for="n in 19">
                    <th :key="n+'M'" style="min-width: 30px;">M</th>
                    <th :key="n+'F'" style="min-width: 30px;">F</th>
                </template>
            </tr>

            <!-- MALE OR FEMALE -->
            <template v-if="!loading_data">
                <template v-for="(value, index) in morbidity_data">
                    <tr :key="index+'code'" class="text-center body-2">
                        <td class="text-left">{{ value.description }}</td>
                        <td>{{ value.icd_10_code }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.m['0 - 6 days'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.f['0 - 6 days'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.m['7 - 28 days'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.f['7 - 28 days'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.m['29 days - 11 months'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.f['29 days - 11 months'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.m['1 - 4 years'] }}</td>
                        <td :class="{'untouchable' : index === 30}">{{ value.group.f['1 - 4 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['5 - 9 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['5 - 9 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['10 - 14 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['10 - 14 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['15 - 19 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['15 - 19 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['20 - 24 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['20 - 24 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['25 - 29 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['25 - 29 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['30 - 34 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['30 - 34 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['35 - 39 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['35 - 39 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['40 - 44 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['40 - 44 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['45 - 49 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['45 - 49 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['50 - 54 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['50 - 54 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['55 - 59 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['55 - 59 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['60 - 64 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['60 - 64 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['65 - 69 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['65 - 69 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.m['>= 70 years'] }}</td>
                        <td :class="{'untouchable' : index === 29}">{{ value.group.f['>= 70 years'] }}</td>
                        <td>{{ value.group.m['Total'] }}</td>
                        <td>{{ value.group.f['Total'] }}</td>
                        <td class="total-both-sex">{{value.total_gender}}</td>
                    </tr>
                    
                    <tr v-if="index === 28" :key="index+'other'" class="white--text text-center darken-3 blue">
                        <td colspan="41">
                            <h6 class="font-weight-bold font-italic body-1">Other Diseases</h6>
                        </td>
                    </tr>
                </template>

                <tr>
                    <td class="text-right" colspan="40"><b>TOTAL:</b></td>
                    <td class="text-center"><b>{{total_both_sex}}</b></td>
                </tr>
            </template>
        </table>
        
        <div v-show="loading_data" class="text-center" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>
        <br>

        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert  from '@/components/Alert.vue'
import { mapState } from 'vuex';

export default {
    components: {
        Alert
    },

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

            disabled_btn: true,
            generate_excel_loader: false,

            provider_name: '',
            month: '',
            year: '',
            
            loading_data: false,
            morbidity_data: [
                { 
                    description: 'Acute Bloody Diarrhea', 
                    icd_10_code: 'A09.0 (Bloody)', 
                    icd_group_code: 'ICD1',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Acute Flaccid Paralysis', 
                    icd_10_code: 'G83.9', 
                    icd_group_code: 'ICD3',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Acute Hemorrhagic Fever Syndrome (Dengue)', 
                    icd_10_code: 'A97.0-A97.2', 
                    icd_group_code: 'ICD4',
                    group: { m: {}, f: {} } 
                },	
                { 
                    description: 'Acute Lower Respiratory Tract Infection', 
                    icd_10_code: 'J22', 
                    icd_group_code: 'ICD5',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Acute Watery Diarrhea', 
                    icd_10_code: 'A09.0 (Watery)', 
                    icd_group_code: 'ICD2',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Animal Bites', 
                    icd_10_code: 'T14.1', 
                    icd_group_code: 'ICD6',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Cholera', 
                    icd_10_code: 'A00.0-A00.9', 
                    icd_group_code: 'ICD7',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Diphtheria', 
                    icd_10_code: 'A36.0 - A36.9', 
                    icd_group_code: 'ICD8',
                    group: { m: {}, f: {} } 
                },			
                { 
                    description: 'Filariasis', 
                    icd_10_code: 'B74.0-B74.9', 
                    icd_group_code: 'ICD9',
                    group: { m: {}, f: {} } 
                },	
                { 
                    description: 'Influenza', 
                    icd_10_code: 'J11.1', 
                    icd_group_code: 'ICD10',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Influenza-like Illness', 
                    icd_10_code: 'J11.1', 
                    icd_group_code: 'ICD11',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Leprosy', 
                    icd_10_code: 'A30.0-A30.9', 
                    icd_group_code: 'ICD12',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Leptospirosis', 
                    icd_10_code: 'A27.0-A27.9', 
                    icd_group_code: 'ICD13',
                    group: { m: {}, f: {} } 
                },	
                { 
                    description: 'Malaria', 
                    icd_10_code: 'B50-B54', 
                    icd_group_code: 'ICD14',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Measles', 
                    icd_10_code: 'B05.0-B05.9', 
                    icd_group_code: 'ICD15',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Meningcoccemia', 
                    icd_10_code: 'A39.2-A39.4', 
                    icd_group_code: 'ICD16',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Neonatal Tetanus', 
                    icd_10_code: 'A33', 
                    icd_group_code: 'ICD17',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Non-neonatal tetanus', 
                    icd_10_code: 'A35', 
                    icd_group_code: 'ICD18',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Paralytic Shellfish Poisining', 
                    icd_10_code: 'T61.2', 
                    icd_group_code: 'ICD19',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Pneumonia', 
                    icd_10_code: 'J18.90-J18.99', 
                    icd_group_code: 'ICD20',
                    group: { m: {}, f: {} } 
                },	
                { 
                    description: 'Schistosomiasis', 
                    icd_10_code: 'B65.0-B65.9', 
                    icd_group_code: 'ICD21',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Typhoid and Paratyphoid', 
                    icd_10_code: 'A01.1-A01.4', 
                    icd_group_code: 'ICD22',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Viral Encephalitis', 
                    icd_10_code: 'A83-A86', 
                    icd_group_code: 'ICD23',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Viral Hepatitis (Acute)', 
                    icd_10_code: 'B15-B17', 
                    icd_group_code: 'ICD24',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Viral Meningitis', 
                    icd_10_code: 'A87.0-A87.9', 
                    icd_group_code: 'ICD25',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Syphilis', 
                    icd_10_code: 'A50-A53', 
                    icd_group_code: 'ICD26',
                    group: { m: {}, f: {} } 
                },		
                { 
                    description: 'Gonorrhea', 
                    icd_10_code: 'A54.0-A54.9', 
                    icd_group_code: 'ICD27',
                    group: { m: {}, f: {} } 
                },	
                { 
                    description: 'Urethral Discharge', 
                    icd_10_code: 'R36', 
                    icd_group_code: 'ICD28',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'Genital Ulcer', 
                    icd_10_code: 'N48.5, N50.8, N76.5, N76.6, N89.8', 
                    icd_group_code: 'ICD29',
                    group: { m: {}, f: {} } 
                },
                { 
                    description: 'ARI for below 5',
                    icd_10_code: '',
                    icd_group_code: 'ICD39',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'ARI for 5 and above',
                    icd_10_code: '',
                    icd_group_code: 'ICD39',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'COPD (Chronic Obstructive Pulmonary Disease)', 		
                    icd_10_code: '',
                    icd_group_code: 'ICD40',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'Disease of the Heart',	
                    icd_10_code: '',
                    icd_group_code: 'ICD41',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'Skin Diseases',
                    icd_10_code: '',
                    icd_group_code: 'ICD42',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'Tuberculosis (All forms)',	
                    icd_10_code: '',
                    icd_group_code: 'ICD43',
                    group: { m: {}, f: {} }
                },
                { 
                    description: 'UTI',
                    icd_10_code: '',
                    icd_group_code: 'ICD44',
                    group: { m: {}, f: {} }
                }
            ],
            
            total_both_sex: 0,
            alert: {},
            annual_data_loaded: false,
            quarterly_data_loaded: false,
            monthly_data_loaded: false,
        }
    },

    created() {
        if (this.usr_credentials.provider_reg_type !== 'BRGY') {
            this.getProviderListByFacility();
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

            this.getMorbidityReportsByProvider();
        },

        async getProviderListByFacility() {
            let response = await this.$services.getProviderListByFacility({
                key: this.usr_credentials.provider_reg_type,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.usr_credentials.lgu_host_code
            })

            if(response.status === 200) {
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

        async getMorbidityReportsByProvider() {
            this.loading_data = true
            
            let key = ''
            let provider_code = ''

            if (this.selected_prv_filter.prv_name === 'ALL') {
                key = this.usr_credentials.provider_reg_type
                provider_code = this.$store.state.prv_data.provider_code
            } else {
                key = this.selected_prv_filter.prv_type,
                provider_code = this.selected_prv_filter.provider_code
            }

            const selected_month = this.month_items.indexOf(this.selected_month) + 1

            this.provider_name = this.selected_prv_filter.prv_name
            this.month = selected_month
            this.year = this.selected_year

            let payload = {
                key: key,
                provider_code: provider_code,
                year: this.selected_year 
            };
            
            switch (this.selected_filter_type) { 
                case 'monthly':
                    payload.request_key = 'monthly';
                    payload.month = selected_month;
                    break;
                
                case 'quarterly':
                    payload.request_key = 'quarterly';
                    payload.quarter = this.selected_quarter; 
                    break;

                case 'annually':
                    payload.request_key = 'annually';
                    break;

                default:
                    console.error("Unknown filter type");
                    return;
            }
            
            let response = await this.$services.getM2MorbidityReportsByProvider(payload);

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.disabled_btn = false
                const result = response.data
                const age_group = {
                    '0 - 6 days': 0,
                    '7 - 28 days': 0,
                    '29 days - 11 months': 0,
                    '1 - 4 years': 0,
                    '5 - 9 years': 0,
                    '10 - 14 years': 0,
                    '15 - 19 years': 0,
                    '20 - 24 years': 0,
                    '25 - 29 years': 0,
                    '30 - 34 years': 0,
                    '35 - 39 years': 0,
                    '40 - 44 years': 0,
                    '45 - 49 years': 0,
                    '50 - 54 years': 0,
                    '55 - 59 years': 0,
                    '60 - 64 years': 0,
                    '65 - 69 years': 0,
                    '>= 70 years': 0,
                    'Total': 0
                }

                const icd_code_arr = this.morbidity_data.map(element => element.icd_group_code)

                for (key in result) {
                    if (!icd_code_arr.includes(key)) {
                        this.morbidity_data.push({
                            description: result[key][0].icd_group_name,
                            icd_10_code: '',
                            icd_group_code: key,
                            group: { m: {}, f: {} }
                        })
                    }
                }

                for (let index = 0; index < this.morbidity_data.length; index++) {
                    const key = this.morbidity_data[index].icd_group_code

                    if (Object.entries(result).length === 0 || !(key in result)) {
                        this.morbidity_data[index].group.m = age_group
                        this.morbidity_data[index].group.f = age_group
                    } else {
                        const setARIData = function(result) { // Seperates the value of ARI in 2 rows
                            let new_total = 0

                            for (const key in result) {
                                if (index === 29) {
                                    if (key.includes('days') || key === '1 - 4 years') {
                                        new_total += parseInt(result[key])
                                    }
                                } else {
                                    if (key.includes('years') && key !== '1 - 4 years') {
                                        new_total += parseInt(result[key])
                                    }
                                }
                            }
                            
                            return new_total
                        }
                    
                        if (result[key][0].mem_gender === 'M') {
                            this.morbidity_data[index].group.m = Object.assign({}, result[key][0])
                            if (index === 29 || index === 30) this.morbidity_data[index].group.m['Total'] = setARIData(result[key][0])
   
                            // There will be no female data if index 0 is male so set the female data to 0
                            this.morbidity_data[index].group.f = age_group
                        } else {
                            this.morbidity_data[index].group.f = Object.assign({}, result[key][0])
                            if (index === 29 || index === 30) this.morbidity_data[index].group.f['Total'] = setARIData(result[key][0])

                            // Check if theres a second index for male data then either get or set the value to 0
                            if (result[key].length > 1) {         
                                this.morbidity_data[index].group.m = Object.assign({}, result[key][1])
                                if (index === 29 || index === 30) this.morbidity_data[index].group.m['Total'] = setARIData(result[key][1])
                            } else {
                                this.morbidity_data[index].group.m = age_group
                            }
                        }
                    }
                }
                
                // GET TOTAL BOTH SEX PER ROW and OVERALL TOTAL
                this.total_both_sex = 0
                
                this.morbidity_data.map(items => {
                    items.total_gender = Object.values(items.group).reduce((sum, data) => sum = sum + parseInt(data.Total) , 0)

                    this.total_both_sex = this.total_both_sex + items.total_gender
                    return items
                })
                
                this.loading_data = false
            } else {
                this.alert = response.error
            }
        },

        exportToExcel() {
            let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    backgroundColor: '#1565c0', 
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    wrap: true
            }

            let column_style = {
                align: 'right',
                alignVertical: 'right',
                backgroundColor: '#ffffff', 
                borderColor: '#000000',
                color: '#000000',
                wrap: true
            }

            let result = [
                [
                    { ...header_style, span: 41, align: 'center', alignVertical: 'center', value: 'Section A.1. Morbidity Report', height: 50 }
                ],

                [
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'DISEASES', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'ICD-10 CODE', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '0-6 Days', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '7-28 Days', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '29 Days- 11 Mos', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '1-4 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '5-9 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '10-14 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '15-19 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '20-24 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '25-29 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '30-34 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '35-39 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '40-44 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '45-49 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '50-54 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '55-59 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '60-64 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '65-59 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '>= 70 y/o', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: 'TOTAL', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 50 },
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'TOTAL BOTH SEX', height: 50 }
                ],

                [
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'M', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: 'F', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '',  height: 20}

                ]
            ]

            this.morbidity_data.forEach((el, key) => {
                result.push([
                    { ...column_style, align: 'left', alignVertical: 'center', value: el.description, height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', value: el.icd_10_code, height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.m['0 - 6 days'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.f['0 - 6 days'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.m['7 - 28 days'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.f['7 - 28 days'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.m['29 days - 11 months'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.f['29 days - 11 months'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.m['1 - 4 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 30 ? '#1565c0' : '', color: key === 30 ? '#1565c0' : '' , value: el.group.f['1 - 4 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['5 - 9 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['5 - 9 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['10 - 14 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['10 - 14 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['15 - 19 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['15 - 19 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['20 - 24 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['20 - 24 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['25 - 29 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['25 - 29 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['30 - 34 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['30 - 34 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['35 - 39 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['35 - 39 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['40 - 44 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['40 - 44 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['45 - 49 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['45 - 49 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['50 - 54 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['50 - 54 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['55 - 59 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['55 - 59 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['60 - 64 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['60 - 64 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['65 - 69 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['65 - 69 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.m['>= 70 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: key === 29 ? '#1565c0' : '', color: key === 29 ? '#1565c0' : '' , value: el.group.f['>= 70 years'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', value: el.group.m['Total'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', value: el.group.f['Total'], height: 60},
                    { ...column_style, align: 'center', alignVertical: 'center', backgroundColor: '#82b1ff', value: el.total_gender, height: 60},
                ])
            })

            result.push([
                { ...column_style, span: 41, align: 'right', alignVertical: 'center', value: 'TOTAL: ' + this.total_both_sex, height: 60}
            ])

            const FileNameDate = this.$moment().format('MM-DD-YYYY');
            const FileNameFacility = this.$store.state.prv_data.provider_name;

            setTimeout(() => {
                this.generate_excel_loader = false
                let report_period = '';

                switch (this.selected_filter_type) {
                    case 'monthly':
                        report_period = this.getMonthByNumber(this.month) + " - " + this.year; 
                        break;
                    
                    case 'quarterly':
                        report_period = "Quarter " + this.selected_quarter + " - " + this.selected_quarter_year;
                        break;

                    case 'annually':
                        report_period = this.selected_annual;
                        break;
                }

                this.$excel_file(result, {
                    columns: [
                        { width: 20 },
                        { width: 20 }
                    ],    
                    fileName: `${FileNameFacility}- M2 Section A.1. Morbidity Report ${report_period}-${FileNameDate}.xlsx`     
                    //fileName: this.$store.state.prv_data.provider_name + ' M2 Section A.1. Morbidity Report ' + this.provider_name + " " + report_period + '.xlsx'
                })
            }, 1000)
        }
    }
}
</script>

<style scoped>
table { width: 100%; }
table, th, td { border-collapse: separate; border: 1px solid lightgrey; }
td { padding: 5px; }
#content {
  overflow-x: auto; 
  overflow-y: hidden; 
}
#content table { min-width: 1400px; }
.untouchable {
    background: #1565C0;
    color: #1565C0;
    user-select: none; /* Standard syntax */
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
}
.total-both-sex { background: #82B1FF; }
::v-deep .tab-filter{
    background-color: #1565C0 !important
}
</style>