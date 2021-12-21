import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'

function RequireLogin(): JSX.Element {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to='/signin' state={{ from: location }} />
  }
  return <Outlet />
}

export default RequireLogin
