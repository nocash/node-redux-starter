import 'isomorphic-fetch'
import { browserHistory } from 'react-router'

const checkStatus = response => {
  if (!response.ok) {
    const error = new Error(response.statusText)
    return response.json()
      .then(responseBody => {
        error.friendlyErr = responseBody.message || 'Oops! Something went wrong. Try again later.'
        throw error
      })
  }

  return response.json()
}

const applyRedirect = (redirect, type) => {
  if (redirect && redirect[type]) browserHistory.push(redirect[type])
}

const apiMiddleware = () =>
  next => action => {
    const { type, api, method, body, redirect, session } = action

    if (!api) return next(action)

    const defaultParams = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const reqConfig = {
      ...defaultParams,
      method: method || 'get',
    }

    if (body) {
      reqConfig.body = JSON.stringify(body)
    }

    const REQUEST = `${type}_REQUEST`
    const SUCCESS = `${type}_SUCCESS`
    const FAILURE = `${type}_FAILURE`

    next({ type: REQUEST })

    return fetch(api, reqConfig)
    .then(checkStatus)
    .then(response => {
      applyRedirect(redirect, 'success')
      if (session) sessionStorage[session] = response[session]
      next({
        type: SUCCESS,
        payload: response,
      })
    })
    .catch(error => {
      applyRedirect(redirect, 'failure')
      next({ type: FAILURE, payload: error })
    })
  }

export default apiMiddleware
