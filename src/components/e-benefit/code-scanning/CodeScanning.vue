<template>
  <v-container v-resize="onResize" fluid class="height-100 color-text px-7 px-lg-7">
    <Navbar :navbar="navbar" />
    <div class="d-flex flex-wrap height-80">
      <HeaderPage  title="Admission Dashboard"/>
      
      <v-col cols="12" align-self="center" class="mt-md-7" id="content">
        <v-window v-model="current_window" class="mb-4 window">
          <v-window-item :value="1">
            <v-row class="my-1 align-end" dense>
              <v-col cols="12" sm="12" md="12" lg="10" xl="8" offset-lg="1" offset-xl="2"> 
                <v-row class="justify-center"  dense> 
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pr-lg-3 my-2 pa-2">
                      <v-hover v-slot="{ hover }">
                        <v-card @click="openQRScanner()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex mt-4 card-container-items" flat color="white">
                          
                            <div class="my-2 ml-5 card-icon">
                              <v-icon :size="icon_size" color="primary" class="px-5">mdi-qrcode-scan</v-icon>
                            </div>

                            <div class="card-details">
                              <h6 class="title mb-1">QR Scanner</h6>
                              <h6 class="caption text-xl-body-2">Scan QR Code on card to initiate a medical transaction.</h6>
                              <h6 class="primary--text caption font-weight-medium text-uppercase mb-0">SCAN QR IMAGE</h6>
                              <br>
                            </div>
                          
                        </v-card>
                      </v-hover>
                  </v-col>

                  <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pr-lg-3 my-2 pa-2">
                      <v-hover v-slot="{ hover }">
                        <v-card @click="readCards()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex mt-4 card-container-items" flat color="white">
                          
                            <div class="my-2 ml-5 card-icon">
                              <v-icon :size="icon_size" color="primary" class="px-5">mdi-card-account-details</v-icon>
                            </div>

                            <div class="card-details">
                              <h6 class="title mb-1">Card Scanner</h6>
                              <h6 class="caption text-xl-body-2">Insert a card in card reader to initiate a medical transaction.</h6>
                              <h6 class="primary--text caption font-weight-medium text-uppercase mb-0">SMART CARD READER</h6>
                            </div>
                         
                        </v-card>
                      </v-hover>
                  </v-col>
                  
                  <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pr-lg-3 my-2 pa-2">
                      <v-hover v-slot="{ hover }">
                        <v-card @click="goToRegistration()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="primary d-flex mt-4 card-container-items" flat color="white">
                          
                            <div class="my-2 ml-5 card-icon">
                              <v-icon :size="icon_size" color="white" class="px-5">mdi-account-plus</v-icon>
                            </div>

                            <div class="white--text card-details">
                              <h6 class="title mb-1">New Member Registration</h6>
                              <h6 class="caption text-xl-body-2">Register the patient and issue {{ capitalizeString($store.state.prv_data.province) }} Health Card.</h6>
                              <h6 class="white--text caption font-weight-medium text-uppercase mb-0">Proceed to Registration</h6>
                            </div>
                          
                        </v-card>
                      </v-hover>
                  </v-col>

                  <v-col cols="12" sm="12" md="6" lg="6" xl="6" class="pr-lg-3 my-2 pa-2">
                      <v-hover v-slot="{ hover }">
                        <v-card @click="verifyUser()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" outline class="d-flex mt-4 card-container-items" flat color="white">
                          
                            <div class="my-2 ml-5 card-icon">
                              <v-icon :size="icon_size" color="primary" class="px-5">mdi-magnify</v-icon>
                            </div>

                            <div class="card-details">
                              <h6 class="title mb-1">Search Member</h6>
                              <h6 class="caption text-xl-body-2">Search member by using full name to initiate a medical transcation.</h6>
                              <br>
                            </div>
                          
                        </v-card>
                      </v-hover>
                  </v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-window-item>

          <v-window-item :value="2">
            <v-row class="my-4" dense>
              <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pr-lg-3 my-2 pa-2" offset-lg="2" offset-xl="2">
                <v-hover v-slot="{ hover }">
                  <v-card @click="generateQRCode()" :class="[sel_adm_process.id === 'qr' ? 'card-border-active' : 'card-border-inactive', hover ? 'hover-class' : '']" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-qrcode</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">GENERATE QR CODE</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>

              <!-- <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pl-lg-3 my-2 pa-2">
                <v-hover v-slot="{ hover }">
                  <v-card @click="generateSMSCode()" :class="[sel_adm_process.id === 'sms' ? 'card-border-active' : 'card-border-inactive', hover ? 'hover-class' : '']" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-message-processing</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">GENERATE SMS CODE</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col> -->

              <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pr-lg-3 my-2 pa-2">
                <v-hover v-slot="{ hover }">
                  <v-card @click="dispenseMedicine()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-pill-multiple</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">DISPENSING OF MEDICINE</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pl-lg-3 my-2 pa-2" offset-lg="2" offset-xl="2">
                <v-hover v-slot="{ hover }">
                  <v-card @click="queList()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-clipboard-list-outline</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">QUEUE LIST</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="6" md="6" lg="4" xl="4" class="pr-lg-3 my-2 pa-2" >
                <v-hover v-slot="{ hover }">
                  <v-card @click="questionaireSurvey()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-folder-open-outline</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">QUESTIONNAIRE/SURVEY/FORMS</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col v-if="$store.state.prv_config.ekonsulta_accre" cols="12" sm="6" md="6" lg="4" xl="4" class="pl-lg-3 my-2 pa-2" offset-lg="2" offset-xl="2">
                <v-hover v-slot="{ hover }">
                  <v-card @click="updatePhicMasterList()" :class="hover ? 'card-border-active' : 'card-border-inactive'" height="100%" width="100%" class="d-flex flex-column justify-space-between color-text" outline>
                    <v-row justify="center" align="center" class="py-4 px-2 pt-7">
                      <v-icon :size="icon_size" :color="'primary'" class="px-3">mdi-sync</v-icon>
                    </v-row>
                    <v-row justify="center" class="px-2 pb-8">
                      <h6 class="text-body-1 font-weight-medium">UPDATE PHIC MASTERLIST</h6>
                    </v-row>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>

        <v-card-actions class="justify-space-between">
          <v-icon @click="changeWindow(-1)" class="mdi mdi-chevron-left" medium></v-icon>
          <v-item-group v-model="current_window" class="text-center" mandatory>
            <v-item v-for="window in total_windows" :key="`btn-${window}`" :value="window">
              <v-icon @click="current_window = window" :outlined="active_window(window)" :color="active_window(window) ? 'light-blue darken-4' : ''" class="mdi mdi-circle icon-with-shadow" style="margin: 0 5px;" small></v-icon>
            </v-item>
          </v-item-group>
          <v-icon @click="changeWindow(1)" class="mdi mdi-chevron-right" medium></v-icon>
        </v-card-actions>
      </v-col>
    </div>
          
    <!-- ADMISSION PROCESS -->
    <v-dialog v-if="sel_adm_process.display" v-model="sel_adm_process.display" width="700" persistent>
        <v-card>
          <v-card-title class="justify-center primary white--text"><v-icon color="white" left>{{sel_adm_process.icon}}</v-icon>{{sel_adm_process.name}}</v-card-title>
          <div class="pa-5">
            <v-col v-if="sel_adm_process.id == 'qr'" cols="12">
              <h1 class="body-1 text-center">Please ask the member to turn on the internet access <br/> and <span class="font-weight-medium">SCAN this QR CODE</span></h1>

              <v-row dense>
                  <v-col cols="6" class="my-5 mx-auto" >
                    <v-card v-if="!qr_img" width="270" height="270" class="d-flex flex-column justify-center mx-auto" outlined>
                      <v-card-title class="justify-center py-2 subtitle-2">Generating QR code</v-card-title>      
                      <div class="px-5"><v-progress-linear color="light-blue darken-4" height="10" indeterminate rounded></v-progress-linear></div>
                    </v-card>
                    <v-img v-else :src="qr_img" width="270" height="270" class="mx-auto" id="qrcode"></v-img>
                  </v-col>
              </v-row>
            </v-col>

            <v-col v-if="sel_adm_process.id == 'sms'" cols="12" class="py-15" >
                <h1 class="body-1 mt-5 text-center">Please text this <span class="font-weight-medium">ACCESS NUMBER</span> via SMS</h1>
                <div v-if="!sms_code" class="my-3" align="center"><v-progress-circular  class="mx-auto" color="primary" size="50" indeterminate></v-progress-circular></div>
                <h2 v-else class="text-h3 font-weight-medium text-center my-3">{{sms_code}}</h2>

                <h3 class="body-1 mb-5 text-center">And send to <span class="font-weight-medium">0966 880 9172</span></h3>
                <h4 class="caption my-1  text-center"><em>**Note for sending SMS, member local mobile network provider standard messaging rates may apply</em></h4>
            </v-col>

            <v-col v-if="sel_adm_process.id == 'qrscanner'" cols="12" class="d-flex justify-center">
              <div v-if="loading_qr_scanner" class="text-center">
                <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                <h4 class="light-blue--text text--darken-4 mt-5">Loading... Please wait...</h4>
              </div>

              <video v-show="!loading_qr_scanner" id="previews" width="100%" class="elevation-1"></video>
            </v-col>

            <v-col v-if="sel_adm_process.id == 'card-scan'" cols="12" class="d-flex justify-center">
              <div v-if="loading_qr_scanner" class="text-center">
                <v-progress-circular color="primary" size="100" indeterminate></v-progress-circular>
                <h4 class="light-blue--text text--darken-4 mt-5">Loading... Please wait...</h4>
              </div>
              <v-sheet class="my-12"> 
                <h4 class="grey--text font-italic body-1"> Please insert the card in card reader </h4> 
              </v-sheet>
              <!-- <video v-show="!loading_qr_scanner" id="previews" width="100%" class="elevation-1"></video> -->
            </v-col>
          </div>
          <v-divider></v-divider>
          <v-card-actions class="justify-center py-3">
            <v-btn :disabled="loading_qr_scanner" @click="closeAdmProcess" rounded color="primary" class="px-5">CLOSE <v-icon right small>mdi-close</v-icon></v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- MEMBER SELECTION -->
    <v-dialog v-if="member_selection_dialog" v-model="member_selection_dialog" width="80%" persistent>
        <v-card justify-center>   
          <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">{{is_qr_scanner ? 'PATIENT CONFIRMATION ' : 'PATIENT SELECTION' }}</v-card-title>
          <div class="px-5">
            <v-row dense>
                <v-col cols="12" sm="6" md="4" align-self="center" class="ml-auto py-5">
                  <v-text-field v-model="search" placeholder="Search" hide-details outlined dense></v-text-field>
                </v-col>
            </v-row>

            <v-data-table
              :headers="process_type === 'LGU' ? member_headers_lgu : member_headers"
              :items="member" 
              :search="search"
              :items-per-page="4"
              :mobile-breakpoint="0"
              :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" 
              :sort-by="process_type === 'LGU' ? 'lgu_member_type' : 'mem_hmo_type'" 
              :loading="member_selection_loader"
              loading-text="Loading Please Wait" 
              class="pb-5"
              sort-desc
            >
              <template v-slot:item="{ item }">
                <template v-if="process_type === 'LGU'">
                    <tr @click="selectedRowLGU(item)" :class="{'blue lighten-4': item.ek_lgu_id === selected_ek_lgu_id}">
                      <td>{{ item.ek_lgu_id }}</td>
                      <td class="text-uppercase">{{(item.mem_first_name +item.mem_last_name).includes(null) ? "N/A": item.mem_first_name+(item.mem_middle_name ? " "+item.mem_middle_name : "") +" "+item.mem_last_name +(item.mem_suffix ? " "+item.mem_suffix : '')}}</td>
                      <td>{{ item.lgu_member_type  ? item.lgu_member_type.charAt(0).toUpperCase() === 'P' ? 'PRINCIPAL' : 'DEPENDENT' : 'N/A' }}</td>
                      <td>
                        <v-img v-if="!item.mem_photo" src="@/assets/no-image.jpg" class="mx-auto my-1" width="70px" contain></v-img>
                        <v-img :src="item.mem_photo.includes('data:image/jpeg;base64,') ? item.mem_photo : item.mem_photo+uniqueUrl" @error="item.mem_photo = require('@/assets/no-image.jpg')" class="mx-auto my-1" width="70px" contain ></v-img>
                      </td>
                    </tr>
                </template>
                <template v-else>
                  <tr @click="selectedRow(item)" 
                    :class="{
                      'blue lighten-4' : item.ek_hmo_id === selected_ek_hmo_id, 
                      'grey--text' : item.mem_hmo_policy_number !== catch_data.policy.toUpperCase() && item.member_name.trim() !== catch_data.name.trim() && catch_data.restriction !== false
                    }">
                    <td>{{ item.mem_hmo_policy_number }} {{catch_data.name}}</td>
                    <td class="text-uppercase">{{(item.mem_first_name +item.mem_last_name).includes(null) ? "N/A": item.mem_first_name+(item.mem_middle_name ? " "+item.mem_middle_name : "") +" "+item.mem_last_name +(item.mem_suffix ? " "+item.mem_suffix : '')}}</td>
                    <td>{{ item.mem_hmo_type }}</td>
                    <td>
                      <v-img v-if="!item.mem_photo" src="@/assets/no-image.jpg" class="mx-auto my-1" width="70px" contain></v-img>
                      <v-img :src="item.mem_photo.includes('data:image/jpeg;base64,') ? item.mem_photo : item.mem_photo+uniqueUrl" @error="item.mem_photo = require('@/assets/no-image.jpg')" class="mx-auto my-1" width="70px" contain ></v-img>
                    </td>
                  </tr>
                </template>
              </template>
            </v-data-table>
          </div>

          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-btn @click="showCancel()" rounded :disabled="mem_btn_loader" class="mx-2" color="secondary" outlined> <v-icon small left>fas fa-times-circle</v-icon> CANCEL</v-btn>
            <v-btn @click="validateSelectedMember()" :loading="mem_btn_loader" class="mx-2" color="light-blue darken-4" dark rounded>CONFIRM<v-icon small right>fas fa-check-circle</v-icon></v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>

    <!---MEMBER VERIFICATION--->
    <v-dialog v-if="user_verification" v-model="user_verification" max-width="700" persistent>
        <UserVerify @displayMemberData="displayMemberData" @closeVerification="verifyCancel"/>
    </v-dialog>

    <!-- CONFIRM SELECTION DIALOG -->
    <v-dialog v-if="selection_confirm_disp" v-model="selection_confirm_disp" :max-width="confirm_display_width" persistent>
      <v-card>
        <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">SELECTION CONFIRMATION</v-card-title>
        
        <v-col cols="12" align="center">
          <h3 class="colorGrey font-weight-bold my-2">{{sel_hmo_name ? sel_hmo_name.toUpperCase() : hmo_host_code == "VC" ? "VALUCARE": "EUREKARE"}}</h3>
          <h4 class="colorGrey font-weight-medium mb-2">Name: <b>{{member_name.toUpperCase()}}</b></h4>
          <h4 class="colorGrey font-weight-medium mb-2">Policy Number: <b> {{ mem_policy_no }}</b></h4>
          <h4 class="colorGrey font-weight-medium mb-2">Birthday: <b> {{ birthdate ? $moment(birthdate).format('MM/DD/YYYY') : 'N/A' }}</b></h4>

            <v-divider class="my-5"></v-divider>
            <h3 class="colorGrey font-weight-bold mt-3 mb-2">PHILHEALTH</h3>
            <h4 class="colorGrey font-weight-medium mb-2">Name: <b>{{member_name.toUpperCase()}}</b></h4>
            <h4 class="colorGrey font-weight-medium mb-2">Birthday: <b>{{birthdate ? $moment(birthdate).format('MM/DD/YYYY') : 'N/A'}}</b></h4>
            <h6 class="mt-5"><i class="caption">Note: <b>Selected patient is listed above. Please make sure that you have chosen the correct member/ patient for this transaction.</b></i></h6>
        </v-col>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-btn @click="selection_confirm_disp = false" :disabled="confirm_loader" class="btn mr-2" color="secondary" outlined rounded> <v-icon small left>fas fa-times-circle</v-icon> CANCEL </v-btn>
          <v-btn @click="confirmSubmit()" :loading="confirm_loader" class="btn ml-2" color="light-blue darken-4 white--text" rounded> CONFIRM <v-icon small right>fas fa-check-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--ADD ATC CODE -->
    <v-dialog v-if="add_atc_code" v-model="add_atc_code" max-width="700" persistent>
      <v-card>
        <v-card-title class="justify-center text-h6 light-blue darken-4 white--text text-center">ADD AUTHORIZATION TRANSACTION CODE</v-card-title>

        <v-col cols="12" align="start" class="px-4">
          <v-text-field v-model="atc_code" label="ATC Code" outlined dense :error-messages="atc_code_error"> </v-text-field>
          <h3 class="text-body-2"> <span class="font-weight-bold"> PHIC PIN:  </span> {{ eligible_data.pPatientPin }} </h3>
        </v-col>

        <v-divider></v-divider>

        <v-card-actions class="justify-center">
          <v-btn @click="confirmSubmit()" :loading="confirm_loader" class="btn mr-2" color="secondary" outlined rounded> <v-icon small left>fas fa-check-circle</v-icon> PROCEED W/O ATC CODE </v-btn>
          <v-btn @click="checkAtcCode()" :loading="atc_confirm_loader" class="btn ml-2" color="light-blue darken-4 white--text" rounded> CONFIRM <v-icon small right>fas fa-check-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- PATIENT MISMATCHED -->
    <v-dialog v-if="patient_mismatch_alert" v-model="patient_mismatch_alert" :max-width="confirm_display_width" persistent>
      <v-card>
        <v-card-title class="justify-center"><v-icon color="yellow dakren-1" :size="$vuetify.breakpoint.name === 'xs' ? 50 : 75">mdi-alert-circle</v-icon></v-card-title>
        <v-card-title class="text-uppercase justify-center caption text-sm-subtitle-1 mb-2 ">Cannot Proceed with the Transction</v-card-title>
        <v-card-subtitle class="text-center caption text-sm-body-2">Data mismatched</v-card-subtitle>

        <h4 class="mb-sm-3   grey--text text--darken-3 text-center caption text-sm-subtitle-1"><b class="grey--text text--darken-4">{{sel_hmo_name}}</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Name: <b class="grey--text text--darken-4">{{member_name}}</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Birthday: <b class="grey--text text--darken-4"> {{selected_birthday}}</b></h4>
        
        <div style="padding:0 5em">
          <v-divider class="my-2 my-sm-4 "></v-divider>
        </div>

        <h4 class="mb-sm-3  text-center caption text-sm-subtitle-1"><b>PHILHEALTH</b></h4>
        <h4 class="mb-sm-3  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Name: <b class="grey--text text--darken-4">{{typein_fullname}}</b></h4>
        <h4 class="mb-sm-4  font-weight-medium grey--text text--darken-3 text-center caption text-sm-subtitle-1">Birthday: <b class="grey--text text--darken-4"> {{typein_birthdate}}</b></h4>
        <br/>
        <h6 class="font-weight-light text-center text-sm-subtitle-2" ><i>Note: <b >Please make sure that your data from Health Insurance Company and Philhealth are the same.</b></i></h6>

        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="patient_mismatch_alert = false" color="primary" class="py-5 my-5 text-center ">Ok</v-btn>
        </v-col>
      </v-card>      
    </v-dialog> 
  
    <v-overlay v-if="overlay_loader" :value="overlay_loader" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span v-if="lgu_overlay" class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
      <span v-else class="ml-3 text-body-1 text-sm-h6  font-weight-regular" > Checking PHIC Account...Please Wait</span>
    </v-overlay>

    <v-overlay v-if="phic_master_list_loader" :value="phic_master_list_loader" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span v-if="lgu_overlay" class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
      <span v-else class="ml-3 text-body-1 text-sm-h6  font-weight-regular" > Checking PHIC Master list...Please Wait</span>
    </v-overlay>

    <v-overlay v-if="smart_card_loader" :value="smart_card_loader" z-index="9999"> 
      <v-progress-circular indeterminate size="35"></v-progress-circular>
      <span v-if="lgu_overlay" class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
      <span v-else class="ml-3 text-body-1 text-sm-h6  font-weight-regular" > Checking smart card reader...Please Wait</span>
    </v-overlay>

    <v-dialog v-model="mt_dialog" width="550" persistent>
      <v-card width="550">
        <v-sheet class="pa-4">
          <div class="d-flex justify-center align-center mt-2">
            <v-icon color="blue darken-3" size="100">mdi-check-circle</v-icon>
          </div>

          <div class="d-flex justify-center align-center">
            <h1 class="blue--text text--darken-3 font-weight-bold">Success</h1>
          </div>

          <div class="d-flex justify-center align-center">
           <h2 class="body-1 grey--text text--darken-3 font-weight-bold">{{ mt_data.message}}</h2> 
          </div>

          <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 10px; margin-top: 10px;">
            <h3 class="body-2 grey--text text--darken-3 font-weight-regular">(<span class="body-2 font-weight-bold">{{ mt_data.success_insert }}</span>) Inserted </h3>
            <h3 class="body-2 grey--text text--darken-3 font-weight-regular">(<span class="body-2 font-weight-bold">{{ mt_data.success_update }}</span>) Updated</h3>
            <h3 class="body-2 red--text text--darken-3 font-weight-regular">(<span class="body-2 font-weight-bold">{{ mt_data.failed }}</span>) Failed </h3>
          </div>

          <template v-if="mt_data.failed_records_list.length >= 1" >
            <div class="d-flex justify-center align-center">
              <v-btn @click="saveFailedML" class="white--text mt-2" color="red" small>
                <v-icon class="mr-2" small>mdi-printer</v-icon> Save Failed Records
              </v-btn>
            </div>
          </template>

          <v-card-actions class="d-flex justify-center align-center mt-2 mb-2">
            <v-btn @click="mt_dialog = false" color="blue darken-3" class="white--text"> Close </v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-dialog>

    <v-dialog v-model="mt_dialog_error" width="550" persistent>
      <v-card width="550">
        <v-sheet class="pa-4">
          <div class="d-flex justify-center align-center mt-2">
            <v-icon color="red darken-3" size="100">mdi-alpha-x-circle</v-icon>
          </div>

          <div class="d-flex justify-center align-center">
            <h1 class="red--text text--darken-3 font-weight-bold">Error</h1>
          </div>

          <div class="d-flex justify-center align-center">
           <h2 class="body-1 grey--text text--darken-3 font-weight-bold">{{ mt_data.message}}</h2> 
          </div>

          <v-card-actions class="d-flex justify-center align-center mt-2 mb-2">
            <v-btn @click="mt_dialog = false" color="blue darken-3" class="white--text"> Close </v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-dialog>
  
    <Alert :alert="alert" @confirmSubmit="confirmSubmit" @confirmButton="confirmAlert" @changeStatus="changeStatus" @closeAdmProcess="closeAdmProcess"/>
  </v-container>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Alert from '@/components/Alert.vue';
