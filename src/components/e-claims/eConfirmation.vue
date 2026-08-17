<template>
    <div id="for-print-absolute"> 
        <v-card id="for-print" class="elevation-0"> 
            <v-card-title class="d-flex justify-center text-center">
                <h2 class="body-1 font-weight-medium"> e-Confirmation </h2>
            </v-card-title>
            <v-card-subtitle class="d-flex justify-space-between mt-2 px-4">
                <h4 class="body-2"> Claim Series: {{ track_status_holder.mapping[0].pclaimSeriesLhio }} </h4>
                <h4 class="body-2"> Claim No: {{ track_status_holder.mapping[0].pclaimNumber }} </h4>
            </v-card-subtitle>
            
            <v-sheet class="pa-4"> 
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" lg="12">
                        <v-row dense> 
                            <v-col cols="12" sm="4" md="4" lg="4"> 
                                <h6 class="body-2">First Name </h6>
                                <v-text-field :value="track_status_holder.mapping[0].ppatientFirstName" readonly hide-details dense> </v-text-field>    
                            </v-col>  
                            <v-col cols="12" sm="4" md="4" lg="4"> 
                                <h6 class="body-2">Middle Name </h6>
                                <v-text-field :value="track_status_holder.mapping[0].ppatientMiddleName" readonly hide-details dense> </v-text-field>    
                            </v-col>  
                            <v-col cols="12" sm="4" md="4" lg="4"> 
                                <h6 class="body-2">Last Name </h6>
                                <v-text-field :value="track_status_holder.mapping[0].ppatientLastName" readonly hide-details dense> </v-text-field>    
                            </v-col>  
                        </v-row>
                        
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6"> 
                        <h6 class="body-2">Phic Pin </h6>
                        <v-text-field v-model="track_status_holder.member_pin" readonly hide-details dense> </v-text-field>
                    </v-col>   
                    <v-col cols="12" sm="6" md="6" lg="6">
                        <h6 class="body-2">Claim Date Received </h6>
                        <v-text-field v-model="track_status_holder.preceivedDate" readonly hide-details dense> </v-text-field>    
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6">
                        <h6 class="body-2">Admission Date </h6>
                        <v-text-field v-model="track_status_holder.mapping[0].padmissionDate" readonly hide-details dense> </v-text-field>    
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6"> 
                        <h6 class="body-2">Discharged Date </h6>
                        <v-text-field v-model="track_status_holder.mapping[0].pdischargeDate" readonly hide-details dense> </v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" sm="12" md="6" lg="6"> 
                        <h6 class="body-2">Claim Date Refile </h6>
                        <v-text-field v-model="track_status_holder.preceiptTicketNumber" label="Claim Date Refile" readonly hide-details hide-details outlined dense> </v-text-field>
                    </v-col> -->
                    <v-col cols="12" sm="6" md="6" lg="6">
                        <h6 class="body-2">Hospital Code </h6>
                        <v-text-field v-model="track_status_holder.phospitalCode"  readonly hide-details dense> </v-text-field>    
                    </v-col>
                    <v-col cols="12" sm="6" md="6" lg="6"> 
                        <h6 class="body-2">Hospital Transmittal No</h6>
                        <v-text-field v-model="track_status_holder.phospitalTransmittalNo" readonly hide-details  dense> </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="12"> 
                        <h6 class="body-2">Receipt Ticket Number</h6>
                        <v-text-field v-model="track_status_holder.preceiptTicketNumber" readonly hide-details  dense> </v-text-field>
                    </v-col>
                </v-row>
                <v-sheet class="d-flex justify-end mt-3"> 
                    <v-btn @click="printEConfirmation" class="white--text d-print-none" color="#367c9d" small>Print e-Confirmation<v-icon color="white" right>mdi-printer</v-icon></v-btn>
                </v-sheet>
            </v-sheet>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ['track_status_holder'],

    methods: {
        printEConfirmation() {
            window.scrollTo(0, 0);
            window.print()
        },
    }
}
</script>

<style scoped>

@media print {
    body * {
        background: white;
        position: relative;
        width: 100%;
    }

    ::v-deep .v-dialog {
        box-shadow: none;
    }

    #for-print-absolute{
        left: 0;
        padding-top: 50px;
        position: fixed !important; 
        top: 0;
        height: 100vh;
    }
}
</style>