import Detail      from "../../src/components/Automation/dialogs/_Automation-Details"
import mockAxios   from "axios"
import functions   from "./store"
import { shallowMount} from '@vue/test-utils'

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))
describe('When automation menu is clicked...', () => {
  test('Automation menu lists should should be fetched', async () => {
    
    const response = await functions.ProjectLists()
    // check search field = ""
    expect(response.status).toBe(200)
    expect(response[0]).not.toBeNull()
    expect(response[0]).toMatchObject({"project_name": "Blackhole Automation"})
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith('/projects')
  })
})

describe('When automation more details is clicked...', () => {
  test('Detail dialog component should received data as props', () => {
    // triggered more detail button

    const wrapper = shallowMount(Detail, {
      propsData: {
        project_name: "Andrea Test",
        project_owner: "Andrea Wang (IS-TW)"
      }
    })

    expect(wrapper.props()).not.toBeNull()
    expect(wrapper.props().project_owner).toContain('Andrea Wang')
  })
})

describe('When service edit option is clicked...', () => {
  // test('Information under this project should be fetched', async () => {
  //   mockAxios.get.mockImplementationOnce(() => Promise.resolve([
  //   ]))
  // })

  test('After clicking the update button sending the update item, a success api response should be received', async () => {
    let updateData = {
      project_name:               "Test Project",
      project_owner:              "Jonel Faeldon (IS-PH)",
      project_logs_integrated:    0,
      project_processing_time:    1500,
      project_access_group_id:    118,
      project_access_group_name:  "GIS Automation Team",
      project_fqdn:               "http://10.5.99.123:8080/submit_trigger",
      project_description:        "descriptions",
      project_integration_date:   new Date().toISOString().slice(0, 10),
      project_key:                "test_key",
      project_type:               "cronjob",
    }

    const response = await functions.UpdatedAutomation(updateData)
    expect(response.status).toBe(200)
    expect(response.message).toContain("info updated")
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
    expect(mockAxios.get).toHaveBeenCalledWith("/update_project/test_key",response.data)
  })
})

describe('When service generate token option is clicked...', () => {
  test('If service is newly integrated,it should not return any active token', async () => {
    let project_key = {
      "project_key": "test_key"
    }

    const response = await functions.NewServiceToken(project_key)
    expect(response.status).toBe(200)
    expect(response.token).toBeNull()
    expect(response.project_name).toMatch("Test Project")
    expect(mockAxios.get).toHaveBeenCalledTimes(3)
    expect(mockAxios.get).toHaveBeenCalledWith(`/token?project_key=${response.data.project_key}`)
  })

  test('If generate button is clicked, request should return new active token passing project_key as reference', async () => {
    let project_key = {
      "project_key": "test_key"
    }

    const response = await functions.TokenedService(project_key)
    expect(response.token).not.toBeNull()
    expect(response.project_name).toMatch("Test Project")
    expect(mockAxios.get).toHaveBeenCalledTimes(4)
    expect(mockAxios.get).toHaveBeenCalledWith(`/token?project_key=${response.data.project_key}`)
  })
})

describe('When service modify form option is clicked...', () => {
  test('Newly integrated service should return empty form object lists', async () => {
    let project_key = {
      "project_id": "new_test_key"
    }

    const response = await functions.NewServiceFormObjects(project_key)
    expect(response.status).toBe(200)
    expect(typeof response).toBe('object')
    expect(response.result).toEqual([])
    expect(response.jarvis_form_labels).toEqual([])
    expect(mockAxios.get).toHaveBeenCalledTimes(5)
    expect(mockAxios.get).toHaveBeenCalledWith("/list_create_form",response.data)
  })

  test('Service with form objects displayed in manual trigger should return form object lists data', async () => {
    let project_key = {
      "project_id": "test_key"
    }

    const response = await functions.GetServiceFormObjects(project_key)
    expect(response.status).toBe(200)
    expect(typeof response).toBe('object')
    expect(response.result[0]).not.toBeNull()
    expect(response.result[0].form_object_id).not.toBe("")
    expect(response.result[0].form_object_project_id).toContain("167")
    // rendered object should exists
    expect(mockAxios.get).toHaveBeenCalledTimes(6)
    expect(mockAxios.get).toHaveBeenCalledWith("/list_create_form",response.data.project_key)
  })

  test('Form object list update is successful if updating payload will be returned with 200 status response', async () => {
    let newFormObject = {
      "form_object_list": [
          {
              "form_object_type": "Radio",
              "form_object_label": "Please select mode",
              "form_object_description": "",
              "form_object_ad_fetch": "Yes",
              "form_choices_num": 3,
              "form_object_choices_list": [
                  {
                      "form_object_choice_text": "High"
                  },
                  {
                      "form_object_choice_text": "Medium"
                  },
                  {
                      "form_object_choice_text": "Low"
                  }
              ]
          },
          {
              "form_object_type": "Textbox",
              "form_object_label": "Please specify environment",
              "form_object_description": "",
              "form_object_ad_fetch": "Yes",
              "form_choices_num": 0,
              "form_object_choices_list": []
          }
      ],
      "project_key": "test_key"
    }

    const response = await functions.UpdateFormObjects(newFormObject)
    expect(response.status).toBe(200)
    expect(response.data.main_insert_result.message).toMatch("Success")
    expect(response.data.choice_insert_result.message).toMatch("Success")
    // should reflect changes in component
    expect(mockAxios.get).toHaveBeenCalledTimes(7)
    expect(mockAxios.get).toHaveBeenCalledWith("/create_form_objects",response.payload)
  })
})

describe('When service trigger history option is clicked...', () => {
  test('All manual service triggered activities should be logged', async () => {
    const serviceName  = "Test Project"
    let requestPayload = {
      user_name: "jonelf",
      message: `API/CRONJOB || SERVICE: ${serviceName}`,
      category: "manual trigger",
    }

    const response = await functions.LogTriggerHistory(requestPayload)
    expect(response.status).toBe(200)
    expect(response.message).toMatch("Logged to Dashboard Logs")
    expect(mockAxios.get).toHaveBeenCalledTimes(8)
    expect(mockAxios.get).toHaveBeenCalledWith("/dashboard_logs",response.data)
  })
})
