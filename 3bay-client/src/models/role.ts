export const Role = {
  BIDDER: 'BIDDER',
  SELLER: 'SELLER',
  ADMINISTRATOR: 'ADMINISTRATOR'
};

type Role = (typeof Role)[keyof typeof Role]

export default Role