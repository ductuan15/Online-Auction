export type AdminUserDetail = {
  uuid: string
  name: string
  email: string
  isDisabled: boolean
  role: string
  dob: Date | null
  verified: boolean
  profile: string | null
  address: string | null
}

export type AdminUserListResponse = {
  total: number,
  page: number,
  users: AdminUserDetail[]
}