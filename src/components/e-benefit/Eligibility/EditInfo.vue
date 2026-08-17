<template>
    <v-container class="mx-auto body-container"> 
        <h1 class="text-h5 text-center grey--text text--darken-3 font-weight-medium mt-5 d-print-none mb-5"> EDIT INFORMATION </h1>
        <AdditionalInformation :process="process"/>
    </v-container>
</template>

<script>
import AdditionalInformation from "@/components/e-benefit/web-registration/AdditionalInformation.vue";

export default {
    components: {
        AdditionalInformation
    },

    data() {
        return {
            process: 'EDIT'
        }
    }
}
</script>
<style scoped> 
.body-container {
  padding:1em
}
</style>
