const schema = {
  type: 'object',
  properties: {
    pwd: { type: 'string', nullable: false, minLength: 8, maxLength: 255 },
    newPwd: { type: 'string', nullable: false, minLength: 8, maxLength: 255 },
  },

  additionalProperties: false,
  required: ['pwd', 'newPwd'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    required: {
      pwd: 'Password is required',
      newPwd: 'New password is required',
    },
    properties: {
      pwd: 'Password should have at least 8 characters',
      newPwd: 'New password should have at least 8 characters',
    },
    _: 'Bad request',
  },
}

export default schema
