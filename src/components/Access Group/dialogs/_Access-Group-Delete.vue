<template>
  <v-row justify="center">
    <v-btn
      absolute
      color="red darken-2"
      class="white--text"
      fab
      right
      top
      @click.stop="dialog = true"
    >
      <v-icon class="text-h4">mdi-delete</v-icon>
    </v-btn>
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
          Delete Access Group
        </v-toolbar>
        <v-alert
          dense
          text
          type="error"
          v-model="showDeleteError"
          timeout="3000"
        >
          Deletion is <strong> Not Allowed </strong> . This Access Group is still dependent in a Automation Service.
        </v-alert>
        <v-card-text align="center" class="pa-5 text-h6" v-show="showDeleteOption">
          Are you sure you want to delete <span class="red--text">{{access_group_name}}</span>? 
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
              @click="deleteGroup"
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
  </v-row>
</template>
<script>
import { mapActions } from 'vuex'
  export default {
    props: ['id','access_group_name'],
    data () {
      return {
        dialog: false,
        deleteprogressdialog: false,
        projects: [],
        showDeleteError:false,
        showDeleteOption: true,
      }
    },
    methods:{
      ...mapActions(['deleteAccessGroup','fetchAccessGroupDList']),
      deleteGroup(){
        this.deleteprogressdialog = true
        this.showDeleteError = false

        this.fetchAccessGroupDList(this.id).then(() => {
          const list = this.$store.state.AccessGroup.distrolist
          this.projects          = list.project_list

          if(this.projects.length > 0){
            this.deleteprogressdialog = false
              this.showDeleteError = true
              this.showDeleteOption = false

          }else{
              this.showDeleteError = false
              this.deleteprogressdialog = true
              this.showDeleteOption = true
              let access_group_id = {'access_group_id': this.id}
              this.deleteAccessGroup(access_group_id).then((response) => {
                this.deleteprogressdialog = false
                
                this.$router.push({name: 'Access-Group-List'})
              })
          }
        })
       
      },
      closeDialog(){
        this.dialog = false
        this.showDeleteError = false
        this.showDeleteOption = true
      },
    }
  }
</script>
<style scoped>
.menu-icon-button {
  background-color: #6fbd35 !important;
}
</style>