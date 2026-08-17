<template> 
    <v-row v-if="is_medical_certificate && $store.state.prv_data.municipality === 'ATIMONAN'" justify="center" align="center" dense no-gutters>
        <v-col class="text-center" cols="12" sm="6" md="8" lg="8">
            <v-img :src="prv_config.provider_logo" position="center" height="100%" width="100%" max-height="110" min-height="110" contain></v-img>
            <v-img src="@/assets/atimonan_under_logo.png" style="position: relative; left: 25%" height="50%" width="50%" max-height="50" min-height="50" contain></v-img>
            <h6 class="font-weight-bold body-1">REPUBLIC OF THE PHILIPPINES</h6>
            <h6 class="body-1"> PROVINCE OF {{ prv_data.province }} </h6>
            <h6 class="body-1"> {{ prv_data.municipality }} </h6>
        </v-col>
    </v-row>

    <v-row v-else-if="$store.state.prv_data.municipality === 'PARAÑAQUE CITY'">
        <v-row align="center" justify="center">
            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <div class="d-flex justify-center align-center">
                    <v-img src="@/assets/bagong_pilipinas_logo.png" height="100" width="100" contain></v-img>
                </div>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <div class="d-flex justify-center align-center">
                    <v-img :src="prv_config.provider_logo" position="center" height="100" width="100" contain></v-img>
                </div>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                <div class="d-flex justify-center align-center">
                    <v-img src="@/assets/paranaque_slogan.jpg" height="100" width="100" contain></v-img>
                </div>
            </v-col>
        </v-row>
        
        <v-col v-if="is_treatment_plan && !is_medical_certificate" class="text-center" cols="12" sm="12" md="12" lg="12">
            <h6 class="font-weight-bold body-1">PARAÑAQUE CITY HEALTH OFFICE</h6> 
        </v-col>

        <v-col v-else-if="disability_certification" class="text-center" cols="12" sm="12" md="12" lg="12">
            <h6 class="font-weight-bold body-1">PARAÑAQUE CITY HEALTH OFFICE <br/> CITY EMPLOYEES CLINIC</h6> 
        </v-col>
        
        <v-col v-else class="text-center" cols="12" sm="12" md="12" lg="12">
            <h6 class="font-weight-bold body-1">Republic of the Philippines</h6>
            <h6 class="body-1"> OFFICE OF THE CITY HEALTH OFFICE </h6>
            <h6 class="body-1">City of Parañaque </h6>
            <h6 v-if="is_gender_verification" class="font-weight-bold body-1">City Employees' Clinic</h6> 
        </v-col>
    </v-row>

    <v-row v-else-if="$store.state.usr_credentials.lgu_host_code === 'SR' && is_medical_certificate" dense no-gutters>

        <v-col cols="12" sm="3" md="1" lg="1">
            <!-- <v-img :src="prv_config.provider_logo" position="left" height="100%" width="100%" max-height="110" min-height="110" contain></v-img> -->
            <v-img :src="prv_config.provider_logo" height="100%" width="100%" max-height="110" min-height="110" contain></v-img>
        </v-col>

        <v-col class="text-center" cols="12" sm="6" md="10" lg="10" style="position: relative;">
            <h6 class="font-weight-bold body-1">CITY GOVERNMENT OF {{ prv_data.municipality }} </h6>
            <h6 class="font-weight-bold body-1">{{ prv_data.province }} CITY HEALTH OFFICE</h6>
            <p>Tel No.: 049-544-1285 <br> Email: cityhealthofficetwo@yahoo.com</p>
        </v-col>
    </v-row>

    <v-row v-else-if="$store.state.usr_credentials.lgu_host_code === 'PTB'" dense no-gutters>
        <v-img :src="prv_config.provider_logo" position="left" height="80%" width="80%" max-height="80" min-height="80" contain></v-img>

        <v-col cols="12" sm="12" md="12" lg="12">
            <h6 class="font-weight-bold body-2" style="font-size: 10pt !important;">Address: Purok 5 TCES, Angel Heights Subdivision, Nelieta Noval St. Poblacion, Tubod Lanao del Norte</h6>
            <h6 class="body-2" style="font-size: 10pt !important;">Clinic Schedule: Monday to Sunday, 7:00am - 5:00pm</h6>
            <h6 class="body-2" style="font-size: 10pt !important;">For appointment and inquiries, please contact: 09754229455</h6>
        </v-col>
    </v-row>

    <v-row v-else dense no-gutters>
        <v-col cols="12" sm="3" md="1" lg="1">
            <v-img :src="prv_config.provider_logo" position="left" height="100%" width="100%" max-height="110" min-height="110" contain></v-img>
        </v-col>

        <v-col class="text-center" cols="12" sm="6" md="10" lg="10" style="position: relative;">
            <h6 class="font-weight-bold body-1">REPUBLIC OF THE PHILIPPINES</h6>
            <h6 class="body-2"> PROVINCE OF {{ prv_data.province }} </h6>
            <h6 class="body-2"> {{ prv_data.municipality }} </h6>
            <div v-if="usr_credentials.lgu_host_code === 'AT'" class="health-office"> 
                <h1 class="font-italic green--text"> CITY HEALTH OFFICE </h1>
            </div>
            <h6 :class="[usr_credentials.lgu_host_code === 'AT' ? 'mt-10' : 'mt-2', 'font-weight-bold text-uppercase body-2']">{{ prv_data.provider_name }} <br/> <span v-if="usr_credentials.tel_no !== ''" class="caption"> Tel No. {{ usr_credentials.tel_no }} </span> <span v-if="usr_credentials.email !== ''" class="caption"> Email: {{ usr_credentials.email }} </span></h6>
        </v-col>

        <v-col v-if="get_provider" cols="12" sm="3" md="1" lg="1">
            <v-img :src='require(`@/assets/card-logo/${provider_type(usr_credentials.lgu_host_code)[0].name}/logo_3.png`)' position="right" height="100%" width="100%" max-height="110" min-height="110" contain></v-img>
            <!-- <v-img :src="prv_config.provider_logo" position="right" height="100%" width="100%" max-height="110" min-height="110" contain></v-img>
            {{ provider_type(usr_credentials.lgu_host_code)[0].name }} -->
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default{
    props: ['is_medical_certificate', 'is_treatment_plan', 'disability_certification', 'is_gender_verification'],
    
    data() {
        return {
            provider_list: ['AT']
        }
    },

    computed: {
        ...mapState(['usr_credentials', 'prv_data', 'prv_config']),

        get_provider() {
            let provider_logo = false

            this.provider_list.map(data => {
                if(data.includes(this.usr_credentials.lgu_host_code)){
                    provider_logo = true
                }
            })
            return provider_logo
        }
    }
}
</script>

<style> 

@media print {
    body{
        background: white;
        position: relative;
    }
    .antipolo-logo {
        position: absolute;
        right: 4.5rem;
    }

    .health-office {
        position: absolute;
        left: 50%;
        top: 4rem;
        transform: translateX(-50%);
        text-wrap: nowrap;
        text-align: center;
        width: 100%;
    }
}
</style>