<template>
    <v-data-table  :headers="cost_of_procedure" :loading="loading_data" :items="procedure_list" :footer-props="{ 'items-per-page-options': [5, 12]}" :items-per-page="12" :mobile-breakpoint="0" item-key="cpt_code" class="text-uppercase elevation-1 mt-10">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{item.cpt_code}}</td>
                    <td>{{item.cpt_description}}</td>
                    <td>{{item.total_transaction}}</td>
                    <td>{{item.min_costs}}</td>
                    <td>{{item.max_costs}}</td>
                    <td>{{item.average_costs !== 0? item.average_costs : ''}}</td>
                    <td>{{item.total_costs}}</td>
                </tr>
            </template>
    </v-data-table>
</template>

<script>
export default {
  props: ['procedure_list', 'loading_data'],

  data() {
    return { 
     cost_of_procedure: [
        { text: 'CPT Code', value: 'cpt_code', width: 150},
        { text: 'THERAPEUTIC AND DIAGNOSTIC PROCEDURES(CPT Description)', value: 'cpt_description', width: 300},
        { text: 'Number of Transactions', value: 'total_transaction',  width: 150},
        { text: 'Min Costs', value: 'min_costs', width: 150},
        { text: 'Max Costs', value: 'max_costs',  width: 150},
        { text: 'Average Costs', value: 'average_costs',  width: 150},
        { text: 'Total Costs', value: 'total_costs',  width: 150}
     ],

     report_per_year_result: [],
    }
  }
}
</script>