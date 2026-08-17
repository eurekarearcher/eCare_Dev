<template>
  <v-container>

    <!-- <iframe
     v-if="has_pdf"
     :src="has_pdf"
     width="100%"
     height="750"
    > 
    </iframe> -->


    <v-tabs v-model="tab"  class="card-border px-1" active-class="active-tab" hide-slider outlined>
          <v-tab class="non-active-tab">Data Decryption</v-tab>
          <v-tab class="non-active-tab">Data Encryption</v-tab>
          <v-tab class="non-active-tab">Vuex</v-tab>
    </v-tabs>
                
    <v-tabs-items v-model="tab"  class="px-1 mb-7" ref="tabs" touchless>
      <v-tab-item>
        <v-card width="800" class="mx-auto px-5 pb-5 my-4" style="overflow:auto;">
          <v-card-title class="px-0">Single Decryption</v-card-title>
          <v-text-field v-model="single_value" placeholder="Enter Value Here"  hide-details outlined dense></v-text-field>
          <v-card-actions class="px-0">
            <v-btn @click="decrypt('single')" class="ml-auto" color="primary" small dark>Decrypt <v-icon small right>mdi-send</v-icon></v-btn>
          </v-card-actions>
          
          <v-divider class="my-2"></v-divider>

          <v-card-title class="px-0">Object Decryption</v-card-title>
          <v-text-field v-model="obj_value" placeholder="Enter Value Here"  hide-details outlined dense></v-text-field>
          <v-card-actions class="px-0">
            <v-btn @click="decrypt('obj')" class="ml-auto" color="primary" small dark>Decrypt <v-icon small right>mdi-send</v-icon></v-btn>
          </v-card-actions>

          <v-divider class="my-2"></v-divider>

          <div v-show="show_decrypted">
            <v-card-subtitle class="px-0 font-weight-medium">DECRYPTED DATA</v-card-subtitle>
            <h6>
              <pre>
              {{this.dec_result}}
              </pre>
            </h6>
          </div>
    
          <v-card-title class="px-0">API/Controller</v-card-title>
          <v-text-field v-model="request_url" placeholder="Request URL" class="mb-4"  hide-details outlined dense></v-text-field>
          <v-text-field v-model="payload" placeholder="Encrypted Payload" class="mb-4"  hide-details outlined dense></v-text-field>
          <v-card-actions class="px-0">
            <v-btn @click="submitRequest()" class="ml-auto" color="primary" small dark>Submit Request <v-icon small right>mdi-send</v-icon></v-btn>
          </v-card-actions>
          
          <v-divider class="my-2"></v-divider>

          <div v-show="data_response">
            <v-card-subtitle class="px-0 font-weight-medium">DATA RESPONSE</v-card-subtitle>
            <h6>
              <pre>
              {{this.data_response}}
              </pre>
            </h6>
          </div>

          <!-- <div v-show="show_decrypted">
            <v-card-subtitle class="px-0 font-weight-medium">DECRYPTED DATA</v-card-subtitle>
            <h6>
              <pre>
              {{this.dec_result}}
              </pre>
            </h6>
          </div>
    -->

    <!-- <v-form>
      <v-btn @click="usbSmartCard"> READ USB SMART CARD </v-btn> 
      <v-btn @click="clicks"> GET LOCAL IP ADDRESS </v-btn>
      <v-btn @click="readCard"> Read Card </v-btn> 
    </v-form> -->

    <v-btn @click="clicks"> GET LOCAL IP ADDRESS </v-btn>
    </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card width="800" class="mx-auto  my-6" style="overflow:auto;">
          <v-tabs v-model="encrypt_tab"  class="card-border px-1" active-class="active-tab" hide-slider outlined>
                <v-tab class="non-active-tab">Input Text</v-tab>
                <v-tab class="non-active-tab">Pre Text</v-tab>
          </v-tabs>
          <v-tabs-items v-model="encrypt_tab"  class="px-1 mb-7" ref="tabs" touchless>
            <v-tab-item>
              <div class="px-5 pb-5">
                <v-sheet class="d-flex justify-end mt-4"> 
                  <v-btn @click="addParameter" color="primary" small> Add parameter </v-btn>
                </v-sheet>

                <v-row no-gutters dense> 
                  <v-col>
                      <p class="text-body-2"> Key </p>
                  </v-col>
                  <v-col>
                      <p class="text-body-2"> Value </p>
                  </v-col>
                </v-row>
                
                <v-row v-for="(data, i) in encrypted_json_holder" :key="i" dense> 
                  <v-col>
                    <v-text-field v-model="data.key" hide-details> </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="data.value" @click:append="clearField(i)" append-icon="mdi mdi-delete" hide-details> </v-text-field>
                  </v-col>
                </v-row>
                
              </div>
            </v-tab-item>
            <v-tab-item>
                <v-sheet class="ma-4">
                  <h4 class="body-2 mb-4"> Type JSON Format </h4>
                  <v-textarea v-model="list_of_payload" rows="12" outlined> </v-textarea>
                </v-sheet>
            </v-tab-item>

            <div class="mx-4">
              <v-sheet class="d-flex justify-end mt-4 pb-4"> 
                <v-btn @click="encryptPayload" color="primary" small> Encrypt Data </v-btn>
              </v-sheet>
              
              <v-sheet class="mt-4">
                <v-textarea v-model="encrypted_payload" outlined readonly> </v-textarea>
              </v-sheet>
              <v-sheet class="d-flex justify-end"> 
                <v-btn @click="clearFieldItems" class="mr-4" small> Clear </v-btn>
                <v-btn @click="copyToClipboard" color="success" small> Copy </v-btn>
              </v-sheet>

              <v-card-title class="px-0">API/Controller</v-card-title>
              <v-text-field v-model="request_url" placeholder="Request URL" class="mb-4"  hide-details outlined dense></v-text-field>
              <v-text-field v-model="payload" placeholder="Encrypted Payload" class="mb-4"  hide-details outlined dense></v-text-field>
              <v-card-actions class="px-0">
                <v-btn @click="submitRequest()" class="ml-auto" color="primary" small dark>Submit Request <v-icon small right>mdi-send</v-icon></v-btn>
              </v-card-actions>
              
              <v-divider class="my-2"></v-divider>

              <div v-show="data_response">
                <v-card-subtitle class="px-0 font-weight-medium">DATA RESPONSE</v-card-subtitle>
                <h6>
                  <pre>
                  {{this.data_response}}
                  </pre>
                </h6>
              </div>
            </div>
          </v-tabs-items>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card width="800" class="mx-auto  my-6" style="overflow:auto;">
          <div v-for="(value, key) in $store.state" :key="key" class="pa-2"> 
            <div class="font-weight-bold">{{ key }} :</div>
            <div v-if="isObject(value)">
              <pre> {{ formatJSON(value) }} </pre>
            </div>
            <div v-else>
              {{ value }}
            </div>
            <v-divider class="my-2"></v-divider>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

      <!-- <v-btn @click="downloadModifedPDF"> DOWNLOAD MODIFIED PDF </v-btn> -->

      <h6> Version {{ $app_version }}</h6>
  </v-container>
