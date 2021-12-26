import { AdminUserDetail, AdminUserListResponse } from '../../data/admin-user'

export type UsersState = {
  users: AdminUserDetail[]
  requestSellerUsers: AdminUserDetail[]
  usersTable: {
    page: number // count from 1
    limit: number
    total: number
  }
  requestSellerTable: {
    page: number // count from 1
    limit: number
    total: number
  }
  isAddUserDialogOpened: boolean
  newUserAdded: boolean
  currentTab: string
}

export type UsersAction =
  | { type: 'ADD_ALL'; payload: AdminUserListResponse }
  | { type: 'ADD_ALL_REQUEST_ADMIN_USERS'; payload: AdminUserListResponse }
  | { type: 'UPDATE'; payload: AdminUserDetail }
  // | { type: 'UPDATE_REQUEST_ADMIN_USER'; payload: AdminUserDetail }
  | { type: 'DELETE'; payload: AdminUserDetail }
  | { type: 'SET_CURRENT_TAB'; payload: string }
  | { type: 'OPEN_ADD_USER_DIALOG' }
  | { type: 'CLOSE_ADD_USER_DIALOG' }
  | { type: 'NEW_USER_ADDED' }
  | { type: 'HANDLED_NEW_USER_ADDED' }

export const initialUsersState: UsersState = {
  users: [],
  requestSellerUsers: [],
  usersTable: {
    page: 1,
    limit: 5,
    total: 0,
  },
  requestSellerTable: {
    page: 1,
    limit: 5,
    total: 0,
  },
  isAddUserDialogOpened: false,
  newUserAdded: false,
  currentTab: '1',
  // limit: 25,
}

export const usersReducer = (
  state: UsersState,
  action: UsersAction,
): UsersState => {
  switch (action.type) {
    case 'ADD_ALL': {
      const { users, ...tableData } = action.payload
      return {
        ...state,
        users: users,
        usersTable: tableData,
      }
    }
    case 'ADD_ALL_REQUEST_ADMIN_USERS': {
      const { users, ...tableData } = action.payload
      return {
        ...state,
        requestSellerUsers: users,
        requestSellerTable: tableData,
      }
    }
    case 'UPDATE':
      return {
        ...state,
        users: update(state.users, action.payload),
        requestSellerUsers: updateRequestToSellerUsers(
          state.requestSellerUsers,
          action.payload,
        ),
      }
    case 'DELETE':
      return {
        ...state,
        users: deleteUser(state.users, action.payload),
        requestSellerUsers: deleteUser(
          state.requestSellerUsers,
          action.payload,
        ),
        usersTable: {
          ...state.usersTable,
          total: state.usersTable.total - 1,
        },
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
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload,
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

function updateRequestToSellerUsers(
  users: AdminUserDetail[],
  user: AdminUserDetail,
) {
  if (user.role === 'SELLER') {
    return deleteUser(users, user)
  }
  return update(users, user)
}