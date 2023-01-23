<template>
  <div>
    <v-list-item @click.stop="dialog=true">
      <v-list-item-title>Delete Service</v-list-item-title>
    </v-list-item>
    <v-dialog
      v-model="dialog"
      max-width="500"
      persistent
    >
      <v-card class="pb-3">
        <v-toolbar
          color="primary"
          dark
          class="pl-5 text-h5 elevation-0 font-weight-light"
          ><v-icon class="text-h5 pr-2">mdi-alert-octagon</v-icon>
          Delete Automation Service
        </v-toolbar>
        <v-alert
          dense
          text
          type="error"
          v-model="showDeleteError"
        >
          {{ this.deleteMessage}}
        </v-alert>
        <v-alert
          dense
          text
          type="success"
          v-model="showDeleteSuccess"
        >
          {{ this.deleteMessage}}
        </v-alert>
        <v-card-text align="center" class="pa-5 text-h6" v-show="showDeleteOption">
          Are you sure you want to delete <span class="red--text">{{project_name}}</span>? 
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              v-show="showDeleteOption" 
              color="red darken-2"
              class="white--text rounded-0 pa-5" 
              width="150" 
              :disabled="deleteprogressdialog"
              :loading="deleteprogressdialog"
              @click="deleteProject"
          >
              Delete
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="closeDialog"
            class="rounded-0 pa-5"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: "Automation-Details",
  props: ["project_key","project_name"],
  data(){
    return{
      dialog: false,
      deleteprogressdialog: false,
      projects: [],
      showDeleteError:false,
      deleteMessage: "",
      showDeleteOption: true,
      showDeleteSuccess:false
    }
  },
  methods:{
    ...mapActions(["deleteAutomation"]),
    closeDialog(){
        this.dialog = false
        this.deleteMessage = ""
        this.showDeleteError = false
        this.showDeleteOption = true
        this.showDeleteSuccess = false
    },
    deleteProject(){
      this.showDeleteError = false
      this.deleteMessage = ""
      this.showDeleteOption = true
      this.deleteprogressdialog = true
      // move initial response validation to state before client alert validation to DOM 
      this.deleteAutomation(this.project_key).then((response)=> {
        if(response.status == 200){
          this.showDeleteError = false
          this.deleteMessage = `${this.project_name} has been successfully deleted in the record. Thank you!`
          this.showDeleteOption = false
          this.deleteprogressdialog = false
          this.showDeleteSuccess = true
        }else if(response.status == 500){
          this.showDeleteError = true
          this.deleteMessage = "Sorry! You cannot DELETE at the moment. Please try again later or contact the GIS Automation Team for assistance. Thank you."
          this.showDeleteOption = false
          this.deleteprogressdialog = false
          this.showDeleteSuccess = false
        }else{
          this.showDeleteError = true
          this.deleteMessage = "Sorry! You are NOT PERMITTED to delete this service. Thank you!"
          this.showDeleteOption = false
          this.deleteprogressdialog = false
          this.showDeleteSuccess = false
        }
        console.clear();
      })
    }
  }
}
</script>