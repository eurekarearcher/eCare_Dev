import jsPDF from 'jspdf'
import 'jspdf-autotable'


const pdf = {
  generalPDF(member,utility_data, session_data ,provider_name, bday, type, filename,eligibility_status) {
    var doc = new jsPDF('p', 'mm','a4');
    var lgu_logo = document.getElementById('lgu_logo')
    var hmo_logo = document.getElementById('hmo_logo')
    /* for image logo with different width size*/
    if(type === 'OUTPATIENT') {

      if(lgu_logo) {
        doc.addImage(utility_data.logo, "JPEG", 13.5 , 8, 0, 16);
      }

      if(hmo_logo) {
        if (hmo_logo.naturalWidth > 1000) { 
          doc.addImage(utility_data.logo, "JPEG", 33.5 , 8, 0, 12);
        } else{
          doc.addImage(utility_data.logo, "JPEG", 33.5 , 8, 0, 10);
        }
      }

      if(session_data.process_type === 'PHIC') {
        doc.addImage(require('../../assets/PHIC_logo.png'), "PNG", 13.5 , 8, 0, 12);
      } else {
        doc.addImage(require('../../assets/PHIC_logo.png'), "PNG", 160 , 8, 0, 12);
      }
      
  
    } else {
      if (hmo_logo.naturalWidth > 1000) { 
        doc.addImage(utility_data.logo, "JPEG", 80 , 8, 0, 20);
      } else{
        doc.addImage(utility_data.logo, "JPEG", 79 , 12, 0, 10);
      }
    }
  

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    
    if (type === 'CONSULTATION') {
      doc.text('Letter of Authorization (Consultation)', 72, 31);
    } else if (type === 'e-CONSULTATION') {
      doc.text('e-CONSULTATION FORM', 84, 31);
    } else {
      if(session_data.process_type !== 'HMO_PHIC' && session_data.process_type !== 'PHIC') {
        doc.text('LETTER OF GUARANTEE', 83, 31);
      } else {
        doc.text('BENEFIT ELIGIBILITY FORM', 80, 31);
      }
    }

    doc.setFontSize(8.65);
    doc.text('Healthcare Facility:', 13.5, 38);
    doc.text('Date:', 13.5, 43);
    doc.text('Transaction:', 13.5, 48);
    doc.text('Valid Until:', 13.5, 53);

    doc.setFont('helvetica', 'normal');
    doc.text(provider_name, 43, 38);
    doc.text(utility_data.date, 22, 43);
    doc.text(type, 33, 48);
    doc.text(utility_data.validTil, 31 , 53);

    if (member.mem_photo) {
      doc.addImage(member.mem_photo, "png", 175, 35, 0, 21.4);
    } else {
      doc.addImage(require('../../assets/no-image.jpg'), "JPEG", 175, 35, 0, 21.4);
    }
    
    /* LABEL */
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PERSONAL INFORMATION', 13.5, 63);
    doc.setFontSize(8.65);
    doc.text('Membership Type:',13.5, 68);
    doc.text('Gender:', 121, 68);
    doc.text('Card Number:', 13.5, 73);
    doc.text('Member Status:', 121, 73);
    doc.text('Patient Name:', 13.5, 78);
    doc.text('Date of Birth:', 121, 78);

    /* DATA */
    doc.setFont('helvetica', 'normal');
    doc.text(member.mem_hmo_type,42, 68);
    doc.text(member.mem_gender ? member.mem_gender.toLowerCase().charAt(0) === 'm' ? 'MALE' : 'FEMALE'  : 'N/A' ,135, 68);
    doc.text(member.mem_hmo_policy_number ? member.mem_hmo_policy_number :  member.mem_phic_pin,35, 73);
    doc.text(member.mem_hmo_status ? member.mem_hmo_status : eligibility_status ,145, 73);
    doc.text(member.p_name,35, 78);
    doc.text(bday,143, 78);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#01579b');
    if (type === 'OUTPATIENT' && (session_data.process_type === 'PHIC' || session_data.process_type === 'LGU' || session_data.process_type === 'PHIC_LGU')) {
      doc.text('TRACKING NUMBER : ' + (member.phic_tracking_num ? member.phic_tracking_num.toUpperCase()  : 'N/A') ,134, 88);
    } else {
      doc.text('APPROVAL CODE: ' + session_data.approval_code.toUpperCase(),134, 88);
    }
    
    doc.autoTable({
      margin:{left:13.3},
      startY:90,
      theme:'grid',
      html: '#doctor',
      didParseCell(cell) {
        if (cell.cell.text.includes('DOCTORS') || cell.cell.text.includes('CHIEF COMPLAINT')) {
          cell.cell.styles.textColor = "white";
          cell.cell.styles.fillColor = "#01579b";
          cell.cell.styles.fontStyle = "bold";
        }
      },
      styles: {
        halign:'center',
        fontSize: 8,
        textColor: 'black'
      },
    })

    let heightY = type === 'OUTPATIENT' ? 110 : 124
    let table_data = null

    for(let counter = 0; counter < session_data.icd_cpt_data.length; counter++) {

      doc.autoTable({
        margin:{left:13.3},
        startY:heightY,
        theme:'grid',
        html: '#diagnosis_procedure'+counter,
        didParseCell(cell) {
          table_data = cell.table 
          if (cell.cell.text.includes('PRIMARY DIAGNOSIS') || cell.cell.text.includes('SECONDARY DIAGNOSIS') || cell.cell.text.includes('OTHER DIAGNOSIS')) {
              cell.cell.styles.textColor = "white";
              cell.cell.styles.fillColor = "#01579b";
              cell.cell.styles.fontStyle = "bold";
            }
        },
        styles: {
          valign: 'middle',
          halign:'center',
          fontSize: 7.5,
          textColor: 'black'
        },
        columnStyles: {
          ...(session_data.process_type === 'HMO_PHIC' || session_data.process_type === 'HMO_PHIC_LGU' || session_data.process_type === 'HMO_LGU' ? {
            0: {cellWidth: 20},                         
            1: {cellWidth: 90},
          } : {
            0: {cellWidth: 20},                         
            1: {cellWidth: 115},  
            3: {cellWidth: 25}   
          })                    
        }
      })
      
      heightY = table_data.finalY
    }

    if(session_data.doctor_notes) {
      doc.autoTable({
        margin:{left:13.3},
        startY: heightY,
        theme:'grid',
        html: '#doctor_notes',
        didParseCell(cell) {
          table_data = cell.table 
          if (cell.cell.text.includes('DOCTOR NOTES')) {
            cell.cell.styles.textColor = "white";
            cell.cell.styles.fillColor = "#01579b";
            cell.cell.styles.fontStyle = "bold";
          }
        },
        styles: {
          halign:'center',
          fontSize: 8,
          textColor: 'black'
        },
      })
      heightY = table_data.finalY
    }

    if(session_data.hmo_cc_notes) {
      doc.autoTable({
        margin:{left:13.3},
        startY: heightY,
        theme:'grid',
        html: '#cc_notes',
        didParseCell(cell) {
          table_data = cell.table 
          if (cell.cell.text.includes('HEALTH CARE INSURANCE NOTES')) {
            cell.cell.styles.textColor = "white";
            cell.cell.styles.fillColor = "#01579b";
            cell.cell.styles.fontStyle = "bold";
          }
        },
        styles: {
          halign:'center',
          fontSize: 8,
          textColor: 'black'
        },
      })
      heightY = table_data.finalY
    }

    doc.setFontSize(7.5);
    doc.setTextColor('black');
    doc.setFont('helvetica','normal')
    var disclaimer = doc.splitTextToSize(utility_data.disclaimer, 180);
    doc.text(disclaimer, 13.5, heightY + 5);
    doc.setTextColor(0)
    doc.setFontSize(9);
    var disclaimer_height = doc.getTextDimensions(disclaimer)
    doc.setFont('helvetica','bold')
    doc.line(13.5, heightY + disclaimer_height.h + 15, 75, heightY + disclaimer_height.h + 15, 'F');
    doc.text('CARD MEMBER SIGNATURE', 20, heightY +  disclaimer_height.h + 19);
    doc.line(130, heightY + disclaimer_height.h + 15, 195, heightY + disclaimer_height.h + 15, 'F');
    doc.text('PROVIDER REPRESENTATIVE SIGNATURE', 130, heightY + disclaimer_height.h + 19);

    return doc.save(filename + '.pdf')
  },


  vcPDF(member,utility_data, session_data ,provider_name, bday, type, filename, diagnosis, procedure) {
    var doc = new jsPDF('p', 'mm','a4');
    var logo = document.getElementById('logo')
      if (logo.naturalWidth > 1000) { 
        doc.addImage(utility_data.logo, "JPEG", 10 , 6, 0, 20);
      } else{
        doc.addImage(utility_data.logo, "JPEG", 10 , 12, 0, 10);
      }
      doc.setFontSize(7);
      doc.text('33 Meralco Ave., Brgy. San Antonio, Pasig City', 10, 25);
      doc.text('Trunk lines: (02) 7023310 (Medical Services): (02) 702-3388 (Other Departments)', 10, 28); 
      doc.text('24 Hour Hotlines: 0917-7-WE CARE; (02) 687-3219; 0917-8862892', 10, 31); 
      doc.text('Fax Nos.: (02) 637-9456 E-mail: wecare@valuecarehealth.com', 10, 34); 
      doc.text('Medical Fax No.: (02) 637-9453', 10, 37); 

      doc.setFontSize(6);
      doc.rect(143, 10, 60, 18, "S")
      doc.text('This form must be legibly and completely filled out,', 145, 14);
      doc.text('signed by applicable parties, and returned to ValuCare', 145, 17); 
      doc.text('within 30 days.Use generally accepted abbreviations only.', 145, 20); 
      doc.setFont('helvetica', 'bold');
      doc.text('Valid for 7 days only or until membership expiry,', 145, 23); 
      doc.text('whichever comes first.', 145, 26); 
      
      if(type === 'OUTPATIENT') {
        doc.setFontSize(13);
        doc.setFont('Times', 'bold');
        doc.text('LETTER OF AUTHORIZATION', 75, 42); 
        doc.text('Out Patient - PROCEDURE', 80, 47); 
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.rect(174, 37, 28, 9, "S")
        doc.text('HMO', 180, 44); 
      } else {
        doc.setFontSize(18);
        doc.text('HMO', 188, 35); 
        doc.setFontSize(13);
        doc.text('CONSULTATION FORM/DOCTORS COPY', 65, 45); 
        doc.line(65, 45, 154.655, 45)
      }

      /*LABEL*/
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Hospital:', 10, 56); 
      doc.text('Date:', 160, 56); 

      doc.text('Name:', 10, 63);
      doc.text('Birthday:', 135, 63); 
      doc.text('Gender:', 170, 63); 

      doc.text(type === 'OUTPATIENT' ? 'VALUCARD ID NO.:' :'ID No.:', 10, 71);
      doc.text('Company Name:', 76, 71);
      doc.text(type === 'OUTPATIENT' ? 'Expiry Date:' : 'Card Expiry:', 165, 71);
      
      if(type === 'CONSULTATION' || type === 'e-CONSULTATION') { 
        doc.text('Reason for Consultation:', 10, 78);
        doc.text('Test/Treatment/Operation Performed in the clinic:', 10, 91);
        doc.text('Recommended Diagnostics Test(s)/Procedure', 10, 105);
      } else {
        doc.text('Approval No.:', 10, 78);
        doc.text('Maximum Coverage Benefit:', 120, 78);
        doc.text('Diagnosis:', 10, 86);
   
      }

      /*VALUES*/
      doc.setFont('helvetica', 'bold');
      doc.text(provider_name, 40, 55);
      doc.line(40, 56, 150, 56)
      doc.text(utility_data.date, 170, 55);
      doc.line(170, 56, 200, 56)

      doc.text(member.p_name, 40, 62);
      doc.line(40, 63, 130, 63)
      doc.text(bday, 147, 62);
      doc.line(147, 63, 165, 63)
      doc.text(member.mem_gender, 185, 62);
      doc.line(180, 63, 200, 63)

      doc.text(member.mem_hmo_policy_number, 40, 70);
      doc.line(40, 71, 70, 71)
      doc.text(member.mem_company_name ? member.mem_company_name : 'N/A', 98, 70);
      doc.line(98, 71, 160, 71)
      doc.text(member.mem_hmo_expiry_date ? member.mem_hmo_expiry_date : 'N/A', 180, 70);
      doc.line(180, 71, 200, 71)
      
      if(type === 'CONSULTATION' || type === 'e-CONSULTATION') {
        doc.text(session_data.chief_complaint, 10, 83);
        doc.line(10, 84, 200, 84)
  
        doc.line(10, 92, 200, 92)
        doc.text(session_data.icd_cpt_data[0].procedure_list[0].cpt_code+' '+ session_data.icd_cpt_data[0].procedure_list[0].cpt_description, 10, 95);
        doc.line(10, 96, 200, 96)
        doc.line(10, 100, 200, 100)
  
        doc.line(10, 106, 200, 106)
        doc.line(10, 110, 200, 110)
        doc.line(10, 115, 200, 115)

        /*SIGNATURE*/
        doc.setTextColor(0)
        doc.setFont('helvetica', 'normal');
        doc.line(25, 130, 80, 130);
        doc.text('VALUCARE PLAN COORDINATOR.', 33, 133);
        doc.setFont('helvetica', 'bold');
        doc.text('Signature over printed name', 37, 136);
  
        doc.setFont('helvetica', 'normal');
        doc.line(120, 130, 180, 130);
        doc.text('Referred to VALUCARE Specialist-Consultant.', 125, 133);
        doc.setFont('helvetica', 'bold');
        doc.text('Signature over printed name', 133, 136);
  
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('Important Reminders:', 10, 145);
        doc.text('Members Statement:', 10, 148);
        doc.text('Provider access:', 10, 160);
        doc.text('Clinic access:', 10, 163);
        doc.text('Dental access:', 10, 166);
        doc.text('Dentist access:', 10, 169);
        doc.text('Dental Benefit:', 10, 172);
        doc.text('Waiver:', 10, 175);
  
        doc.setFont('helvetica', 'normal');
        doc.text('Approval code is no longer needed for sum of procedures P1,000 and Below, but exclusions and limitations will apply.', 33, 145);
        doc.text(' I hereby authorize ValuCare and its representative to have access on all my Medical / Hospital records. I promise to pay for medical, surgical, hospital and', 33, 148);
        doc.text('preofessional services expenses not explicitly covered by the provisions of Health Care Service Agreement. I fully understand that in instances wherein these non-coverable charge/s', 10, 151);
        doc.text('(i.e. excess in limits, exclusions, Philhealth etc.) were not settled upon availment/discharge, it will be billed to me as collectible and will be charged administrative fees as applicable. I', 10, 154);
        doc.text('hereby attest that i have fully understood all that is written in this form', 10, 157);
        doc.text('VC ACCREDITED HOSPITAL W/ ACCESS TO ASIAN HOSPITAL', 28, 160);
        doc.text('EXCEPT FORTMED CLINICS & HEALTHWAY CLINICS', 25, 163);
        doc.text('VC ACCREDITED HOSPITAL W/ ACCESS TO ASIAN HOSPITAL', 25, 166);
        doc.text('VALUCARE DENTAL PROVIDER', 25, 169);
  
        doc.setFont('helvetica', 'bold');
        doc.text('Conforme:', 110, 185);
        doc.text(member.p_name+' / '+ (member.mem_mobile_number ? member.mem_mobile_number : 'N/A'), 125, 184);
        doc.line(125, 185, 195, 185)
        doc.text('Signature over printed name / Mobile number', 135, 188);

      } else {
        doc.text(session_data.approval_code ? session_data.approval_code : 'N/A', 40,78);
        doc.line(40, 79, 100, 79)
        doc.text('', 155 ,78);
        doc.line(155, 79, 200, 79)

  
        // DISPLAY DIAGNOSIS DATA
        let height = 86
        let icd_desc_height = 86
        doc.setFontSize(6.5);

        for(let icd_ctr = 0; icd_ctr < diagnosis.length; icd_ctr++) {
          var icd_description = doc.splitTextToSize(diagnosis[icd_ctr].icd_description, 118);
          if (doc.getTextDimensions(icd_description).h  <= 2.469444444444444 ) {
            height
            icd_desc_height
          } else if (doc.getTextDimensions(icd_description).h > 2.469444444444444 && doc.getTextDimensions(icd_description).h  <= 7) {
            height = height + 4
            icd_desc_height = height - 3
          }  else {
            height = height + 8
            icd_desc_height = height - 8
          }
         
          doc.text(icd_description, 40, icd_desc_height);
          doc.line(40, height+1, 155, height+1)
          doc.setFont('helvetica', 'normal');
          doc.text('ICD CODE', 160 ,height);
          doc.setFont('helvetica', 'bold');
          doc.text(diagnosis[icd_ctr].icd_code, 175 ,height);
          doc.line(175, height+1, 200, height+1)

          height = height + 5
          icd_desc_height = height
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.text('Complete Surgical Procedure to be done as stated', 10, height + 3);
        doc.text('in the Operative Record:', 10, height + 8);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        height = height + 3
        let cpt_desc_height = height 
        for (let cpt_ctr = 0; cpt_ctr < procedure.length; cpt_ctr++){
          var cpt_description = doc.splitTextToSize(procedure[cpt_ctr].cpt_description, 90);
          if (doc.getTextDimensions(cpt_description).h  <= 2.469444444444444 ) {
            height
            cpt_desc_height
          } else if (doc.getTextDimensions(cpt_description).h > 2.469444444444444 && doc.getTextDimensions(cpt_description).h  <= 7) {
            height = height + 3
            cpt_desc_height = height - 3
          }  else {
            height = height + 7
            cpt_desc_height = height - 7
          }
          doc.text(cpt_description, 55, cpt_desc_height);
          doc.line(55, height+1, 145, height+1)
          doc.setFont('helvetica', 'normal');
          doc.text('CPT CODE', 147, height);
          doc.text('RUV', 174, height);
          doc.setFont('helvetica', 'bold');
          doc.text(procedure[cpt_ctr].cpt_code, 160, height);
          doc.line(160, height+1, 173, height+1)
          doc.text(Number(procedure[cpt_ctr].cpt_approved_amount).toLocaleString(), 180, height);
          doc.line(180, height+1, 200, height+1)
          
          height = height + 5
          cpt_desc_height = height
      }
      
      height = height + 3
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Specialist\'s Full Name / Specialization:', 10, height+1); 
      doc.setFont('helvetica', 'bold');
      doc.text(session_data.doctor_data.doctor_name+' / '+session_data.doctor_data.specialization, 55, height); 
      doc.line(55, height+1, 200, height+1)

      height = height + 8
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Anesthesiologist:', 10, height+1); 
      doc.text('', 35, height); 
      doc.line(35, height+1, 200, height+1)
      doc.setFontSize(6.5);
      doc.text('Note: Please do not forget to file your PHILHEALTH. Failure to do so will authorize the Hospital and ValuCare to collect equivalent amount of Philhealth', 10, height+4); 

      height = height + 10
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('Member Statement:', 10, height); 
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text('I hereby authorize ValuCare and its representative to have access on all my Medical / Hospital records. I promise to pay for medical, surgical, hospital and preofessional services',10, height + 4)
      doc.text('expenses not explicitly covered by the provisions of Health Care Service Agreement. I fully understand that in instances wherein these non-coverable charge/s (i.e. excess in limits,',10, height + 6)
      doc.text('exclusions, Philhealth etc.) were not settled upon availment/discharge, it will be billed to me as collectible and will be charged administrative fees as applicable. I hereby attest that i',10, height + 8)
      doc.text('have fully understood all that is written in this LOA.',10, height + 10)



       /*SIGNATURE*/
       doc.setFont('helvetica', 'bold');
       doc.setTextColor(0)
      doc.setFontSize(7);

       doc.line(25, height + 25, 80, height + 25);
       doc.text('Signature of Member / Relative / Mobile No.', 28, height + 27);
       doc.line(120, height + 25, 180, height + 25);
       doc.text('ValuCare Authorized Representative', 130, height + 27);
  



        

      }


      return doc.save(filename + '.pdf')
  }
}

export default pdf