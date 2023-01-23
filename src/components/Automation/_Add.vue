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
        class="menu-icon-button pa-6 ml-2"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-list"
      >
      <v-icon class="text-h5 pr-2">mdi-application-brackets-outline</v-icon>
        Automation List
      </v-btn>
    </div>
    <div id="form-container" class="mt-9">
       <v-stepper v-model="stepper" :alt-labels="true" class="rounded-0 ml-2 mr-2 pt-6 pb-6">
            <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="stepper > 1" step="1" color="#6fbd35">Name</v-stepper-step>
            <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 2" step="2" color="#6fbd35">Details</v-stepper-step>
            <v-divider></v-divider>
                <v-stepper-step step="4" color="#6fbd35">Confirmation</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items class="justify-center">
                <v-stepper-content step="1">
                    <v-card 
                        color="gray lighten-1" 
                        class="ma-10 elevation-0"
                    >
                        <h1 class="font-weight-light form-step-title mb-5 text-center">
                            Automation Name
                        </h1>
                        <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-text-field
                            id="projectName"
                            ref="vProjectName"
                            v-model="project_name"
                            label="Project Name"
                            required
                            :rules="[rules.ProjectNameExists, rules.HasProjectName]"
                            ></v-text-field>

                            <v-select
                            id="projectType"
                            ref="vProjectType"
                            v-model="project_type"
                            :items="project_type_list"
                            item-text="text"
                            item-value="value"
                            :rules="[v => !!v || 'Item is required']"
                            label="Project Type"
                            required
                            ></v-select>
                        </v-form>
                    </v-card>
                    <v-card-actions class="justify-center">
                        <v-btn class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6"  width="150" @click="nextStepToDetails(stepper)">Next</v-btn>
                    </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card
                    class="ma-10 elevation-0"
                    color="gray lighten-1" 
                    >
                    <h1 class="font-weight-light form-step-title mb-5 text-center">
                        Automation Details
                    </h1>
                    <v-form ref="form_details">
                        <v-row>
                            <v-col cols="6">
                                <v-text-field 
                                    id="projectKey"
                                    label="Project Key" 
                                    ref="vProjectKey" 
                                    :rules="[rules.ProjectKeyExists, !!project_key || 'Project key is required' ]" 
                                    v-model="project_key" 
                                    hide-details="auto">
                                </v-text-field>
                            </v-col>
                            
                            <v-col cols="6">
                                <v-autocomplete
                                    id="projectOwner"
                                    v-model="project_owner"
                                    :items="allProjectOwners"
                                    :loading="loading"
                                    persistent-hint
                                    label="Project Owner"
                                    :rules="[!!project_owner || 'Project owner is required']"
                                    item-text="owner_name"
                                    item-value="owner_name"
                                    clearable
                                >
                                    <template v-slot:item="{ item }">
                                        <v-avatar color="blue darken-4"
                                        class="text-h5 font-weight-light white--text ma-1">
                                        {{ item.owner_name.charAt(0)}}
                                        </v-avatar>
                                        <v-list-item-content>
                                        <v-list-item-title v-text="item.owner_name"></v-list-item-title>
                                        <v-list-item-subtitle v-text="item.userowner_name"></v-list-item-subtitle>
                                        </v-list-item-content>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field id="projectDescription" label="Description" :rules="[!!project_description || 'Description is required']" v-model="project_description" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field id="projectProcessTime" label="Processing Time" v-model="project_processing_time" type="number" hide-details="auto"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-autocomplete
                                    id="projectAccessGroup"
                                    :items="allAccessGroupList"
                                    v-model="project_access_group_id"
                                    :loading="loading"
                                    item-text="access_group_name"
                                    item-value="access_group_id"
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
                                <v-text-field id="projectFqdn" label="Site FQDN" ref="vProjectFQDN" v-model="project_fqdn" hide-details="auto"></v-text-field>
                            </v-col>
                            <!-- <v-switch v-model="project_jarvis_integrated"  label="Integrate to Jarvis" @change="showjarvis()"></v-switch>
                            <v-col
                                cols="12"
                                sm="12"
                                :hidden="showjarvistext"
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
                    </v-form>
                    </v-card>
                    <v-card-actions class="justify-center">
                        <v-btn class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6" width="150" @click="previousStep(stepper)">Previous</v-btn>
                        <v-btn class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6" width="150" @click="nextStepToConfirm(stepper)">Next</v-btn>
                    </v-card-actions>
                </v-stepper-content>


                <v-stepper-content step="3">
                    <v-card
                    color="gray lighten-1" 
                    class="ma-10 elevation-0"
                    >
                        <h1 class="font-weight-light form-step-title mb-5">
                            Save Automation
                            <v-alert
                                dense
                                text
                                type="info"
                                class="rounded-0"
                            >
                                Please check the details carefully before submission.
                            </v-alert>
                        </h1>
                        
                        <v-row>
                            <v-col cols="6">
                                <p>Project Name: <span>{{project_name}}</span></p>
                                <p>Project Key: <span>{{project_key}}</span></p>
                                <p>Description: <span>{{project_description}}</span></p>
                                <p>Processing Time: <span>{{project_processing_time}}</span></p>
                                <p>Site FQDN: <span>{{project_fqdn}}</span></p>
                            </v-col>
                            <v-col cols="6">
                                <p>Project Type: <span>{{project_type}}</span></p>
                                <p>Project Owner: <span>{{project_owner}}</span></p>
                                <p>Access Group: <span>{{project_access_group_id}}</span></p>
                                <p>Jarvis Integrated: <span>{{ (project_jarvis_integrated == true?"Yes":"No") }}</span></p>
                                <p>Jarvis Text: <span>{{project_jarvis_form_data}}</span></p>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card-actions class="justify-center">
                        <v-btn class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6" width="150" @click="previousStep(stepper)">Previous</v-btn>
                        <v-btn 
                            id="submit"
                            class="menu-icon-button rounded-0 white--text text-capitalize elevation-1 pa-6" 
                            width="150" 
                            :disabled="dialog"
                            :loading="dialog"
                            @click="newAutomation"
                        >
                            Submit
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
                            Saving Data.. Please wait
                            <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0"
                            ></v-progress-linear>
                            </v-card-text>
                        </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-stepper-content>
                
            </v-stepper-items>
        </v-stepper>
    </div>
  </div>
