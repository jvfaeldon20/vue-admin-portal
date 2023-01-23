import AccessGroup       from '../../src/components/Access Group/_Access-Group-List'
import AccessGroupDelete from '../../src/components/Access Group/dialogs/_Access-Group-Delete'
import mockAxios         from "axios"
import functions         from "./store"
import { shallowMount} from '@vue/test-utils'

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))
describe('When access group menu is clicked...', () => {
  test('Data function should exists before the component loads', () => {
    expect(typeof AccessGroup.data).toBe('function')
  })

  test('Access group menu lists should should be fetched', async () => {
    let refID = 118
    const response = await functions.fetchAccessGroup(refID)

    expect(response.status).toBe(200)
    expect(response.data[0]).not.toBeNull()
    expect(response.data[0]).toMatchObject({
        "access_group_id": 4,
        "access_group_name": "GSD Access Group",
        "access_project_group_id": 0
    })
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith("/get_access_groups")
  })
})

describe('After saving new access group...',() => {
  test('Response should return a success response from insert access group, insert dl and a 200 status', async () => {
    let newAccessGroup = {
      "access_group_name": "new-access",
      "dl_list": [
        "All of Trend GIS Leadership Team",
        "All of Trend GIS Product Cloud Team",
        "All of Trend GIS Product Success Team"
      ],
      "access_project_group_id": 0
    }
    const response = await functions.addAccessGroup(newAccessGroup)

    expect(response.status).toBe(200)
    expect(response.insert_access_group_result.message).toBe("Success")
    expect(response.insert_dl_result.message).toBe("Success")
    // list should be updated
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
    expect(mockAxios.get).toHaveBeenCalledWith("/add_new_access_group",response.payload)
  })
})

describe('When access group view details is accessed...',() => {
  test('Information under this group name should be fetched using the access group name as the reference', async () => {
    let getID = 118
    const response = await functions.fetchAccessGroupDetails(getID)

    expect(response.status).toBe(200)
    expect(response.access_group_details).not.toBeNull()
    expect(typeof response.dl_list).toBe("object")
    // add condition to check details
    expect(response.dl_list[0]).toMatchObject({
        "access_group_dl_id": 214,
        "access_group_dl_name": "All of Trend GIS Automation Team",
        "access_group_id": 118
    })
    expect(mockAxios.get).toHaveBeenCalledTimes(3)
    expect(mockAxios.get).toHaveBeenCalledWith(`/get_access_group?key=${response.payload}`)
  })
})

describe('When access modify distribution list icon is clicked...',() => {
  test('Distribution lists under the access group item selected should be fetched', async () => {
    let dlAccessGroupID = 118
    const response = await functions.fetchAccessGroupDetails(dlAccessGroupID)

    expect(response.status).toBe(200)
    expect(typeof response.dl_list).toBe("object")
    expect(response.dl_list[0]).toMatchObject({
        "access_group_dl_id": 214,
        "access_group_dl_name": "All of Trend GIS Automation Team",
        "access_group_id": 118
    })
    expect(mockAxios.get).toHaveBeenCalledTimes(4)
    expect(mockAxios.get).toHaveBeenCalledWith(`/get_access_group?key=${response.payload}`)
  })
  
  test('After clicking the update button sending the update item, a success api response should be received', async () => {    
    let updateItem = {
        "access_group_id": 118,
        "dl_list": [
            "All of Trend GIS Automation Team",
            "All of Trend GIS Communications Team"
        ]
    }

    const response = await functions.updateDistributionList(updateItem)

    expect(response.status).toBe(200)
    expect(response.insert_dl_result.message).toBe("Success")
    expect(response.insert_dl_result.id).not.toBe({})
    expect(response.insert_dl_result.id).toEqual("303")
    // state data should be changed
    expect(mockAxios.get).toHaveBeenCalledTimes(5)
    expect(mockAxios.get).toHaveBeenCalledWith("/add_access_group_dl",response.data)
  })
})

describe('When access group delete is clicked...',() => {
  test('access group id and name will be sent as props data', () => {
    const wrapper = shallowMount(AccessGroupDelete, {
      propsData: {
        id: "118",
        access_group_name: "GIS Automation Team"
      }
    })
    
    expect(wrapper.props()).not.toBeNull()
    expect(wrapper.props().id).toBe("118")
    expect(wrapper.props().access_group_name).toBe("GIS Automation Team")
  })
  
  test('Once this access group is validated no longer dependent to any services, a 200 header and success response from delete group, group users and group dls should be received', async () => {    
    let deleteID = {
      "access_group_id": "118"
    }
    const response = await functions.deleteAccessGroup(deleteID)

    expect(response.status).toBe(200)
    expect(response.delete_access_group).toMatchObject({ message: 'Success', id: 'None' })
    expect(response.delete_access_group_users).toMatchObject({ message: 'Success', id: 'None' })
    expect(response.delete_access_group_dls).toMatchObject({ message: 'Success', id: 'None' })
    expect(response.data.access_group_id).toEqual(deleteID.access_group_id)
    expect(mockAxios.get).toHaveBeenCalledTimes(6)
    expect(mockAxios.get).toHaveBeenCalledWith("/delete_access_group",response.data)
  })
})
