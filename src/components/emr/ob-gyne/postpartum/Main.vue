<template>
    <v-card class="pa-7" outlined>
        <!-- <h3 class="font-weight-regular blue darken-3 text-center white--text py-2">PREGNANCY HISTORY</h3>
        
        <v-card class="pa-7 mb-6">
            <v-data-table :headers="tbl_headers" :items="tbl_items" :search="tbl_search" :footer-props="{ 'items-per-page-options': [5, 10, 15, 50] }" :items-per-page="5" class="elevation-2" mobile-breakpoint="0"></v-data-table>
        </v-card> -->

        <Visit :editable_="editable_" :postpartum_="obg_data_.postpartum" :from_migration="from_migration" @mutationStatus="mutationStatus" />
    </v-card>
</template>

<script>
import Visit from '@/components/emr/ob-gyne/postpartum/Visit.vue'

export default {
    props: ['editable_', 'obg_data_','from_migration'],

    components: {
        Visit
    },

    data() {
        return {
            tbl_search: '',
            tbl_headers: [
                { text: 'Date', value: 'obg_date_created', width: '100px', sortable: false },
                { text: 'Gravidity', value: 'obg_gravidity', width: '100px', sortable: false },
                { text: 'Parity', value: 'obg_parity', width: '100px', sortable: false },
                { text: 'Term Birth', value: 'obg_term', width: '100px', sortable: false },
                { text: 'Premature', value: 'obg_preterm', width: '100px', sortable: false },
                { text: 'Abortion', value: 'obg_abortions', width: '100px', sortable: false },
                { text: 'Living Children', value: 'obg_living', width: '100px', sortable: false }
            ],
            tbl_items: [
                {
                    obg_date_created: this.obg_data_.obg_date_created,
                    obg_gravidity: this.obg_data_.obg_gravidity,
                    obg_parity: this.obg_data_.obg_parity,
                    obg_term: this.obg_data_.obg_term,
                    obg_preterm: this.obg_data_.obg_preterm,
                    obg_abortions: this.obg_data_.obg_abortions,
                    obg_living: this.obg_data_.obg_living
                }
            ]
        }
    },
    
    methods: {
        mutationStatus() {
            this.$emit('mutationStatus')
            
        }
    }
}
</script>