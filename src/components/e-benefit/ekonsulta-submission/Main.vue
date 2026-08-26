<template>
    <v-container fluid>
        <Navbar :navbar="navbar" />
        <EkonsultaSubmission />
    </v-container>
</template>
<script>
import EkonsultaSubmission from '@/components/admin/ekonsulta/ekonsulta-unrestrict-submission/EkonsultaSubmission.vue';
import Navbar from "@/components/Navbar.vue";

export default {
    components: {
        EkonsultaSubmission,
        Navbar
    },

    data() {
        return {
            navbar: [{ title: 'Home', link: '/offline-transaction', icon: 'fas fa-home'}],
        }
    }
}
</script>
