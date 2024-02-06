const request = require('supertest')
const server = require('../index')
const User = require('../models/User')
const { hashString } = require('../util/hash')

describe('Group Chat API Tests', () => {

  beforeAll(async () => {
    try {
      await User.deleteOne({ username: 'testUser' });

      await User.create({ username: 'testUser', password: hashString('testPassword'), isAdmin: true });

    } catch (error) {
      console.log(`Error in beforeAll: ${error}`);
      throw error; 
    } finally {
      await User.deleteOne({ username: 'testuser2262' });
      await User.deleteOne({ username: 'editeduser26' });
    }
  }, 100000);
  

  it('should create a user', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

    const response = await request(server)
      .post('/admin/createUser')
      .set('Authorization', authResponse.body.token)
      .send({ username: 'testuser2262', password: 'testpassword2', isAdmin: false })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.username).toBe('testuser2262')
  }, 100000)

  it('should edit a user', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

    const searchUserResponse = await request(server)
    .post('/admin/searchUser')
    .set('Authorization', authResponse.body.token)
    .send({ username: 'testuser2262' })

    const response = await request(server)
      .put(`/admin/editUser/${searchUserResponse.body._id}`)
      .set('Authorization', authResponse.body.token)
      .send({ username: 'editeduser26', password: 'editedpassword2', isAdmin: false })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.username).toBe('editeduser26')
    expect(response.body.isAdmin).toBe(false)
  },100000)

  it('should search a user', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

    const searchUserResponse = await request(server)
      .post('/admin/searchUser')
      .set('Authorization', authResponse.body.token)
      .send({ username: 'editeduser26' })

    expect(searchUserResponse.status).toBe(200)
    expect(searchUserResponse.body).toHaveProperty('_id')
    expect(searchUserResponse.body.username).toBe('editeduser26')
    expect(searchUserResponse.body.isAdmin).toBe(false)
  })

  it('should authenticate and get a token', async () => {
    const response = await request(server).post('/auth/login').send({ username: 'testUser', password: 'testPassword' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should create a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

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
      .send({ username: 'testUser', password: 'testPassword' })

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', authResponse.body.token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const response = await request(server).delete(`/groups/deleteGroup/${groupId}`).set('Authorization', authResponse.body.token)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toBe('testgroup')
  })

  it('should search for a group', async () => {
    const authResponse = await request(server)
      .post('/auth/login')
      .send({ username: 'testUser', password: 'testPassword' })

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
      .send({ username: 'testUser', password: 'testPassword' })

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', authResponse.body.token)
      .send({ name: 'testgroup' })

    const groupId = createGroupResponse.body._id

    const searchUserResponse = await request(server)
      .post('/admin/searchUser')
      .set('Authorization', authResponse.body.token)
      .send({ username: 'editeduser26' })

    const userId = searchUserResponse.body._id

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
      .send({ username: 'testUser', password: 'testPassword' })

    const token = authResponse.body.token

    const createGroupResponse = await request(server)
      .post('/groups/createGroup')
      .set('Authorization', token)
      .send({ name: 'testgroup2' })

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
      .send({ username: 'testUser', password: 'testPassword' })

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
