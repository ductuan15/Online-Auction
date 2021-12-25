import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import * as React from 'react'
import { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import AddUserForm from './AddUserForm'
import { SubmitHandler } from 'react-hook-form'
import { AddUserFormInputs } from '../../../data/sign-up'
import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'

type AddUserDialogProps = {
  onSuccess: () => void
}

export default function AddUserDialog({
  onSuccess,
}: AddUserDialogProps): JSX.Element {
  const {
    state: { isAddUserDialogOpened },
    dispatch,
  } = useAdminUsersContext()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const progressRef = useRef<HTMLDivElement>(null)

  const onClose = () => {
    if (progressRef.current && progressRef.current.style) {
      progressRef.current.style.display = 'none'
    }
    dispatch({ type: 'CLOSE_ADD_USER_DIALOG' })
  }

  const onSubmit: SubmitHandler<AddUserFormInputs> = (data) => {
    alert(JSON.stringify(data, null, 2))
    onClose()
  }

  const dialogName = 'dialog-add-user'

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isAddUserDialogOpened}
      onClose={onClose}
      aria-labelledby={dialogName}
    >
      <DialogTitle id={dialogName}>Register new user</DialogTitle>
      <DialogContent>
        <AddUserForm onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button autoFocus type='submit' form={`add-user-form`}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
