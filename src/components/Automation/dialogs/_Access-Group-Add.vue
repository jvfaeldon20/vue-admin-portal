<template>
  <div>
      <v-dialog
        v-model="dialog"
        max-width="800"
        color="#1976d2"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="menu-icon-button pa-6 block"
            color="white--text rounded-0 elevation-0"
            left
            v-bind="attrs"
            v-on="on"
          >
          <v-icon class="text-h5 pr-2">mdi-plus</v-icon>
            Access Group
          </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-toolbar
              color="primary"
              dark
              class="pl-5 text-h5 elevation-0 font-weight-light"
            ><v-icon class="text-h5 pr-2">mdi-plus</v-icon>
          Add Access Group</v-toolbar>
          <v-stepper v-model="stepper" :alt-labels="true" class="rounded-0 pa-5" :class="elevation">
          <v-stepper-header class="elevation-0">
            <v-stepper-step :complete="stepper > 1" step="1" color="#6fbd35">Details</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="2" color="#6fbd35">Confirmation</v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="justify-center">
            <!-- access group details -->
            <v-stepper-content step="1">
              <v-card color="gray lighten-1" class="ma-5 elevation-0">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <h1 class="font-weight-light form-step-title mb-5">
                    Access Group Details
                    <v-alert
                        dense
                        text
                        type="error"
                        class="rounded-0"
                    > <strong>REMINDER</strong> Please expect 2 hours of delay for using the newly created access group for AD sync.
                    </v-alert>
                  </h1>
                  <v-text-field
                    ref="vAccessGroupName"
                    v-model="access_group_name"
                    label="Access Group Name"
                    required
                    :rules="[rules.AccessGroupExists, !!access_group_name || 'Access group name is required']"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <h1 class="font-weight-light form-step-title mt-5">
                    Properties
                  </h1>
                  <template>
                    <v-combobox
                      v-model="distributionList"
                      :items="items"
                      label="Search Distribution List"
                      prepend-inner-icon="mdi-magnify"
                      multiple
                      outlined
                      :loading="isLoading"
                      class="rounded-0"
                      clearable
                      :rules="[!!distributionList || 'Distribution list is required']"
                    >
                    </v-combobox>
                  </template>
                </v-form>
              </v-card>
              <v-card-actions class="justify-center">
                <v-btn
                  class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6"
                  width="150"
                  @click="nextStepToConfirm(stepper)"
                  >Next</v-btn
                >
              </v-card-actions>
            </v-stepper-content>

            <!-- confirmation -->
            <v-stepper-content step="2">
              <v-card color="gray lighten-1" class="ma-5 elevation-0">
                <h1 class="font-weight-light form-step-title mb-5">
                  Save Access Group
                  <v-alert dense text type="info" class="rounded-0">
                    Please check the details carefully before submission.
                  </v-alert>
                </h1>
                <v-row>
                  <v-col cols="12">
                    <p>
                      Access Group Name: <span>{{ access_group_name }}</span>
                    </p>
                  </v-col>
                  <v-col cols="12" class="pt-0 mt-0">
                    <p>Distribution Lists:</p>
                    <v-list dense>
                        <v-list-item
                            v-for="dlist in distributionList"
                            :key="dlist"
                            :value="dlist"
                            class="pa-0"
                            dense
                        >
                          <v-list-item-content class="pa-0">
                            <span>
                              <v-icon class="mr-2">mdi-circle-small</v-icon>
                              {{ dlist }}
                            </span>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                  </v-col>
                </v-row>
              </v-card>
              <v-card-actions class="justify-center">
                <v-btn
                  class="blue darken-4 rounded-0 white--text text-capitalize elevation-1 pa-6"
                  width="150"
                  @click="previousStep(stepper)"
                  >Previous</v-btn
                >
                <v-card-actions class="justify-center">
                  <v-btn 
                      class="menu-icon-button rounded-0 white--text text-capitalize elevation-1 pa-6 ml-5" 
                      width="150" 
                      @click="submitAccessGroup"
                  >
                      Submit
                  </v-btn>
              </v-card-actions>
              </v-card-actions>
            </v-stepper-content>
            <v-snackbar
              v-model="snackbarFailedToAdd"
              :timeout="timeoutFailedToAdd"
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
          </v-stepper-items>
        </v-stepper>
        </template>
      </v-dialog>
  </div>
  
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "Automation-Access-Group-Add",
  data() {
    return {
      stepper: 1,
      switch_integrate: false,
      items: [],
      distributionList: [],
      model: null,
      search: null,
      tab: null,
      access_group_name: '',
      rules: {
                EmptyAccessGroup: value => !!value || 'Required',
                AccessGroupExists: value => {
                    let list = this.$store.state.AccessGroup.accessgrouplist
                    let filterArray = list.map( el => el.access_group_name ).some( i => i == value)

                    // console.log(filterArray)

                    return !filterArray || 'Access Group name already exists'
                },
            },
      loading: false,
      snackbarFailedToAdd:false,
      timeoutFailedToAdd : -1,
      snackbar_text_failed : "Invalid. Please check your details.",
      dialog: false,
      elevation: '',
      valid: false,
      isLoading:false,
    };
  },
  computed: mapGetters(['allAccessGroupList']),
  methods: {
    ...mapActions(['addAccessGroup','fetchAccessGroupDList','fetchAccessGroup']),
    nextStepToConfirm(n) {
      if(this.$refs['vAccessGroupName'].hasError || this.access_group_name == "" || this.distributionList == '' ){
          // this.snackbarFailedToAdd = true
          this.timeoutFailedToAdd = 2000
      }else{
          this.stepper++;
      }
    },
    previousStep(n) {
      this.stepper--;
    },
    submitAccessGroup() {

      const new_automation = {
        access_group_name: this.access_group_name,
        dl_list: this.distributionList,
        access_project_group_id: 0
      }
      

      this.addAccessGroup(new_automation).then((response) => {
        if(response.status == 200){
          const newData = {
            access_group_name: this.access_group_name,
            dl_list: this.distributionList,
            access_project_group_id: response.data.insert_access_group_result.id
          }
 
          // console.log("Sending", newData);
           this.$emit('add-access-group', newData)
        }else{
            console.log('failed')
        }
      }).catch(error => {
            console.log(error);
      })
    },
    limiter(e) {
      if(e.length > 5) {
        e.pop()
      }
    },
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
  },
  mounted() {
    // this.isLoading = true
    this.items = this.$store.state.AccessGroup.distro_name
    if(this.allAccessGroupList && this.allAccessGroupList.length > 0){
      return
    }
    this.fetchAccessGroup()
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

#toolbar {
  margin: 15px 0px 0px 15px;
}

.menu-item-hover {
  background-color: #384355;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

.menu-action {
  color: #234899;
  font-size: 16px;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}



/* form style */

.form-step-title {
  color: #234899;
}

span {
  color: #03a9f4;
}
</style>