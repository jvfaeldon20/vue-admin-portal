<template>
  <div id="automation">
    <v-snackbar
      v-model="snackbar"
      :timeout="timeoutMF"
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
         <div class="rounded-0 ml-2 mr-2 pa-6">
           <div id="toolbar" class="d-flex justify-space-between ml-0 mt-0">
          <h1></h1>
          <NewFormObject v-on:addObject="addObjectToList"/>
           </div>
          <h1 class="font-weight-light form-step-title">
            Modify Form
                <v-alert
                    dense
                    text
                    type="info"
                    class="rounded-0"
                >Please check the details carefully before submission.
                </v-alert>
            </h1>
          <v-data-table
            :headers="headers"
            :items="items.result"
            :loading="loading"
            item-key="name"
            class="elevation-0"
            >
              <template v-slot:item.form_actions="{item}">
                <v-row>
                  <v-btn
                    color="blue darken-4"
                    dark
                    fab
                    text
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteItem(item.form_object_id)"
                  >
                        <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-table>
              <v-btn 
                    id="saveFormObjectChanges"
                    class="menu-icon-button pa-6 mb-6 mr-2"
                    color="white--text rounded-0 elevation-0" 
                    :disabled="dialog"
                    :loading="dialog"
                    @click="submitFormObject"
                  >
                      <v-icon class="mr-2">mdi-content-save</v-icon>
                      Save Changes
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
                            Updating Changes.. Please wait
                            <v-progress-linear
                                indeterminate
                                color="white"
                                class="mb-0"
                            ></v-progress-linear>
                            </v-card-text>
                        </v-card>
                        </v-dialog>
         </div>
       </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NewFormObject    from './dialogs/_New-Form-Object'

export default {
  name: 'Automation-Modify-Form',
  data() {
        return {
          dialogNewObjectForm: false,
          dialogEditObjectForm: false,
          dialogPortObjectForm: false,
          items: [],
          form_object_choices_list_arr: [],
          loading: false,
          headers: [
              { text: 'Type',          value: 'form_object_type' },
              { text: 'Label',         value: 'form_object_label' },
              { text: 'AD Data Fetch', value: 'form_object_ad_fetch' },
              { text: 'Choices',       value: 'form_choices_num' },
              { text: 'Action',        value: 'form_actions' },
          ],
          dialogSave: false,
          attrs: '',
          on: '',
          loaderSize: 0,
          loaderWidth: 0,
          overlay: false,
          dialog: false,
          showjarvistext:true,
          timeoutMF: -1,
          snackbar:false,
          snackbar_text: "Data updated successfully!",
        }
    },
  components:{
    NewFormObject,
  },
  computed: mapGetters(['formObjects']),
  methods: {
    ...mapActions(['getFormObjectList','addFormObject']),
    getObjectList(){
      this.getFormObjectList(this.$route.params.project_key)
    },
    addObjectToList(addItem){
      this.items.result.push(addItem)
    },
    deleteItem(id){
      let index = this.items.result.map( e => e.form_object_id ).indexOf( id )
      this.items.result.splice( index, 1 )
    },
    submitFormObject(){
      this.dialog  = true
      this.overlay = true
      const newFormObject = {
          form_object_list: this.items.result,
          project_key: this.$route.params.project_key
      }

      this.addFormObject(newFormObject).then((response)=>{
        if(response.status == 200){
            this.dialog     = false
            this.overlay    = false 
            this.snackbar   = true
            this.timeoutMF  = 3000
            setTimeout(() => {
              this.$router.push({name:"Automation-List"})
              }, 2000);
        }else{
          this.timeoutMF  = -1
        }
      })
    },
  },
  beforeMount(){
    this.loading = true
  },
  mounted(){
    this.getFormObjectList(this.$route.params.project_key).then(() => {
      this.loading = false
      this.items = this.$store.state.Automation.formObjectList
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
  background-color: #234899 !important;
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


div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}
</style>