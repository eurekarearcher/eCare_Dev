<template>
  <v-card class="mt-5"> 
    <v-card-title class="text-body-1 font-weight-medium"> RECORDED ENCOUNTERS </v-card-title>
    
    <!-- Loaders -->
    <v-row v-if="chart_loader || bar_loader || monthly_loader || summary_loader" no-gutters dense class="d-flex justify-center align-center" style="height: 300px;">
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </v-col>
    </v-row>
    
    <!-- Charts -->
    <template v-if="has_data">
      <div v-show="!chart_loader">
        <v-row v-show="!bar_loader" no-gutters dense>
          <v-col cols="12" sm="12" md="2" lg="2" class="d-flex justify-center align-center">
            <v-sheet class="text-center">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <div class="total-container" v-bind="attrs" v-on="on">
                    <h5 class="text-h5 font-weight-medium text-center"> {{ re_total }} <br />  </h5>
                  </div>
                </template>
                <span>Total: {{ re_total }}</span>
              </v-tooltip>
              <h5 class="mt-2 text-body-1 font-weight-normal"> TOTAL </h5>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="12" md="12" lg="10">
            <LegendsChart />
            <GChart type="BarChart" :data="bar_data" :options="bar_options" class="mt-2" />
          </v-col>
        </v-row>

        <div v-show="!summary_loader">
          <Summary :summary_title="summary_title" :summary_data="summary_data.total_kcs" :summary_actual="summary_data.total_ekm" :summary_target="summary_data.target"/> 
        </div>

        <div v-show="!monthly_loader">
          <v-card-title class="blue darken-3 white--text text-body-2 font-weight-medium justify-center mb-2 mt-6">MONTHLY ENCOUNTERS</v-card-title>
          <LegendsChart />
          <GChart type="ColumnChart" :data="item_monthly_encounters" :options="column_options" class="mt-2"/>
        </div>

        <v-card-title class="blue darken-3 white--text text-body-2 font-weight-medium justify-center mb-2 mt-6">TOTAL ENTRIES PER PRESENTER</v-card-title>
        <div id="monthly-container">
          <GChart type="BarChart" :data="total_entries_data" :options="total_entries_options" />
        </div>
      </div>
    </template>

    <template v-else> 
      <v-row v-show="!chart_loader" no-gutters dense> 
        <v-col cols="12" class="d-flex justify-center align-center py-6"> 
          <h4 class="text-center font-italic body-2"> {{ error_message ? error_message : 'No data to fetch' }}  </h4>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<script>
import { GChart } from 'vue-google-charts/legacy';
import LegendsChart from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/LegendsChart.vue'
import Summary from '@/components/admin/ekonsulta/ekonsulta-reports/ekonsulta-charts/Summary.vue'

