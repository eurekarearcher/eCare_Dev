<template>
    <v-container fluid>
        <Navbar :navbar="navbar" />
        <QueueList />
    </v-container>
</template>
<script>
import QueueList from '@/components/e-benefit/QueueList.vue';
import Navbar from "@/components/Navbar.vue";

export default {
    components: {
        QueueList,
        Navbar
    },

    data() {
        return {
            navbar: [{ title: 'Home', link: '/diagnostic-laboratory', icon: 'fas fa-home'}],
        }
    }
}
</script>