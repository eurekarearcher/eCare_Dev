<template>
    <QrScan :dashboard_item="dashboard_item"/>
</template>

<script>
import QrScan from '@/components/prv-facility/Main.vue'

export default {
    components: {
        QrScan
    },

    data() {
        return {
            dashboard_item: [
                { icon: 'mdi-qrcode-scan', title: 'QR Scanner', sub_title: 'Scan QR code for prescribing of medicine.', caption: 'SCAN QR IMAGE', function_name: 'openQRScanner' },
                { icon: 'mdi-medical-bag', title: 'Medicine Inventory', function_name: 'openMedicineInventory' }
            ],
            
            //FOR RESIZE
            windowSize: {x: 0,y: 0},
            heroes_health_logo:'250',
            confirm_display_width:"60%",
            text_title:'font-size: 1.17em',
            icon_size: '75',

        }
    },
}
</script>