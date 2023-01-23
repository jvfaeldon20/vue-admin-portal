import App       from "../../src/App"
import mockAxios from "axios"
import functions from "./store"

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))

describe('App', () => {

  test('App data function should exists', () => {
    expect(typeof App.data).toBe('function')
  })

  test('Logout will expire and remove user active sessions', async () => {
    const response = await functions.LogoutUser()
    expect(response.status).toBe(200)
    expect(response.message).toEqual("Logout successful")
  })

})
