<template>
  <div>
    <v-form :readonly="!trans_detail.editable">
      <!-- PHYSICAL EXAMINATION (PERTINENT FINDINGS PER SYSTEM) -->
      <v-row wrap>
        <v-col cols="12" sm="3" md="6" lg="6">
          <h1 class="section-title">PHYSICAL EXAMINATION (PERTINENT FINDINGS PER SYSTEM)</h1>
        </v-col>
        <v-col cols="12" sm="3" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf4_part3_number5" @click="displayCommentData('physical')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>
      
      <label>GENERAL SURVEY</label>
      <v-btn v-if="trans_detail.editable && !!pex_data.section1.general_survey" @click="pex_data.section1.general_survey = '', checkDataStatus('other')" class="ml-2" width="60" height="25" small>Clear</v-btn>
      <v-radio-group v-model="pex_data.section1.general_survey" @change="checkDataStatus('other')" readonly class="mb-6 ma-0 ml-6" hide-details>
        <v-radio value="AWAKE AND ALERT" label="Awake and Alert"></v-radio>
        <v-row no-gutters align="center">
          <v-col cols="2">
            <v-radio value="ALTERED SENSORIUM" label="Altered Sensorium"></v-radio>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="pex_data.section1.as_remarks" @change="checkDataStatus('other')" :disabled="pex_data.section1.general_survey !== 'ALTERED SENSORIUM'" label="Remarks" hide-details dense></v-text-field>
          </v-col>
        </v-row>
      </v-radio-group>
      
      <label>VITAL SIGNS</label>
      <v-row class="mt-n2" dense>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.vital_signs_bp" @change="checkDataStatus('other')" readonly label="Blood Pressure" maxlength="100"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.vital_signs_cr" @change="checkDataStatus('other')" readonly label="Heart Rate" maxlength="100"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.vital_signs_rr" @change="checkDataStatus('other')" readonly label="Respiratory Rate" maxlength="100"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.vital_signs_temp" @change="checkDataStatus('other')" readonly label="Temperature" maxlength="100"></v-text-field>
        </v-col>
      </v-row>

      <v-row class="mt-n2" dense>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.height" @change="checkDataStatus('other')" readonly label="Height" maxlength="100"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" lg="3">
          <v-text-field v-model="pex_data.section1.weight" @change="checkDataStatus('other')" readonly label="Weight" maxlength="100"></v-text-field>
        </v-col>
      </v-row>

      <!-- <label>HEENT</label>
      <v-row v-show="loading_heent" class="text-center my-10" justify="center" wrap>
        <v-col cols="12" sm="2" md="4" lg="4">
          <v-progress-linear color="primary" height="6" indeterminate></v-progress-linear>
          <h6>Loading Selection. Please Wait...</h6>
        </v-col>
      </v-row> -->
      
      <!-- <v-row align="center" wrap>

        {{ selected_heent }}
        <v-col v-for="(heent, i) in heent_items" :key="i" cols="12" sm="6" md="4" lg="4">
          <v-checkbox v-model="selected_heent" :label="heent.assessment" :value="heent.assessment" @change="addSelectedHeent(heent, $event)" readonly class="pa-0 ma-1 ml-6" hide-details></v-checkbox>
        </v-col>
      </v-row> -->

      <v-divider class="my-5"></v-divider>
      <!-- <v-row dense>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.chest" :items="chest_lungs_items" :loading="loading_chest" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="Chest/Lungs" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.cvs" :items="cvs_items" :loading="loading_cvs" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="CVS" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.abdomen" :items="abdomen_items" :loading="loading_abdomen" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="ABDOMEN" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      <v-row dense>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.gu" :items="gu_items" :loading="loading_gu" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="GU(IE)" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.skin" :items="skin_items" :loading="loading_skin" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="SKIN/EXTREMITIST" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.neuro" :items="neuro_items" :loading="loading_neuro" :clearable="trans_detail.editable" @change="checkDataStatus('other')" label="NEURO-EXAM" item-text="assessment" readonly hide-details filled></v-autocomplete>
        </v-col>
      </v-row> -->

      <v-row dense>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.chest" :items="chest_lungs_items" :loading="loading_chest" @change="checkDataStatus('other')" label="Chest/Lungs" item-text="assessment" readonly small-chips multiple hide-details filled ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.cvs" :items="cvs_items" :loading="loading_cvs" @change="checkDataStatus('other')" label="CVS" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.abdomen" :items="abdomen_items" :loading="loading_abdomen" @change="checkDataStatus('other')" label="ABDOMEN" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row dense>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.gu" :items="gu_items" :loading="loading_gu" @change="checkDataStatus('other')" label="GU(IE)" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.skin" :items="skin_items" :loading="loading_skin" @change="checkDataStatus('other')" label="SKIN/EXTREMITIST" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.neuro" :items="neuro_items" :loading="loading_neuro" @change="checkDataStatus('other')" label="NEURO-EXAM" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row dense>
        <v-col cols="12" sm="12" md="4" lg="4">
          <v-autocomplete v-model="pex_data.section1.heent" :items="heent_items" :loading="loading_gu" @change="addSelectedHeent(heent, $event)" label="HEENT" item-text="assessment" readonly small-chips multiple hide-details filled></v-autocomplete>
        </v-col>
      </v-row>
      
      <!-- PERTINENT LABORATORY AND DIAGNOSTIC FINDINGS -->
      <v-row class="mt-7" wrap>
        <v-col cols="12" sm="3" md="6" lg="6">
          <h1 class="section-title">PERTINENT LABORATORY AND DIAGNOSTIC FINDINGS</h1>
        </v-col>
        <v-col cols="12" sm="3" md="6" lg="6" class="text-right">
          <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part1_number9" @click="displayCommentData('pertinent')" color="primary" tile depressed small>CHECK COMMENTS 
            <v-badge content="!" color="red">
              <v-icon class="pl-1" small>mdi-comment</v-icon>
            </v-badge>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mb-4"></v-divider>
      
      <v-row class="d-none d-sm-flex mt-5 text-center" justify="center" wrap>
        <v-col cols="12" sm="4" md="4" lg="4">
          <label class="body-2 font-weight-medium">DATE</label>
        </v-col>
        <v-col cols="12" sm="8" md="8" lg="8">
          <label class="body-2 font-weight-medium">DESCRIPTION</label>
        </v-col>
      </v-row>

      <v-row v-for="(add, i) in pertinent_lab.data" :key="i" class="mt-4 mt-sm-n2" dense>
        <v-col cols="12" sm="4" md="4" lg="4">
          <v-menu :disabled="!trans_detail.editable" :close-on-content-click="false" transition="scale-transition" max-width="290px" min-width="290px" offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field v-model="add.date_of_lab" v-on="on" :label="$vuetify.breakpoint.smAndUp ? '' : 'Date'" @blur="checkDataStatus('pertinent')" class="body-2 ma-0 pa-0" hide-details readonly dense>
                <template v-slot:prepend>
                  <label class="body-2 pt-1 black--text">{{ i+1 }})</label>
                </template>
              </v-text-field>
            </template>
            <v-date-picker v-model="add.date_of_lab_date" :max="confinement_date.date_discharged" :min="confinement_date.date_admitted" @input="add.date_of_lab = formatDate(add.date_of_lab_date)" @change="checkDataStatus('pertinent')" no-title></v-date-picker>
          </v-menu> 
        </v-col>

        <v-col class="pl-7 pl-sm-0" cols="12" sm="8" md="8" lg="8">
          <v-text-field v-model="add.description" :label="$vuetify.breakpoint.smAndUp ? '' : 'Description'" @blur="checkDataStatus('pertinent')" class="body-2 ma-0 pa-0" hide-details dense>
            <template v-if="trans_detail.editable" v-slot:append-outer>
              <v-icon @click="removeAddedDateDescription(i)" class="icon-pl pr-1" size="26">mdi-delete</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="pr-10 mt-2" wrap>
        <v-spacer></v-spacer>
        <v-btn v-if="trans_detail.editable" @click="addDateDescription" tile>
          <v-icon class="pr-1" size="22">mdi-plus</v-icon>ADD FINDINGS
        </v-btn>
      </v-row>

      <!-- FILE ATTACHMENT FOR PERTINENT LABORATORY -->
      <v-row class="mt-10 pb-2" justify="center" align="center" wrap>
        <v-col cols="12" sm="6" md="4" lg="4" class="pr-1">
          <v-select v-model="selected_doc_type" :items="pertinent_findings_items" item-text="doc_description" label="Document Type" outlined dense return-object> </v-select>
          <label for="attached-pertinent" class="file-attachment">Choose File</label> 
          <span class="ml-1" v-if="pex_data.section2.length === 0">No file chosen</span>
          <span class="ml-1" v-else>{{ pex_data.section2.length }} files</span>
          <input :disabled="!trans_detail.editable || new_pertinent_status === 'Processing' || selected_doc_type.length === 0" @change="addAttachedPertinent" id="attached-pertinent" class="mt-4 d-none" type="file" ref="pertinent" accept=".pdf,.jpg" multiple><br>
          <v-divider class="mt-3"></v-divider>

          <div v-for="(attached, i) in pex_data.section2" :key="i">
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
                    :disabled="!trans_detail.editable || new_pertinent_status === 'Processing'"
                    @click="removeAttachedPertinent(i, 'old')"
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

          <div v-for="(view, i) in view_attached_pertinent" :key="'view'+i" class="text-left">
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
                <v-progress-circular v-if="new_pertinent_status === true || new_pertinent_status === 'Processing'" class="mr-2" color="red" size="13" width="1.4" :indeterminate="new_pertinent_status === 'Processing'"></v-progress-circular>
                <v-icon v-else color="success" size="20">mdi-check</v-icon>
              </template>
              {{ view.name }} <span class="text--secondary">- {{ view.file_size }} MB</span>
              <v-icon v-show="new_pertinent_status !== 'Processing'" @click="removeAttachedPertinent(i, 'new')" class="remove-attachment" size="20">mdi-close</v-icon>
            </h5>
          </div>

          <div class="text-center">
            <v-btn :disabled="!trans_detail.editable || file_size_exceeds" :loading="loading_pertinent_attachment" @click="postFileOfPertinent" class="mt-4" small tile>UPLOAD FILE</v-btn>
            <v-btn v-if="pex_data.section2.length > 0 || view_attached_pertinent.length > 0" @click="view_file_pertinent = true" class="mt-4 ml-2" small tile>VIEW FILE</v-btn>
            <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
          </div>
        </v-col>
        <v-col cols="12" sm="1" md="1" lg="1"></v-col>
      </v-row>
      
      <v-row v-show="loading_pertinent_attachment" justify="center" class="text-center mt-2" wrap>
        <v-col cols="12" sm="6" md="4" lg="4">
          <div class="yellow lighten-3 pa-5">
            <h5 class="font-weight-regular grey--text text--darken-3">Please wait while we upload your file. <br>Do not click next or other category to finish uploading.</h5>
          </div>
        </v-col>
        <v-col cols="12" sm="1" md="1" lg="1"></v-col>
      </v-row>

      <!-- VIEW FILE DIALOG FOR PERTINENT LABORATORY -->
      <v-dialog v-model="view_file_pertinent" width="1100" persistent>
        <v-card>
          <v-card-title class="body-1 light-blue darken-3 white--text py-1 justify-center">
            <v-spacer></v-spacer>PERTINENT LABORATORY {{ $vuetify.breakpoint.smAndUp ? 'ATTACHMENT' : '' }}<v-spacer></v-spacer>
            <v-btn v-if="$vuetify.breakpoint.smAndUp" @click="view_file_pertinent = false" dark icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <div v-for="(attached, i) in pex_data.section2" :key="i" class="px-4 mt-2">
            <h4>{{ i+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <div v-for="(attached, i) in view_attached_pertinent" :key="'view'+i" class="px-4 mt-2">
            <h4>{{ i+pex_data.section2.length+1 }}) {{ attached.name }}</h4>
            <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
            <v-divider class="mt-4"></v-divider>
          </div>

          <v-row justify="center" class="mt-3 pb-3" wrap>
            <v-btn @click="view_file_pertinent = false" class="ml-1" color="primary">CLOSE</v-btn>
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
        <v-col cols="12" sm="5" md="5" lg="5">
          <v-btn @click="$router.push('/input-forms/patient-confinement')" color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
        </v-col>
        <v-col cols="12" sm="5" md="5" lg="5" class="text-right">
          <v-btn @click="(trans_detail.gender !== 'MALE' || trans_detail.gender !== 'M') && trans_detail.phic_packages.includes('MATERNITY') ? $router.push('/input-forms/maternity') : $router.push('/input-forms/course-in-the-ward') " color="primary">NEXT<i class="fas fa-arrow-right ml-1"></i></v-btn>
        </v-col>
      </v-row>
      <Alert :alert="alert" />
    </v-form>
  </div>
</template>

<script>
import Alert from '../../Alert.vue'
import { heent, chest, cvs, abdomen, gui, skin, neuro } from '../../../reference/physical-exam-list.json'


export default {
  props: ['trans_detail', 'comment_data'],

  components: {
    Alert
  },

  created(){
    this.getPhysicalExamination(); 
    this.getDocumentType()
    setTimeout(() => {
      this.confinement_date = sessionStorage.getItem('VKI55S') === null ? null : JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('VKI55S'), 'flag423D').toString(this.$crypto.enc.Utf8))
    }, 200)
  },

  data(){
    return{
      // DATA
      pex_data: {
        section1: {
          general_survey: '',
          as_remarks: '',
          vital_signs_bp: '',
          vital_signs_cr: '',
          vital_signs_rr: '',
          vital_signs_temp: '',
          height: '',
          weight: '',
          heent: [],
          chest: '',
          cvs: '',
          abdomen: '',
          gu: '',
          skin: '',
          neuro: ''
        },

        section2: []
      },
      pertinent_lab: {
        data: [],
        status: false
      },

      // OTHERS
      confinement_date: '',
      selected_heent: [],
      alert: {},
     
      // ATTACHMENTS
      new_pertinent_status: true,
      view_attached_pertinent: [],
      post_attached_pertinent: [],
      view_file_pertinent: false,
      loading_pertinent_attachment: false,
      file_size_exceeds: false,

      // REFERENCE DATA
      heent_items: heent,
      chest_lungs_items: chest,
      cvs_items: cvs,
      abdomen_items: abdomen,
      gu_items: gui,
      skin_items: skin,
      neuro_items: neuro,
    
      // LOADER
      loading_heent: true,
      loading_chest: true,
      loading_cvs: true,
      loading_abdomen: true,
      loading_gu: true,
      loading_skin: true,
      loading_neuro: true,

      // COMMENTS
      comment_dialog: false,
      comment_title: '',
      comment_content: '',

      selected_doc_type: [],
      selected_doct_type_holder: [],
      pertinent_findings_items: [],
    }
  },

  watch: {
    // PREVENT NAVIGATE IF THERE IS UNSAVED ATTACHMENT
    view_attached_pertinent(value){
      let total = 0

      value.forEach(element => {
        total += parseFloat(element.file_size)
      })

      if(total > 30){
        this.file_size_exceeds = true
      }else{
        this.file_size_exceeds = false
      }

      if(value.length > 0){
        this.$emit('input', ['unsaved_attachment'])
      }else{
        this.$emit('input', '')
      }
    }
  },

  methods: {
    // GET PHYSICAL EXAMINATION
    // getPhysicalExamination(){
    //   this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
    //   let pex_data = sessionStorage.getItem('034FFK') ? this.$crypto.AES.decrypt(sessionStorage.getItem('034FFK'), 'vcf34D3f').toString(this.$crypto.enc.Utf8) : null
      
    //   if(pex_data === null){
    //     this.$axios.post(this.$tms_url+'resources/api/_get_transaction_ip_pex.php', this.$qs.stringify({
    //       post_data: this.wsDataEncryption(JSON.stringify({
    //         phic_tracking_number: this.trans_detail.phic_tracking_number,
    //         transaction_number: this.trans_detail.transaction_number
    //       }))
    //     }))
    //     .then(response => {
    //       response.data = this.responseDataDecryption(response.data)
    //       let pex_data = response.data.PE_DATA
          
    //       this.pex_data = {
    //         section1: {
    //           general_survey: pex_data.general_survey,
    //           vital_signs_bp: pex_data.vital_sign_bp,
    //           vital_signs_cr: pex_data.vital_sign_cr,
    //           vital_signs_rr: pex_data.vital_sign_rr,
    //           vital_signs_temp: pex_data.vital_sign_temp,
    //           heent: response.data.HEENT,
    //           chest: pex_data.pe_chest_lungs,
    //           cvs: pex_data.pe_cvs,
    //           abdomen: pex_data.pe_abdomen,
    //           gu: pex_data.pe_gu_ie,
    //           skin: pex_data.pe_skin_extremities,
    //           neuro: pex_data.pe_neuro_exam
    //         },
    //         section2: {
    //           attached_pertinent: response.data.ATTACHMENT
    //         },
    //         status: {
    //           heent: false,
    //           pertinent: false,
    //           others: false
    //         }
    //       }

    //       this.pex_data.section1.heent.forEach(element => {
    //         this.selected_heent.push(element.heent)
    //       })

    //       if(response.data.ATTACHMENT){
    //         this.pex_data.section2.forEach(element => {
    //           let no_of_file = element.file_name.split('_')[0]
    //           let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
    //           let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

    //           element.name = element.file_name.substring(sum)
    //           element.loader = false
    //         })
    //       }

    //       this.saveData();
    //       this.$store.commit('set_loading_category', false)
    //       this.getHeent();
    //       this.loading_chest = false
    //       this.loading_cvs = false
    //       this.loading_abdomen = false
    //       this.loading_gu = false
    //       this.loading_skin = false
    //       this.loading_neuro = false
    //     })
    //     .catch(error => {
    //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //     })
    //   }else{  
    //     this.pex_data = JSON.parse(pex_data)

    //     this.pex_data.section1.heent.forEach(element => {
    //       this.selected_heent.push(element.heent)
    //     })

    //     this.$store.commit('set_loading_category', false)
    //     this.getHeent();
    //     this.loading_chest = false
    //     this.loading_cvs = false
    //     this.loading_abdomen = false
    //     this.loading_gu = false
    //     this.loading_skin = false
    //     this.loading_neuro = false
    //   }
    // },

    async getPhysicalExamination(){
      this.pertinent_lab = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PGF04S'), 'Fo34S40s').toString(this.$crypto.enc.Utf8))
      let pex_data = sessionStorage.getItem('034FFK') ? this.$crypto.AES.decrypt(sessionStorage.getItem('034FFK'), 'vcf34D3f').toString(this.$crypto.enc.Utf8) : null
      
      if(pex_data === null){
        let response = await this.$services.getEclaims({
              request_key: 'physical_exam',
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

          if(response.data.PE_LAB_FINDINGS.data && response.data.PE_LAB_FINDINGS.data.length > 0) {
            this.pertinent_lab = response.data.PE_LAB_FINDINGS
          }
          
          let pex_data = response.data.PE_DATA   

          this.pex_data = {
            section1: {
              general_survey: pex_data.general_survey,
              as_remarks: pex_data.as_remarks,
              vital_signs_bp: pex_data.vital_sign_bp,
              vital_signs_cr: pex_data.vital_sign_cr,
              vital_signs_rr: pex_data.vital_sign_rr,
              vital_signs_temp: pex_data.vital_sign_temp,
              height: pex_data.height,
              weight: pex_data.weight,
              heent: pex_data.pe_heent ? pex_data.pe_heent[0] : [],
              chest: pex_data.pe_chest_lungs ? pex_data.pe_chest_lungs[0] : [],
              cvs: pex_data.pe_cvs ? pex_data.pe_cvs[0] : [],
              abdomen: pex_data.pe_abdomen ? pex_data.pe_abdomen[0] : [],
              gu: pex_data.pe_gu_ie ? pex_data.pe_gu_ie[0] : [],
              skin: pex_data.pe_skin_extremities ? pex_data.pe_skin_extremities[0] : [],
              neuro: pex_data.pe_neuro_exam ? pex_data.pe_neuro_exam[0] : []
            },
            section2: [],
            status: {
              heent: false,
              pertinent: false,
              others: false
            }
          }

          this.selected_heent = this.pex_data.section1.heent

          // this.pex_data.section1.heent.forEach(element => {
          //   this.selected_heent.push(element)
          // })

          if(response.data.ATTACHMENT){
            const attachment = response.data.ATTACHMENT;
            if (Array.isArray(attachment)) {
              attachment.forEach(item => {
                this.pex_data.section2.push(item);
              });

              this.pex_data.section2.forEach(element => {
                let no_of_file = element.file_name.split('_')[0];
                let provider = this.$store.state.prv_data.provider_tin 
                  ? this.$store.state.prv_data.provider_tin 
                  : this.$store.state.prv_data.provider_code;

                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4;
                element.name = element.file_name.substring(sum);
                element.loader = false;
              });
            }      
          }

          this.saveData();
          this.$store.commit('set_loading_category', false)
          this.getHeent();
          this.loading_heent = false
          this.loading_chest = false
          this.loading_cvs = false
          this.loading_abdomen = false
          this.loading_gu = false
          this.loading_skin = false
          this.loading_neuro = false
        } else {
            this.alert = response.error;
        }
      } else{  
        this.pex_data = JSON.parse(pex_data)
        // this.pex_data.section1.heent.forEach(element => {
        //   this.selected_heent.push(element.heent)
        // })

        this.selected_heent = this.pex_data.section1.pe_heent

        this.$store.commit('set_loading_category', false)
        this.getHeent();
        this.loading_heent = false
        this.loading_chest = false
        this.loading_cvs = false
        this.loading_abdomen = false
        this.loading_gu = false
        this.loading_skin = false
        this.loading_neuro = false
      }
    },

    async getDocumentType() {
        let response = await this.$services.getTransactionIpRefData({
            request_key: 'eclaim_document_type',
            category: "pertinent_laboratory"
        })

        if(response.status === 200) {
          this.pertinent_findings_items = response.data
        }else{
          this.alert = response.error
        }
    },

    // GET HEENT
    getHeent(){
      if(localStorage.getItem('GPDTT4')){
        this.heent_items = localStorage.getItem('GPDTT4') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('GPDTT4'), 'Pro4xYSv').toString(this.$crypto.enc.Utf8)) : null
        this.loading_heent = false
        if(this.trans_detail.editable){
          this.selected_heent = this.pex_data.section1.heent
          this.getChestLungs();
        }
      } else {
        this.heent_items.push(this.pex_data.section1.heent)

      //   this.$axios.post(this.$cms_url+'resources/api/_get_transaction_ip_ref_data.php', this.$qs.stringify({
      //     post_data: this.wsDataEncryption(JSON.stringify({
      //       request_key: 'physical_exam',
      //       category: 'HEENT'
      //     }))
      //   }))
      //   .then(response => {
      //     //response.data = this.responseDataDecryption(response.data)
      //     localStorage.setItem('GPDTT4', this.$crypto.AES.encrypt(JSON.stringify(response.data), 'Pro4xYSv'))
      //     this.heent_items = response.data
      //     this.loading_heent = false
      //     if(this.trans_detail.editable){
      //       this.getChestLungs();
      //     }
      //   })
      //   .catch(error => {
      //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
      //   })
      }
    },

    // GET CHEST/LUNGS
    getChestLungs(){
      if(localStorage.getItem('O4RRR2')){
        this.chest_lungs_items = localStorage.getItem('O4RRR2') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('O4RRR2'), 'mNDS40fx').toString(this.$crypto.enc.Utf8)) : null
        this.loading_chest = false
      } else {
        this.chest_lungs_items.push(this.pex_data.section1.chest)
      }

      this.getCVS();
    },

    // GET CVS
    getCVS(){
      if(localStorage.getItem('PP534T')){
        this.cvs_items = localStorage.getItem('PP534T') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('PP534T'), 'cvcw3fxo').toString(this.$crypto.enc.Utf8)) : null
        this.loading_cvs = false
        
      } else {
        this.cvs_items.push(this.pex_data.section1.cvs)
      }

      this.getAbdomen();
    },

    // GET ABDOMEN
    getAbdomen(){
      if(localStorage.getItem('ZC593X')){
        this.abdomen_items = localStorage.getItem('ZC593X') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('ZC593X'), 'yyXD420s').toString(this.$crypto.enc.Utf8)) : null
        this.loading_abdomen = false
      } else {
        this.abdomen_items.push(this.pex_data.section1.abdomen)
      }

      this.getGU();
    },

    // GET GU
    getGU(){
      if(localStorage.getItem('PRT35S')){
        this.gu_items = localStorage.getItem('PRT35S') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('PRT35S'), 'pjoddg4B').toString(this.$crypto.enc.Utf8)) : null
        this.loading_gu = false
      } else {
        this.gu_items.push(this.pex_data.section1.gu)
      }

      this.getSkin();
    },

    // GET SKIN
    getSkin(){
      if(localStorage.getItem('D9GG44')){
        this.skin_items = localStorage.getItem('D9GG44') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('D9GG44'), 'lkxdDSSc').toString(this.$crypto.enc.Utf8)) : null
        this.loading_skin = false
      } else {
        this.skin_items.push(this.pex_data.section1.skin)
      }
      
      this.getNeuro();
    },

    // GET NEURO
    getNeuro(){
      if(localStorage.getItem('FDGHH7')){
        this.neuro_items = localStorage.getItem('FDGHH7') ? JSON.parse(this.$crypto.AES.decrypt(localStorage.getItem('FDGHH7'), 'jgfiE3Si').toString(this.$crypto.enc.Utf8)) : null
        this.loading_neuro = false
      } else {
        this.neuro_items.push(this.pex_data.section1.neuro)
      }
    },
    
    // ADD SELECTED HEENT
    addSelectedHeent(value, event){
      if(event.includes(value)){
        this.pex_data.section1.heent.push({
          heent: value
        })
        
        this.selected_heent.push(value)
      }else{
        this.pex_data.section1.heent.forEach((element, index) => {
          if(element.heent === value){
            this.pex_data.section1.heent.splice(index, 1)
          }
        })

        this.selected_heent.forEach((element, index) => {
          if(element === value){
            this.selected_heent.splice(index, 1)
          }
        })
      }
      
      this.checkDataStatus('heent');
    },

    // ADD DATE & DESCRIPTION IN PERTINENT LABORATORY
    addDateDescription(){
      this.pertinent_lab.data.push({
        date_of_lab: '',
        description: ''
      })
    },

    // REMOVE ADDED DATE & DESCRIPTION IN PERTINENT LABORATORY
    removeAddedDateDescription(index){
      this.pertinent_lab.data.splice(index, 1)
      this.checkDataStatus('pertinent');
    },

    // ADD ATTACHED FILE FOR PERTINENT LABORATORY
    addAttachedPertinent(){
      this.selected_doct_type_holder = this.selected_doc_type
      this.selected_doc_type = []
      let attached_files = []
      let re_attached_files = []
      this.new_pertinent_status = true
      let new_file_name = this.selected_doct_type_holder.doc_type+'_'+this.selected_doct_type_holder.group_type

      this.pex_data.section2.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })

      this.view_attached_pertinent.forEach(element => {
        attached_files.push(new_file_name+'_'+element.name)
      })
      
      Object.values(this.$refs.pertinent.files).forEach(element => {
        
        if(attached_files.includes(new_file_name+'_'+element.name)){
          re_attached_files.push('<br>'+new_file_name+'_'+element.name)
        }else{
          element.document_id = this.selected_doct_type_holder.document_id
          element.group_type = this.selected_doct_type_holder.group_type
          element.doc_type = this.selected_doct_type_holder.doc_type

          this.post_attached_pertinent.push(element)
          this.view_attached_pertinent.push({
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

    // REMOVE ATTACHED FILE FOR PERTINENT LABORATORY
    async removeAttachedPertinent(index, status){
      if(status === 'old'){
        
        this.pex_data.section2[index].loader = true
        
        let response = await this.$services.trnDelAttachment({
            provider_code: this.$store.state.prv_data.provider_code,
            // phic_tracking_number: this.trans_detail.phic_tracking_number,
            transaction_number: this.trans_detail.transaction_number,
            // attachment_category: 'PERTINENT LABORATORY',
            file_name: this.pex_data.section2[index].file_name,
            group_type: this.pex_data.section2[index].group_type //ATTACHMENT UPDATES - this.selected_doct_type_holder.group_type
        });

        if (response.status === 200) {
          if(response.data.success){
            this.pex_data.section2.splice(index, 1)
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
        //     // attachment_category: 'PERTINENT LABORATORY',
        //     file_name: this.pex_data.section2[index].file_name,
        //     group_type: this.selected_doct_type_holder.group_type
        //   }))
        // }))
        // .then(response => {
        //   if(response.data.success){
        //     this.pex_data.section2.splice(index, 1)
        //     this.saveData();
        //   }else{
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }else{
        this.post_attached_pertinent.splice(index - this.post_attached_pertinent.length, 1)
        this.view_attached_pertinent.splice(index - this.view_attached_pertinent.length, 1)
      }
      
      document.getElementById("attached-pertinent").value = "";
    },

    // POST ATTACHED FILE TO SERVER OF PERTINENT LABORATORY
    // postFileOfPertinent(){
    //   if(this.post_attached_pertinent.length === 0){
    //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
    //   }else{
    //     this.$store.commit('set_prevent_navigation', false)
    //     this.loading_pertinent_attachment = true
    //     this.new_pertinent_status = 'Processing'

    //     let formData = new FormData()
    //     let total_count = this.post_attached_pertinent.length
    //     for( var i = 0; i < this.post_attached_pertinent.length; i++ ){
    //       let file = this.post_attached_pertinent[i]
    //       formData.append('file'+ i +'', file)
    //     }

    //     formData.append('post_data', this.wsDataEncryption(JSON.stringify({
    //       phic_tracking_number: this.trans_detail.phic_tracking_number,
    //       transaction_number: this.trans_detail.transaction_number,
    //       provider_user: this.$store.state.usr_credentials.user_name,
    //       department: this.$store.state.usr_credentials.department,
    //       provider_code: this.$store.state.prv_data.provider_code,
    //       provider_tin: this.$store.state.prv_data.provider_tin,
    //       attachment_category: 'PERTINENT LABORATORY',
    //       request_key: 'phic_patient_prov_attachments',
    //       total_count: total_count
    //     })))
    
    //     this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_pex.php', 
    //       formData,
    //       {
    //         headers: {
    //           'Content-Type': 'multipart/form-data'
    //         }
    //       }
    //     )
    //     .then(response => {
    //       if(response.data.success){         
    //         this.responseDataDecryption(response.data.file_path).forEach(element => {
    //           let no_of_file = element.file_name.split('_')[0]
    //           let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
    //           let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

    //           element.name = element.file_name.substring(sum)
    //           element.loader = false
  
    //           this.pex_data.section2.push(element)
    //         })
            
    //         this.new_pertinent_status = false
    //         this.post_attached_pertinent = []
    //         this.view_attached_pertinent = []
    //         this.loading_pertinent_attachment = false
    //         this.$store.commit('set_prevent_navigation', true)
    //         this.saveData();
    //       }else{
    //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //       }
    //     })
    //     .catch(error => {
    //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
    //     })
    //   }
    // },

    async postFileOfPertinent(){
      if(this.post_attached_pertinent.length === 0){
        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
      }else{
        this.$store.commit('set_prevent_navigation', false)
        this.loading_pertinent_attachment = true
        this.new_pertinent_status = 'Processing'
        let formData = new FormData()
        let total_count = this.post_attached_pertinent.length
        let file_datas = []

        for( var i = 0; i < this.post_attached_pertinent.length; i++ ){
          let original_name = this.post_attached_pertinent[i].name
          let original_file = this.post_attached_pertinent[i];

          // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
          let new_name_file = `${this.post_attached_pertinent[i].doc_type}_${this.post_attached_pertinent[i].group_type}_${original_name}`;

          // CREATE A NEW FILE OBJECT NAME
          let file = new File([original_file], new_name_file, {
            type: original_file.type,
            lastModified: original_file.lastModified,
          });
          
          file_datas.push({
              document_id: this.post_attached_pertinent[i].document_id,
              group_type: this.post_attached_pertinent[i].group_type
          });

          formData.append('file'+ i +'', file)
        }

        formData.append('post_data', this.wsDataEncryption(JSON.stringify({
          request_key: "pertinent_laboratory",
          transaction_number: this.trans_detail.transaction_number,
          created_by: this.$store.state.usr_credentials.user_name,
          provider_code: this.$store.state.prv_data.provider_code,
          file_datas: file_datas,
          attachment_category: 'PERTINENT LABORATORY',
          total_count: total_count,
          rth: this.trans_detail.eclaims_status === "RETURN" ? 1 : 0
        })))

        let response = await this.$services.trnAddEclaimsAttachedFiles({
            formData
        });

        if (response.status === 200) {
          if (response.data.success) {
            this.responseDataDecryption(response.data.file_path).forEach(element => {
              let no_of_file = element.file_name.split('_')[0]
              let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code

              let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4
              element.name = element.file_name.substring(sum)
              element.loader = false
              element.group_type = this.selected_doct_type_holder.group_type //ATTACHMENT UPDATES
              this.pex_data.section2.push(element)
            })

            this.new_pertinent_status = false
            this.post_attached_pertinent = []
            this.view_attached_pertinent = []
            this.loading_pertinent_attachment = false
            this.$store.commit('set_prevent_navigation', true)
            this.saveData()
          } else {
            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
          }
        
        } else {
          this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error , body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        }
    
        // this.$axios.post(
        //   this.$cms_url + 'resources/controller/trn_add_eclaims_attached_files.php',
        //   formData,
        //   {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }
        //   }
        // )
        // .then(response => {
        //   if (response.status === 200) {
        //     if (response.data.success) {
        //       this.responseDataDecryption(response.data.file_path).forEach(element => {
        //         let no_of_file = element.file_name.split('_')[0]
        //         let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code

        //         let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4
        //         element.name = element.file_name.substring(sum)
        //         element.loader = false

        //         this.pex_data.section2.push(element)
        //       })

        //       this.new_pertinent_status = false
        //       this.post_attached_pertinent = []
        //       this.view_attached_pertinent = []
        //       this.loading_pertinent_attachment = false
        //       this.$store.commit('set_prevent_navigation', true)
        //       this.saveData()
        //     } else {
        //       this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     }
        //   } else {
        //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //   }
        // })
        // .catch(error => {
        //   this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error , body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        // })
      }
    },

    // DISPLAY COMMENT DATA
    displayCommentData(data){
      if(data === 'physical'){
        this.comment_title = 'PHYSICAL EXAMINATION (PERTINENT FINDINGS PER SYSTEM)'
        this.comment_content = this.comment_data.cf4_part3_number5
      }else{
        this.comment_title = 'PERTINENT LABORATORY AND DIAGNOSTIC FINDINGS'
        this.comment_content = this.comment_data.cf3_part1_number9
      }

      this.comment_dialog = true
    },

    // CHECK IF DATA HAS BEEN CHANGED
    checkDataStatus(data){
      this.$emit('change-status')
      
      if(data === 'heent'){
        this.pex_data.status.heent = true
      }else if(data === 'pertinent'){
       this.pertinent_lab.status = true 
      }else if(data === 'other'){
        this.pex_data.status.others = true
      }
    },

    // SAVE DATA TO SESSION STORAGE
    saveData(){
      sessionStorage.setItem('PGF04S', this.$crypto.AES.encrypt(JSON.stringify(this.pertinent_lab), 'Fo34S40s'))
      sessionStorage.setItem('034FFK', this.$crypto.AES.encrypt(JSON.stringify(this.pex_data), 'vcf34D3f'))
    }
  },

  destroyed(){
    this.saveData();
  }
}
</script>

<style scoped>
  .attachment-name {
      cursor: pointer;
  }
  .attachment-name:hover {
      color: #1976D2;
      text-decoration: underline;
  }
</style>