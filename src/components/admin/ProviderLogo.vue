<template>
    <div>
        <v-row justify="center" class="text-center">
            <v-col cols="12" sm="9" md="9" lg="5" xl="5">
                <h3 class="text-left mb-6">Card Logo</h3>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" align="center">
                        <v-img v-if="$store.state.prv_config.provider_logo" :src="$store.state.prv_config.card_logo" width="700"></v-img>

                        <div v-else class="no-image">
                            <v-icon size="60">mdi-image-off</v-icon>
                            <h2 class="font-weight-medium">NO IMAGE</h2>
                        </div>
                    </v-col>
                </v-row>

                <div class="change-image pa-5 mt-8">
                    <!-- IMAGE PREVIEW -->
                    <input v-on:change="displayPreview('first_logo')" id="file-image-first" class="d-none" type="file" ref="card_file" accept="image/png, image/jpeg"/>

                    <div v-if="new_logo2nd" class="mb-6">
                        <h4 class="font-weight-medium text-left font-italic">Preview</h4>
                        <v-img :src="new_logo2nd"></v-img>
                    </div>

                    <v-row align="center" class="text-sm-left" dense>
                        <v-col cols="12" sm="12" md="7" lg="7" xl="7">
                            <h5 class="font-weight-regular">Allowed Types: <i>PNG, JPG and JPEG</i></h5>
                            <h5 class="font-weight-regular">Maximum upload size: 2 MB</h5>
                        </v-col>
                    </v-row>

                    <v-row align="start" class="text-sm-right mt-n12" dense>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <v-btn :disabled="btn_loading" @click="$refs.card_file.click()">BROWSE</v-btn>
                        </v-col>
                    </v-row>
                </div>

                <h5 v-if="error_msg_1st" class="font-weight-regular pa-3 mt-4 text-left red lighten-4"><v-icon left>mdi-alert</v-icon> {{ error_msg_1st }}</h5>
            </v-col>

            <v-col cols="12" sm="9" md="9" lg="5" xl="5">
                <h3 class="text-left mb-6">Current Logo</h3>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12" align="center">
                        <v-img v-if="$store.state.prv_config.provider_logo" :src="$store.state.prv_config.provider_logo" width="700"></v-img>

                        <div v-else class="no-image">
                            <v-icon size="60">mdi-image-off</v-icon>
                            <h2 class="font-weight-medium">NO IMAGE</h2>
                        </div>
                    </v-col>
                </v-row>

                <div class="change-image pa-5 mt-8">
                    <!-- IMAGE PREVIEW -->
                    <input v-on:change="displayPreview('second_logo')" id="file-image-second" class="d-none" type="file" ref="file" accept="image/png, image/jpeg"/>

                    <div v-if="new_logo" class="mb-6">
                        <h4 class="font-weight-medium text-left font-italic">Preview</h4>
                        <v-img :src="new_logo"></v-img>
                    </div>

                    <v-row align="center" class="text-sm-left" dense>
                        <v-col cols="12" sm="12" md="7" lg="7" xl="7">
                            <h5 class="font-weight-regular">Allowed Types: <i>PNG, JPG and JPEG</i></h5>
                            <h5 class="font-weight-regular">Maximum upload size: 2 MB</h5>
                        </v-col>
                    </v-row>

                    <v-row align="start" class="text-sm-right mt-n12" dense>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                            <v-btn :disabled="btn_loading" @click="$refs.file.click()">BROWSE</v-btn>
                        </v-col>
                    </v-row>
                </div>

                <h5 v-if="error_msg_2nd" class="font-weight-regular pa-3 mt-4 text-left red lighten-4"><v-icon left>mdi-alert</v-icon> {{ error_msg_2nd }}</h5>
            </v-col>

            <v-col cols="12" sm="12" md="12" lg="8" xl="8"> 
                <v-card>
                    <v-card-title class="primary white--text justify-center d-print-none">
                        <span><v-icon size="25" left dark>mdi-card-account-details</v-icon>Generated Card</span>
                    </v-card-title>

                    <v-layout wrap class="space-around" >
                        <v-sheet :width="384" :max-width="384" class="relative elevation-3 mx-auto" id="front" >
                            <v-img src="@/assets/front-card.png" lazy-src="@/assets/front-card.png"></v-img>
                            <div class="mt-4 absolute" style="top: 10px; left: 22px; width: 85%;">
                                <div class="d-flex align-start justify-space-between">
                                    <h3 class="health-card-title mt-1 text-start" style="width: 200px;"> PROVIDER HEALTHCARE </h3>
                                    <div class="d-flex justify-center align-center mt-n2"> 
                                        <v-img :src="new_logo2nd ? new_logo2nd : this.$store.state.prv_config.card_logo" :lazy-src="this.$store.state.prv_config.provider_logo" class="mx-2" height="42" width="42" contain> </v-img>
                                        <v-img :src="new_logo ? new_logo : this.$store.state.prv_config.provider_logo" :lazy-src="this.$store.state.prv_config.provider_logo" class="mx-2" height="42" width="42" contain> </v-img>
                                    </div>
                                </div> 
                            </div> 
                            <v-layout wrap :class="['position-card-view','absolute', ]" style="width:100%">
                                <div class="d-flex justify-space-between align-start" style="width: 92%;"> 
                                <div>
                                    <v-img src="@/assets/no-image.jpg" alt="Avatar" :width="150" :height="180"></v-img>
                                </div>
                                <div class="text-center" style="width: 50%;"> 
                                    <h6 :class="['font-title-view', 'patient-name text-uppercase font-weight-bold mb-1 pr-1']">JUAN DELACRUZ</h6>
                                    <h6 :class="['font-subtitle-view', 'font-weight-regular']">EK-XXX-XXX-XXXX</h6>
                                    <h6 :class="['font-subtitle-view', 'font-weight-regular']">02XXXXXXX</h6>
                                </div>
                                </div>
                            </v-layout>
                            </v-sheet>
                            <v-sheet :width="384" :max-width="384" class="relative elevation-3 mx-auto" id="back">
                                <div class="mt-4 absolute" style="top: 4px; left: 22px; z-index: 1;">
                                    <h3 class="health-card-title text-start" style="width: 200px;"> PROVIDER HEALTHCARE </h3>
                                </div>
                            <h6 :class="['font-subtitle-view', 'font-italic', 'date-released']"> Released Date: MM/DD/YYYY </h6>
                            <!-- <v-img src="@/assets/back-card.png" lazy-src="@/assets/back-card.png" contain></v-img> -->
                            <v-img src="@/assets/back-card.jpg" lazy-src="@/assets/back-card.jpg" contain></v-img>
                            <div class="mt-4 absolute" style="top: 38px; left: 172px; z-index: 1;"> 
                                <div class="card-back-text text-start font-weight-medium"> 
                                Presenting your PROVIDER HEALTHCARE QR code <br />
                                to be scanned provides consent to the authorized <br />
                                government personnel or accredited healthcard <br />
                                provider to access your personal information and <br />
                                medical records.
                                </div>  
                            </div>
                            <div class="mt-4 absolute" style="top: 94px; left: 172px; z-index: 1;"> 
                                <div class="card-back-text text-start font-weight-medium"> 
                                This PROVIDER HEALTHCARE ID and QR Code are <br />
                                non transferrable.
                                </div>  
                            </div>
                            <QrcodeVue :value="$store.state.prv_data.provider_name" :size="130" :class="['position-card-view', 'absolute']" renderAs="svg" id="qrCode"/>
                            <div :class="['position-back-logo-view', 'absolute']">
                                <v-img :src="this.$store.state.prv_config.card_logo ? this.$store.state.prv_config.card_logo : require('@/assets/heroes_health.png')" :lazy-src="this.$store.state.prv_config.card_logo ? this.$store.state.prv_config.card_logo : require('@/assets/heroes_health.png')" class="mx-2" height="42" width="42" id="card-logo" contain> </v-img>
                            </div>
                        </v-sheet>
                    </v-layout>
                </v-card>
            </v-col>

            <v-col cols="12" sm="12" md="12" lg="12" xl="12"> 
                <div v-if="new_logo || new_logo2nd" class="mb-8 mt-4">
                    <v-btn :loading="btn_loading" @click="confirmChangeLogo" color="success">CONFIRM</v-btn>
                    <v-btn :disabled="btn_loading" @click="cancelChangeLogo" class="grey darken-1 white--text ml-4">CANCEL</v-btn>  
                </div>
            </v-col>
        </v-row>

        <Alert :alert="alert" @updateLogo="updateLogo" />
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"
import QrcodeVue from 'qrcode.vue'

