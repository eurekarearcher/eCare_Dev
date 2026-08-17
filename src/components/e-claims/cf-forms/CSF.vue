<template>
  <div>
      <iframe v-if="pdf_url" :src="pdf_url + '#toolbar=0'" width="100%" height="600px" style="border:none;" ref="pdf"></iframe>
  </div>
</template>

<script>
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export default {
  props: ['csf_data_p1', 'csf_data_p2'],
  data(){
    return{
      pdf_url: null,
      check_icon: require('../../../assets/check.png'),
    }
  },

  mounted(){
    this.getPDF();
  },

  methods:{
    async getPDF(){
      let response = await this.$services.getPDFTemplate({
        request_key: 'csf',
      })

      if(response.status === 200){
        response = response.data
        this.pdf_url = response.csf

        this.downLoadCSF();
      }
    },

    async downLoadCSF() {
      let font_color_r = 0.13
      let font_color_g = 0.13
      let font_color_b = 0.13
      let size_text = 7
      const existing_pdf_bytes = await fetch(this.pdf_url).then(res => res.arrayBuffer());
      const pdf_doc = await PDFDocument.load(existing_pdf_bytes);
      const font = await pdf_doc.embedFont(StandardFonts.Helvetica);
      const pages = pdf_doc.getPages()
      const pdf_page = pages[0]
      const loadPng = async (url) => url ? fetch(url).then(r => (r.ok ? r.arrayBuffer() : null)).then(buf => (buf ? pdf_doc.embedPng(buf) : null)).catch(() => null): null;

      //PART I - MEMBER AND PATIENT INFORMATION AND CERTIFICATION
      const pin = this.csf_data_p1.PRINCIPAL_DATA.mem_phic_pin || ''
      const pin_y = 765

      const pin_box_positions = [
        264, 276, 296, 308, 321, 334, 346, 358, 370, 382, 394, 413
      ]

      for (let i = 0; i < pin.length && i < pin_box_positions.length; i++) {
        pdf_page.drawText(pin.charAt(i), {
          x: pin_box_positions[i],
          y: pin_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const name_y = 738;
      const name_size = size_text;

      const boxes = {
        last_name: { x: 18, width: 100 },
        first_name: { x: 128, width: 100 },
        suffix: { x: 278, width: 30 },
        middle_name: { x: 348, width: 100 }
      };

      function drawCenteredText(text, box) {
        const text_width = font.widthOfTextAtSize(text, name_size);
        const x = box.x + (box.width - text_width) / 2;

        pdf_page.drawText(text, {
          x,
          y: name_y,
          size: name_size,
          font,
          color: rgb(font_color_r, font_color_g, font_color_b),
        });
      }

      drawCenteredText(this.csf_data_p1.PRINCIPAL_DATA.last_name || '', boxes.last_name);
      drawCenteredText(this.csf_data_p1.PRINCIPAL_DATA.first_name || '', boxes.first_name);
      drawCenteredText(this.csf_data_p1.PRINCIPAL_DATA.suffix || '', boxes.suffix);
      drawCenteredText(this.csf_data_p1.PRINCIPAL_DATA.middle_name || '', boxes.middle_name);

      const member_birthday = (this.csf_data_p1.PRINCIPAL_DATA.birthday || '').replace(/-/g, '')
      const bday_y = 734

      const bday_box_pos = [
        462, 474, 494, 506, 526, 538, 550, 562
      ]

      for (let i = 0; i < member_birthday.length && i < bday_box_pos.length; i++) {
        pdf_page.drawText(member_birthday.charAt(i), {
          x: bday_box_pos[i],
          y: bday_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const patient_name_y = 672;

      const patient_boxes = {
        last_name: { x: 18, width: 100 },
        first_name: { x: 128, width: 100 },
        suffix: { x: 278, width: 30 },
        middle_name: { x: 348, width: 100 }
      };

      function drawPatientName(text, box) {
        const text_width = font.widthOfTextAtSize(text, name_size);
        const x = box.x + (box.width - text_width) / 2;

        pdf_page.drawText(text, {
          x,
          y: patient_name_y,
          size: name_size,
          font,
          color: rgb(font_color_r, font_color_g, font_color_b),
        });
      }

      drawPatientName(this.csf_data_p1.PRINCIPAL_DATA.last_name || '', patient_boxes.last_name);
      drawPatientName(this.csf_data_p1.PRINCIPAL_DATA.first_name || '', patient_boxes.first_name);
      drawPatientName(this.csf_data_p1.PRINCIPAL_DATA.suffix || '', patient_boxes.suffix);
      drawPatientName(this.csf_data_p1.PRINCIPAL_DATA.middle_name || '', patient_boxes.middle_name);

      const admit_confinement = (this.csf_data_p1.PATIENT_DATA.date_admitted || '').replace(/-/g, '')
      const admitted_y = 620

      const admitted_box_pos = [
        94, 106, 126, 138, 158, 170, 182, 194
      ]

      for (let i = 0; i < admit_confinement.length && i < admitted_box_pos.length; i++) {
        pdf_page.drawText(admit_confinement.charAt(i), {
          x: admitted_box_pos[i],
          y: admitted_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const discharge_confinement = (this.csf_data_p1.PATIENT_DATA.date_discharged || '').replace(/-/g, '')
      const discharge_y = 620

      const discharge_box_pos = [
        298, 310, 330, 342, 360, 374, 386, 398
      ]

      for (let i = 0; i < discharge_confinement.length && i < discharge_box_pos.length; i++) {
        pdf_page.drawText(discharge_confinement.charAt(i), {
          x: discharge_box_pos[i],
          y: discharge_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const patient_dob = (this.csf_data_p1.PRINCIPAL_DATA.birthday || '').replace(/-/g, '')
      const pdob_y = 620

      const pdob_box_pos = [
        462, 474, 494, 506, 526, 538, 550, 562
      ]

      for (let i = 0; i < patient_dob.length && i < pdob_box_pos.length; i++) {
        pdf_page.drawText(patient_dob.charAt(i), {
          x: pdob_box_pos[i],
          y: pdob_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const p_signature_url = this.csf_data_p2.TRANSACTION.patient_sign_path
      const p_signature_icon = await loadPng(p_signature_url);
      if (p_signature_icon) {
        pdf_page.drawImage(p_signature_icon, {
          x: 96, y: 556, width: 80, height: 40
        });
      }

      const full_name = this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.first_name) + ' ' +
        (this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.middle_name) ? this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.middle_name) : '') + ' ' +
        this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.last_name) + ' ' +
        (this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.suffix) ? this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.suffix) : '');

      const full_name_y = 570;
      const fullname_width  = 326
      const fullname_text_width = font.widthOfTextAtSize(full_name, size_text);
      const x = (fullname_width - fullname_text_width) / 2;

      pdf_page.drawText(full_name, {
        x,
        y: full_name_y,
        size: size_text,
        font, 
        color: rgb(font_color_r, font_color_g, font_color_b),
      });

      const p_date_signed = (this.formatDate(this.csf_data_p2.SIGNATURE.patient_date_signed) || '').replace(/-/g, '')
      const p_signed_y = 545

      const p_signed_box_pos = [
        127, 139, 159, 171, 191, 203, 215, 227
      ]

      for (let i = 0; i < p_date_signed.length && i < p_signed_box_pos.length; i++) {
        pdf_page.drawText(p_date_signed.charAt(i), {
          x: p_signed_box_pos[i],
          y: p_signed_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const check_icon = await fetch(this.check_icon).then(res => res.arrayBuffer())
      const check_imge_icon = await pdf_doc.embedPng(check_icon)

      const check_positions = {
        Spouse: { x: 397, y: 520 },
        Child:  { x: 444, y: 520 },
        Parent: { x: 482, y: 520 },
        Sibling:{ x: 397, y: 506 },
        Others: { x: 444, y: 506 }
      }

      const relation = this.csf_data_p2.PATIENT_DATA.rel_to_patient

      if (check_positions[relation]) {
        pdf_page.drawImage(check_imge_icon, {
          x: check_positions[relation].x,
          y: check_positions[relation].y,
          width: 10,
          height: 10
        })
      } else if (relation && relation !== null) {
        pdf_page.drawImage(check_imge_icon, {
          x: check_positions.Others.x,
          y: check_positions.Others.y,
          width: 10,
          height: 10
        })

        pdf_page.drawText(relation, {
          x: check_positions.Others.x + 40,
          y: check_positions.Others.y + 2,
          size: 8
        })
      }

      const rel_for_signing_positions = {
        Incapacitated: { x: 397, y: 480 }, 
        Patient: { x: 25, y: 480 },   
        Representative:  { x: 75, y: 480 } 
      }

      const rel_for_signing = this.csf_data_p2.PATIENT_DATA.rel_for_signing_on_behalf

      if (rel_for_signing === 'Incapacitated') {
        pdf_page.drawImage(check_imge_icon, {
          x: rel_for_signing_positions.Incapacitated.x,
          y: rel_for_signing_positions.Incapacitated.y,
          width: 10,
          height: 10
        })
      }else if (rel_for_signing === 'Patient') {
        pdf_page.drawImage(check_imge_icon, {
          x: rel_for_signing_positions.Patient.x,
          y: rel_for_signing_positions.Patient.y,
          width: 10,
          height: 10
        })
        // pdf_page.drawText(rel_for_signing, {
        //   x: rel_for_signing_positions.OtherReasons.x + 40,
        //   y: rel_for_signing_positions.OtherReasons.y + 2,
        //   size: 8
        // })
      } else if (rel_for_signing === 'Representative') {
        pdf_page.drawImage(check_imge_icon, {
          x: rel_for_signing_positions.Representative.x,
          y: rel_for_signing_positions.Representative.y,
          width: 10,
          height: 10
        })
        // pdf_page.drawText(rel_for_signing, {
        //   x: rel_for_signing_positions.OtherReasons.x + 40,
        //   y: rel_for_signing_positions.OtherReasons.y + 2,
        //   size: 8
        // })
      }

      //PART II - EMPLOYER’S CERTIFICATION (for employed members only)
      const pen = this.csf_data_p1.PRINCIPAL_DATA.mem_employer_phic_pin || ''
      const pen_y = 444

      const pen_box_positions = [
        199, 211, 231, 243, 256, 268, 280, 293, 304, 317, 329, 349
      ]

      for (let i = 0; i < pen.length && i < pen_box_positions.length; i++) {
        pdf_page.drawText(pen.charAt(i), {
          x: pen_box_positions[i],
          y: pen_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const company_name = this.csf_data_p1.PRINCIPAL_DATA.mem_company_name
      const company_name_y = 432

      pdf_page.drawText(company_name, {
        x: 312,
        y: company_name_y,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      //PART III - CONSENT TO ACCESS PATIENT RECORD/S
      const patient_signature_url = this.csf_data_p2.TRANSACTION.patient_sign_path
      const patient_signature_icon = await loadPng(patient_signature_url);

      if (patient_signature_icon) {
        pdf_page.drawImage(patient_signature_icon, {
          x: 96, y: 256, width: 80, height: 40
        });
      }

      const consent_full_name =
        this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.first_name) + ' ' +
        (this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.middle_name) ? this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.middle_name) : '') + ' ' +
        this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.last_name) + ' ' +
        (this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.suffix) ? this.textCapitalize(this.csf_data_p2.PRINCIPAL_DATA.suffix) : '');

      const consent_full_name_y = 272;
      const consent_text_width = font.widthOfTextAtSize(consent_full_name, size_text);
      const consent_width  = 360
      const consent_x = (consent_width - consent_text_width) / 2;

      pdf_page.drawText(consent_full_name, {
        x: consent_x,
        y: consent_full_name_y,
        size: size_text,
        font: font, 
        color: rgb(font_color_r, font_color_g, font_color_b)
      });

      const consent_date_signed = (this.formatDate(this.csf_data_p2.SIGNATURE.patient_date_signed) || '').replace(/-/g, '')
      const consent_signed_y = 272

      const consent_signed_box_pos = [
        404, 416, 436, 448, 468, 480, 492, 504
      ]

      for (let i = 0; i < consent_date_signed.length && i < consent_signed_box_pos.length; i++) {
        pdf_page.drawText(consent_date_signed.charAt(i), {
          x: consent_signed_box_pos[i],
          y: consent_signed_y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        })
      }

      const part3_check_position = {
        Spouse: { x: 397, y: 245 },
        Child:  { x: 443, y: 245 },
        Parent: { x: 482, y: 245 },
        // Parent: { x: 443, y: 230 },
        Sibling:{ x: 397, y: 230 },
        Others: { x: 443, y: 230 }
      }

      const part3_relation = this.csf_data_p2.PATIENT_DATA.rel_to_patient

      if (part3_check_position[part3_relation]) {
        pdf_page.drawImage(check_imge_icon, {
          x: part3_check_position[part3_relation].x,
          y: part3_check_position[part3_relation].y,
          width: 10,
          height: 10
        })
      } else if (part3_relation && part3_relation !== null) {
        pdf_page.drawImage(check_imge_icon, {
          x: part3_check_position.Others.x,
          y: part3_check_position.Others.y,
          width: 10,
          height: 10
        })

        pdf_page.drawText(part3_relation, {
          x: part3_check_position.Others.x + 40,
          y: part3_check_position.Others.y + 2,
          size: 8
        })
      }

      const part_3_rel_for_signing_positions = {
        Incapacitated: { x: 397, y: 215 },
        Patient: { x: 25, y: 205 },
        Representative: { x: 72, y: 205 },
        Others: { x: 397, y: 200 }
      }

      const part3_rel_for_signing = this.csf_data_p2.PATIENT_DATA.rel_for_signing_on_behalf

      if (part_3_rel_for_signing_positions[part3_rel_for_signing]) {
        const { x, y } = part_3_rel_for_signing_positions[part3_rel_for_signing]

        pdf_page.drawImage(check_imge_icon, {
          x,
          y,
          width: 10,
          height: 10
        })
      }

      if (part3_rel_for_signing === 'Others') {
        pdf_page.drawText(rel_for_signing, {
          x: part_3_rel_for_signing_positions.Others.x + 40,
          y: part_3_rel_for_signing_positions.Others.y + 2,
          size: 8
        })
      }

      //PART IV - HEALTH CARE PROFESSIONAL INFORMATION
      function drawAccreNo(pdf_page, accre_no, y, size_text, font_color_r, font_color_g, font_color_b) {
        const formatted_accre_no = (accre_no || '').replace(/-/g, '');
        if (!formatted_accre_no) return;

        const accre_box_positions = [88, 100, 113, 125, 146, 158, 170, 182, 195, 206, 219, 238];

        for (let i = 0; i < formatted_accre_no.length && i < accre_box_positions.length; i++) {
          pdf_page.drawText(formatted_accre_no.charAt(i), {
            x: accre_box_positions[i],
            y,
            size: size_text,
            color: rgb(font_color_r, font_color_g, font_color_b),
          });
        }
      }

      drawAccreNo.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[0]?.doc_phic_acc_no, 169, size_text, font_color_r, font_color_g, font_color_b);
      drawAccreNo.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[1]?.doc_phic_acc_no, 145, size_text, font_color_r, font_color_g, font_color_b);
      drawAccreNo.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[2]?.doc_phic_acc_no, 121, size_text, font_color_r, font_color_g, font_color_b);

      const doctor_signature_url1 = this.csf_data_p2.TRANSACTION.doctor_sign_path
      const doctor_signature_icon1 = await loadPng(doctor_signature_url1);

      if (doctor_signature_icon1) {
        pdf_page.drawImage(doctor_signature_icon1, {
          x: 258, y: 160, width: 30, height: 30
        });
      }

      function drawDoctorFullName(pdf_page, doctor, y, size_text, font_color_r, font_color_g, font_color_b) {
        if (!doctor) return; 

        const d_full_name = 
          (this.textCapitalize(doctor.first_name) || '') + ' ' +
          (doctor.middle_name ? this.textCapitalize(doctor.middle_name) + ' ' : '') +
          (this.textCapitalize(doctor.last_name) || '') + ' ' +
          (doctor.suffix ? this.textCapitalize(doctor.suffix) : '');

        if (!d_full_name.trim()) return;

        pdf_page.drawText(d_full_name.trim(), {
          x: 258,
          y,
          size: size_text,
          color: rgb(font_color_r, font_color_g, font_color_b),
        });
      }

      drawDoctorFullName.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[0], 170, size_text, font_color_r, font_color_g, font_color_b);
      drawDoctorFullName.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[1], 147, size_text, font_color_r, font_color_g, font_color_b);
      drawDoctorFullName.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[2], 123, size_text, font_color_r, font_color_g, font_color_b);


      function drawDoctorSignedDate(pdf_page, date_signed, y, size_text, font_color_r, font_color_g, font_color_b) {
        const formatted_date = (this.formatDate(date_signed) || '').replace(/-/g, '');
        if (!formatted_date) return;

        const box_positions = [472, 484, 504, 516, 536, 548, 560, 572];

        for (let i = 0; i < formatted_date.length && i < box_positions.length; i++) {
          pdf_page.drawText(formatted_date.charAt(i), {
            x: box_positions[i],
            y,
            size: size_text,
            color: rgb(font_color_r, font_color_g, font_color_b),
          });
        }
      }

      drawDoctorSignedDate.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[0]?.date_signed, 169, size_text, font_color_r, font_color_g, font_color_b);
      drawDoctorSignedDate.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[1]?.date_signed, 145, size_text, font_color_r, font_color_g, font_color_b);
      drawDoctorSignedDate.call(this, pdf_page, this.csf_data_p2.PHIC_DOCTOR[2]?.date_signed, 121, size_text, font_color_r, font_color_g, font_color_b);

      //PART V - PROVIDER INFORMATION AND CERTIFICATION
      const first_case_rate = this.csf_data_p1.FIRST_CASE_RATES?.first_case_rate_code ?? 'NA'
      pdf_page.drawText(first_case_rate, {
        x: 324,
        y: 75,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      const second_case_rate = this.csf_data_p1.SECOND_CASE_RATES?.second_case_rate_code ?? 'NA'
      pdf_page.drawText(second_case_rate, {
        x: 516,
        y: 75,
        size: size_text,
        color: rgb(font_color_r, font_color_g, font_color_b)
      })

      // const attachment = this.csf_data_p2.ATTACHMENT?.find(item => {
      //   const name = item.file_name?.toLowerCase() || ''
      //   return name.includes('newborn') && (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png'))
      // })

      // if (this.csf_data_p1.ADMISSION_DIAGNOSIS?.find(item => item.ph_category === 'NSD') && attachment?.file_path) {
      //   const res = await fetch(attachment.file_path)
      //   const buf = await res.arrayBuffer()

      //   let sticker_img = null

      //   if (attachment.file_name.toLowerCase().endsWith('.png')) {
      //     sticker_img = await pdf_doc.embedPng(buf)
      //   } else {
      //     sticker_img = await pdf_doc.embedJpg(buf)
      //   }

      //   pdf_page.drawImage(sticker_img, {
      //     x: 392,
      //     y: 12,
      //     width: 200,
      //     height: 20
      //   })
      // }

      const modified_pdf = await pdf_doc.save()
      const blob = new Blob([modified_pdf], { type: "application/pdf" })
      this.pdf_url = URL.createObjectURL(blob)
    },

    downloadPDF(){
      const file_name_facility = this.$store.state.prv_data.provider_name
      const patient_name = `${this.csf_data_p1.PRINCIPAL_DATA.first_name} ${this.csf_data_p1.PRINCIPAL_DATA.last_name}`

      const link = document.createElement("a")
      link.href = this.pdf_url
      link.download =   `${patient_name}_${file_name_facility}_CSF.pdf`;

      link.click()
    },

    printPDF() {
      const print_iframe = this.$refs.pdf;
      if (print_iframe && print_iframe.contentWindow) {
        print_iframe.contentWindow.focus();
        print_iframe.contentWindow.print();
      }
    }

  }
};
</script>

<style scoped>
@media print{
  .cf2_test{
    padding:0.25em 0 0!important
  }
  .h1-header{font-size:16pt;line-height:0.8 !important;}
  .h3-header,.font-header{font-size:10pt !important}
  .h4-header, .font-label, .font-data{font-size:7pt !important}
  .h5-reminder{font-size:7.2pt !important}
  .line-height-sub{line-height: 0.4;}
  .m-b-2, .m-b-3, .m-b-4{margin-bottom:0}
  .p-b-1, .p-b-2, .p-b-3, .p-b-4{padding-bottom:0}

  .sub-header, .box_no_top{font-size:6pt}
  .sub-header-subtitle,.sub-header-diagnosis{font-size:5pt}
  .dis_check_lbl{font-size:4pt}
  .wrap {
    flex-wrap: wrap !important;
  }
}

.wrap {
    display: flex;
    flex-wrap: wrap !important;
}

.border-bottom{ border-bottom:1px solid black}
  .border-top{border-top:1px solid black}
  .box{
     align-items: center;
     border:1px solid black;
     display: flex;
     font-size:8px;
     height:2em;
     justify-content: center;
     text-align:center;
     width:2%;
  }
  .box_no_top_pan{
    border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10px;
    text-align: center;
    width:2%;
  }
  .box_no_top{
    /* border-left:1px solid black;
    border-right:1px solid black;
    border-bottom:1px solid black;
    font-size:10pt;
    text-align: center; */

    border: 1px solid #000;
    height: 1.5em;
    text-align: center;
    padding: 0;
    margin: 0;
    font-size:10pt;
  }
  .cf2_test{
    padding-top:3em ;
    padding-left:2.35em !important;
    padding-right:2.55em !important;
  }
 .dis_check_lbl, .font-label{font-size:10pt}
  .font-header{ font-size:13pt}
  .h1-header{ font-size:25pt;line-height:0.8;}
  .h3-header{font-size:14pt}
  .h4-header{font-size:11.5pt}
  .h4-header{font-size:11pt}
  .h5-reminder{font-size:7.3pt}
  .hide-content{display: none}
  .font-data{ font-size:9pt}
  .image_logo{
     width:200px;
     height:70px;
  }
  .line-height-sub{line-height: 0.1;}
  .p-b-1{padding-bottom:0.25em}
  .p-b-2{padding-bottom:0.5em}
  .p-b-3{padding-bottom:0.7em}
  .p-b-4{padding-bottom:1em}
  .m-b-2{margin-bottom:0.5em}
  .m-b-3{margin-bottom:0.75em}
  .m-b-4{margin-bottom:1em}
  .roman{ font-family:'Times New Roman', Times, serif}
  .sub-header,.sub-header-diagnosis{font-size:8px}
  .sub-header-subtitle{font-size:7px}
</style>
