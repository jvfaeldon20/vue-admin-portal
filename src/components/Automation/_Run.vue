<template>
  <v-container class="text-center" v-if="automation != null">
    <v-dialog 
      v-model="show" 
      persistent 
      :max-width="!showLogs ? 600 : ''"
      color="#1976d2"
    >
      <v-card 
        class="rounded-lg" 
        v-if="!showLogs"
      >
        <v-toolbar
          color="primary"
          dark
          class="pa-5 text-h5 elevation-0 font-weight-light"
          style="height:90px"
        >
          <span class="pb-5">
              {{ automation.project_name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="reset_form" class="ma-3">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-container class="text-right">
          <v-btn 
            class="blue darken-4 pa-6 ma-3 ml-2 block"
              color="white--text rounded-0 elevation-0"
              left
            v-on:click="showformdata = !showformdata"
            ><v-icon></v-icon>
            {{ !showformdata ? "Insert Form Data" : "Show Form Object" }}
          </v-btn>
        </v-container>
        <v-container v-if="automation.form_obj.length > 0">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-form ref="form">
                <template v-if="!showformdata">
                  <template v-for="(item, index) in automation.form_obj">
                    <template v-if="item.form_object_type == 'MultiTextbox'">
                      <v-row :key="'row-container-index-' + index" align="end">
                        <v-col cols="11" :key="'col-container-index-' + index">
                          <v-container
                            v-for="(form_item,
                            form_item_index) in setChoiceList(
                              item.form_object_choices_list
                            )"
                            :key="'container-' + form_item_index"
                            :id="'MultiTextbox-container-' + form_item_index"
                          >
                            <v-card :key="'card-' + form_item_index" outlined>
                              <v-card-title>
                                ACL Request {{ form_item_index + 1 }}
                              </v-card-title>
                              <v-card-text>
                                <v-row :key="'row-index-' + form_item_index">
                                  <template
                                    v-for="(option, index) in form_item"
                                  >
                                    <v-col
                                      :cols="6"
                                      :key="'col-index-' + index"
                                    >
                                      <v-text-field
                                        :id="
                                          'sub_text-' +
                                            item.form_object_id +
                                            '-' +
                                            form_item_index +
                                            '-' +
                                            index
                                        "
                                        :label="option.form_object_choice_text"
                                        :key="'field-' + index"
                                      ></v-text-field>
                                    </v-col>
                                  </template>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-container>
                        </v-col>
                        <v-col cols="1" :key="'col-button-index-' + index">
                          <v-container>
                            <v-btn
                              fab
                              dark
                              small
                              color="green"
                              @click="addFormFields"
                            >
                              <v-icon dark>mdi-plus</v-icon>
                            </v-btn>
                          </v-container>
                          <v-container v-if="formChoiceList.length > 1">
                            <v-btn
                              fab
                              dark
                              small
                              color="error"
                              @click="removeFormFields"
                            >
                              <v-icon dark>mdi-minus</v-icon>
                            </v-btn>
                          </v-container>
                        </v-col>
                      </v-row>
                    </template>
                    <v-text-field
                      :id="'form-object-label-type-' + item.form_object_id"
                      v-if="item.form_object_type == 'Textbox'"
                      :label="item.form_object_label"
                      :key="'Textbox-' + index"
                    ></v-text-field>
                    <v-select
                      :id="'form-object-label-type-' + item.form_object_id"
                      v-if="item.form_object_type == 'Dropdown'"
                      :items="
                        item.form_object_choices_list.map((item) => {
                          return item.form_object_choice_text;
                        })
                      "
                      :label="item.form_object_label"
                      :key="'Select-' + index"
                      :value="selected"
                      @input="selected"
                      @change="
                        setSelectedObject(
                          'form-object-label-type-' + item.form_object_id,
                          selectedValue
                        )
                      "
                    ></v-select>
                    <v-container
                      v-if="item.form_object_type == 'Checkbox'"
                      :key="'Checkbox-' + index"
                    >
                      {{ item.form_object_label }}
                      <v-checkbox
                        v-for="(option, index) in item.form_object_choices_list"
                        :id="'ad-fetch-radio-' + option.form_object_choice_id"
                        :label="option.form_object_choice_text"
                        :value="option.form_object_choice_text"
                        :key="'checkbox-option-' + index"
                      ></v-checkbox>
                    </v-container>
                    <v-radio-group
                      :id="'Radio-' + index"
                      v-if="item.form_object_type == 'Radio'"
                      column
                      :key="'Radio-Group-' + index"
                      :label="item.form_object_label"
                    >
                      <v-radio
                        v-for="(option, index) in item.form_object_choices_list"
                        :id="'ad-fetch-radio-' + option.form_object_choice_id"
                        :label="option.form_object_choice_text"
                        :value="option.form_object_choice_text"
                        :key="'radio-option-' + index"
                      ></v-radio>
                    </v-radio-group>
                    <v-menu
                      v-if="item.form_object_type == 'Datetime'"
                      :id="'Menu-' + index"
                      :close-on-content-click="false"
                      :key="'Datetime-' + index"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :label="item.form_object_label"
                          append-icon="mdi-calendar"
                          readonly
                          :value="
                            getDateObject(
                              'form-object-label-type-' + item.form_object_id
                            )
                          "
                          v-on="on"
                          :id="'form-object-label-type-' + item.form_object_id"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :id="'DatePicker-' + index"
                        v-model="chosenDate"
                        locale="en-in"
                        no-title
                        @input="
                          setDateObject(
                            'form-object-label-type-' + item.form_object_id,
                            chosenDate
                          )
                        "
                      ></v-date-picker>
                    </v-menu>
                  </template>
                </template>
                <template v-else>
                  <v-textarea
                    v-model="formdata"
                    label="Form Data"
                    :clearable="true"
                    required
                    :rules="formdataRules"
                  ></v-textarea>
                </template>
                <v-text-field
                  id="triggerReason"
                  v-model="triggerReason"
                  label="Trigger Reason"
                  required
                  :rules="triggerReasonRules"
                ></v-text-field>

                <v-container class="text-center">
                  <v-btn
                    id="submit"
                    class="menu-icon-button pa-6 ml-2 block"
                    color="white--text rounded-0 elevation-0"
                    @click="
                      validate(
                        automation.project_key,
                        automation.form_obj
                      )
                    "
                  >
                    Submit
                  </v-btn>
                </v-container>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <v-row align="center" justify="center">
            <v-col cols="10">
              <v-form ref="form">
                <template v-if="!showformdata">
                  <v-container class="text-center">
                    <v-row align="center" justify="center" v-if="!triggered">
                      <v-col cols="12">
                        <h3>No Form Objects Created</h3>
                        <h5>
                          <v-icon>mdi-rocket</v-icon>
                          <a
                            href="#"
                            v-on:click="run_nopayload(automation.project_key)"
                          >
                            Run Without Payload
                          </a>
                        </h5>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center" v-else>
                      <v-col cols="8">
                        <h3>
                          Automation Triggered.<br />
                          Please wait for changes to take effect.
                        </h3>
                      </v-col>
                    </v-row>
                  </v-container>
                </template>
                <template v-else>
                  <v-textarea
                    v-model="formdata"
                    label="Form Data"
                    :clearable="true"
                    required
                    :rules="formdataRules"
                  ></v-textarea>
                  <v-text-field
                    v-model="triggerReason"
                    label="Trigger Reason"
                    required
                    :rules="triggerReasonRules"
                  ></v-text-field>
                  <v-container class="text-center mb-5">
                    <v-btn
                      class="menu-icon-button pa-6 ml-2 block"
                      color="white--text rounded-0 elevation-0"
                      @click="
                        validate(
                          automation.project_key,
                          automation.form_obj
                        )
                      "
                    >
                      Submit
                    </v-btn>
                  </v-container>
                </template>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card class="rounded-lg" v-else>
        <v-card-title class="headline">
          <v-icon> {{ getIcon(automation.project_type) }} </v-icon>
          {{ automation.project_name }}
          <v-spacer></v-spacer>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" outlined @click="showLogs = !showLogs">
                <v-icon>mdi-arrow-left-bold</v-icon> Back
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="green" outlined>
                <v-icon>mdi-download</v-icon>
                <download-excel :data="active_logs">
                  Export CSV
                </download-excel>
              </v-btn>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn icon @click="reset_form">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-col class="d-flex justify-end">
          <v-col cols="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-col>
        <v-data-table
          :headers="headers"
          :items="active_logs"
          :search="search"
          :loading="table_loading"
          v-bind:options.sync="pagination"
          :items-per-page-options="[10, 20, 50]"
          class="rounded-0"
          light
        >
          <template v-slot:item.AutomationDetails="{ item }">
            <v-btn
              v-if="item.AutomationDetails != 'None'"
              small
              color="blue"
              outlined
              @click="getRowDetails(active_logs.indexOf(item))"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <template v-slot:no-results>
            <v-alert
              :value="true"
              :dense="true"
              color="error"
              icon="mdi-alert-circle"
              >No results found.
            </v-alert>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
    <TableDetails
      v-model="showTableDetails"
      v-bind:rowDetails="rowDetails"
    ></TableDetails>
    <LoadingModal v-model="loading" v-bind:loading="loading"></LoadingModal>
  </v-container>
</template>

<script>
import $ from "jquery"
import axios from "axios"
import { validationMixin } from "vuelidate"
import LoadingModal from "../Shared/Loading"
import TableDetails from "./_TableDetails"
import HtmlTableToJson from "html-table-to-json"
import VueSimpleAlert from "vue-simple-alert"

export default {
  props: {
    automation: Object,
    value: Boolean,
  },
  components: {
    LoadingModal,
    TableDetails,
  },
  mixins: [validationMixin],
  validations: {},
  data: () => ({
    active_logs: [],
    checkbox: null,
    chosenDate: null,
    dateObj: [],
    defaultFormChoiceList: [],
    formChoiceList: [],
    formdata: null,
    formdataRules: [(v) => !!v || "Form Data is required"],
    headers: [],
    loading: false,
    modalHeaders: [],
    modalLogs: [],
    pagination: {
      descending: false,
    },
    project_name: null,
    project_type: null,
    radio: null,
    rowDetails: null,
    search: null,
    select: null,
    selectedObj: [],
    selectedValue: [],
    showformdata: false,
    showLogs: false,
    showModal: false,
    showTableDetails: false,
    sub_table_ids: [],
    table_loading: false,
    textfield: null,
    triggered: false,
    triggerReason: null,
    triggerReasonRules: [(v) => !!v || "Trigger Reason is required"],
    valid: true,
  }),
  created: function() {
    this.$root.$refs.Run = this;
  },
  computed: {
    show: {
      get() {
        // console.log(this);
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    reset_form() {
      this.active_logs = [];
      this.checkbox = null;
      this.chosenDate = null;
      this.dateObj = [];
      this.defaultFormChoiceList = [];
      this.formChoiceList = [];
      this.formdata = null;
      this.headers = [];
      this.loading = false;
      this.modalHeaders = [];
      this.modalLogs = [];
      this.project_name = null;
      this.project_type = null;
      this.radio = null;
      this.rowDetails = null;
      this.search = null;
      this.select = null;
      this.selectedObj = [];
      this.selectedValue = [];
      this.showformdata = false;
      this.showLogs = false;
      this.showModal = false;
      this.showTableDetails = false;
      this.sub_table_ids = [];
      this.table_loading = false;
      this.textfield = null;
      this.triggered = false;
      this.triggerReason = null;
      this.valid = true;
      this.triggered_automation  = false;
      this.show = false;
    },
    selected(value) {
      this.selectedValue = value;
    },
    getDateObject(key) {
      var result = "";
      if (this.dateObj.length == 0) {
        return result;
      } else {
        // console.log(this.dateObj);
        this.dateObj.forEach((resp) => {
          if (resp.key == key) {
            result = resp.value;
          }
        });
      }
      return result;
    },
    setDateObject(key, value) {
      var obj = {
        key: key,
        value: value,
      };
      if (this.dateObj.length > 0) {
        if (this.dateObj.some((resp) => resp.key === key)) {
          this.dateObj.forEach((resp) => {
            if (resp.key == key) {
              resp.value = value;
            }
          });
        } else {
          this.dateObj.push(obj);
        }
      } else {
        this.dateObj.push(obj);
      }
      return false;
    },
    setSelectedObject(key, value) {
      var obj = {
        key: key,
        value: value,
      };
      if (this.selectedObj.length > 0) {
        if (this.selectedObj.some((resp) => resp.key === key)) {
          this.selectedObj.forEach((resp) => {
            if (resp.key == key) {
              resp.value = value;
            }
          });
        } else {
          this.selectedObj.push(obj);
        }
      } else {
        this.selectedObj.push(obj);
      }
      // console.log(this.selectedObj);
      return false;
    },
    setChoiceList(list) {
      if (this.formChoiceList.length == 0) {
        this.formChoiceList = [list];
        this.defaultFormChoiceList = list;
      }
      return this.formChoiceList;
    },
    addFormFields() {
      this.formChoiceList.push(this.defaultFormChoiceList);
    },
    removeFormFields() {
      var length = this.formChoiceList.length - 1;
      var myobj = $("#MultiTextbox-container-" + length);
      this.formChoiceList.pop();
      myobj.remove();
    },
    run_nopayload(proj_key) {
      // console.log("run_nopayload() - " + proj_key);
      this.loading = true;
      this.triggered = true;
      var form_data_text = JSON.parse("{}");
      var self = this;
      setTimeout(function() {
        var trigger_data = {
          form_value_res: form_data_text,
          proj_key: proj_key,
          trigger_type: "form_data_input",
        };

        self.submit_trigger_data(trigger_data);
      }, 10);
    },
    submit_trigger_data(trigger_data) {
      
      // for manual trigger log
      var trigger_history_result = [];
      var requestor              = this.$cookies.get("admin_user");
      var currentDate            = new Date();
      var month                  = this.add_zero_string(currentDate.getMonth() + 1);
      var day                    = this.add_zero_string(currentDate.getDate());
      var year                   = currentDate.getFullYear();
      var formatted_date         = year + "-" + month + "-" + day;

      var request_data = {
        trigger_request_message: this.triggerReason,
        trigger_requestor: requestor,
        project_key: trigger_data.proj_key,
        trigger_request_date: formatted_date,
      };

      axios.post("/insert_trigger_request", request_data).then((response) => {
        trigger_history_result = response;
        var form_trigger_item = {
          form_fields:  trigger_data.form_value_res,
          project_key:  trigger_data.proj_key,
          trigger_id:   trigger_history_result.data.result.id,
          trigger_type: trigger_data.trigger_type,
        };

        // run automation
        axios
          .post("/trigger_automation", form_trigger_item)
          .then((response) => {
            if (this.project_type == "logview") {

              // Initialize
              this.active_logs  = []
              this.headers      = []
              this.modalLogs    = []
              this.modalHeaders = []

              //convert Sub-Details Modals to JSON
              var modal        = String(response.data.modal);
              const jsonModals = HtmlTableToJson.parse(modal);


              // console.log(jsonModals);
              var temp_modalLogs = jsonModals.results;
              temp_modalLogs.map((modalLogs_item) => {
                this.modalLogs.push(modalLogs_item);
              });


              var temp_modalHeaders = jsonModals.headers;
              temp_modalHeaders.map((modalHeader_item) => {
                var temp_arr = [];
                modalHeader_item.map((item) => {
                  temp_arr.push({
                    text: item,
                    value: item,
                    align: "center",
                    class: "font-weight-black",
                  });
                });
                this.modalHeaders.push(temp_arr);
              });


              // convert HTML Table to JSON
              var table        = String(response.data.table);
              const jsonTables = HtmlTableToJson.parse(table);


              // console.log(jsonTables);
              var temp_logs = jsonTables.results;
              temp_logs.map((logs_item) => {
                logs_item.map((item,index) => {
                  this.active_logs.push(item);
                  if (item.Details == 'None') {
                    this.modalLogs.splice(index, 0, {});
                  }
                });
              });


              var temp_headers = jsonTables.headers;
              temp_headers.map((header_item) => {
                header_item.map((item) => {
                  this.headers.push({
                    text: item,
                    value: item,
                    align: "center",
                    class: "font-weight-black",
                  });
                });
              });
              this.showLogs = true;
            } else if (this.project_type == "cronjob") {
              VueSimpleAlert.fire({
                title: "Success!",
                text: "Request Form has been submitted",
                type: "success",
              });
            }
            this.triggered_automation = true;
            this.loading = false;
            this.show = false;
          });
      });
    },
    process_trigger(proj_key, form_obj) {
      this.loading = true;
      if (!this.showformdata) {
        this.create_form_object_json(proj_key, form_obj);
      } else {
        this.form_data_manual_request(proj_key);
      }
    },
    create_form_object_json(proj_key, form_obj) {
      // console.log("create_form_object_json() - " + proj_key);
      // console.log(form_obj);
      var form_value_res = [];
      if (this.triggerReason != "") {
        form_obj.map((item) => {
          var object_id = "form-object-label-type-" + item.form_object_id;
          var choice_list = [];
          var form_value = "";
          var choice_data = item.form_object_choices_list;
          if (
            item.form_object_type == "Radio" ||
            item.form_object_type == "Checkbox"
          ) {
            choice_data.map((list) => {
              if (
                $(
                  "#ad-fetch-radio-" + list.form_object_choice_id + ":checked"
                ) != null
              ) {
                choice_list.push(
                  $(
                    "#ad-fetch-radio-" + list.form_object_choice_id + ":checked"
                  ).val()
                );
              }
            });
            form_value = choice_list;
          } else if (item.form_object_type == "MultiTextbox") {
            this.formChoiceList.map((form_item_list, form_item_index) => {
              var sub_choice = [];
              form_item_list.map((list, index) => {
                var sub_text_id =
                  "sub_text-" +
                  list.form_object_id +
                  "-" +
                  form_item_index +
                  "-" +
                  index;
                var sub_text = $("#" + sub_text_id).val();
                var sub_label = list.form_object_choice_text;
                var sub_data = { label: sub_label, value: sub_text };
                sub_choice.push(sub_data);
              });
              choice_list.push(sub_choice);
            });
            form_value = choice_list;
          } else if (item.form_object_type == "Dropdown") {
            this.selectedObj.map((selectedItem) => {
              if (object_id == selectedItem.key) {
                form_value = selectedItem.value;
              }
            });
          } else {
            form_value = $("#" + object_id).val();
            // console.log(form_value);
            if (item.form_object_type == "Datetime") {
              form_value = $("#" + object_id).val() + "T00:00:00.000Z";
            }
          }
          var label = item.form_object_label;
          var ad_fetch = item.form_object_ad_fetch;
          form_value_res.push({
            label: label,
            value: form_value,
            ad_fetch_data: ad_fetch,
          });
        });
        var trigger_data = {
          form_value_res: form_value_res,
          proj_key: proj_key,
          trigger_type: "form_object_input",
        };
        //submit trigger data
        var self = this;
        setTimeout(function() {
          self.submit_trigger_data(trigger_data);
        }, 10);
        
      } else {
        alert("Please specify a reason for this automation trigger below.");
      }
      // console.log(form_value_res);
    },
    form_data_manual_request(proj_key) {
      // console.log("form_data_manual_request() -" + proj_key);
      if (this.triggerReason != "") {
        this.loading = true;
        var trigger_data = {
          form_value_res: this.formdata,
          proj_key: proj_key,
          trigger_type: "form_data_input",
        };
        var self = this;
        setTimeout(function() {
          self.submit_trigger_data(trigger_data);
          self.loading = false;
        }, 10);
      } else {
        alert("Please specify trigger reason.");
      }
    },
    add_zero_string(num) {
      num = parseInt(num);
      var str = "";
      if (num < 10) {
        str = "0" + String(num);
      } else {
        str = String(num);
      }
      return str;
    },
    getIcon(proj_type) {
      this.project_type = proj_type;
      return this.$root.$refs.Automations.selectIcon(proj_type);
    },
    showAutomationName(proj_name) {
      this.project_name = proj_name;
      return proj_name;
    },
    getRowDetails(index) {
      this.rowDetails = {
        headers: this.modalHeaders[index],
        items: this.modalLogs[index],
      };
      this.showTableDetails = true;
    },
    validate(proj_key, form_obj) {
      var valid = this.$refs.form.validate()
      // console.log(valid)
      // console.log(proj_key, form_obj)
      
      if (valid) {
        VueSimpleAlert.fire({
          title: "Do you want to submit this requests?",
          showCancelButton: true,
          confirmButtonColor: "#91d18b",
          confirmButtonText: "Submit",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          // console.log(result);
          if (result.value == true) {
            this.process_trigger(proj_key, form_obj);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.menu-icon-button {
  background-color: #6fbd35 !important;
}
</style>