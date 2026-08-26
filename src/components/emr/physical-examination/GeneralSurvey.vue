<template>
    <div class="mt-4" outlined>
        <v-tabs v-model="tab" class="card-border px-1" active-class="active-tab" hide-slider outlined>
            <v-tab class="non-active-tab">General Survey</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="px-1 mb-7" ref="tabs" touchless>
            <v-expansion-panels v-model="panel" multiple class="pb-1">
                <v-expansion-panel class="tabs-border">
                    <v-tab-item>
                        <v-expansion-panel-content class="mt-5">
                            <v-row class="pl-4" dense>
                                <v-col v-for="(value, index) in general_survey_items" :key="index" cols="12" sm="6" md="6" lg="6">
                                    <!-- <v-checkbox v-model="local_general_survey" class="ma-0 checkbox_label" :label="value" :value="value" hide-details></v-checkbox> -->
                                    <v-checkbox 
                                        v-model="general_survey_" 
                                        @change="$emit('update:general_survey', general_survey_)" 
                                        class="ma-0 checkbox_label" 
                                        :label="value" 
                                        :value="value" 
                                        hide-details
                                    ></v-checkbox>
                                </v-col>

                                <v-col class="align-baseline d-flex" cols="12">
                                    <v-label class="grey--text text--darken-4">Others: </v-label>
                                    <v-text-field 
                                        v-model="other_general_survey_" 
                                        @input="$emit('update:other_general_survey', other_general_survey_)" 
                                        class="body-2 pl-4" 
                                        hide-details 
                                        dense
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-tab-item>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
    props: ['general_survey', 'other_general_survey', 'general_survey_items'],

    data() {
        return {
            tab: '',
            panel: [0],
            general_survey_: this.general_survey,
            other_general_survey_: this.other_general_survey
        };
    },

    watch: {
        general_survey(newVal) {
            this.general_survey_ = newVal;
        },
        other_general_survey(newVal) {
            this.other_general_survey_ = newVal;
        }
    }
};
</script>

<style scoped>
::v-deep .v-tabs-bar {
    border-radius: inherit !important;
    height: 40px !important;
}
::v-deep .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right) > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev {
    display:none;
    visibility: hidden;
}
::v-deep .expand-icon .v-expansion-panel-header__icon .v-icon {
  font-size:20pt;
  color: #1976D2 !important
}
.non-active-tab{
    background-color: #eeeeee !important;
    border-color: #eeeeee !important;
    border-top-left-radius:5px; 
    border-top-right-radius:15px;
    margin-right:0.25em;
}
.active-tab{
    background-color: #1976D2 !important;
    border-color: #1976D2 !important;
    color:white !important;
    border-top-left-radius:5px; 
    border-top-right-radius:100px;
    margin-right:0.25em;
}
::v-deep.checkbox_label label {
    color: #2c2c2c !important;
}
</style>