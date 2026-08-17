<template>
  <v-navigation-drawer app v-model="open_chat_btn" v-resize="resize" right disable-resize-watcher hide-overlay >
    <v-layout wrap>
      <v-card width="350" flat>
        <!-- HEADER -->
        <v-flex xl12 sm12 class="blue darken-1 py-2 d-flex justify-space-between align-center">
          <template v-if="!messages.length">
            <h5 class="subtitle-1 px-5 white--text"> Chat &nbsp;<v-icon small color="white">fas fa-comment-dots</v-icon ></h5>
            <v-btn text @click="$emit('hide-chat')"><v-icon color="white" small right>fas fa-times</v-icon></v-btn>
          </template>
          <template v-else>
            <h5 v-if="operator === ''" class="subtitle-1 my-2 pl-4 white--text">connecting to <v-icon small color="white">fas fa-comment-dots</v-icon></h5>    
            <v-layout v-else flex-column>
              <h5 class="subtitle-1 font-weight-medium pl-4 white--text text-uppercase" style="margin-top:0.5px">{{operator}}</h5>   
              <v-card-subtitle class="py-0 white--text">{{host_name}}</v-card-subtitle>
            </v-layout>
            <v-btn text @click="$emit('hide-chat')" small><v-icon color="white" small right>fas fa-times</v-icon></v-btn>
          </template>
        </v-flex>

        <!-- BODY -->
        <v-flex xl12 sm12 id="msg_history" class="message-history" :style="message_height">
          <v-layout v-if="!messages.length" wrap align-center justify-center fill-height>
            <h6 class="body-2 font-weight-light">Start Conversation</h6>
          </v-layout>
          <v-layout v-else wrap v-for="(message,i) in messages" v-bind:key="i" :class="{'justify-end' : message.user_code === usercode}" mb-2>
            <div :class="{'grey lighten-3 grey--text text--darken-3 mr-5 ml-1': message.user_code !== usercode, 'mid-blue ml-5 mr-1' : message.user_code === usercode}" class="radius px-2 py-2 my-1" >
              <h6 class="font-weight-bold mr-5 user">{{message.sender}}</h6>
              <p  class='word-wrap mb-1 font-weight-medium message caption'> {{message.message}}</p>
              <h6 v-if="message.timestamp === 'Sending...'" class="font-weight-regular ma-0 time">{{message.timestamp}}</h6>
              <h6 v-else class="font-weight-regular ma-0 time">
                {{timestamp === message.timestamp.substring(0, 10) ? 'Today, '+$moment(message.timestamp).format('LT') : $moment(message.timestamp).format('ll LT')}}
              </h6>
            </div>
          </v-layout>
        </v-flex>

        <v-divider></v-divider>
        <v-card-actions>
            <v-text-field v-model="message" @keyup.enter="sendMessage" @click="clearChatCount" placeholder="Enter a message">
              <template slot="append-outer"><v-icon color="blue" @click="sendMessage">mdi-send</v-icon> </template>
            </v-text-field>
        </v-card-actions>
      </v-card>
    </v-layout>

  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["transaction_number", "open_chat_btn", "view_chat"],

  data() {
    return {
      username: "",
      message: "",
      messages: [],
      message_height: "",
      operator: "",
      host_name: "",
      usercode: this.$store.state.usr_credentials.user_code ? this.$store.state.usr_credentials.user_code : '',

      unread_msg_count: 0,
      total_msg_count:0,

      timestamp: this.$moment().format('YYYY-MM-DD'),

      //CANCELLATION TOKEN
      cancelToken:null,
      source:null,

    };
  },

  mounted(){
    this.CancelToken = this.$axios.CancelToken;
    this.source = this.CancelToken.source();
    this.displayMessage()
    this.resize()
  },
  
  watch:{
    unread_msg_count(value){
      this.$emit('unread-msg-count',value)
      if(value > 0){
        let audio = new Audio(require('../assets/sound 5.mp3'));
        audio.play();
      }
    }

  },

  methods:{
    displayMessage(){
      this.$axios.post(this.$tms_url+'resources/api/_get_transaction_chat_data.php', this.$qs.stringify({
        post_data: this.wsDataEncryption(JSON.stringify({
          transaction_number: this.transaction_number
        }))
      }),{
        cancelToken: this.source.token
      })
      .then (response => {
        response.data = this.responseDataDecryption(response.data)
        this.messages = response.data === 'Data not found. '? [] : response.data
        if(response.data !== 'Data not found. '){
          const get_operator = response.data.filter(item => {return item.user_code !== this.usercode})
          if(get_operator.length){
            this.operator = get_operator[0].sender; 
            this.host_name = get_operator[0].host_name
          }
  
          this.total_msg_count = 0
          this.messages.forEach(msg => {
            if (msg.user_code !== this.$store.state.usr_credentials.user_code) this.total_msg_count += 1
           })  
          this.getChatCount();
        }

        if(this.view_chat){
          this.chat_timeout = setTimeout(() => this.displayMessage(), 3000)
        }

      })
    },
  
    getChatCount(){
      let prev_chat = sessionStorage.getItem('previousChatCount') ? sessionStorage.getItem('previousChatCount') : 0
      this.unread_msg_count = this.total_msg_count - prev_chat
      if(this.unread_msg_count === 0){
        document.title = "eCare";
        this.unread_msg_count = 0
      }else{
        document.title = "You have ("+this.unread_msg_count+ ") new message!";
        setTimeout(() => {
          document.title = "eCare";
        }, 1000)
      }
    },
  
    sendMessage(){
      sessionStorage.setItem('previousChatCount', this.total_msg_count)
      if(this.message.trim()){
        let trim_message = this.message.trim()
        this.messages.push({
          // sender: this.$store.state.usr_credentials.user_name, 
          // pr_operator: this.$store.state.usr_credentials.user_name,
          message: trim_message, 
          timestamp: 'Sending...', 
          user_code: this.$store.state.usr_credentials.user_code,
        });
        this.message = ''
        this.$axios.post(this.$tms_url+'resources/controller/trn_add_chat_transaction_data.php', this.$qs.stringify({
          post_data: this.wsDataEncryption(JSON.stringify({
            transaction_number:this.transaction_number,
            sender: this.$store.state.usr_credentials.user_name,
            pr_operator: this.$store.state.usr_credentials.user_name,
            message: trim_message,
            user_code: this.$store.state.usr_credentials.user_code
          }))
        }))
        .then(() => {
          this.scrollToBottom();
        })
      }
    },

    // CLEAR CHAT COUNT
    clearChatCount(){
      sessionStorage.setItem('previousChatCount', this.total_msg_count)
      document.title = "eCare System";
    },
  
    scrollToBottom(){
      document.getElementById('msg_history').scrollTop = document.getElementById('msg_history').scrollHeight;
    },

    //FOR RESPONSIVENESS
    resize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      if(this.windowSize.x > 1904){
        this.message_height = 'height:86.5vh';
      }else if(this.windowSize.x >1360 && this.windowSize.x < 1904){
        this.message_height = 'height:80vh';
      }else if(this.windowSize.x >1264 && this.windowSize.x < 1360){
        this.message_height = 'height:78vh';
      }else if(this.windowSize.x >960 && this.windowSize.x < 1264){
        this.message_height = 'height:77vh';
      }else{
        this.message_height = 'height:78vh';
      }
    },
  },

  beforeDestroy(){
    clearTimeout(this.chat_timeout)
    this.source.cancel();
  }

};
</script>

<style scoped>
.message-history{
  overflow-y: auto;
}
.word-wrap{
  display: inline-block;
  word-break: break-word;
}
.radius{
  border-radius: 4px;
}
.user{
  font-size:9pt;
}
.message{
  font-size: 10pt
}
.time{
  font-size: 8pt
}

.mid-blue{
  /* background:#daeeff !important */
  background: #d5ecff !important;
}
</style>