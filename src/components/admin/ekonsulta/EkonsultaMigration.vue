<template>
      <v-container class="pa-0">
        <section class="mx-auto">
          <h1 class="font-weight-medium grey--text text--darken-3 mb-4 mt-5">Yakap Migration</h1>
            <v-card width="900" class="py-5 mx-auto" flat>
              <v-card>
                <v-card-title class="body-1 primary white--text">
                    <v-spacer></v-spacer><v-icon color="white" left>mdi-file-cloud</v-icon>UPLOADING YAKAP XML FILE<v-spacer></v-spacer>
                </v-card-title>

                <v-row dense>
                    <v-col cols="12" sm="12" class="pa-5">
                      <v-row dense>
                        <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-2 mb-10 mb-md-0">
                              <div class="d-flex justify-center align-center" style="height: 350px;" @drop.prevent="onDrop($event)" @dragover.prevent="drag_over = true" @dragenter.prevent="drag_over = true" @dragleave.prevent="drag_over = false" :class="{ 'grey lighten-2': drag_over }">
                                  <div class="pa-2">
                                    <div class="text-center">
                                        <v-icon color="primary" style="font-size: 64px;">mdi-file-upload-outline</v-icon>
                                    </div>

                                    <template v-if="is_success">
                                        <v-tooltip bottom color="#1565C0">
                                            <template v-slot:activator="{ on }">
                                              <div v-on="on" class="text-center bg-white">
                                                  <h1 class="body-2 grey--text"> Drag or drop files here</h1>
                                                  <label for="file-upload" class="body-2 grey--text input-label"> Browse your device </label>
                                                  <v-file-input disabled style="display: none;"> </v-file-input>
                                              </div>
                                            </template>

                                            <div class="d-flex align-center">
                                                <span> You need to clear all data</span>
                                            </div>
                                        </v-tooltip>
                                    </template>

                                    <template v-else>
                                      <div class="text-center">
                                        <h1 class="body-2 grey--text"> Drag or drop files here</h1>
                                        <label for="file-upload" class="body-2 blue--text input-label"> Browse your device </label>
                                        <v-file-input id="file-upload" accept=".xml" v-model="upload_files" @click="$event.target.value = ''" @change="uploadFile" style="display: none;"> </v-file-input>
                                      </div>
                                    </template>
                                  </div>
                              </div>

                              <v-row dense> 
                                <v-col cols="12" lg="12"> 
                                  <div class="d-flex justify-start align-start pa-2"> 
                                    <v-checkbox v-model="check_other_cipher_key" @change="toggleOtherCipherKey" hide-details dense> </v-checkbox>
                                    <v-text-field v-model="other_cipher_key" class="mr-1" label="Use other cipher key" :disabled="!check_other_cipher_key" hide-details clearable dense> </v-text-field>
                                  </div>
                                </v-col>
                              </v-row>

                              <div class="file-items">
                                <v-scroll-y-transition group> 
                                    <div v-for="(name, key) in file_name" :key="key" class="pa-2 d-flex justify-space-between border-bottom">
                                        <div class="d-flex justify-start align-center" transition="fade-transition">
                                          <v-icon>mdi-file-upload-outline</v-icon>
                                          <h1 class="body-1 mx-2 mt-2"> {{ name.name }} </h1>
                                        </div>

                                        <template v-if="upload_loading"> 
                                          <v-progress-circular :size="20" :width="3" indeterminate color="primary"></v-progress-circular>
                                        </template>

                                        <template v-else> 
                                          <div v-if="file_total > 0" :key="key" class="d-flex justify-end align-center"> 
                                              <h5 class="font-weight-medium green--text mr-2"> Uploaded </h5>
                                              <v-icon class="pa-1" color="success"> mdi-check-circle</v-icon>
                                          </div>

                                          <v-icon v-else @click="removedFile(key)" class="pa-1"> mdi-delete</v-icon>
                                        </template>
                                    </div>
                                </v-scroll-y-transition>

                                <div v-if="error_message" class="d-flex justify-center align-baseline mt-4">
                                    <h4 class="body-2 font-weight-bold red--text"> {{ error_message }} </h4>
                                </div>

                                <div v-if="file_migrated.length >= 1" class="my-4 ml-3">
                                  <div v-for="(files, key) in file_migrated" :key="key"> 
                                    <h4 class="body-2 font-weight-medium mt-2"> Files Name: <span> {{ files.file_name }} </span> </h4>  
                                    <h4 class="body-2 font-weight-medium mt-2"> Records Found: <span> {{ files.file_count }} </span> </h4>
                                    <h4 class="body-2 font-weight-medium mt-2"> Passed: <span class="font-weight-regular green--text"> {{ files.success_count }} </span> </h4>
                                    <h4 class="body-2 font-weight-medium mt-2"> Failed: <span class="font-weight-regular red--text"> {{ files.failed_count }} </span> </h4> 

                                    <div v-if="files.failed_records_list" class="my-4"> 
                                      <v-btn @click="saveFailedMigration(files)" color="red" class="white--text" small> 
                                        <v-icon class="mr-2" right dark> mdi-printer </v-icon>Save Failed Migration 
                                      </v-btn>
                                    </div> 
                                    <v-divider class="my-3"> </v-divider>
                                  </div>
                                </div>
                            </div>
                        </v-col> 
                      </v-row>
                    </v-col>
                </v-row>

                <!-- <div class="px-4 px-sm-8 mt-n3 mt-sm-n5">
                  <v-row>
                    <v-col cols="12" class="text-center text-sm-left">
                      <h4 class="caption red--text text--darken-2 font-italic">
                        <span class="d-block d-sm-inline">" Note: To upload eKonsulta XML file, use encrypted XML."</span>
                      </h4>
                    </v-col>
                  </v-row>
                </div> -->

                <div class="px-8"> 
                  <h4 class="caption red--text text--darken-2 font-italic"> " Note: To upload Yakap XML file, use encrypted XML." </h4> 
                </div>

                <v-card-actions class="d-flex justify-center">
                  <div class="mb-5">
                      <v-btn @click="submitFile" :disabled="file_name.length === 0 || is_success || !other_cipher_key && check_other_cipher_key || upload_loading" class="primary mx-2"> UPLOAD XML FILE </v-btn>
                      <v-btn @click="closeUpload"  :disabled="file_name.length === 0 || upload_loading" class="mx-2"> CLEAR ALL</v-btn>
                  </div>
                </v-card-actions>
              </v-card>
            </v-card>

            <v-overlay v-if="upload_loading" :value="upload_loading" z-index="9999"> 
              <v-progress-circular indeterminate size="35"></v-progress-circular>
              <span  class="ml-3 text-h6 font-weight-regular" >Loading... Please Wait...</span>
            </v-overlay>

          <Alert :alert="alert"/>
        </section>
      </v-container>
