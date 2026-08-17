<template>
    <v-card class="pa-7" outlined>
        <v-row>
            <v-col cols="12" lg="6">
                <Information :editable_="editable_" :prenatal_="obg_data_.prenatal" :lmp_="obg_data_.lmp" :edb_="obg_data_.edb" :aog_="obg_data_.aog" :from_migration="from_migration" @mutationStatus="mutationStatus" />
            </v-col>

            <v-col cols="12" lg="6">
                <Screening :editable_="editable_" :obg_data_="obg_data_" :from_migration="from_migration" @mutationStatus="mutationStatus" ref="screening" />
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import Information from '@/components/emr/ob-gyne/prenatal/Information.vue'
import Screening from '@/components/emr/ob-gyne/prenatal/Screening.vue'

export default {
    props: ['editable_', 'obg_data_', 'change_status_', 'required_ob', 'required_fields','from_migration'],

    components: {
        Information,
        Screening
    },

    methods: {
        refreshScreening() {
            this.$refs.screening.clearScreeningData();
        },

        mutationStatus() {
            this.change_status_.screening = true
            this.$emit('mutationStatus')
        }
    }
}
</script>