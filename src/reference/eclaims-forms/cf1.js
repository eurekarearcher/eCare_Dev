import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import check_icon from '../../assets/check.png'

export const getCF1 = async (has_pdf, cf1_data_p1,cf1_data_p2) => {
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

    //PART I - PATIENT INFORMATION
    //PIN
    const mem_phic_pin = cf1_data_p1.PRINCIPAL_DATA.mem_phic_pin || ''

    //Name of Member
    const mem_last_name   = cf1_data_p1.PRINCIPAL_DATA.last_name || ''
    const mem_first_name  = cf1_data_p1.PRINCIPAL_DATA.first_name || ''
    let mem_suffix_name   = cf1_data_p1.PRINCIPAL_DATA.suffix_name || ''
    mem_suffix_name       = mem_suffix_name === 'NA' ? '' : mem_suffix_name
    const mem_middle_name = cf1_data_p1.PRINCIPAL_DATA.middle_name || ''
    
    //Date of Birth
    const mem_birthday         = (cf1_data_p1.PRINCIPAL_DATA.birthday || '').replace(/-/g, '')
    
    //Sex
    const mem_gender   = cf1_data_p1.PATIENT_DATA.gender || ""

    //Address
    let mem_home_unit_room_floor      = cf1_data_p1.PRINCIPAL_DATA.mem_home_unit_room_floor || ""
    mem_home_unit_room_floor          = mem_home_unit_room_floor === 'NA' ? '' : mem_home_unit_room_floor
    let mem_home_building_name        = cf1_data_p1.PRINCIPAL_DATA.mem_home_building_name || ""
    mem_home_building_name            = mem_home_building_name === 'NA' ? '' : mem_home_building_name
    let mem_home_bldgno               = cf1_data_p1.PRINCIPAL_DATA.mem_home_bldgno || ""
    mem_home_bldgno                   = mem_home_bldgno === 'NA' ? '' : mem_home_bldgno
    let mem_home_street               = cf1_data_p1.PRINCIPAL_DATA.mem_home_street || ""
    mem_home_street                   = mem_home_street === 'NA' ? '' : mem_home_street
    let mem_home_subdivision          = cf1_data_p1.PRINCIPAL_DATA.mem_home_subdivision || ""
    mem_home_subdivision              = mem_home_subdivision === 'NA' ? '' : mem_home_subdivision
    const mem_home_bgy                = cf1_data_p1.PRINCIPAL_DATA.mem_home_bgy || ""
    const mem_home_city_municipality  = cf1_data_p1.PRINCIPAL_DATA.mem_home_city_municipality || ""
    const mem_home_province           = cf1_data_p1.PRINCIPAL_DATA.mem_home_province || ""
    const region                      = cf1_data_p1.PRINCIPAL_DATA.region || ""
    const mem_home_zip                = cf1_data_p1.PRINCIPAL_DATA.mem_home_zip || ""
    
    //Contact Information
    let mem_phone_no  = cf1_data_p1.PRINCIPAL_DATA.phone_no  || ""
    mem_phone_no      = mem_phone_no === 'NA' ? '' : mem_phone_no;
    let mem_mobile_no = cf1_data_p1.PRINCIPAL_DATA.mobile_no || ""
    mem_mobile_no     = mem_mobile_no === 'NA' ? '' : mem_mobile_no;
    let mem_email_add = cf1_data_p1.PRINCIPAL_DATA.email_add || ""
    mem_email_add     = mem_email_add === 'NA' ? '' : mem_email_add;

    //Patient is a member
    const mem_is_patient   = cf1_data_p1.PATIENT_DATA.is_patient || ""

    //PART III - MEMBER CERTIFICATION
    //CHECK IF SIGNATURE IS VALID
    let patient_sign_icon = null
    let mem_fullname = null
    let patient_date_signed = null
    const patient_sign_path = await fetch(cf1_data_p2.TRANSACTION.patient_sign_path).then(res => res.arrayBuffer())

    try {
        patient_sign_icon = await cf_pdf.embedPng(patient_sign_path)
    }catch (err) {
        //console.error("Invalid/No image");
    }
    
    mem_fullname   = mem_first_name+(mem_middle_name?' '+mem_middle_name:'')+" "+mem_last_name+(mem_suffix_name?' '+mem_suffix_name:'')
    patient_date_signed = (cf1_data_p2.SIGNATURE.patient_date_signed || '').replace(/-/g, '')

    //PART IV - EMPLOYER'S CERTIFICATION
    //Philhealth Employer's Number
    let mem_employer_phic_pin  = cf1_data_p1.PRINCIPAL_DATA.mem_employer_phic_pin || ''
    mem_employer_phic_pin  = mem_employer_phic_pin === 'N/A' ? '' : mem_employer_phic_pin
    const mem_company_name = cf1_data_p1.PRINCIPAL_DATA.mem_company_name || ''

    let pdf_item_data_one = [{
        phic_pin: { 
            name: mem_phic_pin,
            x: [ 264, 276, 296, 308, 321, 334, 346, 358, 370, 382, 394, 413 ],
            y: 713,
            type: 'box_position'
        },

        last_name: { name: mem_last_name, x: 20, y: 685, width: 115, type: 'text_wrap'},
        first_name: { name: mem_first_name, x: 130, y: 685, width: 115, type: 'text_wrap'}, 
        suffix_name: { name: mem_suffix_name, x: 245, y: 685, width: 109, type: 'text_wrap'},
        middle_name: { name: mem_middle_name, x: 344, y: 685, width: 109, type: 'text_wrap'}, 

        birthday: { 
            name: mem_birthday,
            x: [ 462, 475, 494, 506, 526, 539, 552, 563 ],
            y: 684,
            type: 'box_position'
        },

        gender: { 
            name: check_imge_icon, 
            ...(
                mem_gender === 'F' ? { x: 520, y: 642} : 
                mem_gender === 'M' ? { x: 483, y: 642} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },

        home_unit_room_floor: { name: mem_home_unit_room_floor, x: 28, y: 627, width : 100, type: 'text_wrap'},
        home_building_name: { name: mem_home_building_name, x: 128, y: 627, width : 118, type: 'text_wrap'},
        home_bldgno: { name: mem_home_bldgno, x: 248, y: 627, width : 107, type: 'text_wrap'},
        home_street: { name: mem_home_street, x: 355, y: 627, width : 95, type: 'text_wrap'},
        home_subdivision: { name: mem_home_subdivision, x: 450, y: 137, width : 100, type: 'text_wrap'},
        home_bgy: { name: mem_home_bgy, x: 28, y: 597, width : 100, type: 'text_wrap'},
        home_city_municipality: { name: mem_home_city_municipality, x: 128, y: 597, width : 120, type: 'text_wrap'},
        home_province: { name: mem_home_province, x: 248, y: 597, width : 107, type: 'text_wrap'},
        region: { name: region, x: 355, y: 597, width : 95, type: 'text_wrap'},
        home_zip: { name: mem_home_zip, x: 450, y: 597, width : 137, type: 'text_wrap'},

        phone_no: { name: mem_phone_no, x: 28, y: 555,  width: 195,  type: 'center_text'},
        mobile_no: { name: mem_mobile_no, x: 223, y: 555, width: 173,  type: 'center_text'},
        email_add: { name: mem_email_add, x: 396, y: 555,  width: 173,  type: 'center_text'},

        is_patient: { 
            name: check_imge_icon, 
            ...(
                mem_is_patient === '1' ? { x: 140, y: 516} : 
                mem_is_patient === '0' ? { x: 234, y: 516} :
                { x: -100, y: -100}
            ),
            type: 'icon', 
            width: 16, 
            height: 16
        },
        
        fullname: { name: mem_fullname, x: 20, y: 360, width: 290, type: 'text_wrap'}, 
        patientsign_path: { name: patient_sign_icon, x: 116, y: 348, type: 'icon', width: 74, height: 74 },
        patient_date_signed: { 
            name: patient_date_signed,
            x: [ 173, 185, 197, 209,109, 122, 141, 153 ],
            y: 330,
            type: 'box_position'
        },

        rel_to_patient: { 
            name: check_imge_icon, 
            ...(
                cf1_data_p2.PATIENT_DATA.rel_to_patient === 'Spouse' ? { x: 396, y: 296} : 
                cf1_data_p2.PATIENT_DATA.rel_to_patient === 'Sibling' ? { x: 396, y: 284} : 
                cf1_data_p2.PATIENT_DATA.rel_to_patient === 'Child' ? { x: 442, y: 296} :
                cf1_data_p2.PATIENT_DATA.rel_to_patient === 'Parent' ? { x: 482, y: 296} :
                cf1_data_p2.PATIENT_DATA.rel_to_patient === 'Others' ? { x: 442, y: 282} :
                { x: 0, y: -100}
            ),
            type: 'icon',
            width: 16,
            height: 16
        },

        rel_for_signing_on_behalf: { 
            name: check_imge_icon, 
            x: 72, y: 250,
            ...(
                cf1_data_p2.PATIENT_DATA.rel_for_signing_on_behalf === 'Incapacitated' ? { x: 396, y: 264} :
                cf1_data_p2.PATIENT_DATA.rel_for_signing_on_behalf === 'Others' ? { x: 396, y: 250} :
                cf1_data_p2.PATIENT_DATA.rel_for_signing_on_behalf === 'Patient' ? { x: 24, y: 250} :
                cf1_data_p2.PATIENT_DATA.rel_for_signing_on_behalf === 'Representative' ? { x: 72, y: 250} :
                { x: 0, y: -100}
            ),
            type: 'icon',
            width: 16,
            height: 16
        },

        employer_phic_pin: { 
            name: mem_employer_phic_pin,
            x: [ 201, 213, 233, 246, 258, 270, 282, 295, 307, 319, 331, 351 ],
            y: 213,
            type: 'box_position'
        },
        company_name: { name: mem_company_name, x: 70, y: 183, width: 472,  type: 'center_text'},
        
    }]

    for (let pdf_data_key = 0; pdf_data_key < pagesCount; pdf_data_key++) {
        // Deep copy page from source into new PDF
        const [pdf_data] = await cf_pdf.copyPages(pdf_doc, [pdf_data_key]);

        pdf_item_data_one.map(async(element) => {
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
                            
                            let text_width = font.widthOfTextAtSize(row_line_text[i], size_text);
                            let x = element[key].x + ((element[key].width - text_width) / 2);
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
