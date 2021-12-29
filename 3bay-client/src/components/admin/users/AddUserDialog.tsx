import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import * as React from 'react'
import { useCallback, useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import AddUserForm from './AddUserForm'
import { SubmitHandler } from 'react-hook-form'
import { AddUserFormInputs } from '../../../models/sign-up'
import { useAdminUsersContext } from '../../../contexts/admin/UsersContext'
import { Alert } from '@mui/material'

type AddUserDialogProps = {
  errorText: string | null
  onSubmit: SubmitHandler<AddUserFormInputs>
}

const dialogName = 'dialog-add-user'

export default function AddUserDialog({
  errorText,
  onSubmit,
}: AddUserDialogProps): JSX.Element {
  const {
    state: { isAddUserDialogOpened },
    dispatch,
  } = useAdminUsersContext()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const progressRef = useRef<HTMLDivElement>(null)

  const onClose = useCallback(() => {
    if (progressRef.current && progressRef.current.style) {
      progressRef.current.style.display = 'none'
    }
    dispatch({ type: 'CLOSE_ADD_USER_DIALOG' })
  }, [dispatch])

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isAddUserDialogOpened}
      onClose={onClose}
      aria-labelledby={dialogName}
    >
      <DialogTitle id={dialogName}>Register new user</DialogTitle>
      <DialogContent>
        {errorText && <Alert severity='error'>{errorText}</Alert>}

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
