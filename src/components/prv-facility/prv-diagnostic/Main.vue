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
                { icon: 'mdi-qrcode-scan', title: 'QR Scanner', sub_title: 'Scan QR Code on form to initiate a diagnostic laboratory.', caption: 'SCAN QR IMAGE', function_name: 'openQRScanner' },
                { icon: 'fas fa-clipboard-list', title: 'Queue List', sub_title: 'Private Diagnostic Exam Queue List', caption: 'Encoding Result', function_name: 'openQueueList'}
            ]
        }
    }
}
</script>