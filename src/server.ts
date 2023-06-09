import http, { IncomingMessage, ServerResponse } from 'http'
import { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksWithPagination } from './controllers/tasks.js'
import * as config from './config.js'

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url) {
    if (req.url === '/tasks' && req.method === 'GET') {
      getTasks(req, res)
    } else if (req.url === '/tasks' && req.method === 'POST') {
      createTask(req, res)
    } else if (req.url.startsWith('/tasks/') && req.method === 'GET') {
      getTaskById(req, res)
    } else if (req.url.startsWith('/tasks/') && req.method === 'PUT') {
      updateTask(req, res)
    } else if (req.url.startsWith('/tasks/') && req.method === 'DELETE') {
      deleteTask(req, res)
    } else if (req.url.startsWith('/tasks?') && req.method === 'GET') {
      getTasksWithPagination(req, res)
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Endpoint not found' }))
    }
  }
})

server.listen(config.PORT, () => {
  console.log(`Server listening on port http://localhost:${config.PORT}`)
})
