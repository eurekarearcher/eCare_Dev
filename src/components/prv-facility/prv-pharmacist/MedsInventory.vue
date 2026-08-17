<template>
    <v-container v-resize="onResize" fluid class="height-100 color-text px-7 px-lg-7">
        <Navbar :navbar="navbar" />
        <Inventory />
    </v-container>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Inventory from '@/components/admin/medicine-inventory/Inventory.vue'

export default {
    components: {
        Navbar,
        Inventory,
    },

    data() {
        return {
            navbar: [
                { title: "HOME", link: "/pvt-pharmacist", icon: "mdi-home" },
            ],
        }
    },

    methods: {
        // FOR RESPONSIVENESS OF IMAGE SIZES
        onResize() {
            this.windowSize = { x: window.innerWidth, y: window.innerHeight };
            if (this.windowSize.x > 1904) {
                this.heroes_health_logo = "250"
                this.confirm_display_width = "60%"
                this.text_title = 'font-size: 1.4em'
                this.icon_size = '75'
            } else if (this.windowSize.x > 1264 && this.windowSize.x < 1904) {
                this.heroes_health_logo = "200"
                this.confirm_display_width = "60%"
                this.text_title = 'font-size: 1.12em'
                this.icon_size = '70'
            } else if (this.windowSize.x > 960 && this.windowSize.x < 1264) {
                this.heroes_health_logo = "180"
                this.confirm_display_width = "60%"
                this.text_title = 'font-size: 1em'
                this.icon_size = '66'
            } else if (this.windowSize.x > 600 && this.windowSize.x < 960){
                this.heroes_health_logo = "180"
                this.confirm_display_width = "80%"
                this.text_title = 'font-size: 0.9em'
                this.icon_size = '55'
            } else {
                this.qr_height = '270'
                this.heroes_health_logo = "170"
                this.confirm_display_width = "100%"
                this.text_title = 'font-size: 0.9em'
                this.icon_size = '45'
            }
        },
    }
}
</script>
