<template>
  <v-row justify="center" class="blue">
    <v-dialog
      v-model="dialog"
      max-width="350"
      height="600"
      persistent
    >
      <v-card
        class="mx-auto"
      >
        <v-list-item two-line class="grey lighten-3" color="blue darken-4" >
          <v-list-item-content>
            <v-list-item-title class="text-h5">
              <span class="font-weight-bold mr-2 light-green-text">DUO</span>Authentication
            </v-list-item-title>
            <v-list-item-subtitle color="blue darken-4"><v-icon class="mr-2">mdi-key</v-icon>Two-Factor Verification Method</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-card-text class="mt-5 mb-5">
          <v-row align="center">
            <v-col
              class="text-h2 pa-0"
              align="center"
              cols="12"
            >
              <v-btn
                width="250"
                class="rounded-0 pa-6 menu-icon-button white--text"
                @click="sendPush"
                :disabled="disabled"
                >
                <v-icon class="mr-2">mdi-key-variant</v-icon>
                Send Push
              </v-btn>
            </v-col>
            <v-col
              class="text-h2 pa-0"
              align="center"
              cols="12"
            >
              <v-btn
                width="250"
                class="rounded-0 pa-6 menu-icon-button white--text text-left" 
                @click="expand = !expand"
                :disabled="disabled"
              >
                <v-icon class="mr-3">mdi-cellphone-key</v-icon>
                Enter Passcode
              </v-btn>
              <v-expand-transition>
                <v-card
                  v-show="expand"
                  flat
                  class="mx-auto"
                  ref="passcodeform"
                >
                  <v-card class="d-inline-flex pt-4 pl-4 pr-4 rounded-0" flat>
                    <v-text-field
                      id="password"
                      v-model="passcode"
                      label="Passcode"
                      outlined
                      clearable
                      text-center
                    >
                    <template v-slot:append>
                      <v-icon color="primary"  @click="sendPasscode">mdi-send</v-icon>
                    </template>
                    </v-text-field>
                  </v-card>
                </v-card>
              </v-expand-transition>
            </v-col>
          </v-row>
          <div :hidden="validateStatus">
            <v-row :class="validatePosition">
              <v-col cols="2"></v-col>
              <v-col
                class="pa-0"
                align="center"
                cols="8"
              >Validating...
                <v-progress-linear
                  :color="validateColor"
                  indeterminate
                  rounded
                  height="10"
                ></v-progress-linear>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-list-item :hidden="validateStatus"  :class="validateBG">
          <v-list-item-content class="pa-5 pb-2 text-center">
              <p class="font-weight-light white--text">
                {{validateText}}</p>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapActions } from 'vuex';

  export default {
    name: "Duo-Authentication",
    data(){
      return{
        validateText: '',
        validateStatus:true,
        validatePosition:'',
        validateColor:'',
        validateBG: 'grey lighten-3',
        data:'',
        expand: false,
        passcode: '',
        disabled: false,
      }
    },
    props:['dialog','loginData'],
    methods:{
      ...mapActions(['duoValidate']),
      sendPush(){
        this.disabled = true
        this.duoValidation(this.loginData)
      },

      sendPasscode(){
        this.disabled = true
        this.loginData = {
          username: this.loginData.username,
          password: this.loginData.password + ',' + this.passcode,
          passcode: this.passcode,
        }
        
        this.duoValidation(this.loginData)
      },
      duoValidation(loginData) {
        this.validateStatus   = false;
        this.validateBG       = 'blue darken-1'
        this.validateText     = 'A notification has been sent to your device, please respond.';
        this.validateColor    = 'blue darken-4';
        this.validatePosition = 'mt-5 pt-5';

        // Clear Site Data
        localStorage.clear();
        sessionStorage.clear();
        this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))

        let self       = this
        let user_split = ''
        let alias      = ''

        this.duoValidate(loginData).then((response)=>{
          if(response.status == 200) {
            self.$session.start()
            self.$session.set("jwt", response.data)
            self.validateBG = 'menu-icon-button'
            self.validateText = 'Login Success!'
            self.disabled = false
            self.validateColor = '#6fbd35';
            user_split = loginData.username.split("\\")
            alias = user_split[1];
            self.$cookies.set("admin_user", alias, 0)
            window.history.go()

          }else{
            self.$emit('enableLogin')
          }
        }).catch(()=>{
          self.$emit('enableLogin')
        })
      },
    },
    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)
        this.loader = null
      },
    },
  }
</script>

<style scoped>
.menu-icon-button {
  background-color: #6fbd35 !important;
}

.light-green-text{
  color: #6fbd35 !important;
}

</style>