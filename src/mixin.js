import * as CryptoJS from 'crypto-js'
import provider from '@/reference/provider.json'
import risk_list from "@/reference/risk-assessment-level.json";
import moment from 'moment'
import { services } from '@/services'
import store from '@/store'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

const mixin = {
    methods: {
      dateToday(format) {
        const today = new Date()
        const day = ('0' + today.getDate()).slice(-2)
        const month = ('0' + (today.getMonth() + 1)).slice(-2)
        const year = today.getFullYear()

        if (format) {
          return `${month}-${day}-${year}`
        } else {
          return `${year}-${month}-${day}`
        }
      },

      combineString(val) {
        return val.join(' ').replace(/\s{2,}/g, ' ')
      },

      displayNA(val) {
        if (val) return val
        return 'N/A'
      },
  
      formatDate(val) {
        if (!val) return ''

        const date = new Date(val)

        if (isNaN(date.getTime())) return ''

        let month = date.getMonth() + 1
        let day = date.getDate()
        const year = date.getFullYear()

        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day

        return `${month}-${day}-${year}`
      },

      newDateTimeFormat(val) {
          if (val) {
              val = new Date(val);
              
              const monthNames = ["January", "February", "March", "April", "May", "June", 
                                  "July", "August", "September", "October", "November", "December"];
              const month = monthNames[val.getMonth()];
              const day = val.getDate();
              const year = val.getFullYear();
              
              let hours = val.getHours();
              const minutes = val.getMinutes();
              const seconds = val.getSeconds();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              hours = hours % 12;
              hours = hours ? hours : 12;
              const minutes_str = minutes < 10 ? '0' + minutes : minutes;
              const seconds_str = seconds < 10 ? '0' + seconds : seconds;
              
              return `${month} ${day}, ${year} ${hours}:${minutes_str}:${seconds_str} ${ampm}`;
          } else {
              return null;
          }
      },

      formatDateMonth(val) {
        if (val) {
          val = new Date(val);
          
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          const month = months[val.getMonth()];
          const day = val.getDate();
          const year = val.getFullYear();
          
          return `${month} ${day}, ${year}`;
        } else {
          return null;
        }
      },

      newFormatDate(val) {
        if (val) {
          val = new Date(val)
          
          let month = val.getMonth() + 1;
          let day = val.getDate();
          const year = val.getFullYear();

          month = month < 10 ? '0' + month : month
          day = day < 10 ? '0' + day : day
          
          return `${year}-${month}-${day}`
        } else {
          return null
        }
      },
      
      formatDateAndTime(val) {
        if (val) {
          val = new Date(val.replace(/-/g, '/'))

          let hours = val.getHours();
          let minutes = val.getMinutes();
          let seconds = val.getSeconds();
          const period = hours >= 12 ? 'PM' : 'AM'

          hours = hours % 12
          hours = hours ? hours : 12
          hours = hours < 10 ? '0' + hours : hours
          minutes = minutes < 10 ? '0' + minutes : minutes
          seconds = seconds < 10 ? '0' + seconds : seconds

          return this.formatDate(val) + ' / ' + hours + ':' + minutes + ':' + seconds + ' ' + period
        }else{
          return null
        }
      },

      formatGender(val) {
        if (val) {
          return val.charAt(0) === 'M' ? 'MALE' : 'FEMALE'
        } else {
          return null
        }
      },

      calculateAge(val) {
        if(val) {
          const birthdate = new Date(val.replace(/-/g, '/'))
          const today = new Date()
          const month = today.getMonth() - birthdate.getMonth();
          let age = today.getFullYear() - birthdate.getFullYear();
          
          if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
            age--
          }
  
          return age
        }
      },

      calAge(val) {
          let get_current_year = new Date()
          let get_year = get_current_year.getFullYear()
          let year_age = val.slice(6, 10)
          let result = get_year - year_age
          
          return result
      },

      getDates(val) {
        if (window.navigator.userAgent.match(/Android/i)
          || window.navigator.userAgent.match(/webOS/i)
          || window.navigator.userAgent.match(/iPhone/i)
          || window.navigator.userAgent.match(/iPad/i)
          || window.navigator.userAgent.match(/iPod/i)
          || window.navigator.userAgent.match(/BlackBerry/i)
          || window.navigator.userAgent.match(/Windows Phone/i)) {
          let mobile_dates = val.split('-')
          //mobile_dates[2] = Year
          //mobile_dates[0] = Month
          //mobile_dates[1] = Day 
          let result = mobile_dates[2] + '-' + mobile_dates[0] + '-' + mobile_dates[1]

          return result
        } else {
          let web_dates = moment(val).format('YYYY-MM-DD')

          return web_dates
        }
      },

      getAge(val) {
        if(val !== undefined) {
          let birthdate = new Date(val)
          let today = new Date()
          let years = today.getFullYear() - birthdate.getFullYear();
          let months = today.getMonth() - birthdate.getMonth();
          let days = today.getDate() - birthdate.getDate();
  
          if (months < 0 || (months === 0 && today.getDate() < birthdate.getDate())) {
            years--
          }
  
          if (today.getDate() < birthdate.getDate()) {
            months--
          }
  
          if (days < 0) {
            let total_days = new Date(years, months, 0).getDate();
            days += total_days
          }
  
          months = months < 0 ? months + 12 : months
          days = days < 0 ? today.getDate() : days
          if (years > 0) return years + ' year' + (years === 1 ? '' : 's')
          else if (months > 0) return months + ' month' + (months === 1 ? '' : 's')
          else return days + ' day' + (days === 1 ? '' : 's')
        }
      },

      ageByYearsMonthsDays(val) {
        let birthdate = new Date(val)
        let today = new Date()
        let years = today.getFullYear() - birthdate.getFullYear();
        let months = today.getMonth() - birthdate.getMonth();
        let days = today.getDate() - birthdate.getDate();

        if (months < 0 || (months === 0 && today.getDate() < birthdate.getDate())) {
          years--
        }

        if (today.getDate() < birthdate.getDate()) {
          months--
        }

        if (days < 0) {
          let total_days = new Date(years, months, 0).getDate();
          days += total_days
        }

        months = months < 0 ? months + 12 : months
        days = days < 0 ? today.getDate() : days

        return years + ' years ' + months + ' months ' + days + ' days ' 
      },

      // DATA ENCRYPTION
      wsDataEncryption (data) {
        data = CryptoJS.enc.Utf8.parse(data);
        let word_array_iv =  CryptoJS.lib.WordArray.random(8);
        let iv = CryptoJS.enc.Utf8.parse(word_array_iv);
        let key = CryptoJS.enc.Utf8.parse('EUREKAREEUREKARE');
     
        let cipher_data = CryptoJS.AES.encrypt(data, key, {iv:iv});
        let hmac = CryptoJS.HmacSHA256(cipher_data.ciphertext, key);
        let encrypted_data = CryptoJS.enc.Base64.stringify(iv.concat(hmac).concat(cipher_data.ciphertext));
        return encrypted_data;
      },
      
      // DATA DECRYPTION
      wsDataDecryption  (data) {
        let ciphertext_WA = CryptoJS.enc.Base64.parse(data);
        let key_WA = CryptoJS.enc.Utf8.parse('EUREKAREEUREKARE');
        let iv_WA = CryptoJS.lib.WordArray.create(ciphertext_WA.words.slice(0, 4))
        let hmac_WA = CryptoJS.lib.WordArray.create(ciphertext_WA.words.slice(4, 4 + 8))
  
        let cipher_data_WA = CryptoJS.lib.WordArray.create(ciphertext_WA.words.slice(4 + 8))
        
        let hmac_calculated_WA = CryptoJS.HmacSHA256(cipher_data_WA, key_WA); 
  
        if (CryptoJS.enc.Base64.stringify(hmac_calculated_WA) === CryptoJS.enc.Base64.stringify(hmac_WA)) {
          let decryptedMessage_WA = CryptoJS.AES.decrypt({ciphertext: cipher_data_WA}, key_WA, {iv: iv_WA});
          let decryptedMessage = CryptoJS.enc.Utf8.stringify(decryptedMessage_WA);
          return decryptedMessage
        } else {
          return 'Decryption Failed'
        }
      },

      // DYNAMIC DECRYPTION
      responseDataDecryption (data) {
        if(typeof data === 'object') {
          Object.keys(data).forEach(key => {

            if(data[key]) {
              if(typeof data[key] === 'object') {
                this.responseDataDecryption(data[key])
              } else {
               if(typeof data[key] !== 'boolean' && !data[key].includes('data:image/') && data[key].replace(/\s+/g,' ').trim()) {
                 data[key]  = this.wsDataDecryption(data[key])
               }
              }
            }
          })
          return data
        } else {
          return data
        }
      },

      //Global Method for Cookies
      webCookies(type, key_name, val, expires) {
        if(type === 'set'){
          let date = new Date();
          date.setTime(date.getTime() + (expires? expires:1 * 24 * 60 * 60 * 1000))
          let cookie = document.cookie = key_name + "=" + val + "; expires=" + date.toUTCString() + " path=/"
          return cookie
        }
        if(type === 'get'){
          let cookie_name = key_name + "=";
          let cookie_decoded = decodeURIComponent(document.cookie)
          let cookie_array = cookie_decoded.split('; ')
          let result;
          cookie_array.forEach(value => {
              if (value.indexOf(cookie_name) === 0) {
                  result = value.substring(cookie_name.length)
              }
          })
          return result
        }
        if(type === 'delete'){
          document.cookie = key_name + '=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/'  
        }
      },

      getMonthByNumber(data) {
        let value = parseInt(data)
        if(value === 1) {
          return 'January'
        } else if(value === 2) {
          return 'February'
        } else if(value === 3) {
          return 'March'
        } else if(value === 4) {
          return 'April'
        } else if(value === 5) {
          return 'May'
        } else if(value === 6) {
          return 'June'
        } else if(value === 7) {
          return 'July'
        } else if(value === 8) {
          return 'August'
        } else if(value === 9) {
          return 'September'
        } else if(value === 10) {
          return 'October'
        } else if(value === 11) {
          return 'November'
        } else if(value === 12) {
          return 'December'
        } else {
          return ''
        }
      },

      getFilteredDays(day) {
        if(day === 'mon') {
          return 'Monday'
        } else if(day === 'tue') {
          return 'Tuesday'
        } else if(day === 'wed') {
          return 'Wednesday'
        } else if(day === 'thu') {
          return 'Thursday'
        } else if(day === 'fri') {
          return 'Friday'
        } else if(day === 'sat') {
          return 'Saturday'
        } else if(day === 'sun') {
          return 'Sunday'
        } else {
          return ''
        }
      },

      getDays(day) {
        if(day === 'Monday') {
          return 'mon'
        } else if(day === 'Tuesday') {
          return 'tue'
        } else if(day === 'Wednesday') {
          return 'wed'
        } else if(day === 'Thursday') {
          return 'thu'
        } else if(day === 'Friday') {
          return 'fri'
        } else if(day === 'Saturday') {
          return 'sat'
        } else if(day === 'Sunday') {
          return 'sun'
        } else {
          return ''
        }
      },

      provider_type(lgu_host_code) {
        return provider.provider_list.filter(data => {
          if(data.lgu_host_code === lgu_host_code) {
            return data
          }
        })
      },

      capitalizeString(value) {
        return value[0].toUpperCase() + value.substring(1).toLowerCase()
      },

      getStockColor(max_stock_quantity, quantity) {
        const replenish = 0.5 * max_stock_quantity
        const critical = 0.1 * max_stock_quantity

          if (quantity <= critical || quantity === 0) {
              return 'red  lighten-3'
          } else if (quantity <= replenish) {
            return 'yellow  lighten-3'
          } else {
              return'green  lighten-3'
          }
      },

      formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(value % 1000000 >= 100000 ? 2 : 0) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(value % 1000 >= 100 ? 1 : 0) + 'k';
        } else {
            return value.toString();
        }
      },

      textCapitalize(value){
        return value ? value.toUpperCase() : '';
      },

      riskAssessment(patient_info = {}, pex_data = {}, patient_social_history = []) {
        const waist = pex_data.waist_circumference ? `${pex_data.waist_circumference} cm` : 'N/A';
    
        const firstBP = () => {
            const { bp_systolic, bp_diastolic } = pex_data || {};
            return (bp_systolic && bp_diastolic) ? `${bp_systolic}/${bp_diastolic}` : 'N/A';
        };
    
        const secondBP = () => {
            const { bp_2nd_systolic, bp_2nd_diastolic } = pex_data || {};
            return (bp_2nd_systolic && bp_2nd_diastolic) ? `${bp_2nd_systolic}/${bp_2nd_diastolic}` : 'N/A';
        };
    
        const averageBP = () => {
            const { bp_systolic, bp_diastolic, bp_2nd_systolic, bp_2nd_diastolic } = pex_data || {};
            if (bp_systolic && bp_diastolic && bp_2nd_systolic && bp_2nd_diastolic) {
                const systolic_avg = (parseInt(bp_systolic) + parseInt(bp_2nd_systolic)) / 2;
                const diastolic_avg = (parseInt(bp_diastolic) + parseInt(bp_2nd_diastolic)) / 2;
                return `${systolic_avg}/${diastolic_avg}`;
            }
            return 'N/A';
        };
    
        // Determine smoking status dynamically
        const smoking_status = patient_social_history.some(item => item.social_history === 'SMOKER')
            ? 'SMOKER'
            : 'No';
    
        if (!pex_data.bmi_computation || averageBP() === 'N/A') {
            return { 
                risk: { value: 'N/A', mapped_risk: '' }, 
                waist, 
                first_bp: firstBP(), 
                second_bp: secondBP(), 
                average_bp: averageBP(),
                smoking: smoking_status,
            };
        }
    
        const gender = patient_info.mem_gender?.toUpperCase() || 'UNKNOWN';
        const risk_data = (smoking_status === 'SMOKER')
            ? (gender === 'MALE' ? risk_list.smoker_data_male : risk_list.smoker_data_female)
            : (gender === 'MALE' ? risk_list.non_smoker_data_male : risk_list.non_smoker_data_female);
    
        const systolic = Number(averageBP().split('/')[0]);
        const age = Number(patient_info.mem_age || 0);
        const bmi = Number(pex_data.bmi_computation?.bmi || 0);
    
        const filtered_data = risk_data
            .filter(item => age >= item.min_age && age <= item.max_age)
            .filter(item => (item.bmi_min ? bmi >= item.bmi_min && bmi <= item.bmi_max : bmi > item.bmi_max))
            .filter(item => (item.bp_min ? systolic >= item.bp_min && systolic <= item.bp_max : systolic > item.bp_max));
    
        let result = { value: 'N/A', mapped_risk: '' };
    
        if (filtered_data.length > 0) {
            const risk_value = filtered_data[0].risk;
            result = { 
                value: risk_value, 
                color: filtered_data[0].color, 
                mapped_risk: this.getMappedRisk(risk_value) 
            };
        }
    
        return { 
            risk: result, 
            waist, 
            first_bp: firstBP(), 
            second_bp: secondBP(), 
            average_bp: averageBP(),
            smoking: smoking_status,
        };
      },

      getMappedRisk(value) {
          if (value === 'N/A') return '';
          if (value < 10) return 'A';
          if (value >= 10 && value < 20) return 'B';
          if (value >= 20 && value < 30) return 'C';
          if (value >= 30 && value < 40) return 'D';
          if (value >= 40) return 'E';
      
          return '';
      },
      
      getToken(){
        let service_token = services.base_url.request_token
        let token = service_token + moment().format('Y-MM-DD HH:mm:ss')
        let encrypted_token = this.wsDataEncryption(token)
        let token_header = {
          "token" : encrypted_token
        }
        // let token_header = {
        //   "token" : "ek_authentication_test"
        // }

        return token_header
      },

      getQueryKey(){
        let get_date = moment().format('YYYYMMDD HH:mm:ss')
        let prv_date_key = Buffer.from(get_date, 'utf-8').toString('base64')
        let data_query = `key=${store.state.prv_key}&dt=${prv_date_key}`

        return data_query
      },

      getEncryptedDate(){
        let enc_date =  moment().utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT'
        enc_date = this.wsDataEncryption(enc_date)
        return enc_date
      },

      getDataInStorage(name, key) {
          const data = sessionStorage.getItem(name)

          if (data) {
              return JSON.parse(this.$crypto.AES.decrypt(data, key).toString(this.$crypto.enc.Utf8))
          } else {
              return null
          }
      },

      downloadFile(bytes, filename) {
        const blob = new Blob([bytes], { type: "application/pdf"})
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
      },

      invalidInput(value) {
        if (!value) return true;
        const normalized = value.trim().toLowerCase();
        const invalid = ["n/a", "none", "not applicable", "na"];
        return invalid.includes(normalized);
      },

      maskValue(value, is_password = false) {
        if (!value) return '';

        if (is_password) {
          return '*'.repeat(Math.min(8, value.length));
        }

        if (value.length <= 2) {
          return value[0] + '*';
        }

        const first_char = value[0];
        const last_char = value[value.length - 1];
        const middle_mask = '*'.repeat(value.length - 2);

        return `${first_char}${middle_mask}${last_char}`;
      },

      validateBirthDate(birthdate) {
        const today = new Date();
        const birthdate_new = new Date(birthdate);
        let format_res = false
        let err_msg = ""
        
        if (!birthdate) {
          err_msg = "Birthdate is required.";
        } else if(birthdate.length !== 10){
            err_msg = 'Invalid date format' //for incorrect MM-DD-YYYY format 
        } else if(birthdate_new.getFullYear()<1900){
            err_msg = 'Birthdate exceeds the maximum allowed age.'
        } else if(birthdate_new > today){
          err_msg = 'Birthdate must not be greater than the current date'
        } else if(!isNaN(Date.parse(birthdate)) === false){ //for incorrect month and day
          err_msg = 'Invalid date format for month or day.'
        } else{
          format_res = true
        }
        
        return { "format_result": format_res,"error_msg": err_msg}
      },

      dateTimeToday() {
        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit',
          minute: '2-digit', 
          hour12: true  
        };

        let date_formatted =  date.toLocaleString('en-US', options);
        date_formatted = date_formatted.replace(",", "");
        
        return date_formatted
      },

      async generatePDF(elementId, file_name) {
        const element = document.getElementById(elementId)

        if (!element) {
          console.error('Element not found:', elementId)
          return
        }

        const canvas = await html2canvas(element, { scale: 2, useCORS: true })
        const doc = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'letter'})
        const margin = 0.5
        const page_width = doc.internal.pageSize.getWidth()
        const page_height = doc.internal.pageSize.getHeight()
        const img_width = page_width - (margin * 2)
        const img_height = (canvas.height * img_width) / canvas.width
        const img_data = canvas.toDataURL('image/png')

        let height_left = img_height
        let position = margin

        doc.addImage(img_data, 'PNG', margin, position, img_width, img_height)
        height_left -= page_height

        while (height_left > 0) {
          position = height_left - img_height + margin
          doc.addPage()
          doc.addImage(img_data, 'PNG', margin, position, img_width, img_height)
          height_left -= page_height
        }

        doc.save(file_name + '.pdf')
      },

      formatTo12Hour(val) {
        if (!val) return ''

        const parts = val.split(':')
        let hour = parseInt(parts[0], 10)
        const minute = parts[1] || '00'
        const ampm = hour >= 12 ? 'PM' : 'AM'

        hour = hour % 12 || 12

        return `${hour}:${minute} ${ampm}`
      },

      getDeviceIPAdd() {
        return new Promise((resolve) => {

          let ip = [];

          const RTCPeerConnection =
            window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;

          if (!RTCPeerConnection) {
            resolve([]);
            return;
          }

          const pc = new RTCPeerConnection({
            iceServers: []
          });

          pc.createDataChannel("");

          pc.onicecandidate = (event) => {
            if (event && event.candidate && event.candidate.candidate) {

              const candidate = event.candidate.candidate;
              const address = candidate.split(" ")[4];

              if (!ip.includes(address)) {
                ip.push(address);
              }

            } else {
              // ICE gathering finished
              resolve(ip);
            }
          };

          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer));
        });
      }
    },
}

export default mixin