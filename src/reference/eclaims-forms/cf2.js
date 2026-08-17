import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import check_icon from '../../assets/check.png'
import mixin from '@/mixin'

export const getCF2 = async (has_pdf, cforms_data) => {
    let font_color_r = 0.13
    let font_color_g = 0.13
    let font_color_b = 0.13
    let size_text = 7

    const existing_pdf_bytes = await fetch(has_pdf).then(res => res.arrayBuffer())
    const pdf_doc = await PDFDocument.load(existing_pdf_bytes)

    const l_check_icon = await fetch(check_icon).then(res => res.arrayBuffer())
    // const check_imge_icon = await pdf_doc.embedPng(l_check_icon)
    const font = await pdf_doc.embedFont(StandardFonts.Helvetica);
    // const pages = pdf_doc.getPages()

    // Create a new PDF to hold modified pages
    const cf_pdf = await PDFDocument.create();
    const check_imge_icon = await cf_pdf.embedPng(l_check_icon)
    // const patient_signed = await fetch(cforms_data.accreditation_and_signature.TRANSACTION.patient_sign_path).then(res => res.arrayBuffer())
    // const patient_signed_img = await cf_pdf.embedPng(patient_signed)
    // const doctor_signed = await fetch(cforms_data.accreditation_and_signature.TRANSACTION.doctor_sign_path).then(res => res.arrayBuffer())
    // const doctor_signed_img = await cf_pdf.embedPng(doctor_signed)
    const pagesCount = pdf_doc.getPageCount();

    // const loadPng = async (url) => url ? fetch(url).then(r => (r.ok ? r.arrayBuffer() : null)).then(buf => (buf ? pdf_doc.embedPng(buf) : null)).catch(() => null) : null;
    // const doctor_sign_path = await fetch(cforms_data?.accreditation_and_signature?.TRANSACTION?.doctor_sign_path).then(res => res.arrayBuffer())
    // const doctor_sign_path_image = doctor_sign_path ?  await cf_pdf.embedPng(doctor_sign_path) : null
    // const patient_sign_path = await fetch(cforms_data?.accreditation_and_signature?.TRANSACTION?.patient_sign_path).then(res => res.arrayBuffer())
    // const patient_sign_path_image = patient_sign_path ?  await cf_pdf.embedPng(patient_sign_path) : null

    let doctor_sign_path_image = null;

    try {
        const doctor_sign_path = await fetch(
        cforms_data?.accreditation_and_signature?.TRANSACTION?.doctor_sign_path
    ).then(res => res.arrayBuffer());

        doctor_sign_path_image = doctor_sign_path
            ? await cf_pdf.embedPng(doctor_sign_path)
            : null;

    } catch (error) {
        console.error('Error processing doctor signature:', error);
        doctor_sign_path_image = null;
    }

    let patient_sign_path_image = null;

    try {
        const response = await fetch(
        cforms_data?.accreditation_and_signature?.TRANSACTION?.patient_sign_path
    );

    const patient_sign_path = await response.arrayBuffer();

        if (patient_sign_path) {
            try {
                patient_sign_path_image = await cf_pdf.embedPng(patient_sign_path);
            } catch (embedError) {
            console.error('embedPng failed (patient):', embedError);

            // fallback to JPG
            try {
                patient_sign_path_image = await cf_pdf.embedJpg(patient_sign_path);
            } catch (jpgError) {
                console.error('embedJpg also failed (patient):', jpgError);
                patient_sign_path_image = null;
            }
            }
        }
    } catch (fetchError) {
        console.error('fetch failed (patient):', fetchError);
    }

    // const pdf_page = pages
    // const pdf_page_two = pages[1]

    // pages.forEach(async(el, key) => {
    //     let [duplicatedPage] = await pdf_doc.copyPages(pdf_doc, [key]);
    //     pdf_doc.addPage(duplicatedPage);
    // })




    // let doctors = [
    //     {
    //         "first_name": "LIVE",
    //         "middle_name": "LOVE",
    //         "last_name": "LAUGH",
    //         "suffix": "NA",
    //         "doc_phic_acc_no": "1100-2400002-5",
    //         "co_pay": "N",
    //         "doc_tin": "98765432",
    //         "doc_code": "234567890",
    //         "doc_prc_license": "897654",
    //         "doc_specialization": "Infectious Disease Physician",
    //         "doctor_name": "LIVE LOVE LAUGH",
    //         "is_primary_doctor": "Y",
    //         "doctor_is_signed": "1",
    //         "date_signed": "2025-09-19"
    //     },
    //     {
    //         "first_name": "LIVE",
    //         "middle_name": "LOVE",
    //         "last_name": "LAUGH",
    //         "suffix": "NA",
    //         "doc_phic_acc_no": "1100-2400002-5",
    //         "co_pay": "Y",
    //         "doc_tin": "98765432",
    //         "doc_code": "234567890",
    //         "doc_prc_license": "897654",
    //         "doc_specialization": "Infectious Disease Physician",
    //         "doctor_name": "LIVE LOVE LAUGH",
    //         "is_primary_doctor": "Y",
    //         "doctor_is_signed": "1",
    //         "date_signed": "2025-09-19"
    //     },
    //     {
    //         "first_name": "LIVE",
    //         "middle_name": "LOVE",
    //         "last_name": "LAUGH",
    //         "suffix": "NA",
    //         "doc_phic_acc_no": "1100-2400002-5",
    //         "co_pay": "N",
    //         "doc_tin": "98765432",
    //         "doc_code": "234567890",
    //         "doc_prc_license": "897654",
    //         "doc_specialization": "Infectious Disease Physician",
    //         "doctor_name": "LIVE LOVE LAUGH",
    //         "is_primary_doctor": "Y",
    //         "doctor_is_signed": "1",
    //         "date_signed": "2025-09-19"
    //     },
    //     {
    //         "first_name": "LIVE",
    //         "middle_name": "LOVE",
    //         "last_name": "LAUGH",
    //         "suffix": "NA",
    //         "doc_phic_acc_no": "1100-2400002-5",
    //         "co_pay": "N",
    //         "doc_tin": "98765432",
    //         "doc_code": "234567890",
    //         "doc_prc_license": "897654",
    //         "doc_specialization": "Infectious Disease Physician",
    //         "doctor_name": "LIVE LOVE LAUGH",
    //         "is_primary_doctor": "Y",
    //         "doctor_is_signed": "1",
    //         "date_signed": "2025-09-19"
    //     }
    // ]


    

    // /// Split into chunks
    function chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }

    // const doctorChunks = chunkArray(doctors, 3);

    // // Convert to object with named keys instead of numeric indices
    // const doctorGroupsObject = doctorChunks.reduce((acc, chunk, index) => {
    //     acc[`doctor_group_${index + 1}`] = { 
    //         name: chunk,
    //         x: 0,
    //         y: 554,
    //         type: 'array_object_doc'
    //     };
    //     return acc;
    // }, {});


    // Splits the string into lines based on the given width
    function splitTextByWidth(text, font, fontSize, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const width = font.widthOfTextAtSize(testLine, fontSize);

            if (width <= maxWidth) {
            currentLine = testLine;
            } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
            }
        }

        if (currentLine) lines.push(currentLine);
        return lines;
    }

    function splitTextByPixelWidth(text, maxWidth, font = "16px Arial") {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;

        let lastFittingSpaceIndex = -1;

        for (let i = 1; i <= text.length; i++) {
            const substr = text.substring(0, i);
            const width = context.measureText(substr).width;

            if (width > maxWidth) {
                break;
            }

            if (text[i - 1] === ' ') {
                lastFittingSpaceIndex = i - 1;
            }
        }

        // If no space found before the limit, do a hard split
        const splitIndex = lastFittingSpaceIndex !== -1 ? lastFittingSpaceIndex : text.length;

        const firstLine = text.substring(0, splitIndex).trimEnd();
        const secondLine = text.substring(splitIndex).trimStart();

        return [firstLine, secondLine];
    }


    const input = "JAMES BOND CRUZSANTOS DELACRUZ";
    const lines = splitTextByPixelWidth(input, 200, "16px Arial");

    console.log(lines.join('\n'));
    
    // COMPUTE THE TOTAL OF DRUGS AND MEDS SUPPLIES
    const drugs_and_meds_supplies = cforms_data.certification.SUMMARY_OF_FEES;
    const lab_room_board_operating = cforms_data.certification.SUMMARY_OF_FEES;

    const drugs_and_meds_supplies_total = drugs_and_meds_supplies.reduce((sum, item) => {
        if ( item.fee_particulars === "Drugs and Medicine" || item.fee_particulars === "Medical Supplies") {
            return sum + Number(item.charges_net_of_applicable_vat || 0);
        }
        return sum;
    }, 0);

    const lab_room_board_operating_total = lab_room_board_operating.reduce((sum, item) => {
        if ( item.fee_particulars === "Laboratory and Diagnostic" || item.fee_particulars === "Operating Room" || item.fee_particulars === "Room and Board") {
            return sum + Number(item.charges_net_of_applicable_vat || 0);
        }
        return sum;
    }, 0);

    const has_hmo = cforms_data.certification.SUMMARY_OF_FEES.some(
        item => Number(item.hmo) > 0
    );

    const has_others = cforms_data.certification.SUMMARY_OF_FEES.some(item =>
        Number(item.pcso) > 0 ||
        Number(item.dswd) > 0 ||
        Number(item.doh_map) > 0
    );
    
    const has_member = Number(cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_balance) > 0

    const has_hmo_prof = cforms_data.certification.PROFESSIONAL_FEES.some(
        item => Number(item.hmo) > 0
    );

    const has_others_prof = cforms_data.certification.PROFESSIONAL_FEES.some(item =>
        Number(item.pcso) > 0 ||
        Number(item.dswd) > 0 ||
        Number(item.doh_map) > 0
    );

    const total_prof_fees = cforms_data.certification.PROFESSIONAL_FEES;

    const get_total_prof_fees = total_prof_fees.reduce((sum, item) => {
        return sum +
            Number(item.pcso || 0) +
            Number(item.dswd || 0) +
            Number(item.doh_map || 0) +
            Number(item.hmo || 0);
    }, 0);

    const has_member_prof = get_total_prof_fees > 0

    let pdf_item_data_one = [{
        hic_accreditation_no: { 
            name: (cforms_data.hci.accreditation_no || '').replace(/-/g, ''),
            x: [ 334, 346, 358, 372, 384, 396, 408, 420, 432 ],
            y: 736,
            type: 'date_time'
        },

        provider_name: { name: cforms_data.hci.provider, x: 174, y: 720, type: 'text'}, // NAME OF HCI
        provider_address: { name: cforms_data.hci.address, x: 80, y: 702, type: 'text'}, // ADDRESS BUILDING NUMBER AND STREET NAME
        // provider_address_city: { name: cforms_data.hci.prv_municipality, x: 298, y: 702, type: 'text'}, // ADDRESS CITY/MUNICIPALITY
        provider_address_provice: { name: cforms_data.hci.prv_province, x: 452, y: 702, type: 'text'}, // ADDRESS PROVINCE

        p_last_name: { name: cforms_data.patient_data.PATIENT_DATA.last_name, x: 124, y: 656, type: 'text'}, // PATIENT LAST NAME
        p_first_name: { name: cforms_data.patient_data.PATIENT_DATA.first_name, x: 246, y: 656, type: 'text'},  // PATIENT FIRST NAME
        p_suffix: { name: cforms_data.patient_data.PATIENT_DATA.suffix, x: 376, y: 656, type: 'text'}, // PATIENT SUFFIX NAME
        p_middle_name: { name: cforms_data.patient_data.PATIENT_DATA.middle_name, x: 470, y: 656, type: 'text'}, // PATIENT MIDDLE NAME

        org_provider_name: { name: cforms_data.patient_confinement.PATIENT_DATA.originating_provider_address.provider_name, x: 114, y: 600, type: 'text'}, // PATIENT REFERRED HCI
        org_provider_building: { name: cforms_data.patient_confinement.PATIENT_DATA.originating_provider_address.building, x: 272, y: 600, type: 'text'}, // PATIENT REFERRED HCI
        org_provider_municipality: { name: cforms_data.patient_confinement.PATIENT_DATA.originating_provider_address.city_municipality, x: 402, y: 600, type: 'text'}, // PATIENT REFERRED HCI
        org_provider_province: { name: cforms_data.patient_confinement.PATIENT_DATA.originating_provider_address.province, x: 470, y: 600, type: 'text'}, // PATIENT REFERRED HCI
        org_provider_zip_code: { name: cforms_data.patient_confinement.PATIENT_DATA.originating_provider_address.zip_code, x: 552, y: 600, type: 'text'}, // PATIENT REFERRED HCI

        date_confinement_admitted: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.date_admitted || '').replace(/-/g, ''),
            x: [ 202, 214, 234, 246, 266, 278, 290, 304 ],
            y: 570,
            type: 'date_time'
        },

        time_admitted: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.time_admitted || '').replace(/:/g, ''),
            x: [ 396, 408, 428, 438 ],
            y: 570,
            type: 'date_time'
        },

        date_discharged: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.date_discharged || '').replace(/-/g, ''),
            x: [ 202, 214, 234, 246, 266, 278, 290, 304 ],
            y: 554,
            type: 'date_time'
        },
                
        time_discharged: { 
            name: (cforms_data.patient_confinement.PATIENT_DATA.time_discharged || '').replace(/:/g, ''),
            x: [ 396, 408, 428, 438 ],
            y: 554,
            type: 'date_time'
        },

        is_referred: { 
            name: check_imge_icon, 
            x: cforms_data.patient_confinement.PATIENT_DATA.is_referred === 'NO' ? 32 : 70, 
            y: 594,
            type: 'icon', 
            width: 16, 
            height: 16
        }, // IS PATIENT REFERRED

        time_admitted_check: { name: check_imge_icon, x: cforms_data.patient_confinement.PATIENT_DATA.time_admitted.time_pm !== '00:00' ? 470 : 514, y: 564, type: 'icon', width: 16, height: 16},
        time_discharged_check: { name: check_imge_icon, x: cforms_data.patient_confinement.PATIENT_DATA.time_discharged.time_pm !== '00:00' ? 470 : 514, y: 550, type: 'icon', width: 16, height: 16},
        type_of_accommodation_check: { name: check_imge_icon, x: cforms_data.patient_confinement.PATIENT_DATA.type_of_accommodation === 'P' ? 144 : 200, y: 456, type: 'icon', width: 16, height: 16},

        patient_disposition_check: { 
            name: check_imge_icon, 
            ...(
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'I' ? { x: 32, y: 518} : 
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'R' ? { x: 32, y: 502} :
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'H' ? { x: 32, y: 488} :
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'A' ? { x: 32, y: 472} :
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'E' ? { x: 190, y: 518} :
                cforms_data.patient_confinement.PATIENT_DATA.patient_disposition === 'T' ? { x: 190, y: 502} :
                { x: 0, y: 0}
            ),
            type: 'icon', width: 16, height: 16
        },

        // admission_diagnosis: {
        //     name: cforms_data.patient_confinement.ADMISSION_DIAGNOSIS,
        //     x: 0,
        //     y: 554,
        //     type: 'array'
        // },
        admission_diagnosis: {
            name: cforms_data.patient_confinement.ADMISSION_DIAGNOSIS,
            x: 145,
            y: 442,
            type: 'array'
        },

        discharged_diagnosis: {
            name: cforms_data.patient_confinement.DISCHARGED_DIAGNOSIS,
            x: 0,
            y: 554,
            type: 'array_object'
        },

        z_benifits: { name: cforms_data.patient_confinement.PATIENT_DATA.z_benefit ? cforms_data.patient_confinement.PATIENT_DATA.z_benefit : '', x: 280, y: 204, type: 'text'}, // Z-BENIFITS
        tb_dots_check: { name: check_imge_icon, ...(cforms_data.patient_confinement.PATIENT_DATA.tb_dots === 'I' ? {x: 130 } : cforms_data.patient_confinement.PATIENT_DATA.tb_dots === 'M' ? { x: 226 }: { x: -100} ), y: 154, type: 'icon', width: 16, height: 16}, // TB-DOTS

        animal_bites_dy0: { name: cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_0_arv ? cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_0_arv : '', x: 82, y: 128, type: 'text'}, // ANIMAL BITES
        animal_bites_dy3: { name: cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_3_arv ? cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_3_arv : '', x: 190, y: 128, type: 'text'}, // ANIMAL BITES
        animal_bites_dy7: { name: cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_7_arv ? cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_day_7_arv : '', x: 310, y: 128, type: 'text'}, // ANIMAL BITES
        animal_bites_rig: { name: cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_rig ? cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_rig : '', x: 392, y: 128, type: 'text'}, // ANIMAL BITES
        animal_bites_specify: { name: cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_others_specify ? cforms_data.patient_confinement.ANIMAL_BITES.animal_bite_others_specify : '', x: 528, y: 128, type: 'text'}, // ANIMAL BITES

        essential_newborn: { 
            name: check_imge_icon, 
            ...(
                cforms_data.patient_confinement.PATIENT_DATA.newborn_care_package === 'essential' ? { x: 150 } : 
                cforms_data.patient_confinement.PATIENT_DATA.newborn_care_package === 'hearing' ? { x: 244 } : 
                cforms_data.patient_confinement.PATIENT_DATA.newborn_care_package === 'screening' ? { x: 370 } : 
                { x: -100 }
            ),
            y: 110, 
            type: 'icon', width: 16, height: 16
        }, // ESSENTIAL NEWBORN CARE

        essential_newborn_drying: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.drying === 'Y' ? 42 : -100, y: 78, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CARE DRYING
        essential_newborn_skin: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.skin_to_skin === 'Y' ? 42 : -100, y: 66, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CARE SKIN
        essential_newborn_cord_clamping: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.cord_clamping === 'Y' ? 162 : -100, y: 78, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CORD CLAMPING
        essential_newborn_prophylaxis: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.prophylaxis === 'Y' ? 162 : -100, y: 66, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CARE EYE PROPHYLARIXIS
        essential_newborn_weighing: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.weighing === 'Y' ? 264 : -100, y: 78, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CORD WEIGHT
        essential_newborn_vitamin_k: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.vitamin_k === 'Y' ? 264 : -100, y: 66, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN CARE VITAMINS 
        essential_newborn_bcg: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.bcg === 'Y' ? 376 : -100, y: 78, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN BGC
        essential_newborn_non_separation: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.non_separation === 'Y' ? 376 : -100, y: 66, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN NON SEPERATION
        essential_newborn_hepatitis_b: { name: check_imge_icon, x: cforms_data.patient_confinement.ESSENTIAL_NEW_BORN?.hepatitis_b === 'Y' ? 470 : -100, y: 78, type: 'icon', width: 16, height: 16}, // ESSENTIAL NEWBORN HEPATITIS B

        hiv_aids: { name: cforms_data.patient_confinement.PATIENT_DATA.hiv_treatment_lab_no ? cforms_data.patient_confinement.PATIENT_DATA.hiv_treatment_lab_no : '', x: 292, y: 56, type: 'text'}, // HIV/AIDS LABORATORY NUMBER

        first_case_rate: { name: cforms_data.patient_confinement.FIRST_CASE_RATES ? cforms_data.patient_confinement.FIRST_CASE_RATES.first_case_rate_code : '', x: 174, y: 24, type: 'text'}, // FIRST CASE RATE
        second_case_rate: { name: cforms_data.patient_confinement.SECOND_CASE_RATES ? cforms_data.patient_confinement.SECOND_CASE_RATES.second_case_rate_code : '', x: 428, y: 24, type: 'array_object'}, // SECOND CASE RATE

        phic_doctor: {
            name: cforms_data.patient_data.PHIC_DOCTOR,
            x: 0,
            y: 554,
            type: 'array_object_doc'
        },
        // // ...doctorGroupsObject,

        doctor_sign_path: { name: doctor_sign_path_image ? doctor_sign_path_image : '', x: 138, y: 824, type: doctor_sign_path_image ? 'icon_p2' : 'text_p2', width: 54, height: 54 }, // ONLY THE PRIMARY DOCTOR HAVE A DOCTOR SIGNATURE

        patient_sign_path: { name:  patient_sign_path_image ? patient_sign_path_image : '', x: 104, y: 200, type: patient_sign_path_image ? 'icon_p2' : 'text_p2', width: 54, height: 54 },

        p_last_name_p2: { name: cforms_data.patient_data.PATIENT_DATA.last_name, x: 24, y: 206, type: 'text_p2'}, // PATIENT LAST NAME
        p_first_name_p2: { name: cforms_data.patient_data.PATIENT_DATA.first_name, x: 104, y: 206, type: 'text_p2'},  // PATIENT FIRST NAME
        // p_suffix_p2: { name: cforms_data.patient_data.PATIENT_DATA.suffix, x: 184, y: 206, type: 'text_p2'}, // PATIENT SUFFIX NAME
        p_middle_name_p2: { name: cforms_data.patient_data.PATIENT_DATA.middle_name, x: 184, y: 206, type: 'text_p2'}, // PATIENT MIDDLE NAME

        certification_check: { 
            name: check_imge_icon, 
            ...(
                cforms_data.patient_data.CERTIFICATION.phic_ben_is_enough === '1' ? { x: 34, y: 614} : 
                cforms_data.patient_data.CERTIFICATION.phic_ben_is_enough === '2' ? { x: 34, y: 530} :
                { x: 0, y: -100}
            ),
            type: 'icon_p2',
            width: 16,
            height: 16
        },
        ...(cforms_data.patient_data.CERTIFICATION.phic_ben_is_enough === '1' ? {
            total_health_inst_fees: { name: cforms_data.patient_data.CERTIFICATION.total_health_inst_fees, x: 434, y: 582, type: 'text_p2'}, // HCI FEES
            total_professional_fees: { name: cforms_data.patient_data.CERTIFICATION.total_professional_fees, x: 434, y: 568, type: 'text_p2'}, // PROF FEES
            grand_total: { name: cforms_data.patient_data.CERTIFICATION.grand_total, x: 434, y: 552, type: 'text_p2'}, // GRAND TOTAL
        } : { 
            total_health_inst_fees: { name: cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_amount, x: 160, y: 442, type: 'text_p2'},
            total_health_inst_man_dis: { name: cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount, x: 260, y: 442, type: 'text_p2'},
            total_health_inst_phic: { name: cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_philhealth, x: 360, y: 442, type: 'text_p2'},
            total_health_inst_balance: { name: cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_balance, x: 464, y: 458, type: 'text_p2'},

            total_health_inst_member_check: has_member ? { name: check_imge_icon, x: 422, y: 432, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2'}, // MEMBER
            total_health_inst_hmo_check: has_hmo ? { name: check_imge_icon, x: 496, y: 432, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2'}, // HMO
            total_health_inst_other_src_check: has_others ? { name: check_imge_icon, x: 422, y: 422, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2'}, // OTHERS

            total_professional_fees: { name: cforms_data.certification.PROFESSIONAL_FEES[0].amount, x: 160, y: 392, type: 'text_p2'},
            total_professional_man_dis: { name: cforms_data.certification.TOTAL_SUMMARY_OF_FEES.total_mandatory_discount, x: 260, y: 392, type: 'text_p2'},
            total_professional_phic: { name: cforms_data.certification.PROFESSIONAL_FEES[0].philhealth, x: 360, y: 392, type: 'text_p2'},
            total_professional_balance: { name: get_total_prof_fees.toString(), x: 464, y: 410, type: 'text_p2' },

            total_prof_inst_member_check: has_member_prof ? { name: check_imge_icon, x: 422, y: 382, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2'}, // MEMBER
            total_prof_hmo_check: has_hmo_prof ? { name: check_imge_icon, x: 496, y: 384, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2' }, // HMO
            total_prof_other_src_check: has_others_prof ? { name: check_imge_icon, x: 422, y: 374, width: 16, height: 16, type: 'icon_p2' } : { name: '', x: 422, y: 432, width: 16, height: 16, type: 'text_p2'}, // OTHERS

            total_drugs_and_meds_supplies_check: { 
                name: check_imge_icon, 
                ...(drugs_and_meds_supplies_total ? {
                    x: 418, y: 336,
                } : {
                    x: 358, y: 336,
                }),
                width: 16, 
                height: 16, 
                type: 'icon_p2' 
            },

            total_drugs_and_meds_supplies: { name: drugs_and_meds_supplies_total.toString(), x: 494, y: 342, type: 'text_p2'},

            total_lab_room_board_operating_check: { 
                name: check_imge_icon, 
                ...(drugs_and_meds_supplies_total ? {
                    x: 418, y: 310,
                } : {
                    x: 358, y: 310,
                }),
                width: 16, 
                height: 16, 
                type: 'icon_p2' 
            },

            total_lab_room_board_operating: { name: lab_room_board_operating_total.toString(), x: 494, y: 316, type: 'text_p2'}
        }),

        patient_date_signed: { 
            name: (mixin.methods.formatDate(cforms_data.accreditation_and_signature.PATIENT_DATA.patient_date_signed) || '').replace(/-/g, ''),
            x: [ 130, 142, 160, 174, 194, 206, 218, 230 ],
            y: 180,
            type: 'date_time_p2'
        },

        rel_to_patient: { 
            name: check_imge_icon, 
            ...(
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_to_patient === 'Spouse' ? { x: 158, y: 146} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_to_patient === 'Sibling' ? { x: 158, y: 136} : 
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_to_patient === 'Child' ? { x: 204, y: 146} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_to_patient === 'Parent' ? { x: 248, y: 146} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_to_patient === 'Others' ? { x: 204, y: 134} :
                { x: 0, y: -100}
            ),
            type: 'icon_p2',
            width: 16,
            height: 16
        },

        rel_for_signing_on_behalf: { 
            name: check_imge_icon, 
            ...(
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_for_signing_on_behalf === 'Incapacitated' ? { x: 158, y: 122} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_for_signing_on_behalf === 'Others' ? { x: 158, y: 110} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_for_signing_on_behalf === 'Patient' ? { x: 356, y: 122} :
                cforms_data.accreditation_and_signature.PATIENT_DATA.rel_for_signing_on_behalf === 'Representative' ? { x: 356, y: 110} :
                { x: 0, y: -100}
            ),
            type: 'icon_p2',
            width: 16,
            height: 16
        },
    }]

    function drawICD(pdf_data, diagnosis, font, fontSize, maxWidth, x_position, y_position){
        y_position = 376
        const icd_code = diagnosis;
        const lines = splitTextByWidth(icd_code.icd_description, font, fontSize, maxWidth);

        for (const line of lines) {
            pdf_data.drawText(line, {
                x: x_position,
                y: y_position,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
            y_position -= fontSize + 9;
        }

        y_position += lines.length === 1 ? 16 : lines.length === 2 ? 30 : 58
        // Draw ICD Code
        pdf_data.drawText(icd_code.icd_code, {
            x: x_position + 90,
            y: y_position,
            size: 5,
            color: rgb(font_color_r, font_color_g, font_color_b)
        }); 

        if (Array.isArray(diagnosis.procedure)) {
            y_position += 14    
            maxWidth = 100
            diagnosis.procedure.forEach((proc) => {
                const proc_lines = splitTextByWidth(proc.cpt_description.replace("\n", " "), font, fontSize, maxWidth);

                for (const line of proc_lines) {
                    y_position -= fontSize + 10;
                    pdf_data.drawText(line, {
                        x: x_position + 166,
                        y: y_position,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                }

                pdf_data.drawText(proc.cpt_code, {
                    x: x_position + 286,
                    y: y_position,
                    size: fontSize,
                    color: rgb(font_color_r, font_color_g, font_color_b)
                });

                pdf_data.drawText(proc.procedure_date, {
                    x: x_position + 356,
                    y: y_position,
                    size: fontSize,
                    color: rgb(font_color_r, font_color_g, font_color_b)
                });

                pdf_data.drawImage(check_imge_icon, {
                    x: x_position + ( proc.laterality === 'L' ? 432 : proc.laterality === 'R' ? 468 : proc.laterality === 'B' ? 506 : -1000 ),
                    y: y_position,
                    width: 16,
                    height: 16
                })
            });
        }
    }

    function drawDoctor(element, x, y, x_image,  n_y_image,  y_y_image, y_date_signed, phic_y, pdf_data){
        element.forEach(el => {
            let date_signed =  (mixin.methods.formatDate(el.date_signed) || '').replace(/-/g, '')
            let doc_phic_acc_no = (el.doc_phic_acc_no || '').replace(/-/g, '')

            const p_signed_box_pos = [ 130, 142, 162, 174, 194, 206, 218, 230 ]

            y_date_signed -= 62
            for (let i = 0; i < date_signed.length && i < p_signed_box_pos.length; i++) {
                
                pdf_data.drawText(date_signed.charAt(i), {
                    x: p_signed_box_pos[i],
                    y: y_date_signed,
                    size: size_text,
                    color: rgb(font_color_r, font_color_g, font_color_b),
                })
            }

            const accreditation_pin_box = [
                104, 116, 128, 140, 160, 172, 186, 198, 208, 222, 234, 254
            ]

            phic_y -= 64
            for (let i = 0; i < doc_phic_acc_no.length && i < accreditation_pin_box.length; i++) {
                pdf_data.drawText(doc_phic_acc_no.charAt(i), {
                x: accreditation_pin_box[i],
                y: phic_y,
                size: size_text,
                color: rgb(font_color_r, font_color_g, font_color_b),
                })
            }

            y -= 62
            
            n_y_image -= 62
            y_y_image -= 62
            
            pdf_data.drawImage(check_imge_icon, {
                x: x_image,
                y: el.co_pay === 'N' ? n_y_image : y_y_image,
                width: 16,
                height: 16
            })

            pdf_data.drawText(el.doctor_name, {
                x: x,
                y: y,
                size: size_text,
                color: rgb(font_color_r, font_color_g, font_color_b)
            })
        })
    }

    function drawContent(pdf_data, pdf_data_key, element){
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
                    pdf_data.drawImage(element[key].name, {
                        x: element[key].x,
                        y: element[key].y,
                        width: element[key].width,
                        height: element[key].height
                    })
                } 
                // else if(element[key].type === 'array' ) {
                //     let x = 120
                //     element[key].name.forEach(el => {
                //         x += 20
                //         pdf_data.drawText(el.icd_code, {
                //             x: x,
                //             y: 442,
                //             size: size_text,
                //             color: rgb(font_color_r, font_color_g, font_color_b)
                //         })  
                //     })
                // } 
                else if(element[key].type === 'array') {
                    let y = 442;

                    element[key].name.forEach(el => {

                        const diagnosis = `${el.icd_code} / ${el.icd_description}`;

                        pdf_data.drawText(diagnosis, {
                            x: 145,
                            y: y,
                            size: size_text,
                            color: rgb(font_color_r, font_color_g, font_color_b)
                        });

                        y -= 10;
                    });
                } else {
                    let items_title = ['PRIMARY', 'SECONDARY', 'OTHERS'];
                    let x_position = 40; // Starting Y position
                    let y_position = 378; // Starting Y position

                    let fontSize = 5;
                    let maxWidth = 80; // adjust as needed

                    items_title.forEach(diag_type => {
                        const diagnoses = element[key].name[diag_type];
                        
                        // Safely check if this category has data
                        if (Array.isArray(diagnoses)) {
                            diagnoses.forEach(async (diagnosis) => {
                                if(diag_type === 'PRIMARY') {
                                    drawICD(pdf_data, diagnosis, font, fontSize, maxWidth, x_position, y_position)
                                } else {
                                    const [pdf_copy_page] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);
                                    delete pdf_item_data_one[0].discharged_diagnosis
                                    pdf_item_data_one.map(async(data) => {
                                        drawContent(pdf_copy_page, pdf_data_key, data)
                                    })
                                    cf_pdf.addPage(pdf_copy_page);
                                    drawICD(pdf_copy_page, diagnosis, font, fontSize, maxWidth, x_position, y_position)
                                }
                            });
                        } 
                    });
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
                    pdf_data.drawImage(element[key].name, {
                        x: element[key].x,
                        y: element[key].y,
                        width: element[key].width,
                        height: element[key].height
                    })
                }
                
                if(element[key].type === 'array_object_doc'){
                    const doctor_chunks = chunkArray(element[key].name, 3);
                    doctor_chunks.forEach(async (element, id) => {
                        let x = 144
                        let y = 908
                        let x_image = 332
                        let n_y_image = 904
                        let y_y_image = 888
                        let y_date_signed = 882
                        let phic_y = 928
                        if(id === 0){
                            drawDoctor(element, x, y, x_image, n_y_image, y_y_image, y_date_signed, phic_y, pdf_data)
                        } else {
                            const [pdf_copy_page] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);
                            delete pdf_item_data_one[0].phic_doctor
                            pdf_item_data_one.map(async(data) => {
                                drawContent(pdf_copy_page, pdf_data_key, data)
                            })
                            drawDoctor(element, x, y, x_image, n_y_image, y_y_image, y_date_signed, phic_y, pdf_copy_page)
                            cf_pdf.addPage(pdf_copy_page);
                        }
                    })
                } 
            }
        }
    }

    for (let pdf_data_key = 0; pdf_data_key < pagesCount; pdf_data_key++) {
        // Deep copy page from source into new PDF
        const [pdf_data] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);

        pdf_item_data_one.map(async(element) => {
            drawContent(pdf_data, pdf_data_key, element)
        })

        cf_pdf.addPage(pdf_data);
    }

    const modified_pdf = await cf_pdf.save()
    const blob = new Blob([modified_pdf], { type: "application/pdf"})
    has_pdf = URL.createObjectURL(blob)

    return has_pdf
}
