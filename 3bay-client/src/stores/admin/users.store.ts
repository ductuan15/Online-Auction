import { AdminUserDetail, AdminUserListResponse } from '../../data/admin-user'

export type UsersState = {
  users: AdminUserDetail[]
  page: number
  total: number
  isAddUserDialogOpened: boolean
  newUserAdded: boolean
}

export type UsersAction =
  | { type: 'ADD_ALL'; payload: AdminUserListResponse }
  | { type: 'UPDATE'; payload: AdminUserDetail }
  | { type: 'DELETE'; payload: AdminUserDetail }
  | { type: 'OPEN_ADD_USER_DIALOG' }
  | { type: 'CLOSE_ADD_USER_DIALOG' }
  | { type: 'NEW_USER_ADDED' }
  | { type: 'HANDLED_NEW_USER_ADDED' }

export const initialUsersState: UsersState = {
  users: [],
  page: 0,
  total: 0,
  isAddUserDialogOpened: false,
  newUserAdded: false,
  // limit: 25,
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
    case 'UPDATE':
      return {
        ...state,
        users: update(state.users, action.payload),
      }
    case 'DELETE':
      return {
        ...state,
        users: deleteUser(state.users, action.payload),
        total: state.total - 1,
      }
    case 'OPEN_ADD_USER_DIALOG':
      return {
        ...state,
        isAddUserDialogOpened: true,
      }
    case 'CLOSE_ADD_USER_DIALOG':
      return {
        ...state,
        isAddUserDialogOpened: false,
      }
    case 'NEW_USER_ADDED':
      return {
        ...state,
        newUserAdded: true,
      }
    case 'HANDLED_NEW_USER_ADDED':
      return {
        ...state,
        newUserAdded: false,
      }
    default:
      return state
  }
}

function update(
  users: AdminUserDetail[],
  user: AdminUserDetail,
): AdminUserDetail[] {
  return users.map((item) => {
    if (user.uuid === item.uuid) {
      return user
    }
    return item
  })
}

function deleteUser(
  users: AdminUserDetail[],
  user: AdminUserDetail,
): AdminUserDetail[] {
  return users.filter((item) => {
    return user.uuid !== item.uuid
  })
}