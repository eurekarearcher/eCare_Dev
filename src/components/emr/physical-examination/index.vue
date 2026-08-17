<template>
    <div>
        <div v-if="$route.params.page !== 'physician-diagnosis-and-treatment-plan'">
            <PhysicalExamination 
                @emitData="emitData"
                @computeBMI="computeBMI"
                @numberOnly="numberOnly"
                @validatePEFields="validatePEFields"
                @numberOnlyWithDeci="numberOnlyWithDeci"
                :bp_empty_fields="bp_empty_fields"
                :bp_2nd_empty_fields="bp_2nd_empty_fields"
                :pex_empty_fields="pex_empty_fields"
                :hr_rr_temp_empty="hr_rr_temp_empty"
                :bp_systolic.sync="bp_systolic"
                :bp_diastolic.sync="bp_diastolic"
                :bp_2nd_systolic.sync="bp_2nd_systolic"
                :bp_2nd_diastolic.sync="bp_2nd_diastolic"
                :heart_rate.sync="heart_rate"
                :respiration_rate.sync="respiration_rate"
                :temp.sync="temp"
                :o2sat.sync="o2sat"
                :height.sync="height"
                :weight.sync="weight"
                :weight_for_age.sync="weight_for_age"
                :height_for_age.sync="height_for_age"
                :weight_for_height.sync="weight_for_height"
                :central_adiposity.sync="central_adiposity"
                :waist_circumference.sync="waist_circumference"
                :hip.sync="hip"
                :limbs.sync="limbs"
                :skin_for_thickness.sync="skin_for_thickness"
                :mid_upper_arm_circle.sync="mid_upper_arm_circle"
                :head_circle.sync="head_circle"
                :left_one.sync="left_one"
                :left_two.sync="left_two"
                :left_vision.sync="left_vision"
                :right_one.sync="right_one"
                :right_two.sync="right_two"
                :right_vision.sync="right_vision"
                :pe_validation="pe_validation"
                :patient_age="patient_age"
                :bmi_computation="bmi_computation"
                :emr_params="emr_params"
                :eligible_data="eligible_data"
            />
        </div>
        
        <div v-if="$route.params.page === 'physician-diagnosis-and-treatment-plan' || emr_params.routes === 'Consultation' || $store.state.usr_credentials.user_settings.user_layout === 'type_b'" class="mt-4">
            <GeneralSurvey 
                :general_survey.sync="general_survey"
                :other_general_survey.sync="other_general_survey"
                :general_survey_items="general_survey_items"
                :eligible_data="eligible_data"
            />

            <Assessment 
                @filterAssessmentStatus="filterAssessmentStatus"
                @filterAssessmentNormal="filterAssessmentNormal"
                @validateAssessment="validateAssessment"
                @insertOtherAssessment="insertOtherAssessment"
                @mutationStatus="emitData"
                :heent="heent"
                :chest="chest"
                :cvs="cvs"
                :abdomen="abdomen"
                :gui="gui"
                :pelvic="pelvic"
                :rectal="rectal"
                :musculoskeletal="musculoskeletal"
                :skin="skin"
                :neuro="neuro"
                :assessment_en.sync="assessment_en"
                :other_assessment="other_assessment"
                :assessment.sync="assessment"
                :eligible_data="eligible_data"
            />
        </div>

        <BMICalculationController ref="BMICalculationController" />
    </div>
</template>

<script>
import PhysicalExamination from '@/components/emr/physical-examination/PhysicalExamination.vue'
import GeneralSurvey from '@/components/emr/physical-examination/GeneralSurvey.vue'
import Assessment from '@/components/emr/physical-examination/Assessment.vue'
import { heent, chest, cvs, abdomen, gui, pelvic, rectal, musculoskeletal, skin, neuro } from '@/reference/physical-exam-list.json'
import BMICalculationController from '../../../controller/BMICalculationController.vue'
import { pe_validation } from '@/reference/physical-exam-validation.json'

