import {Navigate, Outlet, useLocation} from 'react-router-dom'
import { useAuth } from '../../../contexts/user/AuthContext'

function RequireAuth(): JSX.Element {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/signin' state={{ from: location }} />
  }

  return <Outlet/>
}

export default RequireAuth
