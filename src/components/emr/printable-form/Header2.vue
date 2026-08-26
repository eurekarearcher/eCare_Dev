<template>
    <v-row class="body-2" dense>
        <v-col class="align-baseline d-flex" cols="8" sm="8" md="8" lg="8">
            <span class="font-weight-medium">Name:</span>
            <span class="border-bottom">{{ name }}</span>
        </v-col>

        <v-col class="align-baseline d-flex" cols="4" sm="4" md="4" lg="4">
            <span class="font-weight-medium">Date:</span>
            <span class="border-bottom">{{ date }}</span>
        </v-col>

        <v-col class="align-baseline d-flex" cols="8" sm="8" md="8" lg="8">
            <span class="font-weight-medium">Address:</span>
            <span :class="{'caption' : address.length > 48}" class="border-bottom">{{ address }}</span>
        </v-col>

        <v-col class="align-baseline d-flex" cols="4" sm="4" md="4" lg="4"> 
            <span class="font-weight-medium">Age:</span>
            <span class="border-bottom">{{ age }}</span>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: ['name', 'date', 'address', 'age']
}
</script>

<style scoped>
.border-bottom {
    border-bottom: 1px solid grey; 
    margin: 14px 6px 0 8px; 
    padding: 2px 0 0 0; 
    width: 100%;
}
</style>