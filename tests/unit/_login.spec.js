import Login     from "../../src/Login.vue"
import mockAxios from "axios"
import functions from "./store"
import { shallowMount } from '@vue/test-utils'

mockAxios.get.mockImplementationOnce(() => Promise.resolve({}))
const wrapper = shallowMount(Login)

describe('Before login component loads...', () => {
  test('Login data function should exists', () => {

    // expect(wrapper.find('[v-model="username"]').exists())
    // expect(wrapper.find('[v-model="password"]').exists())
    // expect(wrapper.find('#t-btn-login').exists())
    expect(typeof Login.data).toBe('function')
  })
})
  
describe('When login form is filled up and button is clicked, access permission validation will start', () => {
  test('If logging user has no admin permission, response should not be authorized', async () => {
    const response = await functions.InvalidUser({
      "user_name":"userx"
    })

    expect(response.status).toBe(401)
    expect(response).toMatchObject({admin_access:false})
    // error alert messages should be true
    expect(mockAxios.get).toHaveBeenCalledTimes(1)
    expect(mockAxios.get).toHaveBeenCalledWith(`/check_admin_access`,response.data)
  })

  test('If logging user has admin permission, access permission should be true', async () => {
    const response = await functions.AuthorizedUser({ 
      user_name:"jonelf" 
    })

    expect(response.status).toBe(200)
    expect(response).toMatchObject({admin_access:true})
    expect(mockAxios.get).toHaveBeenCalledTimes(2)
    expect(mockAxios.get).toHaveBeenCalledWith(`/check_admin_access`,response.data)
  })
})

describe('After successful access permission validation, validation process will continue for credential checking', () => {
  test('If logging user has entered a wrong password, request should return an unauthorized response', async () => {
    const response = await functions.InvalidCredential({
      username: "jonelf",
      password: "abc123"
    })
    
    expect(response.status).toBe(401)
    expect(response.message).toMatch("Unauthorized")
    // error alert messages = true
    expect(mockAxios.get).toHaveBeenCalledTimes(3)
    expect(mockAxios.get).toHaveBeenCalledWith(`/login`,response.data)
  })

  test('If logging user entered a valid credentials, request should return a successful response', async () => {
    const response = await functions.ValidCredential({
      username: "jonelf",
      password: "12345"
    })

    expect(response.status).toBe(200)
    expect(response.message).toMatch("success")
    // expect duo dialog = true
    expect(mockAxios.get).toHaveBeenCalledTimes(4)
    expect(mockAxios.get).toHaveBeenCalledWith(`/login`,response.data)
  })
})

describe('After successful authentication and performing a duo authentication method, process will continue with duo validation', () => {
  test('When user has declined duo notification, response should return an unauthorized user and a 401 header status', async () => {
    const response = await functions.DeclinedDuoNotification({
      username: "jonelf",
      password: "12345",
      passcode: "159090",
    })

    expect(response.status).toBe(401)
    expect(response.message).toMatch("Unauthorized")
    // error alert messages = true
    expect(mockAxios.get).toHaveBeenCalledTimes(5)
    expect(mockAxios.get).toHaveBeenCalledWith(`/login_duo`, response.data)
  })

  test('When user has approved duo notification and validated as authorized user, request should return a successful response', async () => {
    const response = await functions.ApprovedDuoNotification({
      username: "jonelf",
      password: "12345",
      passcode: "458281",
    })

    expect(response.status).toBe(200)
    expect(response.message).toMatch("Login successful")
    expect(mockAxios.get).toHaveBeenCalledTimes(6)
    expect(mockAxios.get).toHaveBeenCalledWith(`/login_duo`, response.data)
  })
})

describe('After series of validation process, session handling will takes place', () => {
  test('Valid session will return the user identity and a 200 header response', async () => {
    const response = await functions.ValidSessionData()
    expect(response.status).toBe(200)
    expect(response.user_session).toEqual("jonelf")
    // check if cookies session are set and not empty
    expect(mockAxios.get).toHaveBeenCalledTimes(7)
    expect(mockAxios.get).toHaveBeenCalledWith("/get_user_session")
  })
})
