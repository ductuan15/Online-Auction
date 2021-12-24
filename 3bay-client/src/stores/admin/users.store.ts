import { AdminUserDetail, AdminUserListResponse } from '../../data/admin-user'

export type UsersState = {
  users: AdminUserDetail[]
  page: number
  total: number
  limit: number

  // sort order
}

export type UsersAction = {
  type: 'ADD_ALL'
  payload: AdminUserListResponse
}

export const initialUsersState: UsersState = {
  users: [],
  page: 0,
  total: 0,
  limit: 25,
}

export const usersReducer = (
  state: UsersState,
  action: UsersAction,
): UsersState => {
  switch (action.type) {
    case 'ADD_ALL':
      return {
        ...state,
        users: action.payload.users,
        total: action.payload.total,
        page: action.payload.page,
      }
    default:
      return state
  }
}
