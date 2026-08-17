<template>
    <v-card class="card">
        <v-card-title :class="{'blue' : new_or_delivery == 'delivery'}" class="justify-center text-center white--text darken-3 bg-green">{{new_or_delivery === 'new_medicine' ? 'ADDING / RECEIVING OF NEW MEDICINE' : 'REPLENISHMENT OF MEDICINE'}}</v-card-title>

        <v-form :readonly="btn_loading" ref="form" class="pa-5 ">
            <v-btn text dense class="primary--text" @click="$emit('changeAddDeliveryMed', 'delivery')" v-if="new_or_delivery === 'new_medicine'">
                <v-icon left>mdi-arrow-left</v-icon>Back
            </v-btn>
            <v-row dense>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="mx-auto">

                        <v-row dense>
                            <v-col cols="12" sm="6" md="2" lg="2" xl="2" class="align-self-start mt-2">Generic Name: <span class="red--text">*</span></v-col>
                                    
                            <v-col cols="12" sm="6" md="10" lg="19" xl="10" class="pl-2">
                                <v-text-field v-if="new_or_delivery === 'new_medicine'" v-model="selected_medicine"  @change="populateMedicine" :rules="required" :item-text="(item) => `${item.generic_name} (${item.otc_medicine_code})`" @input="selected_medicine = textCapitalize($event)" placeholder="Enter Medicine"  outlined dense></v-text-field>
                            
                                <v-autocomplete v-else @change="populateMedicine" :items="filtered_medicine_list" :loading="medicine_loader" :rules="required" :item-text="(item) => `${item.generic_name} (${item.otc_medicine_code})`" placeholder="--Select Medicine--" class="mb-3"  return-object  hide-details  clearable outlined dense>
                                    <template v-slot:item="{ item }" >
                                        <v-row dense> 
                                            <v-list-item-avatar v-if="$vuetify.breakpoint.smAndUp" color="indigo" class="font-weight-light white--text">{{ item.otc_medicine_code.substr(4) }}</v-list-item-avatar>
                                            <v-col cols="11" class="ma-2 pa-2">
                                                <v-row dense>
                                                    <v-col cols="12" md="8" class="mb-2">
                                                        <h6 class="body-2 font-weight-regular">Generic Name: <span class="font-weight-medium">{{ item.generic_name }}</span></h6>
                                                    </v-col>

                                                    <v-col cols="12" md="4" class="mb-2">
                                                        <h6 class="body-2 font-weight-regular">Preparation: <span class="font-weight-medium">{{item.preparation }}</span></h6>
                                                    </v-col>
                                        
                                                    <v-col cols="12" md="8" class="mb-2">
                                                        <h6 class="body-2 font-weight-regular">Route: <span class="font-weight-medium">{{item.route}}</span></h6>
                                                    </v-col>

                                                    <v-col cols="12" md="4" class="mb-2">
                                                        <h6 class="body-2 font-weight-regular">Dosage: <span class="font-weight-medium">{{item.dosage }}</span></h6>
                                                    </v-col>

                                                    <v-col cols="12" class="mb-2">
                                                        <h6 class="body-2 font-weight-regular">Unit Type: <span class="font-weight-medium">{{ item.unit_type }}</span></h6>
                                                    </v-col>
                                                </v-row>
                                                <v-divider class="my-2"></v-divider>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            
                            <v-row dense>
                                <v-col cols="6" md="2" lg="2" xl="2" class="px-2 mb-1 d-flex align-center">
                                    Dosage: 
                                    <v-text-field v-if="new_medicine" v-model="dosage" :rules="required" maxlength="100" class="pl-2" hide-details dense></v-text-field>
                                    <span v-else class="pl-2 font-weight-medium">{{dosage}}</span>
                                </v-col>
                                <v-col cols="6" md="3" lg="3" xl="3" class="px-2 mb-1 d-flex align-center">
                                    Preparation: 
                                    <v-text-field v-if="new_medicine" v-model="preparation" @input="preparation = textCapitalize($event)" :rules="required" maxlength="100" class="pl-2" hide-details dense></v-text-field>
                                    <span v-else class="pl-2 font-weight-medium">{{preparation}}</span>
                                </v-col>
                                <v-col cols="6" md="3" lg="3" xl="3" class="px-2 mb-1 d-flex align-center">
                                    Route: 
                                    <v-text-field v-if="new_medicine" v-model="route" @input="route = textCapitalize($event)" :rules="required" maxlength="100" class="pl-2" hide-details dense></v-text-field>
                                    <span v-else class="pl-2 font-weight-medium">{{route}}</span>
                                </v-col>
                                <v-col cols="6" md="3" lg="3" xl="3" class="px-2 mb-1 d-flex align-center" v-if="new_or_delivery === 'delivery'">
                                    Unit: 
                                    <span class="pl-2 font-weight-medium">{{unit}}</span>
                                </v-col>
                                <v-col cols="6" md="4" lg="4" xl="4" class="px-2 mb-1 d-flex align-center" v-else>
                                    Unit: 
                                    <v-autocomplete v-model="unit" :items="unit_type_list"  placeholder="SELECT" @change="changeUnit($event)" :disabled="!generic_name" :rules="required"  class="pl-2 font-weight-medium" hide-details  dense></v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-row>

                        <!--Replenishment-->
                        <div v-if="new_or_delivery === 'delivery'">
                            <v-row class="ma-0 pa-0" dense>
                                <v-col cols="12" class="ma-0 pa-0" dense>
                                    <v-spacer></v-spacer>
                                    <v-divider class="mb-4 mt-4"></v-divider>

                                    <div v-for="(entry, index) in medicine_entries" :key="index" class="mb-6">
                                        <v-row dense>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="entry.lot_no" label="Lot No" :rules="required" :disabled="!generic_name" @input="entry.lot_no = textCapitalize($event);" @change="markAsUpdated(entry)" dense hide-details></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4"> 
                                                <!-- <v-menu v-model="entry.menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto" >
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-model="entry.expiration_date" v-bind="attrs" v-on="on" :rules="required" :disabled="!generic_name" label="Expiration Date" dense hide-details :placeholder="'MM-DD-YYYY'" maxlength="10"  @input="entry.expiration_date = autoFormatDate($event); entry.menu = false" @click="entry.menu = true" @change="onManualDateChange(entry)" ></v-text-field>
                                                    </template>

                                                    <v-date-picker v-model="entry.expiration_date_picker" :min="min_date" @input="onDatePicked(entry)" ></v-date-picker>
                                                </v-menu> -->

                                                <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field v-on="on" v-model="entry.expiration_date" v-mask="expiration_date_mask" :rules="required" :disabled="!generic_name" placeholder="MM-DD-YYYY" dense></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="entry.expiration_date_picker" :min="min_date" @change="entry.expiration_date = formatDate(entry.expiration_date_picker)" no-title></v-date-picker>
                                                </v-menu>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4" >
                                                <v-text-field v-model="entry.num_of_boxes_receive" label="Number of Boxes Received" :rules="getConditionalRule(entry)" :disabled="!generic_name" @input="updateInitialQty(entry)" @change="markAsUpdated(entry)" @keypress="numberOnlyWithDeci($event, entry.num_of_boxes_receive)" dense hide-details ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4" class="pt-2">
                                                <v-text-field v-model="entry.num_of_med_inside_the_box" label="Number of Medicine per Box"  :rules="getConditionalRule(entry)" :disabled="!generic_name" @input="updateInitialQty(entry)" @change="markAsUpdated(entry)" @keypress="numberOnlyWithDeci($event, entry.num_of_med_inside_the_box)" dense hide-details ></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4" class="pt-2">
                                                <v-text-field v-model="entry.initial_quantity" label="Quantity" :rules="getConditionalRule(entry)" :disabled="!generic_name" @change="markAsUpdated(entry)" readonly dense hide-details></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="2" class="pt-2">
                                                <v-text-field v-model="entry.unit_cost" label="Unit Cost" :rules="getConditionalRule(entry)" :disabled="!generic_name" @change="markAsUpdated(entry)" @keypress="numberOnlyWithDeci($event, entry.unit_cost)" dense hide-details></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="2" class="pt-2">
                                                <v-text-field v-model="entry.price_per_piece" label="Price per Piece" :rules="getConditionalRule(entry)" :disabled="!generic_name" @change="markAsUpdated(entry)" @keypress="numberOnlyWithDeci($event, entry.price_per_piece)" dense hide-details></v-text-field>
                                            </v-col>

                                            <v-row dense align="center" class="mb-2">
                                                <v-col cols="12" sm="3" md="3">
                                                    <span class="body-2 font-weight-regular">Current Quantity: <b>{{ entry.previous_quantity }}</b></span>
                                                </v-col>

                                                <v-col cols="6" sm="3" md="3">
                                                    <span class="body-2 font-weight-regular">Total Quantity (pcs): <b>{{ totalQuantity(entry) }}</b></span>
                                                </v-col>

                                                <v-col cols="12" sm="3" md="3">
                                                    <span class="body-2 font-weight-regular">Current Unit Cost: <b>{{ entry.previous_unit_cost }}</b></span>
                                                </v-col>

                                                <v-col cols="6" sm="2" md="2">
                                                    <span class="body-2 font-weight-regular">Weighted Avg. Cost: <b>{{ weightedAvgCost(entry) }}</b></span>
                                                </v-col>

                                                <v-col cols="12" sm="1" md="1" class="text-sm-right">
                                                    <v-btn icon color="error" @click="removeEntry(index)">
                                                    <v-icon>mdi-delete</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-row>
                                        <v-divider class="my-1 dashed"></v-divider>
                                    </div>

                                    <v-card-title class="pl-0">
                                        <v-spacer></v-spacer>
                                        <v-btn x-small dense color="primary" @click="addEntry"><v-icon x-small>mdi-plus</v-icon> Add</v-btn>
                                    </v-card-title>
                                </v-col>
                            </v-row>
                        </div>

                        <h6 v-if="new_or_delivery === 'delivery'" class="body-2 text-right">Medicine does not exist in the list / library? <v-btn @click="$emit('changeAddDeliveryMed', 'new_medicine')" text class="primary--text"><u>Proceed Here</u></v-btn></h6> 

                        <v-divider class="my-3" v-if="new_or_delivery === 'delivery'" ></v-divider>

                        <template v-if="new_or_delivery === 'delivery'" > 
                            <h6 class="subtitle-1 font-weight-medium grey--text text--darken-3">STOCK LEVEL OF MEDICINE</h6> 
                            <h6 class="text-caption mb-6"><i>Note: Stock levels of all items are required or should be set to properly monitor stocks</i></h6> 

                            <div>
                                 <v-row align="baseline" dense>
                                    <!--<v-col cols="12" sm="2" class="text-sm-right align-self-start mt-3">Source:</v-col>
                                        <v-col cols="12" sm="10" class="pl-2">
                                            <label>
                                                <input type="radio" value="MO" v-model="source"> From MO
                                            </label>
                                            <label>
                                                <input type="radio" value="LGU" v-model="source"> From LGU
                                            </label>
                                        </v-col>
                                   <v-col cols="12" sm="2" class="text-sm-right align-self-start mt-3">Facility:</v-col>-->

                                    <v-col cols="12" sm="10" class="pl-2" style="display: none;">
                                        <v-text-field  :value="$store.state.usr_credentials.provider_reg_type" :rules="required" readonly :disabled="!generic_name" return-object outlined dense> </v-text-field>
                                    </v-col> 
                                </v-row>

                                 <v-row align="baseline" dense>
                                    <v-col cols="12" sm="2" class="text-sm-right align-self-start mt-2">Desired Stock Quantity:</v-col>

                                    <v-col cols="12" sm="10" class="pl-2">
                                        <v-text-field v-model="max_stock_quantity" v-on:keypress="numberOnly" :rules="required" :disabled="!generic_name"  maxlength="6" outlined dense></v-text-field>
                                    </v-col>
                                </v-row>

                                 <v-row align="baseline" dense>
                                    <v-col cols="12" sm="2" class="text-sm-right align-self-start">Replenishment Level:</v-col>

                                    <v-col cols="12" sm="10" class="pl-2">
                                         <v-row align="baseline" class="text-left" dense>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                <label class="font-weight-bold">{{ computeReplenishLevel(max_stock_quantity) }}</label>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                                                Critical Level: <label class="font-weight-bold">{{ computeCriticalLevel(max_stock_quantity) }}</label>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4"></v-divider>
                            </div>

                            <!--<div v-if="$store.state.usr_credentials.provider_reg_type !== 'PVT'" class="text-right">
                                <v-btn @click="addStockRow" :disabled="disabled_add_stock" class="white--text" color="#367c9d"><v-icon left>mdi-hospital-building</v-icon>Next Facility</v-btn>
                            </div>-->
                        </template>
                    </v-col>
                </v-col>
            </v-row>
        </v-form>

        <v-divider class="mb-4"></v-divider>
        <v-row justify="center" class="pb-4" dense>
            <v-btn @click="cancel" class="mx-2"  :color="new_or_delivery == 'delivery' ? 'primary' : '#3D9660'" outlined>CANCEL</v-btn>
            <v-btn @click="save" class="mx-2 px-8" :loading="btn_loading" :disabled="disabled_save_btn" :class="new_or_delivery == 'delivery' ? 'primary' : 'bg-green white--text'">SAVE</v-btn>
        </v-row>

        <Alert :alert="alert" @updateInventoryList="updateInventoryList" @changeToDelivery="changeToDelivery"/>
    </v-card>
