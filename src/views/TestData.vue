<template>
    <div class="pa-4">
        
        <h4 class="text-h5 font-weight-medium my-4"> Ekonsulta Testing Data </h4>
        <v-text-field v-model="search_member" label="Search"> </v-text-field>
        <v-data-table v-model="selected_member" :headers="headers" :search="search_member" :items="item" show-select item-key="pPrimaryPIN" class="my-4">
          <!-- <template v-slot:header.data-table-select="{ props, on }">
              <v-simple-checkbox
                color="white"
                v-if="props.indeterminate"
                v-ripple
                v-bind="props"
                :value="props.indeterminate"
                v-on="on"
              ></v-simple-checkbox>
              <v-simple-checkbox
                color="white"
                v-if="!props.indeterminate"
                v-ripple
                v-bind="props"
                v-on="on"
              ></v-simple-checkbox>
          </template> -->
        </v-data-table>

        <v-row align="baseline" justify="center" class="mt-2">
            <v-col cols="12" sm="1" md="1" lg="1" xl="1"><h4>Registration</h4></v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                <v-row dense>
                    <v-col cols="12" sm="4"><v-file-input @change="handleFileUpload" label="Upload JSON File" accept=".json" dense outlined></v-file-input></v-col>

                    <v-col cols="12" sm="6">
                        <v-btn @click="verifyMember" :loading="verify_loader" class="mx-2">Verify User</v-btn>
                        <v-btn @click="registerMembers" :loading="register_loader" class="mx-2">Register Member</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row align="baseline" justify="center" class="mt-2">
            <v-col cols="12" sm="1" md="1" lg="1" xl="1"><h4>Transaction</h4></v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                <v-row dense>
                    <v-col cols="12" sm="6" class="pl-9">
                        <v-btn @click="processTransactionMembers" :disabled="selected_member.length === 0"> Transaction Post Encoding</v-btn>
                        <v-icon color="blue" mediumm class="pl-5" @click="transaction_values_dialog=true" title="Set Transaction Values">fas fa-edit</v-icon>
                        <v-icon color="blue" large class="pl-2" title="Upload Json File/s" @click="transaction_upload_dialog=true">mdi-upload</v-icon>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog_result" max-width="600">
            <v-card>
                <v-card-title class="text-h6">Registering Members</v-card-title>

                <v-card-text style="max-height: 300px; overflow:auto;">
                    <div v-for="(item, index) in register_results" :key="index" class="d-flex justify-space-between mb-1">
                        <span>{{ item.name }}</span>
                        <span>
                            <v-icon small v-if="item.status === 'verifying'">mdi-magnify</v-icon>
                            <v-icon small v-if="item.status === 'processing'">mdi-loading</v-icon>
                            <v-icon small color="green" v-if="item.status === 'success'">mdi-check-circle</v-icon>
                            <v-icon small color="red" v-if="item.status === 'failed'">mdi-close-circle</v-icon>
                        </span>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog_result = false" :disabled="register_loader">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="transaction_dialog" persistent max-width="900">
            <v-card class="d-flex flex-column rounded-lg">

                <v-card-title class="light-blue darken-4 white--text d-flex align-center justify-space-between">
                    <span class="text-h6 font-weight-medium">
                        {{ transaction_action_type === 'upload' ? "Uploaded Transaction" : "Selected Members & Status" }}
                    </span>
                    <v-btn icon dark @click="transactionDialogClose">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-4" style="max-height: 380px; overflow-y: auto;">
                    <v-data-table :headers="header_transaction" :items="selected_member" item-key="pAssignedPin" :items-per-page="5" denseclass="elevation-1 rounded">
                        <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item.pAssignedPin }}</td>
                            <td>{{ item.pAssignedFirstName }}</td>
                            <td>{{ item.pAssignedMiddleName }}</td>
                            <td>{{ item.pAssignedLastName }}</td>
                            <td>{{ ['1','2'].includes(item.is_registered) ? 'Registered' : 'Not Registered' }}</td>
                            <td>
                                <v-chip class="my-1" small 
                                :class="item.transactionCreationStatus === 'ongoing' ? 'primary' : 
                                item.transactionCreationStatus === 'done' ? 'success' : ''">
                                    {{ item.transactionCreationStatus || 'Not Registered' }}
                                </v-chip>
                            </td>
                        </tr>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-3 justify-end">
                    <v-btn color="primary" @click="transactionDialogClose">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="transaction_upload_dialog" persistent max-width="900">
            <v-form class="py-2" ref="transaction_upload">
                <v-card class="d-flex flex-column rounded-lg">

                    <v-card-title class="light-blue darken-4 white--text d-flex align-center justify-space-between">
                        <span class="text-h6 font-weight-medium">
                            Upload Json File/s for transaction creation.
                        </span>
                        <v-btn icon dark @click="transactionUploadDialogClose">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>

                    <v-card-text class="pa-4" style="max-height: 380px; overflow-y: auto;">
                        <v-row justify="center" class="mt-4">
                            <v-col cols="12" md="12" lg="12">
                                <v-card outlined class="pa-4">
                                    <span>
                                    <strong>Note:</strong> Please make sure you upload the correct JSON file. You can check the label each upload field for reference. You may also click the Help button to view the required and important 
                                    details before proceeding with the upload.
                                    </span>
                                    <v-divider class="my-4"></v-divider>

                                    <v-row align="center" class="mb-2">
                                        <v-col cols="12" md="6">
                                            <v-file-input v-model="upload_trn_add_consultation" dense outlined hide-details accept=".json" :rules="field_rules" 
                                            label="Upload JSON File for trn_add_consultation.json" prepend-icon="mdi-upload" 
                                            @change="uploadTransactionFileChecker($event, 'upload_trn_add_consultation')"/>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-file-input dense v-model="upload_trn_add_konsulta" outlined hide-details accept=".json" :rules="field_rules" 
                                            label="Upload JSON File for trn_add_konsulta.json" prepend-icon="mdi-upload" 
                                            @change="uploadTransactionFileChecker($event, 'upload_trn_add_konsulta')"/>
                                        </v-col>
                                    </v-row>

                                    <v-row align="center">
                                        <v-col cols="12" md="6">
                                            <v-file-input v-model="upload_trn_upd_pre_consultation" dense outlined hide-details accept=".json" :rules="field_rules" 
                                            label="Upload JSON File for trn_upd_pre_consultation.json" prepend-icon="mdi-upload" 
                                            @change="uploadTransactionFileChecker($event, 'upload_trn_upd_pre_consultation')"/>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <v-file-input v-model="upload_trn_update_patient_tran_record" dense outlined hide-details accept=".json" :rules="field_rules" 
                                            label="Upload JSON File for trn_update_patient_tran_record.json" prepend-icon="mdi-upload" 
                                            @change="uploadTransactionFileChecker($event, 'upload_trn_update_patient_tran_record')"/>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                        
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="pa-3 justify-end">
                        <span class="mr-10 red--text">NOTE: The upload is working, but I'm still working on help/validation improvements.</span> 
                        <v-btn color="primary" class="mr-2 white--text" @click="processUploadedTransaction" >
                            Upload
                        </v-btn>

                        <v-btn outlined color="primary" @click="transactionUploadDialogClose">
                        Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <v-dialog v-model="transaction_values_dialog" persistent max-width="900">
            <v-card class="d-flex flex-column rounded-lg">

                <v-card-title class="light-blue darken-4 white--text d-flex align-center justify-space-between">
                    <span class="text-h8 font-weight-medium">
                        Transaction Values
                    </span>
                    <v-btn icon dark @click="transaction_values_dialog=false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="pa-4" style="max-height: 380px; overflow-y: auto;">
                    Note: The admission date, discharge date, and diagnosis setup will serve as the basis for creating the patient transaction. 
                    <br>If no data is set here, the current date will be used as the basis for the admission and discharge dates.

                    <v-divider class="my-5"/>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <h4 class="content-item-title">Admission Date</h4>
                                <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-on="on" v-model="transaction_values.date_admitted" :rules="field_rules" placeholder="MM-DD-YYYY"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="transaction_values.date_admitted" :max="transaction_values.date_discharged" no-title></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" >
                                <h4 class="content-item-title">Discharged Date</h4 >
                                <v-menu :close-on-content-click="false" transition="scale-transition" min-width="auto" offset-y top>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field v-on="on" v-model="transaction_values.date_discharged" :rules="field_rules" placeholder="MM-DD-YYYY"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="transaction_values.date_discharged" :min="transaction_values.date_admitted"></v-date-picker>
                                </v-menu>
                            </v-col>

                            <v-col cols="12" sm="12" >
                                <h4 class="content-item-title">With Diagnosis/Procedure</h4>
                                <v-radio-group v-model="transaction_values.with_diagnosis" class="mt-0 mb-4" hide-details>
                                    <v-radio :value="0" label="Remove the diagnosis/procedure in creating transaction"></v-radio>
                                    <v-radio :value="1" label="Add the diagnosis/procedure in creating transaction"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                  
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-3 justify-end">
                    <v-btn color="primary" outlined @click="transaction_values_dialog=false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script> 
