const schema = {
  type: 'object',
  properties: {
    otp: { type: 'string', nullable: false, minLength: 6, maxLength: 6 },
    email: {
      type: 'string',
      format: 'email',
      nullable: false,
      maxLength: 50,
    },
  },
  additionalProperties: false,

  required: ['email'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    required: {
      otp: 'OTP is required',
      email: 'Email is required',
    },
    properties: {
      otp: 'Wrong OTP format',
      email: 'Invalid email format',
    },
    _: 'Bad request',
  },
}

export default schema
