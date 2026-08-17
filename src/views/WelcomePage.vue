<template>
<div class="fill-height d-flex align-center " >
    <Navbar/>
    <div class="z-index pa-5">
        <h1 class="welcome">WELCOME</h1>
        <h1 class="provider mb-1 white--text mb-2 text-uppercase">{{$route.params.provider}}</h1>
        <h1 class="department text-uppercase"> 
        <span v-if="$route.params.department === 'Admission'"> Frontdesk / Nurse / Admission </span>
        <span v-else-if="$route.params.department === 'Nurse Station'">eClaims - Nurse Station</span>
        <span v-else-if="$route.params.department === 'Credit and Collection'"> eClaims - Credit and Collection </span>
        <span v-else-if="$route.params.department === 'Laboratory'"> Covid 19 Laboratory</span>
        <span v-else>{{$route.params.department}}</span>
        DEPARTMENT</h1>
        <p class="title font-weight-regular font-size">Your terminal has been successfully set up, please proceed to login.</p>
        <v-btn @click="loginRoute" color="blue" class="btn-login body-2" depressed  dark rounded>Proceed to Login</v-btn>
    </div>

    <svg height="100%" viewBox="00 0 100 100" style="position:absolute; right:0;" class="hidden-sm-and-down">
        <clipPath id="shape">
            <path fill="CornFlowerBlue" d="M0, 0 100,0 L100,350 C-40,0 50,90 20,0 Z"/> <!--d="M0, 0 100,0 L100,350 C-40,0 50,90 20,0 Z"-->
        </clipPath>
        <image height="100%" clip-path="url(#shape)"  href="@/assets/welcome.png" />
    </svg>

    <div class="change-layout absolute hidden-md-and-up">
        <div class="absolute overlay"></div>
    </div>

</div>
</template>


<script>
import Navbar from "@/components/Navbar";
import { usr_credentials } from '../utils'
export default {
  components: {
    Navbar
  },

  methods: {
    loginRoute() {
        this.$store.commit('setUserCredentials', usr_credentials)
        try {
            this.$router.replace({ name: "Login"})
        }catch(e){
            console.warn(e)
        }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap');
/* Small devices (portrait tablets and large phones, 600px and up) */
.overlay{
   background:#ffffff8a
}

.change-layout {
    background-image: url('../assets/welcome.png');
    background-size: cover;
}


.absolute{
  position:absolute;
  height:100%; 
  width:100%;
}

.z-index{
    z-index:5 !important
}
.btn-login{
    font-family: 'Montserrat', sans-serif !important;
    font-weight:700;

}
.font-size{
    font-family: 'Montserrat', sans-serif !important;
    font-size:12pt !important
}
.welcome{
    color: #212121 !important;
    font-family: 'Montserrat', sans-serif !important;
    font-size:18pt;
    font-weight:600;
}
.department{
    color: #212121 !important;
    font-family: 'Montserrat', sans-serif !important;
    font-size:16pt;
    font-weight:600;
    line-height: 1;
}
.provider{
    color: #2196F3 !important;
    font-size: 44.3pt;
    font-weight: 700;
    line-height: 1;
}
</style>

