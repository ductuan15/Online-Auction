import * as React from 'react'
import { useCallback } from 'react'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'

export default function ChangeLayoutButtonGroup() {
  const {
    state: { listLayout },
    dispatch,
  } = useLayoutContext()

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, nextLayout: 'row' | 'card') => {
      dispatch({ type: 'CHANGE_LIST_LAYOUT', payload: nextLayout })
    },
    [dispatch],
  )

  return (
    <ToggleButtonGroup value={listLayout} exclusive onChange={handleChange}>
      <ToggleButton value='row' aria-label='row'>
        <ViewListIcon />
      </ToggleButton>
      <ToggleButton value='card' aria-label='card'>
        <ViewModuleIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
