<template>
 <v-dialog v-model="alert.display" :width="alert.width" persistent>
    <v-card class="text-center pa-5">
      <v-card-title class="justify-center">
        <v-icon :color="alert.color" size="80">{{alert.icon}}</v-icon>
      </v-card-title>

      <h2 class="grey--text text--darken-2 font-weight-regular">{{alert.title}}</h2>
      <h3 class="grey--text text--darken-3 font-weight-light mb-4">{{alert.sub_title}}</h3>
      <h3 class="grey--text text--darken-3 font-weight-light mb-8">{{alert.sub_title_2}}</h3>

      <v-row dense>
        <v-col cols="12" v-show="alert.downloadXML" class="mb-10">
          <v-btn @click="saveReport" :loading="save_report_loader"><v-icon left> mdi-file-xml-box</v-icon>Download XML Report</v-btn>
        </v-col>

        <v-col cols="12" v-show="alert.downloadTextFile" class="mb-10">
          <v-btn @click="alert.xml_bypass ? saveByPassReport() : saveReport()" :loading="save_report_loader"><v-icon left> mdi-file-xml-box</v-icon>Download Encrypted File Report</v-btn>
        </v-col>
        
        <v-col cols="12" v-show="alert.downloadKonsultaReceipt" class="mb-10">
          <v-btn @click="$emit('downloadKonsultaReceipt')"  :loading="save_report_loader"><v-icon left>mdi-file-pdf-box</v-icon>Download Yakap Confirmation Receipt</v-btn>
        </v-col>
        
        <v-col cols="12">
          <v-btn @click="$emit('closeReport')" class="px-10 py-5 mr-1" text> {{ this.$store.state.usr_credentials.department !== 'Admission' ? 'Close' : 'OK' }}</v-btn>
          <v-btn v-show="alert.downloadTextFile && this.$store.state.usr_credentials.department !== 'Admission' && !alert.xml_bypass" @click="$emit('submitReport')" :loading="submit_report_loader" class="primary px-10 py-5 ml-1" text> Submit report</v-btn>
        </v-col>
      </v-row>
    </v-card>
 </v-dialog>  
</template>

<script>
export default {
  name: 'Transaction-Dialog',
  props: ['alert', 'submit_report_loader'],

  data() {
    return {
      save_report_loader: false,
    }
  },

  methods: {
    sumbitReport() {
      this.emit('submitReport')
    },

    primaryBtn() {
      this.alert.display = false
      if (this.alert.emitMethod) {
        this.$emit(this.alert.emitMethod)
        location.reload()
      }
      
    },

    saveReport() {
      this.save_report_loader = true
      const blob = new Blob([this.alert.xmlData], { type: "text/xml" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = this.alert.downloadXML? `${this.alert.file_name}.xml`:`${this.alert.file_name}.enc`;
      
      setTimeout(() => {
        link.click();
        this.save_report_loader = false
      }, 1000)
    },

    async saveByPassReport() {
      const timestamp = Math.floor(Date.now() / 1000);
      const base64 = btoa(timestamp.toString());

      const response = await this.$services.encryptedXmlFileDownload({
          file: this.alert.filename,
          pc: this.$store.state.prv_data.provider_code,
          pf: this.alert.pf,
          t: base64,
      });

      if (response.error) {
          return;
      }

      const blob = response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = this.alert.filename;
      link.click();

      URL.revokeObjectURL(link.href);
    }
    
  }
}
</script>