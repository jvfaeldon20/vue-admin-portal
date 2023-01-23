<template>
  <div id="app">
  <v-app>
    <v-main>
      <v-container fluid pa-0>
        <div class="background-shapes-wrapper">
          <div class="background-shapes-container">
            <div class="background-shape circle-one"></div>
            <div class="background-shape circle-two"></div>
            <div class="background-shape square-one"></div>
            <div class="background-shape square-two"></div>
            <div class="background-shape square-three"></div>
            <div class="background-shape triangle-one"></div>
            <div class="background-shape triangle-two"></div>
            <div class="background-shape triangle-three"></div>
            <div class="background-shape rectangle-one"></div>
            <div class="background-shape rectangle-two"></div>
          </div>
        </div>
        <v-layout>
          <v-flex xs12 id="release-text-wrapper">
            <v-layout column align-center justify-center fill-height pa-3>
              <v-flex class="form-wrapper">
                    <div class="center">
                        <v-img src="avatar2.png" width="120"></v-img>
                    </div><br>
                    <div class="text-h3 mb-5 mt-5 text-center" >Account Login</div>
                    <v-alert
                      class="rounded-0"
                      dense
                      type="error"
                      v-show="error_login"
                    >
                      {{error_message}}
                    </v-alert>
                    <v-form ref="form">
                        <v-text-field
                            id="username"
                            v-model="username"
                            label="TREND\username"
                            filled
                            prepend-inner-icon="mdi-account-outline"
                            background-color="#f4f8f7"
                            rounded-0
                            autocomplete="off"
                            :rules="usernameRules"
                            class="mt-5"
                        ></v-text-field>
                        <v-text-field
                            id="password"
                            v-model="password"
                            :append-icon="showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            label="Password"
                            name="password"
                            background-color="#f4f8f7"
                            prepend-inner-icon="mdi-lock-outline"
                            :type="showPass ? 'text' : 'password'"
                            required
                            autocomplete="off"
                            :rules="[rules.required, rules.min]"
                            v-on:keyup.enter="validateCredential"
                            @click:append="showPass = !showPass"
                            filled
                        ></v-text-field>
                        <v-btn
                            :disabled="loading"
                            @click="validateCredential"
                            block
                            :loading="loader"
                            class="menu-icon-button block" 
                            color="white--text rounded-0 elevation-0 font-weight-bold"
                            height=55
                            id="t-btn-login"
                            >Login
                            <template v-slot:loader>
                              <span class="white--text mr-5">Authenticating...</span>
                            </template>
                        </v-btn>
                      <v-alert
                        class="rounded-0 mt-5"
                        dense
                        type="info"
                        v-show="error_login_contact"
                      >
                        {{error_contact_message}}
                      </v-alert>
                    </v-form>
                    <DuoAuthentication :dialog="dialog" :loginData="loginData" v-on:enableLogin="invalidDuoLogin"/>
                </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm12 id="login-form-wrapper" class="active">
            <v-layout column align-center justify-center pa-3 mt-5 class="form-position bg-main">
                <div class="login-wrapper text-center mb-3 pt-5 pb-5">
                    <v-img 
                        src="./assets/img/gisauto.png"
                        max-height="150px"
                        contain
                    ></v-img>
                    <div class="text-h4 mb-3 main-title font-weight-bold">
                      Admin is <span class="menu-icon-button white--text pa-1">Up!</span>
                    </div>
                    <div class="main-info">
                    <span class="subheading sub-title">Orchestration Platform of Service Catalog where users can manage Automation Services by Web Services, Service Triggers, and Automation Logs.</span>
                    </div>
                </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</div>
</template>

<script>
import DuoAuthentication from './components/Login/dialogs/_Duo-Authentication.vue'
import { mapActions } from 'vuex';

