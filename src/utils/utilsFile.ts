import {ServerResponse} from 'http'

const sendJsonResponse = (res: ServerResponse, statusCode: number,data: any) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

const validatePayload = (title: string, description: string): boolean => {
  if ( !title || !description || typeof title !== 'string' || typeof description !== 'string' || title.trim() === '' || description.trim() === '') {return false} else { return true}
}

const validateUpdate = (payload: any) => {
  if (payload.status && payload.status !== 'pending' && payload.status !== 'completed') {
    return false} else {return true}
}

export {sendJsonResponse, validatePayload, validateUpdate }