import QrScanner from 'qr-scanner'; 
import HeaderPage from "@/components/e-benefit/code-scanning/Header.vue";
import UserVerify from "@/components/e-benefit/code-scanning/UserVerification.vue"
import jsPDF from 'jspdf'

const xml = require("xml-js");
export default {
  name: 'Code-scanning',
  components: {
    Navbar,
    Alert,
    HeaderPage,
    UserVerify
  },
  data() {
    return {
      // PROCESS
      qr_page_process: '',
      process_type:'',
      jspdf: jsPDF,
       
      // ADMISSION PROCESS
      admission_items:[
        {
          id:'qrscanner',
          name: 'QR Scanner',
          subtitle: 'Scan QR Code on card to initiate a medical transaction.',
          icon: 'mdi-qrcode-scan',
          btn_name: 'Scan QR Image',
        },
      ],

      sel_adm_process: {
        display: false
      },

      // QR/SMS RELATED DATA
      qr_filename: '',
      qr_data: '',
      qr_img:'',
      sms_code: '',
      is_qr_scanner: false,

      // QR SCANNER RELATED
      qrScanner: null,

      //ATC CODE AND FOR EKONSULTA
      eligible_data: [],
      add_atc_code: false,
      show_alert_ekonsulta: false,
      atc_response: '',
      atc_code: '',
      atc_code_error: '',
      awaiting_atc_code: false,

      // USER RELATED DATA
      mem_policy_no: '',
      hmo_host_code: '',
      lgu_host_code: '',
      ek_lgu_id: '',
      ek_phic_id: '',
      registration_type: '',
      fname: '',
      lname: '',
      mname: '',
      suffix: '',
      birthdate: '',
      member_name:'',

      // DIALOGS
      member_selection_dialog: false,
      selection_confirm_disp: false,
      confirm_loader: false,
      atc_confirm_loader: false,
      user_verification: false,

      // MEMBER SELECTION DIALOG
      member_headers: [
          { text: "MEMBER ID", value: "mem_hmo_policy_number", width:'150px'},
          { text: "NAME", value: "mem_first_name", width: '150px'},
          { text: "MEMBER TYPE", value: "mem_hmo_type", width: '150px'},
          { text: "PHOTO", value: "mem_photo", width: '150px' },
      ],
    
      member_headers_lgu: [
          { text: "MEMBER ID", value: "ek_lgu_id", width:'150px'},
          { text: "NAME", value: "mem_first_name", width: '150px'},
          { text: "MEMBER TYPE", value: "lgu_member_type", width: '150px'},
          { text: "PHOTO", value: "mem_photo", width: '150px' },
      ],
      member: [],
      search:'',
      selected_ek_lgu_id: '',
      selected_ek_hmo_id: '',
      selected_birthday: '',
      mem_btn_loader: false,
      member_selection_loader: false,

      // NAVBAR DATA
      navbar: [],

      // CANCELLATION TOKENS FOR API/CONTROLLER AND TIMEOUT 
      cancelToken: null,
      source: null,
      qr_timeout: '',
      sms_timeout: '',
      qr_reload_timeout:'',

      //FOR RESIZE
      windowSize: {x: 0,y: 0},
      heroes_health_logo:'250',
      confirm_display_width:"60%",
      text_title:'font-size: 1.17em',
      icon_size: '75',

      // OVERLAY
      lgu_overlay: false,
      overlay_loader: false,

      patient_mismatch_alert: false,

      // OTHERS
      loading_qr_scanner: false,
      alert: {},

      current_window: 1,
      total_windows: 2,

      phic_master_list_loader: false,
      mt_data:{
        failed_records_list: []
      },
      mt_dialog: false,
      mt_dialog_error: false,
      user_ip_address: '',
      smart_card_loader: false,
      user_local_ip: '',

      ekonsulta_err: false
    }
  },

  created() {
    this.$store.commit('removeMemberData')
    sessionStorage.clear();
    
    this.getLocalIP().then(ip => {
      this.user_local_ip = ip
    }).catch(console.error);
  },
  
  computed:{
    uniqueUrl(){
      return '?'+Math.random().toString(25).substring(3, 20)
    },

    active_window() {
      return (window) => this.current_window === window;
    },
  },

  watch: {
    'alert.display'(value) {
      if (!value && this.awaiting_atc_code) { 
        this.add_atc_code = true;
        this.awaiting_atc_code = false; 
      }
    }
  },

  methods: {
      changeWindow(step) {
        this.current_window = Math.min(Math.max(1, this.current_window + step), this.total_windows);
      },

      openDialog(codeType) {
          this.sel_adm_process.id = codeType;
          this.sel_adm_process.display = true;
          this.sel_adm_process.name =
              codeType === 'qr' ? 'Generate QR Code' :
              codeType === 'sms' ? 'Generate SMS Message' :
              codeType === 'qrscanner' ? 'Scan QR Image' :
              codeType === 'card-scan' ? 'Scan Smart Card' : '';
          this.sel_adm_process.icon =
              codeType === 'qr' ? 'mdi-qrcode' :
              codeType === 'sms' ? 'mdi-message-processing' :
              codeType === 'qrscanner' ? 'mdi-qrcode-scan' : 
              codeType === 'card-scan' ? 'mdi-card-account-details' : '';
          if (codeType === 'qr') {
            this.qrCode();
          } else if (codeType === 'sms') {
            this.smsAddData();
          } else if (codeType === 'qrscanner') {
            this.openScanner();
          } else if (codeType === 'card-scan') {
            this.readCards()
          }
      },

      async getLocalIP() {
        return new Promise((resolve, reject) => {
          const pc = new RTCPeerConnection({ iceServers: [] });
          pc.createDataChannel("");
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .catch(reject);

          pc.onicecandidate = (ice) => {
            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
            const parts = ice.candidate.candidate.split(" ");
            const ip = parts[4];
            resolve(ip);
            pc.close();
          };
        });
      },

      getLocalIPs() {
        const ips = new Set();
        const pc = new RTCPeerConnection({ iceServers: [] });

        pc.createDataChannel(""); // create a bogus data channel

        pc.onicecandidate = (event) => {
          if (!event.candidate) {
            // ICE gathering finished
            this.localIps = Array.from(ips);
            pc.close();
            return;
          }

          const candidate = event.candidate.candidate;
          const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = candidate.match(ipRegex);
          if (match) {
            ips.add(match[1]);
          }
        };

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(console.error);
      },

      async readCards(){
        this.smart_card_loader = true
        // Prepare the data in URL-encoded format
        const data = new URLSearchParams();
        data.append('Xr8', 'read_data');
        data.append('T0x', 'EKBVAC23D34C802134');

        // Make the POST request
        this.$axios.post(`http://${this.user_local_ip}:1900/api/cardissuance/ReadCard`, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          this.smart_card_loader = false
          if(response.data.pYj) {
            this.displayMemberData(response.data.pYj)
          } else {
            this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'Smart Card Reader', body: 'Failed to read card', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
          }
        })
        .catch(error => {
          this.smart_card_loader = false
          this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'Smart Card Reader', body: "No driver's connected. Please try again later.", btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
          console.error("Error in request:", error);
        });
      },

    async readCard() {
      const data = "Xr8=read_data&T0x=EKBVAC23D34C802134";
      // let smart_card_ek_lgu_id = ''
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          const smart_card_res = JSON.parse(this.responseText);
          console.log(smart_card_res)
          // if(smart_card_res.pYj){
          //   console.log(smart_card_res)
          //   // smart_card_ek_lgu_id = smart_card_res.pYj
          //   // this.displayMemberData(smart_card_ek_lgu_id)
          // } else {
          //   console.log(smart_card_res)
          // }
        }
      });

      xhr.open("POST", "http://10.0.4.16:1900/api/cardissuance/ReadCard");
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
      console.log(xhr.statusText)
      if(xhr.status === 200) {
        this.displayMemberData()
      }
    },

      openQRScanner() {
        this.openDialog('qrscanner');
      },
    
      generateSMSCode() {
        this.openDialog('sms');
      },

      generateQRCode() {
        this.openDialog('qr');
      },
      
      verifyUser(){
        this.user_verification = true
      },

      verifyCancel(){
        this.user_verification = false
      },

      goToRegistration() {
        this.$router.push({ path: '/registration', params: { name: 'offline' }});
      },
      
      dispenseMedicine() {
        this.$router.push('/dispense-medicine');
      },

      queList() {
        this.$router.push('/queue-list');
      },

      questionaireSurvey() {
        this.$router.push('/ehss');
      },

      async updatePhicMasterList() {
        this.phic_master_list_loader = true
        let response = await this.$services.trnAddDownloadMasterList({
          phic_token : this.$store.state.prv_data.phic_token
        })

        if(response.status === 200) {
          this.phic_master_list_loader = false
          response.data = this.responseDataDecryption(response.data)
          if(response.data.success) {
            this.getPhicMasterList(response.data.xml_tmp_name)
          } else {
            this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-check-circle', color: 'success', title:'Download Philhealth Master List', body: response.data.message, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
          }
        } else {
          this.phic_master_list_loader = false
          this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-alert-circle', color: 'red', title:'PhilHealth server failed', body: 'The system is unable to download or update new Yakap members in the masterlist.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
        }
      },

      async getPhicMasterList(value) {
        let response = await this.$services.syncEkonsultaMasterList({
          xml_tmp_name : value,
          provider_code: this.$store.state.prv_data.provider_code,
          phic_accre_no: this.$store.state.prv_data.ekonsulta_phic_acc_no
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.phic_master_list_loader = false
          if(response.data.success) {
            this.mt_dialog = true
            this.mt_data = response.data
          } else {
            this.alert = {display:true, type: 'standard', width: 550, icon: 'mdi-check-circle', color: 'success', title:'Download Philhealth Master List', body: response.data.message, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
          }
        } else {
            this.phic_master_list_loader = false
            this.alert = response.error
        }
      },

      closeAdmProcess() {
        if (this.sel_adm_process.id == 'qr' || this.sel_adm_process.id == 'sms') this.removeTimeout()
        if (this.sel_adm_process.id == 'qrscanner') this.closeScanner()
        return this.sel_adm_process = {display: false}
      },

      // GET QR IMAGE AND QR DATA
      async qrCode() {
          let response = await this.$services.index({
            JX15Y : this.$store.state.usr_credentials.user_code,
            old_qr_filename: this.qr_filename,
          })

          if(response.status === 200) {
            response.data = this.responseDataDecryption(response.data)
            this.qr_img = response.data.qr_img
            this.qr_data = response.data.qr_data
            this.qr_filename = response.data.qr_filename
            this.reloadQrImage();
            this.checkQRStatus();
          } else {
              this.alert = response.error
          }
      },

      // GETS THE DATA OF USER WHO SCANNED THE QR IMAGE
      async checkQRStatus() {
        let response = await this.$services.getMemberQrStatus({
          JX15Y: this.$store.state.usr_credentials.user_code,
          qr_data: this.qr_data,
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          if (!response.data.app_status) { 
              this.qr_timeout = setTimeout(() => this.checkQRStatus(), 3000)
          } else {
            this.qr_page_process = 'qr_sms'
            this.mem_policy_no = response.data.mem_policy_no;
            this.hmo_host_code = response.data.hmo_host_code;
            this.ek_lgu_id  = response.data.ek_lgu_id
            this.lgu_host_code  = response.data.lgu_host_code
            this.registration_type  = response.data.registration_type
            this.member_selection_loader = true
            this.displayMemberData()
            this.closeAdmProcess();
          }
        } else {
          this.lgu_overlay = false;
          this.overlay_loader = false;
          this.alert = response.error
        }
      },

      // RELOADS QR IMAGE
      reloadQrImage() {
        this.qr_reload_timeout = setTimeout(() => {
          clearTimeout(this.qr_timeout)
          this.qr_img = this.qr_data = null
          this.qrCode()
          // this.reloadQrImage()
        },120000)
      },

      // PASS SMS CODE TO THE SERVER
      async smsAddData() {
        const sms_code = Math.random().toString().slice(2, 9)

        let response = await this.$services.smsAddWebLog({
          user_code: this.$store.state.usr_credentials.user_code,
          created_by: this.$store.state.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code,
          access_number: sms_code,
        })

        if(response.status === 200) {
          this.sms_code = sms_code
          return this.check_sms_status();
        } else {
          this.alert = response.error
        }
      },

      // GETS THE DATA FROM USER WHO TEXTED THE SMS CODE
      async check_sms_status() {
        let response = await this.$services.getSmsCheckLogByAccessNo({
          access_number: this.sms_code,
          user_code: this.$store.state.usr_credentials.user_code,
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          if (response.data.status === '3') return this.sms_timeout = setTimeout(() => this.check_sms_status(), 3000)
          if (response.data.status === '2' && response.data.user_code === this.$store.state.usr_credentials.user_code) {
            this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Mobile number is not recongnized', body: 'Please use your registered mobile number', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            return
          }
          this.qr_page_process = 'qr_sms'
          this.mem_policy_no = response.data.mem_policy_no;
          this.hmo_host_code = response.data.hmo_host_code;
          this.ek_lgu_id     = response.data.ek_lgu_id
          this.lgu_host_code  = response.data.lgu_host_code
          this.registration_type  = response.data.registration_type
          this.member_selection_loader = true
          this.displayMemberData()
          this.closeAdmProcess();
        } else {
          this.alert = response.error
        }
      },

      async openScanner() {
        this.loading_qr_scanner = true

        const has_camera = await QrScanner.hasCamera()
        if (!has_camera) {
          this.sel_adm_process = {display: false}
          this.loading_qr_scanner = false
          return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: 'The camera is not detected or it may not be supported by the browser.',  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
        }

        try {
            const video = document.getElementById('previews')
            this.qrScanner = new QrScanner(video, result => this.getScannedContent(result), {
              highlightScanRegion: true,
            });
            this.qrScanner.start();
            this.loading_qr_scanner = false
        } catch (err) {
          return this.alert = { display: true, type: 'standard',  width: '620',  icon: 'mdi-alert-circle',  color: 'blue darken-1',  title: err,  btn_pry_txt: 'close', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert', btn_pry_emt: 'closeAdmProcess'}
        }
      },

      closeScanner() {
        this.qrScanner.destroy();
        this.qrScanner = null
      },

      async getScannedContent(content) {
        this.qrScanner.stop();
        const value = this.wsDataDecryption(content.data)
        
        if (value == 'Decryption Failed') {
          this.closeAdmProcess()
          return this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Invalid QR Image', body: 'Please make sure to use the QR image for eCare System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        } 
        const get_ek_system = value.substring(0,8)
        const split_text = value.split('-')
        const get_ek_lgu_id = `${split_text[0].substring(9)}-${split_text[1]}-${split_text[2]}`
        const get_current_card_key = split_text[3]
        const get_card_type = split_text[4]

        if(get_ek_system === 'EKSYSTEM'){
          this.loading_qr_scanner = true
          let response = await this.$services.getMemberCardKey({
            ek_lgu_id: get_ek_lgu_id
          })

          if(response.status === 200) {
            response.data = this.responseDataDecryption(response.data)

            this.loading_qr_scanner = false
            this.closeAdmProcess()
            if (response.data.message) {
              return this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'red', title: 'Cannot identify card holder', body: 'The card holder has no record or not yet registered in eCare System', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            } 

            if (get_card_type == 'W' && response.data.is_card_released == '0') {
              return this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: 'Card is not Active', body: 'This card haven\'t issued or activated yet', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            } 

            if (get_current_card_key !== response.data.current_card_key) {
              return this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'This card is already Deactivated', body: 'Please use the latest HealthCard', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            } 

            this.qr_page_process = 'qr_sms'
            this.registration_type = 'LGU'
            this.ek_lgu_id = response.data.ek_lgu_id
            this.member_selection_loader = true
            return this.displayMemberData('img-scan');
          } else {
            this.alert = response.error
          }
        }else{
          this.alert = { display: true, type: 'standard', width: '400', icon: 'mdi-alert-circle', color: 'red', title: 'The QR Code is not an eCare System Valid QR Code', body: '', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.closeAdmProcess()
        }
      },

      // FOR DISPLAYING THE LIST OF MEMBERS
      async displayMemberData(scan) {
        this.member_selection_dialog = true;
        this.member_selection_loader = true;

        if (scan !== 'img-scan' && scan) {
          this.ek_lgu_id = scan;
        }

        let response = await this.$services.getMemberListQr({
          mem_hmo_policy_numbe: this.mem_policy_no,
          hmo_host_code: this.hmo_host_code,
          ek_lgu_id: this.ek_lgu_id,
          provider_code: this.$store.state.prv_data.provider_code,
          lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
        });

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data);
          this.member_selection_loader = false;

          if (this.registration_type !== 'LGU' && !response.data.has_lgu_data) {
            this.member_selection_dialog = false;
            return this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: "Data not found", body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' };
          }

          this.process_type = 'LGU';
          if (this.ek_lgu_id) {
            this.member = response.data.member_data.filter(item => item.ek_lgu_id === this.ek_lgu_id);
          } else if (scan === 'img-scan') {
            this.is_qr_scanner = true;
            this.member = response.data.member_data.filter(item => item.ek_lgu_id === this.ek_lgu_id);
          } else {
            this.member = response.data.member_data; 
          }
        } else {
          this.member_selection_loader = false;
          this.alert = response.error;
        }
      },

      // async displayMemberData(scan) {
      //   this.member_selection_dialog = true;
      //   let response = await this.$services.getMemberListQr({
      //     mem_hmo_policy_numbe: this.mem_policy_no,
      //     hmo_host_code: this.hmo_host_code,
      //     ek_lgu_id: this.ek_lgu_id,
      //     provider_code: this.$store.state.prv_data.provider_code,
      //     lgu_host_code: this.$store.state.usr_credentials.lgu_host_code
      //   })

      //   if(response.status === 200) {
      //     response.data = this.responseDataDecryption(response.data)
      //     this.member_selection_loader = false
      //     if (this.registration_type !== 'LGU' && !response.data.has_lgu_data) {
      //       this.member_selection_dialog = false;
      //       return this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'red', title: "Data not found", body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //     }
          
      //     this.process_type = 'LGU'
      //     if(scan === 'img-scan'){
      //       this.is_qr_scanner = true
      //       this.member = response.data.member_data.filter(item => item.ek_lgu_id === this.ek_lgu_id)
      //     }else{
      //       this.member = response.data.member_data
      //     }
      //   } else {
      //     this.member_selection_loader = false
      //     this.alert = response.error
      //   }
      // },

      // FOR SELECTING DATA IN MEMBER SELECTION DIALOG
      selectedRowLGU(item) {
        this.selected_ek_lgu_id = item.ek_lgu_id
        this.ek_lgu_id = item.ek_lgu_id
        this.lgu_host_code = item.lgu_host_code 
      
        this.fname = item.mem_first_name ? item.mem_first_name : '';
        this.lname = item.mem_last_name ? item.mem_last_name : '';
        this.mname = item.mem_middle_name ? item.mem_middle_name : '';
        this.suffix = item.mem_suffix ? item.mem_suffix : ''
        this.birthdate = item.mem_birthdate ? this.formatDate(item.mem_birthdate) : null
      },

      selectedRow(item) {
        this.member_name = item.member_name
        this.selected_ek_hmo_id = item.ek_hmo_id;
        this.selected_birthday = item.mem_birthdate
        this.mem_policy_no = item.mem_hmo_policy_number
        this.ek_lgu_id = item.ek_lgu_id ? item.ek_lgu_id : null;
        this.ek_phic_id = item.ek_phic_id ? item.ek_phic_id : null;
        this.lgu_host_code = item.lgu_host_code ? item.lgu_host_code : null;

        if (this.catch_data.restriction === true && this.mem_policy_no !== this.catch_data.policy.toUpperCase() && this.member_name.toUpperCase().trim() !== this.catch_data.name.toUpperCase().trim()) {
          this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'You cannot select this member', body: 'Patient Data mismatched.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          this.member_name = "";
          this.mem_policy_no = "";
        }

        this.fname = item.mem_first_name ? item.mem_first_name : '';
        this.lname = item.mem_last_name ? item.mem_last_name : '';
        this.mname = item.mem_middle_name ? item.mem_middle_name : '';
        this.suffix = item.mem_suffix ? item.mem_suffix : ''
        this.birthdate = item.mem_birthdate ? item.mem_birthdate : null 
      },

      //CHECK FOR EKONSULTA ELIGIBILITY
      async checkEkonsultaEligibility() {
        this.mem_btn_loader = true
        let response = await this.$services.getEkonsultaEligibilityChecker({
          pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no,
          pPatientFname: this.member[0].mem_first_name,
          pPatientMname: this.member[0].mem_middle_name,
          pPatientLname: this.member[0].mem_last_name,
          pPatientExtname: this.member[0].mem_suffix,
          pPatientDob: this.member[0].mem_birthdate,
          pPhicPin: this.member[0].mem_phic_pin,
          pPatientType: this.member[0].lgu_member_type === 'PRINCIPAL' ? 'MM' : 'DD',
          phic_token : this.$store.state.prv_data.phic_token
        })
        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.mem_btn_loader = false
          if(response.data.konsulta_eligible){          
            this.eligible_data = response.data
            return true;
          }
          return false;
        } else {
          this.ekonsulta_err = true
          this.eligible_data = { konsulta_eligible: false }
          // this.alert = response.error
        }
      },
      
      //CHECK FOR ECLAIMS ELIGIBILITY
      async getEclaimsWebService() {
        this.mem_btn_loader = true
        let response = await this.$services.getEclaimsWebService({
            provider_code: this.$store.state.prv_data.provider_code,
            request_key: "GMPM",
            data: {
                firstname: this.member[0].mem_first_name,
                middlename: this.member[0].mem_middle_name,
                lastname: this.member[0].mem_last_name,
                suffix: this.member[0].mem_suffix ? this.member[0].mem_suffix : "",
                birthdate: this.formatDate(this.member[0].mem_birthdate)
            }
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.mem_btn_loader = false
          if(response.data.pin){          
            this.eligible_data = {
              ...this.eligible_data,
              eclaims_eligible: response.data.pin ? true : response.data.success
            }
            return true;
          } 
          return false; 
        } else {
          this.alert = response.error
        }
      },

      //CHECK FOR THE ATC CODE
      async checkAtcCode() {
        this.atc_confirm_loader = true
        let date = new Date()
        let year = date.getFullYear()
        let month = String(date.getMonth()+1).padStart(2,"0")
        let day = String(date.getDate()).padStart(2, '0');

        if(this.atc_code !== ''){
          let response = await this.$services.getEkonsultaAtcChecker({
              pPatientPin: this.eligible_data.pPatientPin,
              pATC: this.atc_code,
              pEffectivityDate: month + '/' + day + '/' + year,
              phic_token: this.$store.state.prv_data.phic_token
            })

            if(response.status === 200) {
                response.data = this.responseDataDecryption(response.data)

              if(response.data.valid){
                this.atc_response = response.data.pATC
                this.overlay_loader = true
                this.lgu_overlay    = true
                this.atc_confirm_loader = false
                this.atc_code_error = ''
                this.proceedEligibility()
              } else {
                this.atc_code_error = 'This ATC Code is Invalid'
                this.atc_confirm_loader = false
              }
            } else {
                this.alert = response.error
            }
        } else {
          this.atc_code_error = 'Required'
          this.atc_confirm_loader = false
        }
      },

      // VALIDATES SELECTED DATA WHEN USER CLICKS CONFIRM IN MEMBER SELECTION DIALOG
      async validateSelectedMember() {
        if (this.process_type === 'LGU') {
          if(this.selected_ek_lgu_id) {
            this.mem_btn_loader = true

            let eligible_in_ekonsulta = false;
            let eligible_in_eclaims = false;

            if (this.$store.state.prv_config.ekonsulta_accre) {
              let ekonsulta_response = await this.checkEkonsultaEligibility();
              eligible_in_ekonsulta = ekonsulta_response;
            }
            
            if (this.$store.state.prv_config.eclaims_accre) {
              let eclaims_response = await this.getEclaimsWebService();
              eligible_in_eclaims = eclaims_response;
            }
            
            if (this.$store.state.prv_config.ekonsulta_accre && eligible_in_ekonsulta && eligible_in_eclaims) {
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'Eligibility Confirmation', body: 'This member is eligible for both eClaims and Yakap.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert'}
              this.awaiting_atc_code = true
            } else if(this.$store.state.prv_config.eclaims_accre && eligible_in_ekonsulta && eligible_in_eclaims) {
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'success', title: 'eClaims Eligibility', body: 'This member is eligible for both eClaims and Yakap.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
            } else if (eligible_in_ekonsulta) {
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'Yakap Eligibility', body: 'This member is eligible for Yakap.', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
              this.awaiting_atc_code = true
            } else if (eligible_in_eclaims) {
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-check-circle', color: 'success', title: 'eClaims Eligibility', body: 'This member is eligible for eClaims', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
            } else {
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'eClaims and Yakap Eligibility', body: 'This member is not eligible for both eClaims and Yakap. You can register the member through the PhilHealth portal.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
            }

            if(this.ekonsulta_err){
              this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'Philhealth Yakap Eligibility', body: 'Connection to the PhilHealth server failed. The system cannot verify member eligibility at this time.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
            }

          } else {
             this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please select a member', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          }
        } else { //HMO | HMO_PHIC | HMO_PHIC_LGU | HMO_LGU
          if (!this.selected_ek_hmo_id || !this.mem_policy_no) {
             this.alert = { display: true, type: 'standard', width: '450', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Selection required', body: 'Please select a member', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          } else {
            if (this.qr_page_process === 'qr_sms' && (this.registration_type === 'HMO_PHIC' || this.registration_type === 'HMO_PHIC_LGU')) {
              if (!this.fname && !this.lname && !this.birthdate) {
                  this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: 'Cannot Check Philhealth Eligibility Status', body: 'Member Name is Incomplete', btn_pry_txt: 'cancel', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert',  btn_sec_txt: 'Proceed Eligibility', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
                  return
              }
              this.overlay_loader = true; 
              this.callPHICApi(this.mem_policy_no,this.qr_first_name,this.qr_middle_name,this.qr_last_name,this.qr_suffix,this.qr_mem_birthdate,"","qr_sms");
          
            } else if (this.qr_page_process === 'qr_sms' && (this.registration_type === 'HMO' || this.registration_type === 'HMO_LGU')) {
                this.mem_btn_loader = true
                this.overlay_loader = true
                this.lgu_overlay    = true
                this.process_type = this.registration_type === 'HMO_LGU' ? 'HMO_LGU' : 'HMO'

                const data = await this.getMemberRequest()
                if(data.has_data === false) {
                  this.proceedEligibility()
                } else {
                  this.proceedELOA(data.data)
                }
            } else { // TYPE IN 
              if (this.qr_page_process === 'type_in' && this.process_type === 'HMO') {
                  this.mem_btn_loader = true
                  this.overlay_loader = true
                  this.lgu_overlay    = true
                  const data = await this.getMemberRequest()
                  if(data.has_data === false) {
                    this.proceedEligibility()
                  } else {
                    this.proceedELOA(data.data)
                  }
              } else {
                if (this.member_name.trim() !== this.typein_fullname && this.selected_birthday !== this.$moment(this.typein_birthdate).format('YYYY-MM-DD'))  return this.patient_mismatch_alert = true
                this.selection_confirm_disp = true
              }
            }
          }
        }
      },

      // WHEN USER CLICKS CONFIRM IN SELECTION CONFIRM DIALOG
      async confirmSubmit() {
        this.confirm_loader = true
        this.overlay_loader = true
        this.lgu_overlay    = true
        //this.show_alert_ekonsulta = false
        const data = await this.getMemberRequest()
        if(data.has_data === false) {
          this.proceedEligibility()
        } else {
          this.proceedELOA(data.data)
        }
      },

      // GET THE DATA FROM API FOR VALIDATING IF PROCEED TO ELIGIBILITY OR ELOA
      async getMemberRequest(){
        let response = await this.$services.getMemberRequestType({
          hmo_policy_number :this.mem_policy_no,
          provider_code: this.$store.state.prv_data.provider_code,
          provider_tin: this.$store.state.prv_data.provider_tin,
          hmo_host_code: this.hmo_host_code,
          ek_phic_id: this.ek_phic_id,
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          if (response.data.has_pending_transaction) {
            this.mem_btn_loader = false
            this.overlay_loader = false
            this.lgu_overlay    = false
            this.alert = { display: true, type: 'standard', width: '550', icon: 'mdi-alert-circle', color: 'yellow darken-1', title: "Transaction on going", body: 'This patient has on going transaction and needs to be completed before proceeding to another transaction', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
          } else {
            return response.data
          }
        } else {
          this.alert = response.error
        }
      },

      // SUBMITS DATA TO TRN ADD ELIGIBILITY AND REDIRECTS TO ELIGIBILITY PAGE
      async proceedEligibility() {
        // let response = await this.$services.trnAddEligibility({
        //   provider_tin: this.$store.state.prv_data.provider_tin,
        //   provider_code: this.$store.state.prv_data.provider_code,
        //   transaction_type: "ELIGIBILITY",
        //   hmo_healthcare_status: "",
        //   mem_hmo_policy_number: this.mem_policy_no ? this.mem_policy_no : null,
        //   hmo_host_code: this.hmo_host_code ? this.hmo_host_code : null,
        //   ek_phic_id: this.ek_phic_id ? this.ek_phic_id : null,
        //   ek_lgu_id: this.ek_lgu_id ? this.ek_lgu_id : null,
        //   lgu_host_code : this.$store.state.usr_credentials.lgu_host_code ? this.$store.state.usr_credentials.lgu_host_code : null,
        //   created_by: this.$store.state.usr_credentials.user_name,

        //   ...(this.process_type !== 'HMO' ?  {
        //       last_name:  this.lname ? this.lname.toUpperCase() : null,
        //       first_name: this.fname ? this.fname.toUpperCase() : null ,
        //       middle_name: this.mname ? this.mname.toUpperCase() : null,
        //       initial: this.suffix ? this.suffix.toUpperCase() : null,
        //       birthday: this.birthdate,
        //   } : undefined),

        //   ...(this.phic_member_eligibility_status === 'Eligible' ? {
        //       gender: this.mem_gender,
        //       email_add: this.mem_email,
        //       phone_no: this.mem_phone_no,
        //       mobile_no: this.mem_mobile_no,
        //       mailing_add: this.mailing_address,
        //       phic_member_type: this.member_type,
        //       phic_member_status: this.mem_phic_status,
        //       phic_member_category: this.member_category,
        //       prn_phic_member_type: this.member_type,
        //       prn_member_pin: this.mem_phic_pin,
        //       prn_first_name: this.principal_data.FIRST_NAME._text,
        //       prn_middle_name: this.principal_data.MIDDLE_NAME._text,
        //       prn_last_name: this.principal_data.LAST_NAME._text,
        //       prn_suffix: this.principal_data.SUFFIX._text,
        //       prn_initial: "",
        //       prn_birthday: this.principal_data.BIRTHDATE._text,
        //       prn_gender: this.principal_data.GENDER._text ? this.principal_data.GENDER._text.charAt(0) === "M"? "MALE": "FEMALE" : null,
        //       prn_zip_code: this.principal_data.ZIP_CODE._text,
        //       prn_phone_no: this.principal_data.PHONE_NO._text,
        //       prn_mobile_no: this.principal_data.MOBILE_NO._text,
        //       prn_email_add: this.principal_data.EMAIL_ADDRESS._text,
        //       phic_member_eligibility_status: this.phic_member_eligibility_status,
        //   } : undefined)
        // })

        // if(response.status === 200) {
        //   response.data = this.responseDataDecryption(response.data)
        //   if (!response.data.success) {
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     return
        //   }

          this.dataSession('eligibility', null, null)
          this.$store.commit("setMemberAuth", Math.random().toString(25).substring(3, 15) + this.$moment().format("ss"));
          this.$router.push("/eligibility");
        // } else {
        //   this.alert = response.error
        // }
      },

      // PROCEEDS TO ELOA PAGE
      proceedELOA(eloa_data) {
        this.dataSession('eloa',null,eloa_data)
        this.$router.push("/eloa-list");
      },

      // SESSIONS THE DATA NEEDED BEFORE REDIRECTING TO A SPECIFIC PAGE
      dataSession(type,request_id,eloa_data) {
        let lgu_data = {}, member_phic_data = {}, trn_add_phic_data = {}, member_name = []

        if (this.process_type.includes('PHIC')) {
          member_name = [ this.fname, this.mname, this.lname, this.suffix, this.birthdate]
          member_phic_data = {
            ek_phic_id: this.ek_phic_id,
            mem_phic_pin: this.mem_phic_pin,
            phic_tracking_num: this.phic_tracking_number,
            mem_phic_mem_type: this.member_type ? this.member_type: "N/A",
            mem_category: this.member_category ? this.member_category: "N/A",
            mem_mailing_address: this.mailing_address ? this.mailing_address : "N/A",
            mem_name: this.phic_member_name ? this.phic_member_name.toUpperCase(): "N/A",
            mem_ph_status:  this.mem_phic_status ? this.mem_phic_status : this.phic_member_eligibility_status,
            principal_data: this.principal_data ? this.principal_data: [],
            ...(this.process_type === 'PHIC' || this.process_type === 'HMO_PHIC' ? {
                mem_gender           : this.mem_gender,
                mem_mobile_number    : this.mem_mobile_number, 
                mem_landline_number  : this.mem_landline_number, 
                mem_email_address    : this.mem_email,
                mem_company_name     : this.mem_company_name, 
            } : undefined) 
          }

          sessionStorage.setItem("JFD43",this.$crypto.AES.encrypt(JSON.stringify(member_name),"lfFo34sf")); // MEMBER_NAME
          sessionStorage.setItem("MPS24",this.$crypto.AES.encrypt(JSON.stringify(member_phic_data),"lfFo34sf"));// MEMBER_PHIC_DATA
          sessionStorage.setItem("ROTSR",this.$crypto.AES.encrypt(this.phic_member_eligibility_status,"lFdt04sg"));// ELIGIBILITY STATUS
        }

        if (this.process_type.includes('LGU')) {
          lgu_data = { ek_lgu_id : this.ek_lgu_id, lgu_host_code : this.lgu_host_code}
          sessionStorage.setItem("LMS35", this.$crypto.AES.encrypt(JSON.stringify(lgu_data), "lfFo34sf")); // MEMBER LGU DATA
          let eligible_data = {}
          
          if (this.eligible_data.konsulta_eligible) {
            eligible_data = {
              atc: this.atc_response ? this.atc_response:'WALKEDIN', 
              ...this.eligible_data
            }
            
          } else if (this.eligible_data.eclaims_eligible) {
            eligible_data = {
                konsulta_eligible: false,
                eclaims_eligible: true
            }
          }else {
            eligible_data = {
                konsulta_eligible: false,
                eclaims_eligible: false
            }
          }
          
          sessionStorage.setItem("YETBS",this.$crypto.AES.encrypt(JSON.stringify(eligible_data),"ygrGk2dX")); // EKONSULTA INFORMATION
        }

        if (this.process_type.includes('HMO')) {
          sessionStorage.setItem("IJ19Y0X15I",this.$crypto.AES.encrypt(this.hmo_host_code,"heIu1h1Dn1w").toString());
          sessionStorage.setItem("IJ9NX250I15", this.$crypto.AES.encrypt(this.mem_policy_no, "heIu1h1Dn1w").toString());
          request_id && type === 'eligibility' ? sessionStorage.setItem("ETR6G",this.$crypto.AES.encrypt(request_id,"lfFo34sf")) : null
        }

        if (type === 'eloa') {
          sessionStorage.setItem("LSD0IDX",this.$crypto.AES.encrypt(JSON.stringify(eloa_data),"heIu1h1Dn1w")); //ELOA DATA
          sessionStorage.setItem("ISDTYXL", this.$crypto.AES.encrypt(JSON.stringify(this.member_name), "heIu1h1Dn1w")); //MEMBER NAME
          if(this.process_type.includes('PHIC')) {
            trn_add_phic_data = {
              ek_phic_id: this.ek_phic_id,
              phic_member_type: this.member_type,
              phic_member_category: this.member_category,
              last_name: this.lname ? this.lname.toUpperCase() : '',
              first_name: this.fname ? this.fname.toUpperCase() : '',
              middle_name: this.mname ? this.mname.toUpperCase() : '',
              initial: this.suffix ? this.suffix : '',
              birthday: this.birthdate ? this.birthdate : '',
              gender: this.mem_gender,
              email_add: this.mem_email,
              phone_no: this.mem_phone_no,
              mobile_no: this.mem_mobile_no,
              mailing_add: this.mailing_address,
              prn_member_pin: this.mem_phic_pin,
              principal_data: this.principal_data,
              prn_phic_member_type: this.member_type,
              phic_member_status: this.mem_phic_status,
              provider_tin: this.$store.state.prv_data.provider_tin,
              phic_tracking_number: this.phic_tracking_number? this.phic_tracking_number: "N/A",
            };
            sessionStorage.setItem("TRP3S",this.$crypto.AES.encrypt(JSON.stringify(trn_add_phic_data),"lfFo34sf"));//TRN_ADD_PHIC_DATA
          }
        }
        sessionStorage.setItem("GF45S", this.$crypto.AES.encrypt(this.process_type,"fgGds32s"))
      },

      // CANCELS THE MEMBER SELECTION DIALOG
      showCancel() {
         
         this.alert = { 
          display: true, 
          type: 'standard', 
          width: '550', 
          icon: 'mdi-help-circle', 
          color: 'blue darken-1', 
          title: 'Are you sure you want to cancel?', 
          body: 'This will reload the page and you will have to make an entry again', 
          btn_pry_txt: 'yes', 
          btn_pry_color: 'primary', 
          btn_pry_otl: false, 
          btn_pry_act: this.process_type.includes('HMO') ? 'loadingBtn' : 'reloadPage',  
          btn_pry_emt: this.process_type.includes('HMO') ? 'cancel' : '',
          btn_sec_txt: 'no', 
          btn_sec_color: 'secondary', 
          btn_sec_otl: true, 
          btn_sec_act: 'closeAlert',
        }
      },

      async cancel() {
        let response = await this.$services.trnDelNameById({
          mem_hmo_policy_number   :   this.mem_policy_no ? this.mem_policy_no : this.policy_typein.trim(),
        })

        if(response.status === 200) {
          this.$router.go()
        } else {
          this.alert = response.error
        }
      },

      async callPHICApi(policy,fname,mname,lname,suffix,bday,fullname,mem_data,type) {
        let response = await this.$services.getMemberEligibilityPhic({
          mem_first_name: fname,
          mem_middle_name: mname,
          mem_last_name: lname,
          mem_suffix_name: suffix,
          mem_birthdate: this.$moment(bday).format('YYYY-MM-DD'),
        })

        if(response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          let xml_result = xml.xml2json(response.data, {compact: true,spaces: 4,});
          let result = JSON.parse(xml_result)
          let title = ''
          let subtitle = ''
          let body = 'Do you want to proceed to Eligibility Page?'//+sub_body
          let icon = "fas fa-exclamation-circle"
          let color = "red lighten-1"
          let on_alert = false   
          let proceed_eligibility = false 
  
          this.overlay_loader = false;
          // GET DATA IF RESULT IS 1
          if(result.RESPONSE._attributes.RESULT === "1") {
            this.phic_host_code       = result.RESPONSE._attributes.HOST_CODE;
            this.phic_member_name     = result.RESPONSE.MEMBER_DATA.FIRST_NAME._text +" " +result.RESPONSE.MEMBER_DATA.LAST_NAME._text +" " +result.RESPONSE.MEMBER_DATA.MIDDLE_NAME._text;
            this.mem_phic_pin         = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_PIN ? result.RESPONSE.PATIENT_DATA._attributes.MEMBER_PIN : null;
            this.ek_phic_id           = result.RESPONSE.PATIENT_DATA._attributes.PATIENT_EK_PHIC_ID ? result.RESPONSE.PATIENT_DATA._attributes.PATIENT_EK_PHIC_ID : null;
            this.mem_gender           = result.RESPONSE.PATIENT_DATA.GENDER._text ?  result.RESPONSE.PATIENT_DATA.GENDER._text.charAt(0) === "M" ? "MALE" : "FEMALE" : 'MALE';
            this.mem_phone_no         = result.RESPONSE.PATIENT_DATA.PHONE_NO._text;
            this.mem_mobile_no        = result.RESPONSE.PATIENT_DATA.MOBILE_NO._text;
            this.mem_email            = result.RESPONSE.PATIENT_DATA.EMAIL_ADDRESS._text;
            this.mem_company_name     = result.RESPONSE.PATIENT_EMPLOYMENT.COMPANY_NAME._text;
            this.mem_phic_status      = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_STATUS;
            this.member_type          = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_TYPE ? result.RESPONSE.PATIENT_DATA._attributes.MEMBER_TYPE.charAt(0) ==="P" ? "PRINCIPAL": "DEPENDENT" : null;
            this.principal_data       = result.RESPONSE.MEMBER_DATA;
            this.member_category      = result.RESPONSE.PATIENT_DATA._attributes.MEMBER_CATEGORY;
            this.mailing_address      = result.RESPONSE.PATIENT_DATA.MAILING_ADDRESS._text;
            this.phic_tracking_number = result.RESPONSE._attributes.PHIC_TRACKING_NUMBER ? result.RESPONSE._attributes.PHIC_TRACKING_NUMBER : 'N/A';
          }

          switch (result.RESPONSE._attributes.RESULT) {
            case "1":
              if (mem_data && type === 'type_in') { // TYPE IN WITH HMO
                this.catch_data.name = fullname ? fullname.toUpperCase() : ''
                this.catch_data.policy = policy;
                this.catch_data.birthdate = bday;
                this.catch_data.restriction = true;

                this.member_selection_dialog = true
                this.overlay_loader = false
                this.typein_loader = false
                this.process_type = 'HMO_PHIC';
              } else if (mem_data && type === 'qr_sms') { // QR/SMS
                this.selection_confirm_disp = true;
                this.process_type = this.registration_type === 'HMO_PHIC_LGU' ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
              } else { // QR/SMS OR TYPEIN WITHOUT MEM_DATA
                on_alert = policy ? true : false 
                proceed_eligibility = true
                title = 'No record found in Health Insurance Company'
                this.process_type =  this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
              }
              this.phic_member_eligibility_status = "Eligible";
              break;

            case "2":
              on_alert = true
              title ='Patient: <h4 class="font-weight-medium">' +fullname+"</h4>";
              body = "is currently admitted"
              this.typein_loader = false
              break;

            case "3":
              on_alert = true
              if (mem_data) {
                subtitle = '<h5 class="mb-2">This Transaction might be covered by HMO only.</h5>'
                title ='Multiple records found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
                this.submit_confirm = true
                this.process_type = this.registration_type === 'HMO_PHIC_LGU'  ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
              } else {
                subtitle =  policy ? '<h5 class="mb-2">on both Health Insurance Company and PhilHealth.</h5>' : ''
                title ='Multiple records found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
                this.process_type = this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
              }
              this.phic_member_eligibility_status = "Multiple Records Found"; 
              break;

            case "4":
              on_alert = true
              icon  = "fas fa-exclamation-circle"
              color = "yellow darken-1"
              title = "Transaction On Going"
              body  = "This patient has on going transaction and needs to be completed before proceeding to another transaction."
              this.typein_loader = false
              break;

            default:
              on_alert = true
              if (mem_data) {
                subtitle = '<h5 class="mb-2">This Transaction might be covered by HMO only.</h5>'
                title ='No record found for patient:<h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
                this.submit_confirm = true;
                this.process_type = this.registration_type === 'HMO_PHIC_LGU'  ? 'HMO_PHIC_LGU' : 'HMO_PHIC';
              } else {
                subtitle =  policy ? '<h5 class="mb-2">on both Health Insurance Company and PhilHealth.</h5>' : ''
                title ='No record found for patient: <h4 class="font-weight-medium">' +fullname+'</h4><h4 class="font-weight-medium">' +bday+'</h4>'+ subtitle;
                this.process_type = this.registration_type === 'PHIC_LGU' ? 'PHIC_LGU' : 'PHIC';
              }
              this.phic_member_eligibility_status = "No Record Found"; 
          }

          if(on_alert) {
              this.alert = { 
                display: true, 
                type: 'standard',
                width: '550', 
                icon: icon, 
                color: color, 
                title: title, 
                body: body, 
                btn_pry_color: 'primary',
                btn_pry_otl: false, 
                ...(result.RESPONSE._attributes.RESULT === "2" || result.RESPONSE._attributes.RESULT === "4" ? {
                  btn_pry_txt: 'OK',
                  btn_pry_act: type === 'qr_sms' ? "reloadPage" : "closeAlert",
                } : {
                  btn_pry_txt: 'YES',
                  btn_pry_emt: 'confirmAlert',
                  btn_pry_act: 'closeAlert',
                  btn_sec_txt: 'NO',
                  btn_sec_color: 'grey darken-2',
                  btn_sec_otl: true,
                  btn_sec_emt: 'changeStatus',
                  btn_sec_act: 'closeAlert',
                })
              }
          } else {
            if(proceed_eligibility) {
              this.fname = fname
              this.lname = lname
              this.mname = mname
              this.suffix = suffix
              this.birthdate = bday
              this.proceedEligibility() 
            }
          }
        } else {
          this.overlay_loader = false;
          this.alert = response.error
        }
      },

      changeStatus() {
        if (this.qr_page_process === 'qr_sms') {
          this.$router.go();
        } else {
          this.submit_confirm = false;
          this.selection_confirmation = false;
          this.loader = false;
        }
      },

      confirmAlert(){
        if (this.submit_confirm) {
          //IF HMO HAS DATA AND PHIC IS NO RECORDS / MULTIPLE
          if (this.qr_page_process === 'qr_sms') {
            this.selection_confirm_disp = true;
          } else {
            this.loader = false;
            this.submit_confirm = false;
            this.member_selection_dialog = true;
          }
        } else {
          this.fname = this.typein_fname
          this.mname = this.typein_mname
          this.lname = this.typein_lname
          this.suffix = this.typein_suffix
          this.birthdate = this.typein_birthdate
          this.proceedEligibility()
        }
      },

      saveFailedML() {
        var doc = new this.jspdf('p', 'mm', 'letter');
        const center = doc.internal.pageSize.getWidth() / 2;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PHIC Master List Failed Records', center, 12, 'center');

        let base_height = 20; 

        doc.setFontSize(10);
        doc.text('I -> Inserted', 8, base_height);
        doc.text('U -> Updated', 8, base_height + 5);

        base_height += 15; 

        doc.setFontSize(10);
        doc.text('PHIC Pin', 8, base_height);
        doc.text('First Name', 32, base_height);
        doc.text('Middle Name', 60, base_height);
        doc.text('Last Name', 90, base_height);
        doc.text('Date of Birth', 120, base_height);
        doc.text('Assigned Date', 150, base_height);
        doc.text('Status', 180, base_height);

        this.mt_data.failed_records_list.forEach(data => {
            base_height += 10;
            doc.setFontSize(8);
            doc.setFont('helvetica', 'regular');
            doc.text(data.phic_pin, 8, base_height);
            doc.text(data.first_name, 42, base_height, 'center');
            doc.text(data.middle_name, 70, base_height, 'center');
            doc.text(data.last_name, 100, base_height, 'center');
            doc.text(data.birthdate, 130, base_height, 'center');
            doc.text(data.assigned_date, 162, base_height, 'center');
            doc.text(data.process_type, 185, base_height, 'center');

            if (base_height >= 240) {
                doc.addPage();
                base_height = 20; 
            }
        });

        doc.save('Failed Migration.pdf');
      },

      // TIMEOUT REMOVAL / CANCELLATION OF API CALLS
      removeTimeout() {
        if (this.sel_adm_process.id == 'qr') {
          this.qr_img = this.qr_filename = this.qr_data = null;
          clearTimeout(this.qr_timeout);
          clearTimeout(this.qr_reload_timeout);
        }

        if (this.sel_adm_process.id == 'sms') {
          this.sms_code = '';
          clearTimeout(this.sms_timeout);
        }
        
        if (this.source && typeof this.source.cancel === 'function') {
          return this.source.cancel();
        } else {
          return null;
        }
      },

      // FOR RESPONSIVENESS OF IMAGE SIZES
      onResize() {
         this.windowSize = { x: window.innerWidth, y: window.innerHeight };
         if (this.windowSize.x > 1904) {
            this.heroes_health_logo = "250"
            this.confirm_display_width = "60%"
            this.text_title = 'font-size: 1.4em'
            this.icon_size = '75'
         } else if (this.windowSize.x > 1264 && this.windowSize.x < 1904) {
            this.heroes_health_logo = "200"
            this.confirm_display_width = "60%"
            this.text_title = 'font-size: 1.12em'
            this.icon_size = '70'
         } else if (this.windowSize.x > 960 && this.windowSize.x < 1264) {
            this.heroes_health_logo = "180"
            this.confirm_display_width = "60%"
            this.text_title = 'font-size: 1em'
            this.icon_size = '66'
         } else if (this.windowSize.x > 600 && this.windowSize.x < 960){
            this.heroes_health_logo = "180"
            this.confirm_display_width = "80%"
            this.text_title = 'font-size: 0.9em'
            this.icon_size = '55'
         } else {
            this.qr_height = '270'
            this.heroes_health_logo = "170"
            this.confirm_display_width = "100%"
            this.text_title = 'font-size: 0.9em'
            this.icon_size = '45'
         }
      },
  }
}
</script>

<style>
.card-container-items {
  justify-content: center;
  align-items: center;
  display: flex;
}

.height-100 {
  height:100%;
}

.color-text {
  color: #35363a !important;
}
.card-border-inactive-top {
  background: #bedfff !important;
}

.card-border-active {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

.card-border-inactive {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}

.hover-class:hover {
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%) !important;
}

.logo-absolute-left{
  position:absolute;
  left:10px;
  top:10px;
}

#qrcode {
  border: 1px solid lightgrey;
  border-radius: 4px;
}

#admission-item-center{
  align-self: center;
}

.card-icon {
  width:150px;
  height:150px; 
  display:flex; 
  align-items:center; 
  justify-content:center;
}

.card-details {
  flex:1; 
  display:flex; 
  flex-direction:column; 
  justify-content:center;
  padding-right: 10px;
}

@media screen and (max-width: 959px) {
  .v-col.sm-6 {
    margin-bottom: 8px;
  }
}

@media screen and (max-width: 378px) {
  .card-details {
    text-align: center;
    align-items: center;
    padding-right: 5px;
    padding-left: 5px;
  }
}

</style>
