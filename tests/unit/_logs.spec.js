import SystemLogs  from "../../src/components/Automation Log/System Trigger/_Logs"
import ManualLogs  from "../../src/components/Automation Log/Manual Trigger/_Logs"
import mockAxios   from "axios"
import functions   from "./store"

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))
describe('When automation logs is clicked...', () => {
    test('System triggered log data function should exists', () => {
      expect(typeof SystemLogs.data).toBe('function')
    })
  
    test('System logs should be fetched', async () => {
      const response = await functions.fetchSystemLogs()

      expect(response.status).toBe(200)
      expect(typeof response).toBe('object')
      expect(response.system_logs).not.toBeNull()
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(mockAxios.get).toHaveBeenCalledWith("/get_system_logs")
    })
})

describe('When view logs is clicked...', () => {
    test('Log details should be fetched using the log sequence id', async () => {
        let logSequenceTreeID = {
            log_sequence_id: "39207",
        }

        const response = await functions.fetchSystemLogDetails(logSequenceTreeID)
        
        expect(response.status).toBe(200)
        expect(typeof response).toBe('object')
        expect(response.result).not.toBeNull()
        expect(response.result[0].log_sequence_id).toContain(logSequenceTreeID.log_sequence_id)
        expect(mockAxios.get).toHaveBeenCalledTimes(2)
        expect(mockAxios.get).toHaveBeenCalledWith("/get_automation_logs_details",response.data)
    })
  
    test('A dashboard log will be created categorized as "log search"', async () => {
        let logData = {
          user_name: "jonelf",
          message: `LOG SEARCH || 5B2A1E3538E4F2ACC128273F549775B2`,
          category: "log search"
        }

        const response = await functions.addDashboardLog(logData)

        expect(response.status).toBe(200)
        expect(response.data).toMatchObject({"message":"Logged to Dashboard Logs"})
        expect(mockAxios.get).toHaveBeenCalledTimes(3)
        expect(mockAxios.get).toHaveBeenCalledWith("/dashboard_logs",response.payload)
    })
})

describe('When global log search is performed...', () => {
    test('Log details should be fetched in the whole log tree(main and sub) using the keyword entered', async () => {
          let searchKeyword = "TREND-existingacct-cronj-eb0e9679cbbf406c"
          const response = await functions.fetchSystemGlobalLogs(searchKeyword)

          expect(response.status).toBe(200)
          expect(response.result[0].log_message).toContain("TREND-existingacct-cronj-eb0e9679cbbf406c")
          expect(mockAxios.get).toHaveBeenCalledTimes(4)
          expect(mockAxios.get).toHaveBeenCalledWith("/select_all_automation_logs_details",response.payload)
    })

    test('A dashboard log will be created categorized as "log search"', async () => {
        let globalLogData = {
          user_name: "jonelf",
          message: `LOG SEARCH || TREND-existingacct-cronj-eb0e9679cbbf406c"`,
          category: "log search"
        }

        const response = await functions.addDashboardLogGlobal(globalLogData)

        expect(response.status).toBe(200)
        expect(response.data).toMatchObject({"message":"Logged to Dashboard Logs"})
        expect(mockAxios.get).toHaveBeenCalledTimes(5)
        expect(mockAxios.get).toHaveBeenCalledWith("/dashboard_logs",response.payload)
    })
})

describe('When manual logs is clicked...', () => {
    test('Manual triggered log data function should exists', () => {
        expect(typeof ManualLogs.data).toBe('function')
    })

    test('Manual logs should be fetched', async () => {
        const response = await functions.fetchManualLogs()

        expect(response.status).toBe(200)
        expect(typeof response).toBe('object')
        expect(response.data).not.toBeNull()
        expect(mockAxios.get).toHaveBeenCalledTimes(6)
        expect(mockAxios.get).toHaveBeenCalledWith("/get_request_history")
    })
})