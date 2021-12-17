const schema = {
  type: 'object',
  allOf: [
    {
      properties: {
        pwd: { type: 'string', nullable: false, minLength: 8, maxLength: 255 },
        otp: { type: 'string', nullable: false, minLength: 6, maxLength: 6 },
        email: {
          type: 'string',
          format: 'email',
          nullable: false,
          maxLength: 50,
        },
      },
      additionalProperties: false,
    },
  ],
  required: ['pwd', 'otp', 'email'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    required: {
      pwd: 'Password is required',
      otp: 'OTP is required',
      email: 'Email is required',
    },
    properties: {
      pwd: 'Password should have at least 8 characters',
      otp: 'Wrong OTP format',
      email: 'Invalid email format',
    },
    _: 'Bad request',
  },
}

export default schema
