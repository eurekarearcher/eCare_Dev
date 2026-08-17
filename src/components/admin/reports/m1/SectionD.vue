<template>
    <div id="content">
        <Header @loadSelectedDate="getSectionDData" />
    
        <table class="text-center body-2 mt-4" cellspacing="0">
            <tr>
                <td class="font-weight-medium body-1" colspan="25">Section D. Oral Care and Services</td>
            </tr>

            <tr class="white--text darken-3 blue">
                <td style="width: 21%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Male</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Female</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>
                <td style="width: 11%">
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 5)</h6>
                </td>
                <td style="width: 20%">
                    <h6 class="font-weight-medium body-2">Indicators</h6>
                    <h6 class="body-2">(Col. 1)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Male</h6>
                    <h6 class="body-2">(Col. 2)</h6>
                </td>
                <td style="width: 6%">
                    <h6 class="font-weight-medium body-2">Female</h6>
                    <h6 class="body-2">(Col. 3)</h6>
                </td>
                <td colspan="2">
                    <h6 class="font-weight-medium body-2">Total</h6>
                    <h6 class="body-2">(Col. 4)</h6>
                </td>
                <td>
                    <h6 class="font-weight-medium body-2">Remarks</h6>
                    <h6 class="body-2">(Col. 5)</h6>
                </td>
            </tr>
            
            <tr>
                <td class="font-weight-medium text-left">1. Orally fit children 12-59 months old upon oral exam plus orally fit after rehab</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
                <td class="font-weight-medium text-left">6a. Adolescents 10-14 years old who received BOHC</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>
        
            <tr>
                <td class="font-weight-medium text-left">2. Clients 5 years old and above with cases of DMFT</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
                <td class="font-weight-medium text-left">6b. Adolescents 15-19 years old who received BOHC</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">3. Infants 0-11 months old who received BOHC</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
                <td class="font-weight-medium text-left">7. Adults 20-59 years old who received BOHC</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">4. Children 1-4 years old who received BOHC</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
                <td class="font-weight-medium text-left">8. Senior citizens 60 years old and above who received BOHC</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
            </tr>

            <tr>
                <td class="font-weight-medium text-left">5. Children 5-9 years old who received BOHC</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium red--text" rowspan="3"></td>
                <td class="cell-background"> Indicators</td>
                <td class="cell-background"> 10-14 </td>
                <td class="cell-background"> 15-19</td>
                <td class="cell-background"> 20-49</td>
                <td class="cell-background"> Total</td>
                <td class="cell-background"> Remarks</td>
                
            </tr>

                <tr>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">9. Pregnant women who received BOHC - Total</td>
                <td></td>
                <td> </td>
                <td> </td>
                <td> </td>

            </tr>
            <tr>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">NHTS</td>
                <td></td>
                <td></td>
                <td> </td>
                <td> </td>
            </tr>
            <tr>
                <td class="font-weight-medium text-left"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="font-weight-medium text-left">Non-NHTS</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
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
    components:{
        Alert,
        Header
    },
    
    data() {
        return {
            loading_data: false,
            alert: {}
        }
    },

    methods: {
        getSectionDData(filter) {
            console.log(filter)
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