import Role from './role'

export type SignUpFormInputs = {
  name: string
  email: string
  dob: string | null
  address: string
  pwd: string
  pwd2: string
  termAndConditionAccepted: boolean
  captchaToken: string
}

export type AddUserFormInputs = {
  name: string
  email: string
  dob: string | null
  address: string
  pwd: string
  pwd2: string
  role:  Role
  verified: boolean
}