export default {
  components: {
    GChart,
    LegendsChart,
    Summary
  },

  data() {
    return {
      bar_options: {
        height: 300,
        legend: { position: "none"},
        chartArea: {width: '76%', height: '65%', top: 0},
        bar: { groupWidth: "75%" },
        is3D: true,
        isStacked: true,
        colors: ['#1b9e77', '#d95f02', '#7570b3']
      },

      column_options: {
        height: 600,
        legend: { position: "none", maxLines: 3 },
        chartArea: { width: '76%', height: '65%', top: 10, bottom: 25},
        bar: { groupWidth: "75%" },
        is3D: true,
        isStacked: true,
        colors: ['#1b9e77', '#d95f02', '#7570b3'],
        vAxis: {
          format: '0',
          minValue: 1,
        },
        bars: 'vertical',
      },

      chart_loader: false,
      bar_loader: false,
      monthly_loader: false,
      summary_loader: false,
      error_message: '',
      report_data: [],
      bar_data: [],
      item_monthly_encounters: [],
      item_summary: [],
      total_entries_data: [],
      re_total: '',
      summary_data: '',
      summary_title: 'YAKAP CLAIMS SUBMISSIONS',
      has_data: false
    }
  },

  methods: {
    async getEkonsultaReportStatus(key, request_payload) {
      this.chart_loader = true;
      this.monthly_loader = true;
      this.summary_loader = true;
      this.bar_loader = true;

      const response = await this.$services.getStatusReport({
        request_key: key,
        ...request_payload
      });

      if (response.status === 200) {
        this.report_data = this.responseDataDecryption(response.data);
        this.monthly_loader = false;
        this.summary_loader = false;
        this.bar_loader = false;
        this.has_data = true;

        let highest_value = Math.max(
          this.report_data.registrations_and_encounters.total_npm,
          this.report_data.registrations_and_encounters.total_ekm,
          this.report_data.registrations_and_encounters.total_pm
        );

        this.bar_options = {
          ...this.bar_options,
          ...(highest_value <= 10 ? {
            hAxis: {
              minValue: 0,
              ticks: Array.from({ length: highest_value }, (_, index) => index + 1)
            }
          } : {
            hAxis: {
              minValue: 0,
            }
          })
        };

        this.bar_data = [
          ['MEMBERS', 'NON-PHILHEALTH MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }, 'YAKAP MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }, 'NON-YAKAP MEMBERS', { role: 'annotation' }, { role: 'style' }, { role: 'tooltip' }],
          ['NON-PHILHEALTH MEMBERS', parseInt(this.report_data.registrations_and_encounters.total_npm), this.report_data.registrations_and_encounters.total_npm.toString(), null, 'NON-PHILHEALTH MEMBERS', null, null, '#b87333', '', null, null, '', null], 
          ['PHILHEALTH MEMBERS', null, null, null, null, parseInt(this.report_data.registrations_and_encounters.total_ekm), parseInt(this.report_data.registrations_and_encounters.total_ekm) !== 0 ? `${this.report_data.registrations_and_encounters.total_ekm}` : '', '', 'YAKAP MEMBERS', parseInt(this.report_data.registrations_and_encounters.total_non_ekm),  parseInt(this.report_data.registrations_and_encounters.total_non_ekm) !== 0 ? `${this.report_data.registrations_and_encounters.total_non_ekm}` : '', '', 'NON-YAKAP MEMBERS'],  
        ];

        this.re_total = Number(this.report_data.registrations_and_encounters.total_npm) + Number(this.report_data.registrations_and_encounters.total_pm);

        this.summary_data = {
          total_ekm: this.report_data.registrations_and_encounters.total_ekm,
          target: this.report_data.registrations_and_encounters.target,
          total_kcs: this.report_data.registrations_and_encounters.kcs,
        };

        this.item_monthly_encounters = [
          ["Month", "NON PHILHEALTH MEMBER", { role: 'annotation' }, "KONSULTA MEMBER", { role: 'annotation' }, "NON KONSULTA MEMBER", { role: 'annotation' }]
        ];

        if (this.report_data.registrations_and_encounters.monthly_record.length > 0) {
          this.report_data.registrations_and_encounters.monthly_record.forEach(el => {
            let month_name = this.getMonthByNumber(el.mnth);
            let full_month_name = `${month_name} (${el.yr})`;

            if (this.item_monthly_encounters.length >= 10) {
              this.column_options = {
                ...this.column_options,
                hAxis: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                annotations: {
                  alwaysOutside: false,
                  textStyle: {
                    fontSize: 12
                  }
                },
              }
            } else {
              this.column_options = {
                ...this.column_options
              }
            }

            this.item_monthly_encounters.push(
              [full_month_name, parseInt(el.npm), parseInt(el.npm) !== 0 ? `${parseInt(el.npm)}` : '', parseInt(el.ekm), parseInt(el.ekm) !== 0 ? `${parseInt(el.ekm)}` : '', parseInt(el.non_ekm), parseInt(el.non_ekm) !== 0 ? `${parseInt(el.non_ekm)}` : '']
            );
          });
        } else {
          this.item_monthly_encounters.push(
            ['No Records found', 0, '', 0, '', 0, '']
          );
        }
      } else {
        this.chart_loader = false;
        this.has_data = false;
      }
    },

    async getTotalEntries(key, request_payload) {
      let response = await this.$services.getStatusReport({
        request_key: key,
        ...request_payload
      });

      this.total_entries_data = [];
      this.chart_data = [];
      let chart_data = [
        ['Category', 'REGISTRATION', { role: 'annotation' }, { role: 'style' }, 'PRE-CONSULTATION', { role: 'annotation' }, { role: 'style' }, 'CONSULTATION', { role: 'annotation' }, { role: 'style' }]
      ];

      if (response.data.success) {
        this.report_data = this.responseDataDecryption(response.data);
        this.chart_loader = false;
        this.has_data = true;
        let data_map = new Map();

        this.report_data.top_list.top_reg_mem.forEach((reg_mem_data) => {
          let name = reg_mem_data.full_name;
          let total_no = parseInt(reg_mem_data.total_no) || 0;
          if (data_map.has(name)) {
            let entry = data_map.get(name);
            entry[7] += total_no;
            entry[8] = entry[7].toString();
          } else {
            data_map.set(name, [name, 0, '', '#1b9e77', 0, '', '#d95f02', total_no, total_no || 0, '#7570b3']);
          }
        });

        this.report_data.top_list.top_doctor.forEach((doctor) => {
          let name = doctor.full_name;
          let total_doc_trans = parseInt(doctor.total_doc_trans) || 0;
          if (data_map.has(name)) {
            let entry = data_map.get(name);
            entry[1] += total_doc_trans;
            entry[2] = entry[1].toString();
          } else {
            data_map.set(name, [name, total_doc_trans, total_doc_trans || 0, '#1b9e77', 0, '', '#d95f02', 0, '', '#7570b3']);
          }
        });

        this.report_data.top_list.top_pre_cons.forEach((pre_cons_data) => {
          let name = pre_cons_data.full_name;
          let total_pre_cons = parseInt(pre_cons_data.total_pre_cons) || 0;
          if (data_map.has(name)) {
            let entry = data_map.get(name);
            entry[4] += total_pre_cons;
            entry[5] = entry[4].toString();
          } else {
            data_map.set(name, [name, 0, '', '#1b9e77', total_pre_cons, total_pre_cons || 0, '#d95f02', 0, '', '#7570b3']);
          }
        });

        this.total_entries_data = Array.from(data_map.values());
        chart_data.push(...this.total_entries_data);

        let dynamic_height = Math.min(data_map.size * 40 + 120, 2080);

        this.total_entries_options = {
          ...this.total_entries_options,
          legend: { position: "top" },
          chartArea: { width: '76%', top: '50', bottom: 0 },
          bar: { groupWidth: "75%" },
          is3D: true,
          height: dynamic_height,
          annotations: {
            alwaysOutside: true,
            textStyle: {
              fontSize: 12,
            }
          },
          colors: ['#1b9e77', '#d95f02', '#7570b3'],
          vAxis: {
            textStyle: {
              fontSize: 12,
              left: 5,
            },
          },
          hAxis: {
            minValue: 1
          },
          scrollY: dynamic_height,
        };

        this.total_entries_data = chart_data;

      } else {
        this.chart_loader = false;
        this.has_data = false;
        this.total_entries_options = {
          ...this.total_entries_options,
          legend: { position: "top" },
          chartArea: { width: '76%' },
          bar: { groupWidth: "75%" },
          is3D: true,
          annotations: {
            alwaysOutside: true,
            textStyle: {
              fontSize: 10,
            }
          },
          colors: ['#1b9e77', '#d95f02', '#7570b3'],
          vAxis: {
            textStyle: {
              fontSize: 12,
              left: 5,
            },
          },
          hAxis: {
            minValue: 0,
            ticks: [0]
          },
        };

        this.total_entries_data.push(
          ...chart_data,
          ['No Records Found', 0, '', '', 0, '', 0, 0, '', '']
        );
      }
    }
  }
}
</script>

<style scoped>
.total-container {
    width: 86px;
    height: 86px;
    background-color: #1565c0;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avg-container {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1565c0;
}

.avg-item {
    height: 70%;
    width: 70%;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
}

#monthly-container {
  left: 0;
  top: 0;
  min-height: 300px;
  max-height: 600px;
  overflow-y: scroll;
}
</style>
