export type AdminUserDetail = {
  uuid: string
  name: string
  email: string
  isDisabled: boolean | 'true' | 'false'
  role: string
  dob: Date | null
  verified: boolean | 'true' | 'false'
  profile: string | null
  address: string | null
}

export type AdminUserListResponse = {
  total: number,
  page: number,
  users: AdminUserDetail[]
}