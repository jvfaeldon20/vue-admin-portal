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
        to="/automation-list"
      >
        Back
      </v-btn>
    </div>
    <div id="form-container" class="mt-9">
       <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
        <v-form v-model="valid" ref="form" @submit.prevent="submitForm" class="rounded-0 ml-2 mr-2 pa-6">
          <h1 class="font-weight-light form-step-title">
              Edit Automation
              <v-alert
                  dense
                  text
                  type="info"
                  class="rounded-0"
              >Please check the details carefully before submission.
              </v-alert>
          </h1>
            <v-row class="mt-5">
                <v-col cols="4">
                    <v-text-field required label="Project Name" v-model="project_name" readonly></v-text-field>
                </v-col>

                <v-col cols="4">
                    <v-text-field required label="Project Key" v-model="project_key" readonly></v-text-field>
                </v-col>

                <v-col cols="4">
                    <v-autocomplete
                        v-model="project_access_group_id"
                        :items="allAccessGroupList"
                        :loading="loading"
                        item-value='access_group_id'
                        item-text='access_group_name'
                        persistent-hint
                        label="Access Group"
                        :rules="[!!project_access_group_id || 'Access group is required']"
                        return-object
                    >
                        <template v-slot:no-data>
                          <div>
                              <v-alert
                              :value="true"
                              :dense="true"
                              icon="mdi-alert-circle"
                              >
                                  No Data Available
                              </v-alert>
                              <AutomationAccessGroupAdd v-on:add-access-group="setAccessGroup" class="pt-0 pl-5 pb-5"/>
                          </div>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="12">
                    <v-text-field id="projectDescriptionEdit" required label="Description" :rules="[!!project_description || 'Description is required']" v-model="project_description"></v-text-field>
                </v-col>

                <v-col cols="6">
                    <v-text-field required label="FQDN" v-model="project_fqdn"></v-text-field>
                </v-col>

                <v-col cols="6">
                    <v-select
                      v-model="project_type"
                      :items="project_type_list"
                      item-text="text"
                      item-value="value"
                      label="Project Type"
                      :rules="[!!project_type_list || 'Project type is required']"
                      required
                    ></v-select>
                </v-col>

                <v-col cols="6">
                    <v-autocomplete
                        v-model="project_owner"
                        :items="allProjectOwners"
                        :loading="loading"
                        persistent-hint
                        label="Project Owner"
                        item-text="owner_name"
                        item-value="owner_name"
                        clearable
                        :rules="[!!project_owner || 'Project owner is required']"
                    >
                        <template v-slot:item="{ item }">
                            <v-avatar color="blue darken-4"
                            class="text-h5 font-weight-light white--text ma-1">
                               {{ item.owner_name.charAt(0)}}
                            </v-avatar>
                            <v-list-item-content>
                            <v-list-item-title v-text="item.owner_name"></v-list-item-title>
                            </v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-col>

                <v-col cols="6">
                    <v-text-field label="Processing Time"  v-model="project_processing_time" type="number"></v-text-field>
                </v-col>

                <!-- <v-switch v-model="project_jarvis_integrated" label="Integrate to Jarvis"></v-switch>
                <v-col
                    cols="12"
                    sm="12"
                    v-show="project_jarvis_integrated"
                >
                    <v-textarea
                        rows="1"
                        dense
                        row-height="10"
                        clearable
                        v-model="project_jarvis_form_data"
                    ></v-textarea>
                </v-col> -->

                
            </v-row>
                
            <!-- HIDDEN FIELDS -->
            <v-text-field v-show="false" label="Logs Integrated" v-model="project_logs_integrated"></v-text-field>
            <v-text-field v-show="false" label="Integration Date" v-model="project_integration_date"></v-text-field>

            <v-card-actions class="justify-center">
                <v-btn 
                  id="update"
                  class="menu-icon-button rounded-0 white--text text-capitalize elevation-1 pa-6" 
                  width="150" 
                  type="submit"
                  :disabled="dialog"
                  :loading="dialog"
                >
                      <v-icon class="mr-2">mdi-pencil</v-icon>
                    Update
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
            </v-card-actions>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script>
