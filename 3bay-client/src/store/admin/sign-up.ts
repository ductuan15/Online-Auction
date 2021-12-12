export interface SignUpFormInputs {
  name: string
  email: string
  dob: Date | null
  address: string
  pwd: string
  pwd2: string
  emailSubscription: boolean
}