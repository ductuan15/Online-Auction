import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'
import Error404 from '../../../pages/common/error/Error404'

type RequireRoleProps = {
  role: 'ADMINISTRATOR' | 'SELLER' | 'BIDDER'
}

function RequireRole({ role }: RequireRoleProps): JSX.Element {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    return <Navigate to='/signin' state={{ from: location }} />
  }
  if (auth.user && auth.user.role !== role) {
    return <Error404 />
  }

  return <Outlet />
}

export default RequireRole
