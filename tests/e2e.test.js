const request = require('supertest')
const app = require('../index')
const User = require('../models/User')
const { hashString } = require('../util/hash')

describe('Group Chat API Tests', () => {
  let server = app
  let user

  // write before all of jest
  beforeAll(async (done) => {
    user = await User.create({ username: 'testUser', password: hashString('testPassword'), isAdmin: true })
    done()
  })

  it('should create a user', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

    const response = await request(server)
      .post('/admin/createUser')
      .set('Authorization', authResponse.body.token)
      .send({ username: 'testuser2', password: 'testpassword2', isAdmin: false })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.username).toBe('testuser2')
  })

  it('should edit a user', async () => {
    const createUserResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser2', password: 'testpassword2' })

    const userId = createUserResponse.body._id

    const response = await request(server)
      .put(`/admin/editUser/${userId}`)
      .set('Authorization', authResponse.body.token)
      .send({ username: 'editeduser', password: 'editedpassword', isAdmin: false })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.username).toBe('editeduser')
    expect(response.body.isAdmin).toBe(false)
  })

  it('should search a user', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'editeduser', password: 'editedpassword' })

    const searchUserResponse = await request(server)
      .post('/admin/searchUser')
      .set('Authorization', authResponse.body.token)
      .send({ username: 'editeduser' })

    expect(searchUserResponse.status).toBe(200)
    expect(searchUserResponse.body).toHaveProperty('_id')
    expect(searchUserResponse.body.username).toBe('editeduser')
    expect(searchUserResponse.body.isAdmin).toBe(true)
  })

  it('should authenticate and get a token', async () => {
    const response = await request(server).post('/auth/login').send({ username: 'testuser', password: 'testpassword' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should create a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const response = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', authResponse.body.token)
      .send({ name: 'testgroup' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe('testgroup')
  })

  it('should delete a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', authResponse.body.token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const response = await request(server).delete(`/groups/deleteGroup/${groupId}`).set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe('testgroup')
  })

  it('should search for a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const response = await request(server)
      .get('/groups/searchGroup/testgroup')
      .set('Authorization', authResponse.body.token)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0].name).toBe('testgroup')
  })

  it('should add a member to a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', authResponse.body.token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const createUserResponse = await request(server)
      .post('/admin/createUser')
      .set('Authorization', token)
      .send({ username: 'newuser', password: 'newpassword', isAdmin: false })

    const userId = createUserResponse.body._id

    const response = await request(server)
      .post(`/groups/addMember/${groupId}/${userId}`)
      .set('Authorization', authResponse.body.token)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe('testgroup')
    expect(response.body.members).toContain(userId)
  })

  it('should send a message to a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const token = authResponse.body.token

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const response = await request(server)
      .post(`/messages/sendMessage/${groupId}`)
      .set('Authorization', token)
      .send({ content: 'test message' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.content).toBe('test message')
  })

  it('should like a message', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpassword' })

    const token = authResponse.body.token

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const sendMessageResponse = await request(server)
      .post(`/messages/sendMessage/${groupId}`)
      .set('Authorization', token)
      .send({ content: 'test message' })

    const messageId = sendMessageResponse.body._id

    const response = await request(server).put(`/messages/likeMessage/${messageId}`).set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.likes).toBe(1)
  })
})