</template>


<script>
import Alert from '@/components/Alert'
import jsPDF from 'jspdf'

export default {

  components: {
    Alert
  },

  data() {
    return {
      alert: {},
      jspdf: jsPDF,
      check_other_cipher_key: false,
      other_cipher_key: '',

      upload_files: null,
      file_data: [],
      file_name: [],
      all_files: [],
      open_upload_file: false,
      drag_over: false,
      hci_cipher_key: '',
      error_message: '',

      upload_loading: false,
      upload_success: false,
      upload_error: false,
      upload_delete: false,
      upload_list: '',
      upload_items: [],

      // FORM VALIDATION
      empty_validation: [
          v => !!v && !/^ *$/.test(v) || 'Required Field',
      ],

      file_total: 0,
      success_count: 0,
      failed_count: 0,

      is_success: false,

      failed_migration_items: [],
      migration_data: false,

      file_migrated: []
    }
  },

  mounted() {
    this.getAccreditation()
  },

  methods: {
    async getAccreditation() {
      let response = await this.$services.getEkonsultaAccreditionCredentials({
          provider_code: this.$store.state.prv_data.provider_code
      })

      if(response.status === 200) {
        response.data = this.responseDataDecryption(response.data)

        if(response.data.accreditation_status) {
          this.hci_cipher_key = response.data.credentials.hci_cipher_key
        } 
      } else {
        this.alert = response.error
      }
    },

    //UPLOAD FILE FOR DATA MIGRATION
    uploadFile() {
      this.migration_data = false
      this.upload_delete = true
      this.upload_success = false
      this.upload_error = false

      this.file_name.push({
        name: this.upload_files.name,
        message: '',
        success: false,
        error: false
      })

      var reader = new FileReader()

      reader.readAsDataURL(this.upload_files)
      reader.onload = () => {
        let file_result = reader.result.split(',')
        this.all_files.push(
          {
            files: file_result[1],
            file_name: this.upload_files.name
          }
        )
      }
    },

    removedFile (key) {
      this.file_data = this.file_data.filter(item => item.key !== key)
      this.file_data.splice(key, 1)
      this.file_name = this.file_name.filter(item => item.key !== key)
      this.file_name.splice(key, 1)
      this.all_files = this.all_files.filter(item => item.key !== key)
      this.all_files.splice(key, 1)
    },

    closeUpload(){
      this.migration_data = false
      this.failed_migration_items = []
      this.open_upload_file = false
      this.upload_success = false
      this.upload_error = false
      this.file_data = []
      this.file_name = []
      this.all_files = []
      this.upload_items = []
      this.file_total = 0
      this.success_count = 0
      this.failed_count = 0
      this.error_message = ''
      this.is_success = false
      this.check_other_cipher_key = false,
      this.other_cipher_key = ''
      this.file_migrated = []
    },

    onDrop(e) {
      this.migration_data = false
      if(!this.is_success) {
        this.upload_delete = true
        this.upload_success = false
        this.upload_error = false
  
        this.drag_over = false
        
        this.upload_files = e.dataTransfer.files
        
        for(let i = 0; i < this.upload_files.length; i++){
          this.file_name.push({
            name: this.upload_files[i].name,
            message: '',
            success: false,
            error: false
          })
          
          setTimeout(() => {
            var reader = new FileReader()
            reader.readAsDataURL(this.upload_files[i])
    
            reader.onload = () => {
              let file_result = reader.result.split(',')
              this.all_files.push(
                {
                  files: file_result[1],
                  file_name: this.upload_files[i].name
                }
              )
            }
          }, 300)
        }
      }
    },

    //SUBMIT FILE
    submitFile() {
      this.migration_data = false
      this.error_message = ''
      this.upload_loading = true
      this.upload_delete = false

      this.all_files.forEach(async(file_data) => {
        let response = await this.$services.uploadXmlMigration({
            provider_code: this.$store.state.prv_data.provider_code,
            file_data: file_data.files,
            file_name: file_data.file_name,
            cipher_key: this.check_other_cipher_key ? this.other_cipher_key : this.hci_cipher_key,
            phic_accre_no: this.$store.state.prv_data.ekonsulta_phic_acc_no
        })

        if (response.status === 200) {
          // response = this.responseDataDecryption(response.data)
          this.upload_loading = false
          this.migration_data = true

          if(response.data.success) {
            this.file_migrated.push(response.data)
            this.is_success = true
          }

          if(response.message === 'incorrect cipher key') {
            this.error_message = 'Invalid Cipher Key'
          } else if(response.message === 'invalid encrypted xml file') {
            this.error_message = 'Invalid encrypted xml file'
          }
        } else {
          this.upload_loading = false
          this.alert = response.error
        }
      })
    },

    saveFailedMigration(files){
      this.failed_migration_items = files

      var doc = new this.jspdf('p', 'mm', 'letter')
      const center = doc.internal.pageSize.getWidth() / 2

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Yakap Failed Migration', center, 12, 'center')

      let base_height = 0

      doc.setFontSize(10)
      doc.text('PHIC Case No', 8, base_height + 20)
      doc.text('First Name', 58, base_height + 20)
      doc.text('Middle Name', 88, base_height + 20)
      doc.text('Last Name', 128, base_height + 20)
      doc.text('Date of Birth', 158, base_height + 20)
      doc.text('PHIC Pin', 188, base_height + 20)

      this.failed_migration_items.failed_records_list.forEach(data => {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'regular')
        doc.text(data.pHciCaseNo, 8, base_height + 30)
        doc.text(data.first_name, 68, base_height + 30, 'center')
        doc.text(data.middle_name, 98, base_height + 30, 'center')
        doc.text(data.last_name, 138, base_height + 30, 'center')
        doc.text(data.birthdate, 168, base_height + 30, 'center')
        doc.text(data.phic_pin, 188, base_height + 30)

        if(base_height >= 240){
          doc.addPage()
          base_height = 0
        } else {
          base_height = base_height + 10
        }
      })

      doc.save('Failed Migration ' + this.failed_migration_items.file_name +  ' .pdf')
    },

    toggleOtherCipherKey() {
      if(!this.check_other_cipher_key) {
        this.other_cipher_key = ''
      }
    }  
  }
}
</script>

<style scoped>
.file-items {
  max-height: 200px;
  overflow: auto;
}
</style>