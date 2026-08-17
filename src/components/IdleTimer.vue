<template>
  <Alert :alert="alert" ref="alerts" />
</template>

<script>
import Alert from "@/components/Alert.vue"

export default {
  components: {
    Alert
  },

  data() {
    return {
      active_timer: '',
      idle_timer: '',
      alert: {}
    }
  },

  mounted() {
    // REMOVE LOG TIMER IN DEV
    if(this.$process_env !== 'DEV') {
      if(this.$store.state.usr_credentials && this.$store.state.prv_data){
        if (!this.$route.fullPath.includes("-result") && this.$route.fullPath !== '/registration') this.idleTimer()
        this.activeTimer();
      }
    }
  },

  methods:{
    activeTimer(){
      let current_time = new Date().getTime();
      let timer = 600000

      if(this.webCookies('get','DF342')){
        let time_in = parseInt(this.$crypto.AES.decrypt(this.webCookies('get','DF342'), '5lESE34b').toString(this.$crypto.enc.Utf8))
        timer = time_in + 600000 - current_time
      }else{
        this.webCookies('set','DF342', this.$crypto.AES.encrypt(JSON.stringify(current_time), '5lESE34b'))
      }


      this.active_timer = setTimeout(() => {
        this.updateTimeIn();
        this.webCookies('delete','DF342')
      }, timer)
    },

    // UPDATE TIME_IN
    async updateTimeIn(){
      let response = await this.$services.usrUpdateLogTime({
          request_code: 'RGJ6JF4ATK7R',
          username: this.$store.state.usr_credentials.user_name,
      })

      if (response.status === 200) {
        this.activeTimer();
      } else {
        this.alert = response.error
      }
    },

    // IDLE TIMER
    idleTimer(){
      window.onload       =  this.resetTimer;
      window.onmousemove  =  this.resetTimer; 
      window.onmousedown  =  this.resetTimer; // catches touchscreen presses as well      
      window.ontouchstart =  this.resetTimer; // catches touchscreen swipes as well 
      window.onclick      =  this.resetTimer; // catches touchpad clicks as well
      window.onkeypress   =  this.resetTimer;   
      window.onscroll     = this.resetTimer;
    },

    // RESET THE IDLE TIMER
    resetTimer(){
      clearInterval(this.idle_timer)
      if(this.webCookies('get','QR5YP') && localStorage.getItem('TW4LM')){
        this.idle_timer = setTimeout(() => {this.displayCountdownAlert()}, 600000)
      }else{
        window.onload       =  ''
        window.onmousemove  =  ''
        window.onmousedown  =  '' 
        window.ontouchstart =  ''
        window.onclick      =  ''
        window.onkeypress   =  ''
        window.onscroll     =  ''
        clearTimeout(this.idle_timer)
        clearTimeout(this.active_timer)
        this.$store.commit('setUserCredentials',null)
        this.webCookies('delete','DF342'); 
        this.webCookies('delete','QR5YP');
        return this.$router.replace('/')
      }
    },

    // DISPLAY THE ALERT FOR IDLE
    displayCountdownAlert(){
      this.$refs.alerts.startCountdown();
      this.alert = { display: true, type: 'auto-logout', width: '450' }
    }

  },

  destroyed(){
    window.onload       =  ''
    window.onmousemove  =  ''
    window.onmousedown  =  '' 
    window.ontouchstart =  ''
    window.onclick      =  ''
    window.onkeypress   =  ''
    window.onscroll     =  ''
    clearTimeout(this.idle_timer)
    clearTimeout(this.active_timer)
  }
}
</script>