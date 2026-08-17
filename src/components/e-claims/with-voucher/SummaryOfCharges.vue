<template>
    <div class="summary-charges">
        <h4 class="pb-3">SUMMARY OF CHARGES</h4>

        <table class="summary-table">
            <thead>
                <tr>
                    <th>Particulars</th>
                    <th>Gross</th>
                    <th>WTax</th>
                    <th>Net of Tax</th>
                    <th>IRM/IFM</th>
                    <th>AC</th>
                    <th>CHECK NO.</th>
                    <th>CHECK</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in rows" :key="index">
                    <td>{{ row.particular }}</td>
                    <td class="text-right">{{ formatMoney(row.gross) }}</td>
                    <td class="text-right">{{ formatMoney(row.wtax) }}</td>
                    <td class="text-right">{{ formatMoney(row.net) }}</td>
                    <td class="text-right">{{ formatMoney(row.irm) }}</td>
                    <td class="text-right">{{ formatMoney(row.ac) }}</td>
                    <td class="text-right">{{ row.check_no }}</td>
                    <td class="text-right">{{ formatMoney(row.check) }}</td>
                </tr>

                <tr class="total-row">
                    <td><strong>Total Charges</strong></td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalGross) }}</strong>
                    </td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalWTax) }}</strong>
                    </td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalNet) }}</strong>
                    </td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalIRM) }}</strong>
                    </td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalAC) }}</strong>
                    </td>
                    <td></td>
                    <td class="text-right">
                        <strong>{{ formatMoney(totalCheck) }}</strong>
                    </td>
                </tr>

                <tr>
                    <td colspan="8">
                        Total No. of Claims :
                        <strong>{{ voucher_details.summary.pNumberOfClaims }}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: ['voucher_details'],

    computed: {
        rows() {
            const payees = this.voucher_details.summary.payee || [];

            const rows = [];

            payees.forEach(payee => {
                // Hospital
                if (payee.pPayeeType === "H") {
                    rows.push({
                        particular: "HCI Account - HCI Fee",
                        gross: Number(payee.pGrossAmount),
                        wtax: Number(payee.pTaxAmount),
                        net: Number(payee.pNetAmount),
                        irm: 0,
                        ac: 0,
                        check: Number(payee.pNetAmount),
                        check_no: payee.pCheckNo ?? ""
                    });
                }

                // Professional
                if (payee.pPayeeType === "C") {
                    rows.push({
                        particular: "HCI Account - Professional Fee",
                        gross: Number(payee.pGrossAmount),
                        wtax: Number(payee.pTaxAmount),
                        net: Number(payee.pNetAmount),
                        irm: 0,
                        ac: 0,
                        check: Number(payee.pNetAmount),
                        check_no: payee.pCheckNo ?? ""
                    });
                }

                //member
                if (payee.pPayeeType === "M") {
                    rows.push({
                        particular: "Member",
                        gross: Number(payee.pGrossAmount),
                        wtax: Number(payee.pTaxAmount),
                        net: Number(payee.pNetAmount),
                        irm: 0,
                        ac: 0,
                        check: Number(payee.pNetAmount),
                        check_no: payee.pCheckNo ?? ""
                    });
                }
            });

           

            return rows;
        },

        totalGross() {
            return this.rows.reduce((t, r) => t + r.gross, 0);
        },

        totalWTax() {
            return this.rows.reduce((t, r) => t + r.wtax, 0);
        },

        totalNet() {
            return this.rows.reduce((t, r) => t + r.net, 0);
        },

        totalIRM() {
            return this.rows.reduce((t, r) => t + r.irm, 0);
        },

        totalAC() {
            return this.rows.reduce((t, r) => t + r.ac, 0);
        },

        totalCheck() {
            return this.rows.reduce((t, r) => t + r.check, 0);
        }
    },

    methods: {
        formatMoney(value) {
            return Number(value).toLocaleString("en-US", {
                minimum_fraction_digits: 2,
                maximum_fraction_digits: 2
            });
        }
    }
};
</script>

<style scoped>
.summary-charges {
    margin-top: 20px;
}

.summary-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.summary-table th,
.summary-table td {
    border: 1px solid #000;
    padding: 6px 8px;
}

.summary-table thead th {
    background: #efefef;
    text-align: center;
}

.text-right {
    text-align: right;
}

.total-row {
    font-weight: bold;
    background: #f7f7f7;
}
</style>