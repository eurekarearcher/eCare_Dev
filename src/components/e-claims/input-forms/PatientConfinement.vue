<template>
  <div>
    <v-form :readonly="!trans_detail.editable">
      <!-- CHIEF COMPLAINT -->
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">CHIEF COMPLAINT</h1>
        </v-col> 
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part2_number5" @click="displayCommentData('complaint')" readonly color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
          
          <!--REMOVE COMMENT AFTER DEPLOYMENT 12/13/2024-->
          <v-btn class="primary ml-2" @click="showCaseRateDialog = true" tile depressed small>SEARCH CASE RATE <v-icon class="pl-1" small>mdi-table-search</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-textarea v-model="pci_data.section1" @change="checkDataStatus('admission')" :error="required && !pci_data.section1" class="mt-3" placeholder="Chief Complaint" rows="4" maxlength="300" hide-details outlined></v-textarea>

      <!-- CONFINEMENT PERIOD -->
      <v-row class="mt-6" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">CONFINEMENT PERIOD</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number3" @click="displayCommentData('confinement')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row align="baseline" class=" mt-2 mt-sm-0" wrap>
        <v-col cols="12" sm="2" md="2" lg="2">
          <label class="body-2">DATE ADMITTED</label>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" class="px-2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" allow-overflow offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="date_admitted" v-on="on" @click="previous_admitted_value = confinement_date.date_admitted" class="body-2 ma-0 pa-0"></v-text-field>
            </template>
            <v-date-picker v-model="date_admitted_date" @input="confinement_date.date_admitted = date_admitted_date" @change="changeDateAdmitted(date_admitted_date)" no-title></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="2" md="2" lg="2" class="text-sm-right">
          <label class="body-2">TIME ADMITTED</label>
        </v-col>
        <v-col cols="6" sm="4" md="4" lg="4" class="px-2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" max-height="400" allow-overflow offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field :value="convertTime(pci_data.section2.time_admitted) ? convertTime(pci_data.section2.time_admitted).split(' ')[0] : ''" v-mask="mask" v-on="on" @change="checkDataStatus('others')" class="body-2" readonly>
              <template v-slot:append-outer>
                <span class="body-2">
                  {{ convertTime(pci_data.section2.time_admitted) ? convertTime(pci_data.section2.time_admitted).split(' ')[1] : '' }}
                </span>
              </template>

              <template v-if="required && !pci_data.section2.time_admitted" v-slot:append>
                <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
              </template>
            </v-text-field>
          </template>

            <!-- <v-row wrap text-center>
              <v-col class="white" lg4>
                <h6 class="body-2 grey white--text py-1">Hour</h6>
                <v-list>
                  <v-list-item v-for="hour in 12" :key="hour" :class="{'grey' : hour === parseInt(pci_data.section2.time_admitted.substring(0, 2))}" @click="selectHourMin('admitted', 'hour', hour)">
                    <v-list-item-title>
                      <span v-if="hour < 10">0</span>{{ hour }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col lg4>
                <h6 class="body-2 grey white--text py-1">Min</h6>
                <v-list>
                  <v-list-item v-for="(min, index) in 60" :key="min" :class="{'grey' : index === parseInt(pci_data.section2.time_admitted.substring(3, 5))}" @click="selectHourMin('admitted', 'min', index)">
                    <v-list-item-title>
                      <span v-if="min < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col lg4>
                <h6 class="body-2 grey white--text py-1">Seconds</h6>
                <v-list>
                  <v-list-item v-for="(sec, index) in 60" :key="sec" :class="{'grey' : index === parseInt(pci_data.section2.time_admitted.substring(6))}" @click="selectHourMin('admitted', 'sec', index)">
                    <v-list-item-title>
                      <span v-if="sec < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row> -->
          </v-menu>
        </v-col>
        <!-- <v-col cols="6" sm="2" md="2" lg="2">
          <v-radio-group v-model="pci_data.section2.period_admitted" :error="time_period" @change="checkDataStatus('others')" hide-details row>
            <v-radio value="AM" label="AM">AM</v-radio>
            <v-radio value="PM" label="PM">PM</v-radio>
          </v-radio-group>
          <v-text-field v-model="pci_data.section2.period_admitted" @change="checkDataStatus('others')" class="body-2" maxlength="100" readonly></v-text-field>
        </v-col> -->
      </v-row>

      <v-row align="baseline" class="mt-0 mt-sm-n4" wrap>
        <v-col cols="12" sm="2" md="2" lg="2">
          <label class="body-2">DATE DISCHARGED</label>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" class="px-2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" allow-overflow offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="date_discharged" v-on="on" @click="previous_discharged_value = confinement_date.date_discharged" class="body-2 ma-0 pa-0"></v-text-field>
            </template>
            <v-date-picker v-model="date_discharged_date" @input="confinement_date.date_discharged = date_discharged_date" @change="changeDateDischarged(date_discharged_date)" no-title></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="2" md="2" lg="2" class="text-sm-right">
          <label class="body-2">TIME DISCHARGED</label>
        </v-col>
        <v-col cols="6" sm="4" md="4" lg="4" class="px-2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" max-height="400" allow-overflow offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field :value="convertTime(pci_data.section2.time_discharged) ? convertTime(pci_data.section2.time_discharged).split(' ')[0] : ''" v-mask="mask" v-on="on" @change="checkDataStatus('others')" class="body-2" readonly>
                <template v-slot:append-outer>
                  <span class="body-2">
                    {{ convertTime(pci_data.section2.time_discharged) ? convertTime(pci_data.section2.time_discharged).split(' ')[1] : '' }}
                  </span>
                </template>

                <template v-if="required && !pci_data.section2.time_discharged" v-slot:append>
                  <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                </template>
              </v-text-field>
            </template>
            <!-- <v-row wrap text-center>
              <v-col class="white" lg4>
                <h6 class="body-2 grey white--text py-1">Hour</h6>
                <v-list>
                  <v-list-item v-for="hour in 12" :key="hour" :class="{'grey' : hour === parseInt(pci_data.section2.time_discharged.substring(0, 2))}" @click="selectHourMin('discharged', 'hour', hour)">
                    <v-list-item-title>
                      <span v-if="hour < 10">0</span>{{ hour }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col lg4>
                <h6 class="body-2 grey white--text py-1">Min</h6>
                <v-list>
                  <v-list-item v-for="(min, index) in 60" :key="min" :class="{'grey' : index === parseInt(pci_data.section2.time_discharged.substring(3, 5))}" @click="selectHourMin('discharged', 'min', index)">
                    <v-list-item-title>
                      <span v-if="min < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col lg4>
                <h6 class="body-2 grey white--text py-1">Seconds</h6>
                <v-list>
                  <v-list-item v-for="(sec, index) in 60" :key="sec" :class="{'grey' : index === parseInt(pci_data.section2.time_discharged.substring(6))}" @click="selectHourMin('discharged', 'sec', index)">
                    <v-list-item-title>
                      <span v-if="sec < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row> -->
          </v-menu>
        </v-col>
        <!-- <v-col cols="6" sm="2" md="2" lg="2">
          <v-radio-group v-model="pci_data.section2.period_discharged" @change="checkDataStatus('others')" hide-details row>
            <v-radio value="AM" label="AM">AM</v-radio>
            <v-radio value="PM" label="PM">PM</v-radio>
          </v-radio-group>
          <v-text-field v-model="pci_data.section2.period_discharged" @change="checkDataStatus('others')" class="body-2" maxlength="100" readonly></v-text-field>
        </v-col> -->
      </v-row>

      <!-- REASON FOR ADMISSION / HISTORY OF ILLNESS -->
      <v-row class="mt-4" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">REASON FOR ADMISSION / HISTORY OF ILLNESS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part3" @click="displayCommentData('reason')" color="primary" tile depressed small>CHECK COMMENTS
            <v-badge content="!" color="red"> 
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row align="baseline" wrap>
        <v-col cols="12" sm="4" md="3" lg="2" class="mt-5">
          <label class="body-2">HISTORY OF ILLNESS</label>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="10">
          <v-text-field v-model="pci_data.section3.illness_history" :error="required && !pci_data.section3.illness_history" @change="checkDataStatus('others')" class="body-2" maxlength="100" hide-details dense></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="3" lg="2" class="mt-5 my-2">
          <label class="body-2">PERTINENT PAST MEDICAL HISTORY</label>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="10" class="my-2">
          <v-col cols="12" sm="12" md="12" lg="12" class="pr-0 pl-0">
              <v-combobox v-model="selected_past_history" :error="required && (!selected_past_history || selected_past_history.length === 0)" :items="past_history_items" @blur="checkDataStatus('others')" @change="addPastHistory" class="body-2 pl-sm-0" item-text="description" label="Pls. specify if there's any." deletable-chips hide-no-data hide-selected return-object hide-details multiple filled chips></v-combobox>
          </v-col>
        </v-col>
      </v-row>

      <v-row align="baseline" class="text-center mt-5 mt-sm-0" wrap>
        <v-col cols="12" sm="2" md="2" lg="2" class="text-left">
          <label class="body-2">OBSTETRIC HISTORY</label>
        </v-col>

        <v-col cols="12" sm="1" md="1" lg="1">
          <v-row wrap align="baseline">
            <v-col cols="1" sm="2" md="2" lg="2">
              <label class="body-2">G</label>
            </v-col>
            <v-col cols="11" sm="10" md="10" lg="10">
              <v-text-field v-model="pci_data.section3.gravidity" @change="checkDataStatus('others')" class="body-2" maxlength="100" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        
        <v-col cols="12" sm="1" md="1" lg="1">
          <v-row wrap align="baseline">
            <v-col cols="1" sm="2" md="2" lg="2">
              <label class="body-2">P</label>
            </v-col>
            <v-col cols="11" sm="10" md="10" lg="10">
              <v-text-field v-model="pci_data.section3.parity" @change="checkDataStatus('others')" class="body-2" maxlength="100" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="4" md="4" lg="4">
          <v-row align="baseline" wrap>
            <v-col cols="6" sm="2" md="2" lg="2">
              <v-text-field v-model="pci_data.section3.term" @change="checkDataStatus('others')" class="body-2" label="T" maxlength="100" readonly hide-details>
                <template v-slot:prepend>
                  <span class="body-1">(</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1" lg="1">-</v-col>
            <v-col cols="5" sm="2" md="2" lg="2">
              <v-text-field v-model="pci_data.section3.preterm" @change="checkDataStatus('others')" class="body-2" label="P" maxlength="5" readonly hide-details></v-text-field>
            </v-col>

            <v-col cols="1" sm="1" md="1" lg="1">-</v-col>
            <v-col cols="5" sm="2" md="2" lg="2">
              <v-text-field v-model="pci_data.section3.abortions" @change="checkDataStatus('others')" class="body-2" label="A" maxlength="5" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1" lg="1">-</v-col>
            <v-col cols="4" sm="2" md="2" lg="2">
              <v-text-field v-model="pci_data.section3.living" @change="checkDataStatus('others')" class="body-2" label="L" maxlength="5" readonly hide-details></v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1" lg="1">)</v-col>
          </v-row>
        </v-col>

        <v-col cols="9" sm="3" md="2" lg="2">
          <v-row align="baseline" wrap>
            <v-col cols="3" sm="3" md="3" lg="3">
              <label class="body-2">LMP</label>
            </v-col>
            <v-col cols="9" sm="9" md="9" lg="9">
            <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="pci_data.section3.lmp_date" v-on="on" @click:clear="pci_data.section3.lmp_date_date = null" @change="checkDataStatus('others')" class="body-2 ma-0 pa-0" :clearable="trans_detail.editable" readonly></v-text-field>
              </template>
              <v-date-picker v-model="pci_data.section3.lmp_date_date" :max="max_admitted_date" @input="pci_data.section3.lmp_date = formatDate(pci_data.section3.lmp_date_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
            </v-menu>
            </v-col>
          </v-row>
        </v-col>
        
        <v-col cols="3" sm="1" md="2" lg="2">
          <v-row align="end" wrap>
            <v-col cols="10" sm="10" md="3" lg="3">
              <label class="body-2">N/A</label>
            </v-col>
            <v-col cols="2" sm="2" md="9" lg="9">
              <v-checkbox hide-details></v-checkbox>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- REFERRED FROM ANOTHER HEALTHCARE -->
      <v-row class="mt-4" wrap>
        <v-col cols="7" sm="4" md="3" lg="2">
          <h1 class="section-title">IS PATIENT REFERRED?</h1>
        </v-col>
        <v-col cols="5" sm="4" md="4" lg="4">
          <v-radio-group v-model="pci_data.section4.is_referred" @change="checkDataStatus('others')" :error="required && !pci_data.section4.is_referred" class="ma-0 pa-0" hide-details dense row>
            <v-radio value="YES" label="YES">YES</v-radio>
            <v-radio @change="pci_data.section4.hci_reason = null, pci_data.section4.hci_name = null, pci_data.section4.hci_address = null" value="NO" label="NO">NO</v-radio>
            <v-btn v-if="trans_detail.editable && !!pci_data.section4.is_referred" @click="pci_data.section4.is_referred = null, pci_data.section4.hci_reason = null, pci_data.section4.hci_name = null, pci_data.section4.hci_address = null, checkDataStatus('others')" width="60" height="25" small>Clear</v-btn>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="4" md="5" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number2" @click="displayCommentData('referred')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row :class="{'opacity' : pci_data.section4.is_referred !== 'YES'}" align="baseline" wrap class="mt-3">
        <v-col cols="12" sm="4" md="3" lg="2">
          <h6 class="body-2">SPECIFY REASON</h6>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="10" class="pl-2">
          <v-text-field v-model="pci_data.section4.hci_reason" :readonly="pci_data.section4.is_referred !== 'YES'" @change="checkDataStatus('others')" class="body-2" maxlength="100" hide-details dense></v-text-field>
        </v-col>
      </v-row>

      <v-row :class="{'opacity' : pci_data.section4.is_referred !== 'YES'}" align="baseline" wrap class="mt-3">
        <v-col cols="12" sm="4" md="3" lg="2">
          <h6 class="body-2">NAME OF ORIGINATING HCI</h6>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="10" class="pl-2">
          <v-text-field v-model="pci_data.section4.hci_name" :readonly="pci_data.section4.is_referred !== 'YES'" @change="checkDataStatus('others')" class="body-2" maxlength="100" hide-details dense></v-text-field>
        </v-col>
      </v-row>

      <v-row :class="{'opacity' : pci_data.section4.is_referred !== 'YES'}" align="baseline" wrap class="mt-3">
        <v-col cols="12" sm="4" md="3" lg="2">
          <h6 class="body-2">COMPLETE ADDRESS</h6>
        </v-col>
        <v-col cols="12" sm="8" md="9" lg="10" class="pl-2">
          <v-text-field v-model="pci_data.section4.hci_address" :readonly="pci_data.section4.is_referred !== 'YES'" @change="checkDataStatus('others')" class="body-2" maxlength="100" dense></v-text-field>
        </v-col>
      </v-row>

      <!-- PATIENT DISPOSITION -->
      <v-row class="mt-4" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">PATIENT DISPOSITION</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number4" @click="displayCommentData('disposition')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="mt-2" wrap>
        <v-col cols="12" sm="5" md="5" lg="5" class="pl-0 pl-sm-5">
          <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="pa-0 my-5 mt-2" value="I" label="a. Improved" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
          <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="pa-0 my-5" value="R" label="b. Recovered" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
          <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="pa-0 my-5" value="H" label="c. Home/Discharged Against Medical Advise" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
          <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="pa-0 my-5" value="A" label="d. Absconded" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
        </v-col>
        <v-col cols="12" sm="7" md="7" lg="7">
          <v-row wrap>
            <v-col cols="12" sm="12" md="3" lg="3">
              <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="pa-0 my-2" value="E" label="e. Expired" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="12" md="9" lg="9" class="pl-2">
              <v-row :class="{'opacity' : pci_data.section5.status !== 'E'}" wrap>
                <v-col cols="4" sm="4" md="4" lg="4" class="pr-2">
                  <v-menu :disabled="!trans_detail.editable || pci_data.section5.status !== 'E'" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="pci_data.section5.expired.date_date" v-on="on" @change="checkDataStatus('others')" class="body-2" hint="MM-DD-YYYY" persistent-hint dense>
                        <template v-if="required && !pci_data.section5.expired.date && pci_data.section5.status === 'E'" v-slot:append>
                          <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="pci_data.section5.expired.date_date" :max="confinement_date.date_discharged" :min="confinement_date.date_admitted" @input="pci_data.section5.expired.date = formatDate(pci_data.section5.expired.date_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="4" class="pr-2">
                  <!--<v-text-field v-model="pci_data.section5.expired.time" v-mask="mask" v-on="on" :rules="[rules.time_format]" class="body-2" hint="hh:mm:ss" persistent-hint dense></v-text-field>-->
                  <v-menu :disabled="!trans_detail.editable || pci_data.section5.status !== 'E'" :close-on-content-click="false" max-height="400" offset-y>
                    <template v-slot:activator="{ on }">
                      <v-text-field v-model="pci_data.section5.expired.time" v-mask="mask" v-on="on" :rules="[rules.time_format]" @change="checkDataStatus('others')" class="body-2" hint="hh:mm:ss" persistent-hint dense>
                        <template v-if="required && !pci_data.section5.expired.time && pci_data.section5.status === 'E'" v-slot:append>
                          <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-row class="text-center" wrap>
                      <v-col cols="4" sm="4" md="4" lg="4" class="white">
                        <h6 class="body-2 grey white--text py-1">Hour</h6>
                        <v-list>
                          <v-list-item v-for="hour in 12" :key="hour" :class="{'grey' : hour === parseInt(pci_data.section5.expired.time ? pci_data.section5.expired.time.substring(0, 2) : null)}" @click="selectHourMin('expired', 'hour', hour)">
                            <v-list-item-title>
                              <span v-if="hour < 10">0</span>{{ hour }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col cols="4" sm="4" md="4" lg="4">
                        <h6 class="body-2 grey white--text py-1">Min</h6>
                        <v-list>
                          <v-list-item v-for="(min, index) in 60" :key="min" :class="{'grey' : index === parseInt(pci_data.section5.expired.time ? pci_data.section5.expired.time.substring(3, 5) : null)}" @click="selectHourMin('expired', 'min', index)">
                            <v-list-item-title>
                              <span v-if="min < 11">0</span>{{ index }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-col>
                      <v-col cols="4" sm="4" md="4" lg="4">
                        <h6 class="body-2 grey white--text py-1">Seconds</h6>
                        <v-list>
                          <v-list-item v-for="(sec, index) in 60" :key="sec" :class="{'grey' : index === parseInt(pci_data.section5.expired.time ? pci_data.section5.expired.time.substring(6) : null)}" @click="selectHourMin('expired', 'sec', index)">
                            <v-list-item-title>
                              <span v-if="sec < 11">0</span>{{ index }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-menu> 
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="4">
                  <v-radio-group v-model="pci_data.section5.expired.period" :readonly="pci_data.section5.status !== 'E'" :error="required  && !pci_data.section5.expired.period && pci_data.section5.status === 'E'" @change="checkDataStatus('others')" class="ma-0 pa-0" hide-details dense row>
                    <v-radio value="AM" label="AM">AM</v-radio>
                    <v-radio value="PM" label="PM">PM</v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row align="baseline" class="text-center mt-5 mt-md-0" wrap>
            <v-col cols="12" sm="12" md="6" lg="4">
              <v-checkbox v-model="pci_data.section5.status" @change="checkDataStatus('others')" class="ma-0 pa-0" value="T" label="f. Transferred/Referred" :error="required && !pci_data.section5.status" hide-details></v-checkbox>
            </v-col>
            <v-col :class="{'opacity' : pci_data.section5.status !== 'T'}" cols="12" sm="12" md="6" lg="8" class="pl-2">
              <v-autocomplete v-model="pci_data.section5.transfer.hci_name" :items="provider_list_items.length === 0 ? [pci_data.section5.transfer.hci_name ? pci_data.section5.transfer.hci_name : ''] : provider_list_items" :loading="loading_provider_list" :readonly="pci_data.section5.status !== 'T'" @change="selectedProvider(pci_data.section5.transfer.hci_name)" item-text="name" class="body-2" hint="Name of Referral Health Care Institution" maxlength="100" return-object dense persistent-hint>
                <template v-if="required && !pci_data.section5.transfer.hci_name && pci_data.section5.status === 'T'" v-slot:append>
                  <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                </template>
              </v-autocomplete>
              <v-text-field v-model="pci_data.section5.transfer.hci_address" :readonly="pci_data.section5.status !== 'T'" @change="checkDataStatus('others')" class="body-2" hint="Complete Address" maxlength="100" dense persistent-hint>
                <template v-if="required && !pci_data.section5.transfer.hci_address && pci_data.section5.status === 'T'" v-slot:append>
                  <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                </template>
              </v-text-field>
              <v-text-field v-model="pci_data.section5.transfer.hci_reason" :readonly="pci_data.section5.status !== 'T'" @change="checkDataStatus('others')" class="body-2" hint="Reason/s for referral/transfer" maxlength="100" dense persistent-hint>
                <template v-if="required && !pci_data.section5.transfer.hci_reason && pci_data.section5.status === 'T'" v-slot:append>
                  <v-icon color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      
      <!-- TYPE OF ACCOMODATION -->
      <v-row class="mt-6" wrap>
        <v-col cols="12" sm="4" md="3" lg="2">
          <h1 class="section-title">TYPE OF ACCOMODATION:</h1>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-radio-group v-model="pci_data.section6" @change="checkDataStatus('others')" class="ma-0 pa-0" :error="required && !pci_data.section6"  hide-details dense row>
            <v-radio value="P" label="Private">Private</v-radio>
            <v-radio value="N" label="Non-Private (Charity/Service)">Non-Private (Charity/Service)</v-radio>
            <v-btn v-if="trans_detail.editable && !!pci_data.section6" @click="pci_data.section6 = '', checkDataStatus('others')" width="60" height="25" small>Clear</v-btn>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="12" md="3" lg="5" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number5" @click="displayCommentData('accomodation')" class="ml-2 mt-2 mt-md-0" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- ADMISSION DIAGNOSIS -->
      <!-- <v-row class="mt-6" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">ADMISSION DIAGNOSIS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number6" @click="displayCommentData('admission')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="d-none d-sm-flex text-center mt-3" wrap>
        <v-col cols="4" sm="4" md="2" lg="2" class="pr-2">
          <label class="body-2 font-weight-bold grey--text text--darken-2">ICD Code</label>
        </v-col>
        <v-col cols="8" sm="8" md="10" lg="10">
          <label class="body-2 font-weight-bold grey--text text--darken-2">ICD Description</label>
        </v-col>
      </v-row>

      <v-row v-for="(admission, i) in pci_data.section7" :key="i+'admission'" class="text-center mt-1" dense>
        <v-col cols="12" sm="4" md="2" lg="2">
          <v-text-field :value="admission.icd_code ? admission.icd_code : 'N/A'" class="body-2 pa-0 ma-0" readonly dense hide-details>
            <template v-slot:prepend>
              <label class="body-2 black--text">{{ i+1 }})</label>
            </template>
          </v-text-field>
        </v-col>
        <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="10" lg="10">
          <v-text-field v-model="admission.icd_description" class="body-2 pa-0 ma-0" readonly dense hide-details></v-text-field>
        </v-col>
      </v-row> -->

      <!-- ADMISSION DIAGNOSIS -->
      <v-row class="mt-6" wrap>
        <v-col cols="6" sm="6" md="6" lg="6"><h1 class="section-title">ADMISSION DIAGNOSIS</h1></v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number6" @click="displayCommentData('admission')" color="primary" tile depressed small>
            CHECK COMMENTS
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-row class="d-none d-sm-flex text-center mt-3" wrap>
        <v-col cols="4" sm="4" md="2" lg="2" class="pr-2">
          <label class="body-2 font-weight-bold grey--text text--darken-2">ICD Code</label>
        </v-col>
        <v-col cols="8" sm="8" md="10" lg="10">
          <label class="body-2 font-weight-bold grey--text text--darken-2">ICD Description</label>
        </v-col>
      </v-row>

      <template v-if="trans_detail.editable && trans_detail.transaction_type === 'INPATIENT'">
        <v-row v-for="(admission, i) in pci_data.section7" :key="i + 'admission'" class="text-center mt-1" dense>
          <v-col cols="12" sm="4" md="2" lg="2">
            <v-text-field :value="admission.icd_code" class="body-2 pa-0 ma-0" readonly dense hide-details>
              <template v-slot:prepend>
                <label class="body-2 black--text">{{ i + 1 }})</label>
              </template>
            </v-text-field>
          </v-col>

          <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="10" lg="10">

            <v-text-field v-if="admission.icd_code" :value="admission.icd_description" class="body-2 pa-0 ma-0" readonly dense hide-details>
              <template v-slot:append-outer>
                <v-icon v-if="pci_data.section7.length > 1" class="mt-1" @click="confirmRemoveAdmissionDiagnosis(i)">mdi-delete</v-icon>
              </template>
            </v-text-field>

            <v-autocomplete v-else @change="onAdmissionICDChange($event, i)" @update:search-input="searchItems($event, 'icd')" @blur="searchItems($event, 'icd')" v-model="selected_admission_icd[i]" :items="icd_list" item-text="icd_code_description" class="body-2 pa-0 ma-0" return-object hide-details dense>
              <template v-slot:item="{ attrs, on, item }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.icd_description_long }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-slot:append-item>
                <v-sheet v-if="search_icd_items" class="d-flex justify-center my-4">
                  <v-btn @click="loadMore('icd')" :loading="$store.state.loading_icd" small outlined>
                    Load More
                  </v-btn>
                </v-sheet>
              </template>

              <template v-slot:append-outer>
                <v-icon v-if="pci_data.section7.length > 1" @click="confirmRemoveAdmissionDiagnosis(i)" class="mt-1">mdi-delete</v-icon>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row v-for="(admission, i) in pci_data.section7.filter(item => item.icd_code)" :key="i+'admission'" class="text-center mt-1" dense>
          <v-col cols="12" sm="4" md="2" lg="2">
            <v-text-field :value="admission.icd_code ? admission.icd_code : 'N/A'" class="body-2 pa-0 ma-0" readonly dense hide-details>
              <template v-slot:prepend>
                <label class="body-2 black--text">{{ i+1 }})</label>
              </template>
            </v-text-field>
          </v-col>
          <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="10" lg="10">
            <v-text-field v-model="admission.icd_description" class="body-2 pa-0 ma-0" readonly dense hide-details></v-text-field>
          </v-col>
        </v-row>
      </template>
      
      <!-- DISCHARGED DIAGNOSIS -->
      <v-row class="mt-7" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">DISCHARGED DIAGNOSIS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.editable && trans_detail.transaction_type === 'INPATIENT'" @click="addDischargedDiagnosis" color="primary" tile small><v-icon class="pr-1" small>mdi-plus</v-icon>ADD DISCHARGED DIAGNOSIS</v-btn>
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number7" @click="displayCommentData('discharged')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <div v-for="(icds, diagnosis_type) in pci_diagnosis" :key="diagnosis_type">
        <div v-for="(icd, i) in icds" :key="i">
        <h1 class="subtitle-2 grey--text text--darken-3 font-weight-medium mt-2">{{ diagnosis_type }} DIAGNOSIS</h1>
          <v-card class="px-4 py-3" outlined>
            <v-row dense>
              <v-col cols="12" sm="4" md="2" lg="2">
                <v-text-field v-model="icd.icd_code" class="body-2 ma-0 pa-0" readonly hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="8" md="10" lg="10">
                <template v-if="!trans_detail.editable">
                  <v-autocomplete v-model="selected_icd[diagnosis_type + '_' + i]" :items="icd_list" item-text="icd_code_description" @change="onICDChange($event, diagnosis_type, i)" @blur="searchItems($event, 'icd')" @update:search-input="searchItems($event, 'icd')" class="body-2 ma-0 pa-0" hide-details >
                    <template v-slot:item="{attrs, on, item }">
                      <v-list-item v-bind="attrs" v-on="on"  class="d-flex justify-space-between">
                          <v-list-item-content>
                              <v-list-item-title>{{ item.icd_description_long }}</v-list-item-title>
                              <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                          </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:append-item>
                      <v-sheet v-if="search_icd_items" class="d-flex justify-center my-4">
                        <v-btn @click="loadMore('icd')" :loading="$store.state.loading_icd" small outlined>
                          Load More
                        </v-btn>
                      </v-sheet>
                    </template>
                    <template v-slot:append-outer>
                      <v-icon class="float-right mt-1" @click="confirmRemoveDiagnosis(diagnosis_type, i)">mdi-delete</v-icon>
                    </template>
                  </v-autocomplete>
                </template>

                <template v-else>
                  <v-combobox v-model="icd.icd_description" :items="icd_list" item-text="icd_code_description" @change="onICDChange($event, diagnosis_type, i)" @blur="searchItems($event, 'icd')" @update:search-input="searchItems($event, 'icd')" class="body-2 ma-0 pa-0" hide-no-data hide-details return-object clearable>
                    <template v-slot:item="{attrs, on, item }">
                      <v-list-item v-bind="attrs" v-on="on"  class="d-flex justify-space-between">
                          <v-list-item-content>
                              <v-list-item-title>{{ item.icd_description_long }}</v-list-item-title>
                              <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                          </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template v-slot:append-item>
                      <v-sheet v-if="!search_icd_items" class="d-flex justify-center my-4">
                        <v-btn @click="loadMore('icd')" :loading="$store.state.loading_icd" small outlined>
                          Load More
                        </v-btn>
                      </v-sheet>
                    </template>
                    <template v-slot:append-outer>
                      <v-icon class="float-right mt-1" @click="confirmRemoveDiagnosis(diagnosis_type, i)">mdi-delete</v-icon>
                    </template>
                  </v-combobox>
                </template>
              </v-col>
            </v-row>

            <v-row class="d-none d-sm-flex text-center mt-2 mb-n1" wrap v-if="$store.state.usr_credentials.department === 'Nurse Station' || $store.state.usr_credentials.department === 'Credit and Collection'">
              <v-col cols="1">
                <label class="body-2 font-weight-bold grey--text text--darken-2">CPT Code</label>
              </v-col>
              <v-col cols="4">
                <label class="body-2 font-weight-bold grey--text text--darken-2">CPT Description</label>
              </v-col>
              <v-col cols="2">
                <label class="body-2 font-weight-bold grey--text text--darken-2">Type</label>
              </v-col>
              <v-col cols="1">
                <label class="body-2 font-weight-bold grey--text text--darken-2">Date</label>
              </v-col>
              <v-col cols="2">
                <label class="body-2 font-weight-bold grey--text text--darken-2">Laterality</label>
              </v-col>
              <v-col cols="2">
                <label class="body-2 font-weight-bold grey--text text--darken-2">Extension</label>
              </v-col>
            </v-row>

            <v-row v-for="(procedure, x) in icd.procedure" :key="x" class="mt-2 mt-sm-0" dense>
              <v-col cols="12" sm="1">
                <v-text-field v-model="procedure.cpt_code" class="body-2 ma-0 pa-0" hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="procedure.cpt_description" class="body-2 ma-0 pa-0" hide-details readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <v-autocomplete v-model="procedure.eclaims_code" :items="procedure.eclaim_item_code" :readonly="!trans_detail.editable" :error="required && !procedure.laterality && !!procedure.rvs_code" item-text="item_desc" item-value="item_code" class="body-2 ma-0 pa-0" hide-details return-object>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="1">
                <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="procedure.procedure_date" v-on="on" @change="checkDataStatus('procedure')" class="pa-0 ma-0 body-2" hide-details readonly></v-text-field>
                  </template>
                  <v-date-picker v-model="procedure.date_date" :max="max_admitted_date" @change="checkDataStatus('procedure')" @input="selectProcedureDate(diagnosis_type, i, x)" no-title></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="2">
                <v-autocomplete v-model="procedure.laterality" @change="addLaterality(procedure.cpt_code, $event, procedure.procedure_date)" :items="laterality_items" :readonly="!trans_detail.editable" :error="required && !procedure.laterality && !!procedure.rvs_code" item-text="text" item-value="value" class="body-2 ma-0 pa-0" hide-details>
                  <!-- <template v-slot:append-outer v-if="trans_detail.editable">
                    <v-icon :disabled="$store.state.loading_icd" @click="confirmRemoveProcedure(diagnosis_type, i, x, procedure.rvs_hci_fee)">mdi-delete</v-icon>
                  </template> -->
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="2">
                <div class="d-flex justify-space-between">
                  <v-select v-model="procedure.ext1" :items="['1', '2', '3', '4', '5', '6', '7', '8', '9']" :readonly="!trans_detail.editable" class="body-2 ma-0 pa-0" hide-details>
                  </v-select> 
                  <v-select v-model="procedure.ext2" :items="['1', '2', '3', '4', '5', '6', '7', '8', '9']" :readonly="!trans_detail.editable" class="body-2 ma-0 pa-0" hide-details>
                    <template v-slot:append-outer v-if="trans_detail.editable">
                      <v-icon :disabled="$store.state.loading_icd" @click="confirmRemoveProcedure(diagnosis_type, i, x, procedure.rvs_hci_fee)">mdi-delete</v-icon>
                    </template>
                  </v-select> 
                </div>

                <!-- <v-autocomplete v-model="procedure.laterality" @change="addLaterality(procedure.cpt_code, $event, procedure.procedure_date)" :items="laterality_items" :readonly="!trans_detail.editable" :error="required && !procedure.laterality && !!procedure.rvs_code" item-text="text" item-value="value" class="body-2 ma-0 pa-0" hide-details>
                  <template v-slot:append-outer v-if="trans_detail.editable">
                    <v-icon :disabled="$store.state.loading_icd" @click="confirmRemoveProcedure(diagnosis_type, i, x, procedure.rvs_hci_fee)">mdi-delete</v-icon>
                  </template>
                </v-autocomplete> -->
              </v-col>
            </v-row>
              
            <v-row dense>
              <v-col cols="12">
                <v-autocomplete v-model="selected_procedure[diagnosis_type + '_' + i]" @change="addProcedure($event, diagnosis_type, i)" @blur="searchItems($event, 'cpt')" @update:search-input="searchItems($event, 'cpt')" :items="procedure_list" :loading="procedure_loading" :disabled="!trans_detail.editable" item-text="cpt_code_desc" placeholder="Select Procedure" return-object dense hide-details clearable>
                  <template v-slot:item="{attrs, on, item }">
                    <v-list-item v-bind="attrs" v-on="on"  class="d-flex justify-space-between">
                        <v-list-item-content>
                            <v-list-item-title>{{ item.cpt_description }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.cpt_code }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-slot:append-item>
                    <v-sheet v-if="!search_cpt_items" class="d-flex justify-center my-4">
                        <v-btn @click="loadMore('cpt')" :loading="$store.state.loading_cpt" small outlined>
                        Load More
                        </v-btn>
                    </v-sheet>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
      
      <!-- <template v-if="$store.state.usr_credentials.department === 'Credit and Collection'">
        PHILHEALTH BENEFITS 
        <v-row class="mt-7" wrap>
          <v-col cols="6" sm="6" md="6" lg="6">
            <h1 class="section-title">PHILHEALTH BENEFITS</h1>
          </v-col>
          <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
            <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number9" @click="displayCommentData('benefits')" color="primary" tile depressed small>CHECK COMMENTS 
              <v-badge content="!" color="red">
                <v-icon class="pl-1" small>mdi-comment</v-icon>
              </v-badge>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row v-if="$vuetify.breakpoint.smAndUp" justify="end" align="baseline" class="text-center mb-n5 mt-3" wrap>
          <template v-if="trans_detail.transaction_type === 'INPATIENT'">
            <v-col cols="2" sm="2" md="2" lg="2">
              <label class="body-2 font-weight-bold grey--text text--darken-2">CODE</label>
            </v-col>
            <v-col cols="6" sm="6" md="6" lg="6">
              <label class="body-2 font-weight-bold grey--text text--darken-2">DESCRIPTION</label>
            </v-col>
            <v-col cols="2" sm="2" md="2" lg="3">
              <label class="body-2 font-weight-bold grey--text text--darken-2">RATE</label>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="2" sm="2" md="2" lg="3">
              <label class="body-2 font-weight-bold grey--text text--darken-2">CODE</label>
            </v-col>
            <v-col cols="8" sm="8" md="8" lg="8">
              <label class="body-2 font-weight-bold grey--text text--darken-2">DESCRIPTION</label>
            </v-col>
          </template>
        </v-row>
        
        <v-row align="end" class="mt-2" wrap>
          <v-col cols="12" sm="2" md="2" lg="1" class="text-sm-right">
            <label class="body-2 d-block mb-1">1ST CASE</label>
          </v-col>
          <v-col :class="trans_detail.transaction_type === 'INPATIENT' ? 'xs12 sm2 md2 lg2' : 'xs12 sm2 md2 lg3'" class="pl-2">
            <v-text-field :value="pci_data.section9.first_case_rate_tag === 'NEW' ? pci_data.section9.first_case_code : null" :class="{'opacity' : first_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Code'" class="body-2" hide-details readonly></v-text-field>
          </v-col>
          <v-col :class="trans_detail.transaction_type === 'INPATIENT' ? 'xs12 sm6 md6 lg6' : 'xs12 sm8 md8 lg8'" class="pl-2">
            <v-text-field v-if="!trans_detail.editable || first_case_style.disabled" :value="pci_data.section9.first_case_rate_tag === 'NEW' ? pci_data.section9.first_case_desc : null" :class="{'opacity' : first_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" class="body-2" hide-details readonly></v-text-field>

            <v-combobox v-else v-model="pci_data.section9.first_case_desc" :items="first_case_items" :loading="loading_case_rate1" :readonly="loading_case_rate1" @focus="confirmChangeCaseRate('change', 'first')" @blur="pci_data.section9.first_case_desc = current_first_case_rate" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" :return-object="false" item-text="description" item-value="description" class="body-2" hide-no-data hide-details single-line>
              <template v-slot:selection>
                <span class="grey--text text--darken-3">{{ pci_data.section9.first_case_rate_tag === 'NEW' ? pci_data.section9.first_case_desc : '.' }}</span>
              </template>
              <template v-slot:item="{ attrs, on, item }">
                <v-list-item v-bind="attrs" v-on="on" v-on:click="current_first_case_rate = item.description" @click="caseRateAutoFill('first', item)">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.icd_code }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>

          <v-col v-if="trans_detail.transaction_type === 'INPATIENT'" cols="12" sm="2" md="2" lg="3" class="pl-2">
            <v-text-field :value="pci_data.section9.first_case_rate_tag === 'NEW' ? (pci_data.section9.first_case_rate === '0.00' ? null : pci_data.section9.first_case_rate) : null" :class="{'opacity' : first_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Rate'" class="body-2" hide-details readonly>
              <template v-if="trans_detail.editable" v-slot:append-outer>
                <v-icon :disabled="loading_case_rate1 || !pci_data.section9.first_case_code || pci_data.section9.first_case_rate_tag === 'OLD' || first_case_style.disabled" @click="confirmChangeCaseRate('clear', 'first')">mdi-delete</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row align="end" class="mt-3 mt-sm-n2" wrap>
          <v-col cols="12" sm="2" md="2" lg="1" class="text-sm-right">
            <label :class="{'opacity' : trans_detail.transaction_type === 'OUTPATIENT'}" class="body-2 d-block mb-1">2ND CASE</label>
          </v-col>
          <v-col :class="trans_detail.transaction_type === 'INPATIENT' ? 'xs12 sm2 md2 lg2' : 'xs12 sm2 md2 lg3'" class="pl-2">
            <v-text-field :value="pci_data.section9.second_case_rate_tag === 'NEW' ? pci_data.section9.second_case_code : null" :class="{'opacity' : second_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Code'" class="body-2" hide-details readonly></v-text-field>
          </v-col>
          <v-col :class="trans_detail.transaction_type === 'INPATIENT' ? 'xs12 sm6 md6 lg6' : 'xs12 sm8 md8 lg8'" class="pl-2">
            <v-text-field v-if="!trans_detail.editable || second_case_style.disabled" :value="pci_data.section9.second_case_rate_tag === 'NEW' ? pci_data.section9.second_case_desc : null" :class="{'opacity' : second_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" class="body-2" hide-details readonly></v-text-field>
            
            <v-combobox v-else v-model="pci_data.section9.second_case_desc" :items="second_case_items" :loading="loading_case_rate2" :readonly="loading_case_rate2" @focus="confirmChangeCaseRate('change', 'second')" @blur="pci_data.section9.second_case_desc = current_second_case_rate" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" :return-object="false" item-text="description" item-value="description" class="body-2" hide-no-data hide-details single-line>
              <template v-slot:selection>
                <span class="grey--text text--darken-3">{{ pci_data.section9.second_case_rate_tag === 'NEW' ? pci_data.section9.second_case_desc : '.' }}</span>
              </template>
              <template v-slot:item="{ attrs, on, item }">
                <v-list-item v-bind="attrs" v-on="on" v-on:click="current_second_case_rate = item.description" @click="caseRateAutoFill('second', item)">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.description }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.icd_rvs_code }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>
          
          <v-col v-if="trans_detail.transaction_type === 'INPATIENT'" cols="12" sm="2" md="2" lg="3" class="pl-2">
            <v-text-field :value="pci_data.section9.second_case_rate_tag === 'NEW' ? (pci_data.section9.second_case_rate === '0.00' ? null : pci_data.section9.second_case_rate) : null" :class="{'opacity' : second_case_style.opacity }" :label="$vuetify.breakpoint.smAndUp ? '' : 'Rate'" class="body-2" hide-details readonly>
              <template v-if="trans_detail.editable" v-slot:append-outer>
                <v-icon :disabled="loading_case_rate2 || !pci_data.section9.second_case_code || pci_data.section9.second_case_rate_tag === 'OLD' || second_case_style.disabled" @click="confirmChangeCaseRate('clear', 'second')">mdi-delete</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row> -->

        <!-- RVS PROCEDURES
        <v-row class="mt-4" wrap>
          <v-col cols="6" sm="6" md="6" lg="6">
            <h1 class="section-title">RVS PROCEDURES</h1>
          </v-col>
          <v-col cols="6" sm="6" md="6" lg="6" class="text-right"></v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row v-if="$vuetify.breakpoint.smAndUp" class="text-center mt-2" wrap>
          <v-col cols="2" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-bold grey--text text--darken-2">CODE</label>
          </v-col>
          <v-col cols="4" sm="4" md="4" lg="4">
            <label class="body-2 font-weight-bold grey--text text--darken-2">DESCRIPTION</label>
          </v-col>
          <v-col cols="2" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-bold grey--text text--darken-2">RATE</label>
          </v-col>
          <v-col cols="2" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-bold grey--text text--darken-2">DATE</label>
          </v-col>
          <v-col cols="2" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-bold grey--text text--darken-2">LATERALITY</label>
          </v-col>
        </v-row>
        
        <v-row v-for="(rvs, i) in displayRvsProcedures()" :key="i+1" dense>
          <v-col class="mt-2" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="rvs.rvs_code" :label="$vuetify.breakpoint.smAndUp ? '' : 'Code'" class="body-2" hide-details readonly dense>
              <template v-slot:prepend>
                <label class="body-2 black--text">{{ i+1 }})</label>
              </template>
            </v-text-field>
          </v-col>
          <v-col class="pl-7 pl-sm-0 mt-2" cols="12" sm="4" md="4" lg="4">
            <v-text-field v-model="rvs.rvs_description" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" class="body-2" hide-details readonly dense></v-text-field>
          </v-col>
          <v-col class="pl-7 pl-sm-0 mt-2" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="rvs.rvs_case_rate" :label="$vuetify.breakpoint.smAndUp ? '' : 'Rate'" class="body-2" hide-details readonly dense></v-text-field>
          </v-col>
          <v-col class="pl-7 pl-sm-0 mt-2" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="rvs.rvs_date" :label="$vuetify.breakpoint.smAndUp ? '' : 'Date'" class="body-2" hide-details readonly dense></v-text-field>
          </v-col>
          <v-col class="pl-7 pl-sm-0 mt-2" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="rvs.rvs_laterality" :label="$vuetify.breakpoint.smAndUp ? '' : 'Laterality'" class="body-2" hide-details readonly dense></v-text-field>
          </v-col>
        </v-row> -->
      <!-- </template> -->

      <!-- PERTINENT SIGNS AND SYMPTOMS -->
      <v-row class="mt-8" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">PERTINENT SIGNS AND SYMPTOMS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part3_number3" @click="displayCommentData('pertinent')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-show="loading_symptoms" class="text-center my-10" justify="center" wrap>
        <v-col cols="4" sm="4" md="4" lg="4">
          <v-progress-linear height="6" color="primary" indeterminate></v-progress-linear>
          <h6>Loading Selection. Please Wait...</h6>
        </v-col>
      </v-row>

      <v-row class="mt-2" wrap>
        <v-col v-for="(symptom, i) in symptoms_items" :key="i" cols="12" sm="4" md="3" lg="3">
          <v-checkbox v-model="selected_symptom" :label="symptom.symptom" :value="symptom.symptoms_id" class="pa-0 ma-1 ml-6" readonly hide-details return-object></v-checkbox>
        </v-col>
      </v-row>

      <v-row align="center" dense>
        <v-col cols="2" sm="2" md="2" lg="3" xl="3" v-for="(symptom, i) in pci_data.section10" :key="i">
          <v-text-field v-if="symptom.symptom === 'PAIN'" label="PAIN" :value="symptom.pain_site" class="body-2" maxlength="100" readonly hide-details/>
          <v-text-field v-else-if="symptom.symptoms_id === 'X'" label="OTHERS" :value="symptom.symptom" class="body-2" maxlength="100" readonly hide-details/>
        </v-col>
      </v-row>

      <!-- SPECIAL CONSIDERATIONS -->
      <v-row class="mt-5" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">SPECIAL CONSIDERATIONS</h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part2_number8" @click="displayCommentData('special')" color="primary" tile depressed small>CHECK COMMENTS 
          <v-badge content="!" color="red">
            <v-icon class="pl-1" small>mdi-comment</v-icon>
          </v-badge>
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      
      <!-- LETTER A -->
      <v-row align="baseline" align-content="end" class="mb-5" wrap>
        <v-col cols="12" sm="5" md="6" lg="6">
          <label class="body-2">A.) For Z-Benefit Package</label>
        </v-col>
        <v-col cols="4" sm="4" md="3" lg="3" class="text-right">
          <label class="body-2">Z-Benefit Package Code:</label>
        </v-col>
        <v-col cols="8" sm="3" md="3" lg="3" class="pl-2">
          <v-text-field v-model="pci_data.section11.b" @change="checkDataStatus('others')" class="body-2" maxlength="100" hide-details></v-text-field>
        </v-col>
      </v-row>

      <!-- LETTER B -->
      <label class="body-2">B.) For MCP Package (enumerate four dates (mm-dd-year) of pre-natal check-ups)</label>
      <v-row class="pl-8" dense>
        <v-col cols="12" sm="3" md="3" lg="3">
          <!-- <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }"> -->
              <v-text-field v-model="pci_data.section11.c.mcp_package_date1" v-on="on" @click:clear="pci_data.section11.c.mcp_package_date1_date = null" @change="checkDataStatus('others')" class="body-2 ma-0 pa-0" readonly hide-details :clearable="trans_detail.editable">
                <template v-slot:prepend>
                  <span class="mt-1 body-2">1.</span>
                </template>
              </v-text-field>
            <!-- </template>
            <v-date-picker v-model="pci_data.section11.c.mcp_package_date1_date" :max="max_admitted_date" @input="pci_data.section11.c.mcp_package_date1 = formatDate(pci_data.section11.c.mcp_package_date1_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu> -->
        </v-col>
        <v-col cols="12" sm="3" md="3" lg="3">
          <!-- <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }"> -->
              <v-text-field v-model="pci_data.section11.c.mcp_package_date2" v-on="on" @click:clear="pci_data.section11.c.mcp_package_date2_date = null" @change="checkDataStatus('others')" class="body-2 ma-0 pa-0" readonly hide-details :clearable="trans_detail.editable">
                <template v-slot:prepend>
                  <span class="mt-1 body-2">2.</span>
                </template>
              </v-text-field>
            <!-- </template>
            <v-date-picker v-model="pci_data.section11.c.mcp_package_date2_date" :max="max_admitted_date" @input="pci_data.section11.c.mcp_package_date2 = formatDate(pci_data.section11.c.mcp_package_date2_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu> -->
        </v-col>
        <v-col cols="12" sm="3" md="3" lg="3">
          <!-- <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }"> -->
              <v-text-field v-model="pci_data.section11.c.mcp_package_date3" v-on="on" @click:clear="pci_data.section11.c.mcp_package_date3_date = null" @change="checkDataStatus('others')"  class="body-2 ma-0 pa-0" readonly hide-details :clearable="trans_detail.editable">
                <template v-slot:prepend>
                  <span class="mt-1 body-2">3.</span>
                </template>
              </v-text-field>
            <!-- </template>
            <v-date-picker v-model="pci_data.section11.c.mcp_package_date3_date" :max="max_admitted_date" @input="pci_data.section11.c.mcp_package_date3 = formatDate(pci_data.section11.c.mcp_package_date3_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu> -->
        </v-col>
        <v-col cols="12" sm="3" md="3" lg="3">
          <!-- <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }"> -->
              <v-text-field v-model="pci_data.section11.c.mcp_package_date4" v-on="on" @click:clear="pci_data.section11.c.mcp_package_date4_date = null" @change="checkDataStatus('others')" class="body-2 ma-0 pa-0" readonly hide-details :clearable="trans_detail.editable">
                <template v-slot:prepend>
                  <span class="mt-1 body-2">4.</span>
                </template>
              </v-text-field>
            <!-- </template>
            <v-date-picker v-model="pci_data.section11.c.mcp_package_date4_date" :max="max_admitted_date" @input="pci_data.section11.c.mcp_package_date4 = formatDate(pci_data.section11.c.mcp_package_date4_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu> -->
        </v-col>
      </v-row>
 
      <!-- LETTER C -->
      <v-row align="center" class="my-5" wrap>
        <v-col cols="12" sm="4" md="4" lg="4">
          <label class="body-2">C.) For TBDOTS Package</label>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" class="pl-4 pl-sm-0">
          <v-radio-group v-model="pci_data.section11.d" @change="checkDataStatus('others')" :error="required && !pci_data.section11.d && trans_detail.phic_packages.includes('TB DOTS')" row>
            <v-radio value="I" label="Intensive Phase"></v-radio>
            <v-radio value="M" class="pl-0 pl-md-14" label="Maintenance Phase"></v-radio>
            <v-btn v-if="trans_detail.editable && !!pci_data.section11.d" @click="pci_data.section11.d = '', checkDataStatus('others')" width="60" height="25" small>Clear</v-btn>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="4" class="pl-4 pl-sm-0">
          <v-text-field v-model="pci_data.section11.ntp_card_no" :error="required && !pci_data.section11.ntp_card_no && trans_detail.phic_packages.includes('TB DOTS')" label="NTP Card No" maxLength="10"> </v-text-field>
        </v-col>
      </v-row>

      <!-- LETTER D -->
      <label class="body-2">D.) For Animal Bite Package (Write dates (mm-dd-year) when the following doses of vaccine were given)</label>
      <v-row  align="baseline" class="text-center" wrap>
        <v-col cols="12" sm="12" md="7" lg="7">
          <v-row align="baseline" wrap>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
              <label class="body-2">Day 0 ARV:</label>
            </v-col>
            <v-col cols="9" sm="2" md="2" lg="2">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="pci_data.section11.e.day_0_arv" v-on="on" @click:clear="pci_data.section11.e.day_0_arv_date = null" @change="checkDataStatus('animal')" :error="required && !pci_data.section11.e.day_0_arv_date && trans_detail.phic_packages.includes('ANIMAL BITES')" class="body-2 ma-0 pa-0" readonly :clearable="trans_detail.editable"></v-text-field>
                </template>
                <v-date-picker v-model="pci_data.section11.e.day_0_arv_date" :max="max_admitted_date" @input="pci_data.section11.e.day_0_arv = formatDate(pci_data.section11.e.day_0_arv_date)" @change="checkDataStatus('animal')" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
              <label class="body-2">Day 3 ARV:</label>
            </v-col>
            <v-col cols="9" sm="2" md="2" lg="2">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="pci_data.section11.e.day_3_arv" v-on="on" @click:clear="pci_data.section11.e.day_3_arv_date = null" @change="checkDataStatus('animal')" :error="required && !pci_data.section11.e.day_3_arv_date && trans_detail.phic_packages.includes('ANIMAL BITES')" class="body-2 ma-0 pa-0" readonly :clearable="trans_detail.editable"></v-text-field>
                </template>
                <v-date-picker v-model="pci_data.section11.e.day_3_arv_date" :max="max_admitted_date" @input="pci_data.section11.e.day_3_arv = formatDate(pci_data.section11.e.day_3_arv_date)" @change="checkDataStatus('animal')" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
              <label class="body-2">Day 7 ARV:</label>
            </v-col>
            <v-col cols="9" sm="2" md="2" lg="2">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="pci_data.section11.e.day_7_arv" v-on="on" @click:clear="pci_data.section11.e.day_7_arv_date = null" @change="checkDataStatus('animal')" :error="required && !pci_data.section11.e.day_7_arv_date && trans_detail.phic_packages.includes('ANIMAL BITES')" class="body-2 ma-0 pa-0" readonly :clearable="trans_detail.editable"></v-text-field>
                </template>
                <v-date-picker v-model="pci_data.section11.e.day_7_arv_date" :max="max_admitted_date" @input="pci_data.section11.e.day_7_arv = formatDate(pci_data.section11.e.day_7_arv_date)" @change="checkDataStatus('animal')" no-title></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="5" lg="5">
          <v-row align="baseline" wrap>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
              <label class="body-2">RIG:</label>
            </v-col>
            <v-col cols="9" sm="2" md="3" lg="3">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="pci_data.section11.e.day_rig_arv" v-on="on" @click:clear="pci_data.section11.e.day_rig_arv_date = null" @change="checkDataStatus('animal')" :error="required && !pci_data.section11.e.day_rig_arv_date && trans_detail.phic_packages.includes('ANIMAL BITES')" class="body-2 ma-0 pa-0" readonly :clearable="trans_detail.editable"></v-text-field>
                </template>
                <v-date-picker v-model="pci_data.section11.e.day_rig_arv_date" :max="max_admitted_date" @input="pci_data.section11.e.day_rig_arv = formatDate(pci_data.section11.e.day_rig_arv_date)" @change="checkDataStatus('animal')" no-title></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="7" lg="7">
          <v-row align="baseline" wrap>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
                <label class="body-2">Others:</label>
            </v-col>
            <v-col cols="9" sm="2" md="3" lg="3">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                    <v-text-field v-model="pci_data.section11.e.day_others_arv" v-on="on" @click:clear="pci_data.section11.e.day_others_arv_date = null" @change="checkDataStatus('animal')" class="body-2 ma-0 pa-0" readonly :clearable="trans_detail.editable"></v-text-field>
                </template>
                <v-date-picker v-model="pci_data.section11.e.day_others_arv_date" :max="max_admitted_date" @input="pci_data.section11.e.day_others_arv = formatDate(pci_data.section11.e.day_others_arv_date)" @change="checkDataStatus('animal')" no-title></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" sm="2" md="2" lg="2" class="text-right pr-2">
                <label class="body-2">Specify Others:</label>
            </v-col>
            <v-col cols="9" sm="2" md="3" lg="3">
              <v-text-field :disabled="pci_data.section11.e.day_others_arv === null"  v-model="pci_data.section11.e.specify_others_arv" v-on="on" :error="required && !pci_data.section11.e.specify_others_arv && trans_detail.phic_packages.includes('ANIMAL BITES')" @change="checkDataStatus('animal')" class="body-2 ma-0 pa-0"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- LETTER E -->
      <v-row align="baseline" wrap>
        <v-col cols="12" sm="3" md="3" lg="4" class="pt-5">
          <label class="body-2">E.) For Newborn Care Package </label>
        </v-col>
        <!-- <v-col cols="12" sm="6" md="6" lg="6" class="pl-2">
          <v-radio-group v-model="pci_data.section11.f.newborn_care_package" 
          @change="checkDataStatus('others')" class="ma-0 pa-0" hide-details row>
            <v-radio value="essential" label="Essential Newborn Care"></v-radio>
            <v-radio value="hearing" label="Newborn Hearing Screening Test"></v-radio>
            <v-radio value="screening" label="Newborn Screening Test"></v-radio>
            <v-btn v-if="trans_detail.editable && pci_data.section11.f.newborn_care_package !== null && pci_data.section11.f.newborn_care_package !== ''" 
            @click="pci_data.section11.f.newborn_care_package = '', checkDataStatus('others')" 
            width="60" height="25" small>Clear</v-btn>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="3" md="3" lg="2" class="pl-4 pl-sm-0">
          <v-text-field :disabled="pci_data.section11.f.newborn_care_package !== 'screening'" 
          v-model="pci_data.section11.f.filter_card_no" label="Filter Card No." maxLength="12"> </v-text-field>
        </v-col> -->

        <v-col cols="12" sm="6" md="6" lg="6">
          <v-row align="center" no-gutters class="flex-nowrap">
            <v-col cols="auto">
              <v-checkbox v-model="pci_data.section11.f.newborn_care_package" label="Essential Newborn Care" @change="checkDataStatus('others')"  value="essential" class="pa-0 ma-0 ml-11" hide-details></v-checkbox>
            </v-col>
        
            <v-col cols="auto">
              <v-checkbox v-model="pci_data.section11.f.newborn_care_package" label="Newborn Hearing Screening Test" @change="checkDataStatus('others')"  value="hearing" class="pa-0 ma-0 ml-6" hide-details></v-checkbox>
            </v-col>

            <v-col cols="auto">
              <v-checkbox v-model="pci_data.section11.f.newborn_care_package" label="Newborn Screening Test" @change="checkDataStatus('others')"  value="screening" class="pa-0 ma-0 ml-6" hide-details></v-checkbox>
            </v-col>

             <v-col cols="auto"  width="60">
              <v-btn v-show="trans_detail.editable && pci_data.section11.f.newborn_care_package.length>0" @click="pci_data.section11.f.newborn_care_package = [], checkDataStatus('others')" class="pa-0 ma-0 ml-6 mr-10"  width="60" height="25" small>Clear</v-btn>
            </v-col>

            <v-col cols="auto" class="ml-auto">
              <v-text-field :disabled="!pci_data.section11.f.newborn_care_package.includes('screening')" v-model="pci_data.section11.f.filter_card_no" label="Filter Card No." maxLength="12" class="pa-0 ma-0 pl-10"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- FOR ESSENTIAL NEWBORN -->
      <div class="pl-8 mt-2">
        <label :class="{'opacity' : pci_data.section11.f.newborn_care_package.includes('screening')}" class="body-2 font-weight-medium">For Essential Newborn Care (check applicable boxes)</label>
        <v-row class="mt-2" wrap>
          <v-col v-for="(essential, i) in essential_items" :key="i" cols="12" sm="6" md="4" lg="4">
            <v-checkbox v-model="selected_essential" :label="essential.description" :value="essential.key_name"  :disabled="disable_essential" @change="addSelectedEssential(essential, i, $event)" class="pa-0 ma-0 ml-6" hide-details></v-checkbox>
          </v-col>
        </v-row>
      </div>
      
      <!-- LETTER F -->
      <v-row align="baseline" class="mt-5" wrap>
        <v-col cols="12" sm="6" md="6" lg="6">
          <label class="body-2">F.) For Outpatient HIV/AIDS Treatment Package</label>
        </v-col>
        <v-col cols="4" sm="3" md="3" lg="3" class="text-right pr-2">
          <label class="body-2">Laboratory Number:</label>
        </v-col>
        <v-col cols="8" sm="3" md="3" lg="3">
          <v-text-field v-model="pci_data.section11.g" v-on:keypress="numberOnly($event, pci_data.section11.g)" :error="required && !pci_data.section11.g && trans_detail.phic_packages.includes('HIV')" @change="checkDataStatus('others')" onpaste="return false" class="body-2" maxlength="100" hide-details></v-text-field>
        </v-col>
      </v-row>

      <!-- COMMENT DIALOG -->
      <v-dialog v-model="comment_dialog" width="500" persistent>
        <v-card>
          <h3 class="grey--text text--darken-3 font-weight-medium py-1 text-center">{{ comment_title }}</h3>
          <v-divider></v-divider>
          <div class="px-4 mt-2">
            <label class="body-2">Comment:</label>
            <v-textarea v-model="comment_content" rows="4" outlined readonly hide-details></v-textarea>
          </div>
          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn @click="comment_dialog = false" class="ml-1" color="primary" small>CLOSE</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <v-dialog v-if="others.dialog" v-model="others.dialog" width="400" persistent>
          <v-card class="pa-5">
              <h6 class="font-weight-regular body-2">Current: {{ others.current }}</h6>
              <v-divider class="my-2"></v-divider>
              <h6 class="font-weight-regular body-2">Others</h6>
              <v-text-field v-model="others.new" placeholder="Enter the other medical history here" hide-details outlined></v-text-field>

              <v-row justify="end" class="mt-4" wrap>
                  <v-btn @click="others.dialog = false" small>CLOSE</v-btn>
                  <v-btn @click="otherPastMedical" :disabled="!others.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
              </v-row>
          </v-card>
      </v-dialog>

      <!--SEARCH CASE RATE DIALOG-->
      <v-dialog v-model="showCaseRateDialog" max-width="1900px" max-height="700px" persistent>
        <v-card>
          <v-card-title class="text-h6 mr-6 ml-0 pl-3">Search Case Rate</v-card-title>
          <v-card-text>
            <!-- Form Fields -->
            <v-form ref="form">
              <v-row>
                <v-col cols="4" class="ml-0 pl-0">
                  <v-text-field v-model="search_description" @input="search_description = textCapitalize($event)" label="Description" outlined dense></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="search_icd_code" @input="search_icd_code = textCapitalize($event)" label="ICD Code" outlined dense></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="search_rvs_code" @input="search_rvs_code = textCapitalize($event)" label="RVS Code" outlined dense></v-text-field>
                </v-col>
                <v-col cols="2" class="mt-1">
                  <v-btn class="primary" @click="searchCaseRate" :disabled="!(search_description || search_icd_code || search_rvs_code)"  tile depressed small>Search</v-btn>
                  <v-btn class="secondary ml-1" @click="clearSearch" tile depressed small>Clear</v-btn>
                </v-col>
              </v-row>
            </v-form>
            
            <!-- Results and Data -->
            <v-row v-if="case_rate_result.length">
              <v-col class="ma-0 pa-0 d-flex justify-start">
                <span><strong> Search Results:</strong></span>
                <span><strong>Description:</strong> {{ search_description || '' }} ;</span>
                <span><strong>ICD Code:</strong> {{ search_icd_code || '' }}  ;</span>
                <span><strong>RVS Code:</strong> {{ search_rvs_code || '' }}  </span>
              </v-col>
              <v-col class="ma-0 pa-0 d-flex justify-end">
                <span><strong>{{ case_rate_result.length }} Cases Rate Found </strong></span>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="ma-0 pa-1 legend-border">
                <span><strong>HCI Fee</strong> - Health Care Institution Fee; </span>
                <span><strong>Prof Fee</strong> - Professional/Health Care Professional Fee; </span>
                <span><strong>Case Rate</strong> - Case Rate Total Amount; </span>
                <span><strong>ASC</strong> - Ambulatory Surgical Clinic; </span>
                <span><strong>ABTC</strong> - Animal Bite Treatment Center; </span>
                <span><strong>CIU</strong> - Community Isolation Unit; </span>
                <span><strong>DATRC</strong> - Drug Abuse Treatment and Rehabilitation Center; </span>
                <span><strong>DSP</strong> - Diagnostic Service Provider; </span>
                <span><strong>FSDC</strong> - Free-Standing Dialysis Clinic; </span>
                <span><strong>HIVTH</strong> - HIV Treatment Hub; </span>
                <span><strong>MCP</strong> - Maternity Care Package Provider; </span>
                <span><strong>OPMC</strong> - Outpatient Malaria Center; </span>
                <span><strong>PCB</strong> - PCB/EPCB Provider; </span>
                <span><strong>PCF</strong> - Primary Care Facility - Infirmary/Dispensary; </span>
                <span><strong>RHU</strong> - Rural Health Unit; </span>
                <span><strong>TBDOTSC</strong> - TBDOTS Center;</span>
              </v-col>
            </v-row>

            <!-- Table -->
            <v-row>
              <table class="body-2 bordered" cellspacing="0" cellpadding="5" :loading="search_case_rate_loading">
                <thead class="white--text darken-3 blue">
                  <tr>
                    <th colspan="18">Case Rate Group</th>
                  </tr>
                  <tr>
                    <th rowspan="2" style="width: 5%">ICD 10 / RVS Code</th>
                    <th rowspan="2" style="width: 25%">Description</th>
                    <th colspan="3" class="text-center" style="width: 20%">First Case Rate</th>
                    <th colspan="3" class="text-center" style="width: 20%">Second Case Rate</th>
                    <th colspan="8" class="text-center" style="width: 50%">
                      Applicable Health Care Institutions <br />
                      <i>Note: if licensed and capable to perform the procedure</i>
                    </th>
                  </tr>
                  <tr>
                    <th style="width: 5%">HCI Fee</th>
                    <th style="width: 5%">Prof Fee</th>
                    <th style="width: 5%">Case Rate</th>
                    <th style="width: 5%">HCI Fee</th>
                    <th style="width: 5%">Prof Fee</th>
                    <th style="width: 5%">Case Rate</th>
                    <th style="width: 5%">Level 1</th>
                    <th style="width: 5%">Level 2</th>
                    <th style="width: 5%">Level 3</th>
                    <th style="width: 5%">ASC</th>
                    <th style="width: 5%">PCF</th>
                    <th style="width: 5%">MCP</th>
                    <th style="width: 5%">FSDC</th>
                    <th style="width: 5%">OTHERS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr colspan="18" v-if="search_case_rate_loading" >
                    <td colspan="18">
                      <v-progress-linear color="primary" height="5" model-value="5" striped indeterminate ></v-progress-linear>
                    </td>
                  </tr>

                  <template v-if="on_load">
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td class="skeleton-loader" style="width: 3%"></td>
                      <td class="skeleton-loader" style="width: 25%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td class="skeleton-loader" style="width: 3%"></td>
                      <td class="skeleton-loader" style="width: 25%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                    </tr>
                  </template>

                  <!-- Actual Data Rows After Data Load -->
                  <template v-if="show_table">
                    <template v-for="(item, index) in case_rate_result">
                      <tr :key="`item-${index}`">
                        <td colspan="18" style="font-weight: bold;">{{ item.case_rate_description }}</td>
                      </tr>
                      <tr :key="`effectivity-${index}`">
                        <td colspan="18" style="font-weight: bold;color: #c12a0f;">
                          Effectivity date:  {{ formatDate(item.effectivity_date) }}
                          <span v-if="item.effectivity_end_date !== '12-31-9999'"> to </span>
                          {{ item.effectivity_end_date === '12-31-9999' ? 'onwards' : formatDate(item.effectivity_end_date) }}
                        </td>
                      </tr>
                      <template v-for="(amt, amtIndex) in item.amount">
                        <tr :key="`amt-row-${index}-${amtIndex}`">
                          <td v-if="amtIndex === 0" rowspan="2">{{ item.icd_rvs_code }}</td>
                          <td v-if="amtIndex === 0" rowspan="2">{{ item.item_description }}</td>
                          <td>{{ formatAmount(amt.primary_hci_fee) }} </td>
                          <td>{{ formatAmount(amt.primary_prof_fee) }}</td>
                          <td>{{ formatAmount(amt.primary_case_rate) }}</td>
                          <!-- Conditional Second Case Rate -->
                          <template v-if="(amt.secondary_hci_fee === '0.00' && amt.secondary_prof_fee === '0.00' && amt.secondary_case_rate === '0.00') || (amt.secondary_hci_fee === '' && amt.secondary_prof_fee === '' && amt.secondary_case_rate === '')">
                            <td colspan="3" style="text-align: center;">NOT APPLICABLE</td>
                          </template>
                          <template v-else>
                            <td>{{ formatAmount(amt.secondary_hci_fee) }}</td>
                            <td>{{ formatAmount(amt.secondary_prof_fee) }}</td>
                            <td>{{ formatAmount(amt.secondary_case_rate) }}</td>
                          </template>
                          <td
                            v-for="(value, key) in filteredFacilityChecks(amt.facility_checks)"
                            :key="`facility-${index}-${amtIndex}-${key}`"
                            style="text-align: center;"
                          >
                            <v-icon v-if="displayCheckIcon(amt.facility_checks, key)" color="success">mdi-check</v-icon>
                          </td>
                          <td
                            style="text-align: center;"
                            v-show="displayCheckIconForMultiple(amt.facility_checks)"
                          >
                            <v-icon color="success">mdi-check</v-icon>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </template>
                </tbody>
              </table>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-end"> 
            <v-btn @click="showCaseRateDialog = false" tile depressed small text-right>Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--SEARCH CASE RATE DIALOG-->
      <v-dialog v-model="showCaseRateForCPTDialog" max-width="1900px" max-height="700px" persistent>
        <v-card>
          <v-card-title class="text-h6 mr-6 ml-0 pl-3">Select Case Rate Code</v-card-title>
          <v-card-text>
            <!-- Form Fields -->
            <v-form ref="form">
              <!--<v-row>
                <v-col cols="4" class="ml-0 pl-0">
                  <v-text-field v-model="search_description" @input="search_description = textCapitalize($event)" label="Description" outlined dense></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="search_icd_code" @input="search_icd_code = textCapitalize($event)" label="ICD Code" outlined dense></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field v-model="search_rvs_code" @input="search_rvs_code = textCapitalize($event)" label="RVS Code" outlined dense></v-text-field>
                </v-col>
                <v-col cols="2" class="mt-1">
                  <v-btn class="primary" @click="searchCaseRateForCPT()" :disabled="!(search_description || search_icd_code || search_rvs_code)"  tile depressed small>Search</v-btn>
                  <v-btn class="secondary ml-1" @click="clearSearch" tile depressed small>Clear</v-btn>
                </v-col>
              </v-row>-->
            </v-form>
            
            <!-- Results and Data -->
            <!--<v-row v-if="case_rate_result.length">
              <v-col class="ma-0 pa-0 d-flex justify-start">
                <span><strong> Search Results:</strong></span>
                <span><strong>Description:</strong> {{ search_description || '' }} ;</span>
                <span><strong>ICD Code:</strong> {{ search_icd_code || '' }}  ;</span>
                <span><strong>RVS Code:</strong> {{ search_rvs_code || '' }}  </span>
              </v-col>
              <v-col class="ma-0 pa-0 d-flex justify-end">
                <span><strong>{{ case_rate_result.length }} Cases Rate Found </strong></span>
              </v-col>
            </v-row>-->
            <!-- Table -->
            <v-row>
              <table class="body-2 bordered" cellspacing="0" cellpadding="5" :loading="search_case_rate_loading">
                <thead class="white--text darken-3 blue">
                  <tr>
                    <th colspan="18">Case Rate Group</th>
                  </tr>
                  <tr>
                    <th rowspan="2" style="width: 5%">Case Rate Code</th>
                    <th rowspan="2" style="width: 5%">ICD 10 / RVS Code</th>
                    <th rowspan="2" style="width: 25%">Description</th>
                    <th colspan="3" class="text-center" style="width: 20%">First Case Rate</th>
                    <th colspan="3" class="text-center" style="width: 20%">Second Case Rate</th>
                    <th colspan="8" class="text-center" style="width: 50%">
                      Applicable Health Care Institutions <br />
                      <i>Note: if licensed and capable to perform the procedure</i>
                    </th>
                  </tr>
                  <tr>
                    <th style="width: 5%">HCI Fee</th>
                    <th style="width: 5%">Prof Fee</th>
                    <th style="width: 5%">Case Rate</th>
                    <th style="width: 5%">HCI Fee</th>
                    <th style="width: 5%">Prof Fee</th>
                    <th style="width: 5%">Case Rate</th>
                    <th style="width: 5%">Level 1</th>
                    <th style="width: 5%">Level 2</th>
                    <th style="width: 5%">Level 3</th>
                    <th style="width: 5%">ASC</th>
                    <th style="width: 5%">PCF</th>
                    <th style="width: 5%">MCP</th>
                    <th style="width: 5%">FSDC</th>
                    <th style="width: 5%">OTHERS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr colspan="18" v-if="search_case_rate_loading" >
                    <td colspan="18">
                      <v-progress-linear color="primary" height="5" model-value="5" striped indeterminate ></v-progress-linear>
                    </td>
                  </tr>

                  <template v-if="on_load">
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td class="skeleton-loader" style="width: 3%"></td>
                      <td class="skeleton-loader" style="width: 25%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td colspan="18" class="skeleton-loader"></td>
                    </tr>
                    <tr >
                      <td class="skeleton-loader" style="width: 3%"></td>
                      <td class="skeleton-loader" style="width: 25%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                      <td class="skeleton-loader" style="width: 5%"></td>
                    </tr>
                  </template>

                  <!-- Actual Data Rows After Data Load -->
                  <template v-if="show_table">
                      <template v-for="(item, index) in case_rate_result">
                        <tr :key="`item-${index}`"  @click="selectCaseRateCode(item.icd_rvs_code, item.case_rate_code)" class="case-rate-style">
                          <td colspan="18" style="font-weight: bold;">{{ item.case_rate_description }}</td>
                        </tr>
                        <tr :key="`effectivity-${index}`" @click="selectCaseRateCode(item.icd_rvs_code, item.case_rate_code)" class="case-rate-style">
                          <td colspan="18" style="font-weight: bold;color: #c12a0f;">
                            Effectivity date:  {{ formatDate(item.effectivity_date) }}
                            <span v-if="item.effectivity_end_date !== '12-31-9999'"> to </span>
                            {{ item.effectivity_end_date === '12-31-9999' ? 'onwards' : formatDate(item.effectivity_end_date) }}
                          </td>
                        </tr>
                        <template v-for="(amt, amtIndex) in item.amount">
                          <tr :key="`amt-row-${index}-${amtIndex}`" @click="selectCaseRateCode(item.icd_rvs_code, item.case_rate_code)" class="case-rate-style">
                            <td v-if="amtIndex === 0" rowspan="2">{{ item.case_rate_code }}</td>
                            <td v-if="amtIndex === 0" rowspan="2">{{ item.icd_rvs_code }}</td>
                            <td v-if="amtIndex === 0" rowspan="2">{{ item.item_description }}</td>
                            <td>{{ formatAmount(amt.primary_hci_fee) }} </td>
                            <td>{{ formatAmount(amt.primary_prof_fee) }}</td>
                            <td>{{ formatAmount(amt.primary_case_rate) }}</td>
                            <!-- Conditional Second Case Rate -->
                            <template v-if="(amt.secondary_hci_fee === '0.00' && amt.secondary_prof_fee === '0.00' && amt.secondary_case_rate === '0.00') || (amt.secondary_hci_fee === '' && amt.secondary_prof_fee === '' && amt.secondary_case_rate === '')">
                              <td colspan="3" style="text-align: center;">NOT APPLICABLE</td>
                            </template>
                            <template v-else>
                              <td>{{ formatAmount(amt.secondary_hci_fee) }}</td>
                              <td>{{ formatAmount(amt.secondary_prof_fee) }}</td>
                              <td>{{ formatAmount(amt.secondary_case_rate) }}</td>
                            </template>
                            <td
                              v-for="(value, key) in filteredFacilityChecks(amt.facility_checks)"
                              :key="`facility-${index}-${amtIndex}-${key}`"
                              style="text-align: center;"
                            >
                              <v-icon v-if="displayCheckIcon(amt.facility_checks, key)" color="success">mdi-check</v-icon>
                            </td>
                            <td
                              style="text-align: center;"
                              v-show="displayCheckIconForMultiple(amt.facility_checks)"
                            >
                              <v-icon color="success">mdi-check</v-icon>
                            </td>
                          </tr>
                        </template>
                      </template>

                  </template>
                </tbody>
              </table>
            </v-row>
            
            <v-row>
              <v-col class="ma-0 pa-1 legend-border">
                <span><strong>HCI Fee</strong> - Health Care Institution Fee; </span>
                <span><strong>Prof Fee</strong> - Professional/Health Care Professional Fee; </span>
                <span><strong>Case Rate</strong> - Case Rate Total Amount; </span>
                <span><strong>ASC</strong> - Ambulatory Surgical Clinic; </span>
                <span><strong>ABTC</strong> - Animal Bite Treatment Center; </span>
                <span><strong>CIU</strong> - Community Isolation Unit; </span>
                <span><strong>DATRC</strong> - Drug Abuse Treatment and Rehabilitation Center; </span>
                <span><strong>DSP</strong> - Diagnostic Service Provider; </span>
                <span><strong>FSDC</strong> - Free-Standing Dialysis Clinic; </span>
                <span><strong>HIVTH</strong> - HIV Treatment Hub; </span>
                <span><strong>MCP</strong> - Maternity Care Package Provider; </span>
                <span><strong>OPMC</strong> - Outpatient Malaria Center; </span>
                <span><strong>PCB</strong> - PCB/EPCB Provider; </span>
                <span><strong>PCF</strong> - Primary Care Facility - Infirmary/Dispensary; </span>
                <span><strong>RHU</strong> - Rural Health Unit; </span>
                <span><strong>TBDOTSC</strong> - TBDOTS Center;</span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-end"> 
            <v-btn @click="showCaseRateForCPTDialog = false" tile depressed small text-right>Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- NAVIGATION BUTTON -->
      <v-divider class="my-5"></v-divider>
      <v-row justify="space-between" wrap justify-space-between>
        <v-col cols="5" sm="5" md="5" lg="5">
          <v-btn @click="$router.push('/input-forms/patient-data')" color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
        </v-col>
        <v-col cols="5" sm="5" md="5" lg="5" class="text-right">
          <v-btn @click="$router.push('/input-forms/physical-examination')" color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
        </v-col>
      </v-row>

      <Alert :alert="alert" @changeDateAdmittedAndDischarged="changeDateAdmittedAndDischarged" @removeDischargedDiagnosis="removeDischargedDiagnosis" @clearCertificationData="clearCertificationData" @removeCaseRateAndCertificationData="removeCaseRateAndCertificationData" />
    </v-form>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import Alert from '../../Alert.vue'
