import { Button, Grid, Typography } from '@mui/material'

// type AccountProps = {
//   foo?: string
// }

const Account = (): JSX.Element => {
  // const { user } = useAuth()

  return (
    <Grid container>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography component='h2' color='text.primary' variant='h3'>
          Account Settings
        </Typography>

        <Button variant='contained'>Save changes</Button>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Typography align='right'>Email</Typography>
        </Grid>

        <Grid item xs={10}>
          <Typography>Hello</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Account