export default {
name: "Login",
components: {
    DuoAuthentication,
},
  data: () => ({
    showPass: false,
    loading: false,
    invalid: false,
    dialog: false,
    loginData:'',
    username: '',
    usernameRules: [(v) => !!v || "Username is required"],
    password: '',
    passwordRules: [(v) => !!v || "Password is required"],
    error_message: "Invalid Login. Unauthorized user.",
    rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        },
    error_login:false,
    loader: false,
    error_login_contact:false,
    error_contact_message: "If you would like to request access permission, please contact All of Trend GIS Automation Team",
  }),
  methods: {
    ...mapActions(['userValidate', 'checkAdminPermission']),
    validateCredential() {
      if (this.$refs.form.validate()) {
        this.loginData = {
          username: this.username,
          password: this.password,
        }

        // for autotesting purposes
        let robotUser = this.username 
        let self        = this
        let user_split  = ''
        let alias       = ''

        user_split = robotUser.split("\\")
        alias = user_split[1];

        if (robotUser == 'trendus\\su-itdev_robot_test'){
          this.loading = true;
          
          this.userValidate(this.loginData).then((response)=>{
             if(response.status == 200) {
               
                self.$session.start()
                self.$session.set("jwt", response.data)
                self.$cookies.set("admin_user", alias, 0)
                window.history.go()
              }

          }).catch((err)=>{
              self.error_login         = true
              self.error_message       = "Username / Password is incorrect."
              self.error_login_contact = false
              self.invalid             = true
              self.loading             = false
              self.loader              = false
          })

        }else{
          
          self.loading    = true
          self.loader     = true
  
          // 1. authorization process
          user_split      = self.username.split("\\")
          alias           = user_split[1]
          this.checkAdminPermission({user_name:alias}).then((response)=>{
            let isAuthorized = response.data.admin_access
            // console.log("ADMIN CHECKING: ",response)
  
              if(isAuthorized){
                // 2. authentication process
                    this.userValidate(this.loginData).then((response)=>{
                      // console.log("USER AUTHENTICATION: ",response)
  
                      if(response.status == 200){
                        self.dialog              = true
                        self.error_login         = false
                        self.error_login_contact = false
                      }
  
                    }).catch((err)=>{
                        self.error_login         = true
                        self.error_message       = "Username / Password is incorrect."
                        self.error_login_contact = false
                        self.invalid             = true
                        self.loading             = false
                        self.loader              = false
                    })
  
              }else{
                self.dialog              = false
                self.error_login         = true
                self.error_message       = "Invalid Login. Unauthorized user."
                self.error_login_contact = true
                self.invalid             = true
                self.loading             = false
                self.loader              = false
              }
            }).catch((err)=>{
                self.dialog              = false
                self.error_login         = true
                self.error_message       = "Username / Password is incorrect."
                self.error_login_contact = false
                self.invalid             = true
                self.loading             = false
                self.loader              = false
            })
        }

    }
    },
    invalidDuoLogin(){
      this.loading             = false
      this.dialog              = false
      this.loader              = false
      this.error_login         = true
      this.error_message       = "Invalid Login. Unauthorized user."
      this.error_login_contact = true
      this.invalid             = true;
    }
  },
  created(){
    // console.log("PACKAGE VERSION:",process.env.VUE_APP_VERSION);
  }
}
</script>

<style scoped>
 iframe {
    width: 100%;
    height: 500px;
}

.container {
  min-height: 530px;
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(253deg, #0D47A1 0, #29B6F6 100%);
  color: white;
}

.form-wrapper {
  min-width: 60%;
  margin-top: 175px;
}

.layout.wrap {
  height: 100vh;
}

.active {
  background: #fff;
  color: #29B6F6;
}

#sign-in,
.switch #sign-up {
  width: 60%;
}

#sign-up,
.switch #sign-in {
  min-width: 25%;
  width: auto;
}

.form-wrapper .v-input__control > .v-input__slot {
  background: #29B6F6;
}

.form-wrapper .v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0px;
  height: 0px;
}

#release-text-wrapper {
  background-image: linear-gradient(253deg, #0D47A1 0, #1565C0 100%);
  position: absolute;
  animation: 0.75s linear slide-back-left;
  left: 0;
  right: auto;
  height: 100vh;
  width: 33%;
}

#login-form-wrapper {
  position: absolute;
  animation: 0.75s linear slide-back-right;
  right: 0;
  left: auto;
  height: 100vh;
  width: 67%;
  /* background: url('assets/login2.jpg') no-repeat center center; */
  background-image: linear-gradient(253deg, #E0E0E0 100%, #fff 100%);
  background-size: 100%;
  background-attachment: fixed;
  display: center; 
  color:#6fbd35;
}

#release-text-wrapper.switch {
  background-image: linear-gradient(253deg, #AED581 0, #6fbd35 100%);
  right: 0;
  left: auto;
  animation: 0.75s linear slide-right;
  -webkit-animation-fill-mode: both;
}

