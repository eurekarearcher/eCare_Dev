<template>
    <div>
        <v-form :readonly="!trans_detail.editable">
            <!-- CERTIFICATION OF CONSUMPTION OF BENEFITS -->
            <v-row wrap>
                <v-col cols="6" sm="6" md="6" lg="6">
                    <h1 class="section-title">
                        CERTIFICATION OF CONSUMPTION OF BENEFITS
                        <v-btn v-if="trans_detail.editable && !!ctf_data.phic_ben_is_enough" @click="ctf_data.phic_ben_is_enough = null, checkDataStatus('certification')" class="ml-2" width="60" height="25" small>Clear</v-btn>
                    </h1>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" class="text-right">
                    <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part3_lettera" @click="displayCommentData('consumption')" color="primary" tile depressed small>CHECK COMMENTS 
                        <v-badge content="!" color="red">
                            <v-icon class="pl-1" small>mdi-comment</v-icon>
                        </v-badge>
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- <h2 class="my-3 pb-2 title" style="border-bottom: 1px solid black">Total amount of Procedure/s: {{ cert_data.total_cpt_amount }}</h2> -->
            <!-- PHILHEALTH BENEFIT IS ENOUGH --> 
            <v-radio-group v-model="ctf_data.phic_ben_is_enough" @change="checkDataStatus('certification')" class="mt-2">
                <v-radio value="1" label="Philhealth benefit is enough to cover HCI and PF charges. No Purchase of drugs/medicines, supplies, diagnostics and co-pay for professional fees by the member/patient"></v-radio>
            </v-radio-group>
        
            <v-row :class="{'opacity' : ctf_data.phic_ben_is_enough !== '1'}" wrap>
                <v-col cols="1" sm="1" md="2" lg="2"></v-col>
                <v-col cols="11" sm="8" md="8" lg="7">
                    <v-row align="baseline" wrap>
                        <v-col cols="7" sm="7" md="5" lg="4"></v-col>
                        <v-col cols="5" sm="5" md="5" lg="6" class="text-center">
                            <label class="body-2">Total Actual Charges*</label>
                        </v-col>
                        <v-col cols="7" sm="7" md="5" lg="4">
                            <label class="body-2">Total Health Institution Fees:</label>
                        </v-col>
                        <v-col cols="5" sm="5" md="5" lg="6" class="text-center">
                            <label class="body-2">{{ this.checkFormat(ctf_data.total_health_inst_fees) }}</label>
                        </v-col> 
                        <v-col cols="7" sm="7" md="5" lg="4">
                            <label class="body-2">Total Professional Fees:</label>
                        </v-col>
                        <v-col cols="5" sm="5" md="5" lg="6" class="text-center">
                            <label class="body-2">{{ this.checkFormat(ctf_data.total_professional_fees) }}</label>
                        </v-col>
                        <v-col cols="7" sm="7" md="5" lg="4">
                            <label class="body-2">Grand Total:</label>
                        </v-col>
                        <v-col cols="5" sm="5" md="5" lg="6" class="text-center">
                            <label class="body-2">{{ this.checkFormat(ctf_data.grand_total) }}</label>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            
            <!-- PHILHEALTH BENEFIT IS CONSUMED --> 
            <v-radio-group v-model="ctf_data.phic_ben_is_enough" @change="checkDataStatus('certification')">
                <v-radio value="2" label="The benefit of the member/patient was completely consumed prior to co-pay OR the benefit of the member/patient is not completely consumed BUT with purchases/expenses for drugs/medicines, supplies, diagnostics and others"></v-radio>
            </v-radio-group>

            <div :class="{'opacity' : ctf_data.phic_ben_is_enough !== '2'}">
                <div class="d-flex justify-space-between align-center pb-4">
                    <h4 class="ma-0">a.) The total co-pay for the following are:</h4>
                    <v-switch v-model="switch_all" :label="switch_all ? 'None' : 'Show All'" @change="toggleAll" :disabled="ctf_data.phic_ben_is_enough !== '2'"/>
                </div>

                <!--Summary of Fees-->
                <v-row class="ma-0 pa-0">
                    <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class=" ma-0 pa-0">
                        <v-container class="pa-0 ma-0" dense style="z-index: 0;">
                            <h4 class="text-center ma-0 pa-0">Summary of Fees</h4>
                            <v-expansion-panels class="pa-0 ma-0" v-model="panel" multiple :disabled="ctf_data.phic_ben_is_enough !== '2'">
                                <v-expansion-panel v-for="(particular, i) in fee_particulars" :key="i">
                                    <v-expansion-panel-header class="font-weight-bold">
                                    {{ particular }}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                    <v-row class="text-left font-weight-bold" justify="space-around" dense>
                                        <v-col cols="4"><label class="body-2">Amount</label></v-col>
                                        <v-col cols="4"><label class="body-2">Mandatory Discount</label></v-col>
                                        <v-col cols="4"><label class="body-2">PhilHealth</label></v-col>
                                    </v-row>

                                    <v-row class="text-left" justify="space-around" dense v-if="getSummaryItem(particular)" >
                                        <v-col cols="4">
                                            <v-text-field v-model="getSummaryItem(particular).amount_input" 
                                            :disabled="particular !== 'Room and Board' && particular !== 'Operating Room'"
                                            @input="onAmountInput(getSummaryItem(particular))" @blur="onBlurSF(getSummaryItem(particular), 'amount')" 
                                            min="0"  @keypress="numberOnly" @paste.prevent="handlePaste" dense />
                                        </v-col>

                                        <v-col cols="4">
                                            <v-text-field :value="formatField(getSummaryItem(particular).mandatory_discount_input)" @focus="removeFormat(getSummaryItem(particular), 'mandatory_discount')" @input="updateField($event, getSummaryItem(particular), 'mandatory_discount')" @blur="onBlurSF(getSummaryItem(particular), 'mandatory_discount')" @keypress="numberOnly" @paste.prevent="handlePaste" :disabled="!getSummaryItem(particular).amount || getSummaryItem(particular).amount == 0" readonly dense />
                                        </v-col>

                                        <v-col cols="4">
                                            <v-text-field :value="formatField(getSummaryItem(particular).philhealth_input)" @focus="removeFormat(getSummaryItem(particular), 'philhealth')" @input="updateField($event, getSummaryItem(particular), 'philhealth')" @blur="onBlurSF(getSummaryItem(particular), 'philhealth')" @keypress="numberOnly" @paste.prevent="handlePaste" disabled dense />
                                        </v-col>

                                        <v-col cols="7">
                                            <label class="body-2">Other Funding Sources</label>
                                        </v-col>

                                        <v-col cols="1">
                                            <v-btn color="primary" x-small  class="mt-2" @click="addOtherSource(particular)" >
                                                Add Others
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="4"><label class="body-2">Balance</label></v-col>

                                        <v-col cols="8">
                                                <v-row v-for="(source, index) in getSummaryItem(particular).other_sources_list" :key="index" dense>
                                                    <v-col cols="6">
                                                        <v-autocomplete v-model="source.other_desc" :items="filteredOtherSources(getSummaryItem(particular).fee_particulars)" @change="onSelectOtherSource(particular, index, source.other_desc)"  label="Other Source" dense />
                                                    </v-col>

                                                    <v-col cols="5">
                                                        <v-text-field v-model.number="source.other_amount" label="Amount" @keypress="numberOnly" @paste.prevent="handlePaste" @input="calculateSummaryBalance(getSummaryItem(particular))" :disabled="!source.other_desc" dense />
                                                    </v-col>

                                                    <v-col cols="1" class="d-flex align-center">
                                                        <v-btn icon @click="removeOtherSource(particular, index)">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                        </v-col>

                                        <v-col cols="4">
                                            <v-text-field :value="getSummaryItem(particular).balance" dense readonly />
                                        </v-col>
                                    </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel>
                                    <v-expansion-panel-header class="font-weight-bold">
                                        TOTAL AMOUNT
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content> 
                                        <v-row class="text-left font-weight-bold" justify="space-around" dense>
                                            <v-col cols="2"><label class="body-2">AMOUNT</label></v-col>
                                            <v-col cols="2"><label class="body-2">MANDATORY DISCOUNT</label></v-col>
                                            <v-col cols="2"><label class="body-2">PHILHEALTH</label></v-col>
                                            <v-col cols="2"><label class="body-2">OTHER FUNDING SOURCES</label></v-col>
                                            <v-col cols="2"><label class="body-2">BALANCE</label></v-col>
                                        </v-row>
                                        <v-row class="text-center" justify="space-around" dense>
                                            <v-col cols="2">
                                                <v-text-field :value="total_summary_of_fees_input_based.amount" readonly dense />
                                            </v-col>

                                            <v-col cols="2">
                                                <v-text-field v-model="total_summary_of_fees_data.mandatory_discount_input" :disabled="ctf_data.phic_ben_is_enough !== '2'" @blur="onTotalBlur('mandatory_discount')" @keypress="numberOnly" @paste.prevent="handlePaste" readonly dense />
                                            </v-col>

                                            <v-col cols="2">
                                                <v-text-field v-model="total_summary_of_fees_data.philhealth_input" :disabled="ctf_data.phic_ben_is_enough !== '2'" @blur="onTotalBlur('philhealth')" @keypress="numberOnly" @paste.prevent="handlePaste" readonly dense />
                                            </v-col>

                                            <v-col cols="2"> 
                                                <v-text-field v-model="total_summary_of_fees_input_based.other_sources" :disabled="ctf_data.phic_ben_is_enough !== '2'" @blur="onTotalBlur('other_sources')" @keypress="numberOnly" @paste.prevent="handlePaste" readonly dense />
                                            </v-col>

                                            <v-col cols="2">
                                                <v-text-field :value="total_summary_of_fees_input_based.balance.toFixed(2)" readonly dense />
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-container>
                    </v-col>
                </v-row>

                <!--Professional Fees-->
                <v-divider class="mt-5 mb-6"></v-divider> 
                <v-row class="text-center mb-4" justify="space-around" dense>   
                    <v-row class="ma-0 pa-0">
                        <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class="ma-0 pa-0">
                            
                            <v-expansion-panels class="pa-0 ma-0" v-model="pf_panel" multiple :disabled="ctf_data.phic_ben_is_enough !== '2'">
                                <v-expansion-panel v-for="(item, i) in professional_fees" :key="i">
                                    <v-expansion-panel-header class="font-weight-bold">
                                    PROFESSIONAL FEE
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                    <v-row class="text-left font-weight-bold" justify="space-around" dense>
                                        <v-col cols="2"><label class="body-2">Physician Accreditaion Number</label></v-col>
                                        <v-col cols="2"><label class="body-2">Physician Name</label></v-col>
                                        <v-col cols="2"><label class="body-2">Amount</label></v-col>
                                        <v-col cols="2"><label class="body-2">Mandatory Discount</label></v-col>
                                        <v-col cols="2"><label class="body-2">PhilHealth</label></v-col>
                                    </v-row>

                                    <v-row class="text-left" justify="space-around" dense>
                                        <v-col cols="2">
                                            <v-text-field v-model="item.physician_accre_no"  @input="item.physician_accre_no = textCapitalize($event)" :disabled="ctf_data.phic_ben_is_enough !== '2'" />
                                        </v-col>

                                        <v-col cols="2">
                                            <v-text-field v-model="item.physician_name" @input="item.physician_name = textCapitalize($event)" :disabled="ctf_data.phic_ben_is_enough !== '2'" />
                                        </v-col>

                                        <v-col cols="2">
                                            <v-text-field v-model="item.amount_input" @blur="onBlurPF(item, 'amount')" @keypress="numberOnly" @paste.prevent="handlePaste" :disabled="ctf_data.phic_ben_is_enough !== '2'"/>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-text-field v-model="item.discount_input" @blur="onBlurPF(item, 'discount')" @keypress="numberOnly" @paste.prevent="handlePaste" :disabled="ctf_data.phic_ben_is_enough !== '2'"/>
                                        </v-col>

                                        <v-col cols="2">
                                            <v-text-field v-model.number="item.philhealth_input" @blur="onBlurPF(item, 'philhealth')"  @keypress="numberOnly" @paste.prevent="handlePaste" class="pl-1" />
                                        </v-col>

                                        <v-col cols="7"  class="pl-7">
                                            <label class="body-2">Other Funding Sources</label>
                                        </v-col>

                                        <v-col cols="1">
                                            <v-btn color="primary" x-small  class="mt-2" @click="addOtherSourcePf(item)" >
                                                Add Others
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="4"><label class="body-2">Balance</label></v-col>

                                        <v-col cols="8" class="pl-7">
                                                <v-row v-for="(source, index) in item.other_sources_list" :key="index" dense>
                                                    <v-col cols="6">
                                                        <v-autocomplete v-model="source.other_desc" :items="filteredOtherSources(item.fee_particulars)" label="Other Source" dense />
                                                    </v-col>

                                                    <v-col cols="5">
                                                        <v-text-field v-model="source.other_amount" label="Amount" @keypress="numberOnly" @paste.prevent="handlePaste" @input="calculateProfessionalBalance(item)" :disabled="!source.other_desc" dense />
                                                    </v-col>

                                                    <v-col cols="1" class="d-flex align-center">
                                                        <v-btn icon @click="removeOtherSourcePf(item, index)">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                        </v-col>

                                        <v-col cols="4" class="pr-7">
                                            <v-text-field :value="item.balance" dense readonly />
                                        </v-col>
                                    </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                                <v-expansion-panel>
                                    <v-expansion-panel-header class="font-weight-bold">
                                        TOTAL AMOUNT
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content> 
                                        <v-row class="text-left pl-7" justify="space-around" dense>
                                            <v-col cols="8">
                                                <label class="body-2">TOTAL</label>
                                            </v-col>

                                            <v-col cols="4"> 
                                                <v-text-field :value="total_professional_fees_data" readonly dense></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                            <!--<v-row class="ma-0 pa-0 hide-print">
                                <v-col cols="12" class="text-right  ma-0 pa-1">
                                    <v-btn color="primary" disabled x-small class=" ma-0 justify-end hide-print" @click="addProfessionalRow">Add Professional Fee</v-btn>
                                    <v-btn x-small class=" ma-0 ml-5 justify-end hide-print" @click="clearAllProfessionalFees">Clear</v-btn>
                                </v-col>
                            </v-row>-->
                            
                        </v-col>
                        <v-row class="hide-print">
                            <v-col cols="12">
                                <v-row class="text-right pt-2 small-checkbox-group align-self-end" justify="end" align="center">
                                    <v-col cols="auto">
                                        <h5 class="ma-0 font-weight-medium">Apply Mandatory Discount</h5>
                                    </v-col>
                                    <v-col cols="auto"> 
                                        <v-radio-group v-model="sf_discount_type" row dense :disabled="ctf_data.phic_ben_is_enough !== '2'">
                                            <v-radio label="Senior" value="SENIOR CITIZEN" />
                                            <v-radio label="PWD" value="PWD" />
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-row>
            </div>

            <!-- Receipt Data -->
            <v-divider class="mt-5 mb-6"></v-divider> 
            <v-row class="text-center" justify="space-around" dense>   
                <v-row class="ma-0 pa-0">
                    <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12" class="ma-0 pa-0">
                            <v-card class="elevation-3">
                                <h1 class="section-title text-left py-6 pl-6 ">RECEIPT DATA ( DRUGS/MEDICINE AND MEDICAL SUPPLIES)</h1>
                                <v-row class="text-left font-weight-bold px-6" justify="space-around" dense>
                                    <v-col cols="6"><label class="body-2">Company Name</label></v-col>
                                    <v-col cols="3"><label class="body-2">Company TIN</label></v-col>
                                    <v-col cols="3"><label class="body-2">BIR Permit Number </label></v-col>
                                </v-row>

                                <v-row class="text-left px-6" justify="space-around" dense>
                                    <v-col cols="6">
                                        <v-text-field v-model="ctf_data.receipt_data.company_name" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.company_name" />
                                    </v-col>
                                    <v-col cols="3">
                                        <v-text-field v-model="ctf_data.receipt_data.company_tin" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.company_tin" maxlength="15"/>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-text-field v-model="ctf_data.receipt_data.bir_permit_no" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.bir_permit_no"/>
                                    </v-col>
                                </v-row>

                                <v-row class="text-left font-weight-bold px-6" justify="space-around" dense>
                                    <v-col cols="3"><label class="body-2">Receipt Number</label></v-col>
                                    <v-col cols="3"><label class="body-2">Receipt Date</label></v-col>
                                    <v-col cols="2"><label class="body-2">VAT Exempt Sale	</label></v-col>
                                    <v-col cols="2"><label class="body-2">VAT</label></v-col>
                                    <v-col cols="2"><label class="body-2">TOTAL</label></v-col>
                                </v-row>

                                <v-row class="text-left px-6" justify="space-around" dense>
                                    <v-col cols="3">
                                        <v-text-field v-model="ctf_data.receipt_data.receipt_no" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.receipt_no"/>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-text-field type="date" v-model="ctf_data.receipt_data.receipt_date" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.receipt_date"/>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field v-model="ctf_data.receipt_data.vat" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.vat" type="number"/>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field v-model="ctf_data.receipt_data.vat_exempt_sale" @click="checkDataStatus('receipt_data')" :error="!ctf_data.receipt_data.vat_exempt_sale" type="number"/>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-text-field v-model="ctf_data.receipt_data.total" type="number" readonly />
                                    </v-col>
                                </v-row>
                            </v-card>
                    </v-col>
                </v-row>
            </v-row>
            <v-divider class="mt-5 mb-10"></v-divider> 
            <!-- End Receipt Data -->
            
            <!-- <v-radio-group v-model="ctf_data.phic_ben_is_enough" @change="checkDataStatus('certification')">
                <v-radio value="2" label="The benefit of the member/patient was completely consumed prior to co-pay OR the benefit of the member/patient is not completely consumed BUT with purchases/expenses for drugs/medicines, supplies, diagnostics and others"></v-radio>
            </v-radio-group>
            
            <div :class="{'opacity' : ctf_data.phic_ben_is_enough !== '2'}">
                <h5>a.) The total co-pay for the following are:</h5>

                <v-row class="text-center" justify="space-around" dense>
                    <v-col class="d-flex text-left" cols="12" sm="12" md="2" lg="2">
                        <label class="body-2 align-self-end pb-7">Total Health Institution Fees:</label>
                    </v-col>

                    <v-col class="d-flex flex-column" cols="6" sm="5" md="2" lg="2">
                        <label class="body-2">Total Actual Charges*</label>
                        <v-text-field v-model="ctf_data.co_hcf_total_actual_charges" v-on:keypress="numberOnly($event, ctf_data.co_hcf_total_actual_charges)" v-on:keyup="autoCompute('hif')" :readonly="this.ctf_data.phic_ben_is_enough !== '2'" @blur="addDecimal('hif_charges', ctf_data.co_hcf_total_actual_charges)" @input="ctf_data.co_hcf_amt_after_dsct = '0.00'" onpaste="return false" class="body-2 align-end">
                            <template v-slot:append>
                                <v-tooltip v-if="total_actual_charges_tooltip && ctf_data.co_hcf_total_actual_charges.charAt(0) !== '0'" bottom>
                                    <template #activator="{ on }">
                                        <v-icon v-on="on" class="mr-1" color="red" size="20">fas fa-exclamation-circle</v-icon>
                                    </template>
                                    {{ ctf_data.co_pf_total_actual_charges.charAt(0) === '0' ? 'Amount should not exceed the total amount of procedures' : 'Total HCI Fee and Professional fee should not exceed the total amount of procedure.' }}
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col class="d-flex flex-column justify-space-between" cols="6" sm="5" md="2" lg="2">
                        <label class="body-2">PhilHealth Benefit</label>
                        <label class="body-2 font-weight-medium pb-7">{{ ctf_data.co_hcf_phic_benefit }}</label>
                    </v-col>

                    <v-col cols="6" sm="5" md="2" lg="2">
                        <label class="body-2">Amount after application of discount (i.e. Personal Discount, Senior Citizen, PWD)</label>
                        <v-text-field v-model="ctf_data.co_hcf_amt_after_dsct"  v-on:keypress="numberOnly($event, ctf_data.co_hcf_amt_after_dsct)" v-on:keyup="autoCompute('hif')" :readonly="this.ctf_data.phic_ben_is_enough !== '2'" @blur="addDecimal('hif_discount', ctf_data.co_hcf_amt_after_dsct)" onpaste="return false" class="body-2"></v-text-field>
                    </v-col>

                    <v-col class="d-flex flex-column justify-space-between" cols="6" sm="5" md="4" lg="4">                
                        <label class="body-2">Amount after Philhealth Deduction</label>
                        <label class="body-2 font-weight-medium pb-7 text-left">Amount: {{ ctf_data.co_hcf_amt_after_phic_deduc }}</label>
                    </v-col>
                    <v-col offset-sm="7" offset-md="7" offset-lg="9" cols="12" sm="5" md="5" lg="3">
                        <label class="body-2">Paid by: (check all that applies):</label>
                        <v-checkbox v-model="selected_hif_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedHIF('Member/Patient', $event)" class="ma-0 pa-0" label="Member/Patient" value="Member/Patient" hide-details multiple dense></v-checkbox>
                        <v-checkbox v-model="selected_hif_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedHIF('HMO', $event)" class="ma-0 pa-0" label="HMO" value="HMO" hide-details multiple dense></v-checkbox>
                        <v-checkbox v-model="selected_hif_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedHIF('Other', $event)" class="ma-0 pa-0" label="Other (i.e PCSO, Promissory Note, etc.)" value="Other" hide-details multiple dense></v-checkbox>
                    </v-col>
                </v-row>

                <v-divider class="mt-5 mb-6"></v-divider> 
                <v-row class="text-center mb-4" justify="space-around" dense>
                    <v-col class="text-left" cols="12" sm="12" md="2" lg="2">
                        <label class="body-2">Total Professional Fees (For accredited and non-accredited professionals):</label>
                    </v-col>

                    <v-col class="d-flex flex-column" cols="6" sm="5" md="2" lg="2">
                        <label class="body-2 d-inline d-md-none">Total Actual Charges*</label>
                        <v-text-field v-model="ctf_data.co_pf_total_actual_charges" v-on:keypress="numberOnly($event, ctf_data.co_pf_total_actual_charges)" v-on:keyup="autoCompute('pf')" :readonly="ctf_data.phic_ben_is_enough !== '2'" @blur="addDecimal('pf_charges', ctf_data.co_pf_total_actual_charges)" @input="ctf_data.co_pf_amt_after_dsct = '0.00'" onpaste="return false" class="body-2">
                            <template v-slot:append>
                                <v-tooltip v-if="total_actual_charges_tooltip && ctf_data.co_pf_total_actual_charges.charAt(0) !== '0'" bottom>
                                    <template #activator="{ on }">
                                        <v-icon v-on="on" class="mr-1" color="red" size="20">fas fa-exclamation-circle</v-icon>
                                    </template>
                                    {{ ctf_data.co_hcf_total_actual_charges.charAt(0) === '0' ? 'Amount should not exceed the total amount of procedures' : 'Total HCI Fee and Professional fee should not exceed the total amount of procedure.' }}
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>

                    <v-col class="d-flex flex-column justify-space-between" cols="6" sm="5" md="2" lg="2">
                        <label class="body-2 d-inline d-md-none">PhilHealth Benefit</label>
                        <label class="body-2 font-weight-medium pb-7 pt-0 pt-md-6">{{ ctf_data.co_pf_phic_benefit }}</label>
                    </v-col>

                    <v-col cols="6" sm="5" md="2" lg="2">
                        <label class="body-2 d-inline d-md-none">Amount after application of discount (i.e. Personal Discount, Senior Citizen, PWD)</label>
                        <v-text-field v-model="ctf_data.co_pf_amt_after_dsct" v-on:keypress="numberOnly($event, ctf_data.co_pf_amt_after_dsct)" v-on:keyup="autoCompute('pf')" :readonly="ctf_data.phic_ben_is_enough !== '2'" @blur="addDecimal('pf_discount', ctf_data.co_pf_amt_after_dsct)"  onpaste="return false" class="body-2"></v-text-field>
                    </v-col>

                    <v-col class="d-flex flex-column justify-space-between" cols="6" sm="5" md="4" lg="4">                
                        <label class="body-2 d-inline d-md-none">Amount after Philhealth Deduction</label>
                        <label class="body-2 font-weight-medium pb-7 text-left pt-0 pt-md-6">Amount: {{ ctf_data.co_pf_amt_after_phic_deduc }}</label>
                    </v-col>
                    <v-col offset-sm="7" offset-md="7" offset-lg="9" cols="12" sm="5" md="5" lg="3">
                        <label class="body-2">Paid by: (check all that applies):</label>
                        <v-checkbox v-model="selected_pf_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedPF('Member/Patient', $event)" class="ma-0 pa-0" label="Member/Patient" value="Member/Patient" hide-details multiple dense></v-checkbox>
                        <v-checkbox v-model="selected_pf_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedPF('HMO', $event)" class="ma-0 pa-0" label="HMO" value="HMO" hide-details multiple dense></v-checkbox>
                        <v-checkbox v-model="selected_pf_paid_by" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="addSelectedPF('Other', $event)" class="ma-0 pa-0" label="Other (i.e PCSO, Promissory Note, etc.)" value="Other" hide-details multiple dense></v-checkbox>
                    </v-col>
                </v-row>
             
        
                <h5>b.) Purchase/Expenses NOT included in the Health Care Institution Charges</h5>
                <v-row wrap>
                    <v-col cols="5" sm="5" md="5" lg="5" class="pt-4 pr-4">
                        <label>Total cost of purchase/s for drugs/medicines and/or medical supplies bought by the patient/member within/outside the HCI during confinement.</label>
                    </v-col>
                    <v-col cols="7" sm="7" md="7" lg="7">
                        <v-row wrap>
                            <v-col cols="12" sm="3" md="3" lg="4">
                                <v-radio-group v-model="ctf_data.nco_total_cost_med_sup" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="checkDataStatus('certification'), total_purchase_amount = ''" dense>
                                    <v-radio value="None" label="None"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="4" sm="3" md="3" lg="3">
                                <v-radio-group v-model="total_purchase_amount" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="ctf_data.nco_total_cost_med_sup = ''" dense>
                                    <v-radio value="Total" label="Total Amount:"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="8" sm="6" md="6" lg="5">
                                <v-text-field v-if="total_purchase_amount === 'Total'" v-model="ctf_data.nco_total_cost_med_sup" v-on:keypress="numberOnly($event, ctf_data.nco_total_cost_med_sup)" v-on:keyup="autoCompute('purchase')" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="checkDataStatus('certification')" @blur="addDecimal('purchase', ctf_data.nco_total_cost_med_sup)" onpaste="return false" class="body-2"></v-text-field>
                                <v-text-field v-else class="body-2" readonly></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

                <v-row wrap mt-6>
                    <v-col cols="5" sm="5" md="5" lg="5" class="pt-4 pr-4">
                        <label>Total cost of diagnostic/laboratory examinations paid by the patient/member done within/outside the HCI during confinement.</label>
                    </v-col>
                    <v-col cols="7" sm="7" md="7" lg="7">
                        <v-row wrap>
                            <v-col cols="12" sm="3" md="3" lg="4">
                                <v-radio-group v-model="ctf_data.nco_total_cost_diagnostic_laboratory" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="checkDataStatus('certification'), total_diagnostic_amount = ''" dense>
                                    <v-radio value="None" label="None"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="4" sm="3" md="3" lg="3">
                                <v-radio-group v-model="total_diagnostic_amount" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="ctf_data.nco_total_cost_diagnostic_laboratory = ''" dense>
                                    <v-radio value="Total" label="Total Amount:"></v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="8" sm="6" md="6" lg="5">
                                <v-text-field v-if="total_diagnostic_amount === 'Total'" v-model="ctf_data.nco_total_cost_diagnostic_laboratory" v-on:keypress="numberOnly($event, ctf_data.nco_total_cost_diagnostic_laboratory)" v-on:keyup="autoCompute('diagnostic')" :readonly="ctf_data.phic_ben_is_enough !== '2'" @change="checkDataStatus('certification')" @blur="addDecimal('diagnostic', ctf_data.nco_total_cost_diagnostic_laboratory)" onpaste="return false" class="body-2"></v-text-field>
                                <v-text-field v-else class="body-2" readonly></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </div> -->
            
            <!-- CONSENT TO ACCESS PATIENT RECORD/S -->
            <v-row wrap>
                <h1 class="subtitle-1 grey--text text--darken-3 font-weight-medium">CONSENT TO ACCESS PATIENT RECORD</h1>
                <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part3_letterb" @click="displayCommentData('consent')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
                    <v-badge content="!" color="red">
                        <v-icon class="pl-1" small>mdi-comment</v-icon>
                    </v-badge>
                </v-btn>
            </v-row>
            <v-divider class="mt-3"></v-divider>
            <p class="font-italic body-2 mt-2">I hereby consent to the submission and examination of the patient's pertinent medical records for the purpose of verifying the veracity of this claim to effect efficient processing of benefit payment. I hereby hold Philhealth or any of its officers, employees and/or representatives free from any and all legal liabilities relative to the herein-mentioned consent which I have voluntarily and willingly given in connection with this claim for reimbursement before Philhealth.</p>
            
            <v-row justify="center" align="center">
                <v-col cols="12" md="6" class="text-center">
                    <div class="mb-4">
                        <img v-if="trans_detail.patient_sign_path" :src="trans_detail.patient_sign_path" alt="Signature" width="150" height="auto" />
                    </div>
                    <div class="mt-1 pt-1">
                        <strong>{{ this.patient_name }}</strong>
                    </div>
                    <div class="mt-1 pt-1">
                        <label class="body-2 border-top">Signature over Printed Name / Patient / Authorized Representative</label>
                    </div>
                </v-col>

                <v-col cols="12" md="4" class="text-center">
                    <v-spacer v-if="trans_detail.patient_sign_path" class="mt-10 pt-10"></v-spacer>
                    <v-spacer v-else></v-spacer>
                    <div class="mt-6 mb-2">
                        <strong>{{ signatures.patient }}</strong>
                    </div>
                    <div class="border-top mt-1 pt-1"></div>
                    
                    <label class="body-2">Date Signed</label>
                </v-col>
            </v-row>

            <v-row class="mt-3" wrap>
                <v-col cols="5" sm="5" md="5" lg="5" class="pt-4">
                    <label>
                        Relationship of the representative to the member/patient:
                        <v-btn v-show="trans_detail.editable" v-if="!!relation_reason.rel_to_patient || relationship" @click="relation_reason.rel_to_patient = '', relationship = '', checkDataStatus('other')" width="60" height="25" small>Clear</v-btn>
                    </label>
                </v-col>
                <v-col cols="12" sm="12" md="7" lg="7">
                        <v-radio-group v-model="relation_reason.rel_to_patient" @change="checkDataStatus('other'), relationship = ''" hide-details dense>
                            <v-row wrap>
                                <v-col cols="12" sm="3" md="3" lg="3" class="pb-2">
                                    <v-radio value="Spouse" label="Spouse"></v-radio>
                                </v-col>
                                <v-col cols="12" sm="3" md="3" lg="3" class="pb-2">
                                    <v-radio value="Sibling" label="Sibling"></v-radio>
                                </v-col>
                                <v-col cols="12" sm="2" md="2" lg="2" class="pb-2">
                                    <v-radio value="Child" label="Child"></v-radio>
                                </v-col>
                            </v-row>
                        </v-radio-group>
                        <v-row align="baseline" wrap>
                                <v-col cols="12" sm="3" md="3" lg="3" class="pt-sm-1">
                                    <v-radio-group v-model="relation_reason.rel_to_patient" @change="checkDataStatus('other'), relationship = ''" class="ma-0" hide-details dense>
                                        <v-radio value="Parent" label="Parent"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="5" sm="3" md="3" lg="3" class="py-1">
                                    <v-radio-group v-model="relationship" @change="relation_reason.rel_to_patient = ''" class="ma-0" hide-details dense>
                                        <v-radio value="Others" label="Others, Specify"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col :class="{'opacity' : relationship !== 'Others'}" cols="7" sm="3" md="3" lg="3">
                                    <v-text-field v-if="relationship === 'Others'" v-model="relation_reason.rel_to_patient" @change="checkDataStatus('other')" class="ma-0 body-2" dense hide-details></v-text-field>
                                    <v-text-field v-else readonly class="ma-0 body-2" dense hide-details></v-text-field>
                                </v-col>
                        </v-row>
                </v-col>
            </v-row>

            <v-row wrap>
                <v-col cols="5" sm="5" md="5" lg="5" class="pt-4">
                    <label>
                        Reason for signing on behalf of the member/patient:
                        <v-btn v-show="trans_detail.editable" v-if="!!relation_reason.reason_for_signing_onbehalf || reason_for_signing" @click="relation_reason.reason_for_signing_onbehalf = '', reason_for_signing = '', checkDataStatus('other')" width="60" height="25" small>Clear</v-btn>
                    </label>
                </v-col>
                <v-col cols="12" sm="12" md="7" lg="7">
                    <v-radio-group v-model="relation_reason.reason_for_signing_onbehalf" @change="checkDataStatus('other'), reason_for_signing = ''" hide-details dense>
                        <v-row wrap>
                            <v-col cols="12" sm="4" md="4" lg="4" class="pb-2">   
                                <v-radio value="Incapacitated" label="Patient is incapacitated"></v-radio>
                            </v-col>
                            <v-col cols="12" sm="4" md="3" lg="3">
                                <v-radio value="Representative" label="Representative"></v-radio>
                            </v-col>
                        </v-row>
                    </v-radio-group>
                    <v-row align="baseline" wrap>
                        <v-col cols="12" sm="4" md="4" lg="4" class="pt-1">
                            <v-radio-group v-model="relation_reason.reason_for_signing_onbehalf" @change="checkDataStatus('other'), reason_for_signing = ''" class="ma-0" hide-details dense>
                                <v-radio value="Patient" label="Patient"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="5" sm="3" md="3" lg="3" class="py-1">
                            <v-radio-group v-model="reason_for_signing" @change="relation_reason.reason_for_signing_onbehalf = ''" class="ma-0" hide-details dense>
                                <v-radio value="Others" label="Other Reason"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col :class="{'opacity' : reason_for_signing !== 'Others'}" cols="7" sm="3" md="3" lg="3">
                            <v-text-field v-if="reason_for_signing === 'Others'" v-model="relation_reason.reason_for_signing_onbehalf" @change="checkDataStatus('other')" class="ma-0 body-2" hide-details dense></v-text-field>
                            <v-text-field v-else readonly class="ma-0 body-2" hide-details dense></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-- CERTIFICATION OF HEALTH CARE INSTITUTION -->
            <v-row class="mt-3" wrap>
                <h1 class="subtitle-1 grey--text text--darken-3 font-weight-medium">CERTIFICATION OF HEALTH CARE INSTITUTION</h1>
                <v-spacer></v-spacer>
                <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf2_part4" @click="displayCommentData('hci')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
                    <v-badge content="!" color="red">
                        <v-icon class="pl-1" small>mdi-comment</v-icon>
                    </v-badge>
                </v-btn>
            </v-row>
            <v-divider class="mt-3"></v-divider>

            <!-- FILE ATTACHMENT FOR ADDITIONAL ATTACHMENTS -->
            <label>Attach additional documents (SOA , MDR etc.):</label>
            <v-row justify="center" class="mt-4 pb-2" wrap>
                <v-col cols="12" sm="6" md="4" lg="4" class="pr-1">
                    <v-select v-model="selected_doc_type" :items="certification_items" item-text="doc_description" label="Document Type" :error="required" outlined dense return-object> </v-select>
                    <label for="attached-certification" class="file-attachment">Choose File</label> 
                    <span class="ml-1" v-if="cert_data.section3.length === 0">No file chosen</span>
                    <span class="ml-1" v-else>{{ cert_data.section3.length }} files</span>
                    <input :disabled="!trans_detail.editable || new_additional_status === 'Processing' || selected_doc_type.length === 0"  @change="addAttachedAdditional" id="attached-certification" class="mt-4 d-none" type="file" ref="additional" accept=".pdf" multiple><br>
                    <v-divider class="mt-3"></v-divider>

                    <div v-for="(attached, i) in cert_data.section3" :key="i">
                        <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                            <v-icon color="success" size="20">mdi-check</v-icon>
                            <v-menu open-on-hover offset-y max-width="700" :close-on-content-click="false">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="attachment-name">
                                        {{ attached.name }}
                                    </span>
                                </template>

                                <v-card v-if="attached.attachment_upload_type === 'cloud_storage'" class="pa-4">
                                    <div>
                                        <strong>Uploaded Document ID:</strong>
                                        {{ attached.upload_document_id }}
                                    </div>

                                    <div>
                                        <strong>Latest Processing Timestamp:</strong>
                                        {{ formatDate(attached.processing_timestamp) }}
                                    </div>

                                    <div>
                                        <strong>Latest Processing Status:</strong>
                                        {{ attached.processing_status }}
                                    </div>

                                    <div>
                                        <strong>Storage URL:</strong>
                                        {{ attached.object_storage_url }}
                                    </div>

                                    <div v-show="attached.error_message">
                                        <strong>Error Result Message:</strong>
                                        {{ attached.error_message }}
                                    </div>
                                </v-card>

                                <v-card v-else class="pa-4">
                                    <div>
                                        <strong>Claim ID:</strong>
                                        {{ attached.claim_id }}
                                    </div>

                                    <div>
                                        <strong>Document Type:</strong>
                                        {{ attached.document_type }}
                                    </div>

                                    <div>
                                        <strong>Date Uploaded:</strong>
                                        {{ attached.date_uploaded }}
                                    </div>
                                </v-card>
                            </v-menu>

                            <v-icon
                                v-show="attached.loader === false || attached.loader === undefined"
                                :disabled="!trans_detail.editable || new_additional_status === 'Processing'"
                                @click="removeAttachedAdditional(i, 'old')"
                                class="remove-attachment"
                                size="20"
                            >
                                mdi-close
                            </v-icon>

                            <label  v-show="attached.loader" class="remove-attachment font-italic">
                                Deleting...
                            </label>
                        </h5>
                    </div>

                    <div v-for="(view, i) in view_attached_additional" :key="'view'+i" class="text-left">
                        <h5 class="font-weight-medium grey lighten-3 text-left pl-2 py-1 mt-2">
                            <template v-if="view.file_size > 30">
                                <v-tooltip bottom color="red">
                                    <template #activator="{ on }">
                                        <v-icon v-on="on" class="pr-1" color="red" size="20">mdi-alert-circle-outline</v-icon>
                                    </template>
                                    File size exceeds 30 MB
                                </v-tooltip>
                            </template>
                            <template v-else>
                                <v-progress-circular v-if="new_additional_status === true || new_additional_status === 'Processing'" class="mr-2" color="red" size="13" width="1.4" :indeterminate="new_additional_status === 'Processing'"></v-progress-circular>
                                <v-icon v-else color="success" size="20">mdi-check</v-icon>
                            </template>
                            {{ view.name }} <span class="text--secondary">- {{ view.file_size }} MB</span>
                            <v-icon v-show="new_additional_status !== 'Processing'" @click="removeAttachedAdditional(i, 'new')" class="remove-attachment" size="20">mdi-close</v-icon>
                        </h5>
                    </div>

                    <div class="text-center">
                        <v-btn :disabled="!trans_detail.editable || file_size_exceeds" :loading="loading_additional_attachment" @click="postFileOfAdditional" class="mt-4" small tile>UPLOAD FILE</v-btn>
                        <v-btn v-if="cert_data.section3.length > 0 || view_attached_additional.length > 0" @click="view_file_additional = true" class="mt-4 ml-2" small tile>VIEW FILE</v-btn>
                        <span class="d-block mt-3">Maximum upload size: 30 MB.</span>
                    </div>
                </v-col>
                <v-col cols="1" sm="1" md="1" lg="1"></v-col>
            </v-row>

            <v-row v-show="loading_additional_attachment" justify-center text-center wrap mt-2>
                <v-col cols="12" sm="6" md="4" lg="4">
                    <div class="yellow lighten-3 pa-5">
                        <h5 class="font-weight-regular grey--text text--darken-3">Please wait while we upload your file. <br>Do not click next or other category to finish uploading.</h5>
                    </div>
                </v-col>
                <v-col cols="1" sm="1" md="1" lg="1"></v-col>
            </v-row>

            <v-divider class="mt-7 mb-3"></v-divider>
            <p class="font-italic body-1">I certify that service rendered in the patient's chart and health are institution records and that the herein information given are true and correct.</p>
            
            <v-row justify="center" align="center">
                <v-col cols="12" sm="12" md="4" lg="4"  class="text-center">
                    <div class="mb-4">
                        <img v-if="trans_detail.hci_sign_path" :src="trans_detail.hci_sign_path" alt="Signature" width="150" height="auto" />
                    </div>
                    <div class="mt-1 pt-1">
                        <strong>{{ this.hci_name }}</strong>
                    </div>
                    <div class="mt-1 pt-1">
                        <label class="body-2 border-top">Signature Over Printed name of Authorized HCI Representative</label>
                    </div>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3"  class="text-center">
                    <v-spacer v-if="trans_detail.hci_sign_path" class="mt-10 pt-10"></v-spacer>
                    <v-spacer v-else></v-spacer>
                    <div class="mt-6 mb-2">
                        <strong>{{ signatures.hospital ? '.' : '' }}</strong>
                    </div>
                    <div class="border-top mt-1 pt-1"></div>
                    
                    <label class="body-2">Official Capacity/Designation</label>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3"  class="text-center">
                    <v-spacer v-if="trans_detail.hci_sign_path" class="mt-10 pt-10"></v-spacer>
                    <v-spacer v-else></v-spacer>
                    <div class="mt-6 mb-2">
                        <strong>{{ signatures.hospital }}</strong>
                    </div>
                    <div class="border-top mt-1 pt-1"></div>
                    
                    <label class="body-2">Date Signed</label>
                </v-col>
            </v-row>

            <!-- CERTIFICATION OF ATTENDING PHYSICIAN/MIDWIFE -->
            <v-row class="mt-5 mb-1" wrap>
                <h1 class="subtitle-1 grey--text text--darken-3 font-weight-medium">CERTIFICATION OF ATTENDING PHYSICIAN/MIDWIFE</h1>
                <v-spacer></v-spacer>
                <v-btn v-if="trans_detail.crd_claims_status === 'Screening Rejected' && !!comment_data.cf3_part2_number19" @click="displayCommentData('certification')" class="ml-2" color="primary" tile depressed small>CHECK COMMENTS 
                <v-badge content="!" color="red">
                    <v-icon class="pl-1" small>mdi-comment</v-icon>
                </v-badge>
                </v-btn>
            </v-row>
            <v-divider></v-divider>
            <p class="font-italic body-1 mt-2">I certify that the above information given in this form are true and correct.</p>

            <v-row justify="center" align="center">
                <v-col cols="12" md="6" class="text-center">
                    <div class="mb-4">
                        <img v-if="trans_detail.doctor_sign_path" :src="trans_detail.doctor_sign_path" alt="Signature" width="150" height="auto" />
                    </div>
                    <div class="mt-1 pt-1">
                        <strong>{{ this.doctor_name }}</strong>
                    </div>
                    <div class="mt-1 pt-1">
                        <label class="body-2 border-top">Signature over printed Name of Attending Physician</label>
                    </div>
                </v-col>

                <v-col cols="12" md="4" class="text-center">
                    <v-spacer v-if="trans_detail.doctor_sign_path" class="mt-10 pt-10"></v-spacer>
                    <v-spacer v-else></v-spacer>
                    <div class="mt-6 mb-2">
                        <strong>{{ signatures.doctor }}</strong>
                    </div>
                    <div class="border-top mt-1 pt-1"></div>
                    
                    <label class="body-2">Date Signed</label>
                </v-col>
            </v-row>

            <!-- VIEW FILE DIALOG FOR ADDITIONAL -->
            <v-dialog v-model="view_file_additional" width="1100" persistent>
                <v-card>
                    <v-card-title class="light-blue darken-3 white--text py-2 justify-center">
                        <v-spacer></v-spacer>CERTIFICATION {{ $vuetify.breakpoint.smAndUp ? 'ATTACHMENT' : '' }}<v-spacer></v-spacer>
                        <v-btn @click="view_file_additional = false" dark icon>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>

                    <div v-for="(attached, i) in cert_data.section3" :key="i" class="px-4 mt-2">
                        <h4>{{ i+1 }}) {{ attached.name }}</h4>
                        <embed :src="attached.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
                        <v-divider class="mt-4"></v-divider>
                    </div>

                    <div v-for="(view, i) in view_attached_additional" :key="'view'+i" class="px-4 mt-2">
                        <h4>{{ i+cert_data.section3.length+1 }}) {{ view.name }}</h4>
                        <embed :src="view.file_path+'#toolbar=0&view=FitH'" width="100%" height="600px" />
                        <v-divider class="mt-4"></v-divider>
                    </div>

                    <v-row justify="center" class="mt-3 pb-3" wrap>
                        <v-btn @click="view_file_additional = false" class="ml-1" color="primary">CLOSE</v-btn>
                    </v-row>
                </v-card>
            </v-dialog>

            <!-- COMMENT DIALOG -->
            <v-dialog v-model="comment_dialog" width="600" persistent>
                <v-card>
                    <h3 class="grey--text text--darken-3 font-weight-medium py-1 text-center">{{ comment_title }}</h3>
                    <v-divider></v-divider>
                    <div class="px-4 mt-2">
                        <label class="body-2">Comment:</label>
                        <v-textarea v-model="comment_content" rows="4" outlined readonly hide-details></v-textarea>
                    </div>
                    <v-row justify="center" class="mt-3 pb-3" wrap>
                        <v-btn @click="comment_dialog = false" class="ml-1" color="primary" small>CLOSE</v-btn>
                    </v-row>
                </v-card>
            </v-dialog>

            <!--OTHERS DIALOG-->
            <v-dialog v-if="other_sources.dialog" v-model="other_sources.dialog" width="400" persistent>
                <v-card class="pa-5">
                    <h6 class="font-weight-regular body-2">Others</h6>
                    <v-text-field v-model="other_sources.new" placeholder="Enter other funding sources here" hide-details outlined></v-text-field>

                    <v-row justify="end" class="mt-4" wrap dense>
                        <v-btn @click="other_sources.dialog = false" small>CLOSE</v-btn>
                        <v-btn @click="saveOthersSources" :disabled="!other_sources.new" class="ml-2" color="primary" small>CONFIRM</v-btn>
                    </v-row>
                </v-card>
            </v-dialog>

            <!-- NAVIGATION BUTTON -->
            <v-divider class="my-5"></v-divider>
            <v-row justify="space-between" wrap>
                <v-col cols="5" sm="5" md="5" lg="5">
                    <v-btn @click="$router.push('/input-forms/accreditation-and-signature')" color="primary"><i class="fas fa-arrow-left mr-1"></i>PREVIOUS</v-btn> 
                </v-col>
                <v-col cols="5" sm="5" md="5" lg="5" class="text-right">
                    <div v-if="!trans_detail.editable">
                        <v-btn @click="$router.push('/patient-list')" color="primary"><i class="fas fa-home mr-1"></i>BACK TO HOME</v-btn>
                    </div>
                </v-col>
            </v-row>
            
            <Alert :alert="alert" />
        </v-form>
    </div>
