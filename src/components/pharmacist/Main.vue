<template>
    <v-container>
        <Navbar :navbar="navbar"/>
        <div class="mt-3">
            <DPMMain v-if="$route.params.page === 'dispensing'"/>
            <Inventory v-else-if="$route.params.page === 'inventory'"/>
            <MedicineHistory v-else-if="$route.params.page === 'history'"/>
            <Transfer  v-else-if="$route.params.page === 'transfer'"/>
            <Received  v-else-if="$route.params.page === 'received'"/>
        </div>
    </v-container>
</template>

<script>
import Inventory from '../admin/medicine-inventory/Inventory'
import Navbar from '../Navbar'
import Received from '../admin/medicine-inventory/Received'
import Transfer from '../admin/medicine-inventory/Transfer'
import DPMMain from '../e-benefit/dispense-medicine/Main'
import MedicineHistory from '../admin/medicine-inventory/MedicineHistory'

export default {
    components: {
        Inventory,
        Navbar,
        Received,
        Transfer,
        DPMMain,
        MedicineHistory
    },

    data() {
        return {
            navbar: [
                {title: "Dispensing of Medicine", link: "/pharmacist/dispensing", icon: "mdi-pill-multiple" },
                { title: "Medicine Inventory", link: "/pharmacist/inventory", icon: "mdi-pill-multiple"},
                { title: "Inventory History", link: "/pharmacist/history", icon: "mdi-history"},
                { title: "Transfer Medicine", link: "/pharmacist/transfer", icon: "mdi-transfer"},
                { title: "Received Medicine", link: "/pharmacist/received", icon: "fas fa-folder" }
            ]
        }
    },
    
    watch: {
        '$route'(to) {
            if (to.params.page !== 'inventory' && to.params.page !== 'transfer' && to.params.page !== 'received' && to.params.page !== 'dispensing' && to.params.page !== 'history') {
                this.$router.push('/*')
            }
        }
    }
}
</script>
