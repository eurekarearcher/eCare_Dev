import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import check_icon from '../../assets/check.png'
import mixin from '@/mixin'

export const getCF4 = async (has_pdf,cforms_data) => {
    let font_color_r = 0.13
    let font_color_g = 0.13
    let font_color_b = 0.13
    let size_text = 7

    const existing_pdf_bytes = await fetch(has_pdf).then(res => res.arrayBuffer())
    const pdf_doc = await PDFDocument.load(existing_pdf_bytes)
    const font = await pdf_doc.embedFont(StandardFonts.Helvetica);

    const l_check_icon = await fetch(check_icon).then(res => res.arrayBuffer())

    const cf_pdf = await PDFDocument.create();
    const check_imge_icon = await cf_pdf.embedPng(l_check_icon)
    const pagesCount = pdf_doc.getPageCount();

    //I. HEALTH CARE INSTITUTION (HCI) INFORMATION
    const hci_provider = cforms_data.hci.provider
    const hci_accre_no = cforms_data.hci.accreditation_no
    const hci_address  = cforms_data.hci.address

    //II. PATIENT DATA
    const p_first_name = cforms_data.patient_data.PATIENT_DATA.first_name
    const p_middle_name = cforms_data.patient_data.PATIENT_DATA.middle_name
    const p_last_name = cforms_data.patient_data.PATIENT_DATA.last_name
    const p_mem_phic_pin = cforms_data.patient_data.PATIENT_DATA.mem_phic_pin
    const p_age = cforms_data.patient_data.PATIENT_DATA.age
    const p_gender = cforms_data.patient_data.PATIENT_DATA.gender
    const p_chief_complaint = cforms_data.patient_confinement.PATIENT_DATA.chief_complaint

    const admitted_diagnosis = cforms_data.patient_confinement.ADMISSION_DIAGNOSIS.map(diagnosis => {
        if (diagnosis.icd_description && diagnosis.icd_description.trim() !== "") {
            return `${diagnosis.icd_code} - ${diagnosis.icd_description}`;
        } else {
            return diagnosis.icd_code;
        }
    }).join(", ");

    const discharge_diagnoses = [ 
        ...(cforms_data.patient_confinement.DISCHARGED_DIAGNOSIS.PRIMARY || []),
        ...(cforms_data.patient_confinement.DISCHARGED_DIAGNOSIS.SECONDARY || [])
    ];

    const discharged_diagnosis = discharge_diagnoses.map(diagnosis => {
        if (diagnosis.icd_description && diagnosis.icd_description.trim() !== "") {
            return `${diagnosis.icd_code} - ${diagnosis.icd_description}`;
        } else {
            return diagnosis.icd_code;
        }
    }).join(", ");

    const first_case_rate = cforms_data.patient_confinement.FIRST_CASE_RATES?.first_case_rate_code || '';

    const second_case_rate = cforms_data.patient_confinement.SECOND_CASE_RATES?.map(item => {
        return `${item.second_case_rate_code}`;
    }).join(", ");
    
    const p_date_admitted = (cforms_data.patient_confinement.PATIENT_DATA.date_admitted || '').replace(/-/g, '')
    const time_admitted = (cforms_data.patient_confinement.PATIENT_DATA.time_admitted || '').replace(/:/g, '')
    const p_time_admitted = time_admitted.slice(0, 4);
    const p_date_discharged = (cforms_data.patient_confinement.PATIENT_DATA.date_discharged || '').replace(/-/g, '')
    const time_discharged = (cforms_data.patient_confinement.PATIENT_DATA.time_discharged || '').replace(/:/g, '')
    const p_time_discharged = time_discharged.slice(0, 4);
    
    // III. REASON FOR ADMISSION
    const illness_hstry = cforms_data.patient_confinement.PATIENT_DATA.illness_hstry
    const prt_past_med_hstry = p_gender === "F" ? cforms_data.patient_confinement.PATIENT_DATA.prt_past_med_hstry : ""
    const obg_gravidity = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_gravidity : ""
    const obg_parity = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_parity : ""
    const obg_term = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_term : ""
    const obg_preterm = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_preterm : ""
    const obg_abortions = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_abortions : ""
    const obg_living = p_gender === "F" ? cforms_data.patient_confinement.OB_GYNE.obg_living : ""
    const obg_lmp = p_gender === "F" ? cforms_data.patient_confinement.PATIENT_DATA?.lmp : ""

    // PHYSICAL EXAM
    const general_survey = cforms_data.physical_exam.PE_DATA.general_survey
    const height = cforms_data.physical_exam.PE_DATA.height
    const weight = cforms_data.physical_exam.PE_DATA.weight
    const vital_sign_bp = cforms_data.physical_exam.PE_DATA.vital_sign_bp
    const [systolic, diastolic] = vital_sign_bp.split("/");
    const vital_sign_rr = cforms_data.physical_exam.PE_DATA.vital_sign_rr
    const vital_sign_hr = cforms_data.physical_exam.PE_DATA.vital_sign_cr
    const vital_sign_temp = cforms_data.physical_exam.PE_DATA.vital_sign_temp

    //REFERRAL
    const is_referred = cforms_data.patient_confinement.PATIENT_DATA.is_referred
    const reason_for_referral_admission = is_referred === "YES" ? cforms_data.patient_confinement.PATIENT_DATA.reason_for_referral_admission : ""
    const originating_provider = is_referred === "YES" ? cforms_data.patient_confinement.PATIENT_DATA.originating_provider : ""
    
    // VI. OUTCOME OF TREATMENT
    const ciw_outcome_treatment = cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment
    const ciw_outcome_treatment_reason = cforms_data.course_in_the_ward.TRANSACTION.outcome_treatment_reason

    // VII. CERTIFICATION OF HEALTH CARE PROFESSIONAL
    const doctor = cforms_data?.accreditation_and_signature?.PHIC_DOCTOR?.[0] || {}
    const doctor_fullname   =`${doctor.doctor_name || ''}`
    
    //const doctor_sign_path = cforms_data?.accreditation_and_signature?.TRANSACTION?.doctor_sign_path || ''
    const doctor_date_signed = mixin.methods.formatDate(cforms_data?.certification?.SIGNATURE.doctor_date_signed) || ''
    const doctor_date = (doctor_date_signed || '').replace(/-/g, '')
    const doctor_sign_path = await fetch(cforms_data?.accreditation_and_signature?.TRANSACTION?.doctor_sign_path).then(res => res.arrayBuffer())
    let doctor_sign_icon = null
    try {
        doctor_sign_icon = await cf_pdf.embedPng(doctor_sign_path)
    }catch (err) {
        //console.error("Invalid/No image");
    }
    
    let pdf_item_data_one = [{
        hciprv_provider: { name: hci_provider, x: 38, y: 843, type: 'right_text'},
        hciprv_accre_no: { name: hci_accre_no, x: 373, y: 843, type: 'right_text'},
        hciprv_address: { name: hci_address, x: 38, y: 813, type: 'right_text'},

        patient_first_name: { name: p_first_name, x: 300, y: 765, type: 'right_text'},
        patient_middle_name: { name: p_middle_name, x: 38, y: 765, type: 'right_text'},
        patient_last_name: { name: p_last_name, x: 160, y: 765, type: 'right_text'},
        patient_mem_phic_pin: { name: p_mem_phic_pin, x: 440, y: 765, type: 'right_text'},
        patient_age: { name: p_age, x: 440, y: 740, type: 'right_text'},
        patient_gender: { 
            name: check_imge_icon, 
            ...(
                p_gender === 'F' ? { x: 520, y: 720} : 
                p_gender === 'M' ? { x: 484, y: 720} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        patient_chief_complaint: { name: p_chief_complaint, x: 37, y: 725, width: 400, type: 'text_wrap'},
        diagnosis_first_case_rate: { name: first_case_rate, x: 440, y: 693,width: 150,  type: 'text_wrap'},
        diagnosis_second_case_rate: { name: second_case_rate, x: 440, y: 670,width: 150,  type: 'text_wrap'},
        patient_admitted_diagnosis: { name: admitted_diagnosis, x: 30, y: 690,width: 200,  type: 'text_wrap'},
        patient_discharged_diagnosis: { name: discharged_diagnosis, x: 233, y: 690,width: 200,  type: 'text_wrap'},
        patient_date_admitted: { 
            name: p_date_admitted,
            x: [ 120,134,155,169,190,204,218,232],
            y: 655,
            type: 'box_position'
        },
        patient_time_admitted: { 
            name: p_time_admitted,
            x: [ 426,438,459,471],
            y: 655,
            type: 'box_position'
        },
        time_admitted_ampm: { 
            name: check_imge_icon, 
            ...(
                p_time_admitted > 1159 ? { x: 511, y: 650} : { x: 485, y: 650}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },
        patient_date_discharged: { 
            name: p_date_discharged,
            x: [ 120,134,155,169,190,204,218,232],
            y: 630,
            type: 'box_position'
        },
        patient_time_discharged: { 
            name: p_time_discharged,
            x: [ 426,438,459,471],
            y: 630,
            type: 'box_position'
        },
        time_discharged_ampm: { 
            name: check_imge_icon, 
            ...(
                p_time_discharged > 1159 ? { x: 511, y: 627} : { x: 485, y: 627}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        outcome_treatment: { 
            name: check_imge_icon, 
            ...(
                ciw_outcome_treatment === 'IMPROVED' ? { x: 34, y: 119} : 
                ciw_outcome_treatment === 'RECOVERED' ? { x: 91, y: 119} :
                ciw_outcome_treatment === 'HAMA' ? { x: 154, y: 119} :
                ciw_outcome_treatment === 'EXPIRED' ? { x: 217, y: 119} :
                ciw_outcome_treatment === 'ABSCONDED' ? { x: 269, y: 119} :
                ciw_outcome_treatment === 'TRANSFERRED' ? { x: 333, y: 119} :
                { x: -100, y: -100}
            ),
            type: 'icon2', 
            width: 16, 
            height: 16
        },
        outcome_treatment_reason: { name: ciw_outcome_treatment_reason, x: 468, y: 128, type: 'right_text2'},

        pe_general_survey: { 
            name: check_imge_icon, 
            ...(
                general_survey === 'AWAKE AND ALERT' ? { x: 116, y: 127} : 
                general_survey === 'ALTERED SENSORIUM' ? { x: 227, y: 127} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },
        pe_height: { name: height, x: 500, y: 144, type: 'right_text'},
        pe_weigth: { name: weight, x: 502, y: 129, type: 'right_text'},
        pe_systolic_bp: { name: systolic, x: 150, y: 100, type: 'right_text'},
        pe_diastolic_bp: { name: diastolic, x: 175, y: 100, type: 'right_text'},
        pe_vital_sign_rr: { name: vital_sign_rr, x: 350, y: 100, type: 'right_text'},
        pe_vital_sign_hr: { name: vital_sign_hr, x: 250, y: 100, type: 'right_text'},
        pe_vital_sign_temp: { name: vital_sign_temp, x: 460, y: 100, type: 'right_text'},

        pe_illness_hstry: { name: illness_hstry, x: 36, y: 582, width: 500,  type: 'text_wrap'},
        pe_prt_past_med_hstry: { name: prt_past_med_hstry, x: 36, y: 472, width: 500,  type: 'text_wrap'},

        ob_gravidity: { name: obg_gravidity, x: 47, y: 412, type: 'right_text'},
        ob_parity: { name: obg_parity, x: 78, y: 412, type: 'right_text'},
        ob_term: { name: obg_term, x:108, y: 412, type: 'right_text'},
        ob_preterm: { name: obg_preterm, x: 136, y: 412, type: 'right_text'},
        ob_abortions: { name: obg_abortions, x: 166, y: 412, type: 'right_text'},
        ob_living: { name: obg_living, x: 196, y: 412, type: 'right_text'},
        ob_lmp: { name: obg_lmp, x: 237, y: 412, type: 'right_text'},

        obg: { 
            name: check_imge_icon, 
            ...(
                p_gender === 'M' ? { x: 316, y: 407} : { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        referred_referral_admission: { name: reason_for_referral_admission, x: 350, y: 195,type: 'right_text'},
        referred_originating_provider:  { name: originating_provider, x: 362, y: 178,type: 'right_text'},
        patient_is_referred: { 
            name: check_imge_icon, 
            ...(
                is_referred === 'YES' ? { x: 264, y: 190} : 
                is_referred === 'NO' ? { x: 227, y: 190} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        sign_doctor_fullname: { name: doctor_fullname, x: 130, y: 60,type: 'right_text2'},
        doctor_signed_date: { 
            name: doctor_date,
            x: [ 457,470,493,506,526,541,554,568],
            y: 60,
            type: 'box_position2'
        },
        doctorsign_path: { name: doctor_sign_icon, x: 130, y: 30, type: 'icon2', width: 74, height: 74 },    
    }]

    // III. REASON FOR ADMISSION - SIGNS AND SYMPTOMS
    const sign_symptom_position = {
        "01": { x: 35, y: 361 },
        "02": { x: 35, y: 345 },
        "03": { x: 35, y: 329 },
        "04": { x: 35, y: 311 },
        "05": { x: 35, y: 295 },
        "06": { x: 35, y: 277 },
        "07": { x: 35, y: 246 }, //CONSTIPATION
        "08": { x: 35, y: 261 }, //CHEST PAIN/DISCOMFORT
        "09": { x: 35, y: 229 },

        "10": { x: 161, y: 361 },
        "11": { x: 161, y: 345 },
        "12": { x: 161, y: 329 },
        "13": { x: 161, y: 311 },
        "14": { x: 161, y: 295 },
        "15": { x: 161, y: 277 },
        "37": { x: 161, y: 261 },
        "17": { x: 161, y: 246 },
        "18": { x: 161, y: 229 },

        "19": { x: 281, y: 361 },
        "20": { x: 281, y: 345 },
        "21": { x: 281, y: 329 },
        "22": { x: 281, y: 311 },
        "23": { x: 281, y: 295 },
        "25": { x: 281, y: 277 },
        "26": { x: 281, y: 261 },
        "27": { x: 281, y: 246 },
        "38": { x: 281, y: 229 },

        "28": { x: 403, y: 361 },
        "33": { x: 403, y: 345 },
        "29": { x: 403, y: 329 },
        "30": { x: 403, y: 311 },
        "32": { x: 403, y: 295 },
        "34": { x: 403, y: 277 },
        "35": { x: 403, y: 261 },
        "36": { x: 403, y: 246 },
        "X": { x: 403, y: 229 },


    };

    const symptomsArray = cforms_data.patient_confinement.SYMPTOMS;

    const symptoms_list_items = symptomsArray.map((item) => {
        const pos = sign_symptom_position[item.symptoms_id] || { x: -100, y: -100 };

        let signs = {
            signs_and_symptoms: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon', 
                width: 16, 
                height: 16
            }    
        };

        if(item.symptoms_id === "X"){
            signs.signs_and_symptoms_others = { 
                name: item.symptom,
                x: 452, 
                y: 230,
                type: 'right_text'
            } 
        }

        if(item.symptoms_id === "38"){
            signs.pain_site = { 
                name: item.pain_site,
                x: 313, 
                y: 234,
                type: 'right_text'
            } 
        }
        
        return signs;
    });

    // Pertinent Findings heent
    const heent_finding_position = {
        "11": { x: 116, y: 75 }, //ESSENTIALLY NORMAL
        "12": { x: 226, y: 75 }, //Abnormal pupillary reaction
        "13": { x: 347, y: 75 }, //Cervical lymphadenopathy
        "14": { x: 458, y: 75 }, //Dry mucous membrane
        "15": { x: 116, y: 57 }, //Icteric sclerae
        "16": { x: 226, y: 57 }, //Pale conjunctivae
        "17": { x: 347, y: 57 }, //Sunken eyeballs 
        "18": { x: 458, y: 57 } //Sunken fontanelle
    };
    const heent_findings = cforms_data.physical_exam.PE_DATA.pe_heent;
    const heent_items = heent_findings.map((item) => {
        const pos = heent_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    //CHEST
    const chest_finding_position = {
        "6": { x: 116, y: 934 }, 
        "10": { x: 116, y: 918 }, 
        "7": { x: 225, y: 934 }, 
        //"0": { x: -100, y: -100 },  //Rales/crackles/rhonchi
        //"0": { x: -100, y: -100 },  //Decreased breath sounds
        "16": { x: 345, y: 918 }, 
        "5": { x: 458, y: 934 }
    };
    const chest_findings = cforms_data.physical_exam.PE_DATA.pe_chest_lungs;
    const chest_items = chest_findings.map((item) => {
        const pos = chest_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });
    
    //CVS
    const cvs_finding_position = {
        "5": { x: 116, y: 883 },
        "7": { x: 116, y: 867 },
        "6": { x: 225, y: 883 },
        "8": { x: 225, y: 867 },
        "3": { x: 347, y: 883 },
        "4": { x: 347, y: 867 },
        "9": { x: 458, y: 883 }
    };
    const cvs_findings = cforms_data.physical_exam.PE_DATA.pe_cvs;
    const cvs_items = cvs_findings.map((item) => {
        const pos = cvs_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    //ABDOMENT
    const abdomen_finding_position = {
        "7": { x: 116, y: 832 },
        //"0": { x: -100, y: -100 },Palpable mass(es)
        "8": { x: 225, y: 832 },
        "12": { x: 225, y: 816 },
        "9": { x: 347, y: 832 },
        "13": { x: 347, y: 816 },
        "10": { x: 458, y: 832 }
    };
    const abdomen_findings = cforms_data.physical_exam.PE_DATA.pe_abdomen;
    const abdomen_items = abdomen_findings.map((item) => {
        const pos = abdomen_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    //GU
    const gu_finding_position = {
        "1": { x: 116, y: 778 },
        "2": { x: 225, y: 778 },
        "3": { x: 347, y: 778 },
        "4": { x: 458, y: 778 },
    };
    const gu_findings = cforms_data.physical_exam.PE_DATA.pe_gu_ie;
    const gu_items = gu_findings.map((item) => {
        const pos = gu_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: { 
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    //SKIN
    const skin_finding_position = {
        "1": { x: 116, y: 742 },
        "5": { x: 116, y: 726 },
        "9": { x: 116, y: 710 },
        "2": { x: 225, y: 742 },
        "6": { x: 225, y: 726 },
        "10":{ x: 225, y: 710 },
        "3": { x: 347, y: 742 },
        "7": { x: 347, y: 726 },
        "4": { x: 458, y: 742 },
        "8": { x: 458, y: 726 },
    };
    const skin_findings = cforms_data.physical_exam.PE_DATA.pe_skin_extremities;
    const skin_items = skin_findings.map((item) => {
        const pos = skin_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: {
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    //NEURO
    const neuro_finding_position = {
        "6": { x: 116, y: 675 },
        "10": { x: 116, y: 659 },
       
        "7": { x: 225, y: 675 },
        "11": { x: 225, y: 659 },

        "8": { x: 347, y: 675 },
        "12": { x: 347, y: 659 },

        "9": { x: 458, y: 675 },
        "13": { x: 458, y: 659 },
    };
    const neuro_findings = cforms_data.physical_exam.PE_DATA.pe_neuro_exam;
    const neuro_items = neuro_findings.map((item) => {
        const pos = neuro_finding_position[item.assessment_id] || { x: -100, y: -100 };
        let findings = {
            findings_pertinent: {
                name: check_imge_icon,
                x: pos.x, 
                y: pos.y,
                type: 'icon2', 
                width: 16, 
                height: 16
            }    
        };
        return findings;
    });

    const pe_findings_list_items = [
        ...heent_items,
        ...chest_items,
        ...cvs_items,
        ...abdomen_items,
        ...gu_items,
        ...skin_items,
        ...neuro_items
    ];

    // IV. COURSE IN THE WARD - DOCTOR’S ORDER/ACTION
    const doc_order_base_y = 580
    const doc_order_row_gap = 17
    const pdf_doctor_order_items = cforms_data.course_in_the_ward.DOCTORS_ORDER.slice(0, 15).map((doctor, index) => {
        const y = doc_order_base_y - (index * doc_order_row_gap)
        return {
            doctor_order: { 
                name: (doctor.doctors_order || '').replace(/\n/g, ''), 
                x: 130, 
                y, 
                type: 'right_text2'
            },

            doctor_order_date: { 
                name: doctor.date_date, 
                x: 60, 
                y, 
                type: 'right_text2'
            }
        }
    })

    // if (cforms_data.course_in_the_ward.DOCTORS_ORDER.length > 15) {
    //     pdf_doctor_order_items.push({
    //         doctors_order_more: { 
    //             name: check_imge_icon, 
    //             x: 377, 
    //             y: 617,
    //             type: 'icon2', 
    //             width: 16, 
    //             height: 16
    //         }
    //     })
    // }

    // V. DRUGS/MEDICINES
    const medicines = cforms_data.course_in_the_ward?.MEDICINE || [];
    const pdf_medicine_items = [];
    const med_base_y = 260
    const med_row_gap = 17
    medicines.slice(0, 7).map((med, index) => {
        const y = med_base_y - (index * med_row_gap)
        const parts = [ med.generic_name,med.quantity,med.route,med.frequency].filter(part => part && part.toString().trim() !== '');
        
        pdf_medicine_items.push({
            med_generic_name: { 
                name: parts.join(' / '), 
                x: 30, 
                y, 
                type: 'text_wrap2', 
                width: 200 
            },
            med_total: { 
                name: med.total, 
                x: 260, 
                y, 
                type: 'right_text2', 
                width: 200 
            },
        })
    })

    const med_base_y2 = 260;
    const med_row_gap2 = 17;

    medicines.slice(7, 14).map((med, index) => {
        const y = med_base_y2 - (index * med_row_gap2);
            const parts = [
                med.generic_name,
                med.quantity,
                med.route,
                med.frequency
            ].filter(part => part && part.toString().trim() !== '');

            pdf_medicine_items.push({
                med_generic_name: { 
                    name: parts.join(' / '), 
                    x: 305, 
                    y, 
                    type: 'text_wrap2', 
                    width: 200 
                },
                med_total: { 
                    name: med.total, 
                    x: 545, 
                    y, 
                    type: 'right_text2', 
                    width: 200 
                },
            });
    });

    // if (cforms_data.course_in_the_ward.MEDICINE.length > 14) {
    //     pdf_medicine_items.push({
    //         medicine_more: { 
    //             name: check_imge_icon, 
    //             x: 273, 
    //             y: 292,
    //             type: 'icon2', 
    //             width: 16, 
    //             height: 16
    //         },
    //     })
    // }

    for (let pdf_data_key = 0; pdf_data_key < pagesCount; pdf_data_key++) {
        // Deep copy page from source into new PDF
        const [pdf_data] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);

        const final_pdf_data = [
            ...pdf_item_data_one,
            ...pdf_medicine_items,
            ...pdf_doctor_order_items,
            ...symptoms_list_items,
            ...pe_findings_list_items
        ]

        final_pdf_data.map(async(element) => {
            if(pdf_data_key % 2 === 0 ) {
                for (let key in element) {
                    if(element[key].name){
                        if(element[key].type === 'box_position'){
                            for (let i = 0; i < element[key].name.length && i < element[key].x.length; i++) {                                     
                                pdf_data.drawText(element[key].name.charAt(i), {
                                    x: element[key].x[i],
                                    y: element[key].y,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b),
                                })
                            }
                        } 
                        else if(element[key].type === 'right_text') {
                            const x = element[key].x;
                            pdf_data.drawText(element[key].name, {
                                x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })
                        }
                        else if(element[key].type === 'center_text') {
                            const text_width = font.widthOfTextAtSize(element[key].name, size_text);
                            const x = element[key].x + ((element[key].width - text_width) / 2);
                            pdf_data.drawText(element[key].name, {
                                x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })
                        }
                        else if(element[key].type === 'text_wrap') {
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
                            
                            //let text_width = font.widthOfTextAtSize(row_line_text[i], size_text);
                            let x = element[key].x;
                            pdf_data.drawText(row_line_text[i], {
                                x,
                                y: current_y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            });
                            }
                        }
                        else if(element[key].type === 'text') {
                            pdf_data.drawText(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })
                        } 
                        else if(element[key].type === 'icon' ) {
                            pdf_data.drawImage(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                width: element[key].width,
                                height: element[key].height
                            })
                        }
                    }
                }
            } else {
                for (let key in element) {
                    if(element[key].name){
                        if(element[key].type === 'right_text2') {
                            pdf_data.drawText(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            })
                        }else if(element[key].type === 'icon2' ) {
                            pdf_data.drawImage(element[key].name, {
                                x: element[key].x,
                                y: element[key].y,
                                width: element[key].width,
                                height: element[key].height
                            })
                        }else if(element[key].type === 'box_position2'){
                            for (let i = 0; i < element[key].name.length && i < element[key].x.length; i++) {                                     
                                pdf_data.drawText(element[key].name.charAt(i), {
                                    x: element[key].x[i],
                                    y: element[key].y,
                                    size: size_text,
                                    color: rgb(font_color_r, font_color_g, font_color_b),
                                })
                            }
                        }else if(element[key].type === 'text_wrap2') {
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
                            
                            //let text_width = font.widthOfTextAtSize(row_line_text[i], size_text);
                            let x = element[key].x;
                            pdf_data.drawText(row_line_text[i], {
                                x,
                                y: current_y,
                                size: size_text,
                                color: rgb(font_color_r, font_color_g, font_color_b)
                            });
                            }
                        }
                    }
                    
                }

            }
        })

        // Add the modified page to the new PDF
        cf_pdf.addPage(pdf_data);
    }

    function get_row_line_text(text,box) {
        let text_width = font.widthOfTextAtSize(text, size_text);
        const final_text_lines = [];

        if(text_width>box.width) {
            const text_words = text.trim().split(/\s+/);
            let current_line_text = '';

            for (let i = 0; i < text_words.length; i++) {
            const word = text_words[i];
            const row_line_text = current_line_text ? `${current_line_text} ${word}` : word; 
            const row_line_width = font.widthOfTextAtSize(row_line_text, size_text);

            if (row_line_width <= box.width) {
                current_line_text = row_line_text; 
            } 
            else {
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
            final_text_lines.push(text.trim());
        }
        
        return final_text_lines;
    }
    
    const modified_pdf = await cf_pdf.save()
    const blob = new Blob([modified_pdf], { type: "application/pdf"})
    has_pdf = URL.createObjectURL(blob)

    return has_pdf
}