</template>

<script>
import Alert from '../../Alert.vue'

export default {
    props: ['trans_detail', 'required', 'comment_data'],

    components: {
        Alert
    },

    created(){
        this.getCertificationData();
        this.getDocumentType()
    },

    data(){
        return{
            ctf_data: {
                phic_ben_is_enough: '',
                total_health_inst_fees: '',
                total_professional_fees: '',
                grand_total: '',

                co_hcf_total_actual_charges: '',
                co_hcf_phic_benefit: '',
                co_hcf_amt_after_dsct: '',
                co_hcf_amt_after_phic_deduc: '',
                co_hcf_paid_by: '',

                co_pf_total_actual_charges: '',
                co_pf_phic_benefit: '',
                co_pf_amt_after_dsct: '',
                co_pf_amt_after_phic_deduc: '',
                co_pf_paid_by: '',
                
                nco_total_cost_med_sup: '',
                nco_total_cost_diagnostic_laboratory: '',

                status: {
                    certification: false,
                    co_hcf_paid_by: false,
                    co_pf_paid_by: false
                },
                summary_of_fees: {},
                mandatory_discount_type: '',
                total_summary_of_fees_data: {},
                professional_fees: {},
                total_professional_fees_data: '',
                itemized_charges: {},

                receipt_data: {}
            },

            // DATA
            cert_data: {
                total_cpt_amount: '',

                section2: {
                    rel_to_patient: '',
                    reason_for_signing_onbehalf: ''
                },
                
                section3: []
            },

            relation_reason: {
                rel_to_patient: '',
                reason_for_signing_onbehalf: '',
                status: false
            },

            signatures: {
                doctor: '',
                patient: '',
                hospital: ''
            },

            // OTHERS
            total_actual_charges_tooltip: false,
            total_purchase_amount: '',
            total_diagnostic_amount: '',
            selected_hif_paid_by: [],
            selected_pf_paid_by: [],
            relationship: '',
            reason_for_signing: '',
            alert: {},

            // ATTACHMENTS
            new_additional_status: true,
            view_attached_additional: [],
            post_attached_additional: [],
            view_file_additional: false,
            loading_additional_attachment: false,
            file_size_exceeds: false,

            // COMMENTS
            comment_dialog: false,
            comment_title: '',
            comment_content: '',

            // SIGANTURE NAMES
            doctor_name:'',
            patient_name:'',
            hci_name:'',

            //SUMMARY OF FEES
            is_printing: false,

            summary_of_fees: [
                { fee_particulars: 'Room and Board', amount: 0, mandatory_discount: 0,  philhealth: 0, other_sources_list: [ {other_desc:'', other_amount:0} ], balance: 0},
                { fee_particulars: 'Drugs and Medicine', amount: 0, mandatory_discount: 0, philhealth: 0, other_sources_list: [ {other_desc:'', other_amount:0} ], balance: 0},
                { fee_particulars: 'Laboratory and Diagnostic', amount: 0, mandatory_discount: 0, philhealth: 0, other_sources_list: [ {other_desc:'', other_amount:0} ], balance: 0},
                { fee_particulars: 'Operating Room', amount: 0, mandatory_discount: 0, philhealth: 0, other_sources_list: [ {other_desc:'', other_amount:0} ], balance: 0},
                { fee_particulars: 'Medical Supplies', amount: 0, mandatory_discount: 0, philhealth: 0, other_sources_list: [ {other_desc:'', other_amount:0} ],  balance: 0},
            ],
            
            total_summary_of_fees_data: {
                amount: '', 
                mandatory_discount_input: '',
                philhealth_input: '',
                other_sources_input: '',
            },

            //PROFESSIONAL FEES
            professional_fees_header: [
                { text: 'Physician Accreditation Number', value: 'physician_accre_no', width:'140px', sortable: false, align:'left' },
                { text: 'Physician Name', value: 'physician_name', width:'170px', sortable: false, align:'left' },
                { text: 'Amount', value: 'amount', width:'100px', sortable: false, align:'left' },
                { text: 'Discount', value: 'discount', width:'100px', sortable: false, align:'left' },
                { text: 'Philhealth', value: 'philhealth', width:'100px', sortable: false, align:'left' },
                { text: 'Other Funding Sources', value: 'other_sources', width:'100px', sortable: false, align:'left' },
                { text: 'Balance', value: 'balance', width:'105px', sortable: false, align:'left' },
            ],

            professional_fees: [
                { physician_accre_no: '',  physician_name: '', amount: 0, discount: 0, philhealth: 0,  other_sources_list: [{ other_desc: '', other_amount: 0 }], balance: 0},
            ],
            

            patient_data: [],
            max_date:  this.$moment().format('YYYY-MM-DD'),
            sf_discount_type: '',
            panel: [],
            pf_panel: [],
            switch_all: false,
            fee_particulars: ['Room and Board', 'Drugs and Medicine', 'Laboratory and Diagnostic', 'Operating Room', 'Medical Supplies'],
            other_funding_sources: ['PCSO', 'DSWD', 'DOHMAP', 'HMO', 'OTHERS'],
            other_sources: { dialog: false, new: '', target_particular: null, target_index: null },

            certification_items: [],
            selected_doc_type: [],
            selected_doct_type_holder: [],

            receipt_data: {}
        }
    },

    computed: {        
        hif_amount_deduct(){
            return this.ctf_data.co_hcf_amt_after_phic_deduc
        },

        pf_amount_deduct(){
            return this.ctf_data.co_pf_amt_after_phic_deduc
        },
        
        total_summary_of_fees() {
            let total = {
                amount: 0,
                mandatory_discount: 0,
                philhealth: 0,
                other_sources: 0,
                balance: 0
            };

            this.summary_of_fees.forEach(item => {
                total.amount += Number(item.amount) || 0;
                total.mandatory_discount += Number(item.mandatory_discount) || 0;
                total.philhealth += Number(item.philhealth) || 0;

                const other_total = Array.isArray(item.other_sources_list)
                    ? item.other_sources_list.reduce((sum, src) => sum + (Number(src.other_amount) || 0), 0)
                    : 0;

                total.other_sources += other_total;
            });

            total.balance = total.amount - (total.mandatory_discount + total.philhealth + total.other_sources);
            return total;
        },

        total_summary_of_fees_input_based() {
            const amount = this.total_summary_of_fees.amount;
            const mandatory_discount = parseFloat(this.total_summary_of_fees_data.mandatory_discount_input) || this.total_summary_of_fees.mandatory_discount;
            const philhealth = parseFloat(this.total_summary_of_fees_data.philhealth_input) || this.total_summary_of_fees.philhealth;
            const other_sources = parseFloat(this.total_summary_of_fees_data.other_sources_input) || this.total_summary_of_fees.other_sources;

            const balance = Math.max(amount - (mandatory_discount + philhealth + other_sources), 0);
            //console.log(amount.toFixed(2),mandatory_discount.toFixed(2),philhealth.toFixed(2),other_sources.toFixed(2),balance.toFixed(2));
            return {
                amount: parseFloat(amount.toFixed(2)),
                mandatory_discount: parseFloat(mandatory_discount.toFixed(2)),
                philhealth: parseFloat(philhealth.toFixed(2)),
                other_sources: parseFloat(other_sources.toFixed(2)),
                balance: parseFloat(balance.toFixed(2)),
            };
        },

        total_prof_fees() {
            return this.professional_fees.reduce(
                (acc, item) => {
                    acc.amount += Number(item.amount) || 0;
                    acc.discount += Number(item.discount) || 0;
                    acc.philhealth += Number(item.philhealth) || 0;

                    const other = (item.other_sources_list || []).reduce((sum, src) => {
                        return sum + (Number(src.other_amount) || 0);
                    }, 0);

                    acc.other_sources += other;
                    acc.balance += Number(item.balance) || 0;

                    return acc;
                },
                {
                    amount: 0,
                    discount: 0,
                    philhealth: 0,
                    other_sources: 0,
                    balance: 0,
                }
            );
        },

        total_professional_fees_data() {
            return this.professional_fees.reduce((sum, item) => {
                return sum + (Number(item.balance) || 0);
            }, 0);
        },

        isAllSelected() {
            return this.panel.length === this.fee_particulars.length;
        },

        //RECEIPT DATA GET THE SUM OF MEDICINE AND MEDICAL SUPPLIES
        receiptDataTotalAmount() {
            const receipt_med          = this.summary_of_fees.find(item => item.fee_particulars === 'Drugs and Medicine')
            const receipt_med_supplies = this.summary_of_fees.find(item => item.fee_particulars === 'Medical Supplies')

            const receipt_med_amt = receipt_med && !isNaN(Number(receipt_med.amount)) ? Number(receipt_med.amount) : 0;

            const receipt_med_supplies_amt = receipt_med_supplies && !isNaN(Number(receipt_med_supplies.amount)) ? Number(receipt_med_supplies.amount) : 0;
            
            const sum = receipt_med_amt + receipt_med_supplies_amt

            return sum.toFixed(2)
        }
    },

    watch: {
        // PREVENT NAVIGATE IF THERE IS UNSAVED ATTACHMENT
        view_attached_additional(value){
            let total = 0

            value.forEach(element => {
                total += parseFloat(element.file_size)
            })

            if(total > 30){
                this.file_size_exceeds = true
            }else{
                this.file_size_exceeds = false
            }
            
            if(value.length > 0){
                this.unsaved_attachment = 'unsaved_attachment'
            }else{
                this.unsaved_attachment = ''
            }
        },
        
        hif_amount_deduct(value){
            if(value === 'NaN'){
                this.ctf_data.co_hcf_amt_after_phic_deduc = '0.00'
            }
        },

        pf_amount_deduct(value){
            if(value === 'NaN'){
                this.ctf_data.co_pf_amt_after_phic_deduc = '0.00'
            }
        },
         panel(value) {
            const totalIndex = this.fee_particulars.length;
            if (!value.includes(totalIndex)) {
            this.panel.push(totalIndex);
            }
        },
        
        //DEFAULT VALUE OF TOTAL PHILHEALTH
        'ctf_data.total_health_inst_fees'(value) {
            if (value) {
                const new_value = Number(String(value).replace(/,/g, ''));
                if (!isNaN(new_value)) {
                    this.total_summary_of_fees_data.philhealth = new_value;
                    this.total_summary_of_fees_data.philhealth_input = new_value;
                }
            }
        },

        // Watch both total and covered amount
        'ctf_data.grand_total': 'autoSelectPhicBenefitStatus',
        'this.total_summary_of_fees_input_based.amount': 'autoSelectPhicBenefitStatus',

        summary_of_fees: {
            handler(value) {
                value.forEach(item => {
                    this.calculateSummaryBalance(item);
                });
            },
            deep: true
        }
    },

    mounted() {
        // Open TOTAL AMOUNT on load
        this.panel = [this.fee_particulars.length]; 
        this.pf_panel = this.professional_fees.map((_, index) => index).concat([this.professional_fees.length]);
        // this.sf_discount_type = this.trans_detail.mem_priority_care;
        const priority_type = this.trans_detail.mem_priority_care;
        this.sf_discount_type = priority_type === 'REGULAR PATIENT' ? null : priority_type;
    },

    methods: {
        // GET CERTFICATION DATA
        getCertificationData(){
            let patient_data = this.getDataInStorage('ET534D', 'fgXSd45d');
            let ass = this.getDataInStorage('GLORS6', 'dspof43S') 
            this.doctor_name = ass.section1[0].doc_fullname
            this.doc_phic_acc_no = ass.section1[0].doc_phic_acc_no
            this.patient_name = patient_data.pat_fname + ' ' + patient_data.pat_mname + ' ' + patient_data.pat_lname
            this.hci_name = patient_data.hci_name
            setTimeout(async () => {
                let total_fees = sessionStorage.getItem('49SFL4') ? this.$crypto.AES.decrypt(sessionStorage.getItem('49SFL4'), 'FoelR42s').toString(this.$crypto.enc.Utf8) : null
                this.total_fees = JSON.parse(total_fees)
                this.ctf_data = JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('rtYIWs4'), 'pfdFxg44').toString(this.$crypto.enc.Utf8))
                this.professional_fees[0].physician_name = this.doctor_name
                this.professional_fees[0].physician_accre_no = this.doc_phic_acc_no
                const parsed = parseFloat(this.ctf_data.total_professional_fees?.toString().replace(/,/g, '').split(' ')[0]);
                this.professional_fees[0].philhealth = parsed;
                this.professional_fees[0].philhealth_input = parsed;
                this.ctf_data.phic_ben_is_enough = this.ctf_data.phic_ben_is_enough ? this.ctf_data.phic_ben_is_enough : null
                this.ctf_data.total_health_inst_fees = this.checkFormat(this.total_fees ? this.total_fees.hci_fee : (this.ctf_data.total_health_inst_fees ? this.ctf_data.total_health_inst_fees : '0'))
                this.ctf_data.total_professional_fees = this.checkFormat(this.total_fees ? this.total_fees.pf_fee : (this.ctf_data.total_professional_fees ? this.ctf_data.total_professional_fees : '0'))
                this.ctf_data.grand_total = this.checkFormat(this.total_fees ? this.total_fees.grand_total : (this.ctf_data.grand_total ? this.ctf_data.grand_total : '0'))

                this.ctf_data.co_hcf_total_actual_charges = this.checkFormat(this.ctf_data.co_hcf_total_actual_charges)
                this.ctf_data.co_hcf_phic_benefit = this.checkFormat(this.total_fees ? this.total_fees.hci_fee : (this.ctf_data.co_hcf_phic_benefit ? this.ctf_data.co_hcf_phic_benefit : '0'))
                this.ctf_data.co_hcf_amt_after_dsct = this.checkFormat(this.ctf_data.co_hcf_amt_after_dsct)
                this.ctf_data.co_hcf_amt_after_phic_deduc = this.checkFormat(this.ctf_data.co_hcf_amt_after_phic_deduc)
                this.ctf_data.co_hcf_paid_by = this.ctf_data.co_hcf_paid_by.length === 0 ? [] : this.ctf_data.co_hcf_paid_by

                this.ctf_data.co_pf_total_actual_charges = this.checkFormat(this.ctf_data.co_pf_total_actual_charges)
                this.ctf_data.co_pf_phic_benefit = this.checkFormat(this.total_fees ? this.total_fees.pf_fee : (this.ctf_data.co_pf_phic_benefit ? this.ctf_data.co_pf_phic_benefit : '0'))
                this.ctf_data.co_pf_amt_after_dsct = this.checkFormat(this.ctf_data.co_pf_amt_after_dsct)
                this.ctf_data.co_pf_amt_after_phic_deduc = this.checkFormat(this.ctf_data.co_pf_amt_after_phic_deduc)
                this.ctf_data.co_pf_paid_by = this.ctf_data.co_pf_paid_by.length === 0 ? [] : this.ctf_data.co_pf_paid_by
                
                this.ctf_data.nco_total_cost_med_sup = this.ctf_data.nco_total_cost_med_sup === 'None' ? this.ctf_data.nco_total_cost_med_sup : this.checkFormat(this.ctf_data.nco_total_cost_med_sup)
                this.ctf_data.nco_total_cost_diagnostic_laboratory = this.ctf_data.nco_total_cost_diagnostic_laboratory === 'None' ? this.ctf_data.nco_total_cost_diagnostic_laboratory : this.checkFormat(this.ctf_data.nco_total_cost_diagnostic_laboratory)
                 


                if(this.total_fees !== null){
                    this.ctf_data.total_health_inst_fees = this.checkFormat(this.total_fees.hci_fee)
                    this.ctf_data.total_professional_fees = this.checkFormat(this.total_fees.pf_fee)
                    this.ctf_data.grand_total = this.checkFormat(this.total_fees.grand_total)

                    this.ctf_data.co_hcf_phic_benefit = this.checkFormat(this.total_fees.hci_fee)
                    this.ctf_data.co_pf_phic_benefit = this.checkFormat(this.total_fees.pf_fee)
                } 
                
                this.ctf_data.co_hcf_paid_by.forEach(element => {
                    this.selected_hif_paid_by.push(element.co_hcf_paid_by)
                })

                this.ctf_data.co_pf_paid_by.forEach(element => {
                    this.selected_pf_paid_by.push(element.co_pf_paid_by)
                })

                if(this.ctf_data.nco_total_cost_med_sup === 'None' || !this.ctf_data.nco_total_cost_med_sup){
                    this.total_purchase_amount = ''
                }else{
                    this.total_purchase_amount = 'Total'
                }

                if(this.ctf_data.nco_total_cost_diagnostic_laboratory === 'None' || !this.ctf_data.nco_total_cost_diagnostic_laboratory){
                    this.total_diagnostic_amount = ''
                }else{
                    this.total_diagnostic_amount = 'Total'
                }
                
                //RECEIPT DATA
                this.ctf_data.receipt_data = this.receipt_data

                let cert_data = sessionStorage.getItem('CLD5Y8') ? this.$crypto.AES.decrypt(sessionStorage.getItem('CLD5Y8'), 'GOre24x5').toString(this.$crypto.enc.Utf8) : null
                let relation_reason = sessionStorage.getItem('PDFG5F') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PDFG5F'), 'XCdx3F9D').toString(this.$crypto.enc.Utf8)) : null
                let signatures = sessionStorage.getItem('LMNSP2') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('LMNSP2'), 'MndeXf9d').toString(this.$crypto.enc.Utf8)) : null
                let ciw_data = sessionStorage.getItem('PORT4D')
                ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('PORT4D'), 'X4d3r5fS').toString(this.$crypto.enc.Utf8))
                : null;

                if (ciw_data && ciw_data.summary_of_fees) {
                    const medicine = this.summary_of_fees.find(item => item.fee_particulars === 'Drugs and Medicine');
                    const supplies = this.summary_of_fees.find(item => item.fee_particulars === 'Medical Supplies');
                    const lab = this.summary_of_fees.find(item => item.fee_particulars === 'Laboratory and Diagnostic');

                    if (medicine) {
                        medicine.amount = parseFloat(ciw_data.summary_of_fees.total_medicine_amount);
                        medicine.amount_input = medicine.amount;
                    }

                    if (supplies) {
                        supplies.amount = parseFloat(ciw_data.summary_of_fees.total_medical_supplies_amount);
                        supplies.amount_input = supplies.amount;
                    }

                    if (lab) {
                        lab.amount = parseFloat(ciw_data.summary_of_fees.total_procedure_amount);
                        lab.amount_input = lab.amount;
                    }
                }

                if(cert_data === null){
                    let response = await this.$services.getEclaims({
                        request_key: 'certification',
                        provider_code: this.$store.state.prv_data.provider_code,
                        ek_lgu_id: this.trans_detail.ek_lgu_id,
                        transaction_number: this.trans_detail.transaction_number,
                        migrated_to_eclaim_table: this.trans_detail.migrated_to_eclaim_table,
                        claim_no: this.trans_detail.claim_no,
                        ph_category: this.trans_detail.phic_packages
                    });

                    if (response.status === 200) {
                        response.data = this.responseDataDecryption(response.data)
                        this.cert_data.total_cpt_amount = this.checkFormat(this.total_fees ? this.total_fees.total_cpt_amount : response.data.TOTAL_CPT_AMOUNT)

                        this.cert_data.section3 = response.data.ATTACHMENT ? response.data.ATTACHMENT : []
                            
                        this.relation_reason = {
                            rel_to_patient: relation_reason ? relation_reason.rel_to_patient : response.data.PATIENT_DATA.rel_to_patient,
                            reason_for_signing_onbehalf: relation_reason ? relation_reason.reason_for_signing_onbehalf : response.data.PATIENT_DATA.rel_for_signing_on_behalf,
                            status: relation_reason ? relation_reason.status : false
                        }

                        if(signatures){
                            this.signatures = signatures
                        }else{
                            this.signatures = {
                                doctor: response.data.SIGNATURE.doctor_date_signed ? this.formatDate(response.data.SIGNATURE.doctor_date_signed.substring(0, 10)) : '',
                                hospital: response.data.SIGNATURE.hospital_date_signed ? this.formatDate(response.data.SIGNATURE.hospital_date_signed.substring(0, 10)) : '',
                                patient: response.data.SIGNATURE.patient_date_signed ? this.formatDate(response.data.SIGNATURE.patient_date_signed.substring(0, 10)) : ''
                            }
                        }

                        if(this.cert_data.section3.length !== 0){
                            this.cert_data.section3.forEach(element => {
                                let no_of_file = element.file_name.split('_')[0]
                                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

                                element.name = element.file_name.substring(sum)
                                element.loader = false
                            })
                        }

                        if(this.relation_reason.rel_to_patient === 'Spouse' || this.relation_reason.rel_to_patient === 'Sibling' || this.relation_reason.rel_to_patient === 'Child' || this.relation_reason.rel_to_patient === 'Parent' || !this.relation_reason.rel_to_patient){
                            this.relationship = ''
                        }else{
                            this.relationship = 'Others'
                        }
                        
                        if(this.relation_reason.reason_for_signing_onbehalf === 'Incapacitated' || this.relation_reason.reason_for_signing_onbehalf === 'Representative' || this.relation_reason.reason_for_signing_onbehalf === 'Patient' || !this.relation_reason.reason_for_signing_onbehalf){
                            this.reason_for_signing = ''
                        }else{
                            this.reason_for_signing = 'Others'
                        }

                        if (response.data.SUMMARY_OF_FEES && response.data.SUMMARY_OF_FEES.length > 0) {
                            this.summary_of_fees = response.data.SUMMARY_OF_FEES.map((item) => {
                                const other_sources_list = [];

                                const other_fields = [
                                    { key: 'pcso', label: 'PCSO' },
                                    { key: 'dswd', label: 'DSWD' },
                                    { key: 'doh_map', label: 'DOHMAP' },
                                    { key: 'hmo', label: 'HMO' }
                                ];

                                other_fields.forEach(({ key, label }) => {
                                    const amount = Number(item[key]);
                                    if (amount > 0) {
                                        other_sources_list.push({
                                            other_desc: label,
                                            other_amount: amount
                                        });
                                    }
                                });
                                
                                const api_amount = item.charges_net_of_applicable_vat
                                const session_amount = this.summary_of_fees.find(
                                    c => c.fee_particulars === item.fee_particulars
                                );
                                
                                const final_amount = api_amount != session_amount.amount && ciw_data && item.fee_particulars !== 'Room and Board'  && item.fee_particulars !== 'Operating Room'  ? session_amount.amount : api_amount

                                if (item.other && item.other_fund_amount && Number(item.other_fund_amount) > 0 && item.fee_particulars === 'Room and Board') {
                                      other_sources_list.push({
                                        fee_particulars: item.fee_particulars,
                                        other_desc: item.other,           
                                        other_amount: Number(item.other_fund_amount)
                                    });
                                }

                                return {
                                    fee_particulars: item.fee_particulars,
                                    amount: Number(final_amount),
                                    amount_input: final_amount,
                                    mandatory_discount: Number(item.mandatory_discount || 0),
                                    mandatory_discount_input: item.mandatory_discount,
                                    philhealth: '',
                                    philhealth_input: '',
                                    other_sources_list,
                                    balance: Number(item.balance || 0)
                                };
                            });
                        }

                        if (response.data.TOTAL_SUMMARY_OF_FEES) {
                            this.total_summary_of_fees_input_based.amount = response.data.TOTAL_SUMMARY_OF_FEES.total_amount;
                            this.total_summary_of_fees_data.mandatory_discount_input = response.data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount;
                            this.total_summary_of_fees_data.mandatory_discount = response.data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount;
                            this.total_summary_of_fees_data.philhealth = response.data.TOTAL_SUMMARY_OF_FEES.total_philhealth;
                            this.total_summary_of_fees_data.philhealth_input = response.data.TOTAL_SUMMARY_OF_FEES.total_philhealth;
                            this.total_summary_of_fees_data.other_sources = response.data.TOTAL_SUMMARY_OF_FEES.total_amount;
                            this.total_summary_of_fees_input_based.balance = response.data.TOTAL_SUMMARY_OF_FEES.total_balance;

                            this.cert_data.total_summary_of_fees_data = {
                                mandatory_discount: response.data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount,
                                mandatory_discount_input: response.data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount,
                                philhealth: response.data.TOTAL_SUMMARY_OF_FEES.total_philhealth,
                                philhealth_input: response.data.TOTAL_SUMMARY_OF_FEES.total_philhealth,
                                other_sources: response.data.TOTAL_SUMMARY_OF_FEES.total_amount, 
                            };

                            this.cert_data.total_summary_of_fees_input_based = {
                                amount: response.data.TOTAL_SUMMARY_OF_FEES.total_amount,
                                balance: response.data.TOTAL_SUMMARY_OF_FEES.total_balance,
                                mandatory_discount_input: response.data.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount,
                            };


                        }

                        if (response.data.PROFESSIONAL_FEES && response.data.PROFESSIONAL_FEES.length > 0) {
                            this.professional_fees = response.data.PROFESSIONAL_FEES.map(item => {
                                const other_sources_list =  [];

                                const other_fields = [
                                    { key: 'pcso', label: 'PCSO' },
                                    { key: 'dswd', label: 'DSWD' },
                                    { key: 'doh_map', label: 'DOHMAP' },
                                    { key: 'hmo', label: 'HMO' }
                                ];
                                
                                other_fields.forEach(({ key, label }) => {
                                    if (item[key] && Number(item[key]) > 0) {
                                        other_sources_list.push({
                                        other_desc: label,
                                        other_amount: Number(item[key])
                                        });
                                    }
                                });

                                if (other_sources_list.length === 0) {
                                    other_sources_list.push({ other_desc: '', other_amount: 0 });
                                }

                                const raw = this.ctf_data.total_professional_fees || '0';
                                const cleaned = raw.toString().replace(/,/g, '').split(' ')[0];
                                const philhealth = parseFloat(cleaned);

                                const prof_fee= {
                                    physician_accre_no: item.physician_accre_no,
                                    physician_name: item.physician_name,
                                    amount: Number(item.amount || 0),
                                    amount_input: Number(item.amount || 0),
                                    discount: Number(item.mandatory_discount || 0),
                                    discount_input: Number(item.mandatory_discount || 0),
                                    philhealth: Number(item.philhealth) > 0
                                                ? Number(item.philhealth)
                                                : philhealth,
                                    philhealth_input: Number(item.philhealth) > 0
                                                ? Number(item.philhealth)
                                                : philhealth,
                                    other_sources_list,
                                    balance: Number(item.balance || 0)
                                
                                };

                                //console.log(prof_fee)
                                this.calculateProfessionalBalance(prof_fee)
                                return prof_fee
                            });
                        }
                        if(response.data.MANDATORY_DISCOUNT_TYPE) {
                            this.sf_discount_type = response.data.MANDATORY_DISCOUNT_TYPE;
                        }

                        this.cert_data.summary_of_fees = this.summary_of_fees;
                        this.cert_data.total_summary_of_fees_data = this.total_summary_of_fees_data;
                        this.cert_data.total_summary_of_fees_input_based = this.total_summary_of_fees_input_based;
                        this.cert_data.professional_fees = this.professional_fees;
                        this.cert_data.sf_discount_type = this.sf_discount_type;
                        this.cert_data.signatures = this.signatures;
                        this.cert_data.relation_reason = this.relation_reason;
                        this.cert_data.relationship = this.relationship;
                        this.cert_data.reason_for_signing = this.reason_for_signing;

                        //RECEIPT DATA
                        if(response.data.RECEIPT_DATA){
                            this.receipt_data = { ...response.data.RECEIPT_DATA,
                                                total: this.receiptDataTotalAmount
                                                }
                        }
                        this.cert_data.receipt_data = this.receipt_data
                        this.ctf_data.receipt_data  = this.receipt_data

                        sessionStorage.setItem('CLD5Y8', this.$crypto.AES.encrypt(JSON.stringify(this.cert_data), 'GOre24x5'));
                        //console.log(cert_data, "cert_data")
                        sessionStorage.setItem('LMNSP2', this.$crypto.AES.encrypt(JSON.stringify(this.signatures), 'MndeXf9d'))
                        this.saveData();
                        this.$store.commit('set_loading_category', false) 
                    } else {
                        this.alert = response.error;
                    }
                }else{
                    this.cert_data = JSON.parse(cert_data);
                    
                    this.cert_data.summary_of_fees.forEach(cert_item => {
                        const ciw_item = this.summary_of_fees.find(
                            item => item.fee_particulars === cert_item.fee_particulars
                        );

                        if (ciw_item) {
                            const ciw_amount = Number(ciw_item.amount || 0);
                            const cert_amount = Number(cert_item.amount || 0);
                            
                            if (ciw_amount !== cert_amount && ciw_data && cert_item.fee_particulars !== 'Room and Board'  && cert_item.fee_particulars !== 'Operating Room') {
                                cert_item.amount = ciw_amount;
                                cert_item.amount_input = ciw_amount;
                            }
                        }
                    });

                    this.relation_reason = this.cert_data.relation_reason || {
                        rel_to_patient: '',
                        reason_for_signing_onbehalf: '',
                        status: false
                    };

                    this.signatures = this.cert_data.signatures || {
                        doctor: '',
                        hospital: '',
                        patient: ''
                    };

                    this.summary_of_fees = this.cert_data.summary_of_fees || [];
                    this.total_summary_of_fees_data = this.cert_data.total_summary_of_fees_data || {};
                    this.professional_fees = this.cert_data.professional_fees || [];
                    this.sf_discount_type = this.cert_data.sf_discount_type || '';
                    this.cert_data.total_cpt_amount = this.checkFormat(this.total_fees?.total_cpt_amount || this.cert_data.total_cpt_amount);

                    const rel = this.relation_reason.rel_to_patient;
                    this.relationship = (['Spouse', 'Sibling', 'Child', 'Parent', '', null].includes(rel)) ? '' : 'Others';
                    const reason = this.relation_reason.reason_for_signing_onbehalf;
                    this.reason_for_signing = (['Incapacitated', 'Representative', 'Patient', '', null].includes(reason)) ? '' : 'Others';

                    this.$store.commit('set_loading_category', false);

                    //RECEIPT DATA
                    this.receipt_data = { ...this.cert_data.receipt_data,
                                            total: this.receiptDataTotalAmount
                                        }
                    this.ctf_data.receipt_data = this.receipt_data;
                }
                
             }, 200)
        },

        autoSelectPhicBenefitStatus() {
            const covered = Number(this.ctf_data.grand_total  || 0);
            const total = Number(this.total_summary_of_fees_input_based.amount || 0);

            if (!total) return; 

            if (covered >= total) {
            this.ctf_data.phic_ben_is_enough = "1";
            } else {
            this.ctf_data.phic_ben_is_enough = "2";
            }

            this.checkDataStatus('certification');
        },

        async getDocumentType() {
            let response = await this.$services.getTransactionIpRefData({
                request_key: 'eclaim_document_type',
                category: "additional_attachment"
            })

            if(response.status === 200) {
                this.certification_items = response.data
            } else {
                this.alert = response.error
            }
        },

        // ADD SELECTED HIF_PAID_BY
        addSelectedHIF(value, event){
            if(event.includes(value)){
                this.ctf_data.co_hcf_paid_by.push({
                    co_hcf_paid_by: value
                })
                
                this.selected_hif_paid_by.push(value)
            }else{
                this.ctf_data.co_hcf_paid_by.forEach((element, index) => {
                    if(element.co_hcf_paid_by === value){
                        this.ctf_data.co_hcf_paid_by.splice(index, 1)
                    }
                })

                this.selected_hif_paid_by.forEach((element, index) => {
                    if(element === value){
                        this.selected_hif_paid_by.splice(index, 1)
                    }
                })
            }
            this.checkDataStatus('health');
        },

        // ADD SELECTED PF_PAID_BY
        addSelectedPF(value, event){
            if(event.includes(value)){
                this.ctf_data.co_pf_paid_by.push({
                    co_pf_paid_by: value
                })
                
                this.selected_pf_paid_by.push(value)
            }else{
                this.ctf_data.co_pf_paid_by.forEach((element, index) => {
                    if(element.co_pf_paid_by === value){
                        this.ctf_data.co_pf_paid_by.splice(index, 1)
                    }
                })

                this.selected_pf_paid_by.forEach((element, index) => {
                    if(element === value){
                        this.selected_pf_paid_by.splice(index, 1)
                    }
                })
            }
            this.checkDataStatus('professional');
        },

        // ADD ATTACHED FILE FOR ADDITIONAL
        addAttachedAdditional(){
            this.selected_doct_type_holder = this.selected_doc_type
            this.selected_doc_type = []
            let attached_files = []
            let re_attached_files = []
            this.new_additional_status = true
            let new_file_name = this.selected_doct_type_holder.doc_type+'_'+this.selected_doct_type_holder.group_type

            this.cert_data.section3.forEach(element => {
                attached_files.push(new_file_name+'_'+element.name)
            })

            this.view_attached_additional.forEach(element => {
                attached_files.push(new_file_name+'_'+element.name)
            })

            Object.values(this.$refs.additional.files).forEach(element => {
                if(attached_files.includes(new_file_name+'_'+element.name)){
                    re_attached_files.push('<br>'+new_file_name+'_'+element.name)
                }else{    
                    element.document_id = this.selected_doct_type_holder.document_id
                    element.group_type = this.selected_doct_type_holder.group_type
                    element.doc_type = this.selected_doct_type_holder.doc_type
                    
                    this.post_attached_additional.push(element)
                    this.view_attached_additional.push({
                        name: new_file_name+'_'+element.name,
                        file_size: Number(element.size * 0.00000095367432).toFixed(2),
                        file_path: window.URL.createObjectURL(element)
                    })
                }
            })

            if(re_attached_files.length > 0){
                let title = 'This file already exist and cannot be attached again.<b>' + re_attached_files + ' </b>'
                this.alert = { display: true, type: 'standard', width: '500', icon: 'mdi-close-circle', color: 'red', title: title, btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }
        },

        // REMOVE ATTACHED FILE FOR ADDITIONAL
        async removeAttachedAdditional(index, status){
            if(status === 'old'){
                this.cert_data.section3[index].loader = true

                let response = await this.$services.trnDelAttachment({
                    provider_code: this.$store.state.prv_data.provider_code,
                    // phic_tracking_number: this.trans_detail.phic_tracking_number,
                    transaction_number: this.trans_detail.transaction_number,
                    // attachment_category: 'ADDITIONAL ATTACHMENT',
                    file_name: this.cert_data.section3[index].file_name,
                    group_type: this.cert_data.section3[index].group_type
                });

                if (response.status === 200) {
                    if(response.data.success){
                        this.cert_data.section3.splice(index, 1)
                        this.saveData();
                    }else{
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                }   else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                
                // this.$axios.post(this.$cms_url+'resources/controller/trn_del_attachment.php', this.$qs.stringify({
                //     post_data: this.wsDataEncryption(JSON.stringify({
                //         provider_code: this.$store.state.prv_data.provider_code,
                //         // phic_tracking_number: this.trans_detail.phic_tracking_number,
                //         transaction_number: this.trans_detail.transaction_number,
                //         // attachment_category: 'ADDITIONAL ATTACHMENT',
                //         file_name: this.cert_data.section3[index].file_name,
                //         group_type: this.selected_doct_type_holder.group_type
                //     }))
                // }))
                // .then(response => {
                //     if(response.data.success){
                //         this.cert_data.section3.splice(index, 1)
                //         this.saveData();
                //     }else{
                //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                //     }
                // })
                // .catch(error => {
                //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                // })

            }else{
                this.post_attached_additional.splice(index - this.post_attached_additional.length, 1)
                this.view_attached_additional.splice(index - this.view_attached_additional.length, 1)
            }
            document.getElementById("attached-certification").value = "";
        },

        // POST ATTACHED FILE TO SERVER OF ADDITIONAL ATTACHMENT
        // postFileOfAdditional(){
        //     if(this.post_attached_additional.length === 0){
        //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        //     }else{
        //         this.$store.commit('set_prevent_navigation', false)
        //         this.loading_additional_attachment = true
        //         this.new_additional_status = 'Processing'

        //         let formData = new FormData();
        //         let total_count = this.post_attached_additional.length
        //         for( var i = 0; i < this.post_attached_additional.length; i++ ){
        //             let file = this.post_attached_additional[i];
        //             formData.append('file'+ i +'', file);
        //         }

        //         formData.append('post_data', this.wsDataEncryption(JSON.stringify({
        //             phic_tracking_number: this.trans_detail.phic_tracking_number,
        //             transaction_number: this.trans_detail.transaction_number,
        //             provider_user: this.$store.state.usr_credentials.user_name,
        //             department: this.$store.state.usr_credentials.department,
        //             provider_code: this.$store.state.prv_data.provider_code,
        //             provider_tin: this.$store.state.prv_data.provider_tin,
        //             attachment_category: 'ADDITIONAL ATTACHMENT',
        //             request_key: 'phic_patient_prov_attachments',
        //             total_count: total_count
        //         })))

        //         this.$axios.post(this.$tms_url+'resources/controller/trn_upd_inpatient_ctf.php', 
        //             formData,
        //             {
        //                 headers: {
        //                     'Content-Type': 'multipart/form-data'
        //                 }
        //             }
        //         )
        //         .then(response => {
        //             if(response.data.success){         
        //                 this.responseDataDecryption(response.data.file_path).forEach(element => {
        //                     let no_of_file = element.file_name.split('_')[0]
        //                     let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
        //                     let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

        //                     element.name = element.file_name.substring(sum)
        //                     element.loader = false
    
        //                     this.cert_data.section3.push(element)
        //                 })
                        
        //                 this.new_additional_status = false
        //                 this.post_attached_additional = []
        //                 this.view_attached_additional = []
        //                 this.loading_additional_attachment = false
        //                 this.$store.commit('set_prevent_navigation', true)
        //                 this.saveData();
        //             }else{
        //                 this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //             }
        //         })
        //         .catch(error => {
        //             this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //         })
        //     }
        // },

        // postFileOfAdditional(){
        //     console.log(this.post_attached_additional)
        //     if(this.post_attached_additional.length === 0){
        //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
        //     }else{
        //         this.$store.commit('set_prevent_navigation', false)
        //         this.loading_additional_attachment = true
        //         this.new_additional_status = 'Processing'

        //         let formData = new FormData();
        //         let total_count = this.post_attached_additional.length
        //         for( var i = 0; i < this.post_attached_additional.length; i++ ){
        //             let original_name = this.post_attached_additional[i].name
        //             let original_file = this.post_attached_additional[i];

        //             // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
        //             let new_name_file = `${this.selected_doct_type_holder.doc_type}_${this.selected_doct_type_holder.group_type}_${original_name}`;

        //             // CREATE A NEW FILE OBJECT NAME
        //             let file = new File([original_file], new_name_file, {
        //                 type: original_file.type,
        //                 lastModified: original_file.lastModified,
        //             });

        //             formData.append('file'+ i +'', file);
        //         }

        //         formData.append('post_data', this.wsDataEncryption(JSON.stringify({
        //             request_key: "additional_attachment",
        //             transaction_number: this.trans_detail.transaction_number,
        //             created_by: this.$store.state.usr_credentials.user_name,
        //             provider_code: this.$store.state.prv_data.provider_code,
        //             group_type: this.selected_doct_type_holder.group_type,
        //             attachment_category: 'ADDITIONAL ATTACHMENT',
        //             total_count: total_count
        //         })))

        //         this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_attached_files.php', 
        //             formData,
        //             {
        //                 headers: {
        //                     'Content-Type': 'multipart/form-data'
        //                 }
        //             }
        //         )
        //         .then(response => {
        //             if(response.data.success){         
        //                 this.responseDataDecryption(response.data.file_path).forEach(element => {
        //                     let no_of_file = element.file_name.split('_')[0]
        //                     let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
        //                     let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

        //                     element.name = element.file_name.substring(sum)
        //                     element.loader = false
    
        //                     this.cert_data.section3.push(element)
        //                 })
                        
        //                 this.new_additional_status = false
        //                 this.post_attached_additional = []
        //                 this.view_attached_additional = []
        //                 this.loading_additional_attachment = false
        //                 this.$store.commit('set_prevent_navigation', true)
        //                 this.saveData();
        //             }else{
        //                 this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: 'Something Went Wrong', body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //             }
        //         })
        //         .catch(error => {
        //             this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
        //         })
        //     }
        // },

        async postFileOfAdditional(){
            if(this.post_attached_additional.length === 0){
                this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-close-circle', color: 'red', title: 'No file chosen. Please attach file', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'closeAlert' }
            }else{
                this.$store.commit('set_prevent_navigation', false)
                this.loading_additional_attachment = true
                this.new_additional_status = 'Processing'
                let formData = new FormData();
                let total_count = this.post_attached_additional.length
                let file_datas = []

                for( var i = 0; i < this.post_attached_additional.length; i++ ){
                    let original_name = this.post_attached_additional[i].name
                    let original_file = this.post_attached_additional[i];

                    // GENERATE NEW NAME (CUSTOMIZE AS NEEDED)
                    let new_name_file = `${this.post_attached_additional[i].doc_type}_${this.post_attached_additional[i].group_type}_${original_name}`;

                    // CREATE A NEW FILE OBJECT NAME
                    let file = new File([original_file], new_name_file, {
                        type: original_file.type,
                        lastModified: original_file.lastModified,
                    });

                    file_datas.push({
                        document_id: this.post_attached_additional[i].document_id,
                        group_type: this.post_attached_additional[i].group_type
                    });
                    
                    formData.append('file'+ i +'', file);
                }

                formData.append('post_data', this.wsDataEncryption(JSON.stringify({
                    request_key: "additional_attachment",
                    transaction_number: this.trans_detail.transaction_number,
                    created_by: this.$store.state.usr_credentials.user_name,
                    provider_code: this.$store.state.prv_data.provider_code,
                    file_datas: file_datas,
                    attachment_category: 'ADDITIONAL ATTACHMENT',
                    total_count: total_count,
                    rth: this.trans_detail.eclaims_status === "RETURN" ? 1 : 0
                })))

                let response = await this.$services.trnAddEclaimsAttachedFiles({
                        formData
                });

                if (response.status === 200) {
                    if(response.status === 200) {
                        if(response.data.success){         
                            this.responseDataDecryption(response.data.file_path).forEach(element => {
                                let no_of_file = element.file_name.split('_')[0]
                                let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                                let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

                                element.name = element.file_name.substring(sum)
                                element.loader = false
                                element.group_type = this.selected_doct_type_holder.group_type
                                this.cert_data.section3.push(element)
                            })

                            this.new_additional_status = false
                            this.post_attached_additional = []
                            this.view_attached_additional = []
                            this.loading_additional_attachment = false
                            this.$store.commit('set_prevent_navigation', true)
                            this.saveData();
                        }else{
                            this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                        }
                    } else {
                        this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                    }
                }   else{
                    this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: response.error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                }
                
                // this.$axios.post(this.$cms_url+'resources/controller/trn_add_eclaims_attached_files.php', 
                //     formData,
                //     {
                //         headers: {
                //             'Content-Type': 'multipart/form-data'
                //         }
                //     }
                // )
                // .then(response => {
                //     if(response.status === 200) {
                //         if(response.data.success){         
                //             this.responseDataDecryption(response.data.file_path).forEach(element => {
                //                 let no_of_file = element.file_name.split('_')[0]
                //                 let provider = this.$store.state.prv_data.provider_tin ? this.$store.state.prv_data.provider_tin : this.$store.state.prv_data.provider_code
                //                 let sum = no_of_file.length + 8 + provider.length + this.trans_detail.transaction_number.length + 4

                //                 element.name = element.file_name.substring(sum)
                //                 element.loader = false

                //                 this.cert_data.section3.push(element)
                //             })

                //             this.new_additional_status = false
                //             this.post_attached_additional = []
                //             this.view_attached_additional = []
                //             this.loading_additional_attachment = false
                //             this.$store.commit('set_prevent_navigation', true)
                //             this.saveData();
                //         }else{
                //             this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                //         }
                //     } else {
                //         this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: this.wsDataDecryption(response.data.error_message), body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                //     }
                // })
                // .catch(error => {
                //     this.alert = { display: true, type: 'standard', width: '350', icon: 'mdi-alert-circle', color: 'red', title: error, body: 'Please try again', btn_pry_txt: 'OK', btn_pry_color: 'primary', btn_pry_otl: false, btn_pry_act: 'reloadPage' }
                // })
            }
        },

        // AUTO-COMPUTATION
        autoCompute(item){
            let hif_total_charges = parseFloat(this.ctf_data.co_hcf_total_actual_charges.toString().replace(/,/g, ''))
            let hif_amount_discount = parseFloat(this.ctf_data.co_hcf_amt_after_dsct.toString().replace(/,/g, ''))
            let hif_phic_benefit = parseFloat(this.ctf_data.co_hcf_phic_benefit.toString().replace(/,/g, ''))
            let pf_total_charges = parseFloat(this.ctf_data.co_pf_total_actual_charges.toString().replace(/,/g, ''))
            let pf_amount_discount = parseFloat(this.ctf_data.co_pf_amt_after_dsct.toString().replace(/,/g, ''))
            let pf_phic_benefit = parseFloat(this.ctf_data.co_pf_phic_benefit.toString().replace(/,/g, ''))
            let total_cpt_amount = parseFloat(this.cert_data.total_cpt_amount.toString().replace(/,/g, ''))

            if(item === 'hif'){
                let hif_amount_deduct = ''

                if(this.ctf_data.co_hcf_total_actual_charges !== '0.00' && this.ctf_data.co_hcf_amt_after_dsct === '0.00'){
                    this.ctf_data.co_hcf_amt_after_dsct = '0.00'
                    this.ctf_data.co_hcf_total_actual_charges = this.ctf_data.co_hcf_total_actual_charges.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    hif_amount_deduct = hif_total_charges - hif_phic_benefit

                    if(hif_total_charges < hif_phic_benefit){
                        hif_amount_deduct = '0.00'
                    }
                }else{
                    this.ctf_data.co_hcf_total_actual_charges = '0.00'
                    this.ctf_data.co_hcf_amt_after_dsct = this.ctf_data.co_hcf_amt_after_dsct.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    hif_amount_deduct = hif_amount_discount - hif_phic_benefit

                    if(hif_amount_discount < hif_phic_benefit){
                        hif_amount_deduct = '0.00'
                    }
                }

                if(hif_amount_deduct < 0){
                    this.ctf_data.co_hcf_amt_after_phic_deduc = '0.00'
                }else{
                    this.ctf_data.co_hcf_amt_after_phic_deduc = Number(hif_amount_deduct).toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
            }else if(item === 'pf'){
                let pf_amount_deduct = ''

                if(this.ctf_data.co_pf_total_actual_charges !== '0.00' && this.ctf_data.co_pf_amt_after_dsct === '0.00'){
                    this.ctf_data.co_pf_amt_after_dsct = '0.00'
                    this.ctf_data.co_pf_total_actual_charges = this.ctf_data.co_pf_total_actual_charges.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    pf_amount_deduct = pf_total_charges - pf_phic_benefit

                    if(pf_total_charges < pf_phic_benefit){
                        pf_amount_deduct = '0.00'
                    }
                }else{
                    this.ctf_data.co_pf_total_actual_charges = '0.00'
                    this.ctf_data.co_pf_amt_after_dsct = this.ctf_data.co_pf_amt_after_dsct.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    pf_amount_deduct = pf_amount_discount - pf_phic_benefit

                    if(pf_amount_discount < pf_phic_benefit){
                        pf_amount_deduct = '0.00'
                    }
                }

                if(pf_amount_deduct < 0){
                    this.ctf_data.co_pf_amt_after_phic_deduc = '0.00'
                }else{
                    this.ctf_data.co_pf_amt_after_phic_deduc = Number(pf_amount_deduct).toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
            }else if(item === 'purchase'){
                this.ctf_data.nco_total_cost_med_sup = this.ctf_data.nco_total_cost_med_sup.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }else{
                this.ctf_data.nco_total_cost_diagnostic_laboratory = this.ctf_data.nco_total_cost_diagnostic_laboratory.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            if((hif_total_charges + pf_total_charges) > total_cpt_amount){
                this.total_actual_charges_tooltip = true
                this.exceed_total_charges = 'exceed_total_charges'
            }else if(hif_total_charges > total_cpt_amount || pf_total_charges > total_cpt_amount){
                this.total_actual_charges_tooltip = true
                this.exceed_total_charges = 'exceed_total_charges'
            }else{
                this.total_actual_charges_tooltip = false
                this.exceed_total_charges = ''
            }
            
            this.checkDataStatus('certification');
        },

        // ADD DECIMAL ON BLUR
        addDecimal(item, value){
            if(item === 'hif_charges'){
                this.ctf_data.co_hcf_total_actual_charges = this.checkFormat(value)
            }else if(item === 'hif_discount'){
                this.ctf_data.co_hcf_amt_after_dsct = this.checkFormat(value)
            }else if(item === 'pf_charges'){
                this.ctf_data.co_pf_total_actual_charges = this.checkFormat(value)
            }else if(item === 'pf_discount'){
                this.ctf_data.co_pf_amt_after_dsct = this.checkFormat(value)
            }else if(item === 'purchase'){
                this.ctf_data.nco_total_cost_med_sup = this.checkFormat(value)
            }else if(item === 'diagnostic'){
                this.ctf_data.nco_total_cost_diagnostic_laboratory = this.checkFormat(value)
            }
        },

        // CHECK FORMAT
        checkFormat(value) {
            if (!value || value === '') return '';
            let num = parseFloat(value.toString().replace(/,/g, ''));
            if (isNaN(num)) return '';
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },

        onInputAmount(value, item) {
            const raw = value.toString().replace(/,/g, '');
            const parsed = parseFloat(raw);
            item.amount_input = isNaN(parsed) ? '' : parsed.toFixed(2);
        },

        // PREVENT USER FROM TYPING LETTERS IN TEXT FIELD
        numberOnly(e){
            const key = e.key;
            if (!/[\d.]$/.test(key)) {
                e.preventDefault();
            }

            if (key === '.' && e.target.value.includes('.')) {
                e.preventDefault();
            }
        },

        // DISPLAY COMMENT DATA
        displayCommentData(data){
            if(data === 'consumption'){
                this.comment_title = 'CERTIFICATION OF CONSUMPTION OF BENEFITS'
                this.comment_content = this.comment_data.cf2_part3_lettera
            }else if(data === 'consent'){
                this.comment_title = 'CONSENT TO ACCESS PATIENT RECORD'
                this.comment_content = this.comment_data.cf2_part3_letterb
            }else if(data === 'hci'){
                this.comment_title = 'CERTIFICATION OF HEALTH CARE INSTITUTION'
                this.comment_content = this.comment_data.cf2_part4
            }else{
                this.comment_title = 'CERTIFICATION OF ATTENDING PHYSICIAN/MIDWIFE'
                this.comment_content = this.comment_data.cf3_part2_number19
            }
            
            this.comment_dialog = true
        },

        // CHECK IF DATA HAS BEEN CHANGED
        checkDataStatus(data){
            this.$emit('change-status')

            if(data === 'certification'){
                this.ctf_data.status.certification = true

                if(this.ctf_data.phic_ben_is_enough === null || this.ctf_data.phic_ben_is_enough === '1'){
                    this.ctf_data.co_hcf_amt_after_dsct = '0.00'
                    this.ctf_data.co_hcf_amt_after_phic_deduc = '0.00'
                    this.ctf_data.co_hcf_total_actual_charges = '0.00'
                    if(this.ctf_data.co_hcf_paid_by.length > 0){
                        this.ctf_data.co_hcf_paid_by = []
                        this.selected_hif_paid_by = []
                        this.ctf_data.status.co_hcf_paid_by = true
                    }

                    this.ctf_data.co_pf_amt_after_dsct = '0.00'
                    this.ctf_data.co_pf_amt_after_phic_deduc = '0.00'
                    this.ctf_data.co_pf_total_actual_charges = '0.00' 
                    if(this.ctf_data.co_pf_paid_by.length > 0){
                        this.ctf_data.co_pf_paid_by = []
                        this.selected_pf_paid_by = []
                        this.ctf_data.status.co_pf_paid_by = true
                    }

                    this.total_purchase_amount = 'Total'
                    this.total_diagnostic_amount = 'Total'
                    this.ctf_data.nco_total_cost_diagnostic_laboratory = '0.00'
                    this.ctf_data.nco_total_cost_med_sup = '0.00'
                    this.exceed_total_charges = ''

                    this.ctf_data.total_health_inst_fees = this.checkFormat(this.ctf_data.total_health_inst_fees)
                    this.ctf_data.total_professional_fees = this.checkFormat(this.ctf_data.total_professional_fees)
                    this.ctf_data.grand_total = this.checkFormat(this.ctf_data.grand_total)

                    sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(this.ctf_data), 'pfdFxg44'))
                } else {
                    this.$nextTick(() => {
                        if (this.sf_discount_type) {
                            this.applyDiscountSFAll();
                        }
                    });
                }

                let philhealth_certification = {
                    co_hcf_total_actual_charges: parseFloat(this.ctf_data.co_hcf_total_actual_charges.toString().replace(/,/g, '')),
                    co_pf_total_actual_charges:  parseFloat(this.ctf_data.co_pf_total_actual_charges.toString().replace(/,/g, '')),
                    phic_ben_is_enough: this.ctf_data.phic_ben_is_enough
                }
                
                sessionStorage.setItem('kgdlDt', this.$crypto.AES.encrypt(JSON.stringify(philhealth_certification), 'vcoF535f'))
            }else if(data === 'health'){
                this.ctf_data.status.co_hcf_paid_by = true
            }else if(data === 'professional'){
                this.ctf_data.status.co_pf_paid_by = true
            }else if(data === 'other'){
                this.relation_reason.status = true
            }

            this.$emit('input', [this.unsaved_attachment, this.exceed_total_charges])
            this.saveData();
        },

        // calculateSummaryBalance(item) {
        //     if (!item || !Array.isArray(item.other_sources_list)) return;

        //     const amt = Number(item.amount) || 0;
        //     const disc = Number(item.mandatory_discount) || 0;
        //     const phil = Number(item.philhealth) || 0;

        //     const other_total = item.other_sources_list.reduce((sum, src) => {
        //         return sum + (Number(src.other_amount) || 0);
        //     }, 0);

        //     item.total_other_sources = other_total;
        //     item.balance = amt - (disc + phil + other_total);

        // }, 

        calculateSummaryBalance(item) {
            if (!item || !Array.isArray(item.other_sources_list)) return;

            const amt = Number(item.amount) || 0;
            const disc = Number(item.mandatory_discount) || 0;
            const phil = Number(item.philhealth) || 0;

            const other_total = item.other_sources_list.reduce((sum, src) => {
                return sum + (Number(src.other_amount) || 0);
            }, 0);

            item.total_other_sources = other_total;

            const balance = Math.max(0, amt - (disc + phil + other_total));
            item.balance = balance.toFixed(2)
        },

        calculateProfessionalBalance(item) {
            const amt = Number(item.amount) || 0;
            const disc = Number(item.discount) || 0;
            const phil = Number(item.philhealth) || 0;

            const other = (item.other_sources_list || []).reduce((sum, src) => {
                return sum + (Number(src.other_amount) || 0);
            }, 0);

            let balance = amt - (disc + phil + other);
            if (balance < 0) balance = 0; 
            item.balance = balance.toFixed(2)
            item.other_sources = other;
        },

        handlePaste(event) {
            event.preventDefault();
        },

        formatNumber(value) {
            return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },

        removeFormat(item, field) {
            const input_field = `${field}_input`;
            let val = item[input_field] || '';
            val = val.toString().replace(/[(),]/g, '').replace(/-/g, '');
            item[input_field] = val;
        },

        updateField(event, item, field) {
            const cleaned = event.replace(/[^\d.]/g, '');
            item[`${field}_input`] = cleaned;
            this.calculateSummaryBalance(item);
        },

        formatField(value) {
            const num = Number(value);
            if (!value || num === 0) return '-';
            return `(${this.formatNumber(num)})`;
        },

        onAmountInput(item) {
            let raw = item.amount_input?.toString().replace(/,/g, '') || '0';
            let parsed = parseFloat(raw);
            if (isNaN(parsed)) parsed = 0;
            item.amount = parsed;

            this.applyDiscountSFAll();
        },

        onBlurSF(item, field) {
            const input_field = `${field}_input`;
            let raw = item[input_field];
            let clean = (raw !== undefined && raw !== null ? raw.toString() : '').replace(/[^\d.]/g, '');
            let parsed = parseFloat(clean);

            if (isNaN(parsed)) parsed = 0;

            item[field] = parsed;
            item[input_field] = parsed; 
            this.checkDataStatus()
        },

        onBlurPF(item, field) {
            const input_field = `${field}_input`;
            let raw = item[input_field] != null ? String(item[input_field]) : '';
            let clean = raw.replace(/[^\d.]/g, '');
            let parsed = parseFloat(clean);

            if (isNaN(parsed)) parsed = 0;

            item[field] = parsed;
            item[input_field] = parsed === 0 ? '' : parsed.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            this.calculateProfessionalBalance(item);
            this.checkDataStatus()
        },

        onTotalBlur(field) {
            let input = this.total_summary_of_fees_data[`${field}_input`] || '0';
            input = input.toString().replace(/,/g, '');
            const numeric = parseFloat(input) || 0;
            this.total_summary_of_fees_data[`${field}_input`] = numeric.toFixed(2);

            this.checkDataStatus()
        },

        async applyDiscountSFAll() {
            const mandatory_rate = 0.20;

            this.summary_of_fees.forEach(item => {
                const raw = item.amount_input?.toString().replace(/,/g, '') || '0';
                const amount = parseFloat(raw);

                if (!amount || isNaN(amount)) {
                    item.mandatory_discount_input = '';
                    item.mandatory_discount = 0;   
                } else if (this.sf_discount_type === 'SENIOR CITIZEN' || this.sf_discount_type === 'PWD') {
                const discount = (amount * mandatory_rate).toFixed(2);
                    item.mandatory_discount_input = discount;
                    item.mandatory_discount = parseFloat(discount);  
                } else {
                    item.mandatory_discount_input = '';
                    item.mandatory_discount = 0;
                }
                this.onBlurSF(item, 'mandatory_discount');
                this.calculateSummaryBalance?.(item);
            });

            let total_mandatory_discount = this.summary_of_fees.reduce((sum, item) => {
                return sum + (parseFloat(item.mandatory_discount) || 0);
            }, 0);

            const format = parseFloat(total_mandatory_discount).toFixed(2);
            this.total_summary_of_fees_data.mandatory_discount = Number(format);
            this.total_summary_of_fees_data.mandatory_discount_input = Number(format);

            this.professional_fees.forEach(item => {
                if (!item.other_sources_list) {
                    this.$set(item, 'other_sources_list', []);
                }

                const raw = item.amount_input?.toString().replace(/,/g, '') || '0';
                const amount = parseFloat(raw);

                if (!amount || isNaN(amount)) {
                    item.discount_input = '';
                    item.discount = 0;
                } else if (this.sf_discount_type === 'SENIOR CITIZEN' || this.sf_discount_type === 'PWD') {
                    const discount = (amount * mandatory_rate).toFixed(2);
                    item.discount_input = discount;
                    item.discount = parseFloat(discount);
                } else {
                    item.discount_input = '';
                    item.discount = 0;
                }
                this.calculateProfessionalBalance?.(item);
            });

            this.checkDataStatus()
        },

        // async applyDiscountSFAll() {
        //     const mandatory_rate = 0.20;

        //     this.summary_of_fees.forEach(item => {
        //         const raw = item.amount_input?.toString().replace(/,/g, '') || '0';
        //         const amount = parseFloat(raw);

        //         if (!amount || isNaN(amount)) {
        //             item.mandatory_discount_input = '';
        //             return;
        //         }

        //         if (this.sf_discount_type === 'SENIOR CITIZEN' || this.sf_discount_type === 'PWD') {
        //             item.mandatory_discount_input = (amount * mandatory_rate).toFixed(2);
        //         } else {
        //             item.mandatory_discount_input = '';
        //         }
        //         let total_mandatory_discount = this.summary_of_fees.reduce((sum, item) => {
        //             let val = parseFloat(item.mandatory_discount_input);
        //             return sum + (isNaN(val) ? 0 : val);
        //         }, 0);

        //         const format = parseFloat(total_mandatory_discount).toFixed(2);
        //         this.total_summary_of_fees_data.mandatory_discount = Number(format);
        //         this.total_summary_of_fees_data.mandatory_discount_input = Number(format);


        //         this.onBlurSF(item, 'mandatory_discount');
        //         this.calculateSummaryBalance?.(item);
        //     });

        //     this.professional_fees.forEach(item => {
                
        //         if (!item.other_sources_list) {
        //             this.$set(item, 'other_sources_list', []);
        //         }

        //         const raw = item.amount_input?.toString().replace(/,/g, '') || '0';
        //         const amount = parseFloat(raw);

        //         if (!amount || isNaN(amount)) {
        //             item.mandatory_discount_input = '';
        //             return;
        //         }

        //         if (this.sf_discount_type === 'SENIOR CITIZEN' || this.sf_discount_type === 'PWD') {
        //             item.discount_input = (amount * mandatory_rate).toFixed(2);
        //         } else {
        //             item.discount_input = '';
        //         }
                
        //         this.onBlurPF(item, 'discount');
        //         this.calculateProfessionalBalance?.(item);
        //     });
        // },

        toggleAll() {
            if (this.switch_all) {
                this.panel = [...Array(this.fee_particulars.length).keys()];
            } else {
                this.panel = [];
            }
        },

        getSummaryItem(particular) {
            const item = this.summary_of_fees.find(item => item.fee_particulars === particular);

            if (item && (!item.other_sources_list || item.other_sources_list.length === 0)) {
                this.$set(item, 'other_sources_list', [{ other_desc: '', other_amount: 0 }]);
            }
            return item;
        },
        
        addOtherSource(particular) {
            const item = this.getSummaryItem(particular);
            if (!item.other_sources_list) {
                this.$set(item, 'other_sources_list', []);
            }
            item.other_sources_list.push({ other_desc: '', other_amount: 0 });
        },

        removeOtherSource(particular, index) {
            const item = this.getSummaryItem(particular);
            item.other_sources_list.splice(index, 1);
        },

        filteredOtherSources(fee_particulars) {
            if (fee_particulars === 'Room and Board') {
                return this.other_funding_sources;
            } else {
                return this.other_funding_sources.filter(src => src !== 'OTHERS');
            }
        },
        
        addOtherSourcePf(item) {
            if (!item.other_sources_list) {
                this.$set(item, 'other_sources_list', []);
            }
            item.other_sources_list.push({ other_desc: '', other_amount: 0 });
        },

        removeOtherSourcePf(item, index) {
            item.other_sources_list.splice(index, 1);
            this.calculateProfessionalBalance(item);
        },

        OtherSourcePf(index) {
            const item = this.professional_fees;
            item.other_sources_list.splice(index, 1);
            this.calculateProfessionalBalance(item); 
        },
        
        onSelectOtherSource(particular, index, selectedValue) {
            if (selectedValue === 'OTHERS') {
            this.other_sources.dialog = true;
            this.other_sources.new = '';
            this.other_sources.target_particular = particular;
            this.other_sources.target_index = index;
            }
        },

        saveOthersSources() {
            if (!this.other_sources.new || this.other_sources.target_particular === null || this.other_sources.target_index === null) return;

            const target_item = this.getSummaryItem(this.other_sources.target_particular);
            const custom_value = `OTHERS: ${this.other_sources.new}`;

            if (target_item && target_item.other_sources_list[this.other_sources.target_index]) {
                if (!this.other_funding_sources.includes(custom_value)) {
                    this.other_funding_sources.push(custom_value);
                }
                target_item.other_sources_list[this.other_sources.target_index].other_desc = custom_value;
            }

            this.other_sources.dialog = false;
            this.other_sources.new = '';
            this.other_sources.target_particular = null;
            this.other_sources.target_index = null;
        },

        saveFees(){
            this.ctf_data.summary_of_fees = this.summary_of_fees.map(item => {
                const other_funds = {
                    pcso: 0,
                    dswd: 0,
                    doh_map: 0,
                    hmo: 0
                };

                let other = '';
                let other_fund_amount = 0;

                item.other_sources_list.forEach(source => {
                    const desc = source.other_desc;
                    const amount = parseFloat(source.other_amount);
                    if (desc === 'PCSO') other_funds.pcso += amount;
                    else if (desc === 'DSWD') other_funds.dswd += amount;
                    else if (desc === 'DOHMAP') other_funds.doh_map += amount;
                    else if (desc === 'HMO') other_funds.hmo += amount;
                    else if (desc.startsWith('OTHERS')) {
                        if (item.fee_particulars === 'Room and Board') {
                            other = source.other_desc;
                            other_fund_amount = amount;
                        }
                    }
                });

                return {
                    fee_particulars: item.fee_particulars,
                    amount: item.amount ? item.amount : 0,
                    mandatory_discount: item.mandatory_discount,
                    philhealth: item.philhealth,
                    ...other_funds,
                    balance: item.balance,
                    ...(item.fee_particulars === 'Room and Board' ? { other, other_fund_amount } : {})
                };
            });

            this.ctf_data.mandatory_discount_type = this.sf_discount_type;

            this.ctf_data.total_summary_of_fees_data = {
                total_amount: this.total_summary_of_fees_input_based.amount,
                total_mandatory_discount: this.total_summary_of_fees_input_based.mandatory_discount,
                total_philhealth: this.total_summary_of_fees_input_based.philhealth,
                total_other_sources: this.total_summary_of_fees_input_based.other_sources,
                total_balance: this.total_summary_of_fees_input_based.balance
            };

            this.ctf_data.professional_fees = this.professional_fees.map(item => {
                const other_funds = {
                    pcso: 0,
                    dswd: 0,
                    doh_map: 0,
                    hmo: 0
                    //others: 0
                };

                item.other_sources_list.forEach(source => {
                    const desc = (source.other_desc)
                    const amount = parseFloat(source.other_amount);

                    if (desc === 'PCSO') other_funds.pcso += amount;
                    else if (desc === 'DSWD') other_funds.dswd += amount;
                    else if (desc === 'DOHMAP') other_funds.doh_map += amount;
                    else if (desc === 'HMO') other_funds.hmo += amount;
                });

                return {
                    physician_accre_no: item.physician_accre_no,
                    physician_name: item.physician_name,
                    amount: item.amount,
                    mandatory_discount: item.discount,
                    philhealth: item.philhealth,
                    ...other_funds,
                    balance: item.balance
                };
            });

            this.ctf_data.total_health_inst_fees = Number(String(this.ctf_data.total_health_inst_fees).replace(/,/g, '')) || 0;
            this.ctf_data.total_professional_fees = Number(String(this.ctf_data.total_professional_fees).replace(/,/g, '')) || 0;
            this.ctf_data.grand_total = Number(String(this.ctf_data.grand_total).replace(/,/g, '')) || 0;
        },

        // SAVE DATA TO SESSION STORAGE
        saveData() {
            this.saveFees();
            sessionStorage.setItem('rtYIWs4', this.$crypto.AES.encrypt(JSON.stringify(this.ctf_data), 'pfdFxg44'));
            sessionStorage.setItem('CLD5Y8', this.$crypto.AES.encrypt(JSON.stringify(this.cert_data), 'GOre24x5'));
            sessionStorage.setItem('PDFG5F', this.$crypto.AES.encrypt(JSON.stringify(this.relation_reason), 'XCdx3F9D'));
            },

    },

    destroyed(){
        this.saveData();
    }
}
</script>

<style scoped>
    .border-top{
        border-top: 1px solid grey;
        display: block;
    }
    .signature-line{
        border-top: 1px solid rgb(0, 0, 0);
    }
    ::v-deep .no-header-color .v-data-table-header {
        background-color: transparent !important;
    }
    .custom-table >>> .v-data-table-header th, .custom-table >>> .v-data-table-header td {
        background-color: transparent !important;
        color: #000 !important;
        border: transparent !important;
    }
    .custom-table >>> .v-data-table-header th{
        padding: 0 !important; 
        font-size: 14px;    
        line-height: 1 !important;  
        margin: 0 !important;   
        height: 45px !important;
        border-radius: 0 !important;
        border: transparent !important;
        font-weight: normal !important;
    }
    .custom-table, .custom-table >>> td, .custom-table >>> th  {
        border: 1px solid #505050 !important;
        overflow: hidden; 
        border: transparent !important;
    }
    .custom-table >>> .v-input__control {
        min-height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: transparent !important;
        box-shadow: none !important;
    }
    .custom-table >>> input {
        font-size: 16px !important;
        padding: 2px !important;
    }
    .custom-table >>> .v-data-table__wrapper tr, .custom-table >>> .v-data-table__wrapper tr td {
        height: 14px !important;         
        text-align: left !important; 
        padding: 0 !important;
        margin: 0 !important;
        line-height: 0.9 !important;
        vertical-align: middle !important;
    }
    .custom-table >>> v-text-field {
        height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .v-data-table td {
        vertical-align: middle;
    }
    .small-radio .v-label {
        font-size: 11px !important;
        line-height: 1.2;
    }
    .small-radio .v-input--selection-controls__ripple {
        width: 14px !important;
        height: 14px !important;
    }
    .small-radio .v-icon {
        font-size: 16px !important;
    }
    .v-expansion-panels {
        z-index: 0 !important;  
    }
     .attachment-name {
        cursor: pointer;
    }
    .attachment-name:hover {
        color: #1976D2;
        text-decoration: underline;
    }
</style>