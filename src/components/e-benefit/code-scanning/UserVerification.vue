<template>
    <v-card class="mx-auto rounded-lg" width="700">
        <div class="primary white--text text-center py-4">
            <h4 class="mt-1"><v-icon size="22" dark>mdi-account-search</v-icon> {{ this.$store.state.usr_credentials.department !== 'Data Encoder' ? 'Search Patient' : 'User Verification'}}</h4>
        </div>
        
        <div class="px-10 py-5 py-xl-5">
            <v-form :disabled="form_loading" ref="form">
                <div>
                    <h5 class="font-weight-regular mt-1 my-xl-1">PHIC PIN <span class="red--text">*</span></h5>
                    <v-text-field @keypress="numberOnly" v-model="phic_pin"  :rules="birthdate ? [] : verification_rules" :disabled="is_name_bday_filled" :error="empty_field" maxlength="12" dense>
                    </v-text-field>
                    <div class="d-flex align-center my-3 my-xl-3">
                        <v-divider></v-divider><h5 class="font-weight-bold grey--text text--darken-3 body-1 text-center mx-2">OR</h5> <v-divider></v-divider>
                    </div>
                </div>
                <h5 class="font-weight-regular mt-9">First Name <span class="red--text">*</span></h5>
                <v-text-field v-model="first_name" @paste="handlePaste($event, 'first_name')" @input="first_name = sanitizeAndCapitalize($event)" :disabled="is_phic_pin_filled"  :error="empty_field && !first_name" maxlength="60" dense></v-text-field>

                <h5 class="font-weight-regular mt-9">Middle Name <i>(optional)</i></h5>
                <v-text-field v-model="middle_name" @paste="handlePaste($event, 'middle_name')" @input="middle_name = sanitizeAndCapitalize($event)" :disabled="is_phic_pin_filled"    maxlength="60" dense></v-text-field>

                <h5 class="font-weight-regular mt-9">Last Name <span class="red--text">*</span></h5>
                <v-text-field v-model="last_name" @paste="handlePaste($event, 'last_name')" @input="last_name = sanitizeAndCapitalize($event)" :disabled="is_phic_pin_filled" :error="empty_field && !last_name" maxlength="60" dense></v-text-field>

                <h5 class="font-weight-regular mt-9">Suffix <i>(optional)</i></h5>
                <v-select v-model="suffix" :items="['JR', 'SR', 'I', 'II', 'III', 'IV', 'V', 'VI']" :disabled="is_phic_pin_filled" clearable dense></v-select>

                <h5 class="font-weight-regular mt-9">Birthdate <span class="red--text">*</span></h5>
                <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="birthdate" v-mask="birthdate_mask" :disabled="is_phic_pin_filled" :error="empty_field && !birthdate" placeholder="MM-DD-YYYY" dense></v-text-field>
                    </template>
                    <v-date-picker v-model="birthdate_picker" :max="max_date" :disabled="is_phic_pin_filled" @change="birthdate = formatDate(birthdate_picker)" no-title></v-date-picker>
                </v-menu>

                <!-- <v-sheet v-if="this.$store.state.usr_credentials.department === 'Data Encoder'" class="d-flex justify-start align-center text-body-2 ">
                    <v-checkbox v-model="member_consent" :error="empty_field && !member_consent" :rules="consent_rules"></v-checkbox>
                    <label>I have read and agree to the <span @click="$emit('openConsent')" class="primary--text consent_style"><u>Terms & Conditions</u></span>.</label>
                </v-sheet> -->
                
                <v-row class="mt-5 mb-3" justify="space-between" wrap>
                    <v-btn :loading="form_loading" @click="$emit('closeVerification')" class="elevation-0" tile>CANCEL</v-btn>
                    <v-btn :loading="form_loading" :disabled="search_disabled" @click="validateUser()" class="ml-auto" color="primary">SEARCH</v-btn>
                </v-row>
                <Alert :alert="alert" />
            </v-form>
        </div>
    </v-card>
</template>

