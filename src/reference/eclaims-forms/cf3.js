import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import check_icon from '../../assets/check.png'
import mixin from '@/mixin'

export const getCF3 = async (has_pdf, cforms_data) => {
    let font_color_r = 0.13
    let font_color_g = 0.13
    let font_color_b = 0.13
    let size_text = 7

    const existing_pdf_bytes = await fetch(has_pdf).then(res => res.arrayBuffer())
    const pdf_doc = await PDFDocument.load(existing_pdf_bytes)
    const font = await pdf_doc.embedFont(StandardFonts.Helvetica)
    const l_check_icon = await fetch(check_icon).then(res => res.arrayBuffer())


    // const check_imge_icon = await pdf_doc.embedPng(l_check_icon)

    // const pages = pdf_doc.getPages()

    // Create a new PDF to hold modified pages
    const cf_pdf = await PDFDocument.create();
    // const check_imge_icon = await cf_pdf.embedPng(l_check_icon)
    // const doctor_signed = await fetch(cforms_data.accreditation_and_signature.TRANSACTION.doctor_sign_path).then(res => res.arrayBuffer())
    // const doctor_signed_img = await cf_pdf.embedPng(doctor_signed)
    const pagesCount = pdf_doc.getPageCount();

    // const loadPng = async (url) => url ? fetch(url).then(r => (r.ok ? r.arrayBuffer() : null)).then(buf => (buf ? pdf_doc.embedPng(buf) : null)).catch(() => null) : null;
    const loadPng = async (url) => url ? fetch(url).then(r => (r.ok ? r.arrayBuffer() : null)).then(buf => (buf ? cf_pdf.embedPng(buf) : null)).catch(() => null) : null;
    const check_imge_icon = await cf_pdf.embedPng(l_check_icon)
    const doctor_sign_image = cforms_data.accreditation_and_signature.TRANSACTION.doctor_sign_path ? await loadPng(cforms_data.accreditation_and_signature.TRANSACTION.doctor_sign_path) : ''
    
    // const pdf_page = pages
    // const pdf_page_two = pages[1]

    let pdf_item_data_one = [{
        hic_accreditation_no: { 
            name: (cforms_data.hci.accreditation_no || '').replace(/-/g, ''),
            x: [ 290, 306, 324, 340, 358, 374, 392, 408, 426 ],
            y: 836,
            type: 'date_time'
        },

        p_full_name: { name: `${cforms_data.patient_data.PATIENT_DATA.last_name}  ${cforms_data.patient_data.PATIENT_DATA.first_name}  ${cforms_data.patient_data.PATIENT_DATA.suffix}  ${cforms_data.patient_data.PATIENT_DATA.middle_name}`, x: 26, y: 792, type: 'text'}, // PATIENT LAST NAME
        
        chief_complaint: { name: cforms_data.patient_confinement.PATIENT_DATA.chief_complaint ? cforms_data.patient_confinement.PATIENT_DATA.chief_complaint : '' , x: 432, y: 792, width:160, type: 'text_wrap'}, // PATIENT CHIEF COMPLAINT
        
        date_confinement_admitted: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.date_admitted || '').replace(/-/g, ''),
            x: [ 106, 118, 146, 158, 186, 198, 208, 220 ],
            y: 756,
            type: 'date_time'
        },

        time_admitted: { 
            name: (mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_admitted) || '').replace(/:/g, ''),
            x: mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_admitted).includes('PM') ? [ 366, 374, 378 ] : [ 316, 324, 328 ],
            y: 759,
            type: 'date_time'
        },

        date_discharged: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.date_discharged || '').replace(/-/g, ''),
            x: [ 106, 118, 146, 158, 186, 198, 208, 220 ],
            y: 726,
            type: 'date_time'
        },
                
        time_discharged: { 
            name: (mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_discharged) || '').replace(/:/g, ''),
            x: mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_admitted).includes('PM') ? [ 366, 374, 378 ] : [ 316, 324, 328 ],
            y: 726,
            type: 'date_time'
        },

        history_of_illness: { name: cforms_data.patient_confinement.PATIENT_DATA.illness_hstry ? cforms_data.patient_confinement.PATIENT_DATA.illness_hstry : '', x: 20, y: 670, type: 'text'}, // PATIENT HISTORY OF ILLNESS
        general_survey: { name: cforms_data.physical_exam.PE_DATA.general_survey ? cforms_data.physical_exam.PE_DATA.general_survey : '', x: 84, y: 526, type: 'text'},

        vital_signs_bp: { name: cforms_data.physical_exam.PE_DATA.vital_sign_bp ? cforms_data.physical_exam.PE_DATA.vital_sign_bp : '', x: 116, y: 500, type: 'text'},
        vital_sign_cr: { name: cforms_data.physical_exam.PE_DATA.vital_sign_cr ? cforms_data.physical_exam.PE_DATA.vital_sign_cr : '', x: 166, y: 500, type: 'text'},
        vital_sign_rr: { name: cforms_data.physical_exam.PE_DATA.vital_sign_rr ? cforms_data.physical_exam.PE_DATA.vital_sign_rr : '', x: 224, y: 500, type: 'text'},
        vital_sign_temp: { name: cforms_data.physical_exam.PE_DATA.vital_sign_temp ? cforms_data.physical_exam.PE_DATA.vital_sign_temp : '', x: 314, y: 500, type: 'text'},

        pe_heent: {
            name: cforms_data.physical_exam.PE_DATA.pe_heent ? cforms_data.physical_exam.PE_DATA.pe_heent : [],
            x: 94,
            y: 472,
            type: 'array_object'
        },

        pe_chest_lungs: {
            name: cforms_data.physical_exam.PE_DATA.pe_chest_lungs ? cforms_data.physical_exam.PE_DATA.pe_chest_lungs : [],
            x: 94,
            y: 442,
            type: 'array_object'
        },

        pe_cvs: {
            name: cforms_data.physical_exam.PE_DATA.pe_cvs ? cforms_data.physical_exam.PE_DATA.pe_cvs : [],
            x: 94,
            y: 414,
            type: 'array_object'
        },

        pe_abdomen: {
            name: cforms_data.physical_exam.PE_DATA.pe_abdomen ? cforms_data.physical_exam.PE_DATA.pe_abdomen : [],
            x: 460,
            y: 500,
            type: 'array_object'
        },

        pe_gu_ie: {
            name: cforms_data.physical_exam.PE_DATA.pe_gu_ie ? cforms_data.physical_exam.PE_DATA.pe_gu_ie : [],
            x: 460,
            y: 472,
            type: 'array_object'
        },

        pe_skin_extremities: {
            name: cforms_data.physical_exam.PE_DATA.pe_skin_extremities ? cforms_data.physical_exam.PE_DATA.pe_skin_extremities : [],
            x: 460,
            y: 442,
            type: 'array_object'
        },

        pe_neuro_exam: {
            name: cforms_data.physical_exam.PE_DATA.pe_neuro_exam ? cforms_data.physical_exam.PE_DATA.pe_neuro_exam : [],
            x: 460,
            y: 414,
            type: 'array_object'
        },

        disposition_discharged: { 
            name: check_imge_icon, 
            ...(
                cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment === 'IMPROVED' ? { x: 136, y: 58} : 
                cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment === 'HAMA' ? { x: 310, y: 58} :
                cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment === 'EXPIRED' ? { x: 468, y: 58} :
                cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment === 'ABSCONDED' ? { x: 396, y: 58} :
                cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment === 'TRANSFERRED' ? { x: 220, y: 58} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        ini_prenatal_consul_date: { 
            name: cforms_data.maternity.MATERNITY_DATA.ini_prenatal_consul_date ?  (mixin.methods.formatDate(cforms_data.maternity.MATERNITY_DATA.ini_prenatal_consul_date)).replace(/-/g, '') : '',
            x: [ 196, 204, 226, 236, 256, 266, 274, 282 ],
            y: 922,
            type: 'date_time_p2'
        },

        vital_sign_is_normal: { 
            name: check_imge_icon, 
            ...(
                cforms_data.maternity.MATERNITY_DATA.vital_sign_is_normal === 'Y' ? { x: 218, y: 880} : 
                { x: -100, y: -100}
            ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        prsnt_preg_is_low_risk: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.prsnt_preg_is_low_risk === 'Y' ? { x: 218, y: 858} :  { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        age_of_menarche: { name: cforms_data.maternity.MATERNITY_DATA.age_of_menarche ? cforms_data.maternity.MATERNITY_DATA.age_of_menarche : '', x: 502, y: 884, type: 'text_p2'},

        multiple_pregnancy: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.multiple_pregnancy === 'Y' ? { x: 126, y: 826} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        ovarian_cyst: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.ovarian_cyst === 'Y' ? { x: 126, y: 812} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        myoma_uteri: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.myoma_uteri === 'Y' ? { x: 126, y: 798} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        placenta_previa: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.placenta_previa === 'Y' ? { x: 264, y: 826} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        miscarriages: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.miscarriages === 'Y' ? { x: 264, y: 812} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        still_birth: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.still_birth === 'Y' ? { x: 264, y: 798} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },


        pre_eclampsia: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.pre_eclampsia === 'Y' ? { x: 394, y: 826} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        eclampsia: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.eclampsia === 'Y' ? { x: 394, y: 812} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        premature_contraction: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.OBSTETRIC_RISK_FACTOR.premature_contraction === 'Y' ? { x: 394, y: 798} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        hypertension: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.hypertension === 'Y' ? { x: 126, y: 768} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        heart_disease: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.heart_disease === 'Y' ? { x: 126, y: 754} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        diabetes: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.diabetes === 'Y' ? { x: 126, y: 740} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        thyroid_disaster: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.thyroid_disaster === 'Y' ? { x: 264, y: 768} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        obesity: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.obesity === 'Y' ? { x: 264, y: 754} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        asthma: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.asthma === 'Y' ? { x: 264, y: 740} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        epilepsy: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.epilepsy === 'Y' ? { x: 394, y: 768} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        renal_disease: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.renal_disease === 'Y' ? { x: 394, y: 754} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        bleeding_disorder: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.bleeding_disorder === 'Y' ? { x: 394, y: 740} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        previous_cs: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.previous_cs === 'Y' ? { x: 558, y: 768} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        uterine_myomectomy: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MED_SURG_RISK_FACTOR.uterine_myomectomy === 'Y' ? { x: 558, y: 754} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        admission_diagnosis: {
            name: cforms_data.patient_confinement.ADMISSION_DIAGNOSIS,
            x: 0,
            y: 724,
            type: 'array_p2'
        },

        orientation_to_mcp: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.orientation_to_mcp === 'No' ? { x: 238, y: 680} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },


        prenatal_consultation_date: {
            name: cforms_data.maternity.PRENATAL_CONSULTATION ? cforms_data.maternity.PRENATAL_CONSULTATION : '',
            x: 106,
            y: 626,
            type: 'array_object_p2_prenatal'
        },

        expected_delivery_date: { 
            name: cforms_data.maternity.MATERNITY_DATA.expected_delivery_date ? (cforms_data.maternity.MATERNITY_DATA.expected_delivery_date).replace(/-/g, '') : '',
            x: [ 404, 412, 434, 442, 464, 472, 482, 490 ],
            y: 684,
            type: 'date_time_p2'
        },

        date_of_delivery: { 
            name: cforms_data.maternity.MATERNITY_DATA.date_of_delivery ? (cforms_data.maternity.MATERNITY_DATA.date_of_delivery).replace(/-/g, '') : '',
            x: [ 196, 204, 226, 236, 256, 266, 274, 282 ],
            y: 486,
            type: 'date_time_p2'
        },

        time_of_delivery: { 
            name: (cforms_data.maternity.MATERNITY_DATA.time_of_delivery || '').replace(/:/g, ''),
            x: [ 340, 346, 374, 380 ],
            y: 486,
            type: 'date_time_p2'
        },

        mo_obstetric_index: { name: cforms_data.maternity.MATERNITY_DATA.mo_obstetric_index ? cforms_data.maternity.MATERNITY_DATA.mo_obstetric_index : '', x: 132, y: 452, type: 'text_p2'},
        pu_aog_by_lmp: { name: cforms_data.maternity.MATERNITY_DATA.pu_aog_by_lmp ? cforms_data.maternity.MATERNITY_DATA.pu_aog_by_lmp : '', x: 242, y: 452, type: 'text_p2'},
        pu_manner_of_del: { name: cforms_data.maternity.MATERNITY_DATA.pu_manner_of_del ? cforms_data.maternity.MATERNITY_DATA.pu_manner_of_del : '', x: 358, y: 452, type: 'text_p2'},
        pu_presentation: { name: cforms_data.maternity.MATERNITY_DATA.pu_presentation ? cforms_data.maternity.MATERNITY_DATA.pu_presentation : '', x: 472, y: 452, type: 'text_p2'},
        bo_fetal_outcome: { name: cforms_data.maternity.MATERNITY_DATA.bo_fetal_outcome ? cforms_data.maternity.MATERNITY_DATA.bo_fetal_outcome : '', x: 132, y: 416, type: 'text_p2'},
        bo_sex: { name: cforms_data.maternity.MATERNITY_DATA.bo_sex ? cforms_data.maternity.MATERNITY_DATA.bo_sex : '', x: 242, y: 416, type: 'text_p2'},
        bo_birth_weight: { name: cforms_data.maternity.MATERNITY_DATA.bo_birth_weight ? cforms_data.maternity.MATERNITY_DATA.bo_birth_weight : '', x: 358, y: 416, type: 'text_p2'},
        bo_apgar_score: { name: cforms_data.maternity.MATERNITY_DATA.bo_apgar_score ? cforms_data.maternity.MATERNITY_DATA.bo_apgar_score : '', x: 472, y: 416, type: 'text_p2'},

        sched_postpartum_date: { 
            name: cforms_data.maternity.MATERNITY_DATA.sched_postpartum_date ? (cforms_data.maternity.MATERNITY_DATA.sched_postpartum_date).replace(/-/g, '') : '',
            x: [ 338, 346, 368, 378, 400, 408, 416, 424 ],
            y: 390,
            type: 'date_time_p2'
        },


        date_discharged_p2: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.date_discharged).replace(/-/g, ''),
            x: [ 196, 204, 226, 236, 256, 266, 274, 282 ],
            y: 368,
            type: 'date_time_p2'
        },

        time_discharged_p2: { 
            name: (mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_discharged) || '').replace(/:/g, ''),
            x: mixin.methods.formatTo12Hour(cforms_data.patient_confinement.PATIENT_DATA.time_admitted).includes('PM') ?  [ 378, 384, 388 ] : [ 342, 348, 352 ],
            y: 368,
            type: 'date_time_p2'
        },

        perinal_wound_care: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.perinal_wound_care === 'Y' ? { x: 334, y: 300} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        perinal_wound_care_remarks: { name: cforms_data.maternity.MATERNITY_DATA.perinal_wound_care_remarks ? cforms_data.maternity.MATERNITY_DATA.perinal_wound_care_remarks : '', x: 354, y: 304, type: 'text_p2'},

        maternal_complication: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.maternal_complication === 'Y' ? { x: 334, y: 288} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        // maternal_complication_remarks: { name: cforms_data.maternity.MATERNITY_DATA.maternal_complication_remarks ? cforms_data.maternity.MATERNITY_DATA.maternal_complication_remarks : '', x: 354, y: 290, type: 'text_p2'},

        breastfeeding: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.breastfeeding === 'Y' ? { x: 334, y: 260} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        breastfeeding_remarks: { name: cforms_data.maternity.MATERNITY_DATA.breastfeeding_remarks ? cforms_data.maternity.MATERNITY_DATA.breastfeeding_remarks : '', x: 354, y: 262, type: 'text_p2'},

        family_planning: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.family_planning === 'Y' ? { x: 334, y: 246} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        family_planning_remarks: { name: cforms_data.maternity.MATERNITY_DATA.family_planning_remarks ? cforms_data.maternity.MATERNITY_DATA.family_planning_remarks : '', x: 354, y: 248, type: 'text_p2'},

        planning_service: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.planning_service === 'Y' ? { x: 334, y: 230} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        planning_service_remarks: { name: cforms_data.maternity.MATERNITY_DATA.planning_service_remarks ? cforms_data.maternity.MATERNITY_DATA.planning_service_remarks : '', x: 354, y: 236, type: 'text_p2'},

        surgical_sterilization: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.surgical_sterilization === 'Y' ? { x: 334, y: 220} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        sterilization_remarks: { name: cforms_data.maternity.MATERNITY_DATA.sterilization_remarks ? cforms_data.maternity.MATERNITY_DATA.sterilization_remarks : '', x: 354, y: 222, type: 'text_p2'},

        follow_up_sched: { 
            name: check_imge_icon, 
            ...( cforms_data.maternity.MATERNITY_DATA.follow_up_sched === 'Y' ? { x: 334, y: 206} : { x: -100, y: -100} ),
            type: 'icon_p2', 
            width: 16, 
            height: 16
        },

        follow_up_sched_remarks: { name: cforms_data.maternity.MATERNITY_DATA.follow_up_sched_remarks ? cforms_data.maternity.MATERNITY_DATA.follow_up_sched_remarks : '', x: 354, y: 208, type: 'text_p2'},

        p_full_name_doc: { name: `${cforms_data.patient_data.PHIC_DOCTOR[0].last_name}  ${cforms_data.patient_data.PHIC_DOCTOR[0].first_name}  ${cforms_data.patient_data.PHIC_DOCTOR[0].suffix}  ${cforms_data.patient_data.PHIC_DOCTOR[0].middle_name}`, x: 102, y: 138, type: 'text_p2'}, // DOCTOR FULL NAME
    
        // doctor_sign_path: { name: loadPng(cforms_data.accreditation_and_signature.TRANSACTION.doctor_sign_path), x: 114, y: 108, type: 'icon_p2', width: 74, height: 74 }, // ONLY THE PRIMARY DOCTOR HAVE A DOCTOR SIGNATURE
        doctor_sign_path: { 
            name: doctor_sign_image, 
            x: 114,
            y: 108,
            type: 'icon_p2',
            width: 74,
            height: 74
        },
        doctor_sign_date: { 
            name: mixin.methods.formatDate(cforms_data.patient_data.PHIC_DOCTOR[0].date_signed) ? (mixin.methods.formatDate(cforms_data.patient_data.PHIC_DOCTOR[0].date_signed)).replace(/-/g, '') : '',
            x: [ 360, 368, 390, 398, 422, 430, 438, 446 ],
            y: 134,
            type: 'date_time_p2'
        },
    }]


    // const pertinent_laboratory = await fetch(cforms_data.course_in_the_ward.ATTACHMENT.surgical_procedure[0].file_path).then(res => res.arrayBuffer())

    // const remotePdfDoc = await PDFDocument.load(pertinent_laboratory);

    // const [copiedPage] = await cf_pdf.copyPages(remotePdfDoc, [0]);

    for (let pdf_data_key = 0; pdf_data_key < pagesCount; pdf_data_key++) {
        // Deep copy page from source into new PDF
        const [pdf_data] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);

        // pdf_item_data_one.map(async(element) => {
        for (const element of pdf_item_data_one) {
            if(pdf_data_key % 2 === 0 ) {
                for (let key in element) {
                    if(element[key].type === 'date_time'){
                        for (let i = 0; i < element[key].name.length && i < element[key].x.length; i++) {                                     
                            pdf_data.drawText(element[key].name.charAt(i), {
                                x: element[key].x[i],
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b),
                            })
                        }
                    } else if(element[key].type === 'text') {
                        pdf_data.drawText(element[key].name, {
                            x: element[key].x,
                            y: element[key].y,
                            size: size_text,
                            color: rgb(font_color_r, font_color_g, font_color_b)
                        })
                    } else if(element[key].type === 'icon' ) {
                        // pdf_data.drawImage(element[key].name, {
                        //     x: element[key].x,
                        //     y: element[key].y,
                        //     width: element[key].width,
                        //     height: element[key].height
                        // })
                        if (element[key].name) {
                            pdf_data.drawImage(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                width: element[key].width,
                                height: element[key].height
                            })
                        }
                    } else if(element[key].type === 'array' ) {
                        let x = 120
                        element[key].name.forEach(el => {
                            x += 20
                            pdf_data.drawText(el.icd_code, {
                                x: x,
                                y: 442,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })  
                        })
                    } else if(element[key].type === 'array_object') {
                        element[key].name.forEach(el => {
                            pdf_data.drawText(el.assessment, {
                                x: element[key].x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })
                        }) 
                    } else if(element[key].type === 'text_wrap') {
                        let row_line_text   = element[key].name
                        row_line_text       = get_row_line_text(element[key].name,element[key])
                        let current_y       = element[key].y+size_text
                        if(row_line_text.length==1){
                            current_y = element[key].y
                        }

                        for (let i = 0; i < row_line_text.length; i++) 
                        { 
                            if(i>0){
                                current_y-=size_text
                            }
                        
                            pdf_data.drawText(row_line_text[i], {
                                x:element[key].x,
                                y: current_y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            });
                        }
                    }
                }
            } else {
                for (let key in element) {
                    if(element[key].type === 'date_time_p2'){
                        for (let i = 0; i < element[key].name.length && i < element[key].x.length; i++) {                                     
                            pdf_data.drawText(element[key].name.charAt(i), {
                                x: element[key].x[i],
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b),
                            })
                        }
                    } else if(element[key].type === 'text_p2') {
                        pdf_data.drawText(element[key].name, {
                            x: element[key].x,
                            y: element[key].y,
                            size: size_text,
                            color: rgb(font_color_r, font_color_g, font_color_b)
                        })
                    } else if(element[key].type === 'icon_p2' ) {
                        // pdf_data.drawImage(element[key].name, {
                        //     x: element[key].x,
                        //     y: element[key].y,
                        //     width: element[key].width,
                        //     height: element[key].height
                        // })
                        if (element[key].name) {
                            pdf_data.drawImage(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                width: element[key].width,
                                height: element[key].height
                            })
                        }
                    } else if(element[key].type === 'array_p2' ) {
                        let x = 110
                        element[key].name.forEach(el => {
                            x += 20
                            pdf_data.drawText(el.icd_code, {
                                x: x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })  
                        })
                    } else if(element[key].type === 'array_object_p2_prenatal'){
                        let x = 1
                        element[key].name.forEach(el => {
                            x += 40
                            if(el.date_of_consul){
                                pdf_data.drawText(mixin.methods.formatDate(el.date_of_consul), {
                                    x: element[key].x + x,
                                    y: element[key].y,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.aog_in_weeks){
                                pdf_data.drawText(el.aog_in_weeks.replace('week(s)', ''), {
                                    x: element[key].x + x + 14,
                                    y: element[key].y - 16,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.weight){
                                pdf_data.drawText(el.weight, {
                                    x: element[key].x + x + 14,
                                    y: element[key].y - 40,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.cardiac_rate){
                                pdf_data.drawText(el.cardiac_rate, {
                                    x: element[key].x + x + 14,
                                    y: element[key].y - 54,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.respiratory_rate){
                                pdf_data.drawText(el.respiratory_rate, {
                                    x: element[key].x + x + 14,
                                    y: element[key].y - 68,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.blood_pressure){
                                pdf_data.drawText(el.blood_pressure, {
                                    x: element[key].x + x + 10,
                                    y: element[key].y - 82,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                            if(el.temperature){
                                pdf_data.drawText(el.temperature, {
                                    x: element[key].x + x + 14,
                                    y: element[key].y - 94,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b)
                                })
                            }

                        })
                        
                    }
                }
            }
        // })
        }

        // Add the modified page to the new PDF
        cf_pdf.addPage(pdf_data);
    }

    //ADD THE ATTACHMENT SURGICAL PROCEDURE FILE IN CF3
    // if(cforms_data.course_in_the_ward.ATTACHMENT.length >= 1) {
    //     if(cforms_data.course_in_the_ward.ATTACHMENT.surgical_procedure.length >= 1){
    //         for (const el of cforms_data.course_in_the_ward.ATTACHMENT.surgical_procedure) {
    //             const course_in_the_ward = await fetch(el.file_path).then(res => res.arrayBuffer());
    //             const remote_pdf_doc = await PDFDocument.load(course_in_the_ward);
        
    //             const [copied_page] = await cf_pdf.copyPages(remote_pdf_doc, [0]);
        
    //             cf_pdf.addPage(copied_page);
    //         }
    //     }
    // }
    // COURSE IN THE WARD ATTACHMENTS
    if (cforms_data.course_in_the_ward.ATTACHMENT?.surgical_procedure?.length >= 1) {
        for (const el of cforms_data.course_in_the_ward.ATTACHMENT.surgical_procedure) {

            const path  = el.file_path
            if(path){
                const res = await fetch(path)
                const buffer = await res.arrayBuffer()
                const file_path = path.toLowerCase()

                if (file_path.endsWith('.pdf')) {
                    const remote_pdf_doc = await PDFDocument.load(buffer)
                    const [copied_page] = await cf_pdf.copyPages(remote_pdf_doc, [0])
                    cf_pdf.addPage(copied_page)

                } else if (file_path.match(/\.(jpg|jpeg)$/)) {
                    const page = cf_pdf.addPage()
                    const image = await cf_pdf.embedJpg(buffer)

                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: page.getWidth(),
                        height: page.getHeight()
                    })

                } else if (file_path.endsWith('.png')) {
                    const page = cf_pdf.addPage()
                    const image = await cf_pdf.embedPng(buffer)

                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: page.getWidth(),
                        height: page.getHeight()
                    })
                }
            }

        }
    }

    // if(cforms_data.physical_exam.ATTACHMENT.length >= 1) {
    //     if(cforms_data.physical_exam.ATTACHMENT?.length >= 1){
    //         for (const el of cforms_data.physical_exam.ATTACHMENT) {
    //             const pertinent_laboratory = await fetch(el.file_path).then(res => res.arrayBuffer());
    //             const remotePdfDoc = await PDFDocument.load(pertinent_laboratory);
        
    //             const [copied_page] = await cf_pdf.copyPages(remotePdfDoc, [0]);
    
    //             cf_pdf.addPage(copied_page);
    //         }
    //     }
    // }
    // PHYSICAL EXAM ATTACHMENTS
    if (cforms_data.physical_exam.ATTACHMENT?.length >= 1) {
        for (const el of cforms_data.physical_exam.ATTACHMENT) {
            const path  = el.file_path
            if(path){
                const res = await fetch(path)
                const buffer = await res.arrayBuffer()
                const file_path = path.toLowerCase()

                if (file_path.endsWith('.pdf')) {
                    const remotePdfDoc = await PDFDocument.load(buffer)
                    const [copied_page] = await cf_pdf.copyPages(remotePdfDoc, [0])
                    cf_pdf.addPage(copied_page)

                } else if (file_path.match(/\.(jpg|jpeg)$/)) {
                    const page = cf_pdf.addPage()
                    const image = await cf_pdf.embedJpg(buffer)

                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: page.getWidth(),
                        height: page.getHeight()
                    })

                } else if (file_path.endsWith('.png')) {
                    const page = cf_pdf.addPage()
                    const image = await cf_pdf.embedPng(buffer)

                    page.drawImage(image, {
                        x: 0,
                        y: 0,
                        width: page.getWidth(),
                        height: page.getHeight()
                    })
                }
            }
        }
    }

    // function get_row_line_text(text,box) {
    //     let text_width = font.widthOfTextAtSize(text, size_text);
    //     const final_text_lines = [];

    //     if(text_width>box.width){
    //         const text_words = text.trim().split(/\s+/);
    //         let current_line_text = '';

    //         for (let i = 0; i < text_words.length; i++){
    //             const word = text_words[i];
    //             const row_line_text = current_line_text ? `${current_line_text} ${word}` : word; 
    //             const row_line_width = font.widthOfTextAtSize(row_line_text, size_text);

    //             if (row_line_width <= box.width){
    //                 current_line_text = row_line_text; 
    //             } 
    //             else{
    //                 if (current_line_text){
    //                     final_text_lines.push(current_line_text.trim());
    //                 }
    //                 current_line_text = word;
    //             }
    //         }

    //         if (current_line_text) {
    //             final_text_lines.push(current_line_text.trim());
    //         }
    //     } else {
    //         final_text_lines.push(text.trim());
    //     }
        
    //     return final_text_lines;
    // }

    function get_row_line_text(text, box) {
        // Remove newline characters that pdf-lib cannot encode
        text = (text || '').replace(/\r?\n/g, ' ').trim();
        let text_width = font.widthOfTextAtSize(text, size_text);
        const final_text_lines = [];

        if (text_width > box.width) {
            const text_words = text.split(/\s+/);
            let current_line_text = '';

            for (let i = 0; i < text_words.length; i++) {
                const word = text_words[i];
                const row_line_text = current_line_text
                    ? `${current_line_text} ${word}`
                    : word;

                const row_line_width = font.widthOfTextAtSize(
                    row_line_text,
                    size_text
                );

                if (row_line_width <= box.width) {
                    current_line_text = row_line_text;
                } else {
                    if (current_line_text) {
                        final_text_lines.push(current_line_text.trim());
                    }
                    current_line_text = word;
                }
            }

            if (current_line_text) {
                final_text_lines.push(current_line_text.trim());
            }
        } else {
            final_text_lines.push(text);
        }

        return final_text_lines;
    }

    const modified_pdf = await cf_pdf.save()
    const blob = new Blob([modified_pdf], { type: "application/pdf"})
    has_pdf = URL.createObjectURL(blob)

    return has_pdf
}
