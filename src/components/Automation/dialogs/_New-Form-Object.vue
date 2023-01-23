<template>
  <div>
      <v-snackbar
        id="successSave"
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
      <v-dialog v-model="dialogNewObjectForm" width="550">
          <!-- Button -->
          <template v-slot:activator="{on, attrs}">
            <v-btn
                id="addFormObject"
                class="menu-icon-button pa-6 mr-2"
                color="white--text rounded-0 elevation-0"
                dark
                v-bind="attrs"
                v-on="on"
                >
                  <v-icon class="mr-2">mdi-plus</v-icon>
                 Add Form Object
            </v-btn>
          </template>

          <v-card>
              <v-toolbar
                color="primary"
                dark
                class="pl-5 text-h5 elevation-0 font-weight-light"
                ><v-icon class="text-h5 pr-2">mdi-plus</v-icon>
                Add Form Object
              </v-toolbar>
              <v-card-text class="pa-6">
                  <v-select 
                    id="formObjectType"
                    :items="objectTypes" 
                    label="Type" 
                    v-model="form_object_type"
                    item-value="item"
                    v-on:change="changeObjectType"
                    required
                ></v-select>
                  <v-text-field id="formObjectLabel" v-model="form_object_label" label="Label" required></v-text-field>
                  <v-text-field id="formObjectDescription" v-model="form_object_description" label="Description" required></v-text-field>
                  <v-radio-group v-model="form_object_ad_fetch" row mandatory>
                      <template v-slot:label>
                          <div>AD Data Fetch</div>
                      </template>
                      <v-radio value="Yes" label="Yes">Yes</v-radio>
                      <v-radio value="No" label="No">No</v-radio>
                  </v-radio-group>
                  <div :hidden="showChoices">
                    <v-combobox
                      v-model="form_object_choices_list"
                      :items="objectChoices"
                      :search-input.sync="search"
                      hide-selected
                      label="Custom Choices"
                      multiple
                      persistent-hint
                      >
                      <template #selection="{ item }">
                          <v-chip color="blue lighten-4">{{item}}</v-chip>
                      </template>
                      <template v-slot:no-data>
                          <v-list-item>
                          <v-list-item-content>
                              <v-list-item-title>
                              No results matching "<strong class="search_text">{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                              </v-list-item-title>
                          </v-list-item-content>
                          </v-list-item>
                      </template>
                    </v-combobox>
                  </div>
              </v-card-text>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn 
                    id="saveFormObject"
                    class="menu-icon-button pa-6 mb-6 mr-2"
                    color="white--text rounded-0 elevation-0" 
                    :disabled="dialogSave"
                    :loading="dialogSave"
                    @click="addObject"
                  >
                      <v-icon class="mr-2">mdi-plus</v-icon>Add
                  </v-btn>
                  <v-dialog
                      v-model="dialogSave"
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
          </v-card>
      </v-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'NewFormObject',
    data() {
        return {
            dialogNewObjectForm: false,
            objectTypes: ['Textbox', 'Radio', 'Checkbox', 'Dropdown', 'Multi Textbox', 'Datetime Input'],
            objectChoices: ['Yes','No'],
            form_object_type: '',
            form_object_label: '',
            form_object_description: '',
            form_object_choices_list: [],
            search: null,
            form_object_ad_fetch: '',
            choice: ['Vuetify'],
            dialogSave: false,
            snackbar:false,
            snackbar_text: "Data saved successfully!",
            timeout: -1,
            showChoices:true,
        }
    },
     methods: {
       ...mapActions(['addFormObject']),
        addObject() {
            
            this.form_object_choices_list_arr = []
            for (var choice of this.form_object_choices_list){
                let objectData = {
                    form_object_choice_text: choice
                  }

                this.form_object_choices_list_arr.push(objectData)
            }

            const newFormObject = {
              form_object_type:         this.form_object_type,
              form_object_label:        this.form_object_label,
              form_object_description:  this.form_object_description,
              form_object_ad_fetch:     this.form_object_ad_fetch,
              form_choices_num:         this.form_object_choices_list_arr.length,
              form_object_choices_list: this.form_object_choices_list_arr
            }

            console.log("Object Adding!")
            // this.dialogSave = true
            // this.dialogNewObjectForm = false 
            this.$emit( "addObject", newFormObject )
            this.form_object_type         = ''
            this.form_object_label        = ''
            this.form_object_description  = ''
            this.form_object_ad_fetch     = 'Yes'
            this.form_choices_num         = ''
            this.form_object_choices_list = []
            // this.addFormObject(newFormObject)
            // .then((response)=>{
            //   if(response.status == 200){
            //      console.log("Object Added!")
            //       this.dialogNewObjectForm   = false
            //       this.snackbar = true
            //       this.timeout  = 3000
            //   }else{
            //     console.log("Object Add Failed")
            //   }
            // })
        },
        changeObjectType(){
          
          if(this.form_object_type != "Textbox" && this.form_object_type != "Datetime Input"){
            this.showChoices = false
          }else{
            this.showChoices = true
          }
        }
    },
    watch: {
      choice (val) {
        if (val.length > 5) {
          this.$nextTick(() => this.choice.pop())
        }
      },
    },
}
</script>


<style scoped>
.menu-icon-button {
  background-color: #6fbd35 !important;
}

.search_text{
    color: #0D47A1;
}
</style>