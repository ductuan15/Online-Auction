const schema = {
  type: 'object',

  properties: {
    uuid: { type: 'string', nullable: false },
    isDisabled: { type: 'boolean', nullable: false },
    role: { type: 'string', format: 'user-role', nullable: false },
    verified: { type: 'boolean', nullable: false },
  },
  additionalProperties: false,

  required: ['uuid', 'isDisabled', 'role', 'verified'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    properties: {
      role: 'Invalid \'role\' format'
    },
    _: 'Bad request',
  },
}

export default schema
