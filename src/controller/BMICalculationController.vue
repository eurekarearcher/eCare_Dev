<template>
  <div></div>
</template>

<script>
import * as bmi_list from '../reference/bmi-data.json'

export default {
  methods : {

     // GET BMI FOR KIDS (WEIGHT FOR AGE)
    getWeightForAge(patient_birthdate, weight, gender) {
      // CONVERT TO MONTHS
      const today = new Date();
      const birthdate = new Date(patient_birthdate);
      const timeDifference = today.getTime() - birthdate.getTime();
      const yearDifference = timeDifference / (24 * 60 * 60 * 1000) / 365.25;

      let age_in_months = parseInt(yearDifference * 12)
      let weight_for_age = ''
      
      const patient_weight = Number(weight)

      // ARRAY TO BE USED BASED ON GENDER
      const weight_for_age_array = gender === 'FEMALE' ? bmi_list.weight_for_age_girl : bmi_list.weight_for_age_boy 

      weight_for_age_array.filter(item => item.age === age_in_months).map(data => {
         if (patient_weight <= data.severely_underweight) {
            weight_for_age = 'SEVERELY UNDERWEIGHT'
         } else if (patient_weight > data.severely_underweight && patient_weight <= data.underweight) {
            weight_for_age = 'UNDERWEIGHT'
         } else if (patient_weight > data.underweight && patient_weight <= data.normal) {
            weight_for_age = 'NORMAL'
         } else {
            weight_for_age = 'OVERWEIGHT'
         }
      })

      return weight_for_age
    },

    // GET BMI FOR KIDS (HEIGHT FOR AGE)
    getHeightForAge(patient_birthdate, height, gender) {
      // CONVERT TO MONTHS
      const today = new Date();
      const birthdate = new Date(patient_birthdate);
      const timeDifference = today.getTime() - birthdate.getTime();
      const yearDifference = timeDifference / (24 * 60 * 60 * 1000) / 365.25;

      let age_in_months = parseInt(yearDifference * 12)
      let height_for_age = ''
      
      const patient_height = Number(height)

      // ARRAY TO BE USED BASED ON GENDER
      const height_for_age_array = gender === 'FEMALE' ? bmi_list.height_for_age_girl : bmi_list.height_for_age_boy 

      height_for_age_array.filter(item => item.age === age_in_months).map(data => {
         if (patient_height <= data.severely_stunted) {
            height_for_age = 'SEVERELY STUNTED'
         } else if (patient_height > data.severely_stunted && patient_height <= data.stunted) {
            height_for_age = 'STUNTED'
         } else if (patient_height > data.stunted && patient_height <= data.normal) {
            height_for_age = 'NORMAL'
         } else {
            height_for_age = 'TALL'
         }
      })
      
      return height_for_age
    },


    // GET BMI FOR KIDS (HEIGHT FOR AGE)
    getWeightForHeight(patient_birthdate, height, weight, gender) {
      // CONVERT TO MONTHS
      const today = new Date();
      const birthdate = new Date(patient_birthdate);
      const timeDifference = today.getTime() - birthdate.getTime();
      const yearDifference = timeDifference / (24 * 60 * 60 * 1000) / 365.25;

      let age_in_months = parseInt(yearDifference * 12)
      let weight_for_height = ''
      
      // ARRAY TO BE USED BASED ON AGE IN MONTHS and GENDER
      let weight_for_height_array = []
      if (gender === 'FEMALE') {
        weight_for_height_array =  age_in_months <= 23 ? bmi_list.weight_for_length_girl : bmi_list.weight_for_height_girl
      } else {
        weight_for_height_array =  age_in_months <= 23 ? bmi_list.weight_for_length_boy  : bmi_list.weight_for_height_boy
      }


      weight_for_height_array.filter(items => Math.round(items.length) == Math.round(height)).map(data => {
              if (weight <= data.severely_wasted) {
                  weight_for_height = 'SEVERELY WASTED'
              } else if (weight > data.severely_wasted && weight <= data.wasted) {
                  weight_for_height = 'WASTED'
              } else if (weight > data.wasted && weight <= data.normal) {
                  weight_for_height = 'NORMAL'
              } else if (weight > data.normal && weight <= data.overweight) {
                  weight_for_height = 'OVERWEIGHT'
              }else {
                  weight_for_height = 'OBESE'
              }
          })
      return weight_for_height
    },
  }
}
</script>