#login-form-wrapper.switch {
  left: 0;
  animation: 0.75s linear slide-left;
}
.center{
  position: center !important;
}

@keyframes slide-left {
  0% {
    left: 33%;
    opacity: 0;
  }
  50% {
    left: 25%;
    opacity: 0;
  }
  100% {
    left: 0;
    opacity: 1;
  }
}

@keyframes slide-right {
  0% {
    right: 100%;
    width: 33%;
    z-index: 1;
  }
  20% {
    right: 75%;
    width: 60%;
    max-width: 60%;
    z-index: 1;
  }
  100% {
    right: 0;
    width: 33%;
    max-width: 35%;
    z-index: 1;
  }
}

@keyframes slide-back-left {
  0% {
    left: 67%;
    width: 33%;
    z-index: 1;
  }
  20% {
    left: 50%;
    width: 60%;
    max-width: 60%;
    z-index: 1;
  }
  100% {
    left: 0;
    width: 33%;
    z-index: 1;
  }
}

@keyframes slide-back-right {
  0% {
    left: 0;
    opacity: 0;
  }
  10% {
    left: 15%;
    opacity: 0;
  }
  20% {
    left: 25%;
    opacity: 0;
  }
  30% {
    left: 35%;
    opacity: 0;
  }
  40% {
    left: 45%;
    opacity: 0;
  }
  50% {
    left: 55%;
    opacity: 0;
  }
  60% {
    left: 65%;
    opacity: 0;
  }
  70% {
    left: 75%;
    opacity: 0;
  }
  100% {
    left: 33%;
    opacity: 1;
  }
}
.background-shapes-wrapper {
  position: absolute;
  width: 100vw;
  height: 100%;
  top: 0;
  overflow: hidden;
}

.background-shapes-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.background-shape {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10;
}

.square-one {
  width: 30px;
  height: 30px;
  top: 15%;
  left: 20%;
  -webkit-transform: rotate(-65deg);
  transform: rotate(-65deg);
}

.square-two {
  width: 25px;
  height: 25px;
  top: 55%;
  right: 1%;
  -webkit-transform: rotate(-65deg);
  transform: rotate(-65deg);
}
.square-three {
  width: 50px;
  height: 50px;
  top: 30%;
  left: 45%;
  -webkit-transform: rotate(-65deg);
  transform: rotate(-65deg);
}

.circle-one {
  width: 250px;
  height: 250px;
  border-radius: 100%;
  bottom: -125px;
  left: -125px;
}

.circle-two {
  width: 30px;
  height: 30px;
  bottom: 20%;
  right: 25%;
  border-radius: 100%;
}

.triangle-one {
  width: 0;
  height: 0;
  border-top: 69px solid transparent;
  border-bottom: 48px solid transparent;
  border-left: 90px solid rgba(255, 255, 255, 0.08);
  top: 45%;
  left: 30%;
  background-color: transparent;
  -webkit-transform: rotate(-100deg);
  transform: rotate(-100deg);
}
.triangle-two {
  width: 0;
  height: 0;
  border-top: 200px solid transparent;
  border-bottom: 130px solid transparent;
  border-left: 180px solid rgba(255, 255, 255, 0.1);
  top: -150px;
  right: -80px;
  background-color: transparent;
  -webkit-transform: rotate(-80deg);
  transform: rotate(-80deg);
}

.triangle-three {
  width: 0;
  height: 0;
  border-top: 68px solid transparent;
  border-bottom: 49px solid transparent;
  border-left: 90px solid rgba(255, 255, 255, 0.08);
  right: 10%;
  bottom: 1%;
  background-color: transparent;
  transform: rotate(-170deg);
}

.rectangle-one {
  width: 25px;
  height: 50px;
  top: 80%;
  left: 25%;
  -webkit-transform: rotate(-55deg);
  transform: rotate(-55deg);
}
.rectangle-two {
  width: 15px;
  height: 30px;
  top: 42%;
  right: 23%;
  -webkit-transform: rotate(-55deg);
  transform: rotate(-55deg);
}


.menu-icon-button {
  background-color: #6fbd35 !important;
}


.main-title{
  color: #0D47A1 !important;
}

.login-wrapper{
  margin-top: 150px;
}


.sub-title{
  color:#212121 !important;
}


.main-info{
  padding: 0px 150px;
}

.center {
  margin: auto;
  width: 30%;
}
</style>>
