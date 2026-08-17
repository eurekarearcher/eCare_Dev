<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionAData" @exportExcel="exportExcel" @filters="setSelectedFilter" @filterTypeChanged="updateFilterType"/>

        <table class="text-center body-2 mt-4" cellspacing="0">
            <tr>
                <td class="font-weight-medium body-1" colspan="25">Section A. Family Planning Services and Deworming for Women of Reproductive Age</td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td colspan="5" rowspan="4">
                    <h6 class="font-weight-medium body-2 mb-3">A1. Modern FP Unmet Need</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td class="font-weight-medium body-2" colspan="8">Age</td>
                <td rowspan="2" colspan="4">
                    <h6 class="font-weight-medium body-2">Total for WRA</h6>
                    <h6 class="font-weight-medium body-2">10-49 y/o</h6>
                </td>
                <td class="font-weight-medium" rowspan="2" colspan="4">Section 3. Deworming Services</td>
                <td class="font-weight-medium" rowspan="2" colspan="4">Total</td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td colspan="8">(Col. 2)</td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td class="font-weight-medium" colspan="3">10-14 y/o</td>
                <td class="font-weight-medium" colspan="2">15-19 y/o</td>
                <td class="font-weight-medium" colspan="3">20-49 y/o</td>
                <td colspan="4">(Col. 3)</td>
                <td colspan="4">(Col. 1)</td>
                <td colspan="4">(Col. 4)</td>
            </tr>

            <tr>
                <td class="text-left" colspan="5">1. No. of WRA with unmet need for modern FP - Total</td>
                <td colspan="3">{{ a1_data['10 - 14 years'].Total  }}</td>
                <td colspan="2">{{ a1_data['15 - 19 years'].Total  }}</td>
                <td colspan="3">{{ a1_data['20 - 49 years'].Total  }}</td>
                <td colspan="4">{{ total_wra['total_wra'].Total }} </td>
                <td class="text-left" colspan="4">No. of Women 20-49 years old given 2 doses of deworming drugs</td>
                <td colspan="4">{{ section_3['section_3']['Total']}}</td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td rowspan="4" style="width: 12%">
                    <h6 class="font-weight-medium body-2 mb-3">A2. Use of FP Method</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
                
                <td rowspan="3" colspan="4" style="width: 15%">
                    <h6 class="font-weight-medium body-2 mb-3">Current Users</h6>
                    <h6 class="body-2">(Beginning of {{label}})</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td class="font-weight-medium" colspan="8" style="width: 28%">Acceptors</td>

                <td rowspan="2" colspan="4" style="width: 15%">
                    <h6 class="font-weight-medium body-2 mb-3">Drop-outs</h6>
                    <h6 class="body-2">(Present {{ label }})</h6>
                    <h6 class="body-2">(Col. 5)</h6>
                </td>

                <td rowspan="2" colspan="4" style="width: 15%">
                    <h6 class="font-weight-medium body-2 mb-3">Current Users</h6>
                    <h6 class="body-2">(End of  {{ label }})</h6>
                    <h6 class="body-2">(Col. 6)</h6>
                </td>

                <td rowspan="2" colspan="4" style="width: 15%">
                    <h6 class="font-weight-medium body-2 mb-3">New Acceptors</h6>
                    <h6 class="body-2">(Present {{ label }})</h6>
                    <h6 class="body-2">(Col. 7)</h6>
                </td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td colspan="4">
                    <h6 class="font-weight-medium body-2">New Acceptors</h6>
                    <h6 class="body-2">(Previous {{ label }})</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>

                <td colspan="4">
                    <h6 class="font-weight-medium body-2">Other Acceptors</h6>
                    <h6 class="body-2">(Present {{ label }})</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td> 
            </tr>

            <tr class="font-weight-medium text-no-wrap white--text darken-3 blue">
                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>

                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>

                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>

                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>

                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>

                <td>10-14</td>
                <td>15-19</td>
                <td>20-49</td>
                <td>Total</td>
            </tr>
            <template v-if="!loading_data">

                <tr class="font-weight-medium">
                    <td class="text-left"> a. BTL </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_a_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_a_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_a_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_a_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_a_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_a_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_a_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_a_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_a_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> b. NSV </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_b_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_b_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_b_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_b_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_b_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_b_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_b_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_b_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_b_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> c. Condom </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_c_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_c_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_c_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_c_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_c_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_c_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_c_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_c_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_c_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> d. Pills - Total </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_d_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_d_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_d_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_d_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_d_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_d_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left pl-6"> d.1 Pills-POP </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_d1_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_d1_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_d1_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_d1_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_d1_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_d1_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d1_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d1_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d1_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left pl-6"> d.2 Pills-COC </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_d2_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_d2_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_d2_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_d2_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_d2_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_d2_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_d2_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_d2_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_d2_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> e. Injectibles(DMPA/POI) </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_e_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_e_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_e_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_e_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_e_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_e_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_e_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_e_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_e_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> f. Implant </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_f_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_f_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_f_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_f_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_f_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_f_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_f_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_f_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_f_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> g. UID(UID-I and IUD-PP)-Total </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_g_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_g_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_g_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_g_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_g_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_g_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left pl-6"> g.1 IUD-I </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_g1_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_g1_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_g1_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_g1_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_g1_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_g1_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g1_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g1_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g1_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left pl-6"> g.2 IUD-PP </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_g2_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_g2_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_g2_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_g2_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_g2_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_g2_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_g2_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_g2_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_g2_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> h. NFP-LAM </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_h_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_h_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_h_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_h_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_h_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_h_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_h_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_h_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_h_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> i. NFP-BBT </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_i_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_i_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_i_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_i_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_i_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_i_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_i_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_i_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_i_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> j. NFP-CMM </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_j_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_j_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_j_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_j_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_j_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_j_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_j_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_j_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_j_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> k. NFP-STM </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_k_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_k_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_k_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_k_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_k_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_k_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_k_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_k_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_k_new_acceptors_present_month']['Total']}}</td>
                </tr>
                <tr class="font-weight-medium">
                    <td class="text-left"> l. NFP-SDM </td>
                    <!-- CURRENT USER -->
                    <td>{{ a2_data['a2_l_current_user_begin_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_current_user_begin_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_current_user_begin_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_current_user_begin_of_month']['Total']}}</td>

                    <!-- NEW ACCEPTORS PREVIOUS MONTH -->
                    <td>{{ a2_data['a2_l_new_acceptors_previous_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_new_acceptors_previous_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_new_acceptors_previous_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_new_acceptors_previous_month']['Total']}}</td>

                    <!-- OTHER ACCEPTORS PRESENT MONTH-->
                    <td>{{ a2_data['a2_l_other_accepter']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_other_accepter']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_other_accepter']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_other_accepter']['Total']}}</td>

                    <!-- DROP OUTS -->
                    <td>{{ a2_data['a2_l_dropouts']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_dropouts']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_dropouts']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_dropouts']['Total']}}</td>

                    <!-- CURRENT USERS END OF MONTH -->
                    <td>{{ a2_data['a2_l_current_user_end_of_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_current_user_end_of_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_current_user_end_of_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_current_user_end_of_month']['Total']}}</td>

                    <!-- NEW ACCPETORS PRESENT MONTH -->
                    <td>{{ a2_data['a2_l_new_acceptors_present_month']['10 - 14 years']}} </td>
                    <td>{{ a2_data['a2_l_new_acceptors_present_month']['15 - 19 years']}}</td>
                    <td>{{ a2_data['a2_l_new_acceptors_present_month']['20 - 49 years']}}</td>
                    <td>{{ a2_data['a2_l_new_acceptors_present_month']['Total']}}</td>
                </tr>
            </template>
        </table>

        <div v-show="loading_data" class="text-center" style="border: 1px solid lightgrey">
            <v-progress-linear color="primary" size="30" indeterminate></v-progress-linear>
            <h4 class="text--secondary body-2 my-5">Loading Data... Please wait...</h4>
        </div>

        <br>
        <Alert :alert="alert" />
    </div>
</template>

<script>
import Alert from '@/components/Alert'
import Header from '@/components/admin/reports/m1/Header'

export default {
    components: {
        Alert,
        Header
    },

    data() {
        return {
            export_to_excel_data: [],
            provider_name: '',
            selectedFilterType: null,
            selected_filter_type_label: '',
            month: null,
            year: null,
            selected_quarter: null,
            selected_quarter_year: null,

            loading_data: false,

            section_3: {
                'section_3': {}
            },

            total_wra: {
                'total_wra': {}
            },

            a1_data: {
                '10 - 14 years' : {},
                '15 - 19 years' : {},
                '20 - 49 years' : {}
            },

            a2_data: {
                'a2_a_current_user_begin_of_month': {},
                'a2_a_new_acceptors_previous_month': {},
                'a2_a_other_accepter': {},
                'a2_a_dropouts': {},
                'a2_a_current_user_end_of_month': {},
                'a2_a_new_acceptors_present_month': {},

                'a2_b_current_user_begin_of_month': {},
                'a2_b_new_acceptors_previous_month': {},
                'a2_b_other_accepter': {},
                'a2_b_dropouts': {},
                'a2_b_current_user_end_of_month': {},
                'a2_b_new_acceptors_present_month': {},

                'a2_c_current_user_begin_of_month': {},
                'a2_c_new_acceptors_previous_month': {},
                'a2_c_other_accepter': {},
                'a2_c_dropouts': {},
                'a2_c_current_user_end_of_month': {},
                'a2_c_new_acceptors_present_month': {},

                'a2_d_current_user_begin_of_month': {},
                'a2_d_new_acceptors_previous_month': {},
                'a2_d_other_accepter': {},
                'a2_d_dropouts': {},
                'a2_d_current_user_end_of_month': {},
                'a2_d_new_acceptors_present_month': {},

                'a2_d1_current_user_begin_of_month': {},
                'a2_d1_new_acceptors_previous_month': {},
                'a2_d1_other_accepter': {},
                'a2_d1_dropouts': {},
                'a2_d1_current_user_end_of_month': {},
                'a2_d1_new_acceptors_present_month': {},

                'a2_d2_current_user_begin_of_month': {},
                'a2_d2_new_acceptors_previous_month': {},
                'a2_d2_other_accepter': {},
                'a2_d2_dropouts': {},
                'a2_d2_current_user_end_of_month': {},
                'a2_d2_new_acceptors_present_month': {},

                'a2_e_current_user_begin_of_month': {},
                'a2_e_new_acceptors_previous_month': {},
                'a2_e_other_accepter': {},
                'a2_e_dropouts': {},
                'a2_e_current_user_end_of_month': {},
                'a2_e_new_acceptors_present_month': {},

                'a2_f_current_user_begin_of_month': {},
                'a2_f_new_acceptors_previous_month': {},
                'a2_f_other_accepter': {},
                'a2_f_dropouts': {},
                'a2_f_current_user_end_of_month': {},
                'a2_f_new_acceptors_present_month': {},

                'a2_g_current_user_begin_of_month': {},
                'a2_g_new_acceptors_previous_month': {},
                'a2_g_other_accepter': {},
                'a2_g_dropouts': {},
                'a2_g_current_user_end_of_month': {},
                'a2_g_new_acceptors_present_month': {},

                'a2_g1_current_user_begin_of_month': {},
                'a2_g1_new_acceptors_previous_month': {},
                'a2_g1_other_accepter': {},
                'a2_g1_dropouts': {},
                'a2_g1_current_user_end_of_month': {},
                'a2_g1_new_acceptors_present_month': {},

                'a2_g2_current_user_begin_of_month': {},
                'a2_g2_new_acceptors_previous_month': {},
                'a2_g2_other_accepter': {},
                'a2_g2_dropouts': {},
                'a2_g2_current_user_end_of_month': {},
                'a2_g2_new_acceptors_present_month': {},

                'a2_h_current_user_begin_of_month': {},
                'a2_h_new_acceptors_previous_month': {},
                'a2_h_other_accepter': {},
                'a2_h_dropouts': {},
                'a2_h_current_user_end_of_month': {},
                'a2_h_new_acceptors_present_month': {},

                'a2_i_current_user_begin_of_month': {},
                'a2_i_new_acceptors_previous_month': {},
                'a2_i_other_accepter': {},
                'a2_i_dropouts': {},
                'a2_i_current_user_end_of_month': {},
                'a2_i_new_acceptors_present_month': {},

                'a2_j_current_user_begin_of_month': {},
                'a2_j_new_acceptors_previous_month': {},
                'a2_j_other_accepter': {},
                'a2_j_dropouts': {},
                'a2_j_current_user_end_of_month': {},
                'a2_j_new_acceptors_present_month': {},

                'a2_k_current_user_begin_of_month': {},
                'a2_k_new_acceptors_previous_month': {},
                'a2_k_other_accepter': {},
                'a2_k_dropouts': {},
                'a2_k_current_user_end_of_month': {},
                'a2_k_new_acceptors_present_month': {},

                'a2_l_current_user_begin_of_month': {},
                'a2_l_new_acceptors_previous_month': {},
                'a2_l_other_accepter': {},
                'a2_l_dropouts': {},
                'a2_l_current_user_end_of_month': {},
                'a2_l_new_acceptors_present_month': {},
            },
            alert: {}
        }
    },

    computed: {
        label() {
            switch (this.selected_filter_type_label) {
                case 'monthly':
                    return 'Month';
                case 'quarterly':
                    return 'Quarter';
                case 'annually':
                    return 'Year'; 
                default:
                    return 'Month';
            }
        }
    },

    methods: {
        updateFilterType(filter) {
            this.selected_filter_type_label = filter;
        },

        async getSectionAData(filter) {
            this.loading_data = true

            let key = ''
            let provider_code = ''

            if (filter.provider.prv_name === 'ALL') {
                key = this.$store.state.usr_credentials.provider_reg_type
                provider_code = this.$store.state.prv_data.provider_code
            } else if (filter.provider.prv_name === this.$store.state.prv_data.provider_name)  {
                key = ''
                provider_code = this.$store.state.prv_data.provider_code
            } else {
                key = filter.provider.prv_type,
                provider_code = filter.provider.provider_code
            }

            this.provider_name = filter.provider.prv_name

            let payload = {
                key: key,  
                provider_code: provider_code, 
                lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
            };

            if (filter.request_key === 'monthly') {
                payload.request_key = filter.request_key
                payload.month = filter.month
                payload.year = filter.year
            } else if (filter.request_key === 'quarterly') {
                payload.request_key = filter.request_key
                payload.quarter = filter.quarter
                payload.year = filter.year
            } else if (filter.request_key === 'annually') {
                payload.request_key = filter.request_key
                payload.year = filter.year
            }

            let response = await this.$services.getM1M2Report('_get_m1_family_planning.php', payload)

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)
                const getSection3 = (key) => {
                    if (key in response.data) {
                        const result = response.data[key][0]

                        if(result) {
                            return {
                                'Total': parseInt(result['Total'])
                            }
                        } else {
                            return {
                                'Total': 0
                            }
                        }
                    } else {
                        return {
                            'Total': 0
                        }
                    }
                }

                this.section_3['section_3'] = getSection3('Section 3')

                const getA1Value = (key) => {
                    if (key in response.data.A1[1]) {
                        const result = response.data.A1[1][key][0]

                        return {
                            'Total': parseInt(result['Total'])
                        }
                    } else {
                        return {
                            'Total': 0
                        }
                    }
                }

                this.a1_data['10 - 14 years'] = getA1Value('10 - 14 years')
                this.a1_data['15 - 19 years'] = getA1Value('15 - 19 years')
                this.a1_data['20 - 49 years'] = getA1Value('20 - 49 years')

                //TOTAL FOR WRA 
                this.total_wra['total_wra'] = {
                    'Total': this.a1_data['10 - 14 years']['Total'] + this.a1_data['15 - 19 years']['Total'] + this.a1_data['20 - 49 years']['Total']
                }

                const getA2Value = (key, data) => {
                    if (key in response.data.A2) {
                        const result = response.data.A2[key][data]

                        if(result) {
                            return {
                                '10 - 14 years': parseInt(result['10 - 14 years']),
                                '15 - 19 years': parseInt(result['15 - 19 years']),
                                '20 - 49 years': parseInt(result['20 - 49 years']),
                                'Total': parseInt(result['Total'])
                            }
                        } else {
                            return {
                                '10 - 14 years': 0,
                                '15 - 19 years': 0,
                                '20 - 49 years': 0,
                                'Total': 0
                            }
                        }
                    } else {
                        return {
                            '10 - 14 years': 0,
                            '15 - 19 years': 0,
                            '20 - 49 years': 0,
                            'Total': 0
                        }
                    }
                }

                //BTL
                this.a2_data['a2_a_current_user_begin_of_month'] = getA2Value('BTL', 'Current User Beginning Month')
                this.a2_data['a2_a_new_acceptors_previous_month'] = getA2Value('BTL', 'New Accepter Previous Month')
                this.a2_data['a2_a_dropouts'] = getA2Value('BTL', 'Drop out')
                this.a2_data['a2_a_current_user_end_of_month'] = getA2Value('BTL', 'Current User End of Month')
                this.a2_data['a2_a_other_accepter'] = getA2Value('BTL', 'Other Accepter')
                this.a2_data['a2_a_new_acceptors_present_month'] = getA2Value('BTL', 'New Accepter Present Month')

                //NSV
                this.a2_data['a2_b_current_user_begin_of_month'] = getA2Value('NSV', 'Current User Beginning Month')
                this.a2_data['a2_b_new_acceptors_previous_month'] = getA2Value('NSV', 'New Accepter Previous Month')
                this.a2_data['a2_b_dropouts'] = getA2Value('NSV', 'Drop out')
                this.a2_data['a2_b_current_user_end_of_month'] = getA2Value('NSV', 'Current User End of Month')
                this.a2_data['a2_b_other_accepter'] = getA2Value('NSV', 'Other Accepter')
                this.a2_data['a2_b_new_acceptors_present_month'] = getA2Value('NSV', 'New Accepter Present Month')

                //CONDOM
                this.a2_data['a2_c_current_user_begin_of_month'] = getA2Value('Condom', 'Current User Beginning Month')
                this.a2_data['a2_c_new_acceptors_previous_month'] = getA2Value('Condom', 'New Accepter Previous Month')
                this.a2_data['a2_c_dropouts'] = getA2Value('Condom', 'Drop out')
                this.a2_data['a2_c_current_user_end_of_month'] = getA2Value('Condom', 'Current User End of Month')
                this.a2_data['a2_c_other_accepter'] = getA2Value('Condom', 'Other Accepter')
                this.a2_data['a2_c_new_acceptors_present_month'] = getA2Value('Condom', 'New Accepter Present Month')


                //PILLS - TOTAL D.1
                this.a2_data['a2_d1_current_user_begin_of_month'] = getA2Value('Pills-POP', 'Current User Beginning Month')
                this.a2_data['a2_d1_new_acceptors_previous_month'] = getA2Value('Pills-POP', 'New Accepter Previous Month')
                this.a2_data['a2_d1_dropouts'] = getA2Value('Pills-POP', 'Drop out')
                this.a2_data['a2_d1_current_user_end_of_month'] = getA2Value('Pills-POP', 'Current User End of Month')
                this.a2_data['a2_d1_other_accepter'] = getA2Value('Pills-POP', 'Other Accepter')
                this.a2_data['a2_d1_new_acceptors_present_month'] = getA2Value('Pills-POP', 'New Accepter Present Month')

                //PILLS - TOTAL D.2
                this.a2_data['a2_d2_current_user_begin_of_month'] = getA2Value('Pills-COC', 'Current User Beginning Month')
                this.a2_data['a2_d2_new_acceptors_previous_month'] = getA2Value('Pills-COC', 'New Accepter Previous Month')
                this.a2_data['a2_d2_dropouts'] = getA2Value('Pills-COC', 'Drop out')
                this.a2_data['a2_d2_current_user_end_of_month'] = getA2Value('Pills-COC', 'Current User End of Month')
                this.a2_data['a2_d2_other_accepter'] = getA2Value('Pills-COC', 'Other Accepter')
                this.a2_data['a2_d2_new_acceptors_present_month'] = getA2Value('Pills-COC', 'New Accepter Present Month')

                //PILLS - TOTAL
                this.a2_data['a2_d_current_user_begin_of_month'] = {
                    '10 - 14 years': this.a2_data['a2_d1_current_user_begin_of_month']['10 - 14 years'] + this.a2_data['a2_d2_current_user_begin_of_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_current_user_begin_of_month']['15 - 19 years'] + this.a2_data['a2_d2_current_user_begin_of_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_current_user_begin_of_month']['20 - 49 years'] + this.a2_data['a2_d2_current_user_begin_of_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_current_user_begin_of_month']['Total'] + this.a2_data['a2_d2_current_user_begin_of_month']['Total'] 
                }
                this.a2_data['a2_d_new_acceptors_previous_month'] = {
                    '10 - 14 years': this.a2_data['a2_d1_new_acceptors_previous_month']['10 - 14 years'] + this.a2_data['a2_d2_new_acceptors_previous_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_new_acceptors_previous_month']['15 - 19 years'] + this.a2_data['a2_d2_new_acceptors_previous_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_new_acceptors_previous_month']['20 - 49 years'] + this.a2_data['a2_d2_new_acceptors_previous_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_new_acceptors_previous_month']['Total'] + this.a2_data['a2_d2_new_acceptors_previous_month']['Total'] 
                }
                this.a2_data['a2_d_dropouts'] = {
                    '10 - 14 years': this.a2_data['a2_d1_dropouts']['10 - 14 years'] + this.a2_data['a2_d2_dropouts']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_dropouts']['15 - 19 years'] + this.a2_data['a2_d2_dropouts']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_dropouts']['20 - 49 years'] + this.a2_data['a2_d2_dropouts']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_dropouts']['Total'] + this.a2_data['a2_d2_dropouts']['Total'] 
                }
                this.a2_data['a2_d_current_user_end_of_month'] = {
                    '10 - 14 years': this.a2_data['a2_d1_current_user_end_of_month']['10 - 14 years'] + this.a2_data['a2_d2_current_user_end_of_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_current_user_end_of_month']['15 - 19 years'] + this.a2_data['a2_d2_current_user_end_of_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_current_user_end_of_month']['20 - 49 years'] + this.a2_data['a2_d2_current_user_end_of_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_current_user_end_of_month']['Total'] + this.a2_data['a2_d2_current_user_end_of_month']['Total'] 
                }
                this.a2_data['a2_d_other_accepter'] = {
                    '10 - 14 years': this.a2_data['a2_d1_other_accepter']['10 - 14 years'] + this.a2_data['a2_d2_other_accepter']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_other_accepter']['15 - 19 years'] + this.a2_data['a2_d2_other_accepter']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_other_accepter']['20 - 49 years'] + this.a2_data['a2_d2_other_accepter']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_other_accepter']['Total'] + this.a2_data['a2_d2_other_accepter']['Total'] 
                }
                this.a2_data['a2_d_new_acceptors_present_month'] = {
                    '10 - 14 years': this.a2_data['a2_d1_new_acceptors_present_month']['10 - 14 years'] + this.a2_data['a2_d2_new_acceptors_present_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_d1_new_acceptors_present_month']['15 - 19 years'] + this.a2_data['a2_d2_new_acceptors_present_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_d1_new_acceptors_present_month']['20 - 49 years'] + this.a2_data['a2_d2_new_acceptors_present_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_d1_new_acceptors_present_month']['Total'] + this.a2_data['a2_d2_new_acceptors_present_month']['Total'] 
                }

                //INJECTIBLES(DMPA/POI)
                this.a2_data['a2_e_current_user_begin_of_month'] = getA2Value('Injectibles (DMPA/POI)', 'Current User Beginning Month')
                this.a2_data['a2_e_new_acceptors_previous_month'] = getA2Value('Injectibles (DMPA/POI)', 'New Accepter Previous Month')
                this.a2_data['a2_e_dropouts'] = getA2Value('Injectibles (DMPA/POI)', 'Drop out')
                this.a2_data['a2_e_current_user_end_of_month'] = getA2Value('Injectibles (DMPA/POI)', 'Current User End of Month')
                this.a2_data['a2_e_other_accepter'] = getA2Value('Injectibles (DMPA/POI)', 'Other Accepter')
                this.a2_data['a2_e_new_acceptors_present_month'] = getA2Value('Injectibles (DMPA/POI)', 'New Accepter Present Month')

                //IMPLANT
                this.a2_data['a2_f_current_user_begin_of_month'] = getA2Value('Implant', 'Current User Beginning Month')
                this.a2_data['a2_f_new_acceptors_previous_month'] = getA2Value('Implant', 'New Accepter Previous Month')
                this.a2_data['a2_f_dropouts'] = getA2Value('Implant', 'Drop out')
                this.a2_data['a2_f_current_user_end_of_month'] = getA2Value('Implant', 'Current User End of Month')
                this.a2_data['a2_f_other_accepter'] = getA2Value('Implant', 'Other Accepter')
                this.a2_data['a2_f_new_acceptors_present_month'] = getA2Value('Implant', 'New Accepter Present Month')

                //IUD(UID-I and UID-PP) TOTAL G.1
                this.a2_data['a2_g1_current_user_begin_of_month'] = getA2Value('Implant', 'Current User Beginning Month')
                this.a2_data['a2_g1_new_acceptors_previous_month'] = getA2Value('Implant', 'New Accepter Previous Month')
                this.a2_data['a2_g1_dropouts'] = getA2Value('Implant', 'Drop out')
                this.a2_data['a2_g1_current_user_end_of_month'] = getA2Value('Implant', 'Current User End of Month')
                this.a2_data['a2_g1_other_accepter'] = getA2Value('Implant', 'Other Accepter')
                this.a2_data['a2_g1_new_acceptors_present_month'] = getA2Value('Implant', 'New Accepter Present Month')

                //IUD(UID-I and UID-PP) TOTAL G.2
                this.a2_data['a2_g2_current_user_begin_of_month'] = getA2Value('IUD-PP', 'Current User Beginning Month')
                this.a2_data['a2_g2_new_acceptors_previous_month'] = getA2Value('IUD-PP', 'New Accepter Previous Month')
                this.a2_data['a2_g2_dropouts'] = getA2Value('IUD-PP', 'Drop out')
                this.a2_data['a2_g2_current_user_end_of_month'] = getA2Value('IUD-PP', 'Current User End of Month')
                this.a2_data['a2_g2_other_accepter'] = getA2Value('IUD-PP', 'Other Accepter')
                this.a2_data['a2_g2_new_acceptors_present_month'] = getA2Value('IUD-PP', 'New Accepter Present Month')

                //IUD(UID-I and UID-PP) TOTAL
                this.a2_data['a2_g_current_user_begin_of_month'] = {
                    '10 - 14 years': this.a2_data['a2_g1_current_user_begin_of_month']['10 - 14 years'] + this.a2_data['a2_g2_current_user_begin_of_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_current_user_begin_of_month']['15 - 19 years'] + this.a2_data['a2_g2_current_user_begin_of_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_current_user_begin_of_month']['20 - 49 years'] + this.a2_data['a2_g2_current_user_begin_of_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_current_user_begin_of_month']['Total'] + this.a2_data['a2_g2_current_user_begin_of_month']['Total'] 
                }
                this.a2_data['a2_g_new_acceptors_previous_month'] = {
                    '10 - 14 years': this.a2_data['a2_g1_new_acceptors_previous_month']['10 - 14 years'] + this.a2_data['a2_g2_new_acceptors_previous_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_new_acceptors_previous_month']['15 - 19 years'] + this.a2_data['a2_g2_new_acceptors_previous_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_new_acceptors_previous_month']['20 - 49 years'] + this.a2_data['a2_g2_new_acceptors_previous_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_new_acceptors_previous_month']['Total'] + this.a2_data['a2_g2_new_acceptors_previous_month']['Total'] 
                }
                this.a2_data['a2_g_dropouts'] = {
                    '10 - 14 years': this.a2_data['a2_g1_dropouts']['10 - 14 years'] + this.a2_data['a2_g2_dropouts']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_dropouts']['15 - 19 years'] + this.a2_data['a2_g2_dropouts']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_dropouts']['20 - 49 years'] + this.a2_data['a2_g2_dropouts']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_dropouts']['Total'] + this.a2_data['a2_g2_dropouts']['Total'] 
                }
                this.a2_data['a2_g_current_user_end_of_month'] = {
                    '10 - 14 years': this.a2_data['a2_g1_current_user_end_of_month']['10 - 14 years'] + this.a2_data['a2_g2_current_user_end_of_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_current_user_end_of_month']['15 - 19 years'] + this.a2_data['a2_g2_current_user_end_of_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_current_user_end_of_month']['20 - 49 years'] + this.a2_data['a2_g2_current_user_end_of_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_current_user_end_of_month']['Total'] + this.a2_data['a2_g2_current_user_end_of_month']['Total'] 
                }
                this.a2_data['a2_g_other_accepter'] = {
                    '10 - 14 years': this.a2_data['a2_g1_other_accepter']['10 - 14 years'] + this.a2_data['a2_g2_other_accepter']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_other_accepter']['15 - 19 years'] + this.a2_data['a2_g2_other_accepter']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_other_accepter']['20 - 49 years'] + this.a2_data['a2_g2_other_accepter']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_other_accepter']['Total'] + this.a2_data['a2_g2_other_accepter']['Total'] 
                }
                this.a2_data['a2_g_new_acceptors_present_month'] = {
                    '10 - 14 years': this.a2_data['a2_g1_new_acceptors_present_month']['10 - 14 years'] + this.a2_data['a2_g2_new_acceptors_present_month']['10 - 14 years'],
                    '15 - 19 years': this.a2_data['a2_g1_new_acceptors_present_month']['15 - 19 years'] + this.a2_data['a2_g2_new_acceptors_present_month']['15 - 19 years'],
                    '20 - 49 years': this.a2_data['a2_g1_new_acceptors_present_month']['20 - 49 years'] + this.a2_data['a2_g2_new_acceptors_present_month']['20 - 49 years'],
                    'Total': this.a2_data['a2_g1_new_acceptors_present_month']['Total'] + this.a2_data['a2_g2_new_acceptors_present_month']['Total'] 
                }

                //NFP-LAM
                this.a2_data['a2_h_current_user_begin_of_month'] = getA2Value('NFP-LAM', 'Current User Beginning Month')
                this.a2_data['a2_h_new_acceptors_previous_month'] = getA2Value('NFP-LAM', 'New Accepter Previous Month')
                this.a2_data['a2_h_dropouts'] = getA2Value('NFP-LAM', 'Drop out')
                this.a2_data['a2_h_current_user_end_of_month'] = getA2Value('NFP-LAM', 'Current User End of Month')
                this.a2_data['a2_h_other_accepter'] = getA2Value('NFP-LAM', 'Other Accepter')
                this.a2_data['a2_h_new_acceptors_present_month'] = getA2Value('NFP-LAM', 'New Accepter Present Month')

                //NFP-BBT
                this.a2_data['a2_i_current_user_begin_of_month'] = getA2Value('NFP-BBT', 'Current User Beginning Month')
                this.a2_data['a2_i_new_acceptors_previous_month'] = getA2Value('NFP-BBT', 'New Accepter Previous Month')
                this.a2_data['a2_i_dropouts'] = getA2Value('NFP-BBT', 'Drop out')
                this.a2_data['a2_i_current_user_end_of_month'] = getA2Value('NFP-BBT', 'Current User End of Month')
                this.a2_data['a2_i_other_accepter'] = getA2Value('NFP-BBT', 'Other Accepter')
                this.a2_data['a2_i_new_acceptors_present_month'] = getA2Value('NFP-BBT', 'New Accepter Present Month')

                //NFP-CMM
                this.a2_data['a2_j_current_user_begin_of_month'] = getA2Value('NFP-CMM', 'Current User Beginning Month')
                this.a2_data['a2_j_new_acceptors_previous_month'] = getA2Value('NFP-CMM', 'New Accepter Previous Month')
                this.a2_data['a2_j_dropouts'] = getA2Value('NFP-CMM', 'Drop out')
                this.a2_data['a2_j_current_user_end_of_month'] = getA2Value('NFP-CMM', 'Current User End of Month')
                this.a2_data['a2_j_other_accepter'] = getA2Value('NFP-CMM', 'Other Accepter')
                this.a2_data['a2_j_new_acceptors_present_month'] = getA2Value('NFP-CMM', 'New Accepter Present Month')

                //NFP-STM
                this.a2_data['a2_k_current_user_begin_of_month'] = getA2Value('NFP-STM', 'Current User Beginning Month')
                this.a2_data['a2_k_new_acceptors_previous_month'] = getA2Value('NFP-STM', 'New Accepter Previous Month')
                this.a2_data['a2_k_dropouts'] = getA2Value('NFP-STM', 'Drop out')
                this.a2_data['a2_k_current_user_end_of_month'] = getA2Value('NFP-STM', 'Current User End of Month')
                this.a2_data['a2_k_other_accepter'] = getA2Value('NFP-STM', 'Other Accepter')
                this.a2_data['a2_k_new_acceptors_present_month'] = getA2Value('NFP-STM', 'New Accepter Present Month')

                //NFP-SDM
                this.a2_data['a2_l_current_user_begin_of_month'] = getA2Value('NFP-SDM', 'Current User Beginning Month')
                this.a2_data['a2_l_new_acceptors_previous_month'] = getA2Value('NFP-SDM', 'New Accepter Previous Month')
                this.a2_data['a2_l_dropouts'] = getA2Value('NFP-SDM', 'Drop out')
                this.a2_data['a2_l_current_user_end_of_month'] = getA2Value('NFP-SDM', 'Current User End of Month')
                this.a2_data['a2_l_other_accepter'] = getA2Value('NFP-SDM', 'Other Accepter')
                this.a2_data['a2_l_new_acceptors_present_month'] = getA2Value('NFP-SDM', 'New Accepter Present Month')

                this.loading_data = false
            } else {
                this.alert = response.error
            }
        },

        setSelectedFilter(data) {
            this.selected_filter_type = data.selected_filter_type
            this.month = data.month
            this.year = data.year
            this.selected_annual = data.annual
            this.selected_quarter = data.quarter
            this.selected_quarter_year = data.quarter_year
        },
        exportExcel() {
            let header_style = {
                    align: 'center',
                    alignVertical: 'center',
                    backgroundColor: '#1565c0', 
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    wrap: true
            }

            let column_style = {
                align: 'right',
                alignVertical: 'right',
                backgroundColor: '#ffffff', 
                borderColor: '#000000',
                color: '#000000',
                wrap: true
            }

            let result = [
                [
                    { ...header_style, span: 26, align: 'center', alignVertical: 'center', value: 'Section A. Family Planning Services and Deworming for Women of Reproductive Age', width: 500, backgroundColor: '#ffffff', color: '#000000', height: 50 },
                ]
            ]

            result.push(
                [
                    { ...header_style, span: 6, align: 'center', alignVertical: 'center', value: 'A1. Modern FP Unmet Need (Col. 1)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 8, align: 'center', alignVertical: 'center', value: 'Age', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Total for WRA 10-49 y/o', height: 40 },
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Section 3. Deworming Services	', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Total', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80}
                ],

                [
                    { ...header_style, span: 6, align: 'left', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 3, align: 'center', alignVertical: 'center', value: '10-14 y/o', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '15-19 y/o', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 3, align: 'center', alignVertical: 'center', value: '20-49 y/o', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: '(Col. 3)', height: 20 },
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: '(Col. 1)', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: '(Col. 4)', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20}
                ],

                [
                    { ...column_style, span: 6, align: 'left', alignVertical: 'center', value: '1. No. of WRA with unmet need for modern FP - Total', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...column_style, span: 3, align: 'center', alignVertical: 'center', value: this.a1_data['10 - 14 years'].Total, height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style, span: 2, align: 'center', alignVertical: 'center', value: this.a1_data['15 - 19 years'].Total, height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style, span: 3, align: 'center', alignVertical: 'center', value: this.a1_data['20 - 49 years'].Total, height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style, span: 4, align: 'center', alignVertical: 'center', value: this.total_wra['total_wra'].Total, height: 40 },
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style, span: 4, align: 'left', alignVertical: 'center', value: 'No. of Women 20-49 years old given 2 doses of deworming drugs', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style, span: 4, align: 'center', alignVertical: 'center', value: this.section_3['section_3']['Total'], height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 40}
                ],

                [
                    { ...header_style, span: 20, align: 'center', alignVertical: 'center', value: 'Acceptors', height: 20},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, align: 'center', alignVertical: 'center', value: '', height: 10},
                    { ...header_style, span: 6, align: 'center', alignVertical: 'center', value: '', height: 10}
                    
                ],

                [
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: 'A2. Use of FP Method (Col. 1)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Current Users\n(Beginning of Quarter)\n(Col. 2)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'New Acceptors\n(Previous Quarter)\n(Col. 3)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Other Acceptors\n(Present Quarter)\n(Col. 4)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Drop-outs\n(Present Quarter)\n(Col. 5)', height: 80 },
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'Current Users\n(End of Quarter)\n(Col. 6)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style, span: 4, align: 'center', alignVertical: 'center', value: 'New Acceptors\n(Present Quarter)\n(Col. 7)', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 80}
                ],

                [
                    { ...header_style, span: 2, align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '10-14	', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '15-19', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: '20-49', height: 20},
                    { ...header_style,  align: 'center', alignVertical: 'center', value: 'Total	', height: 20}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'a. BTL', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_a_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'b. NSV', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_b_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'c. Condom', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_c_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'd. Pills - Total', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: '  d.1 Pills-POP', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d1_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: '  d.2 Pills-COC', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_d2_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'e. Injectibles(DMPA/POI)', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_e_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'f. Implant', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_f_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'g. UID(UID-I and IUD-PP)-Total', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: '  g.1 IUD-I', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g1_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: '  g.2 IUD-PP', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_g2_new_acceptors_present_month']['Total'], height: 30}
                ],
                
                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'h. NFP-LAM', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_h_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'i. NFP-BBT', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_i_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'j. NFP-CMM', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_j_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'k. NFP-STM', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_k_new_acceptors_present_month']['Total'], height: 30}
                ],

                [
                    { ...column_style, span: 2, align: 'left', alignVertical: 'center', value: 'l. NFP-SDM', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: '', height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_begin_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_begin_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_begin_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_begin_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_previous_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_previous_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_previous_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_previous_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_other_accepter']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_other_accepter']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_other_accepter']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_other_accepter']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_dropouts']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_dropouts']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_dropouts']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_dropouts']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_end_of_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_end_of_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_end_of_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_current_user_end_of_month']['Total'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_present_month']['10 - 14 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_present_month']['15 - 19 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_present_month']['20 - 49 years'], height: 30},
                    { ...column_style,  align: 'center', alignVertical: 'center', value: this.a2_data['a2_l_new_acceptors_present_month']['Total'], height: 30}
                ],

            )

            this.export_to_excel_data = result

            setTimeout(() => {
                this.generate_excel_loader = false
                let report_period = '';

                switch (this.selected_filter_type) {
                    case 'monthly':
                        report_period = this.getMonthByNumber(this.month) + " - " + this.year; 
                        break;
                    
                    case 'quarterly':
                        report_period = "Quarter " + this.selected_quarter + " - " + this.selected_quarter_year;
                        break;

                    case 'annually':
                        report_period = this.selected_annual;
                        break;

                    default:
                        console.error("Unknown filter type");
                        return;
                }

                const file_name_date = this.$moment().format('MM-DD-YYYY');
                const file_name_facility = this.$store.state.prv_data.provider_name;

                this.$excel_file(this.export_to_excel_data, {

                    fileName: `${file_name_facility} - Section A. Family Planning Services and Deworming for Women of Reproductive Age ${report_period} - ${file_name_date}.xlsx`
                })
            }, 1000)
        }
    }
}
</script>

<style scoped>
table { width: 100%; }
table, th, td { 
    border-collapse: separate; 
    border: 1px solid lightgrey; 
}
td { padding: 5px; }
#content {
    overflow-x: auto; 
    overflow-y: hidden; 
}
#content table { min-width: 1400px; }
.cell-background {
    background: #1565C0;
    color: white
}
</style>