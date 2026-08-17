<template>
  <div class="d-flex justify-start align-center">
    <span class="text-body-2 font-weight-medium d-flex pr-2">UNIT TYPE: <span class="unit-type pl-2"> {{ value === 'CU' ? 'Conventional Unit' : 'International Standard Unit' }} </span> </span>
    <v-radio-group :value="value" @change="$emit('input', $event)" row dense hide-details class="mt-n1 d-print-none">
      <v-radio label="Conventional Unit" value="CU" />
      <v-radio label="SI Unit" value="SIU" />
    </v-radio-group>
  </div>
</template>

<script>
export default {
    props: ['value'],
}
</script>
<style scoped>
.unit-type {
  display: none;
}
@media print {
  .unit-type {
    display: flex;
  }
}
</style>