// import registration_data from '../test-data/registration_data.json'
// import trn_add_migration from '../test-data/trn_add_migration.json'

import registration_template from '../test-data/registration_data.json'
import trn_add_migration_template from '../test-data/trn_add_migration.json'

import trn_add_consultation from '../test-data/transaction/trn_add_consultation.json'
import trn_add_ekonsulta from '../test-data/transaction/trn_add_ekonsulta.json'
import trn_upd_pre_consultation from '../test-data/transaction/trn_upd_pre_consultation.json'
import trn_update_patient_tran_record from '../test-data/transaction/trn_update_patient_tran_record.json'

export default {
    data() {
        return {
            ek_lgu_id: '',
            mem_first_name: '',
            mem_middle_name: '',
            mem_last_name: '',
            mem_birthday: '',
            mem_phic_pin: '',

            search_member: '',

            item: [],

            transaction_number: '',

            headers:[
                { text: 'Status (Registration)', width:"100px", sortable: true, value: 'registration_status', align:'center'},
                { text: 'First Name', value: 'pAssignedFirstName', width:'250px', sortable: true, align:'center'},
                { text: 'Middle Name', value: 'pAssignedMiddleName', sortable: false, align:'center'},
                { text: 'Last Name', value: 'pAssignedLastName', sortable: false, align:'center'},
                { text: 'Date of Birth', value: 'pAssignedDateOfBirth', width:"120px", sortable: false, align:'center'},
                { text: 'PHIC Pin', value: 'pAssignedPin', width:"120px", sortable: false, align:'center'},
                { text: 'Gender', value: 'pAssignedSex', sortable: false, align:'center'}
            ],
            show_image: false,
            image: '',
            auth_token: 'changeme',
            image_id: 'some-image',
            username: '',
            password: '',

            uploaded_json: [],
            selected_member: [],
            verify_loader: false,
            register_loader: false,
            register_results: [],
            dialog_result: false,

            transaction_dialog:false,
            header_transaction:[
                { text: 'Phic PIN', value: 'pAssignedPin', width:"80px", sortable: true, align:'center'},
                { text: 'First Name',  value: 'pAssignedFirstName', width:"150px", sortable: true, align:'center'},
                { text: 'Middle Name', value: 'pAssignedMiddleName', width:'150px', sortable: true, align:'center'},
                { text: 'Last Name', value: 'pAssignedlastName',width:'150px', sortable: true, align:'center'},
                { text: 'Registration Status', value: 'registrationStatus', width:"120px", sortable: true, align:'center'},
                { text: 'Transaction Status' , width:"120px", sortable: true, align:'center'},
            ],
            transaction_values_dialog:false,
            transaction_values: {
                "date_admitted" : this.$moment().format('YYYY-MM-DD'),
                "date_discharged" : this.$moment().format('YYYY-MM-DD'),
                "with_diagnosis": 1
            },
            field_rules: [v => !!v && !/^ *$/.test(v) || 'Field is required.'],
            transaction_upload_dialog: false,
            upload_trn_add_consultation: null,
            upload_trn_add_konsulta: null,
            upload_trn_upd_pre_consultation: null,
            upload_trn_update_patient_tran_record: null,
            result: {},
            transaction_action_type: ""
        }
    },

    mounted() {
        if(this.$tms_url.includes('dev') && this.$cms_url.includes('dev')) {
            this.get_ekonsulta_member()
        } else {
            this.$router.push('/*')
        }
    },

    methods: {
        fetchWithAuthentication(url, authToken) {
            const headers = new Headers();
            headers.set('Authorization', `Bearer ${authToken}`);
            console.log(url, { headers })
            return fetch(url, { headers });
        },

        showImage() {
            this.show_image = true
            this.image = 'http://upload.wikimedia.org/wikipedia/commons/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg'
            this.displayProtectedImage(this.image_id, this.image, this.auth_token)
            //const img = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg'
        },

        async displayProtectedImage(imageId, imageUrl, authToken) {
            // Fetch the image.
            const response = await this.fetchWithAuthentication(imageUrl, authToken);
            console.log('RESPONSE: ', response)
            // Create an object URL from the data.
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            // Update the source of the image.
            console.log(imageId)
            console.log(objectUrl)
            this.image = objectUrl
            // const imageElement = document.getElementById(imageId);
            // imageElement.src = objectUrl;
            // imageElement.onload = () => URL.revokeObjectUrl(objectUrl);
        },

        async get_ekonsulta_member () {
            let response =  await this.$axios.post(this.$tms_url+"resources/test_ws/phic_masterlist.php")
            let items = response.data.map(data => {
                return {
                    ...data,
                    pAssignedDateOfBirth: this.formatDate(data.pAssignedDateOfBirth)
                }
            })
            this.item = items
        },

        // async verifyMember() {
        //    await this.selected_member.forEach(element => {
        //         console.log(element)
        //        this.$axios.post(this.$cms_url+"resources/web_service/ws_member_web.php",this.$qs.stringify({ 
        //             post_data: this.wsDataEncryption(JSON.stringify({
        //                 key: 'eurekare_key_web',
        //                 data: {
        //                     command: 322101001,
        //                     data: {
        //                         first_name: element.pAssignedFirstName,
        //                         last_name: element.pAssignedLastName,
        //                         birthdate: this.$moment(element.pAssignedDateOfBirth).format('YYYY-MM-DD')
        //                     }
        //                 }
        //             }))
        //         })).then(response => {
        //             response.data = this.responseDataDecryption(response.data)
                    
        //             if(response.data.is_registered === '2') {
        //                 console.log("register")
        //                 console.log(response.data)
        //             } else {
        //                 console.log("Not register.")
        //                 this.registerUser(element)

        //             }
                    
        //         }).catch(error => {
        //             console.log(error)
        //         })  
        //     })

        // },
        getName(element) {
            const data = element?.data?.data || element

            return `${data.mem_first_name || data.pAssignedFirstName || ''} ${
            data.mem_last_name || data.pAssignedLastName || ''
            }`.trim()
        },

        getSource() {
            return this.uploaded_json.length ? this.uploaded_json : this.selected_member
        },

        handleFileUpload(file) {
            if (!file) return

            const reader = new FileReader()

            reader.onload = (e) => {
                const result = e.target.result
                if (!result) return

                const parsed = JSON.parse(result)
                const list = Array.isArray(parsed) ? parsed : [parsed]

                this.uploaded_json = list.map(item => {
                    const data = item?.data?.data
                    if (data) {
                        data.primary_birthdate = data.mem_birthdate
                    }
                    return item
                })
                console.log('UPLOAD READY:', this.uploaded_json)
            }
            reader.readAsText(file)
        },

        async verifyMember() {
            this.verify_loader = true
            const source = this.getSource()
            this.register_results = []
            this.dialog_result = true

            for (let i = 0; i < source.length; i++) {
                const element = source[i]
                const data = element?.data?.data || element
                const name = this.getName(element)
                const item = { name, status: 'verifying'}
                this.register_results.push(item)

                await this.$nextTick()

                const response = await this.$axios.post(
                    this.$cms_url + "resources/web_service/ws_member_web.php", this.$qs.stringify({
                        post_data: this.wsDataEncryption(JSON.stringify({
                            key: 'eurekare_key_web',
                            data: {
                                command: 322101001,
                                data: {
                                    first_name: data.mem_first_name || data.pAssignedFirstName,
                                    last_name: data.mem_last_name || data.pAssignedLastName,
                                    birthdate: this.$moment(
                                        data.mem_birthdate || data.primary_birthdate || data.pAssignedDateOfBirth
                                    ).format('YYYY-MM-DD')
                                }
                            }
                        }))
                    })
                )

                const result = this.responseDataDecryption(response.data)

                if (result.is_registered === '2') {
                    item.status = 'success'
                } else {
                    item.status = 'processing'
                    await this.$nextTick()
                    const reg_result = await this.registerUser(element)
                    item.status = reg_result.success ? 'success' : 'failed'
                }
                await this.$nextTick()
            }

            this.verify_loader = false
        },

        async registerMembers() {
            this.register_loader = true
            const source = this.getSource()
            this.register_results = []
            this.dialog_result = true

            for (let i = 0; i < source.length; i++) {
                const element = source[i]
                const name = this.getName(element)
                const item = { name, status: 'processing' }
                this.register_results.push(item)
                await this.$nextTick()
                const result = await this.registerUser(element)
                item.status = result.success ? 'success' : 'failed'
                await this.$nextTick()
            }

            this.register_loader = false
        },

        async registerUser(element) {
            if (!element) return

            let payload

            if (element?.data?.command == "322101002") {
                payload = JSON.parse(JSON.stringify(element))
            } else {
                const templates = JSON.parse(JSON.stringify(registration_template))

                let payload_template = templates.find(template => {
                    const data = template.data.data
                    return (data.mem_first_name === element.pAssignedFirstName)
                })

                payload = payload_template || templates[0]
                payload.data.data.mem_first_name = element.pAssignedFirstName || ''
                payload.data.data.mem_middle_name = element.pAssignedMiddleName || ''
                payload.data.data.mem_last_name = element.pAssignedLastName || ''
                payload.data.data.mem_birthdate = element.pAssignedDateOfBirth ? this.$moment(element.pAssignedDateOfBirth).format('YYYY-MM-DD') : null
            }

            return this.$axios.post(this.$cms_url + "resources/web_service/ws_member_web.php", this.$qs.stringify({
                    post_data: this.wsDataEncryption(JSON.stringify(payload))
                })
            ).then(response => {
                const data = this.responseDataDecryption(response.data)
                this.ek_lgu_id = data.ek_lgu_id
                this.trnAddMigration()

                return { success: true, name: this.getName(element), element }
            }) .catch(() => {
                return { success: false, name: this.getName(element), element
                }
            })
        },

        async trnAddMigration() {
            const migration_data = JSON.parse(JSON.stringify(trn_add_migration_template))
            migration_data.ek_lgu_id = this.ek_lgu_id

            console.log('MIGRATION PAYLOAD:', migration_data)

            await this.$axios.post(this.$cms_url + 'resources/controller/trn_add_migration.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify(migration_data))
            })
            ).then(() => {
                console.log('Migration Success')
            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        // async registerUser(data) {
        //     console.log(registration_data)

        //     await this.$axios.post(this.$cms_url+"resources/web_service/ws_member_web.php",this.$qs.stringify({
        //         post_data: this.wsDataEncryption(JSON.stringify({
        //             ...registration_data,
        //             "mem_first_name": data.mem_first_name,
        //             "mem_middle_name": "MBCI MN SIXTY SEVEN",
        //             "mem_last_name": "MBCI LN SIXTY SEVEN",
        //         }))
        //     })).then (response => {
        //         response.data = this.responseDataDecryption(response.data)
        //         this.ek_lgu_id = response.data.ek_lgu_id
        //         console.log(this.ek_lgu_id)
        //         this.trnAddMigration()

        //     }).catch(error => {
        //         this.alert = { 
        //             display: true, 
        //             type: 'standard', 
        //             width: '350', 
        //             icon: 'mdi-alert-circle', 
        //             color: 'red', 
        //             title: error, 
        //             body: 'Please try again', 
        //             btn_pry_txt: 'OK', 
        //             btn_pry_color: 'primary', 
        //             btn_pry_otl: false,
        //             btn_pry_act: 'reloadPage' 
        //         }
        //     })   
        // },

        // async trnAddMigration() {
        //     await this.$axios.post(this.$tms_url+'resources/controller/trn_add_migration.php',this.$qs.stringify({
        //         post_data: this.wsDataEncryption(JSON.stringify(trn_add_migration))
        //     })).then(()=> {
        //         //this.releaseCard()
        //     }).catch(error => {
        //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     })
        // },

        // async releaseCard() {
        //     await this.$axios.post(this.$cms_url+'resources/web_service/ws_member_web.php', this.$qs.stringify({
        //         post_data: this.wsDataEncryption(JSON.stringify({
        //         key: 'eurekare_key_web',
        //         data: {
        //             command: 322101005,
        //             data: {
        //                 ek_lgu_id: this.ek_lgu_id,
        //                 current_card_key: '1',
        //                 is_card_ready: '1',
        //                 is_card_released: '1',
        //                 updated_by: this.$store.state.usr_credentials.user_name
        //             }
        //         }
        //         }))
        //     }))
        //     .then(response => {
        //         console.log(response.data)
        //         console.log("Released Card")
        //     })
        //     .catch( error => {
        //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //     })
        // },

        async checkEkonsulta() {
            // await this.$axios.post(this.$cms_url +"resources/api/_get_ekonsulta_eligibility_checker.php", this.$qs.stringify({
            //     post_data: this.wsDataEncryption(JSON.stringify({
            //         pPatientFname: this.member[0].mem_first_name,
            //         pPatientMname: this.member[0].mem_middle_name,
            //         pPatientLname: this.member[0].mem_last_name,
            //         pPatientExtname: this.member[0].mem_suffix,
            //         pPatientDob: this.member[0].mem_birthdate
            //     }))
            //     })).then((response) => {
            //     response.data = this.responseDataDecryption(response.data)
                
            //     this.mem_btn_loader = false
            //     if(response.data.eligible){          
            //         this.ekonsulta_mem = response.data
            //         this.add_atc_code = true
            //     } else {
            //         this.alert = { display: true, type: 'standard', width: '650', icon: 'mdi-alert-circle', color: 'primary', title: 'e-Konsulta Eligibility', body: 'This member is not eligible for eKonsulta. You can register the member through the PhilHealth portal.', btn_pry_color: 'grey darken-2', btn_pry_otl: true, btn_pry_act: 'closeAlert', ekonsulta: true, btn_sec_txt: 'Ok', btn_sec_color: 'primary', btn_sec_otl: false, btn_sec_act: 'loadingBtn',  btn_sec_emt:'confirmSubmit'}
            //     }
            //     }).catch(error => {
            //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            //     });
        },

        async preConsultation() {
            await this.$axios.post(this.$tms_url+"resources/controller/trn_add_consultation.php",this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                
                hmo_policy_number: null,
                hmo_healthcare_status: null,
                provider_code: "EK8BE7221CB09A2221",
                provider_tin: "",
                provider_name: "Dinalupihan Bataan Rural Health Unit 1 (RHU 1)",
                transaction_type: "PRE CONSULTATION",
                chief_complaint: "Test",
                created_by: "rhu1-ad-archer",
                doc_phic_acc_no: "1100-1432170-1",
                doc_prc_license: "65958",
                approval_code: "N/A",
                hmo_max_coverage_bal: 0,
                consultation_rate: 500,
                room_type: "",
                room_rate: 0,
                is_service_rendered: "0",
                service_feedback: "N/A",
                reason_for_not_rendered: "N/A",
                doctor_tin: "151459528",
                loa_generated_date: "2023-5-31",
                loa_expiration_date: "2023-6-6",
                agent_transaction_status_cc_ref: "0",
                transaction_status: "TO PROCESS",
                request_type: "WEB",
                on_queue: 1,
                processing_by: "rhu1-ad-archer",
                ek_lgu_id: this.ek_lgu_id,
                lgu_host_code: "BT",
                process_type: "LGU",
                host_claim_type: "NOT FOR CLAIMS",
                ek_phic_id: null,
                first_name: this.mem_first_name,
                middle_name: this.mem_middle_name,
                last_name: this.mem_last_name,
                suffix: "",
                birthday: this.mem_birthday,
                mem_phic_pin: this.mem_phic_pin,
                phic_host_code: "PHIC",
                has_emr_record: true,
                patient_medical_history: {
                    past_medical_history: [
                    {
                        mdisease_code: "999",
                        disease: "None"
                    }
                    ],
                    previous_hospitalization: "st lukes",
                    previous_hospitalization_date: "2023-03-01",
                    previous_surgeries: "Incision",
                    allergies: "N/a",
                    has_previous_record: true
                },
                patient_current_medicine: {
                    has_previous_record: false,
                    medicine: []
                },
                family_past_medical_history: {
                    has_previous_record: true,
                    history: [
                    {
                        mdisease_code: "999",
                        family_past_medical_history: "None",
                        family_history_classification: null
                    }
                    ]
                },
                patient_social_history: {
                    has_previous_record: true,
                    social_history: [
                    {
                        social_history: "Non-smoker",
                        years_of_smoked: null,
                        year_stopped_in_smoking: "Stopped < a year",
                        alcohol_consumed_in_5_months: null
                    },
                    {
                        social_history: "Alcoholic",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: "1"
                    },
                    {
                        social_history: "Illicit Drug User",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: null
                    },
                    {
                        social_history: "Sexually Active",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: null
                    }
                    ]
                },
                child_vaccination_record: {},
                patient_record: {
                    height: "161",
                    weight: "54",
                    bmi: 20.83,
                    bmi_remarks: "Normal Weight",
                    height_for_age: "",
                    weight_for_age: "",
                    weight_for_height: "",
                    has_previous_record: true,
                    hip: null,
                    limbs: null,
                    skin_for_thinkness: null,
                    mid_upper_arm_circle: null,
                    head_circle: null,
                    left_vision: "21/21",
                    right_vision: "21/21"
                },
                physical_exam_data: {
                    blood_pressure: "120/80",
                    blood_pressure_2nd: "",
                    blood_pressure_2nd_systolic: "",
                    blood_pressure_2nd_diastolic: "",
                    temp: "36",
                    pulse_rate: "",
                    heart_rate: "89",
                    oxygen_saturation: "",
                    respiration_rate: "32",
                    waist_circumference: "143",
                    central_adiposity: "1"
                },
                general_survey: {
                    general_survey: [
                    "Awake and Alert"
                    ],
                    general_survey_notes: ""
                },
                patient_heent: {
                    heent: [
                    {
                        heent_id: "11",
                        heent: "Essentially Normal"
                    }
                    ],
                    others_notes: ""
                },
                patient_assessment: {
                    chest: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "6",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    cvs: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "5",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    musculoskeletal: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: null,
                        assessment: "Essentially Normal"
                        }
                    ]
                    },
                    abdomen: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "7",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    gui: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    skin: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    neuro: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "6",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    pelvic: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: null,
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    rectal: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    }
                },
                vaccination_record: null,
                patient_medicine: [],
                diet: "",
                fluid_intake: "",
                follow_up_consultation_date: "",
                purpose_of_visit_service_availed: "General",
                operator_notes: "",
                dietary_intake: {
                    high_fat_salt_intake: "",
                    fiber_intake_fruit: "",
                    fiber_intake_vegetable: "",
                    physical_activity: ""
                },
                patient_symptoms: [
                    {
                    symptom: "None",
                    duration: "",
                    symptoms_id: ""
                    }
                ],
                diagnostic_exam_result: [],
                ncdQans: {
                    ek_lgu_id: this.ek_lgu_id,
                    Qid5_Ynx: "",
                    Qid6_Yn: "",
                    Qid7_Yn: "",
                    Qid8_Yn: "",
                    Qid9_Yn: "",
                    Qid10_Yn: "",
                    Qid11_Yn: "",
                    Qid12_Yn: "",
                    Qid13_Yn: "",
                    Qid14_Yn: "",
                    Qid15_Yn: "",
                    Qid16_Yn: "",
                    Qid17_Abcde: "",
                    Qid18_Yn: "",
                    Qid19_Yn: "",
                    Qid19_Fbsmg: "",
                    Qid19_Fbsmmol: "",
                    Qid20_Yn: "",
                    Qid20_Choleval: "",
                    Qid20_Choledate: "",
                    Qid21_Yn: "",
                    Qid21_Ketonval: "",
                    Qid21_Ketondate: "",
                    Qid22_Yn: "",
                    Qid22_Proteinval: "",
                    Qid22_Proteindate: "",
                    Qid23_Yn: "",
                    Qid24_Yn: "",
                    date_created: "05-31-2023",
                    date_updated: "05-31-2023"
                }

                }))
            })).then((response) => {
                this.transaction_number = response.data.transaction_number
                this.addEkonsulta()

            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        async addEkonsulta() {
            await this.$axios.post(this.$tms_url + 'resources/controller/trn_add_ekonsulta.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    transaction_number: this.transaction_number,
                    ek_lgu_id: this.ek_lgu_id,
                    blood_type: null,
                    atc: "WALKEDIN",
                    ekonsulta: {
                        eligible: true,
                        pPatientPin: "190269297569",
                        pPatientFname: "TFSHC FN TWO",
                        pPatientMname: "TFSHC MN TWO",
                        pPatientLname: "TFSHC LN TWO",
                        pPatientExtName: null,
                        pPatientDob: "1974-01-03",
                        pPatientType: "MM",
                        pPatientSex: "F",
                        Prv_Name: "P03033540",
                        pMemPin: "190269297569",
                        pMemFname: "TFSHC FN TWO",
                        pMemMname: "TFSHC MN TWO",
                        pMemLname: "TFSHC LN TWO",
                        pMemExtName: "",
                        pMemDob: "1974-01-03",
                        pEffYear: "2023",
                        pEnlistStat: "1",
                        pEnlistDate: "2023-01-01",
                        pHciCaseNo: "TP0303354020230586936",
                        pPatientMobileNo: "N/A",
                        pPatientAge: "49",
                        mem_category: null
                    },
                    diagnostic_exam_trans_no: null,
                    created_by: "rhu1-ad-archer",
                    is_emr: 0,
                    has_diabetes: true
                }))
            }))
            .then(response => {
                response.data = this.responseDataDecryption(response.data)
                console.log(response.data)
            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        async emrConsultation() {
            await this.$axios.post(this.$tms_url+'/resources/controller/trn_upd_pre_consultation.php', this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                    transaction_number: this.transaction_number,
                    icd_cpt_data: [
                        {
                        icd_code: "A15.1",
                        icd_description: "TUBERCULOSIS OF LUNG, CONFIRMED BY CULTURE ONLY",
                        category_description_id: "",
                        hmo_icd_limit_bal: 0,
                        hmo_icd_status: null,
                        phic_icd_status: null,
                        lgu_icd_status: null,
                        icd_type: "PRIMARY",
                        procedure_list: [
                            {
                            cpt_code: "0012F",
                            cpt_description: "CAP BACTERIAL ASSESS",
                            cpt_amount: 0,
                            hmo_cpt_approved_amount: 0,
                            phic_cpt_status: null,
                            gu_cpt_status: null,
                            hmo_cpt_status: null,
                            hmo_loa_amount: 0,
                            for_hmo_approval: 0,
                            diag_exam_status: "N",
                            physician_recommendation: "Y",
                            patient_remarks: "XX"
                            },
                            {
                            cpt_code: "71020",
                            cpt_description: "CHEST X-RAY",
                            cpt_amount: 0,
                            hmo_cpt_approved_amount: 0,
                            phic_cpt_status: null,
                            lgu_cpt_status: null,
                            hmo_cpt_status: null,
                            hmo_loa_amount: 0,
                            for_hmo_approval: 0,
                            diag_exam_status: "N",
                            physician_recommendation: "Y",
                            patient_remarks: "XX"
                            }
                        ]
                        }
                    ],
                    patient_medicine: [],
                    date_admitted: "2023-05-31",
                    date_discharged: "2023-05-31",
                    transaction_type: "CONSULTATION",
                    transaction_status: "ISSUED",
                    treatment_recommendation: "OUTPATIENT",
                    notes_management: {
                        lib_id: 0,
                        doctor_notes: null
                    }
                }))
            }))
            .then(() => {

            })
            .catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            })
        },

        async preCons() {
            await this.$axios.post(this.$tms_url+"resources/controller/trn_add_consultation.php",this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({

                hmo_policy_number: null,
                hmo_healthcare_status: null,
                provider_code: "EK8BE7221CB09A2221",
                provider_tin: "",
                provider_name: "Dinalupihan Bataan Rural Health Unit 1 (RHU 1)",
                transaction_type: "PRE CONSULTATION",
                chief_complaint: "Test",
                created_by: "rhu1-ad-archer",
                doc_phic_acc_no: "1100-1432170-1",
                doc_prc_license: "65958",
                approval_code: "N/A",
                hmo_max_coverage_bal: 0,
                consultation_rate: 500,
                room_type: "",
                room_rate: 0,
                is_service_rendered: "0",
                service_feedback: "N/A",
                reason_for_not_rendered: "N/A",
                doctor_tin: "151459528",
                loa_generated_date: "2023-5-31",
                loa_expiration_date: "2023-6-6",
                agent_transaction_status_cc_ref: "0",
                transaction_status: "TO PROCESS",
                request_type: "WEB",
                on_queue: 1,
                processing_by: "rhu1-ad-archer",
                ek_lgu_id: "EK-NRF6D1974T18-5033",
                lgu_host_code: "BT",
                process_type: "LGU",
                host_claim_type: "NOT FOR CLAIMS",
                ek_phic_id: null,
                first_name: "TFSHC FN TWO",
                middle_name: "TFSHC MN TWO",
                last_name: "TFSHC LN TWO",
                suffix: "",
                birthday: "1974-01-03",
                mem_phic_pin: "190269297569",
                phic_host_code: "PHIC",
                has_emr_record: true,
                patient_medical_history: {
                    past_medical_history: [
                    {
                        mdisease_code: "999",
                        disease: "None"
                    }
                    ],
                    previous_hospitalization: "st lukes",
                    previous_hospitalization_date: "2023-03-01",
                    previous_surgeries: "Incision",
                    allergies: "N/a",
                    has_previous_record: true
                },
                patient_current_medicine: {
                    has_previous_record: false,
                    medicine: []
                },
                family_past_medical_history: {
                    has_previous_record: true,
                    history: [
                    {
                        mdisease_code: "006",
                        family_past_medical_history: "Diabetes Mellitus",
                        family_history_classification: "Paternal"
                    }
                    ]
                },
                patient_social_history: {
                    has_previous_record: true,
                    social_history: [
                    {
                        social_history: "Non-smoker",
                        years_of_smoked: null,
                        year_stopped_in_smoking: "Stopped < a year",
                        alcohol_consumed_in_5_months: null
                    },
                    {
                        social_history: "Alcoholic",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: "1"
                    },
                    {
                        social_history: "Illicit Drug User",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: null
                    },
                    {
                        social_history: "Sexually Active",
                        years_of_smoked: null,
                        year_stopped_in_smoking: null,
                        alcohol_consumed_in_5_months: null
                    }
                    ]
                },
                child_vaccination_record: {},
                patient_record: {
                    height: "161",
                    weight: "54",
                    bmi: 20.83,
                    bmi_remarks: "Normal Weight",
                    height_for_age: "",
                    weight_for_age: "",
                    weight_for_height: "",
                    has_previous_record: true,
                    hip: null,
                    limbs: null,
                    skin_for_thinkness: null,
                    mid_upper_arm_circle: null,
                    head_circle: null,
                    left_vision: "21/21",
                    right_vision: "21/21"
                },
                physical_exam_data: {
                    blood_pressure: "120/80",
                    blood_pressure_2nd: "",
                    blood_pressure_2nd_systolic: "",
                    blood_pressure_2nd_diastolic: "",
                    temp: "35",
                    pulse_rate: "",
                    heart_rate: "89",
                    oxygen_saturation: "",
                    respiration_rate: "32",
                    waist_circumference: "121",
                    central_adiposity: "1"
                },
                general_survey: {
                    general_survey: [
                    "Awake and Alert"
                    ],
                    general_survey_notes: ""
                },
                patient_heent: {
                    heent: [
                    {
                        heent_id: "11",
                        heent: "Essentially Normal"
                    }
                    ],
                    others_notes: ""
                },
                patient_assessment: {
                    chest: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "6",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    cvs: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "5",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    musculoskeletal: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: null,
                        assessment: "Essentially Normal"
                        }
                    ]
                    },
                    abdomen: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "7",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    gui: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    skin: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    neuro: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "6",
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    pelvic: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: null,
                        assessment: "Essentially normal"
                        }
                    ]
                    },
                    rectal: {
                    others_notes: "",
                    assessment: [
                        {
                        assessment_id: "1",
                        assessment: "Essentially normal"
                        }
                    ]
                    }
                },
                vaccination_record: null,
                patient_medicine: [],
                diet: "",
                fluid_intake: "",
                follow_up_consultation_date: "",
                purpose_of_visit_service_availed: "General",
                operator_notes: "",
                dietary_intake: {
                    high_fat_salt_intake: "",
                    fiber_intake_fruit: "",
                    fiber_intake_vegetable: "",
                    physical_activity: ""
                },
                patient_symptoms: [
                    {
                    symptom: "None",
                    duration: "",
                    symptoms_id: ""
                    }
                ],
                diagnostic_exam_result: {
                    transaction_number: "V0TIC2RXNAFW",
                    data: [
                    {
                        libId: "99",
                        libDesc: "Others",
                        cpt_code: "0012F",
                        pDiagStatus: "Done",
                        pReferralFacility: "Test",
                        pLabDate: "2023-05-31",
                        pOtherDiagnosticExam: "CAP BACTERIAL ASSESS",
                        pFindings: "Test",
                        pDiagnosticLabFee: "2121"
                    },
                    {
                        lib_findings: "LIB_CHESTXRAY_FINDINGS",
                        lib_observation: "LIB_CHESTXRAY_OBSERVATION",
                        libDesc: "CHEST X-RAY",
                        cpt_code: "71020",
                        pDiagStatus: "Done",
                        pReferralFacility: "Test",
                        pLabDate: "2023-05-31",
                        pFinds: {
                        LibDesc: "BRONCHIOLITIS",
                        LibID: "10"
                        },
                        pFindings: "10",
                        pRemarksFindings: "21",
                        pObs: {
                        LibDesc: "CONSOLIDATION",
                        LibID: "3"
                        },
                        pObservation: "3",
                        pRemarksObservation: "Test",
                        pDiagnosticLabFee: "211"
                    }
                    ]
                },
                ncdQans: {
                    ek_lgu_id: "EK-NRF6D1974T18-5033",
                    Qid5_Ynx: "",
                    Qid6_Yn: "",
                    Qid7_Yn: "",
                    Qid8_Yn: "",
                    Qid9_Yn: "",
                    Qid10_Yn: "",
                    Qid11_Yn: "",
                    Qid12_Yn: "",
                    Qid13_Yn: "",
                    Qid14_Yn: "",
                    Qid15_Yn: "",
                    Qid16_Yn: "",
                    Qid17_Abcde: "",
                    Qid18_Yn: "",
                    Qid19_Yn: "",
                    Qid19_Fbsmg: "",
                    Qid19_Fbsmmol: "",
                    Qid20_Yn: "",
                    Qid20_Choleval: "",
                    Qid20_Choledate: "",
                    Qid21_Yn: "",
                    Qid21_Ketonval: "",
                    Qid21_Ketondate: "",
                    Qid22_Yn: "",
                    Qid22_Proteinval: "",
                    Qid22_Proteindate: "",
                    Qid23_Yn: "",
                    Qid24_Yn: "",
                    date_created: "05-31-2023",
                    date_updated: "05-31-2023"
                }
                
                }))
            })).then((response) => {
                this.transaction_number = response.data.transaction_number
                this.addEkonsulta()

            }).catch(error => {
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
            });
        },

        //START OF MILA UPDATES
        async processTransactionMembers() {
            this.transaction_dialog = true;
            this.transaction_action_type = "selection"
            for (let member of this.selected_member) {
                const is_registered = await this.verifyMember2(member);

                if (is_registered !== "0") {
                    const eligible = await this.ekonsultaEligibility(member);
                    if(eligible) {
                        await this.createTransactionForMember(member);
                    }
                }
            }
        },

        async verifyMember2(member) {
            let response = await this.$axios.post(this.$cms_url + "resources/web_service/ws_member_web.php",
            this.$qs.stringify({
                post_data: this.wsDataEncryption(JSON.stringify({
                key: 'eurekare_key_web',
                data: {
                    command: 322101001,
                    data: {
                        phic_pin: member.pAssignedPin,
                    }
                }
                }))
            })
            );

            const data = this.responseDataDecryption(response.data);

            if(response.status === 200) {
                member.is_registered = data.is_registered ?? false;
                member.ek_lgu_id = data.lgu_data?.ek_lgu_id ?? null;
                member.lgu_host_code = data.lgu_data?.lgu_host_code ?? null;
            }

            return member.is_registered;
        },

        async ekonsultaEligibility(member) {
            const birthday = this.transaction_action_type !=='upload' ? 
                this.$moment(member.pAssignedDateOfBirth, 'MM-DD-YYYY', true).format('YYYY-MM-DD')
                : member.pAssignedDateOfBirth

            let response = await this.$services.getEkonsultaEligibilityChecker({
                pPatientFname: member.pAssignedFirstName,
                pPatientMname: member.pAssignedMiddleName,
                pPatientLname: member.pAssignedLastName,
                pPatientExtname: '',
                pPatientDob: birthday,
                pPhicPin: member.pAssignedPin,
                pPatientType: member.pAssignedType,
                pHciAccreNo: this.$store.state.prv_data.ekonsulta_phic_acc_no || '',
                phic_token: this.$store.state.prv_data.phic_token || ''

            })

            if(response.status === 200) {
                const data = response.data = this.responseDataDecryption(response.data)

                member.konsulta_data = {
                    pEffYear: data.pEffYear,
                    pEnlistStat: data.pEnlistStat,
                    pEnlistDate: data.pEnlistDate,
                    pHciCaseNo: data.pHciCaseNo,
                    konsulta_eligible: data.konsulta_eligible
                }; 

                member.pPatientPin = data.pPatientPin
                member.pPatientFname = data.pPatientFname
                member.pPatientMname = data.pPatientMname
                member.pPatientLname = data.pPatientLname
                member.pPatientExtName = data.pPatientExtName
                member.pPatientDob = data.pPatientDob
                member.pPrimaryDateOfBirth = birthday
                member.pPatientType = data.pPatientType
                member.pPatientSex = data.pPatientSex
                
                member.pAssignedExtName = data.pPatientExtName
                member.pMemPin = data.pMemPin
                member.pMemFname = data.pMemFname
                member.pMemMname = data.pMemMname
                member.pMemLname = data.pMemLname
                member.pMemDob = data.pMemDob
                member.mem_category = data.mem_category
                member.pPatientMobileNo = data.pPatientMobileNo
                member.pPatientLandlineNo = data.pPatientLandlineNo
                member.pPatientAge = data.pPatientAge
                return data.konsulta_eligible

            } else { 
                this.$set(member, 'transactionCreationStatus', 'Something is wrong');
            }
        },

        //#1 trn_add_consultation
        async createTransactionForMember(member) {
            this.$set(member, 'transactionCreationStatus', 'ongoing');

            const ref_trn_add_consultation = this.transaction_action_type !== 'upload' 
                ? trn_add_consultation 
                : this.result.upload_trn_add_consultation

            const payload = { 
                ...(ref_trn_add_consultation),
                    first_name: member.pPatientFname,
                    middle_name: member.pPatientMname,
                    last_name: member.pPatientFname,
                    birthday: member.pPrimaryDateOfBirth,
                    mem_phic_pin: member.pPatientPin,
                    ek_lgu_id: member.ek_lgu_id,
                    lgu_host_code: member.lgu_host_code,
                ...(this.transaction_action_type !== 'upload' && {
                    loa_generated_date: this.$moment().format('YYYY-MM-DD'),
                    loa_expiration_date: this.$moment().format('YYYY-MM-DD'),
                    date_admitted: this.transaction_values?.date_admitted || this.$moment().format('YYYY-MM-DD'),
                    date_discharged: this.transaction_values?.date_discharged || this.$moment().format('YYYY-MM-DD'),
                    ncdQans: {
                        ...trn_add_consultation.ncdQans,
                        ek_lgu_id: member.ek_lgu_id
                    }
                }),
                ncdQans: {
                    ...(ref_trn_add_consultation.ncdQans),
                    ek_lgu_id: member.ek_lgu_id
                }
            };

            let response = await this.$services.trnAddConsultation(payload);
            response.data = this.responseDataDecryption(response.data)

            if(response.status === 200) {
            
                if (response.data.transaction_number) {
                    await this.saveEkonsulta(0, response.data.transaction_number,member);
                    await this.trnUpdatePatientTranRecord(response.data.transaction_number,member)
                    this.$set(member, 'transactionCreationStatus', 'done');
                } else{
                    this.$set(member, 'transactionCreationStatus', 'Something is wrong');
                }
            }else{
                this.$set(member, 'transactionCreationStatus', 'Something is wrong');
            }
        },
        
        //2 - FOR trn_add_ekonsulta     
        async saveEkonsulta(is_emr, transaction_number,member){
            const ref_trn_add_ekonsulta = this.transaction_action_type !== 'upload' 
                ? trn_add_ekonsulta 
                : this.result.upload_trn_add_konsulta

            const ref_trn_upd_pre_consultation = this.transaction_action_type !== 'upload' 
                ? trn_upd_pre_consultation 
                : this.result.upload_trn_upd_pre_consultation
            
            return this.$services.trnAddEkonsulta({
                ...ref_trn_add_ekonsulta,
                transaction_number: transaction_number,
                ek_lgu_id: member.ek_lgu_id,
                ekonsulta: {
                    ...ref_trn_add_ekonsulta.ekonsulta, 
                    pEffYear: member.konsulta_data.pEffYear,
                    pEnlistStat: member.konsulta_data.pEnlistStat,
                    pEnlistDate: member.konsulta_data.pEnlistDate,
                    pHciCaseNo: member.konsulta_data.pHciCaseNo,

                    pPatientPin: member.pPatientPin,
                    pPatientFname: member.pPatientFname,
                    pPatientMname: member.pPatientMname,
                    pPatientLname: member.pPatientFname,
                    pPatientExtName: member.pPatientExtName,
                    pPatientDob: member.pPrimaryDateOfBirth,
                    pPatientSex: member.pPatientSex,

                    pPatientMobileNo: member.pPatientMobileNo,
                    pPatientLandlineNo: member.pPatientLandlineNo,
                    pPatientAge: member.pPatientAge,
                    
                    pMemPin: member.pMemPin,
                    pMemFname: member.pMemFname,
                    pMemMname: member.pMemMname,
                    pMemLname: member.pMemLname,
                    pMemDob: member.pMemDob,
                    mem_category: member.mem_category
                },
                diagnostic_exam_trans_no: transaction_number,
                icd_cpt_data:   this.transaction_values?.with_diagnosis === 1 ?  
                                    ref_trn_upd_pre_consultation?.icd_cpt_data?.[0]?.procedure_list?.length > 0 ? 1 : 0
                                : 0 ,
                is_emr: is_emr
            })
            .then(() => {
                this.$set(member, 'transactionCreationStatus', 'done');
            })
            .catch(error => {
                this.$set(member, 'transactionCreationStatus', error);
            })
        },

        //3 - FOR trn_update_patient_tran_record
        async trnUpdatePatientTranRecord(transaction_number,member) {
            const ref_trn_update_patient_tran_record = this.transaction_action_type !== 'upload' 
                ? trn_update_patient_tran_record 
                : this.result.upload_trn_update_patient_tran_record
                
            let response = await this.$services.trnUpdatePatientTranRecord({
                ...ref_trn_update_patient_tran_record,
                transaction_number: transaction_number,
                ek_lgu_id: member.ek_lgu_id,
                lgu_host_code : member.lgu_host_code

            })

            if (response.status === 200) {
               await this.updPreConsultation(transaction_number,member)
            } else {
               this.$set(member, 'transactionCreationStatus', 'Something is wrong');
            }
        },

        //4 - FOR trn_upd_pre_consultation
        async updPreConsultation(transaction_number,member) {

            const ref_trn_upd_pre_consultation = this.transaction_action_type !== 'upload' 
                ? trn_upd_pre_consultation 
                : this.result.upload_trn_upd_pre_consultation
                

            let response = await this.$services.trnUpdatePreConsultation({
                ...ref_trn_upd_pre_consultation,
                    transaction_number: transaction_number,
                ...(this.transaction_action_type !== 'upload' && {
                    date_admitted: this.transaction_values?.date_admitted || this.$moment().format('YYYY-MM-DD'),
                    date_discharged: this.transaction_values?.date_discharged || this.$moment().format('YYYY-MM-DD')
                })
            })

            if(response.status === 200) {
                const is_emr =  this.transaction_values?.with_diagnosis === 1 ? 
                                    ref_trn_upd_pre_consultation?.icd_cpt_data?.[0]?.procedure_list?.length > 0 ? 1 : 0
                                : 0
                this.saveEkonsulta(is_emr, transaction_number,member)
            } else {
                this.$set(member, 'transactionCreationStatus', 'Something is wrong');
            }
        },

        transactionDialogClose() {
            this.transaction_dialog = false
            this.selected_member = []
            this.transaction_action_type = ""
        },

        transactionUploadDialogClose() {
            this.transaction_upload_dialog = false
        },

        uploadTransactionFileChecker(file,target) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedJson = JSON.parse(e.target.result);
                    this.result[target] = parsedJson;
                } catch (error) {
                    console.error("Invalid JSON file", error);
                }
            };
            reader.readAsText(file);
        },

        async processUploadedTransaction() {
            if (this.$refs.transaction_upload.validate()) {
                this.transaction_upload_dialog = false
                this.transaction_dialog = true
                const data = this.result.upload_trn_add_consultation
                const member = { 
                    "pAssignedFirstName": data.first_name, 
                    "pAssignedMiddleName": data.middle_name,
                    "pAssignedLastName": data.last_name,
                    "pPatientExtname": data.suffix,
                    "pAssignedDateOfBirth": data.birthday,
                    "pAssignedPin": data.mem_phic_pin,
                    "pAssignedType": "MM"
                }

                this.selected_member = [member]

                if(data.mem_phic_pin) {
                    this.transaction_action_type = "upload"
                    const is_registered = await this.verifyMember2(member);
                    if (is_registered !== "0") {
                        const eligible = await this.ekonsultaEligibility(member);
                        if(eligible) {
                        await this.createTransactionForMember(member);
                        }
                    }
                } else{
                    this.$set(member, 'transactionCreationStatus', 'Not Konsulta Eligible');
                }
            }

            this.upload_trn_add_consultation = null
            this.upload_trn_add_konsulta = null
            this.upload_trn_upd_pre_consultation = null
            this.upload_trn_update_patient_tran_record = null
            this.result = {}
        }

    }
}
</script>