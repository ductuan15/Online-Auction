const schema = {
  type: 'object',
  allOf: [
    {
      properties: {
        email: {
          type: 'string',
          format: 'email',
          nullable: false,
          maxLength: 50,
        },
        pwd: { type: 'string', nullable: false, minLength: 8, maxLength: 255 },
      },
      additionalProperties: false,
    },
  ],
  required: ['email', 'pwd'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    required: {
      email: 'Email is required',
      pwd: 'Password is required',
    },
    properties: {
      email: 'Invalid email format',
      pwd: 'Password should have at least 8 characters',
    },
    _: 'Bad request',
  },
}

export default schema
