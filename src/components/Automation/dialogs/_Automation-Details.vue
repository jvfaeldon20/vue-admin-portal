<template>
  <div>
      <v-dialog
        v-model="dialog"
        max-width="800"
        color="#1976d2"
        rounded
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text class="pl-0 pr-0" rounded color="light-blue"
            v-bind="attrs"
            v-on="on"
          >
          More Details
          </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card class="rounded-0">
            <v-toolbar
              color="primary"
              dark
              class="pl-5 text-h5 elevation-0 font-weight-light"
            ><v-icon class="text-h5 pr-2">mdi-alert-circle</v-icon>
          Automation Details</v-toolbar>
            <v-card-text>
                <v-row class="mt-5">
                    <v-col cols="6">
                        <p>Name: <span class="light-blue--text"> {{ project_name }} </span></p>
                        <p>Owner: <span class="light-blue--text"> {{ project_owner }} </span></p>
                        <p>Access Group: <span class="light-blue--text"> {{ project_access_group_name }} </span></p>
                        <p>Type: <span class="light-blue--text"> {{ project_type }} </span></p>
                        <p>Description: <span class="light-blue--text"> {{ project_description }} </span></p>
                    </v-col>
                    <v-col cols="6">
                        <p>Processing Time: <span class="light-blue--text"> {{ project_processing_time }} </span></p>
                        <p>Jarvis Integrated: <span class="light-blue--text"> {{ project_jarvis_integrated }} </span></p>
                        <p>Integration Date: <span class="light-blue--text"> {{ project_integration_date }} </span></p>
                        <p>FQDN: <span class="light-blue--text"> {{ project_fqdn }} </span></p>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Automation-Details",
  data(){
    return{
      dialog:false
    }
  },
  props: [
    'project_name',
    'project_owner',
    'project_access_group_name',
    'project_type',
    'project_description',
    'project_processing_time',
    'project_jarvis_integrated',
    'project_integration_date',
    'project_fqdn'
  ]
}
</script>

<style>

</style>