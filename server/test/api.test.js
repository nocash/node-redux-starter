import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

import testData from '../tasks/fixtures/todos-test'
import seed from '../tasks/seeders/todos'

import { Todo } from '../models'

chai.use(chaiHttp)

describe('Todos', () => {
  let server

  beforeEach((done) => {
    delete require.cache[require.resolve('../server')]
    server = require('../server').default
    seed(testData, done)
  })

  afterEach((done) => {
    server.close(done)
  })

  it('should list all Todos on /api/todos GET', (done) => {
    chai.request(server)
      .get('/api/todos')
      .end((err, res) => {
        expect(res.body).to.have.length(3)
        done()
      })
  })

  it('should create a new todo on /api/todos POST', (done) => {
    chai.request(server)
      .post('/api/todos')
      .send({
        todo: {
          note: 'todo4',
          complete: false,
        },
      })
      .end(() => {
        Todo.find({}, (err, todos) => {
          expect(todos.length).to.equal(4)
          done()
        })
      })
  })

  it('should delete a todo on /api/todos/:id DELETE', (done) => {
    Todo.findOne({ note: 'todo1' }, (error, todo) => {
      chai.request(server)
        .delete(`/api/todos/${todo.id}`)
        .end(() => {
          Todo.find({}, (err, todos) => {
            expect(todos.length).to.equal(2)
            done()
          })
        })
    })
  })

  it('should update a todo on /api/todos/:id PUT', (done) => {
    Todo.findOne({ note: 'todo1' }, (error, todo) => {
      chai.request(server)
        .put(`/api/todos/${todo.id}`)
        .send({
          todo: {
            note: 'new note',
          },
        })
        .end(() => {
          Todo.findOne({ _id: todo.id }, (err, updatedTodo) => {
            expect(updatedTodo.note).to.equal('new note')
            done()
          })
        })
    })
  })
})