</template>

<script>
import AutomationAccessGroupAdd from './dialogs/_Access-Group-Add'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Automation-Add',
    data() {
        return {
            stepper: 1,
            switch_integrate: false,
            project_type: '',
            snackbar:false,
            snackbar_text: "Data saved successfully!",
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
            loaderSize: 0,
            loaderWidth: 0,
            overlay: false,
            dialog: false,
            showjarvistext:true,
            loading: false,
            project_owner_list:[],
            valid: '',
            project_name: '',
            project_owner: '',
            project_key: '',
            timeout: -1,
            project_description: '',
            processing_time: 0,
            project_access_group_id: 0,
            project_fqdn: '',
            project_jarvis_integrated: '',
            project_jarvis_form_data: '',
            project_processing_time: '',
            altLabels: '',
            rules: {
                ProjectNameExists: value => {
                    let list = this.$store.state.Automation.automationlist
                    let filterArray = list.map( el => el.project_name ).some( i => i == value)
                    return !filterArray || 'Project name already exists'
                },
                HasProjectName: value => {
                    return !!value || 'Name is required' 
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
                }
            },
            snackbarFailed:false,
            timeoutFailed : -1,
            snackbar_text_failed : "Invalid. Please check your details.",
        }   
    },
    computed:{
        ...mapGetters(['allAutomationList','allAccessGroupList', 'allProjectOwners'])
    },
    mounted(){
        this.loading = true

        // project owners
        if(this.allProjectOwners && this.allProjectOwners.length > 0){
          this.loading = false
          return
        };

        this.fetchServiceOwnerLists().then((res)=>{
            this.loading = false
        });

        // access group dropdown items
        if(this.allAccessGroupList && this.allAccessGroupList.length > 0){
          this.loading = false
          return
        };

        this.fetchAccessGroup().then(()=>{
            this.loading = false
        });

        // projects
        if ( this.allAutomationList && this.allAutomationList.length > 0 ) {
            return
        };

        this.fetchAutomation()
    },
    methods: {
        ...mapActions(['fetchAccessGroup','saveAutomation', 'fetchAutomation', 'fetchServiceOwnerLists']),
        nextStepToDetails(n) {
            if(this.$refs['vProjectName'].hasError || this.$refs['vProjectType'].hasError || this.project_name == "" || this.project_type == ""){
                this.timeoutFailed = 2000
                this.$refs.form.validate()
            }else{
                this.stepper++;
            }

        },
        nextStepToConfirm(n) {
             if(this.$refs['vProjectKey'].hasError || this.project_key == "" || this.project_owner == "" || this.project_description == "" ||  this.project_access_group_id == ""){
                this.timeoutFailed = 2000
                this.$refs.form_details.validate()
            }else{
                this.stepper++;
            }
        },
        previousStep(n) {
            this.stepper--
        },
        showjarvis(){
            this.showjarvistext = !this.showjarvistext
        },
        newAutomation(){
            
            if ( !this.valid )
            {
                this.snackbarFailed = true
                return false
            }

            this.dialog  = true
            this.overlay = true
            let automation_data = {
                project_jarvis_form_data:  (this.project_jarvis_form_data != "" ? JSON.parse(this.project_jarvis_form_data) : "" ),
                project_name:              this.project_name,
                project_owner:             this.project_owner,
                project_type:              this.project_type,  
                project_logs_integrated:   "",
                project_processing_time:   this.project_processing_time,
                project_access_group_id:   this.project_access_group_id.access_group_id,
                project_access_group_name:   this.project_access_group_id.access_group_name,
                project_jarvis_integrated: (this.project_jarvis_integrated == true ? "Yes" : "No"),
                project_fqdn:              this.project_fqdn,
                project_description:       this.project_description,
                project_key:               this.project_key,
                
            }
            this.saveAutomation(automation_data).then((response)=>{
                if(response.status == 200){
                    this.dialog   = false
                    this.overlay  = false 
                    this.snackbar = true
                    this.timeout  = 3000
                        
                        setTimeout(() => {
                        this.$router.push({name:"Automation-List"})
                        }, 2000);
                }else{
                    console.log('failed')
                }
            }).catch(error => {
                console.log(error);
            })
        },
        setAccessGroup(data){
            this.project_access_group_id = data.access_project_group_id
        }
    },
    components:{
        AutomationAccessGroupAdd
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


/* form style */

.form-step-title{
    color: #234899;
}

span{
    color: #03A9F4;
}

</style>