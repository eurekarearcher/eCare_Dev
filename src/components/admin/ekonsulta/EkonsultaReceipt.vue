<template>
    <div class="receipt-div" v-if="konsulta_submitted_response">
        <v-row align="center" class="wrap mb-3">
            <v-col cols="12"  style="border:1px;">
                <v-row class="wrap mb-3" no-gutters>
                    <v-col cols="12" sm="5" class="text-start roman"  >
                        <v-img src="@/assets/philhealth.png" class="philhealth_logo" lazy-src="@/assets/philhealth.png"/>
                    </v-col>

                    <v-col cols="12" sm="7" class="text-start roman"  style="border-left: 1px solid #696969; padding-left: 15px;">
                        <h4 class="font-weight-regular header">Republic of the Philippines</h4>
                        <h4 class="header">PHILIPPINE HEALTH INSURANCE CORPORATION</h4>
                        <h4 class="header">PhilHealth Regional Office NCR North Branch</h4>
                        <h5 class="header font-weight-regular mb-0">
                            <span class="mdi mdi-map-marker"></span>
                            Ten Commandments Building, 689 Rizal Avenue Extension
                        </h5>
                        <h5 class="header font-weight-regular mb-0">
                            <span class="pl-4">Grace Park, Caloocan City</span>
                        </h5>
                        <h5 class="header font-weight-regular mb-0">
                            <span class="mdi mdi-phone"></span> (02) 8361-0711
                            <span class="mdi mdi-web"></span> www.philhealth.gov.ph
                        </h5>
                        <h5 class="header font-weight-regular mb-0">
                            <span class="mdi mdi-facebook"></span> PhilHealthPRONCR
                            <span class="mdi mdi-twitter"></span> teamphilhealth
                        </h5>
                    </v-col>
                    
                </v-row>
                 <v-row class="d-flex justify-center ma-0 pa-0 ">
                    <v-col cols="11" class="text-center">
                        <h3>YAKAP UPLOAD CONFIRMATION RECEIPT</h3>
                    </v-col>
                </v-row>
            </v-col>

             <v-col cols="11"> 
                
                <table>
                    <thead>
                        <tr>
                            <td style="width:20%"><label class="text-no-wrap body-2 pr-2">Date/Time</label></td>
                            <td style="width:60%"><span class="font-weight-bold body-2">{{ date_now }}</span></td>
                            <td rowspan="7" style="width:20%">
                                <div class="qr-box">
                                    <QrcodeVue :value="ekonsulta_qr_value" :size="120" level="L" renderAs="svg" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td><label class="text-no-wrap body-2 pr-2">Generated:</label></td>
                            <td></td>
                        </tr>
                         <tr>
                            <td><label class="text-no-wrap body-2 pr-2">Result:</label></td>
                            <td>
                                <span class="font-weight-bold body-2">FILE UPLOADED SUCCESSFULLY WITH <br>TRANSACTION NUMBER 
                                {{konsulta_submitted_response.uploadXmlResult.transaction_no || ''}}
                                </span>
                            </td>
                        </tr>
                         <tr>
                            <td><label class="text-no-wrap body-2 pr-2">Date Uploaded:</label></td>
                            <td>
                                <span class="font-weight-bold body-2">
                                    {{konsulta_submitted_response.uploadXmlResult.dateuploaded || ''}}
                                </span>
                            </td>
                        </tr>
                         <tr>
                            <td><label class="text-no-wrap body-2 pr-2">Uploaded By:</label></td>
                            <td>
                                <span class="font-weight-bold body-2">
                                    {{$store.state.usr_credentials.user_name}}
                                </span>
                            </td>
                        </tr>
                         <tr>
                            <td><label class="text-no-wrap body-2 pr-2">No. of Successful Records:</label></td>
                            <td style="text-align: center;">
                                <span class="font-weight-bold body-2">
                                    {{konsulta_submitted_response.total_case_no || ''}}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td><label class="text-no-wrap body-2 pr-2">No. of Failed Records:</label></td>
                            <td style="text-align: center;"> <span class="font-weight-bold body-2">0</span></td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>

                <v-simple-table class="no-border-table">
                    <thead>
                        <tr>
                            <th style="width:5%;background-color:white;">
                                <span class="black--text th-val">No.</span>
                            </th>
                            <th style="width:20%;background-color:white;">
                                <span class="black--text th-val">Pin</span>
                            </th>
                            <th style="width:75%;background-color:white;">
                                 <span class="black--text th-val">Error Remarks</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </v-simple-table>

            </v-col>

        </v-row>
    </div>
   
</template>
<script>
import QrcodeVue from 'qrcode.vue';

export default {
    props: ['konsulta_submitted_response'],
    components: {
        QrcodeVue
    },
    data() {
        return {
            date_now:this.dateTimeToday()
        }
    },

    computed: {
        ekonsulta_qr_value() {
            return (
            "Message: FILE UPLOADED SUCCESSFULLY WITH TRANSACTION NUMBER " 
            + (this.konsulta_submitted_response?.uploadXmlResult?.transaction_no || '')
            );
        }
    }

}
</script>

<style scoped>
    /* a4 size */
    .receipt-div {
        width: 794px;   
        min-width: 794px;
        margin: 0 auto;
        background: white;
    }

    /* philhealth logo size */
    .philhealth_logo {
        width: 180px !important;
        height: 90px !important;
    }

    .header{ line-height:1.1;} 
    .roman{ font-family:'Times New Roman', Times, serif}

    .no-border-table {
        width: 60%;
    }
    .no-border-table table,
    .no-border-table th,
    .no-border-table td,
    .no-border-table tr {
        border: none !important;
    }
    .no-border-table th .th-val {
        font-weight: normal;
    }

    .qr-box {
        border: 1px solid #333333; 
        width: 135px;                
        height: 135px;                
        display: flex;                 
        justify-content: center;       
        align-items: center;            
    }
</style>