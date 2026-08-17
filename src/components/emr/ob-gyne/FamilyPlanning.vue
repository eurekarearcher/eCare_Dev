<template>
    <v-card class="pa-7" outlined>
        <label class="font-weight-medium body-1">Family Planning</label>

        <v-row dense>
            <v-col cols="12" md="6" lg="6">
                <v-form>
                    <v-row class="mt-6" align="baseline" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Contraceptive</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="obg_data_.family_planning[0].contraceptive" :items="contraceptive_items" @blur="mutationStatus" class="body-2" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <label class="body-2">Method</label>
                        </v-col>

                        <v-col cols="12" lg="auto">
                            <v-autocomplete v-model="obg_data_.family_planning[0].method" :items="method_items" :loading="method_loading" @blur="mutationStatus" class="body-2" item-text="method_data" hide-details clearable outlined dense></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row class="mt-6" align="center" dense>
                        <v-col cols="12" lg="auto">
                            <label class="body-2">Unmet</label>
                        </v-col>

                        <v-col class="d-flex" cols="12" lg="auto">
                            <v-radio-group v-model="obg_data_.family_planning[0].is_unmeet" @change="mutationStatus"  class="ma-0" hide-details row>
                                <v-radio label="Yes" value="1"></v-radio>
                                <v-radio label="No" value="0"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
export default {
    props: ['obg_data_','from_migration'],

    data() {
        return {
            contraceptive_items: ['NEW ACCEPTER', 'OTHER ACCEPTER', 'CURRENT USER', 'DROP OUT'],
            method_loading: true,
            method_items: []
        }
    },

    created() {
        this.getMethod();

        if(this.$router.history.current.path === '/admission/obgyne-history') {
            this.obg_data_.family_planning = [{
                no_of_visit: 0,
                contraceptive: '',
                method: '',
                is_unmeet: ''
            }]
        } else {
            this.obg_data_.family_planning = [{
                no_of_visit: 0,
                contraceptive: this.obg_data_.family_planning.length !== 0? this.obg_data_.family_planning[0].contraceptive : '',
                method: this.obg_data_.family_planning.length !== 0? this.obg_data_.family_planning[0].method : '',
                is_unmeet: this.obg_data_.family_planning.length !== 0? this.obg_data_.family_planning[0].is_unmeet : ''
            }]
        }
    },

    methods: {
        async getMethod() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'contraceptive_method'
            })

            if (response.status === 200) {
                //response.data = this.responseDataDecryption(response.data)
                this.method_items = response.data
                this.method_loading = false
            } else {
                this.alert = response.error
            }
        },

        // clear1stVisit() {
        //     this.postpartum_[0].lmp = ''
        //     this.postpartum_[0].pmp = ''
        //     this.postpartum_[0].contraceptive = ''
        //     this.postpartum_[0].method = ''
        //     this.postpartum_[0].is_unmeet = ''
        //     this.postpartum_[1].no_of_visit = ''
        //     this.clear2ndVisit();
        // },

        // clear2ndVisit() {
        //     this.postpartum_[1].lmp = ''
        //     this.postpartum_[1].pmp = ''
        //     this.postpartum_[1].contraceptive = ''
        //     this.postpartum_[1].method = ''
        //     this.postpartum_[1].is_unmeet = ''
        // },

        mutationStatus() {
            this.$emit('mutationStatus')
        }
    }
}
</script>