<template>
    <v-container> 
        <v-sheet> 
            <v-img src="@/assets/eurekare-logo.jpg" width="240"> </v-img>
        </v-sheet>
        <v-divider> </v-divider>
        <v-row no-gutters dense> 
            <v-col cols="12" sm="12" md="8" lg="8" class="pl-8"> 
                <v-sheet> 
                    <h1 class="text-h1 font-weight-regular my-3"> eCare</h1>
                    <h4 class="teal--text my-3"> Eurekare Corporation </h4>
                    <v-btn :href="`${$services.base_url.cms}/resources/apk_files/download_apk.php`" class="teal white--text my-3"> Download APK </v-btn>
                    <v-sheet class="d-flex justify-start align-end my-3"> 
                        <v-icon class="mr-2" medium> mdi mdi-cellphone-link </v-icon>
                        <h4 class="text-body-2 font-weight-regular"> This app is available on android device </h4>
                    </v-sheet>
                </v-sheet>

                <v-divider> </v-divider>

                <v-slide-group v-model="slide_group_model" class="pa-4" active-class="success" show-arrows>
                    <v-slide-item v-for="data in 6" :key="data" v-slot="{ toggle }">
                        <v-sheet class="ma-4" @click="toggle">
                            <v-img :src="require('@/assets/ecare-app/ecare' + data + '.png')"  width="200"> </v-img>
                        </v-sheet>
                    </v-slide-item>
                </v-slide-group>
                <v-sheet class="my-8"> 
                    <h4 class="text-body-1 font-weight-medium"> About this app </h4>
                    <p class="text-body-2"> 
                        This application enables effortless QR Code creation and facilitates the registration
                        of your family members into the eCare System. Additionally, you can securely access your
                        electronic medical records through the app and virtually consult with your preferred doctor.
                        Our primary objectives is to ensure the security and well-being of your family's health.
                    </p>
                </v-sheet>
                <v-sheet class="my-8"> 
                    <h4 class="text-body-1 font-weight-medium"> How it works </h4>
                    <p class="text-body-2"> 
                        eCare App creates seamless connection to our eCare web-based application located in registered
                        medical facilities. Using the app, scan the QR Code to initiate a medical transaction.    
                    </p>
                </v-sheet>

                <v-sheet class="my-8"> 
                    <h4 class="text-body-1 font-weight-medium"> Data safety </h4>
                    <p class="text-body-2"> 
                        Safety starts with understanding how developers collect and share your data. Data Privacy and security practices may vary
                        based on your use, region and age. The developer provided this information and may update it over time.
                    </p>
                </v-sheet>
            </v-col>
            <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" sm="12" md="4" lg="4"> 
                <v-img src="@/assets/heroes_health.jpg"> </v-img>
            </v-col>
        </v-row>
    </v-container>
</template>
<script> 
export default {
    data() {
        return {
            slide_group_model: false
        }
    }
}
</script>