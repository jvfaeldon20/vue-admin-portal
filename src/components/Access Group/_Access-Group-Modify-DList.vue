<template>
  <div id="automation">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="#6fbd35"
      text
      top
      right
      height="60"
      elevation="2"
    >
      <v-icon color="light-green" class="mr-2">mdi-check-outline</v-icon>
      {{ snackbar_text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon color="light-green">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarFailed"
      :timeout="timeoutFailed"
      color="#bd3535"
      text
      top
      right
      height="60"
      elevation="2"
    >
      <v-icon color="red darken-3" class="mr-2">mdi-close-outline</v-icon>
      {{ snackbar_text_failed }}
     
    </v-snackbar>
    <v-overlay :value="overlay">
        <v-progress-circular
        :size="loaderSize"
        :width="loaderWidth"
        color="blue"
        indeterminate
        ></v-progress-circular>
    </v-overlay>
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="blue darken-4 pa-6 ml-2"
        color="white--text rounded-0 elevation-0"
        left
        to="/access-group-list"
      >
        Back
      </v-btn>
    </div>
    <div id="form-container" class="mt-9">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
          <div class="rounded-0 ml-2 mr-2 pa-6">
            <h1 class="font-weight-light form-step-title">
                Distribution Lists
                <v-alert
                    dense
                    text
                    type="info"
                    class="rounded-0"
                >To remove an item, search for the distribution list, uncheck the item and click the <span class="menu-icon-button pa-1 white--text">Update</span> to save changes. 
                </v-alert>
            </h1>
            <v-row class="pt-6 pb-6">
              <v-col cols="12">
                <v-combobox
                  v-model="distributionList"
                  :items="items"
                  label="Search Distribution List"
                  prepend-inner-icon="mdi-magnify"
                  multiple
                  outlined
                  :loading="isLoading"
                  class="rounded-0"
                  v-on:input="limiter"
                  clearable
                >
                </v-combobox>
              </v-col>
            </v-row>
            <v-col cols="12">
                <v-btn 
                  class="menu-icon-button pt-6 pb-6"
                  color="white--text rounded-0 elevation-0"
                  :disabled="dialog"
                  :loading="dialog"
                  @click="updateItem"
                  >
                  <v-icon class="mr-2">mdi-pencil</v-icon>Update
                </v-btn>
                <v-dialog
                      v-model="dialog"
                      hide-overlay
                      persistent
                      width="300"
                  >
                  <v-card
                      class="menu-icon-button pa-2 rounded-0 no-border-radius"
                      dark
                  >
                      <v-card-text>
                      Updating Data.. Please wait
                      <v-progress-linear
                          indeterminate
                          color="white"
                          class="mb-0"
                      ></v-progress-linear>
                      </v-card-text>
                  </v-card>
                  </v-dialog>
            </v-col>
          </div>
        </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Access-Group-Modify-DL',
  data(){
    return{
      items: [],
      distributionList: [],
      isLoading: false,
      search: null,
      model:[],
      group_name: '',
      dl_list: [],
      projects: [],
      overlay: false,
      dialog: false,
      loading: false,
      loaderSize: 0,
      loaderWidth: 0,
      valid: false,
      access_group_name: '',
      timeout:-1,
      snackbar:false,
      snackbar_text: "Data updated successfully!",
      snackbarFailed:false,
      timeoutFailed : -1,
      snackbar_text_failed : "Invalid. Please check your details.",
    }
  },
  methods: {
    ...mapActions(['fetchAccessGroupDList','updateDistributionList']),
    updateItem(){
       if(this.distributionList == '' ){
          this.snackbarFailed = true
          this.timeoutFailed = 2000
      }else{
          let updateItem = {
            access_group_id: this.$route.params.key,
            dl_list: this.distributionList
          }
            
          this.dialog  = true
          this.overlay = true
      
            this.updateDistributionList(updateItem).then(() => {
                this.dialog   = false
                this.overlay  = false
                this.snackbar = true
                this.timeout  = 3000
                
                setTimeout(() => {
                  this.$router.push({name:"Access-Group-List"})
                }, 2000);
            })
    }
      
    },
    limiter(e) {
      if(e.length > 5) {
        e.pop()
      }
    },
  },
  mounted() {
    this.isLoading = true
    this.items = this.$store.state.AccessGroup.distro_name

    this.fetchAccessGroupDList(this.$route.params.key).then(() => {
      const list = this.$store.state.AccessGroup.distrolist

      this.group_name       = list.access_group_details.access_group_name
      this.projects         = list.project_list.map( item => item.project_name )
      this.dl_list          = list.dl_list.map( item => item.access_group_dl_name )
      this.distributionList = list.dl_list.map( item => item.access_group_dl_name )
      this.isLoading        = false

      // console.log(this.dl_list);
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

.menu-icon-button {
  background-color: #6fbd35 !important;
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

</style>