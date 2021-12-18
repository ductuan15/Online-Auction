export interface SignUpFormInputs {
  name: string
  email: string
  dob: string | null
  address: string
  pwd: string
  pwd2: string
  termAndConditionAccepted: boolean
  captchaToken: string
}