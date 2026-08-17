<template>
    <v-card class="pa-7" outlined>
        <v-layout v-show="loading_ncdqans" class="my-14" justify-center align-center>
            <v-progress-circular color="primary" size="30" indeterminate></v-progress-circular>
            <h5 class="font-weight-medium light-blue--text text--darken-4 body-2 pl-5">Loading Data... Please wait...</h5>
        </v-layout>

        <div v-if="!loading_ncdqans" class="pl-sm-4 pl-0">
            <v-row class="mt-n8">
                <v-col class="d-flex align-self-center" cols="12" md="8" lg="8">
                    <h3>Dietary Information <span v-if="($store.state.usr_credentials.user_settings.display_filipino_word === '1' ? 1 : 0)" class="font-italic grey--text text--darken-1">(Impormasyon sa pandiyeta)</span></h3>
                </v-col>

                <v-col class="d-flex align-self-center ma-0 pa-0" cols="12" md="4" lg="4" dense>
                    <v-checkbox
                    v-model="check_all_no"
                    :disabled="from_migration"
                    label="All the NCD Questionnaire will set to 'No'"
                    @change="setAllToNo(); emitData();"
                    ></v-checkbox>
                </v-col>
            </v-row>

            <v-expansion-panels v-model="panel" multiple>
                <v-expansion-panel >
                    <v-expansion-panel-header>
                        <v-col cols="12" md="8" lg="8">
                            <span class="font-weight-medium d-block body-2 mb-2">High Fat / High Salt Food Intake, Dietary Fiber Intake, Physical Activity</span>
                        </v-col>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row class="mt-n7" align="end" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2 mb-2">Eat processed food/fast food(e.g. Instant noodles, hamburgers, fries, fried chicken skin, etc.) ihaw-ihaw (e.g. isaw, adidas, etc.) weekly</span>
                            </v-col>
                            <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                                <v-radio-group v-model="dietary_information.high_fat_salt_intake" :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="1"></v-radio>
                                    <v-radio label="No" value="0"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && dietary_information.high_fat_salt_intake" :disabled="from_migration" @click="dietary_information.high_fat_salt_intake = '', emitData()" class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-row align="end" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2 mb-2">2-3 serving of fruits daily</span>
                            </v-col>
                            <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                                <v-radio-group v-model="dietary_information.fiber_intake_fruit"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="1"></v-radio>
                                    <v-radio label="No" value="0"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && dietary_information.fiber_intake_fruit" :disabled="from_migration" @click="dietary_information.fiber_intake_fruit = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2 mb-2">3 serving of vegetables daily</span>
                            </v-col>
                            <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                                <v-radio-group v-model="dietary_information.fiber_intake_vegetable"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="1"></v-radio>
                                    <v-radio label="No" value="0"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && dietary_information.fiber_intake_vegetable" :disabled="from_migration" @click="dietary_information.fiber_intake_vegetable = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <v-row align="end" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does at least 2 1/2 hours a week of moderate intensity physical activity</span>
                            </v-col>
                            <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                                <v-radio-group v-model="dietary_information.physical_activity"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="1"></v-radio>
                                    <v-radio label="No" value="0"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && dietary_information.physical_activity" :disabled="from_migration" @click="dietary_information.physical_activity = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
    
            
                <v-divider class="my-4"></v-divider>


                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <v-col cols="12" md="8" lg="8">
                                <span class="font-weight-medium d-block body-2 mb-2">Presence or Absence of Diabetes</span>
                            </v-col>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row align="end" class="mt-n7" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Was patient diagnosed as having diabetes?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                
                                <v-radio-group  v-model="ncdqans.Qid5_Ynx" :disabled="from_migration"  @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid5_Ynx" :disabled="from_migration" @click="ncdqans.Qid5_Ynx = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Presence of Diabetes</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid18_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid18_Yn" :disabled="from_migration" @click="ncdqans.Qid18_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col class="d-flex align-self-end" cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does patient have symptoms of Polyphagia?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end"  cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid6_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid6_Yn" :disabled="from_migration" @click="ncdqans.Qid6_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col  cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does patient have symptoms of Polydipsia?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end"  cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid7_Yn" :disabled="from_migration"  @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid7_Yn" :disabled="from_migration" @click="ncdqans.Qid7_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does patient have symptoms of Polyuria?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid8_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid8_Yn" :disabled="from_migration" @click="ncdqans.Qid8_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Elevated Blood Glucose</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group v-model="ncdqans.Qid19_Yn" :disabled="from_migration"  @change="emitData"  class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid19_Yn" :disabled="from_migration"  @click="ncdqans.Qid19_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-show="ncdqans.Qid19_Yn === 'Y'" justify="end" align="end" dense>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                    <v-text-field v-show="ncdqans.Qid19_Yn === 'Y'" v-model="ncdqans.Qid19_Fbsmg" :disabled="from_migration" label="FBS mg"  @change="emitData" class="mx-2" maxlength="3" hide-details dense> </v-text-field>
                                    <v-text-field v-show="ncdqans.Qid19_Yn === 'Y'" v-model="ncdqans.Qid19_Fbsmmol" :disabled="from_migration" label="FBS mmol"  @change="emitData" maxlength="3"  class="mx-2" hide-details dense> </v-text-field>
                                    <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" class="mx-2" absolute left offset-y top>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-show="ncdqans.Qid19_Yn === 'Y'"  v-on="on" v-model="ncdqans.Qid19_Fbsdate" :disabled="from_migration" placeholder="YYYY-MM-DD" dense></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ncdqans.Qid19_Fbsdate" no-title></v-date-picker>
                                    </v-menu>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Elevated Blood Lipids</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid20_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid20_Yn" :disabled="from_migration" @click="ncdqans.Qid20_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-show="ncdqans.Qid20_Yn === 'Y'" justify="end" align="end" dense>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-text-field v-show="ncdqans.Qid20_Yn === 'Y'" v-model="ncdqans.Qid20_Choleval" :disabled="from_migration" label="Total Cholesterol value in mg/dL" class="mx-2"  @change="emitData" maxlength="3"  hide-details dense> </v-text-field>
                                <v-menu  :close-on-content-click="false" transition="scale-transition" min-width="auto" class="mx-2" absolute left offset-y top>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-show="ncdqans.Qid20_Yn === 'Y'" v-on="on" v-model="ncdqans.Qid20_Choledate" :disabled="from_migration" placeholder="YYYY-MM-DD" dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="ncdqans.Qid20_Choledate" no-title></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Presence of Urine Ketones</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group v-model="ncdqans.Qid21_Yn"  :disabled="from_migration" @change="emitData"  class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid21_Yn" :disabled="from_migration"  @click="ncdqans.Qid21_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-show="ncdqans.Qid21_Yn === 'Y'" justify="end" align="end" class="mb-2" dense>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-text-field v-show="ncdqans.Qid21_Yn === 'Y'" v-model="ncdqans.Qid21_Ketonval" :disabled="from_migration" label="Urine Ketones value" class="mx-2" maxlength="3"   @change="emitData" hide-details dense> </v-text-field>
                                <v-menu  :close-on-content-click="false" transition="scale-transition" min-width="auto" class="mx-2" absolute left offset-y top>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-show="ncdqans.Qid21_Yn === 'Y'" v-on="on" v-model="ncdqans.Qid21_Ketondate" :disabled="from_migration"  placeholder="YYYY-MM-DD" dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="ncdqans.Qid21_Ketondate" no-title></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Presence of Urine Protein</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid22_Yn"  @change="emitData" :disabled="from_migration" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid22_Yn" @click="ncdqans.Qid22_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-show="ncdqans.Qid22_Yn === 'Y'" justify="end" align="end" class="mb-2" dense>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-text-field v-show="ncdqans.Qid22_Yn === 'Y'" v-model="ncdqans.Qid22_Proteinval" :disabled="from_migration" label="Urine Protein value in mg/dL" class="mx-2" maxlength="3" @change="emitData" hide-details dense> </v-text-field>
                                <v-menu  :close-on-content-click="false" transition="scale-transition" min-width="auto" class="mx-2" absolute left offset-y top>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-show="ncdqans.Qid22_Yn === 'Y'" v-on="on" v-model="ncdqans.Qid22_Proteindate" :disabled="from_migration"  placeholder="YYYY-MM-DD" dense></v-text-field>
                                    </template>
                                    <v-date-picker v-model="ncdqans.Qid22_Proteindate" no-title></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-row align="center" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Risk Level Percentage</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                    <v-radio-group v-model="ncdqans.Qid17_Abcde" :disabled="from_migration" class="ma-0" readonly hide-details row>
                                        <v-radio label="<10%" value="A"></v-radio>
                                        <v-radio label="10% to <20%" value="B"></v-radio>
                                        <v-radio label="20% to <30%" value="C"></v-radio>
                                        <v-radio label="30% to <40%" value="D"></v-radio>
                                        <v-radio label="=>40%" value="E"></v-radio>
                                    </v-radio-group>
                                <!-- <v-btn v-if="editable && ncdqans.Qid17_Abcde" @click="ncdqans.Qid17_Abcde = '', emitData()"  :disabled="from_migration" class="align-self-center" x-small>Clear</v-btn> -->
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>


                <v-divider class="my-4"></v-divider>
    
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        <v-col cols="12" md="8" lg="8">
                            <span class="font-weight-medium d-block body-2">Questionnaire to Determine Probable Angina, Heart...</span>
                        </v-col>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row align="end" class="mt-n5" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Have you had any pain or discomfort or any pressure or heaviness in your chest?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group v-model="ncdqans.Qid9_Yn"  @change="emitData" :disabled="from_migration"  class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid9_Yn" @click="ncdqans.Qid9_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Do you get the pain in the center of the chest or left arm?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid10_Yn"  @change="emitData" :disabled="from_migration" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid10_Yn" @click="ncdqans.Qid10_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Do you get it when you walk uphill or hurry?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid11_Yn"  @change="emitData" :disabled="from_migration"  class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid11_Yn" @click="ncdqans.Qid11_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Do you slowdown if you get the pain while walking?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group v-model="ncdqans.Qid12_Yn"  @change="emitData" :disabled="from_migration"  class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid12_Yn" @click="ncdqans.Qid12_Yn = '', emitData()" :disabled="from_migration"   class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does the pain go away if you stand still or if you take a tablet under the tongue?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid13_Yn"  @change="emitData" :disabled="from_migration" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid13_Yn" @click="ncdqans.Qid13_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Does the pain go away in less than 10 minutes?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid14_Yn"  @change="emitData" :disabled="from_migration" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid14_Yn" @click="ncdqans.Qid14_Yn = '', emitData()" :disabled="from_migration"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Have you ever had a severe chest pain across the front of your chest lasting for half an hour or more?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid15_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>
                                
                                <v-btn v-if="editable && ncdqans.Qid15_Yn" :disabled="from_migration" @click="ncdqans.Qid15_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>    

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Have you ever had any of the following: difficulty in talking, weakness of arm and/or leg on one side of the body or numbness on one side of the body?</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid16_Yn" :disabled="from_migration"  @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid16_Yn" :disabled="from_migration" @click="ncdqans.Qid16_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Angina or Heart Attack</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid23_Yn"  :disabled="from_migration" @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid23_Yn" :disabled="from_migration" @click="ncdqans.Qid23_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>   

                        <v-row align="end" class="mt-1" dense>
                            <v-col cols="12" md="8" lg="8">
                                <span class="body-2 pl-2">Stroke and TIA</span>
                            </v-col>
                            <v-col class="d-flex align-self-end" cols="12" md="4" lg="4">
                                <v-radio-group  v-model="ncdqans.Qid24_Yn" :disabled="from_migration"  @change="emitData" class="ma-0" hide-details row>
                                    <v-radio label="Yes" value="Y"></v-radio>
                                    <v-radio label="No" value="N"></v-radio>
                                </v-radio-group>

                                <v-btn v-if="editable && ncdqans.Qid24_Yn" :disabled="from_migration" @click="ncdqans.Qid24_Yn = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>            
    </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: ['editable', 'ncdqans', 'dietary_information', 'loading_ncdqans', "patient_name", 'family_medical_history', 'patient_social_history', "pex_data", "patient_info","from_migration"],

    data: () => ({
        panel: [0],
        readonly: false,
        check_all_no: false
    }),

    computed: {
        ...mapState(['usr_credentials']),

        // qid17() {
        //     // Return the mapped_risk from riskAssessment and set ncdqans.Qid17_Abcde
        //     return this.riskAssessment(this.patient_info, this.pex_data, this.patient_social_history).risk.mapped_risk;
        // }
    },

    watch: {
        patient_info: {
            deep: true,
            immediate: true,
            handler() {
                this.syncQid17();
            }
        },
        pex_data: {
            deep: true,
            immediate: true,
            handler() {
                this.syncQid17();
            }
        },
        patient_social_history: {
            deep: true,
            immediate: true,
            handler() {
                this.syncQid17();
            }
        }
    },

    methods: {
        // handleRadioChange(value) {
        //     this.ncdqans.Qid17_Abcde = value;
        //     this.emitData();
        // },
        syncQid17() {
            const risk = this.riskAssessment(this.patient_info, this.pex_data, this.patient_social_history)?.risk?.mapped_risk;

            if (!this.ncdqans.Qid17_Abcde) {
                this.ncdqans.Qid17_Abcde = risk;
                this.emitData();
            }
        },

        setAllToNo() {
            if (this.check_all_no) {
                this.panel = [0, 1, 2]

                Object.keys(this.dietary_information).forEach(prop => {
                    this.$set(this.dietary_information, prop, '0')
                });

                Object.keys(this.ncdqans).forEach(prop => {
                    if (prop.includes('Yn')) {
                        this.$set(this.ncdqans, prop, 'N')
                    }
                });
                this.checkForYesOrCleared()
            }
        },

        checkForYesOrCleared() {
            let is_yes_checked = Object.keys(this.dietary_information).some(prop => this.dietary_information[prop] === '1') ||
            Object.keys(this.ncdqans).some(prop => this.ncdqans[prop] === 'Y')

            let is_cleared = Object.keys(this.dietary_information).some(prop => this.dietary_information[prop] === '') ||
            Object.keys(this.ncdqans).some(prop => this.ncdqans[prop] === '');

            if (is_yes_checked || is_cleared) {
                this.check_all_no = false;
            }
        },

        emitData() {
            this.$emit('mutationStatus', 'diet');
            this.$emit('mutationStatus', 'ncdq');
            this.checkForYesOrCleared();
        }
    }
}
</script>