import AutomationAccessGroupAdd from './dialogs/_Access-Group-Add'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Automation-Edit',
  data: function() {
        return {
            name: this.$route.params.project_name,
            project_name: '',
            project_owner_list:[],
            logs: '',
            time: '',
            project_access_group_id: 0,
            integrated: '',
            jarvis_data: '',
            overlay: false,
            dialog: false,
            showjarvistext:false,
            fqdn: '',
            description: '',
            integration_date: '',

            // initialization
            project_processing_time: '',
            project_jarvis_integrated: false,
            project_jarvis_form_data:'',
            project_logs_integrated: '',
            project_integration_date: '',
            project_key: '',
            project_description: '',
            project_fqdn: '',
            project_type: '',
            project_owner: '',
            dependencies: [],
            type: '',
            group_id: '',
            valid: true,
            loading: false,
            snackbar:false,
            snackbar_text: "Data updated successfully!",
            timeout: -1,
            loaderSize: 0,
            loaderWidth: 0,
            jarvis_integrated: '',
            jarvis_text: '',
            project_type_list: [
                {
                    text: 'Web Service',
                    value: 'webservice'
                },
                {
                    text: 'Log View',
                    value: 'logview'
                },
                {
                    text: 'Cron Job',
                    value: 'cronjob'
                },
            ],

            rules: {
                ProjectNameExists: value => {
                    let list = this.$store.state.Automation.automationlist
                    let filterArray = list.map( el => el.project_name ).some( i => i == value)
                    return !filterArray || 'Project name already exists'
                },
                ProjectKeyExists: value => {
                    let list = this.$store.state.Automation.automationlist
                    let filterArray = list.map( el => el.project_key ).some( i => i == value )
                    return !filterArray || 'Project key already exists'
                },
                FQDNCheck: value => {
                    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

                    return !!pattern.test(value) || 'Invalid URL';
                },
          }
        }
  },
  components:{
    AutomationAccessGroupAdd,
  },
  computed: {
        details: {
            get: function() {
                let name = this.name
                let details = this.$store.state.Automation.automationlist.find( (e) => {
                    return e.project_name == name
                } )
                return details
            }
        },
        ...mapGetters(['allAccessGroupList','allProjectOwners'])
    },
    mounted() {
        this.project_name               = this.details.project_name
        this.project_owner              = this.details.project_owner
        this.project_logs_integrated    = this.details.project_logs_integrated
        this.project_processing_time    = this.details.project_processing_time
        this.project_jarvis_integrated  = (this.details.project_jarvis_integrated == "Yes" ? true : false)
        this.project_jarvis_form_data   = (this.details.project_jarvis_integrated == "Yes" ? JSON.stringify(this.details.project_jarvis_form_data): "")
        this.project_fqdn               = this.details.project_fqdn
        this.project_description        = this.details.project_description
        this.project_integration_date   = this.details.project_integration_date
        this.project_key                = this.details.project_key
        this.project_type               = this.details.project_type

        this.loading = true
        if(this.allAccessGroupList && this.allAccessGroupList.length > 0){
          this.loading = false
          this.project_access_group_id = this.allAccessGroupList.find( e => e.access_group_id == this.details.project_access_group_id ) 
          this.project_access_group_id = this.project_access_group_id          
          return
        }
        
        this.fetchAccessGroup().then(()=>{
            this.loading = false
            this.project_access_group_id = this.allAccessGroupList.find( e => e.access_group_id == this.details.project_access_group_id ) 
            this.project_access_group_id = this.project_access_group_id
        })

        // project owners
        if(this.allProjectOwners && this.allProjectOwners.length > 0){
          this.loading = false
          // this.project_owner = this.allProjectOwners.find( e => e.access_group_id == this.details.project_owner ) 
          // this.project_owner = this.project_owner          
          return
        }
        
        this.fetchServiceOwnerLists().then(()=>{
            this.loading = false
            // this.project_owner = this.allProjectOwners.find( e => e.access_group_id == this.details.project_owner ) 
            // this.project_owner = this.project_owner
        })
    },
    methods: {
        ...mapActions(['updateAutomation','fetchAccessGroup','fetchServiceOwnerLists']),
        submitForm() {
            this.dialog  = true
            this.overlay = true
            if ( this.project_jarvis_integrated ) {
              if ( this.project_jarvis_form_data == "" || this.project_jarvis_form_data == "{}" ) {
                this.valid = false
                this.dialog  = false
                this.overlay = false
                return false
              }
            }

            // API DATA
            const formData = {
                project_name:               this.project_name,
                project_owner:              this.project_owner,
                project_logs_integrated:    this.project_logs_integrated,
                project_processing_time:    this.project_processing_time,
                project_access_group_id:    this.project_access_group_id.access_group_id,
                project_access_group_name:  this.project_access_group_id.access_group_name,
                project_jarvis_integrated:  (this.project_jarvis_integrated ? 'Yes':'No'),
                project_jarvis_form_data:   (this.project_jarvis_form_data != "" ? JSON.parse(this.project_jarvis_form_data) : "" ),
                project_fqdn:               this.project_fqdn,
                project_description:        this.project_description,
                project_integration_date:   new Date().toISOString().slice(0, 10),
                project_key:                this.project_key,
                project_type:               this.project_type,
            }


            const obj = {
              ...formData,
              'project_access_group_id': this.allAccessGroupList.find( e => e.access_group_id == this.project_access_group_id ),
            }

            const dataToPass = {
              formData: formData,
              stateData: obj
            }

            // Submit Data to Store
            this.updateAutomation(dataToPass).then(()=>{
              this.overlay  = false
              this.dialog   = false
              this.snackbar = true
              this.timeout  = 3000
                
                setTimeout(() => {
                  this.$router.push({name:"Automation-List"})
                }, 2000);

            })

        },
        setAccessGroup(data){
            this.project_access_group_id = data.access_project_group_id
        }
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