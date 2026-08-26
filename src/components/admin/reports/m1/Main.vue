<template>
    <div>
        <h1 v-if="display === 0" class="font-weight-medium grey--text text--darken-3 mb-3">M1 Report</h1>
        
        <span v-else class="d-flex mb-2">
            <div @click="display = 0" class="align-center d-flex hover ml-n2">
                <v-icon size="27">mdi-chevron-left</v-icon>
                <span class="font-weight-medium body-1">Back to List</span>
            </div>
        </span>
        
        <v-window v-model="display">
            <v-window-item :value="0">
                <v-card class="mb-6 mx-1">
                    <div @click="display = 1" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Section A. Family Planning Services and Deworming for Women of Reproductive Age
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>
                
                <v-card class="mb-6 mx-1">
                    <div class="font-weight-medium white--text darken-3 blue body-1 d-flex pa-3 px-6">Section B. Maternal Care and Services</div>

                    <v-divider></v-divider>

                    <v-card @click="display = 2" class="hover body-1 d-flex py-3 px-6" tile flat>
                        <span>
                            <b class="pr-1">B1.</b> Prenatal Care
                        </span>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-card>

                    <v-divider></v-divider>

                    <v-card @click="display = 3" class="hover body-1 d-flex py-3 px-6" tile flat>
                        <span>
                            <b class="pr-1">B2.</b> Intrapartum Care and Delivery Outcome
                            <br>
                            <b class="pr-1">B3.</b> Postpartum and Newborn Care
                        </span>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-card>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div class="font-weight-medium white--text darken-3 blue body-1 d-flex pa-3 px-6">Section C. Child Care and Services</div>

                    <v-divider></v-divider>

                    <v-card @click="display = 4" class="hover body-1 d-flex py-3 px-6" tile flat>
                        <span>
                            <b class="pr-1">C1.</b> Immunization Services for Newborns, Infants and School-Aged Children/Adolescents
                            <br>
                            <b class="pr-1">C2.</b> Nutrition Services for Infants and Children
                        </span>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-card>

                    <v-divider></v-divider>

                    <v-card @click="display = 5" class="hover body-1 d-flex py-3 px-6" tile flat>
                        <span>
                            <b class="pr-1">C3.</b> Deworming Services for Infants, Children and Adolescents
                            <br>
                            <b class="pr-1">C4.</b> Management of Sick Infants and Children
                        </span>
                        <v-spacer></v-spacer>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-card>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div @click="display = 6" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Section D. Oral Care and Services
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div @click="display = 7" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        Section E. Infectious Disease Prevention and Control Services
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>

                <v-card class="mb-6 mx-1">
                    <div @click="display = 8" class="font-weight-medium white--text darken-3 blue body-1 d-flex hover pa-3 px-6">
                        <span>
                            Section F. Non-Communicable Disease Prevention and Control Services
                            <br>
                            Section G. Environmental Health and Sanitation Services
                            <br>
                            Section H. Mortality
                            <br>
                            Section I. Natality
                        </span>
                        <v-spacer></v-spacer>
                        <v-icon dark>mdi-chevron-right</v-icon>
                    </div>
                </v-card>
            </v-window-item>

            <v-window-item :value="1">
                <SectionA />
            </v-window-item>

            <v-window-item :value="2">
                <SectionB1 />
            </v-window-item>

            <v-window-item :value="3">
                <SectionB2andB3 />
            </v-window-item>

            <v-window-item :value="4">
                <SectionC1andC2 />
            </v-window-item>

            <v-window-item :value="5">
                <SectionC3andC4 />
            </v-window-item>
            
            <v-window-item :value="6">
                <SectionD />
            </v-window-item>

            <v-window-item :value="7">
                <SectionE />
            </v-window-item>

            <v-window-item :value="8">
                <SectionFGHI />
            </v-window-item>
        </v-window>
    </div>
</template>

<script>
import SectionA from '@/components/admin/reports/m1/SectionA'
import SectionB1 from '@/components/admin/reports/m1/SectionB1'
import SectionB2andB3 from '@/components/admin/reports/m1/SectionB2andB3'
import SectionC1andC2 from '@/components/admin/reports/m1/SectionC1andC2'
import SectionC3andC4 from '@/components/admin/reports/m1/SectionC3andC4'
import SectionD from '@/components/admin/reports/m1/SectionD'
import SectionE from '@/components/admin/reports/m1/SectionE'
import SectionFGHI from '@/components/admin/reports/m1/SectionFGHI'

export default {
    components: {
        SectionA,
        SectionB1,
        SectionB2andB3,
        SectionC1andC2,
        SectionC3andC4,
        SectionD,
        SectionE,
        SectionFGHI
    },
    
    data() {
        return {
            display: 0
        }
    }
}
</script>

<style scoped>
.hover:hover {
    cursor: pointer;
    font-size: 17px !important;
    transition: font-size 0.5s;
}
.opacity {
    opacity: 0.3 !important;
    user-select: none; /* Standard syntax */
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
}
</style>