export const openApiDocument = {
  openapi: '3.0.3',
  info: { title: 'IRIS To-Do API', version: '1.0.0', description: 'Task management API built with Express, TypeScript and Prisma.' },
  servers: [{ url: 'http://localhost:3000/api' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      Task: { type: 'object', required: ['id', 'title', 'category', 'priority', 'completed', 'createdAt', 'updatedAt'], properties: { id: { type: 'string' }, title: { type: 'string' }, category: { type: 'string', enum: ['FrontEnd', 'BackEnd', 'Docs'] }, priority: { type: 'string', enum: ['Baja', 'Media', 'Urgente'] }, completed: { type: 'boolean' }, createdAt: { type: 'string', format: 'date' }, updatedAt: { type: 'string', format: 'date' } } },
      CreateTaskRequest: { type: 'object', required: ['title', 'category', 'priority'], properties: { title: { type: 'string', minLength: 1, maxLength: 200 }, category: { type: 'string', enum: ['FrontEnd', 'BackEnd', 'Docs'] }, priority: { type: 'string', enum: ['Baja', 'Media', 'Urgente'] }, completed: { type: 'boolean' } } },
      UpdateTaskRequest: { type: 'object', minProperties: 1, properties: { title: { type: 'string', minLength: 1, maxLength: 200 }, category: { type: 'string', enum: ['FrontEnd', 'BackEnd', 'Docs'] }, priority: { type: 'string', enum: ['Baja', 'Media', 'Urgente'] }, completed: { type: 'boolean' } } },
    },
  },
  paths: {
    '/auth/register': { post: { summary: 'Register a user', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string', minLength: 2, maxLength: 100 }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8, maxLength: 128 } }, required: ['fullName', 'email', 'password'] } } } }, responses: { '201': { description: 'User registered' }, '409': { description: 'Email already exists' } } } },
    '/auth/login': { post: { summary: 'Create a JWT', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } }, required: ['email', 'password'] } } } }, responses: { '200': { description: 'Token generated' }, '401': { description: 'Invalid credentials' } } } },
    '/tasks': { get: { summary: 'List tasks', security: [{ bearerAuth: [] }], parameters: [{ name: 'completed', in: 'query', schema: { type: 'boolean' } }, { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }], responses: { '200': { description: 'Task list' } } }, post: { summary: 'Create task', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTaskRequest' } } } }, responses: { '201': { description: 'Task created' }, '400': { description: 'Validation error' } } } },
    '/tasks/{id}': { parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], get: { summary: 'Get task', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Task found' }, '404': { description: 'Task not found' } } }, patch: { summary: 'Update task', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTaskRequest' } } } }, responses: { '200': { description: 'Task updated' } } }, delete: { summary: 'Delete task', security: [{ bearerAuth: [] }], responses: { '204': { description: 'Task deleted' } } } },
  },
} as const;
