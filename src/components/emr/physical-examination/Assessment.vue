<template>
    <div class="mt-4" outlined> 
        <v-row> 
            <v-col cols="12" sm="12" md="12" lg="12" xl="12" class="pa-1"> 
                <v-checkbox v-model="assessment_en" @change="getAssessment" label="All physical evaluations of the patient indicate normal results without any significant findings." hide-details dense> </v-checkbox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1"> 
                <v-combobox v-model="assessment.chest.assessment" :items="chest" @change="validateAssessment($event, 'chest')" class="mt-2" item-text="assessment" onkeydown="return false;" label="CHEST & LUNGS" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.cvs.assessment" :items="cvs" @change="validateAssessment($event, 'cvs')" class="mt-2" item-text="assessment" onkeydown="return false;" label="CVS" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.abdomen.assessment" :items="abdomen" @change="validateAssessment($event, 'abdomen')" class="mt-2" item-text="assessment" onkeydown="return false;" label="ABDOMEN" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.gui.assessment" :items="gui" @change="validateAssessment($event, 'gui')" class="mt-2" item-text="assessment" onkeydown="return false;" label="GENITOURINARY TRACT" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.pelvic.assessment" :items="pelvic" @change="validateAssessment($event, 'pelvic')" class="mt-2" item-text="assessment" onkeydown="return false;" label="PELVIC EXAMINATION" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.rectal.assessment" :items="rectal" @change="validateAssessment($event, 'rectal')" class="mt-2" item-text="assessment" onkeydown="return false;" label="DIGITAL RECTAL EXAM" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.musculoskeletal.assessment" :items="musculoskeletal" @change="validateAssessment($event, 'musculoskeletal')" class="mt-2" item-text="assessment" onkeydown="return false;" label="MUSCULOSKELETAL EXAM" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.skin.assessment" :items="skin" @change="validateAssessment($event, 'skin')" class="mt-2" item-text="assessment" onkeydown="return false;" label="SKIN" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.neuro.assessment" :items="neuro" @change="validateAssessment($event, 'neuro')" class="mt-2" item-text="assessment" onkeydown="return false;" label="NEUROLOGIC EXAMINATION" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
             <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pa-1">    
                <v-combobox v-model="assessment.heent.assessment" :items="heent" @change="validateAssessment($event, 'heent')" class="mt-2" item-text="assessment" onkeydown="return false;" label="HEENT" deletable-chips hide-no-data hide-selected hide-details multiple filled chips></v-combobox>
            </v-col>
        </v-row>
        
        <!-- DIALOG FOR OTHER ASSESSMENT -->
        <v-dialog v-if="other_assessment.dialog" v-model="other_assessment.dialog" width="400" persistent>
            <v-card class="pa-5">
                <h6 class="font-weight-medium body-2">Current: {{ assessment[other_assessment.category].others_notes ? assessment[other_assessment.category].others_notes.substring(8) : '' }}</h6>
                
                <v-divider class="my-2"></v-divider>

                <h6 class="font-weight-regular body-2">Others</h6>
                <v-text-field v-model="other_assessment.new_val" @input="other_assessment.new_val = textCapitalize($event)" placeholder="Enter the assessment here" hide-details outlined></v-text-field>

                <v-layout justify-end wrap mt-4>
                    <v-btn @click="insertOtherAssessment('close', other_assessment.category)" small> CLOSE </v-btn>
                    <v-btn @click="insertOtherAssessment('confirm', other_assessment.category)" :disabled="!other_assessment.new_val" class="ml-2" color="primary" small> CONFIRM </v-btn>
                </v-layout>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: ['heent', 'chest', 'cvs', 'abdomen', 'gui', 'pelvic', 'rectal', 'musculoskeletal', 'skin', 'neuro', 'assessment', 'other_assessment', 'eligible_data', 'assessment_en'],
    data(){
        return{
            assessment_en_ : this.assessment_en,
        }
    },

    watch: {
        assessment_en(val) {
            this.assessment_en_ = val;
        },
        assessment_en_: function (newVal) {
            this.$emit('update:assessment_en', newVal);
        }
    },

    methods: {
        filterAssessmentStatus() {
            this.$emit('filterAssessmentStatus');
        },

        validateAssessment(data, category) {
            this.$emit('validateAssessment', data, category);
        },

        getAssessment() {
            for (let element in this.assessment) {
                if (this.assessment_en) {
                    this.assessment[element].assessment = [];
                    this.assessment[element].assessment.push(this[element][0]);
                    this.emitData();
                } else {
                    this.assessment[element].assessment = [];
                }
            }
        },

        insertOtherAssessment(status, category) {
            this.$emit('insertOtherAssessment', {status, category, value: this.other_assessment.new_val});

            this.other_assessment.dialog = false;
            this.other_assessment.new_val = '';
        },

        emitData() {
            this.$emit('mutationStatus');
        }
    }
}
</script>