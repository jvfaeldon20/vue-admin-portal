import axios from "axios"
const functions = {
    // LOGIN
    async InvalidUser(data){
        const response = await axios.get(`/check_admin_access`,data)

        response.status = 401
        response.admin_access = false
        response.data = data
        return response
    },
    
    async AuthorizedUser(data){
        const response = await axios.get(`/check_admin_access`,data)

        response.status = 200
        response.admin_access = true
        response.data = data
        return response
    },

    async InvalidCredential(data){
        const response = await axios.get(`/login`,data)

        response.status = 401
        response.message = "Unauthorized user"
        response.data = data
        return response
    },

    async ValidCredential(data){
        const response = await axios.get(`/login`,data)

        response.status = 200
        response.message = "Login successful"
        response.data = data
        return response
    },

    async DeclinedDuoNotification(data){
        const response = await axios.get(`/login_duo`,data)

        response.status = 401
        response.message = "Unauthorized user"
        response.data = data
        return response
    },

    async ApprovedDuoNotification(data){
        const response = await axios.get(`/login_duo`,data)

        response.status = 200
        response.message = "Login successful"
        response.data = data
        return response
    },

    async ValidSessionData(){
        const response = await axios.get(`/get_user_session`)

        response.status = 200
        response.user_session = "jonelf"
        return response
    },

    async LogoutUser(){
        const response = await axios.get(`/logout`)

        response.status = 200
        response.message = "Logout successful"
        return response
    },

    // AUTOMATIONS
    async ProjectLists(){
        const response = await axios.get(`/projects`)

        response.status = 200
        response[0] = {
                    "project_name": "Blackhole Automation",
                    "project_owner": "Janno Ramos (IS-PH)",
                    "project_type": "cronjob",
                    "project_logs_integrated": "No",
                    "project_processing_time": "60",
                    "project_access_group_id": "12",
                    "project_access_group_name": "Network Access Group",
                    "project_jarvis_integrated": "No",
                    "project_jarvis_form_data": {},
                    "project_fqdn": "",
                    "project_description": "Automates request to blackhole IP addresses",
                    "project_integration_date": "2021-11-05",
                    "project_key": "blackhole_automation"
        }
        return response
    },

    async editProject(){

    },

    async UpdatedAutomation(data){

        let projectKey = data.project_key
        const response = await axios.get(`/update_project/${projectKey}`,data)
        response.status = 200
        response.message = "Project info updated"
        response.data = data
        return response
    },

    async NewServiceToken(data){
        const projectKey = data.project_key
        const response = await axios.get(`/token?project_key=${projectKey}`)

        response.status = 200
        response.token = null
        response.project_name = "Test Project"
        response.data = data
        return response
    },

    async TokenedService(data){
        const response = await axios.get(`/generate_token`,data.project_key)

        response.status = 200
        response.token = "Nu14O7UjPSNwhZSXfdvHh0vApr8"
        response.project_name = "Test Project"
        response.data = data
        return response
    },

    async NewServiceFormObjects(data){
        const response = await axios.get(`/list_create_form`,data)

        response.status = 200
        response.result = []
        response.jarvis_form_labels = []
        response.data = data
        return response
    },

    async GetServiceFormObjects(data){
        const response = await axios.get(`/list_create_form`,data.project_key)

        response.status= 200
        const result = [{"form_object_type": "Textbox",
                       "form_object_label": "test",
                       "form_object_project_id": "167",
                       "form_object_description": "",
                       "form_choices_num": "0",
                       "form_object_ad_fetch": "Yes",
                       "form_object_choices_list": [],
                       "form_object_id": "263",
                      },
                      {
                        "form_object_type": "Radio",
                        "form_object_label": "test-radio",
                        "form_object_project_id": "167",
                        "form_object_description": "",
                        "form_choices_num": "3",
                        "form_object_ad_fetch": "Yes",
                        "form_object_choices_list": [
                            {
                                "form_object_choice_id": 606,
                                "form_object_choice_text": "Yes",
                                "form_object_id": 264
                            },
                            {
                                "form_object_choice_id": 607,
                                "form_object_choice_text": "No",
                                "form_object_id": 264
                            },
                            {
                                "form_object_choice_id": 608,
                                "form_object_choice_text": "maybe",
                                "form_object_id": 264
                            }
                        ],
                        "form_object_id": "264"
                    }]
        response.result = result
        response.jarvis_form_labels = []
        response.data = data
        return response
    },

    async UpdateFormObjects(data){
        const response = await axios.get(`/create_form_objects`,data)

        response.status = 200
        response.data = {
            "main_insert_result": {
                "message": "Success",
                "id": "291"
            },
            "choice_insert_result": {
                "message": "Success",
                "id": "None"
            }
        }
        response.payload = data
        return response
    },

    async LogTriggerHistory(data){
        const response  = await axios.get(`/dashboard_logs`,data)

        response.status = 200
        response.message = "Logged to Dashboard Logs"
        response.data = data
        return response
    },

    // DASHBOARD
    async fetchServiceUsageData(){
        const response = await axios.get(`/usage_collection_chart`)

        response.status = 200
        let logData = [
              {
                "id": 2738,
                "username": "jonelf",
                "message": "LOG SEARCH || Transit Gateway ACL - Request",
                "timestamp": "2022-01-04 14:01:15",
                "category": "log search"
              },
              {
                "id": 2716,
                "username": "tedjeromeh",
                "message": "WEBSERVICE || SERVICE: GSD Monitoring Portal",
                "timestamp": "2022-01-03 10:33:31",
                "category": "manual trigger"
              },
              {
                "id": 2715,
                "username": "tedjeromeh",
                "message": "WEBSERVICE || SERVICE: GSD Monitoring Portal",
                "timestamp": "2022-01-03 10:33:30",
                "category": "manual trigger"
              }
            ]
            
        let usageCount = [
              {
                "username": "jonelf",
                "category": [
                  {
                    "name": "log search",
                    "total": 2
                  }
                ]
              },
              {
                "username": "tedjeromeh",
                "category": [
                  {
                    "name": "log search",
                    "total": 8
                  },
                  {
                    "name": "manual trigger",
                    "total": 12
                  }
                ]
              }
            ]
            
        let dataLegend = [
              {
                "total": 10,
                "category": "log search"
              },
              {
                "total": 15,
                "category": "manual trigger"
              }
            ]

        response.logs = logData 
        response.user_usage_count = usageCount
        response.legends = dataLegend
        return response
    },

    async fetchServiceListChart(){
        const response = await axios.get(`/chart_data`)

        response.status = 200
        let graph = [
                        {
                            "month": "January",
                            "result": [
                                {
                                "total": 3,
                                "category": "cron job"
                                },
                                {
                                "total": 63,
                                "category": "log search"
                                },
                                {
                                "total": 403,
                                "category": "manual trigger"
                                }
                            ]
                        },
                        {
                            "month": "February",
                            "result": []
                        },
                        {
                            "month": "March",
                            "result": [
                            {
                                "total": 1,
                                "category": "log search"
                            },
                            {
                                "total": 2,
                                "category": "manual trigger"
                            }
                            ]
                        } 
                    ]
            response.data = graph

    return response
    },

    async filterServiceUsageData(data){
        const response  = await axios.get(`/usage_collection_chart`,data)

        response.status = 200
        let logData = [
            {
              "id": 2740,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-06 16:38:39",
              "category": "log search"
            },
            {
              "id": 2741,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-06 16:38:39",
              "category": "log search"
            },
            {
              "id": 2738,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-04 14:01:15",
              "category": "log search"
            },
            {
              "id": 2739,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-04 14:01:15",
              "category": "log search"
            }
        ]
        
        let usageCount = [
            {
              "username": "jonelf",
              "category": [
                {
                  "name": "log search",
                  "total": 4
                }
              ]
            },
            {
              "username": "tedjeromeh",
              "category": [
                {
                  "name": "log search",
                  "total": 8
                },
                {
                  "name": "manual trigger",
                  "total": 12
                }
              ]
            },
            {
              "username": "daveb",
              "category": [
                {
                  "name": "manual trigger",
                  "total": 3
                }
              ]
            }
        ]

        let dataLegend = [
            {
              "total": 12,
              "category": "log search"
            },
            {
              "total": 15,
              "category": "manual trigger"
            }
        ]

        response.logs = logData
        response.user_usage_count = usageCount
        response.legends = dataLegend
        response.payload = data
        return response
    },

    async fetchUserListData(){
        const response = await axios.get(`/usage_collection_chart`)

        response.status = 200
        let logData = [
            {
              "id": 2738,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-04 14:01:15",
              "category": "log search"
            },
        ]

        let usageCount = [
            {
              "username": "jonelf",
              "category": [
                {
                  "name": "log search",
                  "total": 2
                }
              ]
            }
        ]

        let dataLegend = [
            {
              "total": 10,
              "category": "log search"
            },
            {
              "total": 15,
              "category": "manual trigger"
            }
        ]

        response.logs = logData
        response.user_usage_count = usageCount
        response.legends = dataLegend
        return response
    },

    async filterUserUsageData(data){
        const response  = await axios.get(`/usage_collection_chart`,data)

        response.status = 200
        let logData = [
            {
              "id": 2739,
              "username": "jonelf",
              "message": "LOG SEARCH || Transit Gateway ACL - Request",
              "timestamp": "2022-01-04 14:01:15",
              "category": "log search"
            },
            {
              "id": 2716,
              "username": "tedjeromeh",
              "message": "WEBSERVICE || SERVICE: GSD Monitoring Portal",
              "timestamp": "2022-01-03 10:33:31",
              "category": "manual trigger"
            },
        ]

        let usageCount = [
            {
              "username": "jonelf",
              "category": [
                {
                  "name": "log search",
                  "total": 2
                }
              ]
            },
            {
              "username": "tedjeromeh",
              "category": [
                {
                  "name": "log search",
                  "total": 8
                },
                {
                  "name": "manual trigger",
                  "total": 12
                }
              ]
            },
        ]

        let dataLegend = [
            {
              "total": 10,
              "category": "log search"
            },
            {
              "total": 15,
              "category": "manual trigger"
            }
        ]

        response.logs = logData
        response.user_usage_count = usageCount
        response.legends = dataLegend
        response.payload = data
        return response
    },


    // ACCESS GROUPS
    async fetchAccessGroup() {
        const response = await axios.get(`/get_access_groups`)

        response.status = 200
        let data = [
            {
              "access_group_id": 4,
              "access_group_name": "GSD Access Group",
              "access_project_group_id": 0
            },  
            {
              "access_group_id": 10,
              "access_group_name": "Systems Access Group",
              "access_project_group_id": 0
            },
            {
              "access_group_id": 11,
              "access_group_name": "Communications Team Access Group",
              "access_project_group_id": 0
        }]
        response.data = data
        return response
    },

    async addAccessGroup(data) {
        const response = await axios.get(`/add_new_access_group`,data)

        response.status = 200
        response.insert_access_group_result = {
            "message": "Success",
            "id": "136"
        }
        
        response.insert_dl_result = {
            "message": "Success",
            "id": "308"
        }

        response.payload = data
        return response
    },

    async fetchAccessGroupDetails(data) {
        let response = await axios.get(`/get_access_group?key=${data}`)
        response.status = 200
        response.access_group_details = {
            "access_group_id": 118,
            "access_group_name": "GIS Automation Team",
            "access_project_group_id": 0
        }

        response.dl_list = [
            {
              "access_group_dl_id": 214,
              "access_group_dl_name": "All of Trend GIS Automation Team",
              "access_group_id": 118
            }
        ]

        response.project_list = [
            {
              "project_name": "Andrea Test",
              "project_key": "Test"
            },
            {
              "project_name": "Workday AMS Termination Automation",
              "project_key": "wdams"
            },
            {
              "project_name": "Compliance Platform",
              "project_key": "GCP_FE"
            }
        ]

        response.payload = data
        return response
    },

    async updateDistributionList(data) {
        const response = await axios.get(`/add_access_group_dl`,data)
        response.status = 200
        response.delete_access_group_dls = {
            "message": "Success",
            "id": "None"
        }

        response.insert_dl_result ={
            "message": "Success",
            "id": "303"
        }

        response.data = data
        return response
    },

    async deleteAccessGroup(data) {
        const response = await axios.get(`/delete_access_group`,data)
        
        response.status = 200
        response.delete_access_group = {
            "message": "Success",
            "id": "None"
        }

        response.delete_access_group_users = {
            "message": "Success",
            "id": "None"
        }

        response.delete_access_group_dls = {
            "message": "Success",
            "id": "None"
        }
        response.data = data
        return response
    },    

    // AUTOMATION LOGS
    async fetchSystemLogs(){
        const response = await axios.get(`/get_system_logs`)
        
        response.status = 200
        let logData = [
                            {
                                "log_sequence_id": 39226,
                                "project_name": "Transit Gateway ACL - Request",
                                "log_sequence_status": "start",
                                "log_sequence_prog_time": 0,
                                "log_sequence_start": "2021-12-29 16:15:24",
                                "log_sequence_finished": "None",
                                "log_sequence_reference_id": "acl_case_checker_2021-12-29 08:15:24",
                                "access_group_name": "Network Access Group"
                            },
                            {
                                "log_sequence_id": 39225,
                                "project_name": "Transit Gateway ACL - Request",
                                "log_sequence_status": "start",
                                "log_sequence_prog_time": 0,
                                "log_sequence_start": "2021-12-29 16:00:29",
                                "log_sequence_finished": "None",
                                "log_sequence_reference_id": "acl_case_checker_2021-12-29 08:00:29",
                                "access_group_name": "Network Access Group"
                            },
                            {
                                "log_sequence_id": 39224,
                                "project_name": "Transit Gateway ACL - Request",
                                "log_sequence_status": "start",
                                "log_sequence_prog_time": 0,
                                "log_sequence_start": "2021-12-29 15:45:24",
                                "log_sequence_finished": "None",
                                "log_sequence_reference_id": "acl_case_checker_2021-12-29 07:45:24",
                                "access_group_name": "Network Access Group"
                            }
                    ]
            response.system_logs = logData
        
        return response
    },

    async fetchSystemLogDetails(data){
        const response = await axios.get(`/get_automation_logs_details`,data)

        response.status = 200
        let logDetails = [
            {
              "log_sequence_id": "39207",
              "log_message": "Connecting to database || ref_id: acl_case_checker_2021-12-29 03:30:28 || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-29 11:30:29"
            },
            {
              "log_sequence_id": "39207",
              "log_message": "Querying pending ACL Requests || ref_id: acl_case_checker_2021-12-29 03:30:28 || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-29 11:30:29"
            },
            {
              "log_sequence_id": "39207",
              "log_message": "No pending ACL Requests found || ref_id: acl_case_checker_2021-12-29 03:30:28 || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-29 11:30:29"
            },
            {
              "log_sequence_id": "39207",
              "log_message": "Started || ref_id: acl_case_checker_2021-12-29 03:30:28 || trigger_id: 0",
              "log_status": "start",
              "log_datetime": "2021-12-29 11:30:28"
            }
        ]

        response.result = logDetails
        response.data = data
        return response
    },

    async addDashboardLog(data){
        const response = await axios.get(`/dashboard_logs`,data)

        response.status = 200
        response.data = {"message":"Logged to Dashboard Logs"}
        response.payload = data
        return response
    },

    async fetchSystemGlobalLogs(data){
        const response = await axios.get(`/select_all_automation_logs_details`,data)

        response.status = 200
        response.result = [
            {
              "log_message": "Workday Existing Update || Finished Update AD Account Job after 10.645256 || ref_id: TREND-existingacct-cronj-eb0e9679cbbf406c || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-27 13:52:43"
            },
            {
              "log_message": "Workday Existing Update || AUTOMATION STARTED | UPDATING EXISTING ACCOUNT ACTIVE DIRECTORY FROM WORKDAY || ref_id: TREND-existingacct-cronj-eb0e9679cbbf406c || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-27 13:52:04"
            },
            {
              "log_message": "Workday Existing Update || RUNNING ACCOUNT UPDATE FOR TREND ACCOUNTS || ref_id: TREND-existingacct-cronj-eb0e9679cbbf406c || trigger_id: 0",
              "log_status": "log",
              "log_datetime": "2021-12-27 13:52:04"
            },
            {
              "log_message": "Workday Existing Update || Started || ref_id: TREND-existingacct-cronj-eb0e9679cbbf406c || trigger_id: 0",
              "log_status": "start",
              "log_datetime": "2021-12-27 13:52:03"
            }
        ]
        response.payload = data
        return response
    },

    async addDashboardLogGlobal(data){
        const response = await axios.get(`/dashboard_logs`,data)

        response.status = 200
        response.data = {"message":"Logged to Dashboard Logs"}
        response.payload = data
        return response
    },

    async fetchManualLogs(){
        const response = await axios.get(`/get_request_history`)

        response.status = 200
        let manualLogData = {
            "project_names": [
              "TM Product License Key Generation Automation",
              "EAA Account Management",
              "Transit Gateway ACL - Create VPC record",
              "JSOX AD Logs",
            ],
            "trigger_requestors": [
              "marka",
              "tom_c_chen",
              "reynaldor",
              "jonelf"
            ],
            "trigger_messages": [
              "integration test",
              "Create new VPC",
              "Test",
              "check",
            ],
            "trigger_dates": [
              "2021-12-16 11:29:00",
              "2021-12-13 16:04:11",
              "2019-10-17 00:00:00",
              "2019-09-03 00:00:00"
            ],
            "access_group_name": [
              "GSD Access Group",
              "GSD Access Group",
              "MAD/GSD Access Group",
              "GSD Access Group",
            ]
        }
        response.data = manualLogData
        return response
    }
}
  
module.exports = functions