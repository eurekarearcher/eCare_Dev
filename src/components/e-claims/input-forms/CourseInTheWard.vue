<template>
  <div>
    <v-form :readonly="!trans_detail.editable">
      <!-- COURSE IN THE WARD -->
      
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">COURSE IN THE WARD</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part4" @click="displayCommentData('ciw')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <div v-if="primary_procedures.length > 0">
        <v-row class="d-none d-sm-flex mt-5 text-center" justify="center" wrap>
          <v-col cols="7" sm="6" md="6" lg="6">
            <label class="body-2 font-weight-medium">PROCEDURES</label>
          </v-col>
          <v-col cols="5" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-medium">TYPE OF DIAGNOSTIC</label>
          </v-col>
          <v-col cols="5" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-medium">DATE</label>
          </v-col>
          <v-col cols="5" sm="2" md="2" lg="2">
            <label class="body-2 font-weight-medium">AMOUNT</label>
          </v-col>
        </v-row>

        <!-- PROCEDURES -->
        <v-row v-for="(cpt, i) in primary_procedures" :key="'cpt'+i" dense>
          <v-col class="pl-7 pl-sm-0" cols="12" sm="6" md="6" lg="6">
            <v-text-field v-model="cpt.cpt_description" :label="$vuetify.breakpoint.smAndUp ? '' : 'Doctor\'s Order / Action'" class="body-2 ma-0 pa-0" hide-details readonly dense>
              <template v-slot:prepend>
                <label class="body-2 pt-1 black--text">{{ i+1 }})</label>
              </template>
            </v-text-field>
          </v-col> 
          <v-col class="pl-12 pl-sm-0" cols="12" sm="2" md="2" lg="2">
            <v-select v-model="cpt.type_of_diagnostic" @change="checkDataStatus('others')" :items="diagnostic_items" :error="required" :label="$vuetify.breakpoint.smAndUp ? '' : 'Type of Diagnostic'" class="body-2 ma-0 pa-0" hide-details dense>
            </v-select>
          </v-col>
          <v-col class="pl-12 pl-sm-0" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="cpt.procedure_date" :label="$vuetify.breakpoint.smAndUp ? '' : 'Date'" class="body-2 ma-0 pa-0" hide-details readonly dense>
            </v-text-field>
          </v-col>
          <v-col class="pl-12 pl-sm-0" cols="12" sm="2" md="2" lg="2">
            <v-text-field v-model="cpt.procedure_amount" :label="$vuetify.breakpoint.smAndUp ? '' : 'Amount'" @blur="blurData(cpt)" class="body-2 ma-0 pa-0" hide-details v-on:keypress="numberOnly" dense>
              <template v-if="trans_detail.editable" v-slot:append-outer>
                <v-icon @click="confirmRemoveProcedure(cpt.icd_index, cpt.icd_description, cpt.cpt_index)" class="pr-1" size="26">mdi-delete</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="9" class="font-weight-medium text-right">Total Amount: </v-col>
          <v-col cols="12" sm="3" class="font-weight-medium pr-12">
            {{ checkFormat(total_procedure_amount) || 0 }}
          </v-col>
        </v-row>

        <v-divider></v-divider>
        
      </div>

      <v-row class="d-none d-sm-flex mt-5 text-center" justify="center" wrap>
        <v-col cols="7" sm="8" md="8" lg="8">
          <label class="body-2 font-weight-medium">DOCTOR'S ORDER/ACTION</label>
        </v-col>
        <v-col cols="5" sm="4" md="4" lg="4">
          <label class="body-2 font-weight-medium">DATE</label>
        </v-col>
      </v-row>

      <!-- PROCEDURES -->
      <!-- <v-row v-for="(cpt, i) in pci_data.PRIMARY[0].procedure" :key="'cpt'+i" class="mt-4 mt-sm-n2" dense>
        <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="8" lg="8">
          <v-text-field v-model="cpt.cpt_description" :label="$vuetify.breakpoint.smAndUp ? '' : 'Doctor\'s Order / Action'" class="body-2 ma-0 pa-0" hide-details readonly dense>
            <template v-slot:prepend>
              <label class="body-2 pt-1 black--text">{{ i+1 }})</label>
            </template>
          </v-text-field>
        </v-col> 
        <v-col class="pl-12 pl-sm-0" cols="12" sm="4" md="4" lg="4">
          <v-text-field v-model="cpt.procedure_date" :label="$vuetify.breakpoint.smAndUp ? '' : 'Date'" class="body-2 ma-0 pa-0" hide-details readonly dense>
            <template v-if="trans_detail.editable" v-slot:append-outer>
              <v-icon @click="confirmRemoveProcedure(cpt.icd_index, cpt.icd_description, cpt.cpt_index)" class="pr-1" size="26">mdi-delete</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row> -->
    
      <!-- DOCTORS ORDER -->
      <v-row v-for="(add, i) in doctors_order.data" :key="i" class="mt-4 mt-sm-n2" dense>
        <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="8" lg="8">
          <v-text-field v-model="add.doctors_order" :error="required" :label="$vuetify.breakpoint.smAndUp ? '' : 'Doctor\'s Order / Action'" @change="checkDataStatus('doctors')" class="body-2 ma-0 pa-0" hide-details dense>
            <template v-slot:prepend>
              <label class="body-2 pt-1 black--text">{{ i+1 }})
              </label>
            </template>
          </v-text-field>
        </v-col> 

        <v-col class="pl-12 pl-sm-0" cols="12" sm="4" md="4" lg="4">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="add.date" v-on="on" @change="checkDataStatus('doctors')" :error="required" :label="$vuetify.breakpoint.smAndUp ? '' : 'Date'" class="body-2 ma-0 pa-0" hide-details readonly dense>
                <template v-if="trans_detail.editable" v-slot:append-outer>
                  <v-icon @click="removeAddedDoctorsOrder(i)" class="icon-pl pr-1" size="26">mdi-delete</v-icon>
                </template>
                <template v-if="required && !add.date" v-slot:append>
                  <v-icon class="mt-1" color="red" title="Field is required" small>fas fa-exclamation-circle</v-icon>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="add.date_date" :max="confinement_date.date_discharged" :min="confinement_date.date_admitted" @input="add.date = formatDate(add.date_date)" @change="checkDataStatus('doctors')" no-title></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <v-row class="pr-10 mt-2" wrap>
        <v-spacer></v-spacer>
        <v-btn v-if="trans_detail.editable" @click="addDoctorsOrder" tile><v-icon class="pr-1" small>mdi-plus</v-icon>ADD DOCTORS ORDER</v-btn>
      </v-row>
      
      <!-- SURGICAL PROCEDURES -->
      <v-row class="mt-6" wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">SURGICAL PROCEDURE</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part4_1" @click="displayCommentData('surgical')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      
      <!-- FILE ATTACHMENT FOR SURGICAL PROCEDURES -->
      <v-row justify="center" class="mt-10" wrap>
        <v-col cols="12" sm="6" md="4" lg="4" class="pr-1">
          <v-select v-model="selected_doc_type" :items="surgical_items" item-text="doc_description" label="Document Type" outlined dense return-object> </v-select>
          <label for="attached-surgical" class="file-attachment">Choose File</label> 
          <span class="ml-1" v-if="ciw_data.section2.length === 0">No file chosen</span>
          <span class="ml-1" v-else>{{ ciw_data.section2.length }} files</span>
          <input :disabled="!trans_detail.editable || new_surgical_status === 'Processing' || selected_doc_type.length === 0" @change="addAttachedSurgical" id="attached-surgical" class="mt-4 d-none" type="file" ref="surgical" accept=".pdf" multiple><br>
          <v-divider class="mt-3"></v-divider>

          <div v-for="(attached, i) in ciw_data.section2" :key="i">
            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                <v-icon color="success" size="20">mdi-check</v-icon>
                <v-menu open-on-hover offset-y max-width="700" :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on" class="attachment-name">
                            {{ attached.name }}
                        </span>
                    </template>

                    <v-card v-if="attached.attachment_upload_type === 'cloud_storage'" class="pa-4">
                        <div>
                            <strong>Uploaded Document ID:</strong>
                            {{ attached.upload_document_id }}
                        </div>

                        <div>
                            <strong>Latest Processing Timestamp:</strong>
                            {{ formatDate(attached.processing_timestamp) }}
                        </div>

                        <div>
                            <strong>Latest Processing Status:</strong>
                            {{ attached.processing_status }}
                        </div>

                        <div>
                            <strong>Storage URL:</strong>
                            {{ attached.object_storage_url }}
                        </div>

                        <div v-show="attached.error_message">
                            <strong>Error Result Message:</strong>
                            {{ attached.error_message }}
                        </div>
                    </v-card>

                    <v-card v-else class="pa-4">
                        <div>
                            <strong>Claim ID:</strong>
                            {{ attached.claim_id }}
                        </div>

                        <div>
                            <strong>Document Type:</strong>
                            {{ attached.document_type }}
                        </div>

                        <div>
                            <strong>Date Uploaded:</strong>
                            {{ attached.date_uploaded }}
                        </div>
                    </v-card>
                </v-menu>

                <v-icon
                    v-show="attached.loader === false || attached.loader === undefined"
                    :disabled="!trans_detail.editable || new_surgical_status === 'Processing'"
                    @click="removeAttachedSurgical(i, 'old')"
                    class="remove-attachment"
                    size="20"
                >
                    mdi-close
                </v-icon>

                <label  v-show="attached.loader" class="remove-attachment font-italic">
                    Deleting...
                </label>
            </h5>
          </div>

          <div v-for="(view, i) in view_attached_surgical" :key="'view'+i" class="text-left">
            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
              <template v-if="view.file_size > 30">
                <v-tooltip bottom color="red">
                  <template #activator="{ on }">
                    <v-icon v-on="on" class="pr-1" color="red" size="20">mdi-alert-circle-outline</v-icon>
                  </template>
                  File size exceeds 30 MB
                </v-tooltip>
              </template>
              <template v-else>
                <v-progress-circular v-if="new_surgical_status === true || new_surgical_status === 'Processing'" class="mr-2" color="red" size="13" width="1.4" :indeterminate="new_surgical_status === 'Processing'"></v-progress-circular>
                <v-icon v-else color="success" size="20">mdi-check</v-icon>
              </template>
              {{ view.name }} <span class="text--secondary">- {{ view.file_size }} MB</span>
              <v-icon v-show="new_surgical_status !== 'Processing'" @click="removeAttachedSurgical(i, 'new')" class="remove-attachment" size="20">mdi-close</v-icon>
            </h5>
          </div>

          <div class="text-center">
            <v-btn :disabled="!trans_detail.editable || surgical_size_exceeds" :loading="loading_surgical_attachment" @click="postFileOfSurgical" class="mt-4" small tile>UPLOAD FILE</v-btn>
            <v-btn v-if="ciw_data.section2.length > 0 || view_attached_surgical.length > 0" @click="view_file_surgical = true" class="mt-4 ml-2" small tile>VIEW FILE</v-btn>
            <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
          </div>
        </v-col>
        <v-col cols="1" sm="1" md="1" lg="1"></v-col>
      </v-row>

      <v-row v-if="loading_surgical_attachment" justify="center" class="text-center mt-2" wrap>
        <v-col cols="12" sm="6" md="4" lg="4">
          <div class="yellow lighten-3 pa-5">
            <h5 class="font-weight-regular grey--text text--darken-3">Please wait while we upload your file. <br>Do not click next or other category to finish uploading.</h5>
          </div>
        </v-col>
        <v-col cols="1" sm="1" md="1" lg="1"></v-col>
      </v-row>
      <v-divider class="my-8"></v-divider>

      <!-- DRUGS/MEDICINE -->
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">DRUGS/MEDICINE</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part5" @click="displayCommentData('medicine')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-autocomplete v-model="selected_medicine_holder" :items="medicine_items" :loading="load_medicine" @change="selected_medicine_holder = {}" item-text="generic_name_text" class="body-2 mt-2" placeholder="Search for Generic/Brand Name" dense return-object hide-no-data hide-details outlined>
        <template v-slot:item="{ item }">
            <v-layout @click="addDrugsMedicine(item)">
                <v-list-item-avatar v-if="$vuetify.breakpoint.smAndUp" color="indigo" class="font-weight-light white--text">{{ item.otc_medicine_code.replace('OTC-', '') }}</v-list-item-avatar>
                <v-row class="pt-3" dense>
                    <v-col cols="12" sm="12" md="5" lg="7" xl="7">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <h6 class="body-2 font-weight-regular">Generic Name:</h6>
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <h6 class="body-2 font-weight-regular">{{ item.generic_name }}</h6>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <h6 class="body-2 font-weight-regular">Preparation:</h6>
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <h6 class="body-2 font-weight-regular">{{ item.preparation }}</h6>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="5" lg="7">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <h6 class="body-2 font-weight-regular">Route:</h6>
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <h6 class="body-2 font-weight-regular">{{ item.route }}</h6>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <h6 class="body-2 font-weight-regular">Dosage:</h6>
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <h6 class="body-2 font-weight-regular">{{ item.dosage }}</h6>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="7" lg="7">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <!-- <h6 class="body-2 font-weight-regular">Available Stock:</h6> -->
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <!-- <v-chip class="text-white" :color="getStockColor(item.max_stock_quantity,item.current_quantity)" small> {{ item.current_quantity }} </v-chip> -->
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="7" lg="5" xl="5">
                        <v-row dense>
                            <v-col cols="5" sm="4" md="4" lg="3" xl="3">
                                <h6 class="body-2 font-weight-regular">Classification:</h6>
                            </v-col>
                            <v-col cols="7" sm="8" md="8" lg="9" xl="9">
                                <h6 class="body-2 font-weight-regular">{{ item.other_med_group }}</h6>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" lg="12">
                        <v-divider class="mt-4"></v-divider>
                    </v-col>
                </v-row>
            </v-layout>
        </template>
        <template v-slot:selection></template>   
      </v-autocomplete>
      
      <div v-if="ciw_data.section3.medicine.length > 0" :class="{'table-overflow-x' : $vuetify.breakpoint.mdAndDown}">
        <table class="mt-4" cellspacing="0" cellpadding="0">
          <tr>
            <th class="font-weight-medium body-2 text-uppercase">Qty.</th>
            <th class="font-weight-medium body-2 text-uppercase">Generic Name</th>
            <th class="font-weight-medium body-2 text-uppercase">Unit</th>
            <th class="font-weight-medium body-2 text-uppercase">Dosage</th>
            <th class="font-weight-medium body-2 text-uppercase">Preparation</th>
            <th class="font-weight-medium body-2 text-uppercase">Route</th>
            <th class="font-weight-medium body-2 text-uppercase">Frequency</th>
            <th class="font-weight-medium body-2 text-uppercase">Service Date</th>
            <th class="font-weight-medium body-2 text-uppercase">Amount</th>
            <th class="font-weight-medium body-2 text-uppercase">Total Cost</th>
          </tr>
          <tr v-for="(add, i) in ciw_data.section3.medicine" :key="i">
            <td style="width: 4%">
              <v-text-field v-model="add.quantity" v-on:keypress="numberOnly"  @click="autoComputeTotalCost(i, add.quantity, add.amount)" type="number" min="1" max="99" class="body-2" onpaste="return false" hide-details></v-text-field>
            </td> 
            <td style="width: 22%">
              <v-text-field v-model="add.generic_name" class="body-2" readonly hide-details></v-text-field>
            </td> 
            <td style="width: 10%">
              <v-text-field v-model="add.unit_type" class="body-2" readonly hide-details></v-text-field>
            </td>
            <td style="width: 12%">
              <v-text-field v-model="add.dosage" class="body-2" readonly hide-details></v-text-field>
            </td>
            <td style="width: 9%">
              <v-text-field v-model="add.preparation" class="body-2" readonly hide-details></v-text-field>
            </td>
            <td style="width: 8%">
              <!-- <v-text-field v-model="add.route" @change="checkDataStatus('others')" class="body-2" :error="required" :readonly="!add.route_editable" hide-details></v-text-field> -->
              <v-text-field v-model="add.route" class="body-2" readonly hide-details></v-text-field>
            </td>
            <td style="width: 8%">
              <v-text-field v-model="add.frequency" class="body-2" hide-details></v-text-field>
            </td>
            <td style="width: 8%">
              <v-text-field v-model="add.service_date" type="date" class="body-2" hide-details></v-text-field>
            </td>
            <td style="width: 10%">
              <v-text-field v-model="add.amount" type="number" class="body-2" v-on:keypress="numberOnly" @change="autoComputeTotalCost(i, add.quantity, add.amount)" hide-details></v-text-field>
            </td>
            <td style="width: 10%">
              <v-text-field :value="checkFormat(add.total_cost_per_medicine)" class="body-2" readonly hide-details></v-text-field>
            </td>
            <td v-if="trans_detail.editable" style="width: 1%">
              <v-icon :disabled="load_medicine" @click="removeAddedDrugsMedicine(i)">mdi-delete</v-icon>
            </td>
          </tr>
          <tr class="body-2">
              <td colspan="8" class="text-right font-weight-medium pr-4">Total Amount:</td>
              <td class="body-2 font-weight-medium" v-if="ciw_data.section3.medicine.length > 0"> {{ this.checkFormat(grand_total) }} </td>
              <td></td>
          </tr>
        </table>
      </div>

      <!-- FILE ATTACHMENT FOR DRUGS/MEDICINE -->
      <v-row justify="center" class="mt-5" wrap>
        <v-col cols="12" sm="6" md="4" lg="4" class="pr-1">
          <v-select v-model="selected_med_doc_type" :items="others_items" item-text="doc_description" label="Document Type" outlined dense return-object> </v-select>
          <label for="attached-medicine" class="file-attachment">Choose File</label> 
          <span class="ml-1" v-if="ciw_data.section3.attachments.length === 0">No file chosen</span>
          <span class="ml-1" v-else>{{ ciw_data.section3.attachments.length }} files</span>
          <input :disabled="!trans_detail.editable || new_medicine_status === 'Processing' || selected_med_doc_type.length === 0" @change="addAttachedMedicine" id="attached-medicine" class="mt-4 d-none" type="file" ref="medicine" accept=".pdf" multiple><br>
          <v-divider class="mt-3"></v-divider>

          <div v-for="(attached, i) in ciw_data.section3.attachments" :key="i">
            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                <v-icon color="success" size="20">mdi-check</v-icon>
                <v-menu open-on-hover offset-y max-width="700" :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on" class="attachment-name">
                            {{ attached.name }}
                        </span>
                    </template>

                    <v-card v-if="attached.attachment_upload_type === 'cloud_storage'" class="pa-4">
                        <div>
                            <strong>Uploaded Document ID:</strong>
                            {{ attached.upload_document_id }}
                        </div>

                        <div>
                            <strong>Latest Processing Timestamp:</strong>
                            {{ formatDate(attached.processing_timestamp) }}
                        </div>

                        <div>
                            <strong>Latest Processing Status:</strong>
                            {{ attached.processing_status }}
                        </div>

                        <div>
                            <strong>Storage URL:</strong>
                            {{ attached.object_storage_url }}
                        </div>

                        <div v-show="attached.error_message">
                            <strong>Error Result Message:</strong>
                            {{ attached.error_message }}
                        </div>
                    </v-card>

                    <v-card v-else class="pa-4">
                        <div>
                            <strong>Claim ID:</strong>
                            {{ attached.claim_id }}
                        </div>

                        <div>
                            <strong>Document Type:</strong>
                            {{ attached.document_type }}
                        </div>

                        <div>
                            <strong>Date Uploaded:</strong>
                            {{ attached.date_uploaded }}
                        </div>
                    </v-card>
                </v-menu>

                <v-icon
                    v-show="attached.loader === false || attached.loader === undefined"
                    :disabled="!trans_detail.editable || new_medicine_status === 'Processing'"
                    @click="removeAttachedMedicine(i, 'old')"
                    class="remove-attachment"
                    size="20"
                >
                    mdi-close
                </v-icon>

                <label  v-show="attached.loader" class="remove-attachment font-italic">
                    Deleting...
                </label>
            </h5>
          </div>

          <div v-for="(view, i) in view_attached_medicine" :key="'view'+i" class="text-left">
            <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
              <template v-if="view.file_size > 30">
                <v-tooltip bottom color="red">
                  <template #activator="{ on }">
                    <v-icon v-on="on" class="pr-1" color="red" size="20">mdi-alert-circle-outline</v-icon>
                  </template>
                  File size exceeds 30 MB
                </v-tooltip>
              </template>
              <template v-else>
                <v-progress-circular v-if="new_medicine_status === true || new_medicine_status === 'Processing'" class="mr-2" color="red" size="13" width="1.4" :indeterminate="new_medicine_status === 'Processing'"></v-progress-circular>
                <v-icon v-else color="success" size="20">mdi-check</v-icon>
              </template>
              {{ view.name }} <span class="text--secondary">- {{ view.file_size }} MB</span>
              <v-icon v-show="new_medicine_status !== 'Processing'" @click="removeAttachedMedicine(i, 'new')" class="remove-attachment" size="20">mdi-close</v-icon>
            </h5>
          </div>

          <div class="text-center">
            <v-btn :disabled="!trans_detail.editable || medicine_size_exceeds" :loading="loading_medicine_attachment" @click="postFileOfMedicine" class="mt-4" small tile>UPLOAD FILE</v-btn>
            <v-btn v-if="ciw_data.section3.attachments.length > 0 || view_attached_medicine.length > 0" @click="view_file_medicine = true" class="mt-4 ml-2" small tile>VIEW FILE</v-btn>
            <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
          </div>
        </v-col>
        <v-col cols="1" sm="1" md="1" lg="1"></v-col>
      </v-row>

      <v-row v-if="loading_medicine_attachment" justify="center" class="text-center mt-2" wrap>
        <v-col cols="12" sm="6" md="4" lg="4">
          <div class="yellow lighten-3 pa-5">
            <h5 class="font-weight-regular grey--text text--darken-3">Please wait while we upload your file. <br>Do not click next or other category to finish uploading.</h5>
          </div>
        </v-col>
        <v-col cols="1" sm="1" md="1" lg="1"></v-col>
      </v-row>
      <v-divider class="mb-5 mt-8"></v-divider>

      <!-- MEDICAL SUPPLIES -->
      <v-row wrap>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">MEDICAL SUPPLIES</h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part5" @click="displayCommentData('medicine')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>

        <v-col class="pl-12 pl-sm-0" cols="12" sm="12" md="12" lg="12">
          <v-autocomplete v-model="selected_item" :items="medical_supplies" :loading="load_medical_supplies" @change="addItem" item-text="item_desc" item-value="item_id" label="Search Item" clearable return-object hide-no-data hide-details dense outlined></v-autocomplete>
        </v-col>

        <!-- Item Table -->
        <v-col class="pl-12 pl-sm-0" cols="12" sm="12" md="12" lg="12" :class="{'table-overflow-x' : $vuetify.breakpoint.mdAndDown}">
          <table class="mt-4" cellspacing="0" cellpadding="0" width="100%" v-if="ciw_data.section5.length > 0">
            <tr>
              <th class="font-weight-medium body-2">QUANTITY</th>
              <th class="font-weight-medium body-2">ITEM</th>
              <th class="font-weight-medium body-2">UNIT OF MEASUREMENT</th>
              <th class="font-weight-medium body-2">SERVICE DATE</th>
              <th class="font-weight-medium body-2">AMOUNT</th>
              <th class="font-weight-medium body-2">TOTAL COST</th>
              <th class="font-weight-medium body-2"></th>
            </tr>
            <tbody>
              <tr v-for="(item, index) in ciw_data.section5" :key="index">
                <td width="5%">
                  <v-text-field v-model="item.quantity" type="number" min="1" max="99" class="pt-4 body-2" onpaste="return false"  dense @change="updateTotal(index, item.quantity, item.amount)" ></v-text-field>
                </td>
                <td width="35%">
                  <v-text-field v-model="item.item_desc"  class="pt-4 body-2" dense readonly ></v-text-field>
                </td>
                <td width="15%">
                  <v-autocomplete v-model="item.unit_of_measurement" :items="unit_of_measurement" :loading="load_unit_of_measurement" item-text="unit_desc" item-value="unit_desc" class="body-2" clearable hide-no-data hide-details dense></v-autocomplete>
                </td>
                <td width="15%">
                  <v-text-field v-model="item.service_date" type="date"  class="pt-4 body-2" dense  ></v-text-field>
                </td>
                <td width="15%">
                  <v-text-field v-model="item.amount" type="number" class="pt-4 body-2" dense @change="updateTotal(index, item.quantity, item.amount)" ></v-text-field>
                </td>
                <td width="15%">
                  <v-text-field :value="checkFormat(item.total)" class="pt-4 body-2" dense readonly ></v-text-field>
                </td>
                <td width="5%"> 
                  <v-icon @click="removeItem(item)" class="pt-2" :disabled = "load_medical_supplies">mdi-delete</v-icon>
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-right font-weight-medium pr-4 body-2 ">Total Amount:</td>
                <td class="body-2 font-weight-medium" v-if="ciw_data.section5.length > 0"> {{ this.checkFormat(grand_total_medical_supplies) }} </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>
      <v-divider class="mb-5 mt-8"></v-divider>

      <!-- OUTCOME OF TREATMENT -->
      <v-row class="mt-6" wrap mt-6>
        <v-col cols="6" sm="6" md="6" lg="6">
          <h1 class="section-title">
            OUTCOME OF TREATMENT
            <v-btn v-if="trans_detail.editable && !!ciw_data.section4.outcome_treatment" @click="ciw_data.section4.outcome_treatment = '', ciw_data.section4.outcome_treatment_reason = '', checkDataStatus('outcome')" class="ml-2" width="60" height="25" small>Clear</v-btn>
          </h1>
        </v-col>
        <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part6" @click="displayCommentData('outcome')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <v-row justify="center" wrap>
        <v-col cols="12" sm="12" md="12" lg="11" xl="10">
          <v-radio-group v-model="ciw_data.section4.outcome_treatment" :column="$vuetify.breakpoint.xsOnly" @change="checkDataStatus('outcome')" class="pl-5 pl-sm-0" hide-details>
            <v-radio class="outcome-treatment" value="IMPROVED" label="IMPROVED"></v-radio>
            <v-radio class="outcome-treatment" value="HAMA" label="HAMA"></v-radio>
            <v-radio class="outcome-treatment" value="EXPIRED" label="EXPIRED"></v-radio>
            <v-radio class="outcome-treatment" value="ABSCONDED" label="ABSCONDED"></v-radio>
            <v-radio class="outcome-treatment" value="TRANSFERRED" label="TRANSFERRED"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      
      <v-row :class="{'opacity' : !ciw_data.section4.outcome_treatment}" align="baseline" class="mt-2" wrap>
        <v-col cols="3" sm="3" md="2" lg="2" xl="1" class="text-right pr-2">
          <label class="body-2">SPECIFY REASON</label>
        </v-col>
        <v-col cols="9" sm="9" md="9" lg="9" xl="10">
          <v-text-field v-model="ciw_data.section4.outcome_treatment_reason" :readonly="!ciw_data.section4.outcome_treatment" @change="checkDataStatus('outcome')" class="body-2" hide-details></v-text-field>
        </v-col>
      </v-row>

      <!-- VIEW FILE DIALOG FOR SURGICAL -->
      <v-dialog v-model="view_file_surgical" width="1100" persistent>
        <v-card>
          <v-card-title class="light-blue darken-3 white--text py-2 justify-center">
            <v-spacer></v-spacer>SURGICAL PROCEDURE {{ $vuetify.breakpoint.smAndUp ? 'ATTACHMENT' : '' }}<v-spacer></v-spacer>
            <v-btn @click="view_file_surgical = false" dark icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <div v-for="(attached, i) in ciw_data.section2" :key="i" class="px-4 mt-2">
            <h4>{{ i+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <div v-for="(attached, i) in view_attached_surgical" :key="'view'+i" class="px-4 mt-2">
            <h4>{{ i+ciw_data.section2.length+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn @click="view_file_surgical = false" class="ml-1" color="primary">CLOSE</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- VIEW FILE DIALOG FOR MEDICINE -->
      <v-dialog v-model="view_file_medicine" width="1100" persistent>
        <v-card>
          <v-card-title class="light-blue darken-3 white--text py-2 justify-center">
            <v-spacer></v-spacer>DRUGS/MEDICINE {{ $vuetify.breakpoint.smAndUp ? 'ATTACHMENT' : '' }}<v-spacer></v-spacer>
            <v-btn @click="view_file_medicine = false" dark icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <div v-for="(attached, i) in ciw_data.section3.attachments" :key="i" class="px-4 mt-2">
            <h4>{{ i+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <div v-for="(attached, i) in view_attached_medicine" :key="'view'+i" class="px-4 mt-2">
            <h4>{{ i+ciw_data.section3.attachments.length+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn @click="view_file_medicine = false" class="ml-1" color="primary">CLOSE</v-btn>
          </v-row>
        </v-card>
      </v-dialog>

      <!-- COMMENT DIALOG -->
      <v-dialog v-model="comment_dialog" width="600" persistent>
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

      <!-- NAVIGATION BUTTON -->
      <v-divider class="my-5"></v-divider>
      <v-row justify="space-between" wrap>
        <v-col cols="5" sm="5" md="5" lg="5">
          <v-btn @click="trans_detail.gender === 'MALE' || trans_detail.gender === 'M' ? $router.push('/input-forms/physical-examination') : $router.push('/input-forms/maternity')" color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
        </v-col>
        <v-col cols="5" sm="5" md="5" lg="5" class="text-right">
          <v-btn @click="$router.push('/input-forms/accreditation-and-signature')" color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
        </v-col>
      </v-row>
      <Alert :alert="alert" @removeProcedure="removeProcedure" />
    </v-form>
  </div>
</template>

<script>
import Alert from '../../Alert.vue'

export default {
  props: ['trans_detail', 'required', 'comment_data'],

  components: {
    Alert
  },

  data(){
    return{
      // DATA
      ciw_data: {
        section2: [],
        section3: {
          medicine: [],
          attachments: []
        },
        section4: {
          outcome_treatment: '',
          outcome_treatment_reason: ''
        },
        section5:[],
        summary_of_fees: []
      },

      pci_data: [],
      
      doctors_order: {
        data: [],
        status: false
      },

      // OTHERS
      confinement_date: '',
      medicine_placeholder: true,
      selected_medicine: [],
      total_fees: {
        hci_fee: '',
        pf_fee: '',
        grand_total: '',
        status: false
      },
      alert: {},
     
      // SURGICAL ATTACHMENT
      new_surgical_status: true,
      view_attached_surgical: [],
      post_attached_surgical: [],
      view_file_surgical: false,
      loading_surgical_attachment: false,
      surgical_size_exceeds: false,

      // MEDICINE ATTACHMENT
      new_medicine_status: true,
      view_attached_medicine: [],
      post_attached_medicine: [],
      view_file_medicine: false,
      loading_medicine_attachment: false,
      medicine_size_exceeds: false,

      // REFERENCE DATA
      medicine_list: [],
      selected_medicine_holder: {},

      // LOADER
      load_medicine: true,

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: '',

      // MEDICAL SUPPLIES
      selected_item: null,
      medical_supplies: [],
      selected_items: [],
      load_medical_supplies: true,
      unit_of_measurement:[],
      load_unit_of_measurement: false,

      caserate_list_items: [],

      cert_total_health_facility_fee: 0,
      cert_total_professional_fee: 0,
      cert_grand_total: 0,

      diagnosis_items_key: ['PRIMARY', 'SECONDARY', 'OTHERS'],
      diagnostic_items: ['IMAGING', 'LABORATORY', 'OTHERS'],

      selected_doc_type: [],
      selected_doct_type_holder: [],
      surgical_items: [],

      selected_med_doc_type: [],
      selected_med_doct_type_holder: [],
      others_items: []
    }
  },

  computed: {
    // COMPUTATION FOR TOTAL AMOUNT
    total_amount(){
      return this.ciw_data.section3.medicine.reduce(function (sum, item) {
        return sum + parseFloat(item.amount)
      }, 0)
    },

    // COMPUTATION FOR GRAND TOTAL COST
    grand_total(){
      return this.ciw_data.section3.medicine.reduce(function (sum, item) {
        return sum + (parseInt(item.quantity) * parseFloat(item.amount))
      }, 0)
    },
    
    // GET MEDICINE ITEMS
    medicine_items(){
      const medicine_list = this.medicine_list.filter(item => {
        return !this.selected_medicine.includes(item.generic_name_text)
      })

      return medicine_list
    },
    
    // MEDICAL SUPPLIES GRAND TOTAL
    grand_total_medical_supplies() {
      return this.ciw_data.section5.reduce((sum, item) => {
          const qty = Number(item.quantity) || 0;
          const amt = Number(item.amount) || 0;
          return sum + (qty * amt);
        }, 0);
    },

    primary_procedures() {
      const primary = this.pci_data?.PRIMARY?.[0]?.procedure || [];
      const secondary = this.pci_data?.SECONDARY?.[0]?.procedure || [];
      const others = this.pci_data?.OTHERS?.[0]?.procedure || [];
      return [...primary, ...secondary, ...others];
    },

    total_procedure_amount() {
      return this.primary_procedures.reduce((sum, cpt) => {
        const amount = parseFloat((cpt.procedure_amount || '').toString().replace(/,/g, '')) || 0;
        return sum + amount;
      }, 0).toFixed(2);
    }

  },

  watch: {
    // PREVENT NAVIGATE IF THERE IS UNSAVED ATTACHMENT
    view_attached_surgical(value){
      let total = 0

      value.forEach(element => {
        total += parseFloat(element.file_size)
      })

      if(total > 30){
        this.surgical_size_exceeds = true
      }else{
        this.surgical_size_exceeds = false
      }

      if(value.length > 0){
        this.unsaved_surgical = 'unsaved_attachment'
      }else{
        this.unsaved_surgical = ''
      }
      this.checkDataStatus('doctors');
    },
    
    // PREVENT NAVIGATE IF THERE IS UNSAVED ATTACHMENT
    view_attached_medicine(value){
      let total = 0

      value.forEach(element => {
        total += parseFloat(element.file_size)
      })

      if(total > 30){
        this.medicine_size_exceeds = true
      }else{
        this.medicine_size_exceeds = false
      }

      if(value.length > 0){
        this.unsaved_medicine = 'unsaved_attachment'
      }else{
        this.unsaved_medicine = ''
      }
      this.checkDataStatus('doctors');
    },

    'ciw_data.section5': {
      handler(new_items) {
        new_items.forEach((item) => {
          const qty = Number(item.quantity) || 0;
          const amt = Number(item.amount) || 0;
          this.$set(item, 'total', qty * amt);
        });
      },
      immediate: true,
      deep: true
    },
  },

  
  mounted(){
    this.getCourseInTheWard();
    this.getDocumentType()
    const data = sessionStorage.getItem('VKI55S');
    this.confinement_date = data ? JSON.parse(this.$crypto.AES.decrypt(data, 'flag423D').toString(this.$crypto.enc.Utf8)) : null;
  },

  methods: {
    // GET COURSE IN WARD DATA
    async getCourseInTheWard(){
      this.doctors_order = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LG4S04'), '5s05SLFI').toString(this.$crypto.enc.Utf8))
      let ciw_data = sessionStorage.getItem('PORT4D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('PORT4D'), 'X4d3r5fS').toString(this.$crypto.enc.Utf8) : null
      let pci_data = sessionStorage.getItem('LYK56D') ? this.$crypto.AES.decrypt(sessionStorage.getItem('LYK56D'), 'XLgopi4x').toString(this.$crypto.enc.Utf8) : null

      if(ciw_data === null){
        let response = await this.$services.getEclaims({
              request_key: 'course_in_the_ward',
              //request_key: 'patient_confinement',
              // provider_code: this.$store.state.prv_data.provider_code,
              // ek_lgu_id: this.trans_detail.ek_lgu_id,
              // transaction_number: this.trans_detail.transaction_number
              provider_code: this.$store.state.prv_data.provider_code,
              ek_lgu_id: this.trans_detail.ek_lgu_id,
              transaction_number: this.trans_detail.transaction_number,
              migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
              claim_no: this.trans_detail.claim_no,
              ph_category: this.trans_detail.phic_packages
        });

        if (response.status === 200) {
          response.data = this.responseDataDecryption(response.data)
          this.ciw_data = {
            section2: [],
            section3: {
              medicine: response.data.MEDICINE ? response.data.MEDICINE : [],
              attachments: [],
            },
            section4: {
              outcome_treatment: [],
              outcome_treatment_reason: ''
              // outcome_treatment: response.data.TRANSACTION.outcome_of_treatment,
              // outcome_treatment_reason: response.data.TRANSACTION.outcome_of_treatment_reason
            },
            section5: response.data.MEDICAL_SUPPLIES ? response.data.MEDICAL_SUPPLIES : [],
            section6: response.data.DISCHARGED_DIAGNOSIS ? response.data.DISCHARGED_DIAGNOSIS : [],
            status: {
              procedure: false,
              doctors: false,
              medicine: false,
              medical_supplies: false,
              outcome: false,
            }
          }

          if(pci_data === null){
            pci_data = response.data.DISCHARGED_DIAGNOSIS
            this.pci_data = pci_data
            
            //Create new array using map where procedure_amount is set to 0 if null/undefined.
            this.diagnosis_items_key.forEach(type => {
              const procedures = this.pci_data?.[type]?.[0]?.procedure;
              if (procedures?.length > 0) {
                this.pci_data[type][0].procedure = procedures.map(item => ({
                  ...item,
                  procedure_amount: item.procedure_amount || 0
                }));
              }
            });



            //this.ciw_data.section6 = this.pci_data
           // console.log(this.pci_data.PRIMARY)
            this.procedures_length = this.pci_data.PRIMARY[0].procedure.length
            this.diagnosis_items_key.forEach(type => {
              if (this.pci_data[type]) {
                this.pci_data[type].forEach(el => {
                  el.procedure.forEach(proc => {
                    this.caserate_list_items.push({
                      cpt_code: proc.cpt_code
                    });
                  });
    
                  this.caserate_list_items.push({
                    icd_code: el.icd_code
                  })
                });
              }
            })

            await this.updateCertificationData()

           // console.log(this.procedures_length)
            // let discharged_diagnosis = response.data.DISCHARGED_DIAGNOSIS
            
            // if(discharged_diagnosis){
            //   let diagnosis_code = []
            //   let selected_discharged_diagnosis = []

            //   discharged_diagnosis.forEach(element => {
            //     if(!diagnosis_code.includes(element.icd_code)){
            //       diagnosis_code.push(element.icd_code)
            //     }
            //   })
              
            //   diagnosis_code.forEach((element, index) => {
            //     selected_discharged_diagnosis.push({
            //       transaction_cpt_no: null,
            //       icd_tag: 'NEW',
            //       icd_code: null,
            //       icd_description: null,
            //       procedures: [],
            //       old_procedures: []
            //     })
                
            //     discharged_diagnosis.forEach(diagnosis => {
            //       if(element === diagnosis.icd_code){
            //         if(diagnosis.cpt_code && diagnosis.cpt_code !== 'N/A' && diagnosis.cpt_tag !== 'OLD'){
            //           selected_discharged_diagnosis[index].procedures.push({
            //             tag: diagnosis.tag,
            //             category: diagnosis.rvs_category,

            //             transaction_cpt_no: diagnosis.transaction_cpt_no,
            //             cpt_tag: 'NEW',
            //             cpt_code: diagnosis.cpt_code,
            //             cpt_description: diagnosis.cpt_description,
            //             cpt_amount: this.checkFormat(Number(diagnosis.cpt_amount).toFixed(2)),
            //             original_date: diagnosis.cpt_original_date_of_proc,
            //             date: diagnosis.cpt_current_date_of_proc ? this.formatDate(diagnosis.cpt_current_date_of_proc) : diagnosis.cpt_original_date_of_proc,
            //             date_date: diagnosis.cpt_current_date_of_proc ? diagnosis.cpt_current_date_of_proc : diagnosis.cpt_original_date_of_proc,
            //             hmo_cpt_status: diagnosis.hmo_cpt_status,
            //             phic_cpt_status: diagnosis.phic_cpt_status,
            //             lgu_cpt_status: diagnosis.lgu_cpt_status,

            //             phic_patient_discharged_diagnosis_id: diagnosis.phic_patient_discharged_diagnosis_id,
            //             rvs_tag: 'NEW',
            //             rvs_code: diagnosis.rvs_code,
            //             rvs_description: diagnosis.rvs_description,
            //             rvs_case_rate: diagnosis.rvs_case_rate,
            //             rvs_hci_fee: diagnosis.rvs_hci_fee,
            //             rvs_professional_fee: diagnosis.rvs_professional_fee,
            //             laterality: diagnosis.phic_laterality_check
            //           })
            //         }

            //         selected_discharged_diagnosis[index].transaction_cpt_no = diagnosis.transaction_cpt_no
            //         selected_discharged_diagnosis[index].icd_tag = 'NEW'
            //         selected_discharged_diagnosis[index].icd_code = diagnosis.icd_code
            //         selected_discharged_diagnosis[index].icd_description = diagnosis.icd_description
            //         selected_discharged_diagnosis[index].hmo_icd_status = diagnosis.hmo_icd_status
            //         selected_discharged_diagnosis[index].phic_icd_status = diagnosis.phic_icd_status
            //         selected_discharged_diagnosis[index].lgu_icd_status = diagnosis.lgu_icd_status
            //       }
            //     })
            //   })

            //   this.pci_data.data = selected_discharged_diagnosis
            //   this.pci_data.old_data = []
            // }
          }else{
            this.pci_data = JSON.parse(pci_data)

            this.diagnosis_items_key.forEach(type => {
              const procedures = this.pci_data?.[type]?.[0]?.procedure;
              if (procedures?.length > 0) {
                this.pci_data[type][0].procedure = procedures.map(item => ({
                  ...item,
                  procedure_amount: item.procedure_amount || 0
                }));
              }
            });
            
          }
          this.procedures_length = this.pci_data.PRIMARY[0].procedure.length
          let primary_secondary = [
            this.pci_data.PRIMARY[0] ? this.pci_data.PRIMARY[0] : null,
            // this.pci_data.SECONDARY[1] ? this.pci_data.SECONDARY[1] : null
          ]

          sessionStorage.setItem('lDsjrkd', this.$crypto.AES.encrypt(JSON.stringify(primary_secondary), 'pfdFxg44'))

          if(sessionStorage.getItem('49SFL4')){
            this.total_fees = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('49SFL4'), 'FoelR42s').toString(this.$crypto.enc.Utf8))
          }else{
            let rvs_hci_fee = 0
            let rvs_professional_fee = 0
            let total_cpt_amount = 0
            let first_case_rate = 0
            let first_case_pf = '0'
            let first_case_hci = '0'
            let second_case_rate = 0
            let second_case_pf = '0'
            let second_case_hci = '0'


            this.pci_data.PRIMARY.forEach(diagnosis => {
              diagnosis.procedure.forEach(procedure => {
                if(procedure.rvs_hci_fee){
                  total_cpt_amount += parseFloat(procedure.cpt_amount.replace(/,/g, ''))
                  rvs_hci_fee += parseFloat(procedure.rvs_hci_fee.replace(/,/g, ''))
                  rvs_professional_fee += parseFloat(procedure.rvs_professional_fee.replace(/,/g, ''))
                }
              })
            })

            let first_case = response.data.FIRST_CASE_RATES || []
            let second_case = response.data.SECOND_CASE_RATES || []

            if(this.trans_detail.transaction_type === 'INPATIENT'){
              first_case_rate = first_case.first_case_rate ? parseFloat(first_case.first_case_rate.replace(/,/g, '')) : 0
              first_case_pf = first_case.first_case_professional_fee ? first_case.first_case_professional_fee : '0'
              first_case_hci = first_case.first_case_hci_fee ? first_case.first_case_hci_fee : '0'

              second_case_rate = second_case.second_case_rate ? parseFloat(second_case.second_case_rate.replace(/,/g, '')) : 0
              second_case_pf = second_case.second_case_professional_fee ? second_case.second_case_professional_fee : '0'
              second_case_hci = second_case.second_case_hci_fee ? second_case.second_case_hci_fee : '0'

              total_cpt_amount = parseFloat(total_cpt_amount + first_case_rate + second_case_rate)
            }

            let total_professional_fee = parseFloat(first_case_pf.replace(/,/g, '')) + parseFloat(second_case_pf.replace(/,/g, '')) + rvs_professional_fee
            let total_hci_fee = parseFloat(first_case_hci.replace(/,/g, '')) + parseFloat(second_case_hci.replace(/,/g, '')) + rvs_hci_fee
            let grand_total = total_professional_fee + total_hci_fee

            this.total_fees.hci_fee = total_hci_fee
            this.total_fees.pf_fee = total_professional_fee
            this.total_fees.grand_total = grand_total
            this.total_fees.total_cpt_amount = total_cpt_amount

           // sessionStorage.setItem('49SFL4', this.$crypto.AES.encrypt(JSON.stringify(this.total_fees), 'FoelR42s'))
          }

          if (response.data.MEDICINE) {
            this.ciw_data.section3.medicine = response.data.MEDICINE.map(item => {
              const qty = Number(item.quantity);
              const amt = Number(item.amount);
              const total = Number(item.total) || (qty * amt);

              return {
                ...item,
                generic_name_text: item.generic_name + (item.brand_name || '') + (item.dosage || ''),
                total_cost_per_medicine: total,
                amount: amt || 0 //FORCE 0 IF NULL
              };
            });

            this.selected_medicine = this.ciw_data.section3.medicine.map(med => med.generic_name_text);
            this.ciw_data.status.medicine = true
            this.checkDataStatus('medicine');
          }


          if(response.data.MEDICAL_SUPPLIES){
           const supplies = response.data.MEDICAL_SUPPLIES
            this.ciw_data.section5 = supplies.map(item => ({
              ...item,
              quantity: item.quantity,
              total: (item.amount) * (item.quantity)
            }));
            this.ciw_data.status.medical_supplies = true
            this.checkDataStatus('medical_supplies');
          }

          if (response.data.TRANSACTION) {
            this.ciw_data.section4.outcome_treatment = response.data.TRANSACTION.outcome_treatment;
            this.ciw_data.section4.outcome_treatment_reason = response.data.TRANSACTION.outcome_treatment_reason;
            this.checkDataStatus('outcome');
          }

          if (response.data.DOCTORS_ORDER) {
            this.doctors_order.data = this.primary_procedures.map(item => ({
              doctors_order: item.cpt_description,
              date_date: item.procedure_date,
              date: this.formatDate(item.procedure_date),
            }));
            this.ciw_data.status.doctors = true
            this.checkDataStatus('doctors');
          }

          // if(response.data.ATTACHMENT){
          //   response.data.ATTACHMENT.forEach(item => {
          //     if(item.attachment_category === 'SURGICAL PROCEDURE'){
          //       this.ciw_data.section2.push(item)
          //       this.ciw_data.section2.forEach(element => {
          //         let no_of_file = element.file_name.split('_')[0]
          //         let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
          //         let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

          //         element.name = element.file_name.substring(sum)
          //         element.loader = false
          //       })
          //     }else{
          //       this.ciw_data.section3.attachments.push(item)
          //       this.ciw_data.section3.attachments.forEach(element => {
          //         let no_of_file = element.file_name.split('_')[0]
          //         let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
          //         let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

          //         element.name = element.file_name.substring(sum)
          //         element.loader = false
          //       })
          //     }
          //   })
          // }

          if (response.data.ATTACHMENT) {
            const attachment = response.data.ATTACHMENT;

            if (Array.isArray(attachment.surgical_procedure)) {
              attachment.surgical_procedure.forEach(item => {
                this.ciw_data.section2.push(item);
              });

              this.ciw_data.section2.forEach(element => {
                let no_of_file = element.file_name.split('_')[0];
                let provider = this.$store.state.prv_data.provider_tin 
                  ? this.$store.state.prv_data.provider_tin 
                  : this.$store.state.prv_data.provider_code;

                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4;
                element.name = element.file_name.substring(sum);
                element.loader = false;
              });
            }

            ['medicine'].forEach(key => {
              if (Array.isArray(attachment[key])) {
                attachment[key].forEach(item => {
                  this.ciw_data.section3.attachments.push(item);
                });
              }
            });

            this.ciw_data.section3.attachments.forEach(element => {
              let no_of_file = element.file_name.split('_')[0];
              let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code;
              let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4;
              element.name = element.file_name.substring(sum);
              element.loader = false;
            });
          }

          this.saveData();
          this.$store.commit('set_loading_category', false)
          this.getDrugsMedicine(); 
          this.getMedicalSupplies();
          this.getUnitOfMeasurement();
        } else {
            this.alert = response.error;
        }
      } else {
        this.ciw_data = JSON.parse(ciw_data)
        this.pci_data = JSON.parse(pci_data)
        // this.procedures_length = this.pci_data.PRIMARY[0].procedure.length
        //this.total_fees = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('49SFL4'), 'FoelR42s').toString(this.$crypto.enc.Utf8))
        this.$store.commit('set_loading_category', false)
        this.getDrugsMedicine();
        this.getMedicalSupplies();
        this.getUnitOfMeasurement();
      }
    },

    async getDocumentType() {
        let response = await this.$services.getTransactionIpRefData({
            request_key: 'eclaim_document_type',
            category: "surgical"
        })

        if(response.status === 200) {
          response.data.map(data => {
            if(data.doc_type === 'OPR'){
              this.surgical_items.push(data)
            } else {
              this.others_items.push(data)
            }
          })
        }else{
          this.alert = response.error
        }
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

    async updateCertificationData(){
      let get_caserate = await this.getEclaimsCaseRateInfo(this.caserate_list_items);

      const primary_icd_codes = this.pci_data.PRIMARY.map(d => d.icd_code);

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
          caserate_tag: rate.caserate_tag, // IDENTIFIER FOR CASE RATE, VALUE 1 AND 2
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
          ...(rate.eclaim_item_code ? { eclaim_item_code: rate.eclaim_item_code } : undefined)

        }; // ONLY STORE THE CASERATE_CODE

      });

      // LOOP OVER EACH DIAGNOSIS TYPE
      this.diagnosis_items_key.forEach(section => {
        if (!this.pci_data[section]) return;

        this.pci_data[section].forEach(element => {
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
              proc.hci_fee = case_rate_lookup[proc.cpt_code].hci_fee || '0.00'
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

    // GET DRUGS/MEDICINE
    async getDrugsMedicine(){
      if(this.trans_detail.editable){
        if(localStorage.getItem('FGG536')){
          this.medicine_list = localStorage.getItem('FGG536') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('FGG536'), 'puuioGDt').toString(this.$crypto.enc.Utf8)) : null
          this.load_medicine = false
        }else{
          let response = await this.$services.getTransactionIpRefData({
              request_key: 'otc_medicine',
              provider_code: this.$store.state.prv_data.provider_code
          });

          if (response.status === 200) {
              //response.data = this.responseDataDecryption(response.data)
              this.medicine_list = response.data.map(item => {
                  let medicine = {
                      medicine_no: item.medicine_no,
                      otc_medicine_code: item.otc_medicine_code,
                      unit_type: item.unit_type,
                      dosage: item.dosage,
                      preparation: item.preparation,
                      route: item.route,
                      generic_name: item.generic_name,
                      max_stock_quantity: item.max_stock_quantity,
                      generic_name_text: item.generic_name + item.brand_name + item.dosage,
                      other_med_group: item.pOthMedDrugGroup ? item.pOthMedDrugGroup : '',
                      current_quantity: item.current_quantity ? item.current_quantity : 0,
                      quantity: 1,
                      route_editable: !item.route
                  }
                  
                  return medicine
              })

              localStorage.setItem('FGG536', this.$crypto.AES.encrypt(JSON.stringify(this.medicine_list), 'puuioGDt'))
              this.load_medicine = false
          } else {
              this.alert = response.error;
          }
          // this.$axios.post(this.$cms_url+'resources/api/_get_transaction_ip_ref_data.php', this.$qs.stringify({
          //   post_data: this.wsDataEncryption(JSON.stringify({
          //     request_key: 'medicine'
          //   }))
          // }))
          // .then(response => {
          //   //response.data = this.responseDataDecryption(response.data)
          //   this.medicine_list = response.data.map(item => {
          //     let medicine = {
          //       quantity: 1,
          //       brand_name: item.brand_name,
          //       dosage: item.dosage,
          //       route: item.route,
          //       preparation: item.preparation,
          //       medicine_no: item.medicine_no,
          //       medicine_code: item.medicine_code,
          //       amount: Number(item.amount).toFixed(2),
          //       total_cost_per_medicine: item.amount,
          //       generic_name: item.generic_name,
          //       generic_name_text: item.generic_name + item.brand_name + item.dosage
          //     }
              
          //     return medicine
          //   })

          // })
          // .catch(error => {
          //    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          // })
        }
      }else{
        this.load_medicine = false
      }
    },

    // GET DRUGS/MEDICINE
    async getMedicalSupplies(){
      let response = await this.$services.getTransactionIpRefData({
        request_key: 'eclaims_med_supplies',
      });

      if (response.status === 200) {
        this.medical_supplies = response.data; 
        this.load_medical_supplies = false;
      } else {
        this.alert = response.error;
      }
    },

    async getUnitOfMeasurement(){
      let response = await this.$services.getTransactionIpRefData({
        request_key: 'eclaims_unit_of_measurement',
      });

      if (response.status === 200) {
        this.unit_of_measurement = response.data; 
        this.load_unit_of_measurement = false;
      } else {
        this.alert = response.error;
      }
    },

    // ADD ITEMS MEDICAL SUPPLIES
    addItem(item) {
      if (!item) return;

      if (!this.ciw_data || !Array.isArray(this.ciw_data.section5)) {
        this.$set(this.ciw_data, 'section5', []);
      }

      const new_item = {
        ...item,
        unit_of_measurement: '',
        quantity: 1,
        amount: 0,
        total: 0,
      };

      this.ciw_data.section5.push(new_item);
      this.ciw_data.status.medical_supplies = true
      this.selected_item = null;
    },

    removeItem(index) {
      this.ciw_data.section5.splice(index, 1);
    },

    // DISPLAY CPT PROCEDURES
    displayCptProcedures(){
      let procedures = []

      this.pci_data.PRIMARY[0].forEach((icd, icd_index) => {
        icd.procedure.forEach((cpt, cpt_index) => {
          cpt.icd_index = icd_index
          cpt.icd_description = icd.icd_description
          cpt.cpt_index = cpt_index
          procedures.push(cpt)
        })
      })

      this.procedures_length = procedures.length
      return procedures
    },

    // CONFIRM REMOVE OF PROCEDURES
    confirmRemoveProcedure(icd_index, icd_description, cpt_index){
      this.class_data = {
        index: icd_index,
        data: cpt_index
      }

      let title = 'This procedure will also be removed in Discharged Diagnosis under ICD: <h4 class="my-3 font-weight-regular">'+icd_description+'</h4>'
      this.alert = { display: true, type: 'standard', width: '600', icon: 'mdi-alert-circle', color: 'red', title: title, body: 'Click OKAY to continue', btn_pry_txt: 'OKAY', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'loadingBtn', btn_pry_emt: 'removeProcedure', btn_sec_txt: 'CANCEL', btn_sec_color: 'grey darken-2', btn_sec_otl: true, btn_sec_act: 'closeAlert' }
    },

    // REMOVE PROCEDURE
    removeProcedure(){
      let procedure = this.pci_data.data[this.class_data.index].procedures[this.class_data.data]

      let hci_fee = parseFloat(procedure.rvs_hci_fee ? procedure.rvs_hci_fee.replace(/,/g, '') : 0)
      let pf_fee = parseFloat(procedure.rvs_professional_fee ? procedure.rvs_professional_fee.replace(/,/g, '') : 0)

      if(procedure.rvs_case_rate){
        let total_cpt_amount = parseFloat(procedure.cpt_amount ? procedure.cpt_amount.replace(/,/g, '') : 0)
        this.total_fees.total_cpt_amount -= total_cpt_amount
      }

      this.total_fees.hci_fee -= hci_fee
      this.total_fees.pf_fee -= pf_fee
      this.total_fees.grand_total = this.total_fees.pf_fee + this.total_fees.hci_fee
      this.total_fees.status = true 
      sessionStorage.setItem('49SFL4', this.$crypto.AES.encrypt(JSON.stringify(this.total_fees), 'FoelR42s'))

      if(procedure.transaction_cpt_no){
        procedure.cpt_tag = 'OLD'
        this.pci_data.data[this.class_data.index].old_procedures.push(procedure)
      }

      let philhealth_certification = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('kgdlDt'), 'vcoF535f').toString(this.$crypto.enc.Utf8))
      philhealth_certification.total_cpt_amount = this.total_fees.total_cpt_amount

      sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
      
      this.pci_data.data[this.class_data.index].procedures.splice(this.class_data.data, 1)
      this.alert = {}
      this.pci_data.status = true
      this.$emit('change-status')
      this.ciw_data.status.doctors = true
    },

    // ADD DOCTORS ORDER/ACTION
    addDoctorsOrder(){
      this.doctors_order.data.push({
        date: '',
        doctors_order: ''
      })
      this.ciw_data.status.doctors = true
    },

    // REMOVE ADDED DOCTORS ORDER/ACTION
    removeAddedDoctorsOrder(index){
      this.doctors_order.data.splice(index, 1)
      this.checkDataStatus('doctors')
      this.$emit('change-status')
      this.ciw_data.status.doctors = true
    },

    // ADD ATTACHED FILE FOR SURGICAL PROCEDURES
    addAttachedSurgical(){
      this.selected_doct_type_holder = this.selected_doc_type
      this.selected_doc_type = []
      let attached_files = []
      let re_attached_files = []
      this.new_surgical_status = true
      let new_file_name = this.selected_doct_type_holder.doc_type+'_'+this.selected_doct_type_holder.group_type

      this.ciw_data.section2.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })

      this.view_attached_surgical.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })

      Object.values(this.$refs.surgical.files).forEach(element => {
        if(attached_files.includes(new_file_name+'_'+element.name)){
          re_attached_files.push('<br>'+new_file_name+'_'+element.name)
        }else{
          element.document_id = this.selected_doct_type_holder.document_id
          element.group_type = this.selected_doct_type_holder.group_type
          element.doc_type = this.selected_doct_type_holder.doc_type

          this.post_attached_surgical.push(element)
          this.view_attached_surgical.push({
            name: new_file_name+'_'+element.name,
            file_size: Number(element.size * 0.00000095367432).toFixed(2),
            file_path: window.URL.createObjectURL(element)
          })
        }
      })

      if(re_attached_files.length > 0){
        let title = 'This file already exist and cannot be attached again.<b>' + re_attached_files + ' </b>'
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-close-circle', color: 'red', title: title, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },

    // REMOVE ATTACHED FILE FOR SURGICAL PROCEDURES
    async removeAttachedSurgical(index, status){
      if(status === 'old'){
        this.ciw_data.section2[index].loader = true

        let response = await this.$services.trnDelAttachment({
            provider_code: this.$store.state.prv_data.provider_code,
            // phic_tracking_number: this.trans_detail.phic_tracking_number,
            transaction_number: this.trans_detail.transaction_number,
            // attachment_category: 'SURGICAL PROCEDURE',
            file_name: this.ciw_data.section2[index].file_name,
            group_type: this.ciw_data.section2[index].group_type  //ATTACHMENT UPDATES
        });

        if (response.status === 200) {
          if(response.data.success){
            this.ciw_data.section2.splice(index, 1)
            this.saveData();
          }else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
        // this.$axios.post(this.$cms_url+'resources/controller/trn_del_attachment.php', this.$qs.stringify({
        //   post_data: this.wsDataEncryption(JSON.stringify({
        //     provider_code: this.$store.state.prv_data.provider_code,
        //     // phic_tracking_number: this.trans_detail.phic_tracking_number,
        //     transaction_number: this.trans_detail.transaction_number,
        //     // attachment_category: 'SURGICAL PROCEDURE',
        //     file_name: this.ciw_data.section2[index].file_name,
        //     group_type: this.selected_doct_type_holder.group_type
        //   }))
        // }))
        // .then(response => {
        //   if(response.data.success){
        //     this.ciw_data.section2.splice(index, 1)
        //     this.saveData();
        //   }else{
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }else{
        this.post_attached_surgical.splice(index - this.post_attached_surgical.length, 1)
        this.view_attached_surgical.splice(index - this.view_attached_surgical.length, 1)
      }
      document.getElementById("attached-surgical").value = "";
    },

    // POST ATTACHED FILE TO SERVER OF SURGICAL PROCEDURE
    async postFileOfSurgical(){
      if(this.post_attached_surgical.length === 0){
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else{
        this.$store.commit('set_prevent_navigation', false)
        this.loading_surgical_attachment = true
        this.new_surgical_status = 'Processing'
        let formData = new FormData();
        let total_count = this.post_attached_surgical.length
        let file_datas = []

        for( var i = 0; i < this.post_attached_surgical.length; i++ ){
          let original_name = this.post_attached_surgical[i].name
          let original_file = this.post_attached_surgical[i];

          // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
          let new_name_file = `${this.post_attached_surgical[i].doc_type}_${this.post_attached_surgical[i].group_type}_${original_name}`;

          // CREATE A NEW FILE OBJECT NAME
          let file = new File([original_file], new_name_file, {
            type: original_file.type,
            lastModified: original_file.lastModified,
          });

          file_datas.push({
            document_id: this.post_attached_surgical[i].document_id,
            group_type: this.post_attached_surgical[i].group_type
          });

          formData.append('file'+ i +'', file);
        }

        formData.append('post_data', this.wsDataEncryption(JSON.stringify({
          request_key: "surgical_procedure",
          transaction_number: this.trans_detail.transaction_number,
          created_by: this.$store.state.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code,
          file_datas: file_datas,
          attachment_category: 'SURGICAL PROCEDURE',
          total_count: total_count,
          rth: this.trans_detail.eclaims_status === "RETURN" ? 1 : 0
          // request_key: 'phic_patient_prov_attachments',
          // total_count: total_count
        })))

        // this.$axios.post(this.$cms_url+'resources/controller/trn_upd_inpatient_ciw.php', 
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }
        // )

        let response = await this.$services.trnAddEclaimsAttachedFiles({
            formData
        });

        if (response.status === 200) {
          if(response.data.success){         
              this.responseDataDecryption(response.data.file_path).forEach(element => {
                let no_of_file = element.file_name.split('_')[0]
                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

                element.name = element.file_name.substring(sum)
                element.loader = false
                element.group_type = this.selected_doct_type_holder.group_type //ATTACHMENT UPDATES
                this.ciw_data.section2.push(element)
              })

              this.new_surgical_status = false
              this.post_attached_surgical = []
              this.view_attached_surgical = []
              this.loading_surgical_attachment = false
              this.$store.commit('set_prevent_navigation', true)
              this.saveData();
            }else{
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        } else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
        
        // this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_attached_files.php',
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }
        // )
        // .then(response => {
        //   if(response.status === 200) {
        //     if(response.data.success){         
        //       this.responseDataDecryption(response.data.file_path).forEach(element => {
        //         let no_of_file = element.file_name.split('_')[0]
        //         let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
        //         let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

        //         element.name = element.file_name.substring(sum)
        //         element.loader = false
    
        //         this.ciw_data.section2.push(element)
        //       })

        //       this.new_surgical_status = false
        //       this.post_attached_surgical = []
        //       this.view_attached_surgical = []
        //       this.loading_surgical_attachment = false
        //       this.$store.commit('set_prevent_navigation', true)
        //       this.saveData();
        //     }else{
        //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     }
        //   } else {
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }
    },

    // ADD DRUGS/MEDICINE
    addDrugsMedicine(data) {
      this.ciw_data.section3.medicine.push({
        ...data,
        quantity: 1,
        amount: 0,
        total_cost_per_medicine: 0,
        route: data.route || 'N/A',
      });
      this.ciw_data.status.medicine = true;
      this.selected_medicine.push(data.generic_name_text);
      this.$emit('change-status');
    },
    
    // REMOVE ADDED DRUGS OR MEDICINE
    removeAddedDrugsMedicine(index){
      this.selected_medicine.forEach((element, index) => {
        if(element === this.ciw_data.section3.medicine[index].generic_name_text){
          this.selected_medicine.splice(index, 1)
        }
      })
      this.ciw_data.section3.medicine.splice(index, 1)
      this.ciw_data.status.medicine = true
      this.$emit('change-status')
    },

    // AUTO-COMPUTE FOR TOTAL COST PER MEDICINE
    /*autoComputeTotalCost(index, quantity, amount){
      this.ciw_data.section3.medicine[index].total_cost_per_medicine = Number(quantity * amount)
      this.ciw_data.status.medicine = true
      this.$forceUpdate(); 
      this.$emit('change-status')
    },*/

    autoComputeTotalCost(index, quantity, amount) {
      const qty = Number(quantity) || 0;
      const amt = Number(amount) || 0;

      const item = this.ciw_data.section3.medicine[index];
      item.quantity = qty;
      item.amount = amt;
      item.total_cost_per_medicine = qty * amt;
      this.ciw_data.status.medicine = true;
      this.$emit('change-status');
    },
    
    updateTotal(index, quantity, amount) {
      const qty = Number(quantity) || 0;
      const amt = Number(amount) || 0;

      const item = this.ciw_data.section5[index];
      item.quantity = qty;
      item.amount = amt;
      item.total = qty * amt;
      this.ciw_data.status.medical_supplies = true;
      this.$emit('change-status');
    },

    // ADD ATTACHED FILE FOR MEDICINE
    addAttachedMedicine(){
      this.selected_med_doct_type_holder = this.selected_med_doc_type
      this.selected_med_doc_type = []

      let attached_files = []
      let re_attached_files = []
      this.new_medicine_status = true
      let new_file_name = this.selected_med_doct_type_holder.doc_type+'_'+this.selected_med_doct_type_holder.group_type

      this.ciw_data.section3.attachments.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })

      this.view_attached_medicine.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })

      Object.values(this.$refs.medicine.files).forEach(element => {
        if(attached_files.includes(new_file_name+'_'+element.name)){
          re_attached_files.push('<br>'+new_file_name+'_'+element.name)
        }else{
          element.document_id = this.selected_med_doct_type_holder.document_id
          element.group_type = this.selected_med_doct_type_holder.group_type
          element.doc_type = this.selected_med_doct_type_holder.doc_type

          this.post_attached_medicine.push(element)
          this.view_attached_medicine.push({
            name: new_file_name+'_'+element.name,
            file_size: Number(element.size * 0.00000095367432).toFixed(2),
            file_path: window.URL.createObjectURL(element)
          })
        }
      })

      if(re_attached_files.length > 0){
        let title = 'This file already exist and cannot be attached again.<b>' + re_attached_files + ' </b>'
        this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-close-circle', color: 'red', title: title, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }
    },

    // REMOVE ATTACHED FILE FOR MEDICINE
    async removeAttachedMedicine(index, status){
      if(status === 'old'){
        this.ciw_data.section3.attachments[index].loader = true

        let response = await this.$services.trnDelAttachment({
          provider_code: this.$store.state.prv_data.provider_code,
          // phic_tracking_number: this.trans_detail.phic_tracking_number,
          transaction_number: this.trans_detail.transaction_number,
          // attachment_category: 'MEDICINE',
          file_name: this.ciw_data.section3.attachments[index].file_name,
          group_type: this.ciw_data.section3.attachments[index].group_type //ATTACHMENT UPDATES
        });

        if (response.status === 200) {
          if(response.data.success){
            this.ciw_data.section3.attachments.splice(index, 1)
            this.saveData();
          }else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        } else{
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }

        // this.$axios.post(this.$cms_url+'resources/controller/trn_del_attachment.php', this.$qs.stringify({
        //   post_data: this.wsDataEncryption(JSON.stringify({
        //     provider_code: this.$store.state.prv_data.provider_code,
        //     // phic_tracking_number: this.trans_detail.phic_tracking_number,
        //     transaction_number: this.trans_detail.transaction_number,
        //     // attachment_category: 'MEDICINE',
        //     file_name: this.ciw_data.section3.attachments[index].file_name,
        //     group_type: this.selected_med_doct_type_holder.group_type,
        //   }))
        // }))
        // .then(response => {
        //   if(response.data.success){
        //     this.ciw_data.section3.attachments.splice(index, 1)
        //     this.saveData();
        //   }else{
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }else{
        this.post_attached_medicine.splice(index - this.post_attached_medicine.length, 1)
        this.view_attached_medicine.splice(index - this.view_attached_medicine.length, 1)
      }
      document.getElementById("attached-medicine").value = "";
    },
    
    // POST ATTACHED FILE TO SERVER OF DRUGS/MEDICINE
    async postFileOfMedicine(){
      if(this.post_attached_medicine.length === 0){
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else{
        this.$store.commit('set_prevent_navigation', false)
        this.loading_medicine_attachment = true
        this.new_medicine_status = 'Processing'
        let formData = new FormData()
        let total_count = this.post_attached_medicine.length
        let file_datas = []

        for( var i = 0; i < this.post_attached_medicine.length; i++ ){
          let original_name = this.post_attached_medicine[i].name
          let original_file = this.post_attached_medicine[i];

          // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
          let new_name_file = `${this.post_attached_medicine[i].doc_type}_${this.post_attached_medicine[i].group_type}_${original_name}`;

          // CREATE A NEW FILE OBJECT NAME
          let file = new File([original_file], new_name_file, {
            type: original_file.type,
            lastModified: original_file.lastModified,
          });

          file_datas.push({
              document_id: this.post_attached_medicine[i].document_id,
              group_type: this.post_attached_medicine[i].group_type
          });

          formData.append('file'+ i +'', file)
        }

        formData.append('post_data', this.wsDataEncryption(JSON.stringify({
          request_key: "medicine",
          transaction_number: this.trans_detail.transaction_number,
          created_by: this.$store.state.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code,
          file_datas: file_datas,
          attachment_category: 'MEDICINE',
          total_count: total_count,
          rth: this.trans_detail.eclaims_status === "RETURN" ? 1 : 0
        })))

        let response = await this.$services.trnAddEclaimsAttachedFiles({
            formData
        });

        if (response.status === 200) {
          if(response.data.success){         
              this.responseDataDecryption(response.data.file_path).forEach(element => {
                let no_of_file = element.file_name.split('_')[0]
                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

                element.name = element.file_name.substring(sum)
                element.loader = false
                element.group_type = this.selected_med_doct_type_holder.group_type //ATTACHMENT UPDATES
                this.ciw_data.section3.attachments.push(element)
              })

              this.new_medicine_status = false
              this.post_attached_medicine = []
              this.view_attached_medicine = []
              this.loading_medicine_attachment = false
              this.$store.commit('set_prevent_navigation', true)
              this.saveData();
            }else{
              this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            }
        } else{
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
        // this.$axios.post(this.$cms_url+'resources/controller/trn_upd_inpatient_ciw.php', 
        // this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_attached_files.php',
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }
        // )
        // .then(response => {
        //   if(response.status === 200) {
        //     if(response.data.success){         
        //       this.responseDataDecryption(response.data.file_path).forEach(element => {
        //         let no_of_file = element.file_name.split('_')[0]
        //         let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
        //         let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

        //         element.name = element.file_name.substring(sum)
        //         element.loader = false
    
        //         this.ciw_data.section3.attachments.push(element)
        //       })

        //       this.new_medicine_status = false
        //       this.post_attached_medicine = []
        //       this.view_attached_medicine = []
        //       this.loading_medicine_attachment = false
        //       this.$store.commit('set_prevent_navigation', true)
        //       this.saveData();
        //     }else{
        //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     }
        //   } else {
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }
    },

    // CHECK FORMAT
    checkFormat(value){
      if(value){
        value = value.toLocaleString()

        if(value.toLocaleString().includes('.')){
          if(value.toLocaleString().includes(',')){
            return value
          }else{
            return value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        }else{
          if(value.toLocaleString().includes(',')){
            return value+'.00'
          }else{
            return value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'.00'
          }
        }
      }else{
        return '0.00'
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
      if(data === 'ciw'){
        this.comment_title = 'COURSE IN THE WARD'
        this.comment_content = this.comment_data.cf4_part4
      }else if(data === 'surgical'){
        this.comment_title = 'SURGICAL PROCEDURE'
        this.comment_content = this.comment_data.cf4_part4_1
      }else if(data === 'medicine'){
        this.comment_title = 'DRUGS/MEDICINE'
        this.comment_content = this.comment_data.cf4_part5
      }else{
        this.comment_title = 'OUTCOME OF TREATMENT'
        this.comment_content = this.comment_data.cf4_part6
      }
      this.comment_dialog = true
    },

    // CHECK IF DATA HAS BEEN CHANGED
    // checkDataStatus(data){
    //   this.$emit('change-status')
    //   if(data === 'doctors'){
    //     this.doctors_order.status = true
    //     this.empty_doctors = ''

    //     this.doctors_order.data.forEach(element => {
    //       if(element.date === '' && element.doctors_order !== ''){
    //         this.empty_doctors = 'empty'
    //       }
    //     })
    //   }else{
    //     this.ciw_data.status.outcome = true
    //   }

    //   this.$emit('input', [this.empty_doctors, this.unsaved_surgical, this.unsaved_medicine])
    // },

    checkDataStatus(data){
      this.$emit('change-status')

      // const invalid_input = (value) => {
      //   if (!value) return true
      //   const normalized = value.trim().toLowerCase()
      //   const invalid = ['n/a', 'none', 'not applicable', 'na']
      //   return invalid.includes(normalized)
      // }

      if (data === 'doctors') {
        this.doctors_order.status = true
        this.empty_doctors = ''

        const invalid_doctor_order = this.doctors_order.data.some(element => {
          return !element.date && this.invalidInput(element.doctors_order)
        })

        if (invalid_doctor_order) {
          this.empty_doctors = 'empty'
        }
      } else {
        this.ciw_data.status.outcome = true
      }

      if (data === 'others') {
        this.empty_route = ''
        this.empty_diagnostic = ''

        // const invalid_route = this.ciw_data.section3.medicine.some(med => {
        //   return this.invalidInput(med.route)
        // })

        // if (invalid_route) {
        //   this.empty_route = 'empty'
        // }

        const invalid_diagnostic = this.ciw_data.section6.some(proc => {
          return proc.type_of_diagnostic
        })

        if (invalid_diagnostic) {
          this.empty_diagnostic = 'empty'
        }
      }

      this.$emit('input', [this.empty_doctors,this.unsaved_surgical,this.empty_route,this.unsaved_medicine,this.empty_diagnostic])
    },
    
    saveProcedure(){
      const procedures = [];
      const primary = this.pci_data?.PRIMARY || [];
      const secondary = this.pci_data?.SECONDARY || [];
      const others = this.pci_data?.OTHERS || [];

    
      [...primary, ...secondary, ...others].forEach(diagnosis => {
        if (Array.isArray(diagnosis.procedure)) {
          diagnosis.procedure.forEach(proc => {
            procedures.push({
              cpt_code: proc.cpt_code,
              cpt_description: proc.cpt_description,
              type_of_diagnostic: proc.type_of_diagnostic || '',
              service_date: proc.procedure_date,
              amount: parseFloat((proc.procedure_amount || '').toString().replace(/,/g, '')) || 0, 
              item_code: proc?.eclaims_code?.item_code || '',
              item_name: proc?.eclaims_code?.item_desc || ''
            });
          });
        }
      });

      this.ciw_data.section6 = procedures;
    },

    saveSummaryOfFees(){
      this.ciw_data.summary_of_fees = {
        total_procedure_amount: Number(this.total_procedure_amount),
        total_medicine_amount: this.grand_total,
        total_medical_supplies_amount: this.grand_total_medical_supplies
      }
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      this.saveSummaryOfFees();
      this.saveProcedure();
      this.ciw_data.status = {
        procedure: this.ciw_data.section6.length > 0,
        doctors: this.doctors_order.data.length > 0,
        medicine: this.ciw_data.section3.medicine.length > 0,
        medical_supplies: this.ciw_data.section5.length > 0,
        outcome: !!this.ciw_data.section4.outcome_treatment
      };

      sessionStorage.setItem('LG4S04', this.$crypto.AES.encrypt(JSON.stringify(this.doctors_order), '5s05SLFI'))
      sessionStorage.setItem('PORT4D', this.$crypto.AES.encrypt(JSON.stringify(this.ciw_data), 'X4d3r5fS'))
      sessionStorage.setItem('LYK56D', this.$crypto.AES.encrypt(JSON.stringify(this.pci_data), 'XLgopi4x'))
    },

    blurData(item) {
      const cpt_code = this.ciw_data.section6.find(
        c => c.cpt_code === item.cpt_code
      );

      if (cpt_code) {
        cpt_code.amount=item.procedure_amount
      }

      const total = this.ciw_data.section6.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );

      this.ciw_data.summary_of_fees.total_procedure_amount = total;
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
.outcome-treatment{
  width: 20%;
}
.table-overflow-x{
  border: 2px solid #dedede; 
  border-radius: 4px;
  margin-top: 4px;
  overflow-x: auto; 
  overflow-y: hidden; 
  padding: 0 6px;
}
.table-overflow-x table{
  min-width: 1000px;
  width: 100%; 
}
.unit-height {
  font-size: 121x;
  min-height: 30px !important;
  margin-top: 0 !important;
  padding-top: -10px !important;
  padding-bottom: 0px !important;
  margin-bottom: 0px !important;
}

.unit-height .v-input__control {
  height: 50px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.attachment-name {
    cursor: pointer;
}

.attachment-name:hover {
    color: #1976D2;
    text-decoration: underline;
}
</style>