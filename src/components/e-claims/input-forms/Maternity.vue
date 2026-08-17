<template>
  <div>
    <v-form :readonly="!trans_detail.editable">
      <!-- PARENTAL CONSULTATION -->
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">PRENATAL CONSULTATION DATE</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number1" @click="displayCommentData('prenatal')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row align="center" wrap>
        <v-col cols="6" sm="4" md="4" lg="4">
          <label class="body-2">INITIAL PRENATAL CONSULTATION DATE</label>
        </v-col>
        <v-col cols="6" sm="8" md="8" lg="8">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section1.consultation_date" v-on="on" :clearable="trans_detail.editable" @click:clear="mat_data.section1.consultation_date_date = null" @change="checkDataStatus('others')" hide-details readonly dense></v-text-field>
            </template>
            <v-date-picker v-model="mat_data.section1.consultation_date_date" :max="date_today" @input="mat_data.section1.consultation_date = formatDate(mat_data.section1.consultation_date_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- CLINICAL HISTORY & PHYSICAL EXAMINATION -->
      <v-row class="mt-5" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">CLINICAL HISTORY & PHYSICAL EXAMINATION</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number2" @click="displayCommentData('clinical')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row align="center" class="ml-6 ml-sm-0">
        <v-col cols="12"  md="4" lg="4">
          <v-checkbox v-model="mat_data.section2.vital_sign" @change="checkDataStatus('others')" label="VITAL SIGNS ARE NORMAL" value="Y" hide-details></v-checkbox>
        </v-col>
        <v-col cols="12" sm="6" md="5" lg="5">
          <v-checkbox v-model="mat_data.section2.present_pregnancy" @change="checkDataStatus('others')" label="ASCERTAIN THE PRESENT PREGNANCY IS LOW RISK" value="Y" hide-details></v-checkbox>
        </v-col>
        <v-col cols="12" sm="12" md="3" lg="3">
          <v-text-field v-model="mat_data.section2.age_of_menarche" v-on:keypress="numberOnly" @change="checkDataStatus('others')" label="AGE OF MENARCHE" maxlength="10" onpaste="return false" hide-details></v-text-field>
        </v-col>
      </v-row>

      <!-- OBSTETRIC RISK FACTOR -->
      <v-row class="mt-5" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">OBSTETRIC RISK FACTORS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number3" @click="displayCommentData('obstetric')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-show="load_obstetric" class="text-center my-10" justify="center" wrap>
        <v-col cols="4" sm="4" md="4" lg="4">
          <v-progress-linear color="primary" height="6" indeterminate></v-progress-linear>
          <h6>Loading Selection. Please Wait...</h6>
        </v-col>
      </v-row>

      <v-row class="mt-2" wrap>
        <v-col v-for="(obstetric, i) in obstetric_risk_items" :key="i" cols="12" sm="6" md="4" lg="4">
          <v-checkbox v-model="selected_obstetric" :label="obstetric.description" :value="obstetric.key_name" @change="addSelectedObstetric(obstetric, i, $event)" class="pa-0 ma-1 ml-6" hide-details></v-checkbox>
        </v-col>
      </v-row>

      <!-- MEDICAL SURGICAL RISK FACTORS -->
      <v-row class="mt-5" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">MEDICAL SURGICAL RISK FACTORS</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number4" @click="displayCommentData('medical')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row v-show="load_medical" class="text-center my-10" justify="center" wrap>
        <v-col md4 lg4>
          <v-progress-linear color="primary" height="6" indeterminate></v-progress-linear>
          <h6>Loading Selection. Please Wait...</h6>
        </v-col>
      </v-row>
      
      <v-row class="mt-2" wrap>
        <v-col v-for="(medical, i) in medical_risk_items" :key="i" cols="12" sm="6" md="4" lg="4">
          <v-checkbox v-model="selected_medical" :label="medical.description" :value="medical.key_name" @change="addSelectedMedical(medical, i, $event)" class="pa-0 ma-1 ml-6" hide-details></v-checkbox>
        </v-col>
      </v-row>

      <!-- DELIVERY PLAN -->
      <v-row class="mt-5" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">DELIVERY PLAN</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number6" @click="displayCommentData('plan')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row class="mt-3 px-7" wrap>
        <v-col cols="12" sm="6" md="6" lg="6">
          <label class="body-2">A. ORIENTATION TO MCP</label>
          <v-btn v-if="trans_detail.editable && !!mat_data.section5.a" @click="mat_data.section5.a = ''" class="ml-2" width="60" height="25" small>Clear</v-btn>
          <v-radio-group v-model="mat_data.section5.a" @change="checkDataStatus('others')" class="mt-2 ml-4 pa-0 ma-0" row hide-details>
            <v-radio value="Yes" label="Yes"></v-radio>
            <v-radio value="No" label="No"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" class="pt-6 pt-sm-0">
          <label class="body-2">B. EXPECTED DELIVERY DATE</label>
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section5.b" v-on="on" :clearable="trans_detail.editable" @click:clear="mat_data.section5.b_date = null" @change="checkDataStatus('others')" prepend-icon="mdi-calendar" class="pa-0 ma-0 body-2" readonly hide-details></v-text-field>
            </template>
            <v-date-picker v-model="mat_data.section5.b_date" @input="mat_data.section5.b = formatDate(mat_data.section5.b_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- FOLLOW UP PRE-NATAL CONSULTATION -->
      <v-row align="baseline" class="mt-10" wrap>
        <v-col cols="12" sm="6" md="6" lg="6">
          <h1 class="section-title">FOLLOW-UP PRENATAL CONSULTATION</h1>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.editable" @click="addFollowUpConsultation" color="primary" tile small><v-icon class="pr-1" small>mdi-plus</v-icon>ADD FOLLOW-UP CONSULTATION</v-btn>
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number7" @click="displayCommentData('followup')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>

      <div class="table-overflow-x">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <th class="font-weight-medium body-2 text-uppercase"></th>
            <th class="font-weight-medium body-2 text-uppercase">Prenatal Consultation No.</th>
            <th class="font-weight-medium body-2 text-uppercase">Date of Visit</th>
            <th class="font-weight-medium body-2 text-uppercase">AOG in Weeks</th>
            <th class="font-weight-medium body-2 text-uppercase">Weight</th>
            <th class="font-weight-medium body-2 text-uppercase">Cardiac Rate</th>
            <th class="font-weight-medium body-2 text-uppercase">Respiratory Rate</th>
            <th class="font-weight-medium body-2 text-uppercase">Blood Pressure</th>
            <th class="font-weight-medium body-2 text-uppercase">Temperature</th>
            <th class="font-weight-medium body-2 text-uppercase"></th>
          </tr>
          <tr v-for="(follow, i) in mat_data.section6" :key="i">
            <td style="width: 1%; padding-top: 5px">
              <label class="body-2 black--text">{{ i+1 }})</label>
            </td>
            <td style="width: 18%">
              <v-text-field v-model="follow.prenatal_consul_no" v-on:keypress="numberOnly" @blur="checkDataStatus('follow')" class="body-2" onpaste="return false" dense hide-details></v-text-field>
            </td> 
            <td style="width: 11%">
              <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="follow.date_of_consul" v-on="on" @click:clear="mat_data.section5.b_date = null" @change="checkDataStatus('follow')" class="body-2" readonly dense hide-details></v-text-field>
                </template>
                <v-date-picker v-model="follow.date_of_consul_date" :max="date_today" @input="follow.date_of_consul= formatDate(follow.date_of_consul_date)" @change="checkDataStatus('follow')" no-title></v-date-picker>
              </v-menu>
            </td>
            <td style="width: 12%">
              <v-text-field v-model="follow.aog_in_weeks" @blur="checkDataStatus('follow')" class="body-2" dense hide-details></v-text-field>
            </td>
            <td style="width: 10%">
              <v-text-field v-model="follow.weight" @blur="checkDataStatus('follow')" class="body-2" dense hide-details></v-text-field>
            </td>
            <td style="width: 12%">
              <v-text-field v-model="follow.cardiac_rate" @blur="checkDataStatus('follow')" class="body-2" dense hide-details></v-text-field>
            </td>
            <td style="width: 13%">
              <v-text-field v-model="follow.respiratory_rate" @blur="checkDataStatus('follow')" class="body-2" dense hide-details></v-text-field>
            </td>
            <td style="width: 12%">
              <v-text-field v-model="follow.blood_pressure" @blur="checkDataStatus('follow')" class="body-2" dense hide-details></v-text-field>
            </td>
            <td style="width: 10%">
              <v-text-field v-model="follow.temperature" @blur="checkDataStatus('follow')" class="body-2" dense hide-details>
              </v-text-field>
            </td>
            <td style="width: 1%;">
              <v-icon :disabled="!trans_detail.editable" @click="removeAddedFollowUP(i)">mdi-delete</v-icon>
            </td>
          </tr>
        </table>
      </div>

      <!-- DELIVERY OUTCOME -->
      <v-row class="mt-7" wrap>
        <v-col cols="12" sm="6" md="6" lg="6">
          <h1 class="section-title">DELIVERY OUTCOME</h1>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_delivery_outcome" @click="displayCommentData('outcome')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- DATE AND TIME OF DELIVERY -->
      <v-row align="baseline" justify="end" wrap>
        <v-col cols="12" sm="4" md="4" lg="2">
          <label class="body-2">DATE OF DELIVERY</label>
        </v-col>
        <v-col cols="11" sm="8" md="8" lg="4" class="pr-1">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section7.delivery_date" v-on="on" @click:clear="mat_data.section7.delivery_date_date = null, checkDataStatus('others')" class="body-2" :clearable="trans_detail.editable" readonly></v-text-field>
            </template>
            <v-date-picker v-model="mat_data.section7.delivery_date_date" :max="date_today" @input="mat_data.section7.delivery_date = formatDate(mat_data.section7.delivery_date_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="2" class="text-lg-right pr-2">
          <label class="body-2">TIME OF DELIVERY</label>
        </v-col>
        <v-col cols="5" sm="4" md="4" lg="2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" max-height="400" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section7.delivery_time" v-mask="mask" v-on="on" :rules="[rules.time_format]" @change="checkDataStatus('others')" @click:clear="mat_data.section7.delivery_time = null, mat_data.section7.delivery_period = null, checkDataStatus('others')" class="body-2" :clearable="trans_detail.editable"></v-text-field>
            </template>
            <v-row class="text-center" wrap>
              <v-col cols="4" sm="4" md="4" lg="4" class="white">
                <h6 class="body-2 grey white--text py-1">Hour</h6>
                <v-list>
                  <v-list-item v-for="hour in 12" :key="hour" :class="{'grey' : hour === parseInt(mat_data.section7.delivery_time ? mat_data.section7.delivery_time.substring(0, 2) : null)}" @click="selectHourMin('delivery', 'hour', hour)">
                    <v-list-item-title>
                      <span v-if="hour < 10">0</span>{{ hour }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="4" sm="4" md="4" lg="4">
                <h6 class="body-2 grey white--text py-1">Min</h6>
                <v-list>
                  <v-list-item v-for="(min, index) in 60" :key="min" :class="{'grey' : index === parseInt(mat_data.section7.delivery_time ? mat_data.section7.delivery_time.substring(3, 5) : null)}" @click="selectHourMin('delivery', 'min', index)">
                    <v-list-item-title>
                      <span v-if="min < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="4" sm="4" md="4" lg="4">
                <h6 class="body-2 grey white--text py-1">Seconds</h6>
                <v-list>
                  <v-list-item v-for="(sec, index) in 60" :key="sec" :class="{'grey' : index === parseInt(mat_data.section7.delivery_time ? mat_data.section7.delivery_time.substring(6) : null)}" @click="selectHourMin('delivery', 'sec', index)">
                    <v-list-item-title>
                      <span v-if="sec < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-menu>
        </v-col>
        <v-col cols="6" sm="4" md="4" lg="2">
          <v-radio-group v-model="mat_data.section7.delivery_period" :readonly="!mat_data.section7.delivery_time" :error="required && mat_data.section7.delivery_period === null && !!mat_data.section7.delivery_time" @change="checkDataStatus('others')" class="ml-4 ma-0" dense row>
            <v-radio class="mr-2" value="AM" label="AM">AM</v-radio>
            <v-radio class="mx-2" value="PM" label="PM">PM</v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <!-- MATERNAL OUTCOME & PREGNANCY UTERINE -->
      <v-row align="baseline" class="mt-n3" wrap>
        <v-col cols="12" sm="12" md="12" lg="4">
          <v-row align="baseline" justify="end" class="my-3 my-sm-0" wrap>
            <v-col cols="12" sm="4" md="4" lg="6" class="pr-2">
              <label class="body-2">MATERNAL OUTCOME</label>
            </v-col>
            <v-col cols="11" sm="8" md="8" lg="6">
              <v-text-field v-model="mat_data.section7.maternal_outcome" @change="checkDataStatus('others')" label="Obstetric Index" class="body-2" hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="8" md="8" lg="8">
          <v-row align="baseline" justify="end" dense>
            <v-col class="text-lg-right mt-2 mt-sm-0" cols="12" sm="4" md="4" lg="3">
              <label class="body-2">PREGNANCY UTERINE</label>
            </v-col>
            <v-col cols="11" sm="8" md="2" lg="3">
              <v-text-field v-model="mat_data.section7.aog_by_lmp" @change="checkDataStatus('others')" label="AOG by LMP" class="body-2" hide-details></v-text-field>
            </v-col>
            <v-col cols="11" sm="8" md="3" lg="3">
              <v-text-field v-model="mat_data.section7.delivery_manner" @change="checkDataStatus('others')" label="Manner of Delivery" class="body-2" hide-details></v-text-field>
            </v-col>
            <v-col cols="11" sm="8" md="3" lg="3">
              <v-text-field v-model="mat_data.section7.presentation" @change="checkDataStatus('others')" label="Presentation" class="body-2" hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- BIRTHDAY OUTCOME -->
      <v-row class="mt-4 mt-sm-0" align="baseline" justify="end" dense>
        <v-col cols="12" sm="4" md="4" lg="2">
          <label class="body-2">BIRTHDAY OUTCOME</label>
        </v-col>
        <v-col cols="11" sm="8" md="2" lg="3">
          <v-text-field v-model="mat_data.section7.fetal_outcome" @change="checkDataStatus('others')" label="Fetal Outcome" hide-details></v-text-field>
        </v-col>
        <v-col cols="11" sm="8" md="2" lg="3">
          <v-text-field v-model="mat_data.section7.sex" @change="checkDataStatus('others')" label="Sex" hide-details></v-text-field>
        </v-col>
        <v-col cols="11" sm="8" md="2" lg="2">
          <v-text-field v-model="mat_data.section7.birth_weight" @change="checkDataStatus('others')" label="Birth Weight" hide-details></v-text-field>
        </v-col>
        <v-col cols="11" sm="8" md="2" lg="2">
          <v-text-field v-model="mat_data.section7.apgar_score" @change="checkDataStatus('others')" label="APGAR Score" hide-details></v-text-field>
        </v-col>
      </v-row>

      <!-- DATE AND TIME DISCHARGE -->
      <v-row align="baseline" justify="end" wrap>
        <v-col cols="12" sm="4" md="4" lg="2" class="pt-5">
          <label class="body-2">DATE DISCHARGED</label>
        </v-col>
        <v-col cols="11" sm="8" md="8" lg="4" class="pr-2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section7.discharged_date" v-on="on" @click:clear="mat_data.section7.discharged_date_date = null, checkDataStatus('others')" class="body-2" :clearable="trans_detail.editable" hide-details readonly></v-text-field>
            </template>
            <v-date-picker v-model="mat_data.section7.discharged_date_date" :max="date_today" @input="mat_data.section7.discharged_date = formatDate(mat_data.section7.discharged_date_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="4" md="4" lg="2" class="pt-5 text-lg-right pr-2">
          <label class="body-2">TIME DISCHARGED</label>
        </v-col>
        <v-col cols="5" sm="4" md="4" lg="2">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" max-height="400" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section7.discharged_time" v-mask="mask" v-on="on" :rules="[rules.time_format]" @change="checkDataStatus('others')" @click:clear="mat_data.section7.discharged_time = null, mat_data.section7.discharged_period = null, checkDataStatus('others')" class="body-2" :clearable="trans_detail.editable" hide-details></v-text-field>
            </template>
            <v-row class="text-center" wrap>
              <v-col cols="4" sm="4" md="4" lg="4" class="white">
                <h6 class="body-2 grey white--text py-1">Hour</h6>
                <v-list>
                  <v-list-item v-for="hour in 12" :key="hour" :class="{'grey' : hour === parseInt(mat_data.section7.discharged_time ? mat_data.section7.discharged_time.substring(0, 2) : null)}" @click="selectHourMin('discharged', 'hour', hour)">
                    <v-list-item-title>
                      <span v-if="hour < 10">0</span>{{ hour }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="4" sm="4" md="4" lg="4">
                <h6 class="body-2 grey white--text py-1">Min</h6>
                <v-list>
                  <v-list-item v-for="(min, index) in 60" :key="min" :class="{'grey' : index === parseInt(mat_data.section7.discharged_time ? mat_data.section7.discharged_time.substring(3, 5) : null)}" @click="selectHourMin('discharged', 'min', index)">
                    <v-list-item-title>
                      <span v-if="min < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="4" sm="4" md="4" lg="4">
                <h6 class="body-2 grey white--text py-1">Seconds</h6>
                <v-list>
                  <v-list-item v-for="(sec, index) in 60" :key="sec" :class="{'grey' : index === parseInt(mat_data.section7.discharged_time ? mat_data.section7.discharged_time.substring(6) : null)}" @click="selectHourMin('discharged', 'sec', index)">
                    <v-list-item-title>
                      <span v-if="sec < 11">0</span>{{ index }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-menu>
        </v-col>
        <v-col cols="6" sm="4" md="4" lg="2">
          <v-radio-group v-model="mat_data.section7.discharged_period" :readonly="!mat_data.section7.discharged_time" :error="required && mat_data.section7.discharged_period === null && !!mat_data.section7.discharged_time" @change="checkDataStatus('others')" class="ml-4 ma-0" dense row>
            <v-radio value="AM" label="AM">AM</v-radio>
            <v-radio value="PM" label="PM">PM</v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <!-- SCHEDULE POSTPARTUM -->
      <v-row align="baseline" class="mb-5" wrap>
        <v-col cols="12" sm="8" md="8" lg="7" class="pt-3">
          <label class="body-2">SCHEDULE POSTPARTUM FOLLOW-UP CONSULTATION 1 WEEK AFTER DELIVERY DATE: </label>
        </v-col>
        <v-col cols="4" sm="4" md="4" lg="5">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="mat_data.section7.schedule_pospartum" v-on="on" :clearable="trans_detail.editable" @click:clear="mat_data.section7.schedule_pospartum_date = null" @change="checkDataStatus('others')" class="body-2" prepend-icon="mdi-calendar" readonly hide-details></v-text-field>
            </template>
            <v-date-picker v-model="mat_data.section7.schedule_pospartum_date" @input="mat_data.section7.schedule_pospartum = formatDate(mat_data.section7.schedule_pospartum_date)" @change="checkDataStatus('others')" no-title></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <!-- POSTPARTUM CARE -->
      <v-card class="pa-4">
        <v-row class="mb-2" wrap>
          <h1 class="subtitle-1 grey--text text--darken-3 font-weight-medium">POSTPARTUM CARE</h1>
          <v-spacer></v-spacer>
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_postpartum_care" @click="displayCommentData('pospartum')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-row>
        <v-divider></v-divider>
        <v-row wrap>
          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2">PERINAL WOUND CARE</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_perinal_wound" @change="checkDataStatus('others'), mat_data.section8.pc_perinal_wound_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_perinal_wound}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_perinal_wound_rem" :readonly="!mat_data.section8.pc_perinal_wound" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>
          
          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2">SIGNS OF MATERNAL POSPARTUM COMPLICATION</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_complication" @change="checkDataStatus('others'), mat_data.section8.pc_complication_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_complication}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_complication_rem" :readonly="!mat_data.section8.pc_complication" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="12" md="12" lg="12" class="mb-n4 mt-5 mt-sm-2">
            <label class="body-2 font-weight-bold grey--text text--darken-2">COUNSELING AND EDUCATION</label>
          </v-col>
          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2 pl-5">A. BREASTFEEDING AND NUTRITION DAY:</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_breastfeed" @change="checkDataStatus('others'), mat_data.section8.pc_breastfeed_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_breastfeed}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_breastfeed_rem" :readonly="!mat_data.section8.pc_breastfeed" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>
          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2 pl-5">B. FAMILY PLANNING:</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_family_plan" @change="checkDataStatus('others'), mat_data.section8.pc_family_plan_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_family_plan}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_family_plan_rem" :readonly="!mat_data.section8.pc_family_plan" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>
         
          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2">PROVIDED FAMILY PLANNING SERVICES TO PATIENT (AS REQUIRED BY PATIENT)</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_provided_plan" @change="checkDataStatus('others'), mat_data.section8.pc_provided_plan_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_provided_plan}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_provided_plan_rem" :readonly="!mat_data.section8.pc_provided_plan" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>

          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2">REFERRED TO FAMILY PHYSICIAN FOR VOLUNTARY SURGICAL STERILIZATION:</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_ref_physician" @change="checkDataStatus('others'), mat_data.section8.pc_ref_physician_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_ref_physician}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_ref_physician_rem" :readonly="!mat_data.section8.pc_ref_physician" @change="checkDataStatus('others')" label="Remarks" hide-details></v-text-field>
          </v-col>

          <v-col cols="9" sm="6" md="6" lg="7" class="pt-5">
            <label class="body-2">SCHEDULE THE NEXT POSPARTUM FOLLOW UP:</label>
          </v-col>
          <v-col cols="2" sm="2" md="3" lg="2">
            <v-checkbox v-model="mat_data.section8.pc_schedule_next" @change="checkDataStatus('others'), mat_data.section8.pc_schedule_next_rem = null" label="Done" hide-details></v-checkbox>
          </v-col>
          <v-col :class="{'opacity' : !mat_data.section8.pc_schedule_next}" cols="4" sm="4" md="3" lg="3">
            <v-text-field v-model="mat_data.section8.pc_schedule_next_rem" :readonly="!mat_data.section8.pc_schedule_next" @change="checkDataStatus('others')" label="Remarks"></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <!-- COMMENT DIALOG -->
      <v-dialog v-model="comment_dialog" width="600" persistent>
        <v-card>
          <h3 class="grey--text text--darken-3 font-weight-medium py-1 text-center">{{ comment_title }}</h3>
          <v-divider></v-divider>
          <div class="px-4 mt-2">
            <label class="body-2">Comment:</label>
            <v-textarea v-model="comment_content" rows="4" outlined readonly hide-details></v-textarea>
          </div>
          <v-row wrap justify-center mt-3 pb-3>
            <v-btn @click="comment_dialog = false" class="ml-1" color="primary" small>CLOSE</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- NAVIGATION BUTTON -->
      <v-divider class="my-5"></v-divider>
      <v-row justify="space-between" wrap>
        <v-col cols="5" sm="5" md="5" lg="5">
          <v-btn @click="$router.push('/input-forms/physical-examination')" color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
        </v-col>
        <v-col cols="5" sm="5" md="5" lg="5" class="text-right">
          <v-btn @click="$router.push('/input-forms/course-in-the-ward')" color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
        </v-col>
      </v-row>

      <Alert :alert="alert" />
    </v-form>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import Alert from '../../Alert.vue'

export default {
  props: ['trans_detail', 'required', 'comment_data'],
  
  components: {
    Alert
  },

  directives: {
    mask
  },

  created(){
    // this.getMaternityData();
    this.getObstetric();
  },

  data(){
    return{
      // DATA
      mat_data: {
        section1: {
          consultation_date: '',
          consultation_date_date: ''
        },
        section2: {
          vital_sign: '',
          present_pregnancy: '',
          age_of_menarche: ''
        },
        section3: [],
        section4: [],
        section5: {
          a: '',
          b: '',
          b_date: ''
        },
        section6: [],
        section7: {
          delivery_date: '',
          delivery_date_date: '',
          delivery_time: null,
          delivery_period: null,
          maternal_outcome: '',
          aog_by_lmp: '',
          delivery_manner: '',
          presentation: '',
          fetal_outcome: '',
          sex: '',
          birth_weight: '',
          apgar_score: '',
          discharged_date: '',
          discharged_date_date: '',
          discharged_time: '',
          schedule_pospartum: '',
          schedule_pospartum_date: ''
        },
        section8: {
          pc_perinal_wound: '',
          pc_perinal_wound_rem: '',
          pc_complication: '',
          pc_complication_rem: '',
          pc_breastfeed: '',
          pc_breastfeed_rem: '',
          pc_family_plan: '',
          pc_family_plan_rem: '',
          pc_provided_plan: '',
          pc_provided_plan_rem: '',
          pc_ref_physician: '',
          pc_ref_physician_rem: '',
          pc_schedule_next: '',
          pc_schedule_next_rem: ''
        }
      },

      // OTHERS
      date_today: new Date().toISOString().slice(0,10),
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
      selected_obstetric: [],
      selected_medical: [],
      alert: {},

      // REFERENCE DATA
      obstetric_risk_items: [],

      medical_risk_items: [],
      
      // LOADER
      load_obstetric: true,
      load_medical: true,

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: ''
    }
  },

  methods: {
    // GET MATERNITY DATA
    // getMaternityData(){
    //   let mat_data = sessionStorage.getItem('Z3GXX4') ? this.$crypto.AES.decrypt(sessionStorage.getItem('Z3GXX4'), '49oper3S').toString(this.$crypto.enc.Utf8) : null

    //   if(mat_data === null){
    //     this.$axios.post(this.$tms_url+'resources/api/_get_transaction_ip_mat.php', this.$qs.stringify({
    //       post_data: this.wsDataEncryption(JSON.stringify({
    //         phic_tracking_number: this.trans_detail.phic_tracking_number,
    //         transaction_number: this.trans_detail.transaction_number
    //       }))
    //     }))
    //     .then(response => {
    //       response.data = this.responseDataDecryption(response.data)
    //       let mat_data = response.data.MATERNITY_DATA

    //       this.mat_data = {
    //         section1: {
    //           consultation_date: this.formatDate(mat_data.ini_prenatal_consul_date),
    //           consultation_date_date: mat_data.ini_prenatal_consul_date
    //         },
    //         section2: {
    //           vital_sign: mat_data.vital_sign_is_normal,
    //           present_pregnancy: mat_data.prsnt_preg_is_low_risk,
    //           age_of_menarche: mat_data.age_of_menarche
    //         },
    //         section3: response.data.OBSTETRIC_RISK_FACTOR,
    //         section4: response.data.MED_SURG_RISK_FACTOR,
    //         section5: {
    //           a: mat_data.orientation_to_mcp, 
    //           b: this.formatDate(mat_data.expected_delivery_date),
    //           b_date: mat_data.expected_delivery_date
    //         },
    //         section6: response.data.PRENATAL_CONSULTATION.length > 0 ? response.data.PRENATAL_CONSULTATION : [{}],
    //         section7: {
    //           delivery_date: this.formatDate(mat_data.date_of_delivery),
    //           delivery_date_date: mat_data.date_of_delivery,
    //           delivery_time: this.convertTime(mat_data.time_of_delivery),
    //           delivery_period: null,
    //           maternal_outcome: mat_data.mo_obstetric_index,
    //           aog_by_lmp: mat_data.pu_aog_by_lmp,
    //           delivery_manner: mat_data.pu_manner_of_del,
    //           presentation: mat_data.pu_presentation,
    //           fetal_outcome: mat_data.bo_fetal_outcome,
    //           sex: mat_data.bo_sex,
    //           birth_weight: mat_data.bo_birth_weight,
    //           apgar_score: mat_data.bo_apgar_score,
    //           discharged_date: this.formatDate(mat_data.date_discharged),
    //           discharged_date_date: mat_data.date_discharged,
    //           discharged_time: this.convertTime(mat_data.time_discharged),
    //           discharged_period: null,
    //           schedule_pospartum: this.formatDate(mat_data.sched_postpartum_date),
    //           schedule_pospartum_date: mat_data.sched_postpartum_date
    //         },
    //         section8: {
    //           pc_perinal_wound: mat_data.perinal_wound_care,
    //           pc_perinal_wound_rem: mat_data.perinal_wound_care_remarks,
    //           pc_complication: mat_data.postpartum_complication,
    //           pc_complication_rem: mat_data.postpartum_complication_remarks,
    //           pc_breastfeed: mat_data.ce_bfeed_nutrition,
    //           pc_breastfeed_rem: mat_data.ce_bfeed_nutrition_remarks,
    //           pc_family_plan: mat_data.ce_family_planning,
    //           pc_family_plan_rem: mat_data.ce_family_planning_remarks,
    //           pc_provided_plan: mat_data.provided_fam_planning,
    //           pc_provided_plan_rem: mat_data.provided_fam_planning_remarks,
    //           pc_ref_physician: mat_data.reffered_to_part_physician,
    //           pc_ref_physician_rem: mat_data.reffered_to_part_physician_remarks,
    //           pc_schedule_next: mat_data.sched_next_postpartum,
    //           pc_schedule_next_rem: mat_data.sched_next_postpartum_remarks
    //         },
    //         status: {
    //           others: false,
    //           maternity: false,
    //           follow: false
    //         }
    //       }

    //       this.mat_data.section3.forEach(element => {
    //         this.selected_obstetric.push(element.obstetric_risk_factor)
    //       })

    //       this.mat_data.section4.forEach(element => {
    //         this.selected_medical.push(element.med_surg_risk_factor)
    //       })
        
    //       this.mat_data.section6.forEach(element => {
    //         element.date_of_consul_date = element.date_of_consul
    //         element.date_of_consul = this.formatDate(element.date_of_consul)
    //       })

    //       this.mat_data.section7.delivery_period = this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(9) : null
    //       this.mat_data.section7.delivery_time = this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(0, 8) : null

    //       this.mat_data.section7.discharged_period = this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(9) : null
    //       this.mat_data.section7.discharged_time = this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(0, 8) : null

    //       this.saveData();
    //       this.$store.commit('set_loading_category', false)
    //       this.getObstetric();
    //     })
    //     .catch(error => {
    //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //     })
    //   }else{
    //     this.mat_data = JSON.parse(mat_data)

    //     this.mat_data.section3.forEach(element => {
    //       this.selected_obstetric.push(element.obstetric_risk_factor)
    //     })

    //     this.mat_data.section4.forEach(element => {
    //       this.selected_medical.push(element.med_surg_risk_factor)
    //     })

    //     this.$store.commit('set_loading_category', false)
    //     this.getObstetric();
    //   }
    // },

    // GET OBSTETRIC RISK FACTORS
   
    async getMaternityData(){
      let mat_data = sessionStorage.getItem('Z3GXX4') ? this.$crypto.AES.decrypt(sessionStorage.getItem('Z3GXX4'), '49oper3S').toString(this.$crypto.enc.Utf8) : null

      if(mat_data === null){
        let response = await this.$services.getEclaims({
          request_key: 'maternity',
          provider_code: this.$store.state.prv_data.provider_code,
          ek_lgu_id: this.trans_detail.ek_lgu_id,
          transaction_number: this.trans_detail.transaction_number,
          migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
          claim_no: this.trans_detail.claim_no,
          ph_category: this.trans_detail.phic_packages
        });

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          let mat_data = response.data.MATERNITY_DATA

          this.mat_data = {
            section1: {
              consultation_date: this.formatDate(mat_data.ini_prenatal_consul_date),
              consultation_date_date: mat_data.ini_prenatal_consul_date
            },
            section2: {
              vital_sign: mat_data.vital_sign_is_normal,
              present_pregnancy: mat_data.prsnt_preg_is_low_risk,
              age_of_menarche: mat_data.age_of_menarche
            },
            section3: response.data.OBSTETRIC_RISK_FACTOR ? response.data.OBSTETRIC_RISK_FACTOR : [],
            section4: response.data.MED_SURG_RISK_FACTOR ? response.data.MED_SURG_RISK_FACTOR : [],
            section5: {
              a: mat_data.orientation_to_mcp, 
              b: this.formatDate(mat_data.expected_delivery_date),
              b_date: mat_data.expected_delivery_date
            },
            section6: response.data.PRENATAL_CONSULTATION.length > 0 ? response.data.PRENATAL_CONSULTATION : [{}],
            section7: {
              delivery_date: this.formatDate(mat_data.date_of_delivery),
              delivery_date_date: mat_data.date_of_delivery,
              delivery_time: this.convertTime(mat_data.time_of_delivery),
              delivery_period: null,
              maternal_outcome: mat_data.mo_obstetric_index,
              aog_by_lmp: mat_data.pu_aog_by_lmp,
              delivery_manner: mat_data.pu_manner_of_del,
              presentation: mat_data.pu_presentation,
              fetal_outcome: mat_data.bo_fetal_outcome,
              sex: mat_data.bo_sex,
              birth_weight: mat_data.bo_birth_weight,
              apgar_score: mat_data.bo_apgar_score,
              discharged_date: this.formatDate(mat_data.date_discharged),
              discharged_date_date: mat_data.date_discharged,
              discharged_time: this.convertTime(mat_data.time_discharged),
              discharged_period: null,
              schedule_pospartum: this.formatDate(mat_data.sched_postpartum_date),
              schedule_pospartum_date: mat_data.sched_postpartum_date
            },
            section8: {
              pc_perinal_wound: mat_data.perinal_wound_care,
              pc_perinal_wound_rem: mat_data.perinal_wound_care_remarks,
              pc_complication: mat_data.maternal_complication,
              pc_complication_rem: mat_data.maternal_complication_remarks,
              pc_breastfeed: mat_data.breastfeeding,
              pc_breastfeed_rem: mat_data.breastfeeding_remarks,
              pc_family_plan: mat_data.family_planning,
              pc_family_plan_rem: mat_data.family_planning_remarks,
              pc_provided_plan: mat_data.planning_service,
              pc_provided_plan_rem: mat_data.planning_service_remarks,
              pc_ref_physician: mat_data.surgical_sterilization,
              pc_ref_physician_rem: mat_data.sterilization_remarks,
              pc_schedule_next: mat_data.follow_up_sched,
              pc_schedule_next_rem: mat_data.follow_up_sched_remarks
            },
            status: {
              others: false,
              maternity: false,
              follow: false
            }
          }

          //FILTERING DATA FOR OBSTRIC RISK SECTION 3
          const obsctric_result = this.obstetric_risk_items.map(item => ({
              ...item,
              item_value: this.mat_data.section3[item.key_name] || "N"
          }));
          this.mat_data.section3 = obsctric_result
          this.selected_obstetric = this.mat_data.section3.filter(item => item.item_value === "Y").map(item => item.key_name);

          //FILTERING DATA FOR MEDICAL SURGICAL RISK SECTION 4
          const medical_result = this.medical_risk_items.map(item => ({
              ...item,
              item_value: this.mat_data.section4[item.key_name] || "N"
          }));
          this.mat_data.section4 = medical_result
          this.selected_medical = this.mat_data.section4.filter(item => item.item_value === "Y").map(item => item.key_name);
        
          this.mat_data.section6.forEach(element => {
            element.date_of_consul_date = element.date_of_consul
            element.date_of_consul = this.formatDate(element.date_of_consul)
          })

          this.mat_data.section7.delivery_period = this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(9) : null
          this.mat_data.section7.delivery_time = this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(0, 8) : null

          this.mat_data.section7.discharged_period = this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(9) : null
          this.mat_data.section7.discharged_time = this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(0, 8) : null

          this.saveData();
          this.$store.commit('set_loading_category', false)
        } else {
            this.alert = response.error;
        }
      } else {
        this.mat_data = JSON.parse(mat_data)
        
        this.selected_obstetric = this.mat_data.section3.filter(item => item.item_value === "Y").map(item => item.key_name);

        this.selected_medical = this.mat_data.section4.filter(item => item.item_value === "Y").map(item => item.key_name);

        this.$store.commit('set_loading_category', false)
      }
    },
    
    async getObstetric(){
      if(localStorage.getItem('XPOFIF')){
        this.obstetric_risk_items = localStorage.getItem('XPOFIF') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('XPOFIF'), 'xczDr43s').toString(this.$crypto.enc.Utf8)) : null
        this.load_obstetric = false
        this.getMedical();
      }else{

        let response = await this.$services.getTransactionIpRefData({
             request_key: 'phic_obstetric_risk_factors'
        });

        if (response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          localStorage.setItem('XPOFIF', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'xczDr43s'))
          this.obstetric_risk_items = response.data
          this.load_obstetric = false
          this.getMedical();
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }
    },

    // GET MEDICAL SURGICAL RISK FACTORS
    async getMedical(){
      if(localStorage.getItem('05XFLD')){
        this.medical_risk_items = localStorage.getItem('05XFLD') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('05XFLD'), 'fp4OdsS4').toString(this.$crypto.enc.Utf8)) : null
        this.load_medical = false
        this.getMaternityData()
      }else{
        let response = await this.$services.getTransactionIpRefData({
          request_key: 'phic_surgical_risk_factors'      
        });

        if (response.status === 200) {
          //response.data = this.responseDataDecryption(response.data)
          localStorage.setItem('05XFLD', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'fp4OdsS4'))
          this.medical_risk_items = response.data
          this.load_medical = false
          this.getMaternityData()
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
      }  
    },
    
    // ADD SELECTED OBSTETRIC
    addSelectedObstetric(){
      this.obstetric_risk_items = this.obstetric_risk_items.map(data => {
        if(this.selected_obstetric.includes(data.key_name)){
          data.item_value = 'Y'
        } else {
          data.item_value = 'N'
        }

        return data
      })
      this.mat_data.section3 = this.obstetric_risk_items

      this.checkDataStatus('maternity');
    },

    // ADD SELECTED MEDICAL
    addSelectedMedical(){
      this.medical_risk_items = this.medical_risk_items.map(data => {
        if(this.selected_medical.includes(data.key_name)){
          data.item_value = 'Y'
        } else {
          data.item_value = 'N'
        }

        return data
      })

      this.mat_data.section4 = this.medical_risk_items


      // if(event.includes(value)){
      //   this.mat_data.section4.push({
      //     med_surg_risk_factor: value
      //   })
        
      //   this.selected_medical.push(value)
      // }else{
      //   this.mat_data.section4.forEach((element, index) => {
      //     if(element.med_surg_risk_factor === value){
      //       this.mat_data.section4.splice(index, 1)
      //     }
      //   })

      //   this.selected_medical.forEach((element, index) => {
      //     if(element === value){
      //       this.selected_medical.splice(index, 1)
      //     }
      //   })
      // }

      this.checkDataStatus('maternity');
    },

    // ADD FOLLOW UP PRE-NATAL CONSULTATION
    addFollowUpConsultation(){
      if(this.mat_data.section6.length >= 11){
        this.alert = { display: true, type: 'standard', width: '420', icon: 'mdi-close-circle', color: 'red', title: "Sorry, you've reached the limit of follow-up prenatal consultation.", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else{
        this.mat_data.section6.push({
          prenatal_consul_no: '',
          date_of_consul: '',
          aog_in_weeks: '',
          weight: '',
          cardiac_rate: '',     
          respiratory_rate: '',
          blood_pressure: '',
          temperature: ''
        })
      }
    },

    // REMOVE ADDED FOLLOW UP PRE-NATAL CONSULTATION
    removeAddedFollowUP(index){
      this.mat_data.section6.splice(index, 1)
      this.mat_data.status.follow = true
      this.checkDataStatus('follow');
    },

    // SELECT HOUR/MINUTE
    selectHourMin(section, item, value){
      if(value < 10){
        value = '0'+value
      }
      
      if(section === 'delivery'){
        if(item === 'hour'){
          this.mat_data.section7.delivery_time = value+':'+(this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(3, 8) : '00:00')
        }else if(item === 'min'){
          this.mat_data.section7.delivery_time = (this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(0, 2) : '01')+':'+value+':'+(this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(6, 9) : '00')
        }else{
          this.mat_data.section7.delivery_time = (this.mat_data.section7.delivery_time ? this.mat_data.section7.delivery_time.substring(0, 5) : '01:00')+':'+value
        }
      }else if(section === 'discharged'){
        if(item === 'hour'){
          this.mat_data.section7.discharged_time = value+':'+(this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(3, 8) : '00:00')
        }else if(item === 'min'){
          this.mat_data.section7.discharged_time = (this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(0, 2) : '01')+':'+value+':'+(this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(6, 9) : '00')
        }else{
          this.mat_data.section7.discharged_time = (this.mat_data.section7.discharged_time ? this.mat_data.section7.discharged_time.substring(0, 5) : '01:00')+':'+value
        }
      }

      this.checkDataStatus('others');
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

    // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
    numberOnly(event){
      if ((event.which < 48 || event.which > 57) && event.which !== 45){
        event.preventDefault();
      }
    },

    // DISPLAY COMMENT DATA
    displayCommentData(data){
      if(data === 'prenatal'){
        this.comment_title = 'PRENATAL CONSULTATION DATE'
        this.comment_content = this.comment_data.cf3_part2_number1
      }else if(data === 'clinical'){
        this.comment_title = 'CLINICAL HISTORY & PHYSICAL EXAMINATION'
        this.comment_content = this.comment_data.cf3_part2_number2
      }else if(data === 'obstetric'){
        this.comment_title = 'OBSTETRIC RISK FACTORS'
        this.comment_content = this.comment_data.cf3_part2_number3
      }else if(data === 'medical'){
        this.comment_title = 'MEDICAL SURGICAL RISK FACTORS'
        this.comment_content = this.comment_data.cf3_part2_number4
      }else if(data === 'plan'){
        this.comment_title = 'DELIVERY PLAN'
        this.comment_content = this.comment_data.cf3_part2_number6
      }else if(data === 'followup'){
        this.comment_title = 'FOLLOW UP PRE-NATAL CONSULTATION'
        this.comment_content = this.comment_data.cf3_part2_number7
      }else if(data === 'outcome'){
        this.comment_title = 'DELIVERY OUTCOME'
        this.comment_content = this.comment_data.cf3_part2_delivery_outcome
      }else if(data === 'pospartum'){
        this.comment_title = 'POSTPARTUM CARE'
        this.comment_content = this.comment_data.cf3_part2_postpartum_care
      }

      this.comment_dialog = true
    },

    // CHECK IF DATA HAS BEEN CHANGED
    checkDataStatus(data){
      this.$emit('change-status')
      
      if(data === 'others'){
        this.mat_data.status.others = true
        this.empty_others = ''
        this.invalid_time = ''

        if(this.mat_data.section7.delivery_time && !this.mat_data.section7.delivery_period){
          this.empty_others = 'empty'
        }else if(this.mat_data.section7.discharged_time && !this.mat_data.section7.discharged_period){
          this.empty_others = 'empty'
        }

        if(this.mat_data.section7.delivery_time){
          if(!this.$moment(this.mat_data.section7.delivery_time, 'hh:mm:ss', true).isValid()){
            this.invalid_time = 'invalid_time'
          }
        }else{
          this.mat_data.section7.delivery_period = null
        }

        if(this.mat_data.section7.discharged_time){
          if(!this.$moment(this.mat_data.section7.discharged_time, 'hh:mm:ss', true).isValid()){
            this.invalid_time = 'invalid_time'
          }
        }else{
          this.mat_data.section7.discharged_period = null
        }
      }else if(data === 'maternity'){
        this.mat_data.status.maternity = true
      }else if(data === 'follow'){
        this.mat_data.status.follow = true
      }

      this.$emit('input', [this.empty_others, this.invalid_time])
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      sessionStorage.setItem('Z3GXX4', this.$crypto.AES.encrypt(JSON.stringify(this.mat_data), '49oper3S'))
    }
  },

  destroyed(){
    this.saveData();
  }
}
</script>

<style scoped>
th{
  border: 0;
}
td{
  cursor: default;
  padding: 0 3px;
  text-align: left;  
  border: 0px;  
}
.table-overflow-x{
  border: 1px solid #dedede; 
  margin-top: 4px;
  overflow-x: auto; 
  overflow-y: hidden; 
  padding: 6px 6px 20px 6px; 
}
.table-overflow-x table{
  margin-top: 15px;
  min-width: 1000px;
  width: 100%;
}
</style>