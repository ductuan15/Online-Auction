import { Divider, Grid, Typography } from '@mui/material'
import AdminMenuCard from './AdminMenuCard'
import adminCategoriesImg from '../../../assets/admin_categories.jpeg'
import adminProductsImg from '../../../assets/admin_products.jpeg'
import adminUsersImg from '../../../assets/admin_users.jpeg'
import { useAuth } from '../../../contexts/user/AuthContext'

export const ADMIN_MENU_ITEMS = [
  { title: '🏷️ Categories', link: '/admin/cat', img: adminCategoriesImg },
  { title: '🛒 Products', link: '/admin/products', img: adminProductsImg },
  { title: '👤 Users', link: '/admin/users', img: adminUsersImg },
]

const AdminMenu = (): JSX.Element | null => {
  const { user } = useAuth()

  if (user?.role === 'ADMINISTRATOR') {
    return (
      <Grid
        container
        spacing={4}
        justifyContent='center'
        alignItems='center'
        alignContent='center'
      >
        <Grid item xs={12}>
          <Typography
            component='h2'
            variant='h4'
            fontWeight='500'
            gutterBottom
            color='primary.main'
            align='center'
          >
            🔑 Administration tasks
          </Typography>
        </Grid>
        {ADMIN_MENU_ITEMS.map((card) => (
          <Grid item xs={6} md={4} key={card.title}>
            <AdminMenuCard {...card} />
          </Grid>
        ))}

        <Grid item container>
          <Divider />
        </Grid>
      </Grid>
    )
  }
  return null
}

export default AdminMenu