export default {

    props: ['emr_params', 'patient_age', 'patient_birthdate', 'patient_gender', 'eligible_data', 'for_saving', 'member_data', 'selected_referral'],

    components: {
        BMICalculationController,
        PhysicalExamination,
        GeneralSurvey,
        Assessment
    },

    data() {
        return {
            bp_empty_fields: false,
            bp_systolic: '',
            bp_diastolic: '',
            bp_2nd_empty_fields: false,
            bp_2nd_systolic: '',
            bp_2nd_diastolic: '',
            heart_rate: '',
            respiration_rate: '',
            temp: '',
            o2sat: '',
            pex_empty_fields: false,
            hr_rr_temp_empty: false,
            height: '',
            weight: '',
            weight_for_age: '',
            height_for_age: '',
            weight_for_height: '',
            central_adiposity: '',
            waist_circumference: '',
            general_survey: [],
            other_general_survey: '',
            // heent: [],
            hip: '',
            limbs: '',
            skin_for_thickness: '',
            mid_upper_arm_circle: '0',
            head_circle: '',
            left_one: '',
            left_two: '',
            left_vision: '',
            right_one: '',
            right_two: '',
            right_vision: '',

            // other_heent: '',
            assessment: {
                chest: { assessment: [], others_notes: '' },
                cvs: { assessment: [], others_notes: '' },
                abdomen: { assessment: [], others_notes: '' },
                gui: { assessment: [], others_notes: '' },
                pelvic: { assessment: [], others_notes: '' },
                rectal: { assessment: [], others_notes: '' },
                musculoskeletal: { assessment: [], others_notes: '' },
                skin: { assessment: [], others_notes: '' },
                neuro: { assessment: [], others_notes: '' },
                heent: { assessment: [], others_notes: '' },
            },
            assessment_en: '',
            other_assessment: {
                dialog: false,
                category: '',
                new_val: ''
            },
            // assessment_empty_fields: false,
            panel:[0],
            tab:'',
            // REFERENCE DATA
            general_survey_items: [ "AWAKE AND ALERT", "ALTERED SENSORIUM", "CONSCIOUS", "COHERENT", "NOT IN CARDIO RESPIRATORY DISTRESS", "UNCONSCIOUS", "IN CARDIOPULMONARY DISTRESS" ],

            heent,
            chest,
            cvs,
            abdomen,
            gui,
            pelvic,
            rectal,
            musculoskeletal,
            skin,
            neuro,

            pe_validation,

            pe_post_data: {}
        }
    },

    computed: {
        bmi_computation() {
            let height = parseFloat(this.height)
            let weight = parseFloat(this.weight)
            let bmi_result = {
                bmi: '',
                remarks: ''
            }
            
            if (height > 0 && weight > 0) {
                bmi_result.bmi = (weight / (height / 100 * height / 100)).toFixed(2)
                
                if (bmi_result.bmi < 18.5) {
                    bmi_result.remarks = 'UNDERWEIGHT'
                } else if (bmi_result.bmi > 18.5 && bmi_result.bmi < 25) {
                    bmi_result.remarks = 'NORMAL WEIGHT'
                } else if (bmi_result.bmi > 25 && bmi_result.bmi < 30) {
                    bmi_result.remarks = 'OVERWEIGHT'
                } else {
                    bmi_result.remarks = 'OBESITY'
                }

                return bmi_result
            } else {
                return bmi_result
            }
        },
    },

    mounted(){
        this.checkIfEmpty();
        this.filterAssessmentStatus();

        if(this.emr_params.routes !== 'Consultation'){
            this.getPhysicalExamination()
        }
    },

    methods: {
        //GET THE PRREVIOUS RECORD OF THE PATIENT IN PRE CONSULTATION
        async getPatientRT(){
            //POPULATE PHYSICAL EXAM FROM REFERRAL DATA
            if (this.selected_referral) {
                if (this.selected_referral.bp1) {
                    const get_index_bp1 = this.selected_referral.bp1.indexOf('/')
                    this.bp_systolic = this.selected_referral.bp1.substring(0, get_index_bp1)
                    this.bp_diastolic = this.selected_referral.bp1.substring(get_index_bp1 + 1)
                }

                if (this.selected_referral.bp2) {
                    const get_index_bp2 = this.selected_referral.bp2.indexOf('/')
                    this.bp_2nd_systolic = this.selected_referral.bp2.substring(0, get_index_bp2)
                    this.bp_2nd_diastolic = this.selected_referral.bp2.substring(get_index_bp2 + 1)
                }
                
                this.height = this.selected_referral.height ? this.selected_referral.height : ''
                this.weight = this.selected_referral.weight ? this.selected_referral.weight : ''
                this.temp = this.selected_referral.temp ? this.selected_referral.temp : ''
                this.heart_rate = this.selected_referral.heart_rate ? this.selected_referral.heart_rate : ''
                this.o2sat = this.selected_referral.oxygen_saturation ? this.selected_referral.oxygen_saturation : ''
                this.respiration_rate = this.selected_referral.respiration_rate ? this.selected_referral.respiration_rate : ''
                this.waist_circumference = this.selected_referral.waist_circumference ? this.selected_referral.waist_circumference : ''
                this.central_adiposity = this.selected_referral.central_adiposity ? this.selected_referral.central_adiposity : ''
                this.hip = this.selected_referral.hip ? this.selected_referral.hip : ''
                this.skin_for_thickness = this.selected_referral.skin_for_thickness ? this.selected_referral.skin_for_thickness : ''
                this.limbs = this.selected_referral.limbs ? this.selected_referral.limbs : ''
                this.head_circle = this.selected_referral.head_circle ? this.selected_referral.head_circle : ''
                this.mid_upper_arm_circle = this.selected_referral.mid_upper_arm_circle ?this.selected_referral.mid_upper_arm_circle : ''

                if(this.selected_referral.left_vision) {
                    let left_vision = this.selected_referral.left_vision.split('/')
                    this.left_one = left_vision[0]
                    this.left_two = left_vision[1]
                }

                if(this.selected_referral.right_vision) {
                    let right_vision = this.selected_referral.right_vision.split('/')
                    this.right_one = right_vision[0]
                    this.right_two = right_vision[1]
                }

                this.selected_referral.general_survey.forEach(el => {
                    this.general_survey.push(el.general_survey)
                })

                for(let i in this.selected_referral.patient_assessment) {
                    if(i in this.selected_referral.patient_assessment) {
                    if(this.selected_referral.patient_assessment[i].other_notes !== '') {
                        this.selected_referral.patient_assessment[i].assessment = this.patient_assessment[i].assessment.push({ assessment_id: null, assessment: 'OTHERS: ' + this.selected_referral.patient_assessment[i].other_notes})
                    } else {
                        this.selected_referral.patient_assessment[i].assessment.forEach(el => {
                        this.assessment[i].assessment.push({ assessment_id: el.assessment_id, assessment: el.assessment })
                        })
                    }
                    }
                }

                this.emitData()
                this.filterAssessmentNormal()
            } else {
                let response = await this.$services.getPatientRecordAndTransaction({
                    request_key : 'patient_record',
                    hmo_policy_number : this.member_data.member.mem_hmo_policy_number,
                    hmo_host_code : this.member_data.member.mem_hmo_host_code,
                    ek_lgu_id : this.member_data.member.ek_lgu_id,
                    lgu_host_code : this.member_data.member.lgu_host_code,
                    ek_phic_id : this.member_data.member.ek_phic_id,
                    phic_host_code :  this.member_data.member.ek_phic_id ? 'PHIC' : null,
                })
    
                if(response.status === 200) {
                    response.data = this.responseDataDecryption(response.data)
    
                    if (response.data.has_data) {
                        this.height            = response.data.height
                        this.weight            = response.data.weight
                        this.bmi               = parseFloat(response.data.bmi)
                        this.bmi_remarks       = response.data.bmi_remarks
                        this.height_for_age    = response.data.height_for_age
                        this.weight_for_age    = response.data.weight_for_age
                        this.weight_for_height = response.data.weight_for_height
                        this.hip               = response.data.hip
                        this.skin_for_thickness= response.data.skin_for_thickness
                        this.limbs             = response.data.limbs
                        this.head_circle       = response.data.head_circle
                        this.mid_upper_arm_circle=response.data.mid_upper_arm_circle
                        this.left_vision       = response.data.left_vision
                        this.right_vision      = response.data.right_vision

                        //GET THE OTHER PHYSICAL EXAMINATION FOR EC LGU HOST CODE
                        if(this.$store.state.usr_credentials.lgu_host_code === 'SR') {
                            if (response.data.blood_pressure) {
                                const [systolic, diastolic] = response.data.blood_pressure.split('/')
                                this.bp_systolic = systolic
                                this.bp_diastolic = diastolic
                            }

                            if (response.data.blood_pressure_2nd) {
                                const [systolic_2nd, diastolic_2nd] = response.data.blood_pressure_2nd.split('/')
                                this.bp_2nd_systolic = systolic_2nd
                                this.bp_2nd_diastolic = diastolic_2nd
                            }

                            this.heart_rate        = response.data.heart_rate
                            this.respiration_rate  = response.data.respiration_rate
                            this.temp              = response.data.temp
                            this.o2sat             = response.data.oxygen_saturation,
                            this.waist_circumference = response.data.waist_circumference
                            this.central_adiposity = response.data.central_adiposity
                        }
                    }

                    this.has_previous_record = response.data.has_data === true ? true : false
    
                    if (this.left_vision) {
                        let [left_one, left_two] = this.left_vision.split('/')
                        this.left_one = left_one
                        this.left_two = left_two   
                    }
                    
                    if (this.right_vision) {
                        let [right_one, right_two] = this.right_vision.split('/')
                        this.right_one = right_one
                        this.right_two = right_two
                    }

                    let patient_record = {
                        height: this.height,
                        weight: this.weight,
                        bmi: this.bmi,
                        bmi_remarks: this.bmi_remarks,
                        height_for_age: this.height_for_age,
                        weight_for_age: this.weight_for_age,
                        weight_for_height: this.weight_for_height,
                        has_previous_record: this.has_previous_record,
                        hip: this.hip,
                        skin_for_thickness: this.skin_for_thickness,
                        limbs: this.limbs,
                        head_circle: this.head_circle,
                        mid_upper_arm_circle: this.mid_upper_arm_circle,
                        left_vision: this.left_vision,
                        left_one: this.left_one,
                        left_two: this.left_two,
                        right_vision: this.right_vision,
                        right_one: this.right_one,
                        right_two: this.right_two,
                        
                        heart_rate: this.heart_rate,
                        respiration_rate: this.respiration_rate,
                        temp: this.stemp,
                        o2sat: this.o2sat,
                        bp_systolic: this.bp_systolic,
                        bp_diastolic: this.bp_diastolic,
                        bp_2nd_systolic: this.bp_2nd_systolic,
                        bp_2nd_diastolic: this.bp_2nd_diastolic,
                        waist_circumference: this.waist_circumference,
                        central_adiposity: this.central_adiposity
                    }
                    this.emitData();
                    return patient_record
                } else {
                    this.alert = response.error
                }
            }
        },

        //GET THE LATEST PHYSICAL EXAMINATION IN EMR
        async getPhysicalExamination() {
            let physical_examination = sessionStorage.getItem('mmxcHF4s3') ? JSON.parse(this.$crypto.AES.decrypt(sessionStorage.getItem('mmxcHF4s3'), 'EMX246').toString(this.$crypto.enc.Utf8)) : {
                fresh_load: true,
            }

            if (physical_examination.fresh_load) {
                let response = await this.$services.getPatientRecordAndTransaction({
                    fetch_all_request: true,
                    transaction_number: this.emr_params.transaction_number,
                    hmo_policy_number: this.emr_params.hmo_policy_number,
                    hmo_host_code: this.emr_params.hmo_host_code,
                    ek_lgu_id: this.emr_params.ek_lgu_id,
                    lgu_host_code: this.emr_params.lgu_host_code,
                    ek_phic_id: this.emr_params.ek_phic_id,
                    phic_host_code: this.emr_params.phic_host_code,
                    mem_phic_pin: this.emr_params.mem_phic_pin
                })

                if (response.status === 200) {
                    response.data.physical_exam_data = this.responseDataDecryption(response.data.physical_exam_data)
                    response.data.patient_record = this.responseDataDecryption(response.data.patient_record)
                
                    if (response.data.physical_exam_data.blood_pressure) {
                        const [systolic, diastolic] = response.data.physical_exam_data.blood_pressure.split('/')
                        this.bp_systolic = systolic
                        this.bp_diastolic = diastolic
                    }

                    if (response.data.physical_exam_data.blood_pressure_2nd) {
                        const [systolic_2nd, diastolic_2nd] = response.data.physical_exam_data.blood_pressure_2nd.split('/')
                        this.bp_2nd_systolic = systolic_2nd
                        this.bp_2nd_diastolic = diastolic_2nd
                    }

                    this.heart_rate = response.data.physical_exam_data.heart_rate
                    this.respiration_rate = response.data.physical_exam_data.respiration_rate
                    this.temp = response.data.physical_exam_data.temp
                    this.o2sat = response.data.physical_exam_data.oxygen_saturation

                    this.height = response.data.patient_record.height
                    this.weight = response.data.patient_record.weight

                    this.weight_for_age = response.data.patient_record.weight_for_age
                    this.height_for_age = response.data.patient_record.height_for_age
                    this.weight_for_height = response.data.patient_record.weight_for_height

                    this.central_adiposity = response.data.physical_exam_data.central_adiposity
                    this.waist_circumference = response.data.physical_exam_data.waist_circumference

                    this.hip = response.data.patient_record.hip
                    this.skin_for_thickness = response.data.patient_record.skin_for_thickness
                    this.head_circle = response.data.patient_record.head_circle
                    this.mid_upper_arm_circle = response.data.patient_record.mid_upper_arm_circle
                    this.limbs = response.data.patient_record.limbs
                    this.left_vision = response.data.patient_record.left_vision
                    this.right_vision = response.data.patient_record.right_vision
                    
                    if(response.data.patient_record.left_vision) {
                        const [left_one, left_two] = response.data.patient_record.left_vision.split('/')
                        this.left_one = left_one,
                        this.left_two = left_two
                    }

                    if(response.data.patient_record.right_vision) {
                        const [right_one, right_two] = response.data.patient_record.right_vision.split('/')
                        this.right_one = right_one,
                        this.right_two = right_two
                    }
                    
                    const general_survey = this.responseDataDecryption(response.data.general_survey)
                    this.general_survey = general_survey.map(item => item.general_survey)
                    this.other_general_survey = general_survey.length > 0 ? general_survey[0].general_survey_notes : ''

                    this.assessment = {
                        chest: response.data.assessment.chest ? this.responseDataDecryption(response.data.assessment.chest) : { assessment: [], others_notes: '' },
                        cvs: response.data.assessment.cvs ? this.responseDataDecryption(response.data.assessment.cvs) : { assessment: [], others_notes: '' },
                        abdomen: response.data.assessment.abdomen ? this.responseDataDecryption(response.data.assessment.abdomen) : { assessment: [], others_notes: '' },
                        gui: response.data.assessment.gui ? this.responseDataDecryption(response.data.assessment.gui) : { assessment: [], others_notes: '' },
                        pelvic: response.data.assessment.pelvic ? this.responseDataDecryption(response.data.assessment.pelvic) : { assessment: [], others_notes: '' },
                        rectal: response.data.assessment.rectal ? this.responseDataDecryption(response.data.assessment.rectal) : { assessment: [], others_notes: '' },
                        musculoskeletal: response.data.assessment.musculoskeletal ? this.responseDataDecryption(response.data.assessment.musculoskeletal) : { assessment: [], others_notes: '' },
                        skin: response.data.assessment.skin ? this.responseDataDecryption(response.data.assessment.skin) : { assessment: [], others_notes: '' },
                        neuro: response.data.assessment.neuro ? this.responseDataDecryption(response.data.assessment.neuro) : { assessment: [], others_notes: '' },
                        heent: response.data.assessment.heent ? this.responseDataDecryption(response.data.assessment.heent) : { assessment: [], others_notes: '' }
                    };

                    this.filterAssessmentNormal()
                    
                    Object.keys(this.assessment).forEach(element => {
                        if (this.assessment[element].others_notes) {
                            this.assessment[element].assessment.push({
                                assessment_id: '99',
                                assessment: 'OTHERS: ' + this.assessment[element].others_notes
                            });

                            this.assessment[element].others_notes = 'OTHERS: ' + this.assessment[element].others_notes;
                        }
                    });

                    this.plan_data = this.responseDataDecryption(response.data.plan)

                    physical_examination.fresh_load = false
                    physical_examination.bp_systolic = this.bp_systolic
                    physical_examination.bp_diastolic = this.bp_diastolic
                    physical_examination.bp_2nd_systolic = this.bp_2nd_systolic
                    physical_examination.bp_2nd_diastolic = this.bp_2nd_diastolic
                    physical_examination.heart_rate = this.heart_rate
                    physical_examination.respiration_rate = this.respiration_rate
                    physical_examination.temp = this.temp
                    physical_examination.o2sat = this.o2sat
                    physical_examination.height = this.height
                    physical_examination.weight = this.weight
                    physical_examination.weight_for_age = this.weight_for_age
                    physical_examination.height_for_age = this.height_for_age
                    physical_examination.weight_for_height = this.weight_for_height
                    physical_examination.central_adiposity = this.central_adiposity
                    physical_examination.waist_circumference = this.waist_circumference
                    physical_examination.general_survey = this.general_survey
                    physical_examination.other_general_survey = this.other_general_survey
                    // physical_examination.heent = this.heent
                    // physical_examination.other_heent = this.other_heent
                    physical_examination.assessment = this.assessment
                    physical_examination.plan_data = this.plan_data
                    physical_examination.limbs = this.limbs
                    physical_examination.head_circle = this.head_circle
                    physical_examination.mid_upper_arm_circle = this.mid_upper_arm_circle
                    physical_examination.skin_for_thickness = this.skin_for_thickness
                    physical_examination.hip = this.hip
                    physical_examination.left_vision = this.left_vision
                    physical_examination.right_vision = this.right_vision
                    
                    sessionStorage.setItem('mmxcHF4s3', this.$crypto.AES.encrypt(JSON.stringify(physical_examination), 'EMX246'))
                    return {
                        bmi_computation: this.bmi_computation,
                        ...physical_examination,
                    }
                } else {
                    this.alert = response.error
                }
            } else {
                this.bp_systolic = physical_examination.bp_systolic
                this.bp_diastolic = physical_examination.bp_diastolic
                this.bp_2nd_systolic = physical_examination.bp_2nd_systolic
                this.bp_2nd_diastolic = physical_examination.bp_2nd_diastolic
                this.heart_rate = physical_examination.heart_rate
                this.respiration_rate = physical_examination.respiration_rate
                this.temp = physical_examination.temp
                this.o2sat = physical_examination.o2sat
                this.height = physical_examination.height
                this.weight = physical_examination.weight
                this.weight_for_age = physical_examination.weight_for_age
                this.height_for_age = physical_examination.height_for_age
                this.weight_for_height = physical_examination.weight_for_height
                this.central_adiposity = physical_examination.central_adiposity
                this.waist_circumference = physical_examination.waist_circumference
                this.general_survey = physical_examination.general_survey
                this.other_general_survey = physical_examination.other_general_survey
                // this.heent = physical_examination.heent
                // this.other_heent = physical_examination.other_heent
                this.assessment = physical_examination.assessment
                this.plan_data = physical_examination.plan_data
                this.limbs = physical_examination.limbs
                this.mid_upper_arm_circle = physical_examination.mid_upper_arm_circle
                this.skin_for_thickness = physical_examination.skin_for_thickness
                this.hip = physical_examination.hip
                this.head_circle = physical_examination.head_circle

                if(physical_examination.left_vision) {
                    const [left_one, left_two] = physical_examination.left_vision.split('/')
                    this.left_one = left_one,
                    this.left_two = left_two
                }

                if(physical_examination.right_vision) {
                    const [right_one, right_two] =  physical_examination.right_vision.split('/')
                    this.right_one = right_one,
                    this.right_two = right_two
                }

                this.filterAssessmentNormal()

                return {
                    bmi_computation: this.bmi_computation,
                    ...physical_examination,
                }
            }
        },

        filterAssessmentNormal() {
            let count_assesment_normal = []
                
            for(let element in this.assessment) {
                this.assessment[element].assessment.forEach(data => {
                    if(data.assessment === 'Essentially normal' || data.assessment === 'ESSENTIALLY NORMAL') {
                        count_assesment_normal.push(data.assessment)
                    } 
                })
            }
            
            if(count_assesment_normal.length >= 10) {
                this.assessment_en = true
            } else {
                this.assessment_en = false
            }
        },

        filterAssessmentStatus() {
            const status_filter = [
                'heent', 'chest', 'cvs', 'abdomen', 'gui', 
                'pelvic', 'rectal', 'musculoskeletal', 'skin', 'neuro'
            ];

            if (this.eligible_data.konsulta_eligible) {
                status_filter.forEach(key => {
                    if (this[key]) {
                        this[key] = this[key].filter(item => item.assessment_status === 'A');
                    }
                });
            } 
        },

        async postData(pex_data_value) {
            let blood_pressure = '';
            if (this.bp_systolic || this.bp_diastolic) {
                blood_pressure = this.bp_systolic + '/' + this.bp_diastolic;
            }

            let blood_pressure_2nd = '';
            if (this.bp_2nd_systolic || this.bp_2nd_diastolic) {
                blood_pressure_2nd = this.bp_2nd_systolic + '/' + this.bp_2nd_diastolic;
            }

            // REMOVE OTHER ASSESSMENT
            const get_keys = Object.keys(pex_data_value.assessment);
            get_keys.forEach(category => {
                const data = pex_data_value.assessment[category];

                if (data.others_notes) {
                    // Remove matching "OTHERS" entry in assessment array
                    data.assessment = data.assessment.filter(item => item.assessment !== data.others_notes);

                    // Remove "OTHERS: " prefix from the notes before posting
                    data.others_notes = data.others_notes.replace(/^OTHERS:\s*/i, '');
                } else {
                    data.others_notes = null;
                }
            });

            // DEFAULT VALUE FOR ASSESSMENT IN EKONSULTA ELIGIBLE
            if ((this.eligible_data.konsulta_eligible || this.eligible_data.eclaims_eligible) && !this.for_saving) {
                for (let key in pex_data_value.assessment) {
                    const assessment_item = pex_data_value.assessment[key];

                    if (assessment_item.assessment && assessment_item.assessment.length > 0) {
                        // Remove "ESSENTIALLY NORMAL" only if there are other assessments present
                        assessment_item.assessment = assessment_item.assessment.filter(
                            item => !(item.assessment === "ESSENTIALLY NORMAL" && assessment_item.assessment.length > 1)
                        );
                    } else {
                        // If no assessments and no `others_notes`, check for default "ESSENTIALLY NORMAL"
                        if ((!assessment_item.assessment || assessment_item.assessment.length === 0) && (!assessment_item.others_notes || assessment_item.others_notes.trim() === "")) {
                            const default_options = this[key];
                            if (Array.isArray(default_options)) {
                                const default_assessment = default_options.find(item => item.assessment === "ESSENTIALLY NORMAL");
                                if (default_assessment) {
                                    assessment_item.assessment = [
                                        {
                                            assessment_id: default_assessment.assessment_id,
                                            assessment: default_assessment.assessment,
                                        },
                                    ];
                                }
                            }
                        }
                    }
                }
            }

            let response = await this.$services.trnUpdatePatientTranRecord({
                request_key: 'physical_examination',
                transaction_number: this.emr_params.transaction_number,
                phic_tracking_number: '',
                operator_name: this.$store.state.usr_credentials.user_name,
                hmo_policy_number: this.emr_params.hmo_policy_number,
                ek_phic_id: this.emr_params.ek_phic_id,
                ek_lgu_id: this.emr_params.ek_lgu_id,
                ek_hmo_id: this.emr_params.ek_hmo_id,
                phic_host_code: this.emr_params.phic_host_code,
                lgu_host_code: this.emr_params.lgu_host_code,

                bp: blood_pressure,
                blood_pressure_2nd: blood_pressure_2nd,
                heart_rate: this.heart_rate,
                rr: this.respiration_rate,
                temp: this.temp,
                oxygen_saturation: this.o2sat,
                ht: this.height,
                wt: this.weight,
                bmi: this.bmi_computation.bmi,
                remarks: this.bmi_computation.remarks,
                weight_for_age: this.weight_for_age,
                height_for_age: this.height_for_age,
                weight_for_height: this.weight_for_height,
                central_adiposity: this.central_adiposity,
                waist_circumference: this.waist_circumference,
                general_survey: pex_data_value.general_survey,
                general_survey_notes: pex_data_value.other_general_survey,
                hip: this.hip,
                skin_for_thickness: this.skin_for_thickness,
                head_circle: this.head_circle,
                mid_upper_arm_circle: this.mid_upper_arm_circle,
                limbs: this.limbs,
                left_vision: this.left_vision,
                right_vision: this.right_vision,
                patient_assessment: pex_data_value.assessment,
                process_by: this.$store.state.usr_credentials.user_name
            });

            if (response.status === 200) {
                sessionStorage.removeItem('mmxcHF4s3');
                return true;
            } else {
                this.alert = response.error;
            }
        },

        computeBMI() {
            if (this.patient_age < 5) {
                this.weight_for_age = this.$refs.BMICalculationController.getWeightForAge(this.patient_birthdate, this.weight, this.patient_gender);
                this.height_for_age = this.$refs.BMICalculationController.getHeightForAge(this.patient_birthdate, this.height, this.patient_gender);
                this.weight_for_height = this.$refs.BMICalculationController.getWeightForHeight(this.patient_birthdate, this.height, this.weight, this.patient_gender);
            }

            this.emitData();
        },

        validateAssessment(data, category) {
            const map = data.filter(element => element && element.assessment).map(element => element.assessment);

            if (map.includes('OTHERS')) {
                this.other_assessment.dialog = true;
                this.other_assessment.category = category;
            }

            const index_normal = data.findIndex(element => element.assessment === 'ESSENTIALLY NORMAL' && element.assessment_id);
            const not_normal = data.findIndex(element => element.assessment !== 'ESSENTIALLY NORMAL' && element.assessment_id);
            
            if (index_normal !== -1 && map.includes('ESSENTIALLY NORMAL') && map.length > 1) {
                data.splice(index_normal, 1);
            }

            if (not_normal !== -1 && map.includes('ESSENTIALLY NORMAL') && map.length > 1) {
                data.splice(not_normal, 10);
            }

            this.filterAssessmentNormal();
            this.emitData();
        },

        getAssessment() {
            for (let element in this.assessment) {
                if(this.assessment_en) {
                    this.assessment[element].assessment = []
                    this.assessment[element].assessment.push(this[element][0])
                    this.emitData()
                } else {
                    this.assessment[element].assessment = []
                }
            }
        },

        insertOtherAssessment(status, category) {
            if (status === 'confirm') {
                // DELETE FIRST OTHERS
                let first_other = null

                this.assessment[category].assessment.forEach((element, index) => {
                    if (element.assessment === 'OTHERS') first_other = index
                })

                this.assessment[category].assessment.splice(first_other, 1)

                // DELETE PREVIOUS OTHERS
                let previous_other = null

                this.assessment[category].assessment.forEach((element, index) => {
                    if (element.assessment.substring(0, 6) === 'OTHERS') previous_other = index
                })

                if (previous_other !== null) this.assessment[category].assessment.splice(previous_other, 1)
                
                // INSERT NEW OTHERS
                this.assessment[category].assessment.push({
                    assessment_id: '99',
                    assessment: 'OTHERS: ' + this.other_assessment.new_val
                })
                
                this.assessment[category].others_notes = 'OTHERS: ' + this.other_assessment.new_val
            } else {
                this.assessment[category]['assessment'].pop()
            }
            
            this.other_assessment.dialog = false
            this.other_assessment.new_val = ''
            this.emitData();
        },

        numberOnly(event) {
            if ((event.which < 48 || event.which > 57) && event.which !== 45) {
                event.preventDefault();
            }
        },

        numberOnlyWithDeci(event, value) {
            if (((event.which != 46 || (event.which == 46 && value == '')) || value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        },

        checkIfEmpty() { 
            let has_empty = false

            if (!this.height || !this.weight) {
                has_empty = true
                this.pex_empty_fields = true
            }

            if (this.bp_systolic || this.bp_diastolic) {
                if (!this.bp_systolic || !this.bp_diastolic) {
                    has_empty = true
                    this.bp_empty_fields = true
                }
            }

            if(this.eligible_data.konsulta_eligible || this.eligible_data.eclaims_eligible) {
                if(!this.bp_systolic || !this.bp_diastolic || !this.heart_rate || !this.respiration_rate || !this.temp) {
                    has_empty = true
                    this.pex_empty_fields = true
                    this.bp_empty_fields = true
                    this.hr_rr_temp_empty = true
                }
            }

            Object.keys(this.pe_validation).forEach(data => {
                if(this.pe_validation[data].has_error) {
                    has_empty = true
                }
            });

            return has_empty
        },

        emitData() {
            const data = {
                bp_systolic: this.bp_systolic,
                bp_diastolic: this.bp_diastolic,
                bp_2nd_systolic: this.bp_2nd_systolic,
                bp_2nd_diastolic: this.bp_2nd_diastolic,
                blood_pressure:  this.blood_pressure,
                blood_pressure_2nd: this.blood_pressure_2nd,
                heart_rate: this.heart_rate,
                respiration_rate: this.respiration_rate,
                temp: this.temp,
                oxygen_saturation: this.o2sat,
                height: this.height,
                weight: this.weight,
                central_adiposity: this.central_adiposity,
                waist_circumference: this.waist_circumference,
                bmi_computation: this.bmi_computation,
                general_survey: this.general_survey,
                general_survey_notes: this.other_general_survey,
                assessment: this.assessment,
                left_one: this.left_one,
                left_two: this.left_two,
                left_vision: this.left_one + "/" + this.left_two,
                right_one: this.right_one,
                right_two: this.right_two,
                right_vision: this.right_one + "/" + this.right_two,
                weight_for_age: this.weight_for_age,
                height_for_age: this.height_for_age,
                weight_for_height: this.weight_for_height,
                hip: this.hip,
                skin_for_thickness: this.skin_for_thickness,
                head_circle: this.head_circle,
                mid_upper_arm_circle: this.mid_upper_arm_circle,
                limbs: this.limbs,
            }

            this.$emit('mutationStatus', 'pex', data)
        },

        validatePEFields(key, value) {
            //KEY NAME OF THE V-MODEL IN THE INPUT FIELDS. //VALUE DATA FROM INPUT FIELDS.
            if(value !== '') {
                if(value < this.pe_validation[key].minimum) {
                    this.pe_validation[key].err_msg = `${this.pe_validation[key].title}: MINIMUM OF ${this.pe_validation[key].minimum} ${this.pe_validation[key].sub_title}`
                    this.pe_validation[key].has_error = true
                } else if(value > this.pe_validation[key].maximum) {
                    this.pe_validation[key].err_msg = `${this.pe_validation[key].title}: MAXIMUM OF ${this.pe_validation[key].maximum} ${this.pe_validation[key].sub_title}`
                    this.pe_validation[key].has_error = true
                } else {
                    this.pe_validation[key].err_msg = ""
                    this.pe_validation[key].has_error = false
                }
            } else {
                this.pe_validation[key].err_msg = ""
                this.pe_validation[key].has_error = false
            }
        }
    }
}
</script>

<style scoped>
.card-border {
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 24px;
    background-color: white; 
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

</style>