import { IncomingMessage, ServerResponse } from 'http'
import { v4 as uuidv4 } from 'uuid'
import querystring from 'querystring'
import { Task } from '../types/tasks.js'
import { sendJsonResponse, validatePayload, validateUpdate} from '../utils/utilsFile.js'

const tasks: Task[] = []

const createTask = (req: IncomingMessage, res: ServerResponse) => {
  let body = ''
  req.on('data', (data) => {
    body += data
  })

  req.on('end', () => {
    try {
      const { title, description }: { title: string; description: string } = JSON.parse(body)

      if (!validatePayload(title, description)) {
        sendJsonResponse(res, 400, {
          message: 'Title and description are required and must be non-empty strings',
        })
        return
      }

      const newTask: Task = {
        id: uuidv4(),
        title,
        description,
        status: 'pending',
      }

      tasks.push(newTask)

      sendJsonResponse(res, 200, newTask)
    } catch (error) {
      sendJsonResponse(res, 400, { message: 'Invalid JSON payload' })
    }
  })
}

const getTasks = (req: IncomingMessage, res: ServerResponse) => {
  sendJsonResponse(res, 200, tasks)
}

const getTaskById = (req: IncomingMessage, res: ServerResponse) => {
  const taskId = req.url?.split('/')[2]
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    sendJsonResponse(res, 404, { message: 'Task Not Found' })
    return
  }

  sendJsonResponse(res, 200, task)
}

const updateTask = (req: IncomingMessage, res: ServerResponse) => {
  const taskId = req.url?.split('/')[2]
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    sendJsonResponse(res, 404, { message: 'Task Not Found' })
    return
  }

  let body = ''
  req.on('data', (data) => {
    body += data
  })

  req.on('end', () => {
    try {
      const { title, description, status } = JSON.parse(body)

      if (!validateUpdate({ status })) {
        sendJsonResponse(res, 400, { message: 'Status must be either "pending" or "completed"' })
        return
      }

      if (title) {
        task.title = title
      }

      if (description) {
        task.description = description
      }

      if (status) {
        task.status = status
      }

      if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        title.trim() === '' ||
        description.trim() === ''
      ) {
        return sendJsonResponse(res, 400, {
          message: 'must be "non-empty" string',
        })
      }

      sendJsonResponse(res, 200, task)
    } catch (error) {
      sendJsonResponse(res, 400, { message: 'Invalid JSON payload' })
    }
  })
}

const deleteTask = (req: IncomingMessage, res: ServerResponse) => {
  const taskId = req.url?.split('/')[2]
  const taskIndex = tasks.findIndex((t) => t.id === taskId)

  if (taskIndex === -1) {
    sendJsonResponse(res, 404, { message: 'Task not found' })
    return
  }

  tasks.splice(taskIndex, 1)

  sendJsonResponse(res, 200, { message: 'Task deleted successfully' })
}

const getTasksWithPagination = (req: IncomingMessage, res: ServerResponse) => {
  const { limit = '10', offset = '0' } = querystring.parse(req.url!.split('?')[1])

  const paginatedTasks = tasks.slice(Number(offset), Number(offset) + Number(limit))

  sendJsonResponse(res, 200, paginatedTasks)
}


export { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksWithPagination }
