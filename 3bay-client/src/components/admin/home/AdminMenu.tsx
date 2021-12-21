import { Divider, Grid, Typography } from '@mui/material'
import AdminMenuCard from './AdminMenuCard'
import adminCategoriesImg from '../../../assets/admin_categories.jpeg'
import adminProductsImg from '../../../assets/admin_products.jpeg'
import adminUsersImg from '../../../assets/admin_users.jpeg'
import { useAuth } from '../../../contexts/user/AuthContext'

const AdminMenu = (): JSX.Element | null => {
  const { user } = useAuth()
  const adminMenuItems = [
    { title: 'Categories', link: '/cat', img: adminCategoriesImg },
    { title: 'Products', link: '/cat', img: adminProductsImg },
    { title: 'Users', link: '/cat', img: adminUsersImg },
  ]

  if (user?.role === 'ADMINISTRATOR') {
    return (
      <Grid
        container
        marginBottom={4}
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
            🏷️ Administrator tasks
          </Typography>
        </Grid>
        {adminMenuItems.map((card) => (
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
