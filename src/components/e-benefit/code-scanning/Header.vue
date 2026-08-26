<template>
    <v-container fluid class="pa-0">
        <v-row class="height-80 align-center justify-space-between">
            <v-col v-if="$store.state.prv_data" cols="6" sm="6" md="6" lg="6"  class="d-flex justify-start logo-div">
            <v-img v-if="$store.state.prv_data.software_accre_logo" :src="$store.state.prv_data.software_accre_logo"  :max-width="$vuetify.breakpoint.name === 'xl' ? '250' : '200'" contain></v-img>
            </v-col>
            
            <div class="flex-grow"></div>
            <v-col cols="6" sm="6" md="6" lg="6" class="d-flex justify-end pt-4"> 
            <v-img v-if="prv_config" :src="prv_config.provider_logo" height="80" width="180" max-width="200" alt="provider logo" contain></v-img>
            </v-col>
        </v-row>

        <v-row class="mt-md-7 justify-space-between align-center">
            <v-col cols="6">
                <h1 class="body-1 my-5 font-weight-medium"> <v-icon color="primary" class="mb-1" left>mdi-view-dashboard</v-icon>  {{ title }}</h1>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
                <h1 class="body-2 my-5 text-capitalize"> <strong>Welcome</strong>, {{ $store.state.usr_credentials.user_complete_name }} </h1>
            </v-col>
        </v-row>

        <v-divider class="mb-5"></v-divider>
    </v-container>
</template>

<script>
export default {
    name: 'HeaderPage',
    props: ['title'],
    data (){
        return{
             // PROVIDER CONFIG LOGO
            prv_config: localStorage.getItem('dskDo3Y') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('dskDo3Y'),'ldoweSf').toString(this.$crypto.enc.Utf8)) : null, 
        }
    }
}
</script>
