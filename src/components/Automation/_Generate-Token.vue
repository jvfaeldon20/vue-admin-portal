<template>
  <div id="automation">
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="blue darken-4 pa-6 ml-2"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-list"
      >
        Back
      </v-btn>
    </div>
    <div id="form-container" class="mt-9">
        <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
          <div class="rounded-0 ml-2 mr-2 pa-6">
            <v-snackbar v-model="snackbar" color="blue darken-4" top>
              <v-icon class="mr-2">mdi-clipboard-check</v-icon>
              Key copied to clipboard

              <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
                  Close
                </v-btn>
              </template>
            </v-snackbar>
            <h1 class="font-weight-light form-step-title">
                Generate Token
                <v-alert
                    dense
                    text
                    type="info"
                    class="rounded-0"
                >This is a system generated token. Click <span class="menu-icon-button pa-1 white--text">Generate</span> to refresh token.
                </v-alert>
            </h1>
            <v-row class="pa-6">
              <v-col cols="12">
                <v-text-field
                  id="token"
                  v-model="token"
                  clearable
                  label="System Generate Token"
                  type="text"
                  ref="token"
                  class="mb-5"
                >
                  <template v-slot:prepend>
                    <v-tooltip
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" color="blue">
                          mdi-help-circle-outline
                        </v-icon>
                      </template>
                      This is a system generated token. 
                      Click refresh to create new token.
                    </v-tooltip>
                  </template>
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loading"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                    </v-fade-transition>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-col cols="12">
                <v-btn
                  class="blue darken-4 pa-6"
                  color="white--text rounded-0 elevation-0"
                  @click="copy">
                <v-icon class="mr-2">mdi-content-copy</v-icon>Copy
                </v-btn>
                <v-btn 
                  id="generate"
                  class="menu-icon-button pa-6 ml-2"
                  color="white--text rounded-0 elevation-0"
                  @click="newToken"
                  >
                  <v-icon class="mr-2">mdi-refresh</v-icon>Generate
                </v-btn>
            </v-col>
          </div>
        </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Automation-Generate-Token',
  data() {
    return {
      token: "",
      snackbar: false,
      loading: false,
    };
  },
  computed: {},
  methods: {
    copy() {
      const token = this.$refs.token.$el.querySelector("input");
      token.select();
      document.execCommand("copy");
      this.snackbar = true
    },
    ...mapActions(['generateToken','generateNewToken']),
    fetchToken(){
      this.generateToken(this.$route.params.project_key).then(() => {
      this.token = this.$store.state.Automation.token
      this.loading = false
    })
    },
    newToken() {
      this.loading = true
      this.token = 'Wait for it...'
      this.generateNewToken(this.$route.params.project_key).then(() => {
        this.fetchToken()
      })
    },
  },
  beforeMount(){
    this.loading = true
    this.token = 'Wait for it...'
  },
  mounted(){
    this.generateToken(this.$route.params.project_key).then(() => {
      this.token = this.$store.state.Automation.token
      this.loading = false
    })
  },
}
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

#form-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  grid-gap: 1em;
  margin: 5px 0px 0px 15px;
}

#toolbar{
  margin: 15px 0px 0px 15px;
}

.menu-item-hover {
  background-color: #384355;
}

.menu-action{
  color: #234899;
  font-size: 16px;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}

.v-btn__content{
  text-transform: unset !important;
  color: #234899;
}

.form-step-title{
    color: #234899;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

</style>