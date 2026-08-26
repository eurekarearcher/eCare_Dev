<template>
    <div>
        <v-card class="pa-7" outlined>
            <h3>Dietary Information</h3>

            <v-row class="mt-4" align="end" dense>
                <v-col cols="12" md="8" lg="8">
                    <span class="font-weight-medium d-block body-2">High Fat / High Salt Food Intake</span>
                    <span class="body-2 pl-2">Eat processed food/fast food(e.g. Instant noodles, hamburgers, fries, fried chicken skin, etc.) ihaw-ihaw (e.g. isaw, adidas, etc.) weekly</span>
                </v-col>
                <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                    <v-radio-group v-model="dietary_information.high_fat_salt_intake" @change="emitData" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="editable && dietary_information.high_fat_salt_intake" @click="dietary_information.high_fat_salt_intake = '', emitData()" class="align-self-center" x-small>Clear</v-btn>
                </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-row align="end" dense>
                <v-col cols="12" md="8" lg="8">
                    <span class="font-weight-medium d-block body-2">Dietary Fiber Intake</span>
                    <span class="body-2 pl-2">2-3 serving of fruits daily</span>
                </v-col>
                <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                    <v-radio-group v-model="dietary_information.fiber_intake_fruit" @change="emitData" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="editable && dietary_information.fiber_intake_fruit" @click="dietary_information.fiber_intake_fruit = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                </v-col>
            </v-row>

            <v-row align="end" dense>
                <v-col cols="12" md="8" lg="8">
                    <span class="body-2 pl-2">3 serving of vegetables daily</span>
                </v-col>
                <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                    <v-radio-group v-model="dietary_information.fiber_intake_vegetable" @change="emitData" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="editable && dietary_information.fiber_intake_vegetable" @click="dietary_information.fiber_intake_vegetable = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-row align="end" dense>
                <v-col cols="12" md="8" lg="8">
                    <span class="font-weight-medium d-block body-2">Physical Activity</span>
                    <span class="body-2 pl-2">Does at least 2 1/2 hours a week of moderate intensity physical activity</span>
                </v-col>
                <v-col class="d-flex align-self-center" cols="12" md="4" lg="4">
                    <v-radio-group v-model="dietary_information.physical_activity" @change="emitData" class="ma-0" hide-details row>
                        <v-radio label="Yes" value="1"></v-radio>
                        <v-radio label="No" value="0"></v-radio>
                    </v-radio-group>

                    <v-btn v-if="editable && dietary_information.physical_activity" @click="dietary_information.physical_activity = '', emitData()"  class="align-self-center" x-small>Clear</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ['editable', 'dietary_information'],

    methods: {
        emitData() {
            this.$emit('mutationStatus', 'diet')
        }
    }
}
</script>