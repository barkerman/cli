import path from 'path'
import { LambdaEvent } from '../../../src/api/types'

import * as lib from '../../../src/api/scripts/api-handler'
import handlers from '../../../src/api/handlers'

describe('api-handler', () => {
  const CONFIG_PATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'api',
    'scripts',
    'bm-server.json',
  )

  const CORS = {
    origins: ['valid'],
    headers: [
      'Accept',
      'Authorization',
      'Content-Type',
      'If-None-Match',
      'X-Amz-Date',
      'X-Amz-Security-Token',
      'X-Api-Key',
    ],
    exposedHeaders: ['Server-Authorization', 'WWW-Authenticate'],
    credentials: true,
    maxAge: 86400,
  }

  const EVENT: LambdaEvent = {
    httpMethod: 'GET',
    pathParameters: null,
    path: 'this is the path',
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: '{"test": 123}',
    headers: {
      Host: 'this is the host',
    },
  }

  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('normaliseLambdaRequest()', () => {
    const request = lib.normaliseLambdaRequest(EVENT)

    expect(request).toEqual({
      body: { test: 123 },
      headers: {
        host: 'this is the host',
      },
      method: 'get',
      route: 'this is the path',
      url: {
        host: 'this is the host',
        hostname: 'this is the host',
        params: {},
        pathname: 'this is the path',
        protocol: 'http:',
        query: {},
        querystring: ''
      },
    })
  })

  test('handler() should return correct response', async () => {
    const event = Object.assign({}, EVENT, { path: '/response' })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      body: JSON.stringify({ handler: 123 }),
      headers: {
        'content-type': 'application/json',
        custom: '123',
      },
      statusCode: 202,
    })
  })

  test('handler() should return correct boom response', async () => {
    const event = Object.assign({}, EVENT, { path: '/boom' })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      body: JSON.stringify({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Testing boom errors',
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 400,
    })
  })

  test('handler() should return 404 status code if route is not found', async () => {
    const route = '/missing'
    const event = Object.assign({}, EVENT, { path: route })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      body: JSON.stringify({
        error: 'Not Found',
        message: `Route has not been implemented: ${route}`,
        statusCode: 404,
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 404,
    })
  })

  test('handler() should return 405 status code if method is not found', async () => {
    const event = Object.assign({}, EVENT, {
      httpMethod: 'POST',
      path: '/response',
    })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      body: JSON.stringify({
        error: 'Method Not Allowed',
        message: 'POST method has not been implemented',
        statusCode: 405,
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 405,
    })
  })

  test('handler() should return 405 for options requests with no CORS', async () => {
    const event = Object.assign({}, EVENT, {
      httpMethod: 'OPTIONS',
      path: '/response',
      headers: {
        host: 'host',
        origin: 'valid',
      },
    })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      body: JSON.stringify({
        error: 'Method Not Allowed',
        message: 'OPTIONS method has not been implemented',
        statusCode: 405,
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 405,
    })
  })

  test('handler() should return 200 for options requests with CORS and valid origin', async () => {
    jest.mock(CONFIG_PATH, () => ({
      cors: CORS,
      routes: [
        {
          module: './project/test-response.js',
          route: '/response',
        },
      ],
    }))
    const event = Object.assign({}, EVENT, {
      headers: {
        host: 'host',
        origin: 'valid',
        'Access-Control-Request-Method': 'GET',
      },
      httpMethod: 'OPTIONS',
      path: '/response',
    })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      headers: {
        'access-control-allow-credentials': true,
        'access-control-allow-headers': CORS.headers.join(','),
        'access-control-allow-methods': 'GET',
        'access-control-allow-origin': 'valid',
        'access-control-expose-headers':
          'Server-Authorization,WWW-Authenticate',
        'access-control-max-age': CORS.maxAge,
        'content-type': 'application/json',
      },
      statusCode: 200,
    })
  })

  test('handler() should return 200 for requests with CORS and invalid origin', async () => {
    jest.mock(CONFIG_PATH, () => ({
      cors: Object.assign({}, CORS, { origins: ['invalid'] }),
      routes: [
        {
          module: './project/test-response.js',
          route: '/response',
        },
      ],
    }))
    const event = Object.assign({}, EVENT, {
      headers: {
        host: 'host',
        origin: 'valid',
      },
      httpMethod: 'OPTIONS',
      path: '/response',
    })

    const result = await lib.handler(event, {})
    expect(result).toEqual({
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
    })
  })

  test.only('handler() should return 500 status code if current working directory cannot be changed', async () => {
    const spy = jest.spyOn(handlers, 'getHandler')
    jest.mock('../../../dist/bm-server.json', () => require(CONFIG_PATH), {
      virtual: true,
    })

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { handler } = require('../../../dist/api-handler')
    const result = await handler(
      {
        httpMethod: 'GET',
        pathParameters: null,
        path: '/response',
        queryStringParameters: null,
        body: '{"test": 123}',
        headers: {
          Host: 'this is the host',
        },
        resource: 'string',
      },
      {},
    )

    expect(spy).not.toBeCalled()
    expect(result).toEqual({
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
        statusCode: 500,
      }),
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 500,
    })
  })
})
