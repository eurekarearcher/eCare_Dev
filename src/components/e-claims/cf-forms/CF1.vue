<template>
  <div> 
      <iframe v-if="pdf_url" :src="pdf_url + '#toolbar=0'" width="100%" height="1500px" style="border:none;" ref="pdf"></iframe>
  </div>
</template>

<script>

export default {
  //props for the member/patient,doctor,accredication & certification data
  props: ['cf1_data_p1', 'cf1_data_p2'],

  data(){
      return{
          pdf_url: null,
          check_icon: require('../../../assets/check.png'),
      }
  },

  mounted(){
    this.getPDF();
  },

  methods:{
    async getPDF() {
      let response = await this.$services.getPDFTemplate({
        request_key: 'cf1',
      })

      if(response.status === 200){
        response = response.data
        this.pdf_url = await this.$get_pdf_forms.getCF1(response.cf1, this.cf1_data_p1,this.cf1_data_p2)
      }
    },

    downloadPDF(){
      const file_name_facility = this.$store.state.prv_data.provider_name
      const patient_name = `${this.cf1_data_p1.PATIENT_DATA.first_name} ${this.cf1_data_p1.PATIENT_DATA.last_name}`

      const link = document.createElement("a")
      link.href = this.pdf_url
      link.download =   `${patient_name}_${file_name_facility}_CF1.pdf`;

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
}
</script>