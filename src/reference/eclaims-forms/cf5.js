import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import check_icon from '../../assets/check.png'
import mixin from '@/mixin'

export const getCF5 = async (has_pdf, cforms_data) => {
    const font_color = rgb(0.13, 0.13, 0.13)
    const size_text = 7
    const existing_pdf_bytes = await fetch(has_pdf).then(res => res.arrayBuffer())
    const pdf_doc = await PDFDocument.load(existing_pdf_bytes)
    const cf_pdf = await PDFDocument.create()
    const font = await cf_pdf.embedFont(StandardFonts.Helvetica)
    const pages = await cf_pdf.copyPages(pdf_doc, pdf_doc.getPageIndices())
    pages.forEach(p => cf_pdf.addPage(p))
    const firstPage = cf_pdf.getPages()[0]
    const pdx = cforms_data?.patient_confinement?.ADMISSION_DIAGNOSIS?.[0]?.icd_code || ''
    // const sdx = cforms_data?.course_in_the_ward?.DISCHARGED_DIAGNOSIS?.SECONDARY || []
    const secondary = cforms_data?.course_in_the_ward?.DISCHARGED_DIAGNOSIS?.SECONDARY || []
    const others = cforms_data?.course_in_the_ward?.DISCHARGED_DIAGNOSIS?.OTHERS || []
    const diagnoses = cforms_data?.course_in_the_ward?.DISCHARGED_DIAGNOSIS || {}
    const procedures = Object.values(diagnoses).flatMap(group =>(group || []).flatMap(d =>Array.isArray(d?.procedure) ? d.procedure : []))
    const patient = cforms_data?.patient_data?.PATIENT_DATA || {}
    const full_name = `${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}`
    const doctor = cforms_data?.accreditation_and_signature?.PHIC_DOCTOR?.[0] || {}
    const doctor_name = `${doctor.first_name || ''}, ${doctor.middle_name || ''}, ${doctor.last_name || ''}, ${doctor.suffix || ''}`
    const doctor_sign_path = cforms_data?.accreditation_and_signature?.TRANSACTION?.doctor_sign_path || ''
    const patient_signature_path = cforms_data?.accreditation_and_signature?.TRANSACTION?.patient_sign_path || ''
    const patient_date_signed = mixin.methods.formatDate(cforms_data?.certification?.SIGNATURE.patient_date_signed) || ''
    const doctor_date_signed = mixin.methods.formatDate(cforms_data?.certification?.SIGNATURE.doctor_date_signed) || ''
    const new_born = cforms_data?.patient_confinement?.ESSENTIAL_NEW_BORN.weighing || ''
    const rel_to_patient = cforms_data?.accreditation_and_signature?.PATIENT_DATA.rel_to_patient || ''
    const rel_map = {
        Spouse: { x: 80, y: 200 },
        Child: { x: 140, y: 200 },
        Parent: { x: 200, y: 200 },
        Sibling: { x: 80, y: 180 },
        Others: { x: 140, y: 180 }
    }
    const patient_sign_behalf = cforms_data?.accreditation_and_signature?.PATIENT_DATA.rel_for_signing_on_behalf || ''
    const rel_p_behalf = {
        Incapacitated: { x: 80, y: 143 },
        Representative: { x: 80, y: 143 },
        Other_reason: { x: 80, y: 143 },
    }
    const loadPng = async (url) => url ? fetch(url).then(r => (r.ok ? r.arrayBuffer() : null)).then(buf => (buf ? cf_pdf.embedPng(buf) : null)).catch(() => null) : null;
    const check_icon_l = check_icon ? await loadPng(check_icon) : null

    firstPage.drawText(pdx, {
        x: 39,
        y: 669,
        size: size_text,
        font,
        color: font_color
    })

    // sdx.slice(0, 12).forEach((item, index) => {
    //     const x = 177 + (index % 6) * 65
    //     const y = index < 6 ? 669 : 535

    //     firstPage.drawText(item.icd_code || '', {
    //         x,
    //         y,
    //         size: size_text,
    //         font,
    //         color: font_color
    //     })
    // })

    const sdx = [...secondary, ...others]

    sdx.slice(0, 12).forEach((item, index) => {
        // const x = 177 + (index % 6) * 41.3
        // const y = index < 6 ? 669 : 535
        const x = 175 + (index % 6) * 41.3
        const y = index < 6 ? 669 : 635

        firstPage.drawText(item.icd_code || '', {
            x,
            y,
            size: size_text,
            font,
            color: font_color
        })
    })

    procedures.slice(0, 20).forEach((proc, index) => {
        const x = 38 + (index % 10) * 41.3
        const y = index < 10 ? 555 : 497

        const cpt = proc?.cpt_code || ''
        const lat = proc?.laterality || ''
        const ext1 = proc?.ext1 || ''
        const ext2 = proc?.ext2 || ''

        firstPage.drawText(cpt, {
            x,
            y,
            size: size_text,
            font,
            color: font_color
        })

        const latY = y - 24
        const spacing = 10
        const positions = { L: 0, R: 1, B: 2 }
        const indexPos = positions[lat]

        if (indexPos !== undefined && check_icon_l) {
            firstPage.drawImage(check_icon_l, {
                x: x + (indexPos * spacing) + .5 ,
                y: latY,                 
                width: 6,
                height: 6
            })
        }

        firstPage.drawText(ext1, {
            x: x + 8,
            y: y - 38,
            size: size_text,
            font,
            color: font_color
        })

        firstPage.drawText(ext2, {
            x: x + 18,
            y: y - 38,
            size: size_text,
            font,
            color: font_color
        })
    })

    firstPage.drawText(new_born, {
        x: 197,
        y: 425,
        size: size_text,
        font,
        color: font_color
    })

    firstPage.drawText(full_name.trim(), {
        x: 60,
        y: 262,
        size: size_text,
        font,
        color: font_color
    })

    firstPage.drawText(patient_date_signed, {
        x: 440,
        y: 142,
        size: size_text,
        font,
        color: font_color
    })
    
    if (patient_signature_path) {
        const patient_sign = await loadPng(patient_signature_path)

        if (patient_sign) {
            firstPage.drawImage(patient_sign, {
                x: 120,
                y: 262,
                width: 90,
                height: 30
            })
        }
    }

    if (check_icon_l && rel_map[rel_to_patient]) {
        const { x, y } = rel_map[rel_to_patient]

        firstPage.drawImage(check_icon_l, {
            x,
            y,
            width: 10,
            height: 10
        })
    }

    if (check_icon_l && rel_p_behalf[patient_sign_behalf]) {
        const { x, y } = rel_p_behalf[patient_sign_behalf]

        firstPage.drawImage(check_icon_l, {
            x,
            y,
            width: 10,
            height: 10
        })
    }

    firstPage.drawText(doctor_date_signed, {
        x: 320,
        y: 67,
        size: size_text,
        font,
        color: font_color
    })

    firstPage.drawText(doctor_name.trim(), {
        x: 60,
        y: 67,
        size: size_text,
        font,
        color: font_color
    })


    if (doctor_sign_path) {
        const doctor_sign = await loadPng(doctor_sign_path)

        if (doctor_sign) {
            firstPage.drawImage(doctor_sign, {
                x: 55,
                y: 67,
                width: 90,
                height: 30
            })
        }
    }

    const modified_pdf = await cf_pdf.save()
    const blob = new Blob([modified_pdf], { type: "application/pdf"})
    has_pdf = URL.createObjectURL(blob)

    return has_pdf
}