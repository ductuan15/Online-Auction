import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'
import Error404 from '../../../pages/common/error/Error404'

function RequireAdminRole(): JSX.Element {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to='/signin' state={{ from: location }} />
  }
  if (auth.user && auth.user.role !== 'ADMINISTRATOR') {
    return <Error404 />
  }

  return <Outlet />
}

export default RequireAdminRole