<script>
import { mask } from "vue-the-mask";
import Alert from '@/components/Alert.vue';

export default {
    directives: { mask },
    props: ['displayMemberData', 'closeVerification'],

    components: {
        Alert
    },
    data() {
        return {
            max_date: this.$moment().format('YYYY-MM-DD'),
            verification_rules: [v => !!v && !/^ *$/.test(v)],
            form_loading: false,
            phic_pin:'',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            birthdate_picker: '',
            birthdate_mask: '##-##-####',
            empty_field: false,  
            consent_rules: [v => !!v],
            alert:{},
        }
    },

    computed: {
        is_phic_pin_filled() {
            return this.phic_pin.length > 0; 
        },

        is_name_bday_filled() {
            return this.first_name.length > 0 || this.middle_name.length > 0 || 
                    this.last_name.length > 0 || this.birthdate.length > 0; 
        },
        search_disabled() {
            if (this.form_loading) return true
            const pin = (this.phic_pin || '').trim()
            const first = (this.first_name || '').trim()
            const last = (this.last_name || '').trim()
            const birthdate = (this.birthdate || '').trim()
            if (pin) {return false}
            return !(first && last && birthdate)
        }
    },

    methods: {
        validateFields() {
            if (this.phic_pin) {
                this.empty_field = !!(this.first_name || this.last_name || this.birthdate);
            } else {
                this.empty_field = !(this.first_name && this.last_name && this.birthdate);
            }
        },

        // VALIDATING USER FOR VERIFICATION
        async validateUser() {
            // Validate birthdate format if phic_pin is empty
            if (!this.phic_pin) {
                // Accept ONLY MM-DD-YYYY (strict)
                const dob_validation = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/;

                if (!dob_validation.test(this.birthdate)) {
                    this.alert = { 
                        display: true, 
                        type: 'standard',
                        width: '500', 
                        icon: 'mdi-alert-circle', 
                        color: 'yellow darken-1',
                        title: 'Invalid Birth Date Format',
                        body: 'Please enter birthdate in MM-DD-YYYY format (ex: 05-10-1995).',
                        btn_pry_txt: 'Close', 
                        btn_pry_color: 'blue darken-2',
                        btn_pry_otl: true, 
                        btn_pry_act: 'closeAlert'
                    };

                    return;
                }
            }

            if (this.phic_pin) {
                this.empty_field = false;
            } else {
                this.empty_field = !(this.first_name && this.last_name && this.birthdate);
            }

            if (this.empty_field) return;
            this.form_loading = true;

            let response = await this.$services.wsMemberWeb({
                key: 'eurekare_key_web',
                data: {
                    command: 322101001,
                    data: {
                        ...(this.phic_pin ? { phic_pin: this.phic_pin } :
                            {
                                first_name: this.first_name,
                                last_name: this.last_name,
                                birthdate: this.$moment(this.birthdate, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                            }
                        )
                    }
                }
            })


            if (response.status === 200) {
                response.data = this.responseDataDecryption(response.data);
                const { lgu_data } = response.data;

                if (lgu_data.length !== 0) {
                    this.$emit('displayMemberData', lgu_data.ek_lgu_id);
                } else {
                    this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'No Records Found', body: '', btn_pry_txt: 'Close', btn_pry_color: 'blue darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert'};
                }
            } else {
                this.alert = response.error;
            }

            this.form_loading = false;
        },

        handlePaste(event, field) {
            event.preventDefault()

            const paste_data = (event.clipboardData || window.clipboardData).getData('text')

            this[field] = this.sanitizeAndCapitalize(paste_data)
        },

        sanitizeAndCapitalize(value) {
            if (!value) return ''

            value = value
                .replace(/^\s+/, '')     // remove leading spaces
                .replace(/\s+$/, '')     // remove trailing spaces
                .replace(/\s{2,}/g, ' ') // remove double spaces

            return this.textCapitalize(value)
        },

        numberOnly(event){
            if((event.which < 48 || event.which > 57) && event.which !== 45){
                event.preventDefault();
            }
        },
    }
}
</script>
