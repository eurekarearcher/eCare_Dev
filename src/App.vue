<template>
  <v-app>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {

};
</script>

<style>
/* ------- FOR PRINTING ------- */
body{
  -webkit-print-color-adjust: exact !important;
}
/* ------- TABLE ------- */
.theme--light.v-data-table thead tr th, 
.theme--light.v-data-table tbody tr td{
  text-align: center !important;
  border-right: 1px solid #dddddd;
  cursor: pointer;
}
.theme--light.v-data-table .v-data-table-header th.sortable .v-data-table-header__icon{
  color: white !important;
  margin-left: 2px !important;
}
.theme--light.v-data-table thead tr th, 
.v-data-footer{
  background-color: #1565C0;
  color: white !important;
  justify-content: center !important;
}
.v-application--is-ltr .v-data-footer__select {
    margin:0 !important
}
.theme--light.v-data-table .v-data-footer .v-input__control{
  background: white;
}
.v-application--is-ltr .v-data-footer__icons-after .v-btn:first-child{
  margin-left: 7px;
  color: white;
}
.v-application--is-ltr .v-data-footer__icons-before .v-btn:last-child{
  margin-right: 7px;
  color: white;
}
/* ------- STEPPERS ------- */
.v-stepper__header{
  height:auto !important;
}
.v-stepper__step__step {
  height:45px !important;
  width:45px !important;
  font-size: 1.25em !important;
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
}
.v-stepper--alt-labels .v-stepper__header .v-divider {
  margin: 50px -62px 0 !important;
}
.v-stepper--alt-labels .v-stepper__step {
  padding:24px 0 !important
}
/* ------- ANIMATED PROGRESS LINEAR BAR ------- */
.stripesLoader {
  background: linear-gradient(90deg, #eee 50%, transparent 50%);
  background-size: 200%;
  background-position: 100%;
  border-radius: 5px;
  height: 10px;
  position: relative;
  transform: scale(-1);
  transition: 0.3s;
}
.stripesLoader:before {
  animation: shift 4s linear infinite;
  border-radius: 5px;
  background: linear-gradient(
    135deg,
    /* transparent 25%,
    rgba(238, 238, 238, 0.5) 25%,
    rgba(238, 238, 238, 0.5) 30%,
    transparent 30%, */
    transparent 35%,
    rgba(238, 238, 238, 0.5) 35%,
    rgba(238, 238, 238, 0.5) 70%,
    transparent 70%
  );
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: 37px 100%;
  box-shadow: inset 0 0px 10px rgba(0, 0, 0, 0.2),
  inset 0 -2px 1px rgba(0, 0, 0, 0.2);
}
@keyframes shift {
  to {
    background-position: 35px 100%;
  }
}
/* ------- STYLE ------- */
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
  
  
.colorGrey{
  color:#424242 !important;
  font-weight:normal !important;
} 
.greyDarken2{
  color:#616161 !important;
}
.group{
  padding:20px;
  margin:0px 10px 5px 10px;
  width:300px;
}
.required{
  color:red;
}
.v-snack__content {
  padding: 0px !important
}
.text-field{
  border:1px solid #BDBDBD;
  border-radius:4px;
  resize: none;
  padding: 10px;
  color:black
}
*:focus{
  outline: none
}


/* ------- GENERAL - COMMON CSS ------- */
a{ 
  color: inherit !important;
  text-decoration: none !important;
}
.overlay-loader{
  align-items: center;
  height: 100vh;
  justify-content: center;
}
.category-loader{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.table-overflow-x{
  border: 2px solid #dedede; 
  border-radius: 4px;
  margin-top: 4px;
  overflow-x: auto; 
  overflow-y: hidden; 
  padding: 0 6px;
}
.table-overflow-x table{
  min-width: 1000px;
  width: 100%; 
}
/* EBENEFITS  */
.loader-title{
  color:#0277bd !important;
  padding-left: 20px;
}
.page-title {
 color : #424242 !important;
 font-weight: 500;
}
.text-capitalize {
  text-transform: capitalize;
}

.ekass-epress-font {
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.ekass-epress-font-weight-medium {
  font-weight: 600;
}

.ekass-epress-font-weight-bold {
  font-weight: bold;
}

.ekass-epress-font-title {
  font-size: 1.3rem !important;
}

.ekass-epress-body-2 {
  font-size: 0.9rem !important; 
}

.form-div{
    display: flex;
    justify-content: baseline;
    align-items: baseline;
    margin: 16px 0 16px 0;
}

@media print {
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .v-overlay { 
    opacity: 0 !important;
  }

  .v-main{
    padding: 0 !important
  }
  
  .form-div {
    margin: 0 !important
  }
}
</style>

