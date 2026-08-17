<template>
    <div>
        <v-row align="center">
            <v-col cols="12" class="header-title text-center my-5">
                <div class="text-h4 font-weight-bold black--text text--darken-3">
                CLAIM INFO
                </div>
            <div class="text-h7">
                Claim Information and Attachments
                </div>
            </v-col>
        </v-row>
        
        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="4" md="4" lg="6">
            <h3 class="section-title">CLAIM INFORMATION</h3>
          </v-col>
        </v-row>

        <v-divider/>

        <div>
            <v-row class="mt-4" dense align="center">
                <v-col cols="12" sm="12" md="2" lg="2" class="text-left">
                <label class="body-2">
                    PATIENT NAME
                </label>
                </v-col>
    
                <v-col cols="12" sm="6" md="3" lg="3">
                <v-text-field :value="cf1_data.member_first_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                    First Name
                </h5>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="3">
                <v-text-field :value="cf1_data.member_middle_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                    Middle Name
                </h5>
                </v-col>

                <v-col cols="12" sm="9" md="3" lg="3">
                <v-text-field :value="cf1_data.member_last_name" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                    Last Name
                </h5>
                </v-col>

                <v-col cols="12" sm="3" md="1" lg="1">
                <v-text-field :value="cf1_data.member_suffix" class="body-2" hide-details readonly dense/>
                <h5 class="font-weight-light text-center">
                    Suffix
                </h5>
                </v-col>
            </v-row>

            <v-row align="center" class="mt-4" dense>
                <v-col cols="12" sm="3" md="2" lg="2">
                    <label class="body-2">
                        HOSPITAL TRANSMITTAL NO.
                    </label>
                </v-col>
                <v-col cols="12" sm="9" md="2" lg="2">
                    <v-text-field :value="claim_info.hospital_transmittal_no" class="body-2" hide-details readonly dense/>
                </v-col>

                <v-col cols="12" sm="3" md="1" lg="1" class="text-md-right">
                    <label class="body-2">
                        CLAIM NO.
                    </label>
                </v-col>
                <v-col cols="12" sm="4" md="2" lg="2">
                    <v-text-field :value="claim_info.claim_no" class="body-2" hide-details readonly dense/>
                </v-col>

                <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
                    <label class="body-2">
                        CLAIM TYPE
                    </label>
                </v-col>
                <v-col cols="12" sm="4" md="4" lg="4">
                    <v-text-field :value="claim_info.claim_type" class="body-2" hide-details readonly dense />
                </v-col>
            </v-row>

             <v-row align="center" class="mt-4" dense>
                <v-col cols="12" sm="3" md="2" lg="2">
                    <label class="body-2">
                        TRACKING NO.
                    </label>
                </v-col>
                <v-col cols="12" sm="9" md="2" lg="2">
                    <v-text-field :value="claim_info.tracking_no" class="body-2" hide-details readonly dense/>
                </v-col>

                <v-col cols="12" sm="3" md="1" lg="1" class="text-md-right">
                    <label class="body-2">
                        PATIENT TYPE
                    </label>
                </v-col>
                <v-col cols="12" sm="4" md="2" lg="2">
                    <v-text-field :value="claim_info.patient_type" class="body-2" hide-details readonly dense/>
                </v-col>

                <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
                    <label class="body-2">
                        SERIES LHIO
                    </label>
                </v-col>
                <v-col cols="12" sm="4" md="2" lg="2">
                    <v-text-field :value="claim_info.series_lhio" class="body-2" hide-details readonly dense />
                </v-col>

                <v-col cols="12" sm="1" md="1" lg="1" class="text-md-right">
                    <label class="body-2">
                        EMERGENCY
                    </label>
                </v-col>
                <v-col cols="12" sm="4" md="1" lg="1">
                    <v-text-field :value="claim_info.is_emergency" class="body-2" hide-details readonly dense />
                </v-col>
            </v-row>
        </div>
        
        <v-divider class="mt-6"/>

        <v-row wrap class="my-1">
          <v-col cols="12" sm="4" md="4" lg="6">
            <h3 class="section-title">ATTACHMENTS
                <span v-if="offline_documents.length === 0 " class="text-caption font-weight-regular font-italic">
                  ( NO ATTACHMENT FOUND )
                </span> 
            </h3>
          </v-col>
        </v-row>
        
        <v-divider/>
        
        <div v-for="(file, index) in offline_documents" :key="index"> 
            <iframe :src="`${file.doc_url}#toolbar=0`" width="100%" height="1300px" style="border:none;margin-top:10px" ref="pdf"></iframe>
        </div>
        
        <v-divider class="mt-12"/>
    </div>
</template>

<script>

export default {
  props: ['offline_documents','claim_info','cf1_data']
}
</script>

