<template>
    <div class="pa-4">
        <v-row no-gutters>
            <v-col cols="12" sm="3" md="3" lg="3">
                <div class="body-2">
                <span class="text-body-2 font-weight-medium">CPT CODE</span><br />
                <span class="text-body-2">{{ diagnostic_exam.cpt_code }}</span>
                </div>
            </v-col>

            <v-col cols="12" sm="7" md="7" lg="7">
                <div class="body-2">
                <span class="text-body-2 font-weight-medium">DESCRIPTION</span><br />
                <span class="text-body-2">{{ diagnostic_exam.cpt_desc }}</span>
                </div>
            </v-col>

            <v-col cols="12" sm="2" md="2" lg="2">
                <div class="body-2">
                <span class="text-body-2 font-weight-medium">STATUS</span><br />
                <span class="text-body-2">{{ diagnostic_exam.pStatus.toUpperCase() }}</span>
                </div>
            </v-col>
        </v-row>

        <v-row v-if="show_conversion" class="mt-2">
            <v-col cols="12" sm="12" md="12" lg="12">
                <RadioButton v-model="conversion_unit" @input="$emit('input', $event)"/>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import RadioButton from '@/components/emr/diagnostic-exam-result/RadioButton';

export default {
    props: ['diagnostic_exam', 'emr_page', 'value'],
    components: { RadioButton },
    computed: {
        show_conversion () {
            const allowed = ['ORAL GLUCOSE TOLERANCE TEST','COMPLETE BLOOD COUNT','RANDOM BLOOD SUGAR','FASTING BLOOD SUGAR']
            return allowed.includes(this.diagnostic_exam.libDesc)
        },

        conversion_unit: {
            get () {
                return this.value
            },
            set (val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>