<template>
    <v-row dense> 
        <v-col cols="12" sm="12" md="12" lg="12" class="d-flex justify-center align-center"> 
            <v-card width="400" class="pa-6" outlined> 
                <h4 class="text-center body-1 font-weight-medium"> {{ summary_title }} </h4>
                <v-sheet class="text-center pa-10"> 
                    <h4 class="font-weight-medium text-h4"> {{ summary_data }} </h4>
                </v-sheet>
                <v-sheet class="d-flex justify-space-around align-center"> 
                    <div class="body-1 font-weight-medium"> Actual: <span class="body-1 font-weight-regular"> {{ summary_actual }} </span> </div>
                    <div class="body-1 font-weight-medium"> Target: <span class="body-1 font-weight-regular"> {{ summary_target }} </span> </div>
                </v-sheet>
            </v-card>
        </v-col>
    </v-row> 
</template>
<script> 
export default {
    props: ['summary_title', 'summary_data', 'summary_actual', 'summary_target']
}
</script>