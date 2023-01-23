<template>
  <div id="automation">
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
            <h1 class="font-weight-light mb-5">
                <span class="form-step-title">{{$route.params.access_group_name}}</span> 
                <v-alert
                    dense
                    text
                    type="info"
                    class="rounded-0"
                >Click the panel to view detailed list of Distribution List and Projects under this Access Group.
                </v-alert>
            </h1>
            <v-spacer></v-spacer>
            <v-row class="pa-3">
              <v-col cols="12">
                <template>
                  <div>
                    <v-expansion-panels
                      v-model="panel"
                      multiple
                    >
                 
                      <v-progress-linear indeterminate :hidden="hidden"></v-progress-linear>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <h2 class="font-weight-light form-step-title">
                            <v-icon class="mr-2" color="#6fbd35">mdi-chevron-right-circle-outline</v-icon>
                            Distribution List
                          </h2>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content
                          v-for="item in dl_list"
                          :key="item.access_group_dl_id"
                        >
                          <v-icon class="ml-5 mr-2" size=10>mdi-checkbox-blank-circle</v-icon>
                          {{item}}
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          <h2 class="font-weight-light form-step-title">
                            <v-icon class="mr-2" color="#6fbd35">mdi-chevron-right-circle-outline</v-icon>
                            Projects
                          </h2>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content
                          v-for="item in projects"
                          :key="item.project_key"
                        >
                        <v-spacer></v-spacer>
                          <v-icon class="ml-5 mr-2" size=10>mdi-checkbox-blank-circle</v-icon>
                          {{item.project_name}}
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                </template>
              </v-col>
            </v-row>
            <v-col cols="12">
                
            </v-col>
          </div>
        </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Access-Group-Details',
  data(){
    return{
      panel: [],
      items: 5,
      hidden:true,
      dl_list: [],
      projects: [],
    }
  },
  methods: {
    ...mapActions(['fetchAccessGroupDList']),
  },
  mounted() {
    this.hidden = false
    this.fetchAccessGroupDList(this.$route.params.key).then(() => {
      const list = this.$store.state.AccessGroup.distrolist

      // for display
      this.access_group_name = list.access_group_details.access_group_name
      this.dl_list           = list.dl_list.map( item => item.access_group_dl_name )
      this.projects          = list.project_list
      this.hidden            = true
      this.panel             = [0,1]
      if(this.projects.length > 0){
        this.panel.push(1)
      }

      if(this.dl_list.length > 0){
        this.panel.push(0)
      }

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