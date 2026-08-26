<template>
  <div>
    <v-row justify="space-between" align="center" dense>
        <v-col cols="12" md="5" lg="4">
            <v-row dense>
                <v-col cols="10" md="8" class="d-flex align-end">
                    <label>Filter By: </label>
                    <v-col cols="12" sm="6">
                        <v-select v-model="year" @change="generateReportByYear(year)" :items="year_list" class="ml-2" hide-details></v-select>
                    </v-col>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-right" cols="12" md="6">
            <label>EXPORT:</label>
            <v-btn  @click="exportToExcel" class="ml-3" color="success"><v-icon left>mdi-microsoft-excel</v-icon> Excel</v-btn>
        </v-col>
    </v-row>

     <v-data-table  :headers="reports_per_year_header" :items="report_per_year_result" :footer-props="{ 'items-per-page-options': [5, 12]}" :items-per-page="12" :mobile-breakpoint="0" item-key="month" class="text-uppercase elevation-1 mt-10"></v-data-table>
  </div>
</template>


<script>
export default {
  props: ["transaction_data"],

  data() {
    return {
     year: new Date().getFullYear(),
     year_list:  [...Array(5)].map((a,b)=> new Date().getFullYear() - b),
    
     reports_per_year_header: [
        { text: 'MONTH', value: 'months', width: 150},
        { text: 'NO. OF PATIENTS WITH COMPLETELY FILLED PRESCRIPTION', value: 'no_of_complete_prescription', width: 300},
        { text: 'PERCENTAGE', value: 'percentage_complete_prescription',  width: 150},
        { text: 'NO. OF PATIENTS WITH PARTIALLY FILLED PRESCRIPTION', value: 'no_of_partial_prescription', width: 300},
        { text: 'PERCENTAGE', value: 'percentage_partial_prescription',  width: 150},
     ],

     report_per_year_result: [],
    }
  },



  methods: {
    generateReportByYear(year = this.year) {
      const filtered_report_data = this.computePrescriptionData(year)

      if (filtered_report_data.length > 0) {
          const reports_per_year = [...Array(12)].map((item, i) => {
              return {
                  months: new Date(0, i).toLocaleString('en-US', {month: 'long'}),
                  no_of_complete_prescription: '-',
                  percentage_complete_prescription: null,
                  no_of_partial_prescription: '-',
                  percentage_partial_prescription: null
              }
          })
      
          const get_months = filtered_report_data.map(items => items.date)

          reports_per_year.filter(items => get_months.includes(items.months)).map((data,index) => {
              data.no_of_partial_prescription = filtered_report_data[index].no_of_partial_prescription
              data.no_of_complete_prescription = filtered_report_data[index].no_of_complete_prescription
              return data
          })
          
          return this.report_per_year_result =  reports_per_year
      }

      return this.report_per_year_result = []
    },

    computePrescriptionData(year) {
        return this.transaction_data
        .filter(data => data.date.includes(year))
        .map(items => {
            let no_of_complete_prescription = 0
            let no_of_partial_prescription = 0
            
            if (items.transaction_medicine.some(med => Number(med.total_dispensed_medicine) < Number(med.total_prescribed_medicine))) {
                no_of_partial_prescription = no_of_partial_prescription + 1
            } else {
                no_of_complete_prescription = no_of_complete_prescription + 1
            }
                            
            return { 
                date: this.$moment(items.date).format('MMMM'), 
                no_of_partial_prescription,  
                no_of_complete_prescription 
            }
        })
        .reduce((acc, data) => {
            const duplicate = acc.find(item => item.date === data.date)
            if(duplicate) {
                duplicate.no_of_partial_prescription = duplicate.no_of_partial_prescription + data.no_of_partial_prescription
                duplicate.no_of_complete_prescription = duplicate.no_of_complete_prescription + data.no_of_complete_prescription
            } else {
                acc.push(data);
            }
            return acc;
        }, []);
    },

    exportToExcel() { 
        const data_style = {
            align: 'center',
            alignVertical: 'center',
            borderColor: '#000000',
            wrap: true
        }

        let schema = [
            {...data_style, column: 'Month', value: value => value.months, width: 20 },
            {...data_style, column: 'No. of Patients with Completely Fielled Prescription', value: value => value.no_of_complete_prescription, width: 40},
            {...data_style, column: 'Percentage', value: value => value.percentage_complete_prescription, width: 20 },
            {...data_style, column: 'No. of Patients with Partially Fielled Prescription', value: value => value.no_of_partial_prescription, width: 40 },
            {...data_style, column: 'Percentage', value: value => value.percentage_partial_prescription, width: 20 },
        ]

        const file_name_date = this.$moment().format('MM-DD-YYYY');
        const file_name_facility = this.$store.state.prv_data.provider_name;

        this.$excel_file(this.report_per_year_result, {
            schema,
            headerStyle: {
                alignVertical: 'center',
                align: 'center',
                borderColor: '#FFFFFF',
                fontWeight: 'bold',
                backgroundColor: '#1565C0',
                color:'#FFFFFF',
                wrap: true

            },
            
            fileName: `${file_name_facility} - Medicine Consumption Report Per Year - ${file_name_date}.xlsx`
        })
    },

    clearReports() {
      this.year = new Date().getFullYear()
      this.report_per_year_result = []
    }
  }

  
}
</script>