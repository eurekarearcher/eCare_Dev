<template>
    <div class="csm">
        <v-row align="center" class="wrap mb-3 border-bottom">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-col cols="4" sm="4" md="4" lg="4" xl="4" class="px-2">
                    <h4 class="font-weight-regular h4-header">Control No. <span style="border-bottom:1px solid black"></span></h4>
                </v-col>

                <v-row class="wrap mb-3" no-gutters>
                    <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                        <v-img src="@/assets/philhealth.png" class="philhealth_logo" lazy-src="@/assets/philhealth.png"></v-img>
                    </v-col>
                    <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                        <v-img src="@/assets/bagong_pilipinas_logo.png" class="ph_logo" lazy-src="@/assets/bagong_pilipinas_logo.png"></v-img>
                    </v-col>

                    <v-row justify="start">
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="text-start roman">
                            <h4 class="font-weight-regular h4-header">Republic of the Philippines</h4>
                            <h3 class="h3-header">PHILIPPINE HEALTH INSURANCE CORPORATION</h3>
                            <h4 class="h4-header font-weight-regular mb-0" style="line-height:1.2"><span class="mdi mdi-map-marker"></span> Citystate Centre, 709 Shaw Boulevard, Pasig City</h4>
                            <h4 class="h4-header font-weight-regular mb-0" style="line-height:1.2"><span class="mdi mdi-phone"></span> Call Center (02) 8662-2588  <span class="mdi mdi-web"></span> www.philhealth.gov.ph</h4>
                            <h4 class="h4-header font-weight-regular mb-0" style="line-height:1.2"><span class="mdi mdi-facebook"></span> PhilHealthOfficial <span class="mdi mdi-twitter"></span> teamphilhealth</h4>
                        </v-col>
                    </v-row>
                </v-row>

                <v-row class="wrap mb-3" dense>
                    <h4 class="h4-header body-1">This Client Satisfaction Measurement (CSM) tracks the customer experience of government offices. 
                        Your feedback on your <span class="border-bottom">recently concluded transaction</span> will help this office provide a better service. Personal information shared 
                        will be kept confidential and you always have the option to not answer this form.
                    </h4>
                </v-row>

                <v-row align="center" class="wrap mb-3">
                    <v-col cols="2" sm="2" md="2" lg="2" xl="2">
                        <h5 class="h4-header body-1 font-weight-medium">Date & Time</h5>
                    </v-col>

                    <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                        <!-- <v-text-field outlined></v-text-field> -->
                        <span class="box"></span>
                    </v-col>

                    <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                        <h5 class="h4-header body-1 font-weight-medium"> Contact No/ Email Address</h5>
                    </v-col>

                    <v-col cols="3" sm="3" md="3" lg="3" xl="3">
                        <!-- <v-text-field outlined></v-text-field> -->
                        <span class="box"></span>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="2" xl="2">
                        <h5 class="h4-header body-1 font-weight-medium">Client Type</h5>
                    </v-col>

                    <v-col cols="7" sm="7" md="7" lg="7" xl="7" >
                        <v-row align="center">
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1">Citizen</label>
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1">Business</label>
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1">Government (Employee or another agency)</label>
                        </v-row>
                    </v-col>

                    <v-col cols="1" sm="1" md="1" lg="1" xl="1">
                        <h5 class="h4-header body-1 font-weight-medium">Age</h5>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="2" xl="2">
                        <!-- <v-text-field outlined></v-text-field> -->
                        <span class="box"></span>
                    </v-col>

                    <v-col cols="2" sm="2" md="2" lg="2" xl="2">
                        <h5 class="h4-header body-1 font-weight-medium">Service Availed</h5>
                    </v-col>

                    <v-col cols="4" sm="4" md="4" lg="4" xl="4">
                        <!-- <v-text-field outlined></v-text-field> -->
                        <span class="box"></span>
                    </v-col>

                    <v-col cols="1" sm="1" md="1" lg="1" xl="1">
                        <h5 class="h4-header body-1 font-weight-medium px-5">Sex</h5>
                    </v-col>

                    <v-col cols="5" sm="5" md="5" lg="5" xl="5">
                        <v-row align="center">
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1">Male</label>
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1">Female</label>
                            <input onclick="return false" type="checkbox" class="mx-1">
                            <label class="mx-2 h4-header" for="vehicle1"> Prefer not to mention</label>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
            
        </v-row>

        <v-row align="center" class="wrap mb-3 border-bottom">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-row dense>
                    <v-col>
                        <h4 class="h4-header body-1">INSTRUCTIONS: <span class="font-weight-bold">Checkmark (✔)</span> your answer to the Citizen’s Charter (CC) questions. 
                        The Citizen’s Charter is an official document that reflects the services of a government agency/office including its requirements, fees, and processing times among others.</h4>
                    </v-col>
                </v-row>

                <!-- CC Questions -->
                <v-row>
                    <!-- CC1 Section -->
                    <v-col cols="4" md="4">
                        <h4 class="font-weight-regular h4-header body-1"> <span class="font-weight-medium h3-header">CC1</span> Which of the following best describes your awareness of a CC?</h4>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">1. I know what a CC is and I saw this office’s CC.</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">2. I know what a CC is but I did NOT see this office’s CC.</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">3. I learned of the CC only when I saw this office’s CC.</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">4. I do not know what a CC is and I did not see one in this office. (Answer ‘N/A’ on CC2 and CC3)</label>
                        </div>
                    </v-col>

                    <!-- CC2 Section -->
                    <v-col cols="4" md="4">
                        <h4 class="font-weight-regular h4-header body-1"><span class="font-weight-medium h3-header">CC2</span> If aware of CC (answered 1-3 in CC1) would you say that the CC of the office was ...?</h4>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">1. Easy to see</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">2. Somewhat easy to see</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">3. Difficult to see</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">4. Not visible</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">5. N/A</label>
                        </div>
                    </v-col>

                    <!-- CC3 Section -->
                    <v-col cols="4" md="4">
                        <h4 class="font-weight-regular h4-header body-1"><span class="font-weight-medium h3-header">CC3</span> If aware of CC (answered 1-3 in CC1), how much did the CC help you in your transaction?</h4>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">1. Helped very much</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">2. Somewhat helped</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">3. Did not help</label>
                        </div>
                        <div>
                            <input onclick="return false" type="checkbox" class="mx-2" />
                            <label class="h3-header">4. N/A</label>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row align="center" class="wrap mb-3">
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <v-row class="mb-3" dense>
                    <v-col>
                        <h4 class="h4-header body-1">INSTRUCTIONS: Please put a <span class="font-weight-bold">checkmark (✔)</span> on the column that best corresponds to your answer</h4>
                    </v-col>
                </v-row>

                <!-- Survey Table -->
                <v-sheet elevation="2">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th style="background-color: #0892d0; border: 1px solid black;"></th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <v-icon class="mdi mdi-emoticon-outline black--text" x-large></v-icon> <br>
                                    <span class="black--text h5-reminder">Strongly Agree</span>
                                </th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <v-icon class="mdi mdi-emoticon-happy-outline black--text" x-large></v-icon>
                                    <span class="black--text h5-reminder">Agree</span>
                                </th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <v-icon class="mdi mdi-emoticon-neutral-outline black--text" x-large></v-icon> <br>
                                    <span class="black--text h5-reminder">Neither Agree nor <br> Disagree</span>
                                </th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <v-icon class="mdi mdi-emoticon-sad-outline black--text" x-large></v-icon>
                                    <span class="black--text h5-reminder">Disagree</span>
                                </th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <v-icon class="mdi mdi-emoticon-angry-outline black--text" x-large></v-icon> <br>
                                    <span class="black--text h5-reminder">Strongly Disagree</span>
                                </th>
                                <th class="text-center black--text" style="background-color: #0892d0; border: 1px solid black;">
                                    <h2 class="font-weight-bold black--text">N/A</h2>
                                    <span class="black--text h5-reminder">Not Applicable</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(question, index) in questions" :key="index">
                                <td class="h4-header font-weight-medium body-1" style="background-color: #0892d0; text-align: left !important; border: 1px solid black;">
                                {{ question }}
                                </td>
                                <td class="text-center" style="border: 1px solid black;"></td>
                                <td class="text-center" style="border: 1px solid black;"></td>
                                <td class="text-center" style="border: 1px solid black;"></td>
                                <td class="text-center" style="border: 1px solid black;"></td>
                                <td class="text-center" style="border: 1px solid black;"></td>
                                <td class="text-center" style="border: 1px solid black;">
                                <span v-if="question.includes('SQD5')" class="font-weight-bold">✔</span>
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-sheet>

                <v-sheet elevation="2" class="mt-3">
                    <v-simple-table>
                        <thead >
                            <tr>
                                <th style="background-color: #0892d0; text-align: left !important; border: 1px solid black;">
                                    <span class="black--text font-weight-medium body-2 h4-header">Comments/Suggestions</span>
                                </th>
                                <th style="background-color: #0892d0; padding-right: 30rem; border: 1px solid black;"><span class="black--text font-weight-regular"></span></th>
                            </tr>
                        </thead>
                    </v-simple-table>
                </v-sheet>

                <v-sheet elevation="2" class="mt-3 mb-3">
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th class="black--text" style="background-color: #0892d0; text-align: left !important; border: 1px solid black;">
                                    <span class="black--text font-weight-medium body-2 h4-header">Commendation</span>
                                </th>
                                <th style="background-color: #0892d0; padding-right: 20.6rem; border: 1px solid black;"><span class="black--text font-weight-regular"></span></th>
                            </tr>
                        </thead>
                    </v-simple-table>
                </v-sheet>

                <v-row dense>
                    <v-col>
                        <h4 class="font-weight-regular h4-header" style="background-color: #87CEEB;">By submitting, I am providing PhilHealth my consent to use my responses and personal data for the purpose of Client 
                            Satisfaction Measurement. I understand that my information is confidential and protected under applicable laws.</h4>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            questions: [
                "SQ00. I am satisfied with the service that I availed.",
                "SQD1. I spent a reasonable amount of time for my transaction.",
                "SQD2. The office followed the transaction's requirements and steps based on the information provided.",
                "SQD3. The steps (including payment) I needed to do for my transaction were easy and simple.",
                "SQD4. I easily found information about my transaction from the office or its website.",
                "SQD5. I paid a reasonable amount of fees for my transaction.",
                "SQD6. I feel the office was fair to everyone, or 'walang palakasan,' during my transaction.",
                "SQD7. I was treated courteously by the staff, and (if asked for help) the staff was helpful.",
                "SQD8. I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me."
            ],
        };
    }
}
</script>