</template>

<script>
import { mask } from "vue-the-mask"
import Alert from "@/components/Alert.vue"

export default {
    directives: { mask },
    components: { Alert },
    props: ['prv_list','new_or_delivery'],

    data() {
        return {
            // fields
            medicine_code: '', 
            generic_name: '',
            dosage: '',
            preparation: '',
            route: '',
            unit: '',
            lot_no: '',
            expiration_date: '',
            expiration_date_mask: '##-##-####',
            expiration_date_picker: '',
            min_date: this.$moment().format('YYYY-MM-DD'),
            max_date: this.$moment().format('YYYY-MM-DD'),


            price_per_piece: 0,

            unit_type_list: ['AMPULE','BOTTLE', 'BOX', 'CAPSULE', 'INHALER', 'NEBULE',  'ORAL DROPS', 'ORAL SUSPENSION', 'PEDIATRIC DROPS', 'POWDER FOR ORAL SOLUTION', 'POWDER FOR ORAL SUSPENSION', 'POWDER FOR SUSPENSION', 'SACHET', 'SUSPENSION', 'SYSRUP', 'TABLET', 'TUBE' ,'VIAL'],
            initial_quantity: 0,
            unit_cost: 0,
            
            previous_quantity: 0,
            previous_unit_cost: 0,

            num_of_med_inside_the_box: 0,
            num_of_boxes_receive: 0,

            medicine_list:[],
            medicine_loader: true,
            new_medicine: false,
            selected_medicine: null,
            sel_previous_unit: '',

            //MAX STOCK LEVEL
            has_max_stock_quantity: 0,
            disabled_add_stock: false,
            max_stock_quantity: '',

            stock_level_per_provider: {
                hide: false,
            },

            medicine_entries: [
                {
                    lot_no: '',
                    expiration_date: '',
                    expiration_date_picker: '',
                    generic_name: true,
                    unit: '',
                    num_of_med_inside_the_box: '',
                    num_of_boxes_receive: '',
                    initial_quantity: '',
                    total_quantity: '',
                    unit_cost: 0,
                    price_per_piece: 0,
                    previous_quantity: '', 
                    previous_unit_cost: '',
                    weighted_avg_cost: 0,  
                    is_new: false
                },
            ],

            // RULES
            required: [v => !!v && !/^ *$/.test(v)],
            btn_loading: false,
            source: '',
            alert:{},
            existing_lot_nos: [],
            is_existing_lot: false,
            menu: false
            
        }
    },

    mounted() {
        this.getMedicine();
    },
    
    watch : {
        num_of_med_inside_the_box() {
            if (this.num_of_med_inside_the_box && this.num_of_boxes_receive) {
                this.initial_quantity = this.num_of_med_inside_the_box * this.num_of_boxes_receive
            }
        },

        num_of_boxes_receive() {
            if (this.num_of_boxes_receive && this.num_of_med_inside_the_box) {
                this.initial_quantity = this.num_of_med_inside_the_box * this.num_of_boxes_receive
            }
        },

         'entry.expiration_date'(val) {
            const parsed = this.$moment(val, 'MM/DD/YYYY', true); 
            if (parsed.isValid()) {
                this.entry.expiration_date_picker = parsed.format('YYYY-MM-DD');
            }
        }
    },

    computed: {
        disabled_save_btn() {
            if (this.new_or_delivery === 'delivery') {
                if (this.is_existing_lot) {
                    const has_new_lot_no = this.medicine_entries.some(entry =>  entry.is_new && entry.lot_no && entry.initial_quantity);
                    const has_updated_existing_lot_no = this.medicine_entries.some(entry => !entry.is_new && entry.is_updated);
                    return !(has_new_lot_no || has_updated_existing_lot_no); 
                } else {
                    const required_filleds_filled = this.medicine_entries.every(entry => entry.generic_name && entry.initial_quantity && entry.unit_cost );
                    return !required_filleds_filled;
                }
            } else {
                if (this.generic_name && this.dosage && this.preparation && this.route) {
                    return false
                }
            }
            return true
        },

        filtered_medicine_list() {
            return this.medicine_list.filter(medicine => medicine.generic_name !== "OTHER DRUGS AND MEDICINES NOT ON THE LIST AND/OR NEEDED DURING THIS PARTICULAR EPISODE OF CARE");
        }
    },

    methods: {
        updateInitialQty(entry) {
            const boxes = parseFloat(entry.num_of_boxes_receive) || 0;
            const inside = parseFloat(entry.num_of_med_inside_the_box) || 0;
            entry.initial_quantity = boxes * inside;
        },
        
        totalQuantity(entry) {
            const initial = Number(entry.initial_quantity) || 0;
            const previous = Number(entry.previous_quantity) || 0;
            return initial + previous;
        },

        hasExistingLotNo() {
            return this.medicine_entries.some(item => !!item.lot_no);
        },

        getConditionalRule() {
            this.is_existing_lot = this.hasExistingLotNo();
            return this.is_existing_lot ? [] : this.required;
        },

        markAsUpdated(entry) {
            if (!entry.is_new) {
            entry.is_updated = true;
            }
        },
        
        weightedAvgCost(entry) {
            let total = 0;
            if (entry.unit_cost && Number(entry.previous_unit_cost) !== 0 && entry.previous_unit_cost !== undefined) {
                total = (Number(entry.unit_cost) + Number(entry.previous_unit_cost)) / 2;
            } else {
                total = entry.unit_cost;
            }
            return total;
        },

        async getMedicine() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'otc_medicine'
            })

            if(response.status === 200) {
                this.medicine_loader = false
                this.medicine_list = response.data.map(item => {
                    item.generic_name_text = `${item.otc_medicine_code.substr(4)}. ${item.generic_name}`
                    return item
                })
                return this.medicine_list
            }else{
                this.alert = response.error
            }
        },

        async getMedicineInfo(med_code, prv_code, lgu_host_code) {
            this.previous_quantity = 0;
            this.previous_unit_cost = 0;
            this.unit_cost = 0;
            this.initial_quantity = 0;
            this.has_max_stock_quantity = 0;
            this.num_of_med_inside_the_box = 0;
            this.num_of_boxes_receive = 0;
            this.price_per_piece = 0;

           let response = await this.$services.getMedicineInfo({
                is_single_fetch: true,
                provider_code: prv_code,
                host_code: lgu_host_code,
                medicine_code: [med_code],
            });
            
           if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                this.populateMedicineInfo(response.data);
            } else {
                 this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        },

        populateMedicineInfo(response) {
            if (!response) {
                // Clear all populated data when the field is cleared
                this.max_stock_quantity = null;
                this.medicine_code = '';
                this.dosage = '';
                this.preparation = '';
                this.route = '';
                this.unit = '';
                this.unit_cost = 0;
                this.price_per_piece = 0;
                this.medicine_entries = [];
                return;
            }
            this.max_stock_quantity = response.max_stock_quantity;
            this.medicine_code = response.medicine_code ;
            this.dosage = response.dosage ;
            this.preparation = response.preparation;
            this.route = response.route ;
            this.unit = response.unit_type ;
            this.unit_cost = response.unit_price;
            this.price_per_piece = response.price_per_piece;
            if (!response.data || response.data.length === 0) {
                this.medicine_entries = [this.getDefaultEntry()];
            } else {
                this.medicine_entries = response.data.map(item => ({
                    lot_no: item.lot_no || '',
                    expiration_date: this.formatDate(item.expiration_date) || '',
                    expiration_date_picker: '',
                    generic_name: true,
                    unit: item.unit || '',
                    num_of_med_inside_the_box: item.num_of_med_inside_the_box || '',
                    num_of_boxes_receive: item.num_of_boxes_receive || '',
                    unit_cost: item.previous_unit_cost || 0,
                    price_per_piece: item.previous_price_per_piece || 0,
                    previous_quantity: item.previous_quantity || '',
                    previous_unit_cost: item.previous_unit_cost || '',
                    weighted_avg_cost: item.weighted_avg_cost || 0,
                    is_new: false,
                    is_updated: false,
                }));
            }
            this.hasExistingLotNo()
        },

        getDefaultEntry() {
            return {
                lot_no: '',
                expiration_date: '',
                expiration_date_picker: '',
                generic_name: true,
                unit: '',
                num_of_med_inside_the_box: '',
                num_of_boxes_receive: '',
                initial_quantity: '',
                total_quantity: '',
                unit_cost: 0,
                price_per_piece: 0,
                previous_quantity: '',
                previous_unit_cost: '',
                weighted_avg_cost: 0,
                is_new: false,
                is_updated: false
            };
        },

        addEntry() {
            this.medicine_entries.push({
                lot_no: '',
                expiration_date: '',
                expiration_date_picker: '',
                generic_name: true,
                unit: '',
                num_of_med_inside_the_box: '',
                num_of_boxes_receive: '',
                initial_quantity: '',
                total_quantity: '',
                unit_cost: 0,
                price_per_piece: 0,
                is_new: true,
                is_updated: false
            });
        },
        
        removeEntry(index) {
            this.medicine_entries.splice(index, 1);
        },

        populateMedicine(data) {
            this.new_medicine = false

            this.max_stock_quantity = ''
            this.disabled_add_stock = false

            // if nag clear / delete
            if (!data) {
                this.generic_name = ""
                this.preparation = ""
                this.route = ""
                this.dosage = ""
                this.unit = "" 
                this.lot_no = ""
                this.expiration_date = ""
                this.medicine_code = ""
                this.unit_cost = 0
                this.initial_quantity = 0
                this.previous_quantity = 0
                this.previous_unit_cost = 0
                this.has_max_stock_quantity = 0
                this.medicine_entries = []
                this.addEntry()
                return 
            }

            // if nag select sa combobox list or autocomplete list
            if (typeof data == 'object') {

                if (data.otc_medicine_code === 'OTC-0000') {
                    return;
                }

                if (data.generic_name === "OTHER DRUGS AND MEDICINES NOT ON THE LIST AND/OR NEEDED DURING THIS PARTICULAR EPISODE OF CARE") {
                    return;
                }
                if (this.new_or_delivery === 'new_medicine') {
                    setTimeout(() =>  this.selected_medicine = null , 0.5)
                    const sub_title = '<h6 class="body-2">Please proceed in the delivery module to add quantity on this medicine</h6>'
                    const sub_body = '<div class="mt-5 mb-10">Do you want to go back to delivery of medicine page?</div>'
                    this.alert = {display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'This medicine already exist in the medicine library.'+sub_title, body: sub_body, btn_pry_txt: 'Yes go back', btn_pry_color: 'primary', btn_pry_otl: true, btn_pry_act: 'closeAlert', btn_pry_emt: 'changeToDelivery', btn_pry_params: 'delivery',  btn_sec_txt: 'Stay on this page', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'closeAlert' }
                    return 
                } 

                this.medicine_code = data.otc_medicine_code 
                this.generic_name = data.generic_name
                this.preparation = data.preparation
                this.route = data.route
                this.dosage = data.dosage
                this.unit = data.unit_type
                this.route = data.lot_no
                this.dosage = data.expiration_date
                this.unit = data.source
                this.sel_previous_unit = data.unit_type 

                this.getMedicineInfo(data.otc_medicine_code, this.$store.state.prv_data.provider_code, this.$store.state.usr_credentials.lgu_host_code);
                return
            }

            // if ng type lang ng string
            this.new_medicine = true
            this.generic_name = data
        },

        cancel() {
            this.$refs.form.reset()
            this.$emit('cancel')
        },

        // async save() {
        //     this.btn_loading = true;

        //     if (this.$refs.form.validate()) {
        //         let payload = {};
        //         let response = null;
        //         let controller_key = 'new';
        //         if (this.new_or_delivery === 'delivery') controller_key = 'existing';

        //         /*if (controller_key === 'existing' && (this.sel_previous_unit !== this.unit || (this.unit_cost && this.price_per_piece))) {
        //             await this.updateMedicineUnit();
        //         }*/

        //         if(controller_key === 'new'){
        //             payload = {
        //                 provider_code: this.$store.state.prv_data.provider_code,
        //                 generic_name: this.generic_name,
        //                 dosage: this.dosage,
        //                 preparation: this.preparation,
        //                 route: this.route,
        //                 unit_type: this.unit,
        //                 //unit_price: this.unit_cost,
        //                 //price_per_piece: this.price_per_piece,
        //                 added_by: this.$store.state.usr_credentials.user_name,
        //             }
                    
        //             response = await this.$services.medAddMedicine(payload);
        //         }else {
        //             this.medicine_entries.forEach(entry => {
        //                 entry.total_quantity = this.totalQuantity(entry);
        //                 entry.weighted_avg_cost = this.weightedAvgCost(entry);
        //             });

        //             // Filter only new entries or modified ones
        //             const new_or_updated_etries = this.medicine_entries.filter(entry => {
        //                 return entry.is_new || entry.is_updated || (entry.lot_no && entry.is_existing_lot && entry.is_updated);
        //             });

        //             payload = {
        //                 key: controller_key,
        //                 provider_code: this.$store.state.prv_data.provider_code,
        //                 lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
        //                 medicine_code: this.medicine_code,
        //                 max_stock_quantity: this.max_stock_quantity,
        //                 unit_type: this.unit,
        //                 added_by: this.$store.state.usr_credentials.user_name,
        //                 data: new_or_updated_etries.map(entry => ({
        //                     current_quantity: entry.total_quantity,
        //                     current_weighted_avg_cost: entry.weighted_avg_cost,
        //                     current_unit_cost: entry.unit_cost,
        //                     price_per_piece: entry.price_per_piece,
        //                     lot_no: entry.lot_no,
        //                     expiration_date: entry.expiration_date,
        //                     boxes: entry.num_of_boxes_receive,
        //                     pieces_per_boxes: entry.num_of_med_inside_the_box,
        //                 }))
        //             }

        //             response = await this.$services.medReplenishment(payload);

        //         }

        //         if (response.status === 200) {
        //             if (!response.data.success) {
        //                 response.data = this.responseDataDecryption(response.data)
        //                 return this.alert =  {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //             } else {
        //                 response.data = this.responseDataDecryption(response.data)
        //                 this.medicine_code = response.data.medicine_code
        //                 /*if(controller_key === 'existing'){
        //                     await this.saveStockLevel();
        //                 }*/
                        
        //                 return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Added Medicine Succesfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage', btn_pry_emt: 'updateInventoryList'}
        //             }
        //         } else {
        //             this.alert = response.error;
        //         }
        //     }
        // },

        async save() {
            this.btn_loading = true;

            if (this.$refs.form.validate()) {

                // Accept ONLY MM-DD-YYYY (strict)
                const exp_date_validation = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;
                const invalid_entry = this.medicine_entries.some(entry => {
                    return entry.expiration_date && !exp_date_validation.test(entry.expiration_date);
                });

                if (invalid_entry) {
                    this.btn_loading = false;

                    this.alert = {
                        display: true,
                        type: 'standard',
                        width: '500',
                        icon: 'mdi-alert-circle',
                        color: 'yellow darken-1',
                        title: 'Invalid Expiration Date',
                        body: 'Please enter expiration date in MM-DD-YYYY format (ex: 05-10-2025).',
                        btn_pry_txt: 'Close',
                        btn_pry_color: 'blue darken-2',
                        btn_pry_otl: true,
                        btn_pry_act: 'closeAlert'
                    };

                    return;
                }

                let payload = {};
                let response = null;
                let controller_key = 'new';

                if (this.new_or_delivery === 'delivery')
                    controller_key = 'existing';

                if (controller_key === 'new') {
                    payload = {
                        provider_code: this.$store.state.prv_data.provider_code,
                        generic_name: this.generic_name,
                        dosage: this.dosage,
                        preparation: this.preparation,
                        route: this.route,
                        unit_type: this.unit,
                        added_by: this.$store.state.usr_credentials.user_name,
                    };

                    response = await this.$services.medAddMedicine(payload);

                } else {

                    this.medicine_entries.forEach(entry => {
                        entry.total_quantity = this.totalQuantity(entry);
                        entry.weighted_avg_cost = this.weightedAvgCost(entry);
                    });

                    const new_or_updated_etries = this.medicine_entries.filter(entry => {
                        return entry.is_new || entry.is_updated || (entry.lot_no && entry.is_existing_lot && entry.is_updated);
                    });

                    payload = {
                        key: controller_key,
                        provider_code: this.$store.state.prv_data.provider_code,
                        lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                        medicine_code: this.medicine_code,
                        max_stock_quantity: this.max_stock_quantity,
                        unit_type: this.unit,
                        added_by: this.$store.state.usr_credentials.user_name,
                        data: new_or_updated_etries.map(entry => ({
                            current_quantity: entry.total_quantity,
                            current_weighted_avg_cost: entry.weighted_avg_cost,
                            current_unit_cost: entry.unit_cost,
                            price_per_piece: entry.price_per_piece,
                            lot_no: entry.lot_no,
                            expiration_date: entry.expiration_date,
                            boxes: entry.num_of_boxes_receive,
                            pieces_per_boxes: entry.num_of_med_inside_the_box,
                        }))
                    };

                    response = await this.$services.medReplenishment(payload);
                }

                if (response.status === 200) {
                    if (!response.data.success) {
                        response.data = this.responseDataDecryption(response.data);
                        return this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.data, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                    } else {
                        response.data = this.responseDataDecryption(response.data);
                        this.medicine_code = response.data.medicine_code;

                        return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-check-circle', color: 'success', title: 'Added Medicine Succesfully', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage', btn_pry_emt: 'updateInventoryList'};
                    }
                } else {
                    this.alert = response.error;
                }
            }
        },

        // pang save ng max stock level
        async saveStockLevel() {
            let response = await this.$services.medSaveStockLevel({
                medicine_code: this.medicine_code,
                provider_code: this.$store.state.prv_data.provider_code,
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code,
                max_stock_quantity: this.max_stock_quantity
            });

            if(response.status === 200) {
                 if (!response.data.status) {
                    return this.alert =  {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                return
            } else {
                this.alert = response.error
            }
        },
        
        // pang update ng medicine unit
        async updateMedicineUnit() {
            let response = await this.$services.medUpdateMedicineInfo({
                medicine_code: this.medicine_code,
                unit_type: this.unit,
                price_per_piece: this.price_per_piece,
                unit_price: this.unit_cost
            });

            if(response.status === 200) {
                if (!response.data.update) {
                    return this.alert =  {display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                return
            } else {
                this.alert = response.error
            }
        },
        
        // pang create nung data na ilalagay sa medicine inventory after saving
        updateInventoryList() {
            this.btn_loading = false

            let stock_quantity = 0
            if (this.has_max_stock_quantity == 0) {
                const filtered_result = this.stock_level_data.filter(item => item.facility == this.$store.state.usr_credentials.provider_reg_type)
                stock_quantity = filtered_result[0].max_stock_quantity
            } else {
                stock_quantity = this.has_max_stock_quantity
            }
            
            const data = {
                medicine_code: this.medicine_code,
                facility: this.$store.state.prv_data.provider_name,
                provider_code: this.$store.state.prv_data.provider_code,
                generic_name: this.generic_name,
                dosage: this.dosage,
                lot_no: this.lot_no,
                expiration_date: this.expiration_date,
                unit_cost: this.unit_cost,
                quantity: parseInt(this.total_quantity),
                unit: this.unit === 'BOX' ? this.preparation : this.unit,
                max_stock_quantity: parseInt(stock_quantity),
                source: this.source,
                remarks: false
            }
            this.$refs.form.reset()

            return this.$emit('updateMedicineList', data, 'new_or_delivery_med')
        },

        changeUnit(data) {
            if (data !== 'BOX') {
                this.num_of_med_inside_the_box = 0
                this.num_of_boxes_receive = 0
                this.initial_quantity = 0
                this.price_per_piece  = 0
            } else {
                this.initial_quantity = 0
                this.unit_cost = 0
            }
        },

        // pang update ng  value to 
        changeToDelivery(value) {
            this.$emit('changeAddDeliveryMed', value)
        },


        removeStockRow(index) {
            this.disabled_add_stock = false
            this.stock_level_data.splice(index,1)
        },

        // pang compute, nilipat ko nalang dito since multiple na yung adding ng stock row
        computeReplenishLevel(stock_quantity) {
            let result = null

            if (stock_quantity) {
                result = (50 / 100) * stock_quantity
            }

            return result
        },

        computeCriticalLevel(stock_quantity) {
            let result = null

            if (stock_quantity) {
                result = (10 / 100) * stock_quantity
            }

            return result
        },

        numberOnlyWithDeci(event, value) {
            if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)){
                event.preventDefault();
            }
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },

        onDatePicked(entry) {
            const formatted = this.$moment(entry.expiration_date_picker).format('MM-DD-YYYY');
            entry.expiration_date = formatted;
            entry.menu = false;
            this.markAsUpdated(entry);
        },

        autoFormatDate(value) {
            if (!value) return '';
            const digits = value.replace(/\D/g, '');

            if (digits.length <= 2) {
                return digits;
            } else if (digits.length <= 4) {
                return digits.slice(0, 2) + '-' + digits.slice(2);
            } else if (digits.length <= 8) {
                return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4);
            } else {
                return digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4, 8);
            }
        },
        
        // isValidMMDDYYYY(value) {
        //     if (!value) return true;

        //     const parts = value.split('-');
        //     if (parts.length !== 3) return false;

        //     const [mm, dd, yyyy] = parts;

        //     if ( mm.length !== 2 || dd.length !== 2 ||  yyyy.length !== 4 || isNaN(mm) || isNaN(dd) || isNaN(yyyy) ) 
        //     {
        //         return false;
        //     }

        //     const iso = `${yyyy}-${mm}-${dd}`;
        //     const dateObj = new Date(iso);
            
        //     if (isNaN(dateObj.getTime())) {
        //         return false;
        //     }

        //     return true;
        // },
        isValidMMDDYYYY(value) {
            if (!value) return true;

            const parts = value.split('-');
            if (parts.length !== 3) return false;

            const [mm, dd, yyyy] = parts;

            if (mm.length !== 2 || dd.length !== 2 || yyyy.length !== 4 || isNaN(mm) || isNaN(dd) || isNaN(yyyy)) {
                return false;
            }

            const date = this.$moment(value, 'MM-DD-YYYY', true);

            return date.isValid();
        },

        onManualDateChange(entry) {
            const validation = this.isValidMMDDYYYY(entry.expiration_date);

            if (validation === true) {
                const [mm, dd, yyyy] = entry.expiration_date.split('-');
                entry.expiration_date_picker = `${yyyy}-${mm}-${dd}`;
                this.markAsUpdated(entry);
            } else {
                entry.expiration_date = ''; 
                entry.expiration_date_picker = '';
            }
        },

        // onManualDateChange(entry) {
        //     const validation = this.isValidMMDDYYYY(entry.expiration_date);
        //     if (validation === true) {
        //         const [mm, dd, yyyy] = entry.expiration_date.split('-');
        //         entry.expiration_date_picker = `${yyyy}-${mm}-${dd}`;
        //         this.markAsUpdated(entry);
        //     } else {
        //     entry.expiration_date_picker = '';
        //     }
        // },

        formatDate(date) {
            if (date && date.includes('-')) {
                const [year, month, day] = date.split('-');
                return `${month}-${day}-${year}`;
            }
            return ''; 
        },
        
    }
}
</script>

<style scoped>
.bg-green {
    background-color: #3D9660 !important
}

.card{
    overflow: hidden !important;
}
</style>