import { signs_and_symptoms_list } from '@/reference/sign-and-symptoms.json'
import { mdisease_list } from '@/reference/medical-history-mdisease.json'

export default {  
  props: ['trans_detail', 'required', 'comment_data'],
  
  components: {
    Alert
  },

  directives: {
    mask
  },

  data(){
    return{
      // DATA
      on: false,
      pci_data: {
        section1: '',
        section2: {
          time_admitted: '',
          time_discharged: '',
          period_admitted: '',
          period_discharged: '',
          date_admitted: '',
          date_discharged: ''
        },
        section3: {
          illness_history: '',
          pertinent: {},
          gravidity: '',
          parity: '',
          term: '',
          preterm: '',
          abortions: '',
          living: '',
          lmp_date: ''
        },
        section4: {
          is_referred: '',
          reason: '',
          hci_name: '',
          hci_address: ''
        },
        section5: {
          status: [],
          expired: {
            date: '',
            time: '',
            period: ''
          },
          transfer: {
            hci_name: '',
            hci_address: '',
            hci_reason: ''
          }
        },
        section6: '',
        section7: [],
        section9: {
          first_case_rate_tag: '',
          first_case_hci_fee: '',
          first_case_pf_fee: '',
          first_case_code: '',
          first_case_desc: '',
          first_case_rate: '',
          second_case_rate_tag: '',
          second_case_hci_fee: '',
          second_case_pf_fee: '',
          second_case_code: '',
          second_case_desc: '',
          second_case_rate: ''
        },
        section10: [],
        section11: {
          b: '',
          c: {
            mcp_package_date1: '',
            mcp_package_date2: '',
            mcp_package_date3: '',
            mcp_package_date4: ''
          },
          d: '',
          e: {
            day_0_arv: '',
            day_3_arv: '',
            day_7_arv: '',
            day_rig_arv: '',
            day_others_arv: '',
            specify_others_arv: ''
          },
          f: {
            newborn_care_package: [],
            essential_newborn: []
          },
          g: ''
        }
      },
      pci_diagnosis: [],

      other_past_medical_history_chk: false,
      other_past_medical_history: '',

      // OTHERS
      confinement_date: sessionStorage.getItem('VKI55S') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('VKI55S'), 'flag423D').toString(this.$crypto.enc.Utf8)) : null,
      max_admitted_date: new Date().toISOString().slice(0,10),
      date_admitted_date: '',
      date_discharged_date: '',
      previous_admitted_value: null,
      previous_discharged_value: null,
      mask: '##:##:##',
      rules: {
        time_format: value => {
          if(value){
            if(this.$moment(value, 'hh:mm:ss', true).isValid()){
              return true
            }else{
              return 'Invalid Time Format'
            }
          }else{
            return true
          }
        }
      },
      err_msg_time_admitted: '',
      err_time_admitted: false,
      err_msg_time_discharged: '',
      err_time_discharged: false,
      time_period: false,
      total_fees: {
        hci_fee: '',
        pf_fee: '',
        grand_total: '',
        status: false
      },
      laterality_items: [
        { text: 'Left', value: 'L' },
        { text: 'Right', value: 'R' },
        { text: 'Both', value: 'B' },
        { text: 'N/A', value: 'N' }
      ],
      current_icd_description: '',
      current_first_case_rate: '',
      current_second_case_rate: '',
      selected_procedure: {},
      selected_symptom: [],
      selected_essential: [],
      alert: {},

      // REFERENCE DATA
      essential_items: [
        { key_name: 'drying', description: 'Immediate drying of newborn'},
        { key_name: 'skin_to_skin', description: 'Early skin-to-skin contact'},
        { key_name: 'cord_clamping', description: 'Timely Cord Clamping'},
        { key_name: 'prophylaxis', description: 'Eye Prophylaxis'},
        { key_name: 'weighing', description: 'Weighing of the newborn'},
        { key_name: 'vitamin_k', description: 'Vitamin K administration'},
        { key_name: 'bcg', description: 'BCG vaccination'},
        { key_name: 'non_separation', description: 'Non-seperation of mother/baby for early breastfeeding initiation.'},
        { key_name: 'hepatitis_b', description: 'Hepatitis B vaccination'}
      ],
      provider_list_items: [],
      first_case_items: [],
      second_case_items: [],
      symptoms_items: signs_and_symptoms_list,
      selected_icd: [],
      selected_cpt: [],

      mdisease_list: mdisease_list,

      others: {
          dialog: false,
          current: '',
          new: '',
          section: ''
      },

      selected_past_history: [],

      // LOADER
      loading_provider_list: true,
      loading_case_rate1: true,
      loading_case_rate2: true,
      loading_symptoms: false,

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: '',

      //SEARCH CASE RATE
      search_description: '',
      search_icd_code: '',
      search_rvs_code: '',
      showCaseRateDialog: false,
      showCaseRateForCPTDialog: false,
      case_rate_result: [],
      search_case_rate_loading: false,
      show_table:false,
      on_load: true,
      selectedCaseRateCodes: {},
      // p_case_rate_code: '',
      laterality: {},

      //DIAGNOSIS/PROCEDURE PAGINATION
      icd_current_page: 1,
      icd_next_page: 0,
      cpt_next_page: 0,
      cpt_current_page: 1,
      search_icd_items: '',
      search_cpt_items: '',
      time_out: null,
      procedure_loading: false,
      caserate_list_items: [],

      cert_total_health_facility_fee: 0,
      cert_total_professional_fee: 0,
      cert_grand_total: 0,

      diagnosis_items_key: ['PRIMARY', 'SECONDARY', 'OTHERS'],

      selected_admission_icd: []
    }
  },

  created(){
    setTimeout(() => {
      this.getPatientConfinementData();
    }, 200)
  },
  

  computed: {
    // DISABLE ESSENTIAL NEWBORN CARE
    disable_essential(){
      if(this.pci_data.section11.f.newborn_care_package.includes('essential')){
        return false
      }else{
        return true
      }
    },

    // FIRST_CASE_RATE STYLE
    first_case_style(){
      let style = {
        opacity: false,
        disabled: false
      }
      
      if(this.pci_diagnosis.data){
        if(this.pci_diagnosis.data.icd_code){
          if(this.pci_diagnosis.data.icd_code === this.pci_data.section9.first_case_code){
            style.disabled = true
          }
        }else{
          style.opacity = true
          style.disabled = true
        }
      }else{
        style.opacity = true
        style.disabled = true
      }

      return style
    },

    // SECOND_CASE_RATE STYLE
    second_case_style(){
      let style = {
        opacity: false,
        disabled: false
      }
      
      if(this.pci_diagnosis.data){
        if(this.pci_diagnosis.data.icd_code){
          if(this.pci_diagnosis.data.icd_code === this.pci_data.section9.second_case_code){
            style.disabled = true
          }
        }else{
          style.opacity = true
          style.disabled = true
        }
      }else{
        style.opacity = true
        style.disabled = true
      }

      return style
    },

    // COMPUTATION FOR HCI AND PF FEE
    compute_total_fees(){
      let rvs_hci_fee = 0
      let rvs_professional_fee = 0
      let total_cpt_amount = 0
      let first_case_rate = 0
      let first_case_pf = '0'
      let first_case_hci = '0'
      let second_case_rate = 0
      let second_case_pf = '0'
      let second_case_hci = '0'

      this.pci_diagnosis.data.forEach(diagnosis => {
        diagnosis.procedures.forEach(procedure => {
          if(procedure.rvs_hci_fee){
            total_cpt_amount += parseFloat(procedure.cpt_amount.replace(/,/g, ''))
            rvs_hci_fee += parseFloat(procedure.rvs_hci_fee.replace(/,/g, ''))
            rvs_professional_fee += parseFloat(procedure.rvs_professional_fee.replace(/,/g, ''))
          }
        })
      })

      if(this.trans_detail.transaction_type === 'INPATIENT'){
        if(this.pci_data.section9.first_case_rate_tag === 'NEW'){
          first_case_rate = this.pci_data.section9.first_case_rate ? parseFloat(this.pci_data.section9.first_case_rate.replace(/,/g, '')) : 0
          first_case_pf = this.pci_data.section9.first_case_pf_fee ? this.pci_data.section9.first_case_pf_fee : '0'
          first_case_hci = this.pci_data.section9.first_case_hci_fee ? this.pci_data.section9.first_case_hci_fee : '0'
        }

        if(this.pci_data.section9.second_case_rate_tag === 'NEW'){
          second_case_rate = this.pci_data.section9.second_case_rate ? parseFloat(this.pci_data.section9.second_case_rate.replace(/,/g, '')) : 0
          second_case_pf = this.pci_data.section9.second_case_pf_fee ? this.pci_data.section9.second_case_pf_fee : '0'
          second_case_hci = this.pci_data.section9.second_case_hci_fee ? this.pci_data.section9.second_case_hci_fee : '0'
        }

        total_cpt_amount = parseFloat(total_cpt_amount + first_case_rate + second_case_rate)
      }

      let total_professional_fee = parseFloat(first_case_pf.replace(/,/g, '')) + parseFloat(second_case_pf.replace(/,/g, '')) + rvs_professional_fee
      let total_hci_fee = parseFloat(first_case_hci.replace(/,/g, '')) + parseFloat(second_case_hci.replace(/,/g, '')) + rvs_hci_fee
      let grand_total = total_professional_fee + total_hci_fee
      let certification = [total_hci_fee, total_professional_fee, grand_total, total_cpt_amount]
      
      return certification
    },

    // // DATE ADMITTED
    // date_admitted(){
    //   return this.formatDate(this.confinement_date.date_admitted)
    // },
    
    // // DATE DISCHARGED
    // date_discharged(){
    //   return this.formatDate(this.confinement_date.date_discharged)
    // },
    // DATE ADMITTED
    date_admitted: {
      get() {
        return this.formatDate(this.confinement_date.date_admitted)
      },
      set(value) {
        this.confinement_date.date_admitted = value
        this.pci_data.section2.date_admitted = value
      }
    },

    // DATE DISCHARGED
    date_discharged: {
      get() {
        return this.formatDate(this.confinement_date.date_discharged)
      },
      set(value) {
        this.confinement_date.date_discharged = value
        this.pci_data.section2.date_discharged = value
      }
    },

    // GET ICD ITEMS
    icd_list(){
      const icd_list = this.$store.state.icd_list.filter(item => {
        return !this.selected_icd.includes(item.icd_code)
      })

      return icd_list
    },

    //GET CPT ITEMS
    procedure_list(){
      const cpt_list = this.$store.state.cpt_list.filter(item => {
        return !this.selected_cpt.includes(item.cpt_code)
      })

      return cpt_list
    },

    //GET PAST MEDICAL HISTORY
    past_history_items() {
        // const filter = this.selected_past_history.map(element => element.description)
        // const result = this.mdisease_list.filter(element => !filter.includes(element.description))
        // return result
      const filter = this.selected_past_history.map(element => element.description)
      let result = this.mdisease_list.filter(element => !filter.includes(element.description))

      if (this.trans_detail.phic_member_eligibility_status === 'Eligible') {
          result = result.filter(element => element.description.toUpperCase() !== "NONE")
      }

      return result
    },

    isSearchEnabled() {
      return (
        this.search_description.trim() !== "" ||
        this.search_icd_code.trim() !== "" ||
        this.search_rvs_code.trim() !== ""
      );
    },
  },

  watch: {
    // compute_total_fees(value){
    //   this.total_fees.hci_fee = (value ? value[0] : 0)
    //   this.total_fees.pf_fee = (value ? value[1] : 0)
    //   this.total_fees.grand_total = (value ? value[2] : 0)
    //   this.total_fees.total_cpt_amount = (value ? value[3] : 0)
    //   this.total_fees.status = true

    //   let philhealth_certification = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))
    //   philhealth_certification.total_cpt_amount = this.total_fees.total_cpt_amount

    //   sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
    // }
  },

  
  methods: {
    async searchCaseRate(){
      this.case_rate_result = [];
      this.search_case_rate_loading = true
      let response = await this.$services.getEclaimsWebService({
          request_key: "SCRM",
          provider_code: 'EKDF21B239E8232403',
          data: {
            icdcode: this.search_icd_code,
            rvscode: this.search_rvs_code,
            description: this.search_description,
            targetdate: ""
          }
      })
      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)
        this.search_case_rate_loading = false
        this.on_load = false
        this.show_table = true
        const case_rates = Array.isArray(response.data.caserates) ? response.data.caserates : [];

        this.case_rate_result = case_rates.map(rate => {
          return {
            case_rate_code: rate.pcaseRateCode,
            case_rate_description: rate.pcaseRateDescription,
            icd_rvs_code: rate.pitemCode,
            item_description: rate.pitemDescription,
            effectivity_date: rate.peffectivityDate,
            effectivity_end_date: rate.peffectivityEndDate,
            amount: [
              {
                primary_prof_fee: rate.amount[0]?.pprimaryProfFee,
                primary_hci_fee: rate.amount[0]?.pprimaryHCIFee,
                primary_case_rate: rate.amount[0]?.pprimaryCaseRate,
                secondary_prof_fee: rate.amount[0]?.psecondaryProfFee,
                secondary_hci_fee: rate.amount[0]?.psecondaryHCIFee,
                secondary_case_rate: rate.amount[0]?.psecondaryCaseRate,
                facility_checks: {
                  H1: rate.amount[0]?.pcheckFacilityH1,
                  H2: rate.amount[0]?.pcheckFacilityH2,
                  H3: rate.amount[0]?.pcheckFacilityH3,
                  ASC: rate.amount[0]?.pcheckFacilityASC,
                  PCF: rate.amount[0]?.pcheckFacilityPCF,
                  FSDC: rate.amount[0]?.pcheckFacilityFSDC,
                  MAT: rate.amount[0]?.pcheckFacilityMAT,
                  TSEKAP: rate.amount[0]?.pcheckFacilityTSEKAP,
                  ABTC: rate.amount[0]?.pcheckFacilityABTC,
                  TBDOTSC: rate.amount[0]?.pcheckFacilityTBDOTSC,
                  OPMC: rate.amount[0]?.pcheckFacilityOPMC,
                  RHU: rate.amount[0]?.pcheckFacilityRHU,
                  DATRC: rate.amount[0]?.pcheckFacilityDATRC,
                  HIVTH: rate.amount[0]?.pcheckFacilityHIVTH,
                  FPC: rate.amount[0]?.pcheckFacilityFPC,
                  CIU: rate.amount[0]?.pcheckFacilityCIU,
                  DSP: rate.amount[0]?.pcheckFacilityDSP,
                  PCB: rate.amount[0]?.pcheckFacilityPCB,
                },
              },
              {
                primary_prof_fee: rate.amount[1]?.pprimaryProfFee || '',
                primary_hci_fee: rate.amount[1]?.pprimaryHCIFee || '',
                primary_case_rate: rate.amount[1]?.pprimaryCaseRate || '',
                secondary_prof_fee: rate.amount[1]?.psecondaryProfFee || '',
                secondary_hci_fee: rate.amount[1]?.psecondaryHCIFee  || '',
                secondary_case_rate: rate.amount[1]?.psecondaryCaseRate  || '',
                facility_checks: {
                  H1: rate.amount[1]?.pcheckFacilityH1,
                  H2: rate.amount[1]?.pcheckFacilityH2,
                  H3: rate.amount[1]?.pcheckFacilityH3,
                  ASC: rate.amount[1]?.pcheckFacilityASC,
                  PCF: rate.amount[1]?.pcheckFacilityPCF,
                  FSDC: rate.amount[1]?.pcheckFacilityFSDC,
                  MAT: rate.amount[1]?.pcheckFacilityMAT,
                  TSEKAP: rate.amount[1]?.pcheckFacilityTSEKAP,
                  ABTC: rate.amount[1]?.pcheckFacilityABTC,
                  TBDOTSC: rate.amount[1]?.pcheckFacilityTBDOTSC,
                  OPMC: rate.amount[1]?.pcheckFacilityOPMC,
                  RHU: rate.amount[1]?.pcheckFacilityRHU,
                  DATRC: rate.amount[1]?.pcheckFacilityDATRC,
                  HIVTH: rate.amount[1]?.pcheckFacilityHIVTH,
                  FPC: rate.amount[1]?.pcheckFacilityFPC,
                  CIU: rate.amount[1]?.pcheckFacilityCIU,
                  DSP: rate.amount[1]?.pcheckFacilityDSP,
                  PCB: rate.amount[1]?.pcheckFacilityPCB,
                },
              },
            ],
          };
        });
      }
    },

    async searchCaseRateForCPT(cpt_code){
      this.case_rate_result = [];
      this.search_case_rate_loading = true
      let response = await this.$services.getEclaimsWebService({
          request_key: "SCRM",
          provider_code: 'EKDF21B239E8232403',
          data: {
            icdcode: "",
            rvscode: cpt_code,
            description: "",
            targetdate: ""
          }
      })
      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

        this.search_case_rate_loading = false
        this.on_load = false
        this.show_table = true
        // Filter case rates where peffectivityEndDate includes "9999"
        const case_rates = Array.isArray(response.data.caserates)
          ? response.data.caserates.filter(rate => rate.peffectivityEndDate.includes("9999"))
          : [];

        this.case_rate_result = case_rates.map(rate => {
          return {
            case_rate_code: rate.pcaseRateCode,
            case_rate_description: rate.pcaseRateDescription,
            icd_rvs_code: rate.pitemCode,
            item_description: rate.pitemDescription,
            effectivity_date: rate.peffectivityDate,
            effectivity_end_date: rate.peffectivityEndDate,
            amount: [
              {
                primary_prof_fee: rate.amount[0]?.pprimaryProfFee,
                primary_hci_fee: rate.amount[0]?.pprimaryHCIFee,
                primary_case_rate: rate.amount[0]?.pprimaryCaseRate,
                secondary_prof_fee: rate.amount[0]?.psecondaryProfFee,
                secondary_hci_fee: rate.amount[0]?.psecondaryHCIFee,
                secondary_case_rate: rate.amount[0]?.psecondaryCaseRate,
                facility_checks: {
                  H1: rate.amount[0]?.pcheckFacilityH1,
                  H2: rate.amount[0]?.pcheckFacilityH2,
                  H3: rate.amount[0]?.pcheckFacilityH3,
                  ASC: rate.amount[0]?.pcheckFacilityASC,
                  PCF: rate.amount[0]?.pcheckFacilityPCF,
                  FSDC: rate.amount[0]?.pcheckFacilityFSDC,
                  MAT: rate.amount[0]?.pcheckFacilityMAT,
                  TSEKAP: rate.amount[0]?.pcheckFacilityTSEKAP,
                  ABTC: rate.amount[0]?.pcheckFacilityABTC,
                  TBDOTSC: rate.amount[0]?.pcheckFacilityTBDOTSC,
                  OPMC: rate.amount[0]?.pcheckFacilityOPMC,
                  RHU: rate.amount[0]?.pcheckFacilityRHU,
                  DATRC: rate.amount[0]?.pcheckFacilityDATRC,
                  HIVTH: rate.amount[0]?.pcheckFacilityHIVTH,
                  FPC: rate.amount[0]?.pcheckFacilityFPC,
                  CIU: rate.amount[0]?.pcheckFacilityCIU,
                  DSP: rate.amount[0]?.pcheckFacilityDSP,
                  PCB: rate.amount[0]?.pcheckFacilityPCB,
                },
              },
              {
                primary_prof_fee: rate.amount[1]?.pprimaryProfFee || '',
                primary_hci_fee: rate.amount[1]?.pprimaryHCIFee || '',
                primary_case_rate: rate.amount[1]?.pprimaryCaseRate || '',
                secondary_prof_fee: rate.amount[1]?.psecondaryProfFee || '',
                secondary_hci_fee: rate.amount[1]?.psecondaryHCIFee  || '',
                secondary_case_rate: rate.amount[1]?.psecondaryCaseRate  || '',
                facility_checks: {
                  H1: rate.amount[1]?.pcheckFacilityH1,
                  H2: rate.amount[1]?.pcheckFacilityH2,
                  H3: rate.amount[1]?.pcheckFacilityH3,
                  ASC: rate.amount[1]?.pcheckFacilityASC,
                  PCF: rate.amount[1]?.pcheckFacilityPCF,
                  FSDC: rate.amount[1]?.pcheckFacilityFSDC,
                  MAT: rate.amount[1]?.pcheckFacilityMAT,
                  TSEKAP: rate.amount[1]?.pcheckFacilityTSEKAP,
                  ABTC: rate.amount[1]?.pcheckFacilityABTC,
                  TBDOTSC: rate.amount[1]?.pcheckFacilityTBDOTSC,
                  OPMC: rate.amount[1]?.pcheckFacilityOPMC,
                  RHU: rate.amount[1]?.pcheckFacilityRHU,
                  DATRC: rate.amount[1]?.pcheckFacilityDATRC,
                  HIVTH: rate.amount[1]?.pcheckFacilityHIVTH,
                  FPC: rate.amount[1]?.pcheckFacilityFPC,
                  CIU: rate.amount[1]?.pcheckFacilityCIU,
                  DSP: rate.amount[1]?.pcheckFacilityDSP,
                  PCB: rate.amount[1]?.pcheckFacilityPCB,
                },
              },
            ],
          };
        });
      }
    },

    selectCaseRateCode(cpt_code, case_rate_code) {
      this.case_rate_result = [];
      this.$set(this.selectedCaseRateCodes, cpt_code, case_rate_code); 
      let pci_diagnosis = sessionStorage.getItem('LYK56D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)  : null;

      if (pci_diagnosis) {
        let diagnosis_data = JSON.parse(pci_diagnosis);
        Object.values(diagnosis_data).forEach(category => {
          category.forEach(item => {
            item.procedure.forEach(proc => {
              if (proc.cpt_code === cpt_code) {
                proc.case_rate_code = case_rate_code;
              }
            });
          });
        });
        localStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
        sessionStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
      }
      this.showCaseRateForCPTDialog = false;
      
      this.checkDataStatus('others')
    },

    // addLaterality(cpt_code, laterality) {
    //   this.laterality = {};
    //   this.$set( this.laterality, cpt_code, laterality); 
    //   let pci_diagnosis = sessionStorage.getItem('LYK56D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)  : null;

    //   if (pci_diagnosis) {
    //     let diagnosis_data = JSON.parse(pci_diagnosis);
    //     Object.values(diagnosis_data).forEach(category => {
    //       category.forEach(item => {
    //         item.procedure.forEach(proc => {
    //           if (proc.cpt_code === cpt_code) {
    //             proc.laterality = laterality;
    //           }
    //         });
    //       });
    //     });
    //     localStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
    //     //sessionStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
    //   }
    //   this.checkDataStatus('others')
    // },

    clearSearch() {
      this.search_description = '';
      this.search_icd_code = '';
      this.search_rvs_code = '';
      this.case_rate_result.length = '';
      this.on_load = true;
      this.show_table = false;
    },

    filteredFacilityChecks(facility_checks) {
      if (!facility_checks) return {};
      
      const exclude_keys = ['TSEKAP', 'ABTC', 'OPMC', 'RHU', 'DATRC', 'HIVTH', 'FPC', 'CIU', 'DSP', 'PCB', 'TBDOTSC', 'OTHERS'];
      
      return Object.fromEntries(
        Object.entries(facility_checks).filter(([key]) => !exclude_keys.includes(key))
      );
    },
  
    displayCheckIcon(facility_checks, key) {
      if (!facility_checks || !key) return false;
      const check_fields = ['H1', 'H2', 'H3', 'ASC', 'PCF','MAT','FSDC', 'OTHERS'];

      if (check_fields.includes(key)) {
        const value = facility_checks[key];
        return value && value.trim().toUpperCase() === 'T'; 
      }

      return false;
    },


    displayCheckIconForMultiple(facility_checks) {
      const check_fields = [
        'TSEKAP', 'ABTC', 'OPMC', 'RHU', 'DATRC', 'HIVTH', 'FPC', 'CIU', 'DSP', 'PCB'
      ];

      const has_check = check_fields.some(field => facility_checks[field] === 'T');
      return has_check;
    },

    formatDate(date) {
      if (date === '0000-00-00') return '';
      const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
    },

    formatAmount(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },

    async getEclaimsCaseRateInfo(caserate_list){
      let response = await this.$services.getEclaimsCaseRateInfo({
        provider_code: this.$store.state.prv_data.provider_code,
        caserate_list: caserate_list,
        ph_category: this.trans_detail.phic_packages
      });

      if (response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

        return response.data.caserate_data
      }
    },

    async getPatientConfinementData(){
      let pci_data = sessionStorage.getItem('OO5T6X') ? this.$crypto.AES.decrypt(sessionStorage.getItem('OO5T6X'), 'l4ros53s').toString(this.$crypto.enc.Utf8) : null
      let pci_diagnosis = sessionStorage.getItem('LYK56D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8) : null
      let patient_data = sessionStorage.getItem('ET534D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8) : null
      this.patient_data = JSON.parse(patient_data)

      if(this.trans_detail.editable && this.trans_detail.transaction_type === 'INPATIENT' && this.$store.state.icd_list.length === 0){
        this.$store.commit('set_loading_icd', true)
        this.$store.commit('set_loading_cpt', true)
        this.getICDList();
      }else{
        this.$store.commit('set_loading_icd', false)
        this.$store.commit('set_loading_cpt', false)
      }

      if(pci_data === null){
        let response = await this.$services.getEclaims({
              request_key: 'patient_confinement',
              provider_code: this.$store.state.prv_data.provider_code,
              ek_lgu_id: this.trans_detail.ek_lgu_id,
              transaction_number: this.trans_detail.transaction_number,
              migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
              claim_no: this.trans_detail.claim_no,
              ph_category: this.trans_detail.phic_packages
              // provider_code:'EK8BE7221CB09A2221',
              // ek_lgu_id:'EK-NRF3U1999H518-2635',
              // transaction_number:'HEY412FD5WKB'
        });

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          let pat_data = response.data.PATIENT_DATA
          const ob_gyne = response.data.OB_GYNE
          
          this.pci_data = {
            section1: pat_data.chief_complaint,

            section2: {
              time_admitted: pat_data.time_admitted,
              time_discharged: pat_data.time_discharged,
              period_admitted: '',
              period_discharged: '',
              date_admitted: this.date_admitted,
              date_discharged: this.date_discharged
            },

            section3: {
              illness_history: pat_data.illness_hstry,
              pertinent: {
                allergies: null,
                past_medical_history: null,
                previous_hospitalization: null,
                previous_hospitalization_date: null,
                previous_surgeries: null,
                previous_surgeries_date: null
              },
              gravidity: ob_gyne.obg_gravidity,
              parity: ob_gyne.obg_parity,
              term: ob_gyne.obg_term,
              preterm: ob_gyne.obg_preterm,
              abortions: ob_gyne.obg_abortions,
              living: ob_gyne.obg_living,
              lmp_date: pat_data.lmp ? pat_data.lmp : ''
            },

            section4: {
              is_referred: pat_data.is_referred,
              hci_reason: pat_data.reason_for_referral_admission,
              hci_name: pat_data.originating_provider, 
              hci_address: pat_data.originating_provider_address
            },

            section5: {
              status: pat_data.patient_disposition ? pat_data.patient_disposition : '',
              expired: {
                date_date: pat_data.disposition_expiration_date,
                date: pat_data.disposition_expiration_date === 'NA' ? '' : this.formatDate(pat_data.disposition_expiration_date),
                time: pat_data.disposition_expiration_time === 'NA' ? '' : this.convertTime(pat_data.disposition_expiration_time),
                period: ''
              },
              transfer: {
                hci_name: pat_data.referral_prov,
                hci_address: pat_data.referral_prov_address,
                hci_reason: pat_data.reason_for_referral_discharged
              }
            },

            section6: pat_data.type_of_accommodation,

            section7: response.data.ADMISSION_DIAGNOSIS,

            section9: {
              phic_patient_case_rate_id: response.data.FIRST_CASE_RATES?.phic_patient_case_rate_id ?? '',
              first_case_rate_tag: 'NEW',
              first_case_hci_fee: response.data.FIRST_CASE_RATES?.first_case_hci_fee ?? '',
              first_case_pf_fee: response.data.FIRST_CASE_RATES?.first_case_professional_fee ?? '',
              first_case_code: response.data.FIRST_CASE_RATES?.first_case_rate_code ?? '',
              first_case_desc: response.data.FIRST_CASE_RATES?.first_case_rate_description ?? '',
              first_case_rate: response.data.FIRST_CASE_RATES?.first_case_rate ?? '',

              second_case_rate_tag: 'NEW',
              second_case_hci_fee: response.data.SECOND_CASE_RATES?.second_case_hci_fee ?? '',
              second_case_pf_fee: response.data.SECOND_CASE_RATES?.second_case_professional_fee ?? '',
              second_case_code: response.data.SECOND_CASE_RATES?.second_case_rate_code ?? '',
              second_case_desc: response.data.SECOND_CASE_RATES?.second_case_rate_description ?? '',
              second_case_rate: response.data.SECOND_CASE_RATES?.second_case_rate ?? ''
            },

            section10: response.data.SYMPTOMS,

            section11: {
              ntp_card_no: pat_data.ntp_card_no ? pat_data.ntp_card_no : '',
              b: pat_data.z_benefit,
              c: {
                mcp_package_date1: pat_data.mcp_package_date1 ? this.formatDate(pat_data.mcp_package_date1) : undefined,
                mcp_package_date2: pat_data.mcp_package_date2 ? this.formatDate(pat_data.mcp_package_date2) : undefined,
                mcp_package_date3: pat_data.mcp_package_date3 ? this.formatDate(pat_data.mcp_package_date3) : undefined,
                mcp_package_date4: pat_data.mcp_package_date4 ? this.formatDate(pat_data.mcp_package_date4) : undefined
              },
              d: pat_data.tb_dots,
              e: {
                day_0_arv: response.data.ANIMAL_BITES.animal_bite_day_0_arv ? this.formatDate(response.data.ANIMAL_BITES.animal_bite_day_0_arv) : '',
                day_3_arv: response.data.ANIMAL_BITES.animal_bite_day_3_arv ? this.formatDate(response.data.ANIMAL_BITES.animal_bite_day_3_arv) : '',
                day_7_arv: response.data.ANIMAL_BITES.animal_bite_day_7_arv ? this.formatDate(response.data.ANIMAL_BITES.animal_bite_day_7_arv) : '',
                day_rig_arv: response.data.ANIMAL_BITES.animal_bite_rig ? this.formatDate(response.data.ANIMAL_BITES.animal_bite_rig) : '',
                day_others_arv: response.data.ANIMAL_BITES.animal_bite_others ? this.formatDate(response.data.ANIMAL_BITES.animal_bite_others) : null,
                specify_others_arv: response.data.ANIMAL_BITES.animal_bite_others_specify ? response.data.ANIMAL_BITES.animal_bite_others_specify : null
              },
              f: {
                newborn_care_package: pat_data.newborn_care_package ? pat_data.newborn_care_package : [],
                filter_card_no: pat_data.filter_card_no ? pat_data.filter_card_no : '',
                essential_newborn: response.data.ESSENTIAL_NEW_BORN ? response.data.ESSENTIAL_NEW_BORN : {}
                // essential_newborn: Array.isArray(response.data.ESSENTIAL_NEW_BORN) ? response.data.ESSENTIAL_NEW_BORN : (response.data.ESSENTIAL_NEW_BORN ? [response.data.ESSENTIAL_NEW_BORN] : [])
              },
              g: pat_data.hiv_treatment_lab_no
            },

            status: {
              case_rate: false,
              admission: false,
              diagnosis: false,
              procedure: false,
              symptoms: false,
              special: false,
              animal: false,
              essential: false,
              others: false
            }
          }
          this.initializeAdmissionDiagnosis()

          this.pci_data.section2.period_admitted = this.pci_data.section2.time_admitted.substring(9)
          this.pci_data.section2.time_admitted = this.pci_data.section2.time_admitted.substring(0, 8)

          this.pci_data.section2.period_discharged = this.pci_data.section2.time_discharged.substring(9)
          this.pci_data.section2.time_discharged = this.pci_data.section2.time_discharged.substring(0, 8)

          this.pci_data.section5.expired.period = this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(9) : null
          this.pci_data.section5.expired.time = this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(0, 8) : null
          // this.pci_diagnosis = response.data.DISCHARGED_DIAGNOSIS
          // if(pci_diagnosis === null){
          //   this.pci_diagnosis = response.data.DISCHARGED_DIAGNOSIS
          //   let caserate_list = []

          //   this.pci_diagnosis.PRIMARY.forEach(el => {
          //     el.procedure.forEach(proc => {
          //       caserate_list.push({
          //         cpt_code: proc.cpt_code
          //       })
          //     })
          //   })
          //   let get_caserate = await this.getEclaimsCaseRateInfo(caserate_list)

          //   // MATCH AND UPDATE THE PROCEDURE
          //   this.pci_diagnosis.PRIMARY.forEach(entry => {
          //       entry.procedure.forEach(proc => {
          //           const matched_fee = get_caserate.find(el => el.item_code === proc.cpt_code)
          //           if (matched_fee) {
          //             proc.health_facility_fee = matched_fee.hci_fee
          //             proc.professional_fee = matched_fee.prof_fee
          //             proc.p_case_rate_code = matched_fee.caserate_code
          //           }
          //       });
          //   });

          //   localStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(this.pci_diagnosis), 'XLgopi4x'))
          // }
          if (pci_diagnosis === null) {
            this.pci_diagnosis = response.data.DISCHARGED_DIAGNOSIS;

            this.diagnosis_items_key.forEach(type => {
              if (this.pci_diagnosis[type]) {
                this.pci_diagnosis[type].forEach(el => {
                  this.caserate_list_items.push({
                    icd_code: el.icd_code
                  })

                  el.procedure.forEach(proc => {
                    this.caserate_list_items.push({
                      cpt_code: proc.cpt_code
                    });
                  });
                });
              }
            })

            await this.updateCertificationData()

            this.diagnosis_items_key.forEach(type => {
              if (this.pci_diagnosis[type]) {
                this.pci_diagnosis[type].forEach((entry, index) => {
                  const matched = this.icd_list.find(item => item.icd_code === entry.icd_code);
                  if (matched) {
                    entry.icd_description = matched.icd_description;
                    this.$set(this.selected_icd, `${type}_${index}`, matched); 
                  }
                });
              }
            });

            localStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(this.pci_diagnosis), 'XLgopi4x'));
          } else{
            this.pci_diagnosis = JSON.parse(pci_diagnosis)
          }

          this.pci_data.section10.forEach(element => {
            this.selected_symptom.push(element.symptoms_id)
          })
          
          // this.pci_data.section11.f.essential_newborn.forEach(element => {
          //   if(element.status !== ''){
          //     this.selected_essential.push(element.status)
          //   }
          // })

          const essential_data = this.pci_data.section11.f.essential_newborn;
          for (const [key, value] of Object.entries(essential_data)) {
            if (value === 'Y') {
              this.selected_essential.push(key);
            }
          }

          await this.getPastMedicalHistory();

        } else {
          this.alert = response.error;
        }

      } else {
        this.pci_data = JSON.parse(pci_data)
        
        this.pci_diagnosis = JSON.parse(pci_diagnosis)

        // this.pci_diagnosis.data.forEach(element => {
        //   this.selected_icd.push(element.icd_code)
        // })
        this.initializeAdmissionDiagnosis()
        this.pci_data.section10.forEach(element => {
          this.selected_symptom.push(element.symptoms_id)
        })

        // this.selected_essential =this.pci_data.section11.f.essential_newborn.filter(item => item.item_value === "Y").map(item => item.key_name);
        this.selected_essential = Object.entries(this.pci_data.section11.f.essential_newborn).filter(entry => entry[1] === "Y").map(entry => entry[0]);

        this.$store.commit('set_loading_category', false)

        if(this.trans_detail.editable){
          let patient_data = sessionStorage.getItem('ET534D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('ET534D'), 'fgXSd45d').toString(this.$crypto.enc.Utf8) : null
          this.patient_data = JSON.parse(patient_data)
          if(this.pci_data.section3.pertinent.past_medical_history.length !== 0){
            //this.getSymptoms();
            await this.getProviderList();
            this.selected_past_history = this.pci_data.section3.pertinent.past_medical_history.map(element => {
                if (element.past_medical_history.substring(0, 7) === 'Others-') {
                    element.past_medical_history = 'Others: ' + element.past_medical_history.substring(7)
                }

                return {
                    code: element.mdisease_code,
                    description: element.past_medical_history
                }
                
            })
          }else{
            await this.getPastMedicalHistory();
          }
        }else{
          //this.getSymptoms();
          this.loading_provider_list = false
          this.loading_case_rate1 = false
          this.loading_case_rate2 = false
          this.loading_symptoms = false
        }
      }
    },

    async updateCertificationData(){
      let get_caserate = await this.getEclaimsCaseRateInfo(this.caserate_list_items);

      const primary_icd_codes = this.pci_diagnosis.PRIMARY.map(d => d.icd_code);

      // STEP 1: FIND THE PRIMARY ICD CASE RATE WITH A VALID AMOUNT
      let primary_matched_code = null;

      for (const rate of get_caserate) {
        if (
          primary_icd_codes.includes(rate.case_rate_code) &&
          parseFloat(rate.caserate_amount || "0") > 0
        ) {
          primary_matched_code = rate.case_rate_code;
          break;
        }
      }

      // STEP 2: FALLBACK IF NO VALID PRIMARY ICD FOUND
      if (!primary_matched_code) {
        const fallack_rate = get_caserate.find(rate =>
          parseFloat(rate.caserate_amount || "0") > 0
        );
        if (fallack_rate) {
          primary_matched_code = fallack_rate.case_rate_code;
        }
      }

      const matched_case_rates = get_caserate.map(rate => {
        const is_primary = rate.case_rate_code === primary_matched_code;
        return {
          item_code: rate.case_rate_code,
          case_rate_code: rate.caserate_code,
          effectivity_date: rate.effectivity_date,
          case_rate_items: is_primary ? "1" : "2",
          caserate_tag: rate.caserate_tag,
          professional_fee: rate.prof_fee ? rate.prof_fee : '0.00',
          health_facility_fee: rate.hci_fee ? rate.hci_fee : '0.00',
          total_case_rate_amount: rate.caserate_amount,
          eclaim_item_code: rate.eclaim_item_code
        };
      });

      matched_case_rates.forEach(item => {
        const prof_fee = parseFloat(item.professional_fee || "0");
        const hci_fee = parseFloat(item.health_facility_fee || "0");

        this.cert_total_health_facility_fee += hci_fee 
        this.cert_total_professional_fee += prof_fee
      });

      this.cert_grand_total = this.cert_total_health_facility_fee + this.cert_total_professional_fee;

      // Create a lookup for quick access to case rates by case_rate_code
      const case_rate_lookup = {};
      get_caserate.forEach(rate => {

        case_rate_lookup[rate.case_rate_code] = {
          caserate_code: rate.caserate_code,
          prof_fee: rate.prof_fee ? rate.prof_fee : '0.00',
          hci_fee: rate.hci_fee ? rate.hci_fee : '0.00',
          caserate_tag: rate.caserate_tag || '',
          ...(rate.eclaim_item_code ? { eclaim_item_code: rate.eclaim_item_code } : undefined),
          // eclaims_item_code: rate.eclaim_item_code
        }; // ONLY STORE THE CASERATE_CODE

      });

      // LOOP OVER EACH DIAGNOSIS TYPE
      this.diagnosis_items_key.forEach(section => {
        if (!this.pci_diagnosis[section]) return;

        this.pci_diagnosis[section].forEach(element => {
          // MATCH ICD CODE TO SET CASE_RATE_CODE, OR SET AS EMPTY STRING IF NO MATCH

          element.case_rate_code = case_rate_lookup[element.icd_code].caserate_code || "";
          element.prof_fee = case_rate_lookup[element.icd_code].prof_fee || '0.00'
          element.hci_fee = case_rate_lookup[element.icd_code].hci_fee || '0.00'
          element.caserate_tag = case_rate_lookup[element.icd_code].caserate_tag || ''
          // MATCH CPT CODE IN PROCEDURES
          if (Array.isArray(element.procedure)) {
            element.procedure.forEach(proc => {
              proc.case_rate_code = case_rate_lookup[proc.cpt_code].caserate_code || "";
              proc.prof_fee = case_rate_lookup[proc.cpt_code].prof_fee || '0.00'
              proc.hci_fee = case_rate_lookup[proc.cpt_code].hci_fee || '0.00',
              proc.caserate_tag = case_rate_lookup[proc.cpt_code].caserate_tag || '',
              proc.eclaims_code = {
                item_code: case_rate_lookup[proc.cpt_code].eclaim_item_code.length === 1 ? case_rate_lookup[proc.cpt_code].eclaim_item_code[0].item_code : '',
                item_desc: case_rate_lookup[proc.cpt_code].eclaim_item_code.length === 1 ? case_rate_lookup[proc.cpt_code].eclaim_item_code[0].item_desc : ''
              }
              // if(case_rate_lookup[proc.cpt_code].eclaim_item_code.length === 1){
              //   proc.eclaims_code = {
              //     item_code: case_rate_lookup[proc.cpt_code].eclaim_item_code[0].item_code,
              //     item_desc: case_rate_lookup[proc.cpt_code].eclaim_item_code[0].item_desc
              //   }
              // } else {
              //   proc.eclaims_code = {
              //     item_code: '',
              //     item_desc: ''
              //   }
              // }

              proc.eclaim_item_code = case_rate_lookup[proc.cpt_code].eclaim_item_code

              // CLEAN UP OPTIONAL FIELDS IF PRESENT
              delete proc.case_rate;
              delete proc.professional_fee;
              delete proc.health_facility_fee;
            });
          }

          // CLEAN UP OPTIONAL FIELDS AT DIAGNOSIS LEVEL
          delete element.case_rate;
          delete element.professional_fee;
          delete element.health_facility_fee;
        });
      });

      this.computeGrandTotalCert()
    },

    computeGrandTotalCert(){
      let ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8))

      ctf_data = {
        ...ctf_data,
        total_health_inst_fees: this.cert_total_health_facility_fee.toFixed(2),
        total_professional_fees: this.cert_total_professional_fee.toFixed(2),
        grand_total: this.cert_grand_total.toFixed(2)
      }

      sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
    },

    // GET PAST MEDICAL HISTORY
    async getPastMedicalHistory(){

      let response = await this.$services.getPatientMedicalHistory({
          hmo_policy_number: this.trans_detail.hmo_policy_number,
          hmo_host_code: this.trans_detail.hmo_host_code,
          lgu_host_code: this.trans_detail.lgu_host_code,
          phic_host_code: this.trans_detail.phic_host_code,
          ek_phic_id: this.patient_data.pat_ek_phic_id,
          ek_lgu_id: this.trans_detail.ek_lgu_id,
          transaction: 'previous',
          mem_phic_pin: this.patient_data.pat_pin
      });

      if (response.status === 200){
        response.data = this.responseDataDecryption(response.data)
        
        this.pci_data.section3.pertinent.past_medical_history = response.data.emr_medical_history.length === 0 ? [] : response.data.emr_medical_history.past_medical_history
        this.pci_data.section3.pertinent.allergies = response.data.emr_medical_history.allergies
        this.pci_data.section3.pertinent.previous_hospitalization = response.data.emr_medical_history.previous_hospitalization
        this.pci_data.section3.pertinent.previous_hospitalization_date = this.formatDate(response.data.emr_medical_history.previous_hospitalization_date)
        this.pci_data.section3.pertinent.previous_surgeries = response.data.emr_medical_history.previous_surgeries
        this.pci_data.section3.pertinent.previous_surgeries_date = this.formatDate(response.data.emr_medical_history.previous_surgeries_date)

        if(response.data.emr_medical_history.length !== 0){
          this.selected_past_history = this.pci_data.section3.pertinent.past_medical_history.map(element => {
              if (element.past_medical_history.substring(0, 7) === 'Others-') {
                  element.past_medical_history = 'Others: ' + element.past_medical_history.substring(7)
              }
  
              return {
                  code: element.mdisease_code,
                  description: element.past_medical_history
              }
          })
        }else{
         this.selected_past_history = []
        }

        this.saveData();
        //this.getSymptoms();
        this.$store.commit('set_loading_category', false)
        
        if(this.trans_detail.editable){
          this.getProviderList();
        }else{
          this.loading_provider_list = false
          this.loading_case_rate1 = false
          this.loading_case_rate2 = false
          this.loading_symptoms = false
        }
      } else{
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      }
    },

    // OTHER PAST MEDICAL HISTORY
    otherPastMedical() {
          let index = null
  
          this[this.others.section].forEach((element, i) => {
              if (element.description.substring(0, 6) === 'Others') index = i
          })

          if (index) {
              this[this.others.section][index].description = 'Others: ' + this.others.new
          } else {
              this[this.others.section].push({
                  code: '998',
                  description: 'Others: ' + this.others.new
              })
          }

          this.others.dialog = false
          let new_past_medical_history = this.selected_past_history.map(data => ({
            mdisease_code: data.code,
            past_medical_history: data.description
          }))

          this.pci_data.section3.pertinent.past_medical_history = new_past_medical_history
          this.checkDataStatus('emr_mh');

    },

    addPastHistory(data) {
      if (data) {
          const map = data.map(element => element.description)
          const index = this.selected_past_history.length - 1

          if (map.includes('Others')) {
              this.others.new = ''
              this.others.current = ''

              this.selected_past_history.forEach(element => {
                  if (element.description.substring(0, 7) === 'Others:') {
                      this.others.current = element.description.substring(8)
                  }
              })

              this.selected_past_history.splice(index, 1)
              this.others.section = 'selected_past_history'
              this.others.dialog = true
          } else {
              if (!this.selected_past_history[index]?.code) {
                  this.selected_past_history.splice(index, 1)
              }

              let new_past_medical_history = data.map(data => ({
                mdisease_code: data.code,
                past_medical_history: data.description
              }))

              this.pci_data.section3.pertinent.past_medical_history = new_past_medical_history
              this.checkDataStatus('emr_mh');
          }
      }
    },

    // GET SYMPTOMS
    async getSymptoms(){
      if(localStorage.getItem('DSG64O')){
        this.symptoms_items = localStorage.getItem('DSG64O') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('DSG64O'), 'loRtdf73').toString(this.$crypto.enc.Utf8)) : null
        this.loading_symptoms = false
      }else{
        let response = await this.$services.getTransactionIpRefData({
          request_key: 'phic_symptoms'
        });

        if (response.status === 200){
          //response.data = this.responseDataDecryption(response.data)
          localStorage.setItem('DSG64O', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'loRtdf73'))
          this.symptoms_items = response.data
          this.loading_symptoms = false
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // GET PROVIDER LIST
    async getProviderList(){ 
      if(localStorage.getItem('KFH45P')){
        this.provider_list_items = JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('KFH45P'), 'Gl53k9sE').toString(this.$crypto.enc.Utf8));
        this.provider_list_items = Array.isArray(this.provider_list_items) ? this.provider_list_items : [];
        this.loading_provider_list = false

        if(this.$store.state.usr_credentials.department === 'Nurse Station'){
          this.loading_case_rate1 = false
          this.loading_case_rate2 = false
        }else{    
          // this.get1stCaseRateCode();
        }
      }else{
        let response = await this.$services.getProviderList({
            lgu_host_code: this.trans_detail.lgu_host_code    
        });

        if (response.status === 200){
          response.data = this.responseDataDecryption(response.data)
          const encrypted = this.$crypto.AES.encrypt(JSON.stringify(response.data), 'Gl53k9sE')

          if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
              const usage = estimate.usage || 0;
              const quota = estimate.quota || 0;

              if ((quota - usage) > 1024 * 50) {// estimate 50KB free space required
                localStorage.setItem('KFH45P', encrypted)
              }
            });
          } else {
            localStorage.setItem('KFH45P', encrypted)
          }

          this.provider_list_items = response.data
          this.loading_provider_list = false
          
          if(this.$store.state.usr_credentials.department === 'Nurse Station'){
            this.loading_case_rate1 = false
            this.loading_case_rate2 = false
          }else{    
            // this.get1stCaseRateCode();
          }
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // GET 1ST CASE RATE CODE
    async get1stCaseRateCode(){
      if(localStorage.getItem('PRT950')){
        this.first_case_items = localStorage.getItem('PRT950') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('PRT950'), 'xcvx3Rds').toString(this.$crypto.enc.Utf8)) : null
        this.loading_case_rate1 = false
        this.get2ndCaseRateCode();
      }else{
        let response = await this.$services.getTransactionIpRefData({
          request_key: 'phic_icd_first_case_rate'   
        });

        if (response.status === 200){
          const encrypted = this.$crypto.AES.encrypt(JSON.stringify(response.data), 'xcvx3Rds');

          if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
              const usage = estimate.usage || 0;
              const quota = estimate.quota || 0;

              if ((quota - usage) > 1024 * 50) { // estimate 50KB free space required
                localStorage.setItem('PRT950', encrypted);
              }
            });
          } else {
            localStorage.setItem('PRT950', encrypted);
          }

          this.first_case_items = response.data
          this.loading_case_rate1 = false
          this.get2ndCaseRateCode();
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // GET 2ND CASE RATE CODE
    async get2ndCaseRateCode(){
      if(localStorage.getItem('4DVVF6')){
        this.second_case_items = localStorage.getItem('4DVVF6') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('4DVVF6'), 'F4dsRX0g').toString(this.$crypto.enc.Utf8)) : null
        this.loading_case_rate2 = false
      }else{
        let response = await this.$services.getTransactionIpRefData({
            request_key: 'phic_icd_rvs_second_case_rate'  
        });

        if (response.status === 200){
          const encrypted = this.$crypto.AES.encrypt(JSON.stringify(response.data), 'F4dsRX0g');

          if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {// estimate 50KB free space required
              const usage = estimate.usage || 0;
              const quota = estimate.quota || 0;

              if ((quota - usage) > 1024 * 50) {
                localStorage.setItem('4DVVF6', encrypted);
              }
            });
          } else {
            localStorage.setItem('4DVVF6', encrypted);
          }

          this.second_case_items = response.data
          this.loading_case_rate2 = false
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // GET ICD LIST
    // async getICDList(){
    //   if(this.trans_detail.transaction_type === 'INPATIENT'){
    //     await this.$store.dispatch('getICDList', {
    //       request_key: 'icd'
    //     })

    //     this.getCPTList();
    //   }
    // },

    // GET CPT LST
    // getCPTList(){
    //   this.$store.dispatch('getCPTList', {
    //     selection_type: 'phic_hmo_ip'
    //   })
    // },

    // DISPLAY RVS PROCEDURES
    displayRvsProcedures(){
      let rvs_procedures = []

      this.pci_diagnosis.data.forEach(icd => {
        icd.procedures.forEach(cpt => {
          if(cpt.rvs_code){
            rvs_procedures.push({
              rvs_code: cpt.rvs_code,
              rvs_description: cpt.rvs_description,
              rvs_case_rate: this.checkFormat(cpt.rvs_case_rate),
              rvs_date: cpt.date,
              rvs_laterality: cpt.laterality
            })
          }
        })
      })

      return rvs_procedures
    },
    
    // CHANGE DATE ADMITTED
    // changeDateAdmitted(data){
    //   this.checkDataStatus('others');
    //   this.check_confinement = 'admitted'
    //   this.new_admitted_value = data

    //   let array_dates = []
    //   this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
    //   this.doctors_order = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))
      
    //   // PCI
    //   if(data > this.pci_data.section5.expired.date_date && this.pci_data.section5.expired.date_date){
    //     array_dates.push({
    //       category: 'others',
    //       title: 'Patient Disposition'
    //     })
    //   }

    //   this.pci_diagnosis.data.forEach(icd => {
    //     icd.procedures.forEach((cpt, index) => {
    //       if(data > cpt.date_date){
    //         array_dates.push({
    //           index: index,
    //           category: 'pci',
    //           title: cpt.cpt_description
    //         })
    //       }
    //     })
    //   })

    //   // PEX
    //   this.pertinent_lab.data.forEach((element, index) => {
    //     if(data > element.date_of_lab_date && element.date_of_lab_date){
    //       array_dates.push({
    //         index: index,
    //         category: 'pex',
    //         title: element.description
    //       })
    //     }
    //   })

    //   // CIW
    //   this.doctors_order.data.forEach((element, index) => {
    //     if(data > element.date_date && element.date_date){
    //       array_dates.push({
    //         index: index,
    //         category: 'ciw',
    //         title: element.doctors_order
    //       })
    //     }
    //   })
      
    //   if(array_dates.length > 0){
    //     this.alert = { display: true, type: 'pci_dates', width: '800', title: 'Note that date/s listed below will be cleared since it is / they are earlier than date admission.', btn_pry_act: 'closeAlert', btn_pry_emt: 'changeDateAdmittedAndDischarged', btn_sec_act: 'closeAlert', btn_sec_emt: 'changeDateAdmittedAndDischarged', btn_sec_params: 'canceled', array_dates: array_dates }
    //   }
    // },
    changeDateAdmitted(data) {
      this.checkDataStatus('others');
      this.check_confinement = 'admitted';
      this.new_admitted_value = data;

      this.confinement_date.date_admitted = data;
      if (this.pci_data?.section2) {
        this.pci_data.section2.date_admitted = data;
      }

      let array_dates = [];
      this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
      this.doctors_order = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))

      // PCI
      if (
        this.pci_data?.section5?.expired?.date_date &&
        data > this.pci_data.section5.expired.date_date
      ) {
        array_dates.push({
          category: 'others',
          title: 'Patient Disposition'
        });
      }

      if (this.pci_diagnosis?.data?.length) {
        this.pci_diagnosis.data.forEach(icd => {
          icd.procedures?.forEach((cpt, index) => {
            if (cpt.date_date && data > cpt.date_date) {
              array_dates.push({
                index,
                category: 'pci',
                title: cpt.cpt_description
              });
            }
          });
        });
      }

      // PEX
      if (this.pertinent_lab?.data?.length) {
        this.pertinent_lab.data.forEach((element, index) => {
          if (element.date_of_lab_date && data > element.date_of_lab_date) {
            array_dates.push({
              index,
              category: 'pex',
              title: element.description
            });
          }
        });
      }

      // CIW
      if (this.doctors_order?.data?.length) {
        this.doctors_order.data.forEach((element, index) => {
          if (element.date_date && data > element.date_date) {
            array_dates.push({
              index,
              category: 'ciw',
              title: element.doctors_order
            });
          }
        });
      }

      // Show alert if there are earlier dates
      if (array_dates.length > 0) {
        this.alert = {display: true,type: 'pci_dates',width: '800',title:'Note that date/s listed below will be cleared since it is / they are earlier than date admission.',btn_pry_act: 'closeAlert',btn_pry_emt: 'changeDateAdmittedAndDischarged',btn_sec_act: 'closeAlert',btn_sec_emt: 'changeDateAdmittedAndDischarged',btn_sec_params: 'canceled',array_dates};
      }
    },

    // CHANGE DATE DISCHARGED
    // changeDateDischarged(data){
    //   this.checkDataStatus('others');
    //   this.check_confinement = 'discharged'
    //   this.new_discharged_value = data

    //   let array_dates = []
    //   this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
    //   this.doctors_order = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))

    //   // PCI
    //   if(data < this.defaultDate(this.pci_data.section5.expired.date)){
    //     array_dates.push({
    //       index: 0,
    //       category: 'others',
    //       title: 'Patient Disposition'
    //     })
    //   }

    //   this.pci_diagnosis.data.forEach(icd => {
    //     icd.procedures.forEach((cpt, index) => {
    //       if(data < cpt.date_date && cpt.date_date){
    //         array_dates.push({
    //           index: index,
    //           category: 'pci',
    //           title: cpt.cpt_description
    //         })
    //       }
    //     })
    //   })

    //   // PEX
    //   this.pertinent_lab.data.forEach((element, index) => {
    //     if(data < element.date_of_lab_date && element.date_of_lab_date){
    //       array_dates.push({
    //         index: index,
    //         category: 'pex',
    //         title: element.description
    //       })
    //     }
    //   })
      
    //   // CIW
    //   this.doctors_order.data.forEach((element, index) => {
    //     if(data < element.date_date && element.date_date){
    //       array_dates.push({
    //         index: index,
    //         category: 'ciw',
    //         title: element.doctors_order
    //       })
    //     }
    //   })

    //   if(array_dates.length > 0){
    //     this.alert = { display: true, type: 'pci_dates', width: '800', title: 'Note that date/s listed below will be cleared since it is / they are succeeding the date discharged.', btn_pry_act: 'closeAlert', btn_pry_emt: 'changeDateAdmittedAndDischarged', btn_sec_act: 'closeAlert', btn_sec_emt: 'changeDateAdmittedAndDischarged', btn_sec_params: 'canceled', array_dates: array_dates }
    //   }
    // },
    changeDateDischarged(data) {
      this.checkDataStatus('others');
      this.check_confinement = 'discharged';
      this.new_discharged_value = data;

      // 🔄 Sync discharged date with confinement_date & pci_data.section2
      this.confinement_date.date_discharged = data;
      if (this.pci_data?.section2) {
        this.pci_data.section2.date_discharged = data;
      }

      let array_dates = []
      this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
      this.doctors_order = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))

      // PCI
      if (
        this.pci_data?.section5?.expired?.date &&
        data < this.defaultDate(this.pci_data.section5.expired.date)
      ) {
        array_dates.push({
          index: 0,
          category: 'others',
          title: 'Patient Disposition'
        });
      }

      if (this.pci_diagnosis?.data?.length) {
        this.pci_diagnosis.data.forEach(icd => {
          icd.procedures?.forEach((cpt, index) => {
            if (cpt.date_date && data < cpt.date_date) {
              array_dates.push({
                index,
                category: 'pci',
                title: cpt.cpt_description
              });
            }
          });
        });
      }

      // PEX
      if (this.pertinent_lab?.data?.length) {
        this.pertinent_lab.data.forEach((element, index) => {
          if (element.date_of_lab_date && data < element.date_of_lab_date) {
            array_dates.push({
              index,
              category: 'pex',
              title: element.description
            });
          }
        });
      }

      // CIW
      if (this.doctors_order?.data?.length) {
        this.doctors_order.data.forEach((element, index) => {
          if (element.date_date && data < element.date_date) {
            array_dates.push({
              index,
              category: 'ciw',
              title: element.doctors_order
            });
          }
        });
      }

      if (array_dates.length > 0) {
        this.alert = {display: true,type: 'pci_dates',width: '800',title:'Note that date/s listed below will be cleared since it is / they are succeeding the date discharged.',btn_pry_act: 'closeAlert',btn_pry_emt: 'changeDateAdmittedAndDischarged',btn_sec_act: 'closeAlert',btn_sec_emt: 'changeDateAdmittedAndDischarged',btn_sec_params: 'canceled',array_dates};
      }
    },

    // CHANGE DATE ADMITTED AND DISCHARGED
    changeDateAdmittedAndDischarged(status){
      if(status === 'canceled'){
        if(this.check_confinement === 'admitted'){
          this.confinement_date.date_admitted = this.previous_admitted_value
        }else{
          this.confinement_date.date_discharged = this.previous_discharged_value
        }
      }else{
        if(this.new_admitted_value > this.defaultDate(this.pci_data.section5.expired.date) || this.new_discharged_value < this.defaultDate(this.pci_data.section5.expired.date)){
          this.pci_data.section5.status = ''

          this.pci_data.section5.expired.date = null
          this.pci_data.section5.expired.time = null
          this.pci_data.section5.expired.period = null
        }

        for (let i = 0; i < this.pci_diagnosis.data.length; i++){
          for(let x = this.pci_diagnosis.data[i].procedures.length -1; x >= 0 ; x--){
            if(this.new_admitted_value > this.pci_diagnosis.data[i].procedures[x].date_date || this.new_discharged_value < this.pci_diagnosis.data[i].procedures[x].date_date){
              this.class_data = {
                name: 'rvs',
                index: i,
                data: x
              }
              
              this.removeDischargedDiagnosis();
            }
          }
        }

        for(let i = this.pertinent_lab.data.length -1; i >= 0 ; i--){
          if(this.new_admitted_value > this.pertinent_lab.data[i].date_of_lab_date || this.new_discharged_value < this.pertinent_lab.data[i].date_of_lab_date){
            this.pertinent_lab.data.splice(i, 1)
            this.pertinent_lab.status = true
          }
        }

        for(let i = this.doctors_order.data.length -1; i >= 0 ; i--){
          if(this.new_admitted_value > this.doctors_order.data[i].date_date || this.new_discharged_value < this.doctors_order.data[i].date_date){
            this.doctors_order.data.splice(i, 1)
            this.doctors_order.status = true
          }
        }

        sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(this.pertinent_lab), 'Fo34S40s'))
        sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(this.doctors_order), '5s05SLFI'))
        this.checkDataStatus('others');
      }
    },
  
    // SELECT HOUR/MINUTE
    selectHourMin(section, item, value){
      if(value < 10){
        value = '0'+value
      }
      
      if(section === 'admitted'){
        if(item === 'hour'){
          this.pci_data.section2.time_admitted = value+':'+(this.pci_data.section2.time_admitted ? this.pci_data.section2.time_admitted.substring(3, 8) : '00:00')
        }else if(item === 'min'){
          this.pci_data.section2.time_admitted = (this.pci_data.section2.time_admitted ? this.pci_data.section2.time_admitted.substring(0, 2) : '01')+':'+value+':'+(this.pci_data.section2.time_admitted ? this.pci_data.section2.time_admitted.substring(6, 9) : '00')
        }else{
          this.pci_data.section2.time_admitted = (this.pci_data.section2.time_admitted ? this.pci_data.section2.time_admitted.substring(0, 5) : '01:00')+':'+value
        }
      }else if(section === 'discharged'){
        if(item === 'hour'){
          this.pci_data.section2.time_discharged = value+':'+(this.pci_data.section2.time_discharged ? this.pci_data.section2.time_discharged.substring(3, 8) : '00:00')
        }else if(item === 'min'){
          this.pci_data.section2.time_discharged = (this.pci_data.section2.time_discharged ? this.pci_data.section2.time_discharged.substring(0, 2) : '01')+':'+value+':'+(this.pci_data.section2.time_discharged ? this.pci_data.section2.time_discharged.substring(6, 9) : '00')
        }else{
          this.pci_data.section2.time_discharged = (this.pci_data.section2.time_discharged ? this.pci_data.section2.time_discharged.substring(0, 5) : '01:00')+':'+value
        }
      }else if(section === 'expired'){
        if(item === 'hour'){
          this.pci_data.section5.expired.time = value+':'+(this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(3, 8) : '00:00')
        }else if(item === 'min'){
          this.pci_data.section5.expired.time = (this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(0, 2) : '01')+':'+value+':'+(this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(6, 9) : '00')
        }else{
          this.pci_data.section5.expired.time = (this.pci_data.section5.expired.time ? this.pci_data.section5.expired.time.substring(0, 5) : '01:00')+':'+value
        }
      }

      this.checkDataStatus('others')
    },

    // AUTO-FILL SELECTED PROVIDER FOR TRANSFERED/REFERRED
    selectedProvider(item){
      this.pci_data.section5.transfer.hci_address = item.location
      this.checkDataStatus('others');
    },
    
    // ADD DISCHARGED DIAGNOSIS
    // addDischargedDiagnosis(){
    //   this.pci_diagnosis.data.push({
    //     transaction_cpt_no: null,
    //     icd_tag: 'NEW',
    //     icd_code: null,
    //     icd_description: null,
    //     procedures: [],
    //     old_procedures: []
    //   })
    // },

    // CHECK IF ICD EXIST IN CASE_RATES
    async checkICDCaseRate(index, item){
      if(index < 2){
        this.pci_diagnosis.data[index].loading = true

        if(this.pci_diagnosis.data[index].transaction_cpt_no && !this.pci_diagnosis.data[index].with_old_data){
          let old_icd_data = JSON.parse(JSON.stringify(this.pci_diagnosis.data[index]))
          let cpt = old_icd_data.procedures.length

          while(cpt--){
            if(old_icd_data.procedures[cpt].transaction_cpt_no){
              old_icd_data.procedures[cpt].cpt_tag = 'OLD'
              old_icd_data.procedures[cpt].transaction_cpt_no = undefined
            }else{
              old_icd_data.procedures.splice(cpt, 1)
            }
          }

          old_icd_data.icd_tag = 'OLD'
          old_icd_data.transaction_cpt_no = undefined
          this.pci_diagnosis.old_data.push(old_icd_data)
          this.pci_diagnosis.data[index].with_old_data = true
        }

        let primary_secondary = sessionStorage.getItem('lDsjrkd') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('lDsjrkd'), 'pfdFxg44').toString(this.$crypto.enc.Utf8)) : null

        let response = await this.$services.getTransactionSobIcdCaseRates ({
            request_type: 'modify_pci',
            icd_code: item.icd_code,
            ek_phic_id: this.patient_data.pat_ek_phic_id,
            hmo_host_code: this.trans_detail.hmo_host_code,
            hmo_policy_number: this.patient_data.mem_hmo_data.mem_hmo_policy_number,
            ...(this.patient_data.pat_ek_phic_id ? undefined : {
              first_name: this.patient_data.pat_fname,
              middle_name: this.patient_data.pat_mname,
              last_name: this.patient_data.pat_lname,
              suffix: this.patient_data.pat_suffix,
              birthday: this.patient_data.pat_birthday
            }) 
        });

        if (response.status === 200){
          response.data = this.responseDataDecryption(response.data)
          if(response.data.confinement === 'VALID' || primary_secondary.includes(item.icd_code)){
            this.pci_diagnosis.data[index].within_90_days = false
            
            if(index === 0 && response.data.case_rates.first_case_rate_code){
              this.pci_data.section9.first_case_rate_tag = 'NEW'
              this.pci_data.section9.first_case_pf_fee = response.data.case_rates.first_case_rate_pf+'.00'
              this.pci_data.section9.first_case_hci_fee = response.data.case_rates.first_case_rate_hci+'.00'
              this.pci_data.section9.first_case_code = response.data.case_rates.first_case_rate_code
              this.pci_data.section9.first_case_rate = response.data.case_rates.first_case_rate+'.00'
              this.pci_data.section9.first_case_desc = response.data.case_rates.first_case_rate_description
      
              this.pci_data.status.case_rate = true
              this.pci_diagnosis.data[index].phic_icd_status = 'COVERED'
            }else if(index === 1 && response.data.case_rates.second_case_rate_code){
              this.pci_data.section9.second_case_rate_tag = 'NEW'
              this.pci_data.section9.second_case_pf_fee = response.data.case_rates.second_case_rate_pf+'.00'
              this.pci_data.section9.second_case_hci_fee = response.data.case_rates.second_case_rate_hci+'.00'
              this.pci_data.section9.second_case_code = response.data.case_rates.second_case_rate_code
              this.pci_data.section9.second_case_rate = response.data.case_rates.second_case_rate+'.00'
              this.pci_data.section9.second_case_desc = response.data.case_rates.second_case_rate_description
  
              this.pci_data.status.case_rate = true
              this.pci_diagnosis.data[index].phic_icd_status = 'COVERED'
            }else{
              this.pci_diagnosis.data[index].phic_icd_status = 'NOT COVERED'
            }
          }else{
            this.pci_diagnosis.data[index].within_90_days = true
          }
          
          this.pci_diagnosis.data[index].icd_code = item.icd_code
          this.pci_diagnosis.data[index].icd_description = item.icd_description
          this.pci_diagnosis.status = true

          this.selected_icd = []
          this.within_90_days = ''

          this.pci_diagnosis.data.forEach(element => {
            if(element.within_90_days){
              this.within_90_days = 'within_90_days'
            }
            
            this.selected_icd.push(element.icd_code)
          })

          this.pci_diagnosis.data[index].loading = false

          this.checkDataStatus();
          this.saveData();
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }else{
        this.pci_diagnosis.data[index].icd_code = item.icd_code
        this.pci_diagnosis.data[index].icd_description = item.icd_description
        this.pci_diagnosis.data[index].phic_icd_status = null
        this.pci_diagnosis.status = true

        this.selected_icd = []

        this.pci_diagnosis.data.forEach(element => {
          this.selected_icd.push(element.icd_code)
        })

        this.checkDataStatus();
        this.saveData();
      }
    },

    // ADD DISCHARGED DIAGNOSIS PROCEDURE
    // addProcedure(event, index){
    //   if(event.rvs_code){
    //     this.$axios.post(this.$tms_url+'resources/api/_get_transaction_sob_cpt_rvs.php', this.$qs.stringify({
    //       post_data: this.wsDataEncryption(JSON.stringify({
    //         selection_type: this.trans_detail.transaction_type === 'OUTPATIENT' ? 'phic_hmo_op' : 'phic_hmo_ip',
    //         provider_code: this.$store.state.prv_data.provider_code,
    //         provider_tin: this.$store.state.prv_data.provider_tin,
    //         plan_code: this.patient_data.mem_hmo_data.mem_plan_code ? this.patient_data.mem_hmo_data.mem_plan_code : null,
    //         hmo_host_code: this.trans_detail.hmo_host_code,
    //         cpt_code: event.cpt_code,
    //         rvs_code: event.rvs_code ? event.rvs_code : undefined,
    //         rvs_category: event.rvs_category ? event.rvs_category : undefined
    //       }))
    //     }))
    //     .then(response => {
    //       response.data = this.responseDataDecryption(response.data)
    //       this.pci_diagnosis.data[index].procedures.push({
    //         cpt_is_new: true,
    //         cpt_code: event.cpt_code,
    //         cpt_description: event.cpt_description,
    //         cpt_amount: '0.00',
    //         cpt_tag: 'NEW',
  
    //         rvs_code: response.data.rvs_code,
    //         rvs_description: response.data.rvs_description,
    //         rvs_case_rate: response.data.rvs_rate,
    //         rvs_hci_fee: response.data.rvs_hci_fee,
    //         rvs_professional_fee: response.data.rvs_professional_fee,
    //         category: response.data.rvs_category,
    //         laterality:  response.data.laterality,
    //         date: response.data.date
    //       })
  
    //       this.selected_procedure = {}
    //       this.checkDataStatus('procedure');
    //       this.saveData();
    //     })
    //     .catch(error => {
    //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again later', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //     })
    //   }else{
    //     this.pci_diagnosis.data[index].procedures.push({
    //       cpt_is_new: true,
    //       cpt_code: event.cpt_code,
    //       cpt_description: event.cpt_description,
    //       cpt_amount: '0.00',
    //       cpt_tag: 'NEW',
    //       laterality: null,
    //       date: null
    //     })

    //     this.selected_procedure = {}
    //     this.checkDataStatus('procedure');
    //     this.saveData();
    //   }
    // },

    // SELECT PROCEDURE DATE
    // selectProcedureDate(icd, cpt){
    //   this.pci_diagnosis[icd][0].procedure[cpt].date = this.formatDate(this.pci_diagnosis[icd][0].procedure[cpt].date_date)
    // },

    // CONFIRM REMOVE ADDED DIAGNOSIS
    // confirmRemoveDiagnosis(index){
    //   this.class_data = {
    //     name: 'icd',
    //     index: index
    //   }

    //   if(this.pci_diagnosis.data[index].procedures.length > 0){
    //     this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'orange', title: 'This will also remove the selected procedures', body: 'Are you sure you want to remove this?', btn_pry_txt: 'CONFIRM', btn_pry_color: 'orange', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeDischargedDiagnosis', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
    //   }else{
    //     this.removeDischargedDiagnosis();
    //   }
    // },

    // REMOVE ADDED DISCHARGED DIAGNOSIS
    // removeDischargedDiagnosis(){
    //   if(this.class_data.name === 'icd'){
    //     let icd_code_index = this.selected_icd.indexOf(this.pci_diagnosis.data[this.class_data.index].icd_code)
        
    //     if(icd_code_index > -1) { 
    //       this.selected_icd.splice(icd_code_index, 1);
    //     }

    //     if(this.pci_diagnosis.data[this.class_data.index].transaction_cpt_no){
    //       let cpt = this.pci_diagnosis.data[this.class_data.index].procedures.length
    //       while(cpt--){
    //         if(this.pci_diagnosis.data[this.class_data.index].procedures[cpt].rvs_hci_fee){
    //           this.clearCertificationData();
    //         }

    //         if(this.pci_diagnosis.data[this.class_data.index].procedures[cpt].transaction_cpt_no){
    //           this.pci_diagnosis.data[this.class_data.index].procedures[cpt].cpt_tag = 'OLD'
    //         }else{
    //           this.pci_diagnosis.data[this.class_data.index].procedures.splice(cpt, 1)
    //         }
    //       }

    //       this.pci_diagnosis.data[this.class_data.index].icd_tag = 'OLD'
    //       this.pci_diagnosis.old_data.push(this.pci_diagnosis.data[this.class_data.index])
    //     }

    //     this.pci_diagnosis.data.splice(this.class_data.index, 1)

    //     if(this.class_data.index < 2){
    //       if(this.class_data.index === 0){
    //         this.case_number = 'first'
    //         this.removeCaseRate();

    //         if(this.pci_diagnosis.data.length > 0){
    //           this.checkICDCaseRate(0, this.pci_diagnosis.data[0]);
    //         }
    //       }

    //       this.case_number = 'second'
    //       this.removeCaseRate();

    //       if(this.pci_diagnosis.data.length > 1){
    //         this.checkICDCaseRate(1, this.pci_diagnosis.data[1]);
    //       }
    //     }
    //   }else{
    //     if(this.pci_diagnosis.data[this.class_data.index].procedures[this.class_data.data].rvs_hci_fee){
    //       this.clearCertificationData();
    //     }

    //     if(this.pci_diagnosis.data[this.class_data.index].procedures[this.class_data.data].transaction_cpt_no){
    //       this.pci_diagnosis.data[this.class_data.index].procedures[this.class_data.data].cpt_tag = 'OLD'
    //       this.pci_diagnosis.data[this.class_data.index].old_procedures.push(this.pci_diagnosis.data[this.class_data.index].procedures[this.class_data.data])
    //     }
        
    //     this.pci_diagnosis.data[this.class_data.index].procedures.splice(this.class_data.data, 1)
    //   }

    //   this.checkDataStatus('procedure');
    //   this.saveData();
    // },

    // CONFIRM CHANGE RVS AMOUNT
    confirmChangeAmount(rvs_hci_fee){
      let ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))

      if(ctf_data.phic_ben_is_enough && rvs_hci_fee){
        this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'orange', title: 'Certification data will be cleared if you make these changes on the CPT Amount', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'orange', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'clearCertificationData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
      }
    },

    // CONFIRM REMOVE ADDED RVS PROCEDURE
    // confirmRemoveProcedure(index, data, rvs_hci_fee){
    //   this.class_data = {
    //     name: 'rvs',
    //     index: index,
    //     data: data
    //   }

    //   let title = 'This procedure will also be removed in Doctors Order of Course in the Ward'
    //   let ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))

    //   if(this.$store.state.usr_credentials.department === 'Credit and Collection' && ctf_data.phic_ben_is_enough && rvs_hci_fee){
    //     title = title + ' and Certification data will be cleared'
    //   }

    //   this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'orange', title: title, body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'orange', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeDischargedDiagnosis', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
    // },

    // CONFIRM CHANGE CASE RATE
    confirmChangeCaseRate(status, case_number){
      if(case_number === 'first'){
        this.current_first_case_rate = this.pci_data.section9.first_case_desc
      }else{
        this.current_second_case_rate = this.pci_data.section9.second_case_desc
      }
      
      this.case_number = case_number
      let ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))

      if(ctf_data.phic_ben_is_enough){
        document.activeElement.blur();
        if(status === 'change'){
          this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'orange', title: 'Certification data will be cleared if you make these changes on case rates', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'orange', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'clearCertificationData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        }else{
          this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'orange', title: 'Certification data will be cleared if you make these changes on case rates', body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'orange', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'removeCaseRateAndCertificationData', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
        }
      }else{
        if(status === 'clear'){
          this.removeCaseRate();
        }
      }
    },

    // REMOVE CASE RATE AND CERTIFICATION DATA
    removeCaseRateAndCertificationData(){
      this.clearCertificationData()
      this.removeCaseRate();
    },

    // CASE RATE AUTO-FILL
    caseRateAutoFill(case_number, item){
      if(case_number === 'first'){
        this.pci_data.section9.phic_patient_case_rate_id = this.pci_data.section9.phic_patient_case_rate_id ? this.pci_data.section9.phic_patient_case_rate_id : undefined
        this.pci_data.section9.first_case_rate_tag = 'NEW'
        this.pci_data.section9.first_case_pf_fee = item.professional_fee+'.00'
        this.pci_data.section9.first_case_hci_fee = item.health_care_institution_fee+'.00'
        this.pci_data.section9.first_case_code = item.icd_code
        this.pci_data.section9.first_case_rate = item.case_rate+'.00'
        this.pci_data.section9.first_case_desc = item.description
      }else{
        this.pci_data.section9.phic_patient_case_rate_id = this.pci_data.section9.phic_patient_case_rate_id ? this.pci_data.section9.phic_patient_case_rate_id : undefined
        this.pci_data.section9.second_case_rate_tag = 'NEW'
        this.pci_data.section9.second_case_pf_fee = item.professional_fee+'.00'
        this.pci_data.section9.second_case_hci_fee = item.health_care_institution_fee+'.00'
        this.pci_data.section9.second_case_code = item.icd_rvs_code
        this.pci_data.section9.second_case_rate = item.case_rate+'.00'
        this.pci_data.section9.second_case_desc = item.description
      }

      this.pci_data.status.case_rate = true
      this.$emit('change-status')
      this.saveData();
    },

    // REMOVE CASE RATE
    removeCaseRate(){
      if(this.case_number === 'first'){
        if(!this.pci_data.section9.phic_patient_case_rate_id){
          this.pci_data.section9.first_case_code = null
          this.pci_data.section9.first_case_desc = null
        }
        
        this.pci_data.section9.first_case_rate_tag = 'OLD'
      }else{
        if(!this.pci_data.section9.phic_patient_case_rate_id){
          this.pci_data.section9.second_case_code = null
          this.pci_data.section9.second_case_desc = null
        }

        this.pci_data.section9.second_case_rate_tag = 'OLD'
      }

      this.pci_data.status.case_rate = true
      this.$emit('change-status')
      this.saveData();
    },

    // CLEAR CERTIFICATION DATA
    clearCertificationData(){
      let ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8))

      ctf_data.status.certification = true
      ctf_data.phic_ben_is_enough = null
      ctf_data.co_hcf_amt_after_dsct = '0.00'
      ctf_data.co_hcf_amt_after_phic_deduc = '0.00'
      ctf_data.co_hcf_total_actual_charges = '0.00'
      if(ctf_data.co_hcf_paid_by.length > 0){
          ctf_data.co_hcf_paid_by = []
          ctf_data.status.co_hcf_paid_by = true
      }

      ctf_data.co_pf_amt_after_dsct = '0.00'
      ctf_data.co_pf_amt_after_phic_deduct = '0.00'
      ctf_data.co_pf_total_actual_charges = '0.00' 
      if(ctf_data.co_pf_paid_by.length > 0){
          ctf_data.co_pf_paid_by = []
          ctf_data.status.co_pf_paid_by = true
      }

      ctf_data.nco_total_cost_diagnostic_laboratory = '0.00'
      ctf_data.nco_total_cost_med_sup = '0.00'

      let philhealth_certification = {
          co_hcf_total_actual_charges: parseFloat(ctf_data.co_hcf_total_actual_charges.toString().replace(/,/g, '')),
          co_pf_total_actual_charges:  parseFloat(ctf_data.co_pf_total_actual_charges.toString().replace(/,/g, '')),
          phic_ben_is_enough: null
      }

      sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
      sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(ctf_data), 'pfdFxg44'))
    },

    // ADD SELECTED SYMPTOMS
    addSelectedSymptom(value){
      this.pci_data.section10.push({
        symptom: value
      })
    },

    // ADD SELECTED ESSENTIAL NEWBORN CARE PACKAGE
    addSelectedEssential() {
      this.essential_items = this.essential_items.map(data => {
        data.item_value = this.selected_essential.includes(data.key_name) ? 'Y' : 'N';
        return data;
      });

      this.pci_data.section11.f.essential_newborn = this.essential_items.reduce((acc, item) => {
        if (item.key_name) {
          acc[item.key_name] = item.item_value;
        }
        return acc;
      }, {});

      this.checkDataStatus('essential');
    },
    // addSelectedEssential(){
    //   this.essential_items = this.essential_items.map(data => {
    //     if(this.selected_essential.includes(data.key_name)){
    //       data.item_value = 'Y'
    //     } else {
    //       data.item_value = 'N'
    //     }

    //     return data
    //   })

    //   this.pci_data.section11.f.essential_newborn = this.essential_items

    //   this.checkDataStatus('essential');
    // },

    // AUTO-COMMA
    autoComma(icd_index, cpt_index){
      this.pci_diagnosis.data[icd_index].procedures[cpt_index].cpt_amount = this.pci_diagnosis.data[icd_index].procedures[cpt_index].cpt_amount.toString().replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },

    // ADD DECIMAL
    addDecimal(icd_index, cpt_index){
      this.pci_diagnosis.data[icd_index].procedures[cpt_index].cpt_amount = this.checkFormat(this.pci_diagnosis.data[icd_index].procedures[cpt_index].cpt_amount)
      
      this.pci_diagnosis.status = true
      this.$emit('change-status')
    },
 
    // CONVERT THE 24 HOUR TIME FORMAT TO 12
    convertTime(value){
      if(value){
        var H = +value.substr(0, 2);
        var h = (H % 12) || 12;
        h = (h < 10) ? ("0"+h) : h;
        var ampm = H < 12 ? " AM" : " PM";
        value = h + value.substring(2, 8) + ampm
        return value
      }else{
        return null
      }
    },

    // CHECK FORMAT
    checkFormat(value){
      if(value){
        value = parseFloat(value.toString().replace(/,/g, ''))
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if(!value.includes('.')) value = value + '.00'
        
        return value
      }else{
        return '0.00'
      }
    },

    // DATE DEFAULT
    defaultDate(date){
      if (!date) return null

      const [month, day, year] = date.split('-')
      return `${year}-${month}-${day}`
    },

    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event, value){
      if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)){
        event.preventDefault();
      }
    },

    // DISPLAY COMMENT DATA
    displayCommentData(data){
      if(data === 'complaint'){
        this.comment_title = 'CHIEF COMPLAINT'
        this.comment_content = this.comment_data.cf4_part2_number5
      }
      else if(data === 'benefits'){
        this.comment_title = 'PHILHEALTH BENEFITS'
        this.comment_content = this.comment_data.cf2_part2_number9
      }
      else if(data === 'admission'){
        this.comment_title = 'ADMISSION DIAGNOSIS'
        this.comment_content = this.comment_data.cf2_part2_number6
      }
      else if(data === 'discharged'){
        this.comment_title = 'DISCHARGED DIAGNOSIS'
        this.comment_content = this.comment_data.cf2_part2_number7
      }
      else if(data === 'confinement'){
        this.comment_title = 'CONFINEMENT PERIOD'
        this.comment_content = this.comment_data.cf2_part2_number3
      }
      else if(data === 'reason'){
        this.comment_title = 'REASON FOR ADMISSION/ HISTORY OF ILLNESS'
        this.comment_content = this.comment_data.cf4_part3
      }
      else if(data === 'pertinent'){
        this.comment_title = 'PERTINENT SIGNS AND SYMPTOMS'
        this.comment_content = this.comment_data.cf4_part3_number3
      }
      else if(data === 'referred'){
        this.comment_title = 'IS PATIENT REFERRED'
        this.comment_content = this.comment_data.cf2_part2_number2
      }
      else if(data === 'disposition'){
        this.comment_title = 'PATIENT DISPOSITION'
        this.comment_content = this.comment_data.cf2_part2_number4
      }
      else if(data === 'accomodation'){
        this.comment_title = 'TYPE OF ACCOMODATION'
        this.comment_content = this.comment_data.cf2_part2_number5
      }
      else{
        this.comment_title = 'SPECIAL CONSIDERATION'
        this.comment_content = this.comment_data.cf2_part2_number8
      }
      this.comment_dialog = true
    },

    // CHECK IF DATA HAS BEEN CHANGED
    // checkDataStatus(data){
    //   if(this.trans_detail.editable){
    //     this.$emit('change-status')

    //     if(data === 'admission'){
    //       this.pci_data.status.admission = true
    //       this.empty_admission = ''
    //       // const invalid_input = (value) => {
    //       //   if (!value) return true;
    //       //   const normalized = value.trim().toLowerCase();
    //       //   const invalid = ["n/a", "none", "not applicable", "na"];
    //       //   return invalid.includes(normalized);
    //       // };

    //       this.chief_complaint = this.pci_data.section1.trim() || "";
    //       let chief_complaint_required = false;

    //       if (this.trans_detail.phic_member_eligibility_status === "Eligible") {
    //         chief_complaint_required = this.invalidInput(this.chief_complaint);

    //         if (chief_complaint_required) {
    //           this.empty_admission = 'invalid_chief_history'
    //         }
    //       }
    //     }else if(data === 'procedure'){
    //       // this.pci_diagnosis.status = true
    //       // this.empty_procedure = ''

    //       // this.pci_diagnosis.data.forEach(element => {
    //       //   element.procedures.forEach(procedure => {
    //       //     if(procedure.rvs_code){
    //       //       if(!procedure.date || !procedure.laterality){
    //       //         this.empty_procedure = 'empty'
    //       //       }
    //       //     }else{
    //       //       if(!procedure.date){
    //       //         this.empty_procedure = 'empty'
    //       //       }
    //       //     }
    //       //   })
    //       // })
    //     }else if(data === 'symptoms'){
    //       this.pci_data.status.symptoms = true
    //     }else if(data === 'animal'){
    //       this.pci_data.status.animal = true
    //     }else if(data === 'essential'){
    //       this.pci_data.status.essential = true
    //     }else if(data === 'emr_mh'){
    //       this.pci_data.status.past_medical_history = true
    //     }else if(data === 'others'){
    //       this.pci_data.status.others = true
    //       this.empty_others = ''
    //       this.invalid_time = ''
    //       this.invalid_time_range = ''
    //       // this.err_time_admitted = false
    //       // this.err_time_discharged = false
    //       // this.err_msg_time_admitted = ''
    //       // this.err_msg_time_discharged = ''

    //       // const convertToDateType = (date, time, period) => {
    //       //   const new_date = date.split('-')
    //       //   const new_time = time.split(':')

    //       //   if (new_time[0] === '12') new_time[0] = '00'
    //       //   if (period === 'PM') new_time[0] = parseInt(new_time[0], 10) + 12

    //       //   return new Date(new_date[0], new_date[1], new_date[2], new_time[0], new_time[1], new_time[2])
    //       // }

    //       // if (this.pci_data.section2.time_admitted) {
    //       //   if (this.$moment(this.pci_data.section2.time_admitted, 'hh:mm:ss', true).isValid()) {
    //       //     if (this.confinement_date.date_admitted === this.confinement_date.date_discharged) {
    //       //       const date_admitted = convertToDateType(this.confinement_date.date_admitted, this.pci_data.section2.time_admitted, this.pci_data.section2.period_admitted)
    //       //       const date_discharged = convertToDateType(this.confinement_date.date_discharged, this.pci_data.section2.time_discharged, this.pci_data.section2.period_discharged)

    //       //       if (date_admitted > date_discharged) {
    //       //         this.err_time_admitted = true 
    //       //         this.err_msg_time_admitted = 'Time admitted should be earlier than time discharged'
    //       //         this.invalid_time_range = 'invalid_time_range'
    //       //       } else {
    //       //         this.invalid_time_range = ''
    //       //       }
    //       //     }
    //       //   } else {
    //       //     this.err_time_admitted = true
    //       //     this.err_msg_time_admitted = 'Invalid Time Format'
    //       //     this.invalid_time = 'invalid_time'
    //       //   }
    //       // } else {
    //       //   this.empty_others = 'empty'
    //       // }

    //       // if (this.pci_data.section2.time_discharged) {
    //       //   if (this.$moment(this.pci_data.section2.time_discharged, 'hh:mm:ss', true).isValid()) {
    //       //     if (this.confinement_date.date_admitted === this.confinement_date.date_discharged) {
    //       //       const date_admitted = convertToDateType(this.confinement_date.date_admitted, this.pci_data.section2.time_admitted, this.pci_data.section2.period_admitted)
    //       //       const date_discharged = convertToDateType(this.confinement_date.date_discharged, this.pci_data.section2.time_discharged, this.pci_data.section2.period_discharged)

    //       //       if (date_admitted > date_discharged) {
    //       //         this.err_time_admitted = true 
    //       //         this.err_msg_time_admitted = 'Time admitted should be earlier than time discharged'
    //       //         this.invalid_time_range = 'invalid_time_range'
    //       //       } else {
    //       //         this.invalid_time_range = ''
    //       //       }
    //       //     }
    //       //   } else {
    //       //     this.err_time_discharged = true
    //       //     this.err_msg_time_discharged = 'Invalid Time Format'
    //       //     this.invalid_time = 'invalid_time'
    //       //   }
    //       // } else {
    //       //   this.empty_others = 'empty'
    //       // }

    //       // REQUIRED ILLNESS HISTORY
    //       // if(!this.pci_data.section3.illness_history || this.pci_data.section3.illness_history.trim() === ''){
    //       //   this.empty_others = 'empty'
    //       // }
    //       // const invalid_input = (value) => {
    //       //   if (!value) return true;
    //       //   const normalized = value.trim().toLowerCase();
    //       //   const invalid = ["n/a", "none", "not applicable", "na"];
    //       //   return invalid.includes(normalized);
    //       // };

    //       this.history_current_illness = this.pci_data.section3.illness_history?.trim() || "";
    //       let history_required = false;

    //       if (this.trans_detail.phic_member_eligibility_status === "Eligible") {
    //         history_required = this.invalidInput(this.history_current_illness);

    //         if (history_required) {
    //           this.empty_others = 'invalid_chief_history'
    //           // this.required = true
    //         }
    //       }

    //       // REQUIRED PAST MEDICAL HISTORY
    //       if(!this.selected_past_history || this.selected_past_history.length === 0){
    //         this.empty_others = 'empty'
    //       }

    //       this.pci_data.section5.status = !this.pci_data.section5.status ? '' : this.pci_data.section5.status[0]
    //       if(this.pci_data.section5.status === 'E'){
    //         if(!this.pci_data.section5.expired.date || !this.pci_data.section5.expired.time || !this.pci_data.section5.expired.period){
    //           this.empty_others = 'empty'
    //         }
    //         if(!this.$moment(this.pci_data.section5.expired.time, 'hh:mm:ss', true).isValid()){
    //           this.invalid_time = 'invalid_time'
    //         }
    //       }else{
    //         this.pci_data.section5.expired.date = null
    //         this.pci_data.section5.expired.time = null
    //         this.pci_data.section5.expired.period = null
    //       }

    //       if(this.pci_data.section5.status === 'T'){
    //         if(this.pci_data.section5.transfer.hci_name === '' || this.pci_data.section5.transfer.hci_address === '' || this.pci_data.section5.transfer.hci_reason === ''){
    //           this.empty_others = 'empty'
    //         }else if(this.pci_data.section5.transfer.hci_name === null || this.pci_data.section5.transfer.hci_address === null || this.pci_data.section5.transfer.hci_reason === null){
    //           this.empty_others = 'empty'
    //         }
    //       }else{
    //         this.pci_data.section5.transfer.hci_name = ''
    //         this.pci_data.section5.transfer.hci_address = ''
    //         this.pci_data.section5.transfer.hci_reason = ''
    //       }

    //       if(!this.pci_data.section11.f.newborn_care_package.includes('essential') && this.pci_data.section11.f.essential_newborn.length > 0){
    //         this.pci_data.section11.f.essential_newborn = []
    //         this.selected_essential = []
    //         this.pci_data.status.essential = true
    //       }
    //     }

    //     this.$emit('input', [this.invalid_time, this.invalid_time_range, this.empty_procedure, this.empty_others, this.empty_admission, this.within_90_days])
    //   }
    // },

    checkDataStatus(data){
      if(this.trans_detail.editable){
        this.$emit('change-status')

        this.empty_admission = ''
        this.empty_others = ''
        this.invalid_time = ''
        this.invalid_time_range = ''

        if(data === 'admission'){
          this.pci_data.status.admission = true

          this.chief_complaint = this.pci_data.section1?.trim() || "";
          let chief_complaint_required = false;

          if (this.trans_detail.phic_member_eligibility_status === "Eligible") {
            chief_complaint_required = this.invalidInput(this.chief_complaint);

            if (chief_complaint_required) {
              this.empty_admission = 'invalid_chief_history'
            }
          }
        }
        else if(data === 'procedure'){
          // this.pci_diagnosis.status = true
          // this.empty_procedure = ''

          // this.pci_diagnosis.data.forEach(element => {
          //   element.procedures.forEach(procedure => {
          //     if(procedure.rvs_code){
          //       if(!procedure.date || !procedure.laterality){
          //         this.empty_procedure = 'empty'
          //       }
          //     }else{
          //       if(!procedure.date){
          //         this.empty_procedure = 'empty'
          //       }
          //     }
          //   })
          // })
        }
        else if(data === 'symptoms'){
          this.pci_data.status.symptoms = true
        }
        else if(data === 'animal'){
          this.pci_data.status.animal = true
        }
        else if(data === 'essential'){
          this.pci_data.status.essential = true
        }
        else if(data === 'emr_mh'){
          this.pci_data.status.past_medical_history = true
        }
        else if(data === 'others'){
          this.pci_data.status.others = true

          this.history_current_illness = this.pci_data.section3.illness_history?.trim() || "";
          let history_required = false;

          if(this.trans_detail.phic_member_eligibility_status === "Eligible"){
            history_required = this.invalidInput(this.history_current_illness);
            if(history_required){
              this.empty_others ||= 'invalid_chief_history'
            }
          }

          if(!this.selected_past_history || this.selected_past_history.length === 0){
            this.empty_others ||= 'empty'
          }

          this.pci_data.section5.status = this.pci_data.section5.status?.[0] || ''

          if(this.pci_data.section5.status === 'E'){
            if(!this.pci_data.section5.expired.date || !this.pci_data.section5.expired.time || !this.pci_data.section5.expired.period){
              this.empty_others ||= 'empty'
            }
            if(!this.$moment(this.pci_data.section5.expired.time, 'hh:mm:ss', true).isValid()){
              this.invalid_time = 'invalid_time'
            }
          } else {
            this.pci_data.section5.expired.date = null
            this.pci_data.section5.expired.time = null
            this.pci_data.section5.expired.period = null
          }

          if(this.pci_data.section5.status === 'T'){
            const transfer = this.pci_data.section5.transfer
            if(!transfer.hci_name || !transfer.hci_address || !transfer.hci_reason){
              this.empty_others ||= 'empty'
            }
          } else {
            this.pci_data.section5.transfer.hci_name = ''
            this.pci_data.section5.transfer.hci_address = ''
            this.pci_data.section5.transfer.hci_reason = ''
          }
          
          if(!this.pci_data.section11.f.newborn_care_package.includes('essential') && this.pci_data.section11.f.essential_newborn.length > 0){
            this.pci_data.section11.f.essential_newborn = []
            this.selected_essential = []
            this.pci_data.status.essential = true
          }
        }

        this.$emit('input', [
          this.invalid_time,
          this.invalid_time_range,
          this.empty_procedure,
          this.empty_others,
          this.empty_admission,
          this.within_90_days
        ])
      }
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      // sessionStorage.setItem('49SFL4', this.$crypto.AES.encrypt(JSON.stringify(this.total_fees), 'FoelR42s'))
      sessionStorage.setItem('OO5T6X', this.$crypto.AES.encrypt(JSON.stringify(this.pci_data), 'l4ros53s'))
      sessionStorage.setItem('VKI55S', this.$crypto.AES.encrypt(JSON.stringify(this.confinement_date), 'flag423D'))
      sessionStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(this.pci_diagnosis), 'XLgopi4x'))
    },

    // NEW CODE FOR THIS COMPONENT
    addDischargedDiagnosis() {
      const order = ['PRIMARY', 'SECONDARY'];
      const empty_group = order.find(type => !this.pci_diagnosis[type] || this.pci_diagnosis[type].length === 0);

      if (empty_group) {
        if (!this.pci_diagnosis[empty_group]) {
          this.$set(this.pci_diagnosis, empty_group, []);
        }

        this.pci_diagnosis[empty_group].push({
          icd_code: null,
          icd_description: null,
          ph_category: null,
          procedure: []
        });
      } else {
        if (!this.pci_diagnosis['OTHER']) {
          this.$set(this.pci_diagnosis, 'OTHER', []);
        }

        this.pci_diagnosis['OTHER'].push({
          icd_code: null,
          icd_description: null,
          ph_category: null,
          procedure: []
        });
      }
    },

    onICDChange(selected_icd, group, index) {
      const item = this.pci_diagnosis[group][index];
      item.icd_code = selected_icd.icd_code;
      item.icd_description = selected_icd.icd_description;
      item.ph_category = selected_icd.ph_category
    },

    //SEARCH ITEM FOR ICD
    searchItems(value, type) {      
      clearTimeout(this.time_out);
      if(value){
        if (type === 'icd') {
          this.search_icd_items = ''
          this.time_out = setTimeout(() => {
              this.search_icd_items = value
              this.icd_current_page = 1
              this.getICDList()
              //this.$store.commit('set_loading_icd', true)
          }, 500)
        } 

        if (type === 'cpt') {
          this.search_cpt_items = ''
          this.time_out = setTimeout(() => {
              this.search_cpt_items = value
              this.cpt_current_page = 1
              this.getCPTList()
              //this.$store.commit('set_loading_cpt', true)
          }, 500)
        }
      } else {
        if (type === 'icd') { 
          this.icd_current_page = this.icd_next_page + 1
          this.search_icd_items = ''
        }

        if (type === 'cpt') { 
          this.cpt_current_page = this.cpt_next_page + 1
          this.search_cpt_items = ''
        }
      } 
    },

    async getICDList(){
      if(this.trans_detail.transaction_type === 'INPATIENT'){
        await this.$store.dispatch('getICDList', {
          request_key: 'icd',
          hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
          doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
          page: this.icd_current_page,
          search_str: this.search_icd_items
        })
      }
    },

    async getCPTList() {
      await this.$store.dispatch('getCPTList', {
        selection_type: "lgu",
        doctor_tin_no: this.$store.state.usr_credentials.doctor_tin,
        hmo_doctor_code: this.$store.state.usr_credentials.doctor_code,
        page: this.cpt_current_page,
        search_str: this.search_cpt_items
      })
    },

    loadMore(value) {
      if (value === 'icd') {
          this.icd_current_page += 1
          this.icd_next_page = this.icd_current_page
          this.getICDList()
          this.$store.commit('set_loading_icd', true)
      }

      if (value === 'cpt') {
          this.cpt_current_page += 1
          this.cpt_next_page = this.cpt_current_page
          this.getCPTList()
          this.$store.commit('set_loading_cpt', true)
      }
    },

    async addProcedure(event, group, index) {
      if (event.rvs_code) {
        this.procedure_loading = true;

        let response = await this.$services.getTransactionSobCptRvs ({
            selection_type: this.trans_detail.transaction_type === 'OUTPATIENT' ? 'phic_hmo_op' : 'phic_hmo_ip',
            provider_code: this.$store.state.prv_data.provider_code,
            provider_tin: this.$store.state.prv_data.provider_tin,
            plan_code: this.patient_data.mem_hmo_data.mem_plan_code || null,
            hmo_host_code: this.trans_detail.hmo_host_code,
            cpt_code: event.cpt_code,
            rvs_code: event.rvs_code,
            rvs_category: event.rvs_category  
        });

        if (response.status === 200){
          const data = this.responseDataDecryption(response.data);

          this.pci_diagnosis[group][index].procedure.push({
            cpt_code: event.cpt_code,
            cpt_description: event.cpt_description,
            rvs_code: data.rvs_code,
            rvs_description: data.rvs_description,
            rvs_case_rate: data.rvs_rate,
            rvs_hci_fee: data.rvs_hci_fee,
            rvs_professional_fee: data.rvs_professional_fee,
            category: data.rvs_category,
            laterality: data.laterality,
            date: data.date
          });

          this.checkDataStatus('procedure');
          this.saveData();
        } else{
          this.alert = {display: true,type: 'standard',width: '350',icon: 'mdi-alert-circle',color: 'red',title: response.error,body: 'Please try again later',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'};
        }

        this.$set(this.selected_procedure, group + '_' + index, '');
        this.procedure_loading = false;

      } else {
        const caserate_list = [{ cpt_code: event.cpt_code }];
        this.procedure_loading = true;

        this.getEclaimsCaseRateInfo(caserate_list)
          .then(caserate_data => {
            const matched = caserate_data?.find(item => item.item_code === event.cpt_code) || {};

            this.pci_diagnosis[group][index].procedure.push({
              cpt_code: event.cpt_code,
              cpt_description: event.cpt_description,
              case_rate: matched.caserate_amount,
              health_facility_fee: matched.hci_fee,
              professional_fee: matched.prof_fee,
              procedure_date: event.procedure_date,
              case_rate_code: matched.caserate_code,
              laterality: event.laterality
            });

            this.checkDataStatus('procedure');
            this.saveData();
          })
          .catch(err => {
            this.alert = {display: true,type: 'standard',width: '350',icon: 'mdi-alert-circle',color: 'red',title: err,body: 'Please try again later',btn_pry_txt: 'OK',btn_pry_color: 'primary',btn_pry_otl: false,btn_pry_act: 'reloadPage'
            };
          })
          .finally(() => {
            this.$set(this.selected_procedure, group + '_' + index, '');
            this.procedure_loading = false;
          });
      }
    },

    selectProcedureDate(group, icd, proced) {
      const item = this.pci_diagnosis[group][icd].procedure[proced];
      item.procedure_date = item.date_date;

      this.saveData()
    },

    addLaterality(cpt_code, laterality, date) {
      // this.laterality = {};
      this.$set( this.laterality, cpt_code, laterality); 
      let pci_diagnosis = sessionStorage.getItem('LYK56D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8)  : null;

      if (pci_diagnosis) {
        let diagnosis_data = JSON.parse(pci_diagnosis);

        Object.values(diagnosis_data).forEach(category => {
          if (Array.isArray(category)) {
            category.forEach(item => {
              if (item.procedure && Array.isArray(item.procedure)) {
                item.procedure.forEach(proc => {
                  if(this.trans_detail.transaction_type === 'INPATIENT'){
                    if (proc.cpt_code === cpt_code && proc.procedure_date === date) {
                      proc.laterality = laterality;
                    }
                  } else {
                    if (proc.cpt_code === cpt_code) {
                      proc.laterality = laterality;
                    }
                  }

                });
              }
            });
          }
        });

        // localStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
        // sessionStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x'))
        const encrypted = this.$crypto.AES.encrypt(JSON.stringify(diagnosis_data), 'XLgopi4x');
        sessionStorage.setItem('LYK56D', encrypted);
        localStorage.setItem('LYK56D', encrypted);
      }

      this.checkDataStatus('others');
    },

    confirmRemoveDiagnosis(diagnosis_type, index) {
      this.class_data = {
        name: 'icd',
        type: diagnosis_type,
        index: index
      };

      const diagnosis = this.pci_diagnosis[diagnosis_type]?.[index];
      if (diagnosis.procedure && diagnosis.procedure.length > 0) {
        this.alert = {display: true,type: 'standard',width: '500',icon: 'mdi-alert-circle',color: 'orange',title: 'This will also remove the selected procedures',body: 'Are you sure you want to remove this?',btn_pry_txt: 'CONFIRM',btn_pry_color: 'orange',btn_pry_otl: false,btn_pry_act: 'closeAlert',btn_pry_emt: 'removeDischargedDiagnosis',btn_sec_txt: 'CANCEL',btn_sec_color: 'grey darken-2',btn_sec_otl: true,btn_sec_act: 'closeAlert'};
      } else {
        this.removeDischargedDiagnosis();
      }
    },

    removeDischargedDiagnosis() {
      
      const { name, type, index, data } = this.class_data;
      const diagnosis_list = this.pci_diagnosis[type];

      if (!diagnosis_list || !diagnosis_list[index]) {
        console.warn('Diagnosis not found for removal:', type, index);
        return;
      }

      const diagnosis = diagnosis_list[index];

      if (name === 'icd') {
        const icd_code_index = this.selected_icd.indexOf(diagnosis.icd_code);
        if (icd_code_index > -1) {
          this.selected_icd.splice(icd_code_index, 1);
        }

        if (diagnosis.transaction_cpt_no) {
          let cpt = diagnosis.procedure?.length || 0;
          while (cpt--) {
            const proc = diagnosis.procedure[cpt];
            if (proc.rvs_hci_fee) {
              this.clearCertificationData();
            }

            if (proc.transaction_cpt_no) {
              proc.cpt_tag = 'OLD';
            } else {
              diagnosis.procedure.splice(cpt, 1);
            }
          }

          diagnosis.icd_tag = 'OLD';
          if (!this.pci_diagnosis.old_data) this.pci_diagnosis.old_data = [];
          this.pci_diagnosis.old_data.push(diagnosis);
        }

        diagnosis_list.splice(index, 1);

        if (type === 'PRIMARY' && index < 2) {
          if (index === 0) {
            this.case_number = 'first';
            this.computeGrandTotalCert()
            if (diagnosis_list.length > 0) {
              this.checkICDCaseRate(0, diagnosis_list[0]);
            }
          }

          this.case_number = 'second';
          this.computeGrandTotalCert()
          if (diagnosis_list.length > 1) {
            this.checkICDCaseRate(1, diagnosis_list[1]);
          }
        }
      }

      else if (name === 'rvs') {
        if (!diagnosis.procedure?.[data]) return;

        const procedure = diagnosis.procedure[data];

        if (procedure.rvs_hci_fee) {
          this.clearCertificationData();
        }

        if (procedure.transaction_cpt_no) {
          // Existing procedure — mark as OLD
          procedure.cpt_tag = 'OLD';
          if (!diagnosis.old_procedures) diagnosis.old_procedures = [];
          diagnosis.old_procedures.push(procedure);
        } else {
          // Newly added — remove from array
          diagnosis.procedure.splice(data, 1);
        }
      }

      this.checkDataStatus('procedure');
      this.saveData();
    },

    confirmRemoveProcedure(diagnosis_type, diagnosis_index, procedure_index, rvs_hci_fee) {
      this.class_data = {
        name: 'rvs',
        type: diagnosis_type,
        index: diagnosis_index,
        data: procedure_index
      };

      let title = 'This procedure will also be removed in Doctors Order of Course in the Ward';
      const decrypted = this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f');
      const ctf_data = JSON.parse(decrypted.toString(this.$crypto.enc.Utf8));

      if (this.$store.state.usr_credentials.department === 'Credit and Collection' && ctf_data.phic_ben_is_enough &&rvs_hci_fee) {title += ' and Certification data will be cleared';}

      this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'orange', title: title, body: 'Click OKAY to continue',btn_pry_txt: 'OKAY',btn_pry_color: 'orange',btn_pry_otl: false,btn_pry_act: 'closeAlert',btn_pry_emt: 'removeDischargedDiagnosis',btn_sec_txt: 'CANCEL',btn_sec_color: 'grey darken-2',btn_sec_otl: true,btn_sec_act: 'closeAlert'};
    },

    async onAdmissionICDChange(selected_admission_icd, index) {
      if (!selected_admission_icd) return

      const item = this.pci_data.section7[index]

      item.icd_code = selected_admission_icd.icd_code
      item.icd_description = selected_admission_icd.icd_description
      item.ph_category = selected_admission_icd.ph_category

      // kapag nasa last blank row
      if (index === this.pci_data.section7.length - 1) {

        this.pci_data.section7.push({
          icd_code: '',
          icd_description: '',
          ph_category: ''
        })

        this.selected_admission_icd.push(null)
      }
    },

    async initializeAdmissionDiagnosis() {
      if (this.trans_detail.transaction_type !== 'INPATIENT') {
        return
      }
      this.selected_admission_icd = []

      this.pci_data.section7.forEach((item, index) => {

        const matched = this.icd_list.find(icd => icd.icd_code === item.icd_code)

        this.$set(this.selected_admission_icd, index, matched || null)
      })

      // Always keep one blank row
      const last = this.pci_data.section7[this.pci_data.section7.length - 1]

      if (!last || last.icd_code) {

        this.pci_data.section7.push({
          icd_code: '',
          icd_description: '',
          ph_category: ''
        })

        this.selected_admission_icd.push(null)
      }
    },

    confirmRemoveAdmissionDiagnosis(index) {
      this.class_data = {
        index
      }
      this.removeAdmissionDiagnosis()
    },

    removeAdmissionDiagnosis() {
      const { index } = this.class_data

      this.pci_data.section7.splice(index, 1)
      this.selected_admission_icd.splice(index, 1)

      const last = this.pci_data.section7[this.pci_data.section7.length - 1]

      if (!last || last.icd_code) {

        this.pci_data.section7.push({
          icd_code: '',
          icd_description: '',
          ph_category: ''
        })

        this.selected_admission_icd.push(null)
      }
    }
  },
  
  beforeDestroy(){
    this.saveData();
  }
}
</script>

<style scoped>
table { width: 100%; }
table, th, td, tr, .legend-border { 
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
::v-deep .skeleton-loader {
  background-color: #ffffff !important;
  height: 30px !important;
  margin-bottom: 10px !important;
  border-collapse: separate; 
  border: 1px solid lightgrey; 
}
.case-rate-style {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
.case-rate-style:hover {
    background: #1565C0;
    color: white;
    font-weight: bold;
}
</style>