<style scoped>
    @media print{
    .csm{
        padding:0.25em 0 0!important
    }
    .h1-header{font-size:16pt;line-height:0.8 !important;}
    .h3-header,.font-header{font-size:10pt !important}
    .h4-header, .font-label, .font-data{font-size:7pt !important}
    .h5-reminder{font-size:7.2pt !important}
    .line-height-sub{line-height: 0.4;}
    .m-b-2, .m-b-3, .m-b-4{margin-bottom:0}
    .p-b-1, .p-b-2, .p-b-3, .p-b-4{padding-bottom:0}

    .sub-header, .box_no_top{font-size:6pt}
    .sub-header-subtitle,.sub-header-diagnosis{font-size:5pt}
    .dis_check_lbl{font-size:4pt}
    .wrap {
        flex-wrap: wrap !important;
    }
    }

    .wrap {
        display: flex;
        flex-wrap: wrap !important;
    }

    .border-bottom{ border-bottom:1px solid black}
    .border-top{border-top:1px solid black}
    .box{
        align-items: center;
        border:1px solid black;
        display: flex;
        font-size:8px;
        height:4em;
        justify-content: center;
        text-align:center;
        width:100%;
    }
    .box_no_top_pan{
        border-left:1px solid black;
        border-right:1px solid black;
        border-bottom:1px solid black;
        font-size:10px;
        text-align: center;
        width:2%;
    }
    .box_no_top{
        border-left:1px solid black;
        border-right:1px solid black;
        border-bottom:1px solid black;
        font-size:10px;
        text-align: center;
    }
    .csm{
        padding-top:3em ;
        padding-left:2.35em !important;
        padding-right:2.55em !important;
    }
    .dis_check_lbl, .font-label{font-size:10pt}
    .font-header{ font-size:13pt}
    .h1-header{ font-size:25pt;line-height:0.8;}
    .h3-header{font-size:14pt}
    .h4-header{font-size:14pt}
    .h5-reminder{font-size:7.3pt}
    .hide-content{display: none}
    .font-data{ font-size:9pt}
    .philhealth_logo{
        width:250px;
        height:100px;
    }

    .ph_logo{
        width:85px;
        height:80px;
    }
    .line-height-sub{line-height: 0.1;}
    .p-b-1{padding-bottom:0.25em}
    .p-b-2{padding-bottom:0.5em}
    .p-b-3{padding-bottom:0.7em}
    .p-b-4{padding-bottom:1em}
    .m-b-2{margin-bottom:0.5em}
    .m-b-3{margin-bottom:0.75em}
    .m-b-4{margin-bottom:1em}
    .roman{ font-family:'Times New Roman', Times, serif}
    .sub-header,.sub-header-diagnosis{font-size:8px}
    .sub-header-subtitle{font-size:7px}
    th,td {
        border: 1px solid black; 
        border-top: 1px solid black;
    }
</style>