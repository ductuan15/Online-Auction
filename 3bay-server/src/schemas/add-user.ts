const schema = {
  type: 'object',
  allOf: [
    {
      properties: {
        name: { type: 'string', nullable: false, minLength: 1, maxLength: 255 },
        email: {
          type: 'string',
          format: 'email',
          nullable: false,
          maxLength: 50,
        },
        pwd: { type: 'string', nullable: false, minLength: 8, maxLength: 255 },
        dob: {
          type: 'string',
          nullable: false,
          format: 'date-time',
        },
        address: { type: 'string', nullable: false, minLength: 1 },
        role: { type: 'string', format: 'user-role', nullable: false },
        verified: { type: 'boolean', nullable: false },
      },
      additionalProperties: false,
    },
  ],
  required: ['name', 'email', 'pwd', 'dob', 'address', 'role'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    required: {
      name: 'Name is required',
      email: 'Email is required',
      pwd: 'Password is required',
      dob: 'Date of birth is required',
      address: 'Address is required',
      role: 'Role is required',
    },
    properties: {
      name: 'Empty name is not allowed',
      email: 'Invalid email format',
      pwd: 'Password should have at least 8 characters',
      dob: 'Invalid date of birth format',
      address: 'Empty address is not allowed',
      role: 'Wrong \'Role\' format',
    },
    _: 'Bad request',
  },
}

export default schema
