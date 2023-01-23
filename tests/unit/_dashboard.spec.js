import ServiceUsage  from "../../src/components/Dashboard/Service Usage/_List"
import UserUsage     from "../../src/components/Dashboard/User Usage/_List"
import mockAxios     from "axios"
import functions     from "./store"

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))
describe("ServiceUsage", () => {
  test('Service Usage data should exists', () => {
    expect(typeof ServiceUsage.data).toBe('function')
  })

  test('Service usage list should received data for logs, user usage count and legend', async () => {
    const response = await functions.fetchServiceUsageData()

    expect(response.status).toBe(200)
    expect(typeof response).toBe('object')
    expect(response.logs[0]).not.toEqual({})
    expect(response.user_usage_count[0]).not.toEqual({})
    expect(response.legends[0]).not.toEqual({})
    // log count > 1 
    expect(mockAxios.get).toBeCalledTimes(1)
    expect(mockAxios.get).toBeCalledWith("/usage_collection_chart")
  })

  test('Service usage graph should received a month and graph data', async () => {
    const response = await functions.fetchServiceListChart()

    expect(response.status).toBe(200)
    expect(typeof response).toBe('object')
    expect(response.data).not.toEqual({})
    // list containing at least 1 chunck of array data
    expect(mockAxios.get).toBeCalledTimes(2)
    expect(mockAxios.get).toBeCalledWith("/chart_data")
  })

  test('Service Usage filtered by month count should returned filtered data based on the payload submitted', async () => {
      const filterData = {
        "month":1
      }

      const response = await functions.filterServiceUsageData(filterData)
      expect(response.status).toBe(200)
      expect(typeof response).toBe('object')
      expect(response.logs[0].timestamp).toContain("2022-01")
      expect(mockAxios.get).toBeCalledTimes(3)
      expect(mockAxios.get).toBeCalledWith("/usage_collection_chart",response.payload)
    })
})

describe("UserUsage", () => {
    test('User usage data should exists', () => {
      expect(typeof UserUsage.data).toBe('function')
    })
    
    test('User usage list should received data for logs and legends', async () => {
      const response = await functions.fetchUserListData()
      expect(typeof response).toBe('object')
      expect(response.status).toBe(200)
      expect(response).not.toEqual({})
      expect(response.logs[0]).toMatchObject({
        "id": 2738,
        "username": 'jonelf',
        "message": 'LOG SEARCH || Transit Gateway ACL - Request',
        "timestamp": '2022-01-04 14:01:15',
        "category": 'log search'
      })
      expect(mockAxios.get).toBeCalledTimes(4)
      expect(mockAxios.get).toBeCalledWith("/usage_collection_chart")
    })

    test('User Usage filtered by month count should returned filtered data based on the payload submitted', async () => {
      const filterData = {
        "month":1
      }

      const response = await functions.filterUserUsageData(filterData)
      expect(typeof response).toBe('object')
      expect(response.status).toBe(200)
      expect(response.logs[0].timestamp).toContain("2022-01")
      expect(mockAxios.get).toBeCalledTimes(5)
      expect(mockAxios.get).toBeCalledWith("/usage_collection_chart",response.payload)
    })
  })
