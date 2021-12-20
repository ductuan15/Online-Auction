const schema = {
  type: 'object',

  properties: {
    name: { type: 'string', nullable: false, minLength: 1, maxLength: 255 },
    // email: {
    //   type: 'string',
    //   format: 'email',
    //   nullable: false,
    //   maxLength: 50,
    // },
    dob: {
      type: 'string',
      nullable: false,
      format: 'date-time',
    },
    address: { type: 'string', nullable: false, minLength: 1 },
  },
  additionalProperties: false,

  oneOf: [{ required: 'name' }, { required: 'dob' }, { required: 'address' }],

  required: ['name', 'email', 'dob', 'address'],

  errorMessage: {
    type: 'Bad request (Invalid request type)',
    // required: {
    //   name: 'Name is required',
    //   email: 'Email is required',
    //   dob: 'Date of birth is required',
    //   address: 'Address is required',
    // },
    required: 'At least one field is required',
    properties: {
      name: 'Empty name is not allowed',
      // email: 'Invalid email format',
      dob: 'Invalid date of birth format',
      address: 'Empty address is not allowed',
    },
    _: 'Bad request',
  },
}

export default schema