export default {
    components: {
        Alert,
        QrcodeVue
    },

    data(){
        return{
            file: '',
            card_logo: '',
            new_logo: '',
            new_logo2nd: '',
            btn_loading: false,
            error_msg_1st: '',
            error_msg_2nd: '',
            alert: {}
        }
    },

    methods: {
        // DISPLAY PREVIEW OF NEW LOGO
        displayPreview(value){
            if (value === 'first_logo') {
                let card_logo = this.$refs.card_file.files[0];

                if(card_logo.type === 'image/png' || card_logo.type === 'image/jpeg'){
                    let file_size = parseFloat(Number(card_logo.size * 0.00000095367432).toFixed(2))
                    
                    if(file_size > 2){
                        document.getElementById('file-image-first').value = ''
                        this.new_logo2nd = ''
                        this.error_msg_1st = 'File size exceeds 2 MB. Please select another file.'
                    }else{
                        this.error_msg_1st = ''
                        this.new_logo2nd = URL.createObjectURL(card_logo);
                        this.card_logo = card_logo
                    }
                }else{
                    document.getElementById('file-image-first').value = ''
                    this.new_logo2nd = ''
                    this.error_msg_1st = 'File type is not supported. Please select another file.'
                }
            }

            if (value === 'second_logo') {
                let file = this.$refs.file.files[0];
    
                if(file.type === 'image/png' || file.type === 'image/jpeg'){
                    let file_size = parseFloat(Number(file.size * 0.00000095367432).toFixed(2))
                    
                    if(file_size > 2){
                        document.getElementById('file-image-second').value = ''
                        this.new_logo = ''
                        this.error_msg_2nd = 'File size exceeds 2 MB. Please select another file.'
                    }else{
                        this.error_msg_2nd = ''
                        this.new_logo = URL.createObjectURL(file);
                        this.file = file
                    }
                }else{
                    document.getElementById('file-image-second').value = ''
                    this.new_logo = ''
                    this.error_msg_2nd = 'File type is not supported. Please select another file.'
                }
            }
        },

        // CONFIRM CHANGE PROVIDER LOGO
        confirmChangeLogo(){
            this.alert = { display: true, type: 'standard', width: '370', icon: 'mdi-help-circle', color: 'primary', title: 'This will replace the current logo', body: 'Do you want to continue?', btn_pry_txt: 'YES', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'updateLogo', btn_sec_txt: 'NO', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        },

        // CANCENL CHANGE LOGO
        cancelChangeLogo(){
            this.new_logo = '' 
            this.new_logo2nd = ''
            document.getElementById('file-image-first').value = ''
            document.getElementById('file-image-second').value = ''
            
        },

        async updateLogo() {
            this.btn_loading = true;

            let formData = new FormData();
            
            if(this.file) {
                formData.append('file', this.file);
            }

            if(this.card_logo) {
                formData.append('logo_file', this.card_logo)
            }

            formData.append('post_data', this.wsDataEncryption(JSON.stringify({
                fkey: 'update_provider_logo',
                ...this.file ? { provider_logo: this.file.name } : undefined ,
                ...this.card_logo ? { card_logo: this.card_logo.name } : undefined,
                ...this.$store.state.prv_data.provider_tin ? { provider_tin: this.$store.state.prv_data.provider_tin } : undefined,
                ...this.$store.state.prv_data.provider_code ? { provider_code: this.$store.state.prv_data.provider_code } : undefined,
                ...this.$store.state.usr_credentials.user_name ? { process_by: this.$store.state.usr_credentials.user_name } : undefined
             })));

            let response = await this.$services.admUpdProviderConfig(null,formData);

            if (response && response.status === 200) {
                if (response.data.success) {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-check-circle', color: 'success', title: 'Update Successful', btn_pry_txt: 'OK', btn_pry_color: 'success', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
                }
                localStorage.removeItem('dskDo3Y');
            } else {
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
            }
        }
    }
}
</script>

<style scoped>
.no-image{
    border: 1px solid lightgrey;
    border-radius: 6px;
    color: grey;
    margin: 5px 0 0 0;
    padding: 50px 0;
}
.change-image{
    background: #F5F5F5;
    border: 2px dashed grey; 
}

.relative{
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
  bottom: 60px;
  width:60%;
}

.position-card-view {
  top:75px;
  left:25px;
}

.position-back-logo-view{
  top: 82%;
  left: 1%;
}

.font-title-view{
  color: #312f2f;
  font-size:11.5pt; 
  line-height:1.125;
  margin-top:2rem;
  
}

.font-subtitle-view{
  color: #312f2f;
  font-size:8pt;
}

.name_position {
  position: relative;
  top: -15px;
}

.space-around {
    justify-content: space-around;
    padding: 1.2em
}

.date-released{
  font-size: 8px;
  top: 25px;
  right: 10px;
  position: absolute;
  z-index: 1;

}

.health-card-title{
  color: #010165;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
}

.card-back-text {
  font-family: Arial, Helvetica, sans-serif;
  color: rgb(26, 26, 26);
  font-size: 8px;
  font-weight: 200;
  word-spacing: 2px;
  line-height: 11px;
}
</style>