</template>

<script>
import axios from 'axios'
import mixin from '@/mixin'
import { PDFDocument, rgb } from 'pdf-lib'

export default {
  data() {
    return {
      tab: '',
      encrypt_tab: '',
      dec_result: '',
      obj_value:'',
      single_value: '',
      show_decrypted: false,

      for_decryption: false,

      file_upload: [],
      user_ip_address: '',
      request_url: '',
      payload: '',
      cms_tms: '',
      data_response: '',

      encrypted_json_holder: [{ key: null, value: "" }],
      encrypted_payload: null,
      list_of_payload: '',
      cardData: null,
      device: null,
      
      pdf_url: require('../assets/pdf/claim_form/ClaimSignatureForm_2018.pdf'),
      check_icon: require('../assets/check.png'),

      has_pdf: null,
      timestamp: this.$moment().utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'
    }
  },

  mounted() {
    if((this.$tms_url.includes('dev') && this.$cms_url.includes('dev')) || (this.$tms_url.includes('testqa') && this.$cms_url.includes('testqa'))) {
      const test_object = {
          a: ['1','2','3','4','5'],
          b: ['test1','test2','test3','test4','test5'],
          c: ['pest1','pest2', 'pest3', 'pest4', 'pest5'],
          d: ['jest1','jest2', 'jest3', 'jest4', 'jest5']
      }
  
      // CREATE CODE TO MERGE KEY TO ARRAY VALUES
      const new_array = Object.entries(test_object).map(items => {
        return items[1].map(value => {
          return ({[items[0]] : value})
        })
      })
      
      let main_array = new_array[0]
      let get_array_other_than_first = new_array.splice(1)
  
      // CREATE CODE TO MERGE ARRAY TO MAIN ARRAY
      for (let x = 0; x < get_array_other_than_first.length; x++) {
        main_array =  main_array.map((value, idx) => {
          return Object.assign({}, {...value, ...get_array_other_than_first[x][idx]})
        })
      }   

      } else {
        this.$router.push('/*')
    }
    this.get_ekonsulta_member()

    // this.getPDF()
  }, 

  methods: {

    async get_ekonsulta_member () {

      const base64 = "MjAyNS0xMC0yMSAxMjoyNzozNg==";
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      console.log(decoded)

      
      console.log(this.timestamp)
      this.timestamp = this.wsDataEncryption(this.timestamp)
      console.log(this.timestamp)
        let response =  await this.$axios.post('https://dev-tms.eurekare.net:61012/resources/test_ws/Matt/dynamic_db_test.php')
        

        let data = response
        console.log(data)
    },

    async getPDF(){
      let response = await this.$axios.post('https://dev-cms.eurekare.net:61012/resources/api/_get_phic_pdf_template.php', this.$qs.stringify({
          post_data: this.wsDataEncryption(JSON.stringify({
              request_key: 'cf2',
          }))
      }))
      response = response.data
      // this.has_pdf = response.cf2
      // window.open(response);

      if(response.cf2){
        // await this.downloadModifedPDF()

        this.has_pdf = await this.$get_pdf_forms.getCF2(response.cf2)

        
      }
    },

    async downloadModifedPDF(){
      let font_color_r = 0.13
      let font_color_g = 0.13
      let font_color_b = 0.13
      let size_text = 7

      const existing_pdf_bytes = await fetch(this.has_pdf).then(res => res.arrayBuffer())
      const pdf_doc = await PDFDocument.load(existing_pdf_bytes)

      const check_icon = await fetch(this.check_icon).then(res => res.arrayBuffer())
      const check_imge_icon = await pdf_doc.embedPng(check_icon)

      const pages = pdf_doc.getPages()
      const pdf_page = pages[0]

      // PHIC ACCREDITATION NUMBER PAN
      pdf_page.drawText("9     8     7    6    2    4    5    1    2", {
        x: 334,
        y: 734,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // NAME OF HCI
      pdf_page.drawText("TEST HCI HOSPITAL", {
        x: 174,
        y: 720,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // ADDRESS BUILDING NUMBER AND STREET NAME
      pdf_page.drawText("205 SAMPLE TEST STREE", {
        x: 80,
        y: 702,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // ADDRESS CITY MUNICIPALITY
      pdf_page.drawText("CALOOCAN CITY", {
        x: 298,
        y: 702,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // ADDRESS PROVINCE
      pdf_page.drawText("TEST PROVINCE", {
        x: 452,
        y: 702,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // PATIENT LAST NAME
      pdf_page.drawText("TEST LAST NAME", {
        x: 124,
        y: 656,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // PATIENT FIRST NAME
      pdf_page.drawText("TEST FIRST NAME", {
        x: 246,
        y: 656,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // PATIENT EXTENSION NAME
      pdf_page.drawText("TEST EX NAME", {
        x: 376,
        y: 656,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // PATIENT MIDDLE NAME
      pdf_page.drawText("TEST MIDDLE NAME", {
        x: 470,
        y: 656,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      pdf_page.drawImage(check_imge_icon, {
        x: 50,
        y: 738,
        width: 20,
        height: 20
      })

      const modified_pdf = await pdf_doc.save()
      const blob = new Blob([modified_pdf], { type: "application/pdf"})
      this.has_pdf = URL.createObjectURL(blob)
      // this.downloadFile(modified_pdf, 'modified_pdf')
    },

    addParameter(){
      // this.encrypted_json_data.push({ key: null, value: null })
      // this.encrypted_json_holder.push({

      // })
      this.encrypted_json_holder.push({ key: null, value: null })

      // this.json_key = ''
      // this.json_value = ''
    },

    encryptPayload(){
      try {
        let json_data = {}

        if(this.encrypt_tab === 1){
          json_data = JSON.parse(this.list_of_payload)
        } else {
          this.encrypted_json_holder.forEach(data => {
            json_data[data.key] = data.value
          })
        }

        this.list_of_payload = JSON.stringify(json_data, null, 2)
        this.encrypted_payload = mixin.methods.wsDataEncryption(this.list_of_payload)
        
      } catch (e) {
        alert('Invalid JSON')
      }


    },

    clearField(index) {
      this.encrypted_json_holder = this.encrypted_json_holder.filter(item => item !== this.encrypted_json_holder[index])
    },

    clearFieldItems(){
      this.list_of_payload = ''
      this.encrypted_payload = null
      this.encrypted_json_holder = [{ key: null, value: null }]
    },

    async copyToClipboard() {
      try {
        // Use the Clipboard API to copy the text
        await navigator.clipboard.writeText(this.encrypted_payload);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    },

    clicks(){ 
      var ip = false;
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;

        if (window.RTCPeerConnection) {
          ip = [];
          var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
          pc.createDataChannel('');
          pc.createOffer(pc.setLocalDescription.bind(pc), noop);

          pc.onicecandidate = function(event) {
          if (event && event.candidate && event.candidate.candidate) {
              var s = event.candidate.candidate.split('\n');
              ip.push(s[0].split(' ')[4]);
            }
          }
        }

        this.user_ip_address = ip

        console.log(this.user_ip_address)

        return ip;
    }, 

    async usbSmartCard(){
      try {
        // Request device permission
        const device = await navigator.usb.requestDevice({
          filters: [{ vendorId: 0x0CA6 }]  // Replace with your reader's vendorId
        });

        
        // Open the device
        await device.open();
        
        // // Claim the interface for communication
        // await device.selectConfiguration(1);
        // await device.claimInterface(0);

        // // Save the device object for future interaction
        // this.device = device;
        // this.deviceName = device.productName;

        // // Initialize communication with card
        // const result = await this.initializeCard(device);
        // console.log(result);

        // // Read data from the card
        // const data = await this.readDataFromCard(device);
        // this.cardData = data;

      } catch (error) {
        console.error('Error:', error);
      }
    },

    // Initialize communication with the card (reset card, select file/application)
    async initializeCard(device) {
      try {
        // Example of an APDU command to reset the card
        const commandReset = new Uint8Array([0x00, 0xA4, 0x04, 0x00, 0x00]);  // Select command
        await device.transferOut(1, commandReset);  // Send the reset command

        // Optionally, you could send additional commands to select a specific file or application
        // Example of an APDU command to select an application (e.g., 'A0000002471001')
        const selectAppCommand = new Uint8Array([0x00, 0xA4, 0x04, 0x00, 0x07, 0xA0, 0x00, 0x00, 0x24, 0x71, 0x00, 0x01]);
        await device.transferOut(1, selectAppCommand);

        // Return a success message or result
        return 'Card Initialized and Application Selected';
      } catch (error) {
        console.error('Error initializing card:', error);
        throw new Error('Failed to initialize card');
      }
    },

    // Read data from the card (for example, read a memory block or file)
    async readDataFromCard(device) {
      try {
        // Example APDU to read data from the card (e.g., get data from a file)
        // This command would depend on the card's protocol and file system
        const readCommand = new Uint8Array([0x00, 0xB0, 0x00, 0x00, 0x10]);  // Read 16 bytes from memory
        const response = await device.transferOut(1, readCommand);
        console.log('Response:', response);

        // Get the response from the card
        const cardResponse = await device.transferIn(1, 64);  // Read response (64 bytes max)
        const cardData = new TextDecoder().decode(cardResponse.data);  // Decode the data as text
        console.log(cardData)
        // Return the data from the card
        return cardData;
      } catch (error) {
        console.error('Error reading data from card:', error);
        throw new Error('Failed to read data from card');
      }
    },

    async readCard() {
      const data = "Xr8=read_data&T0x=EKBVAC23D34C802134";

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "http://10.0.4.16:1900/api/cardissuance/ReadCard");
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);

      console.log("XHR status:", xhr.status);
      console.log("XHR readyState:", xhr.readyState);
      console.log("XHR response:", xhr.responseText);
      

    // let data = {
    //   Xr8: 'read_data',
    //   T0x: 'EKBVAC23D34C802134'
    // }

// let headersList = {
//  "Accept": "*/*",
//  "Content-Type": "application/x-www-form-urlencoded",

// }

// // let bodyContent = "Xr8=read_data&T0x=EKBVAC23D34C802134";

// let reqOptions = {
//   url: "http://192.168.1.10:1900/api/cardissuance/readcard",
//   method: "POST",
//   headers: headersList,
//   data: data,
// }

// let response = await axios.request(reqOptions);
// console.log(response.data);

    // let data = {
    //   Xr8: 'read_data',
    //   T0x: 'EKBVAC23D34C802134'
    // }
    //   let response = await fetch(`http://192.168.1.20:1900/api/cardissuance/readcard`, {
    //     method: "POST", // *GET, POST, PUT, DELETE, etc.
    //     //mode: "same-origin", // no-cors, *cors, same-origin
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     //credentials: "same-origin", // include, *same-origin, omit
    //     headers: {
    //       // "Content-Type": "application/json",
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'Accept': '*/*',
    //       'Access-Control-Allow-Origin' : '*'

    //     },
    //     redirect: "follow", // manual, *follow, error
    //     // mode: 'no-cors',
    //     RequestCredentials: true,
    //     referrerPolicy: "strict-origin-when-cross-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     body: JSON.stringify(data), // body data type must match "Content-Type" header
    //   })

    //   let text = await response.text()
    //   console.log(text)
      // console.log(response)
      // return response.json()

// let formData = new URLSearchParams();
// formData.append('Xr8', 'read_data');
// formData.append('T0x', 'EKBVAC23D34C802134');

// let response = await fetch('http://192.168.1.20:1900/api/cardissuance/readcard', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Accept': '*/*'
//   },
//   body: formData.toString()
// });

// let text = await response.text();
// console.log(text);
    },
    
    // A function that decrypts the data.
    decrypt(type) {
      if (type === 'single' && this.single_value) {
        this.show_decrypted = true
        this.dec_result = this.wsDataDecryption(this.single_value)
      } else if (type === 'obj' && this.obj_value) {
        this.show_decrypted = true
        try {
          this.dec_result = JSON.parse(this.wsDataDecryption(this.obj_value))
        } catch  {
          this.dec_result = "decryption_failed"
        }
      } else {
        alert('ENTER VALUE')
      }
    },

    submitRequest() {
      axios.post(this.request_url, this.$qs.stringify({
        post_data: this.payload
      })).then(response => {
        this.data_response = this.responseDataDecryption(response.data)
      }).catch(err => {
        this.data_response = err
      })
    },

    isObject(val) {
      return typeof val === 'object' && val !== null;
    },

    formatJSON(obj) {
      return JSON.stringify(obj, null, 2);
    }
  }
}
</script>

<style scoped>
pre {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>