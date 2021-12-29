export type UpgradeToSellerRequest = {
  userId: string
}

export type UserDetails = {
  uuid: string
  name: string
  email: string
  dob: string | null
  address: string
  role: string
  upgradeToSellerRequest?: UpgradeToSellerRequest
}

export type Bidder = {
  uuid: string,
  name: string
}