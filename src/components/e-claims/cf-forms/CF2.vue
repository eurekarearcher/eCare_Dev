<template>
  <div>
    <iframe v-if="pdf_url" :src="pdf_url + '#toolbar=0'" width="100%" height="600px" style="border:none;" ref="pdf"></iframe>
  </div>
</template>

<script>
export default {
  props: ['cf2_data_p1', 'cf2_data_p2', 'cforms_data'],
  data(){
    return{
      pdf_url: sessionStorage.getItem('CF2GFY') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('CF2GFY'), 'EJHHSTY').toString(this.$crypto.enc.Utf8)) : null,
      check_icon: require('../../../assets/check.png'),
    }
  },

  mounted(){
    this.getPDF();
  },

  methods:{
    async getPDF(){
        let response = await this.$services.getPDFTemplate({
            request_key: 'cf2',
        })

        if(response.status === 200){
            response = response.data
            if(response.cf2){
                this.pdf_url = await this.$get_pdf_forms.getCF2(response.cf2, this.cforms_data)
            }
        }
    },

    downloadPDF(){
      const file_name_facility = this.$store.state.prv_data.provider_name
      const patient_name = `${this.cforms_data.patient_data.PATIENT_DATA.first_name} ${this.cforms_data.patient_data.PATIENT_DATA.last_name}`

      const link = document.createElement("a")
      link.href = this.pdf_url
      link.download =   `${patient_name}_${file_name_facility}_CF2.pdf`;

      link.click()
    },

    printPDF() {
      const print_iframe = this.$refs.pdf;
      if (print_iframe && print_iframe.contentWindow) {
        print_iframe.contentWindow.focus();
        print_iframe.contentWindow.print();
      }
    }
  }
};
</script>
