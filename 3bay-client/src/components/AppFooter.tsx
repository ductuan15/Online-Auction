import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import { AppName } from './AppName'
import EmailSubscriber from './EmailSubscriber'
import IconButton from '@mui/material/IconButton'
import RedditIcon from '@mui/icons-material/Reddit'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function AppFooter() {
  return (
    <Container component="footer">
      <Divider />
      <Box
        sx={{
          py: 8,
          display: 'grid',
          gridAutoColumns: '1fr',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '1fr 1.75fr',
            lg: '1fr 1fr',
          },
          gridTemplateRows: 'auto',
          '& a:not(.MuiIconButton-root)': {
            mt: 1,
            color: 'text.secondary',
            typography: 'body2',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          },
        }}
      >

        <div>
          <AppName bigSize />

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 1.5 }}>
            Subscribe to our letters! Please UwU
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No spam, only cats.
          </Typography>
          <EmailSubscriber />
        </div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gridAutoColumns: '1fr',
            gap: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight="bold" variant="body2">
              Buy
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Registration
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Stores
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Bidding & binding helps
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight="bold" variant="body2">
              Sell
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Start selling
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Learn to sell
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Affiliates
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight="bold" variant="body2">
              About 3bay
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Our info
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              News
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'end', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Careers{' '}
              </Typography>
              <Box
                sx={{
                  px: 0.5,
                  py: 0.3,
                  ml: 1,
                  borderRadius: 0.5,
                  fontSize: (theme) => theme.typography.pxToRem(9),
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#fff',
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.error.dark
                      : theme.palette.error.main,
                }}
              >
                Hiring
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Policies
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight="bold" variant="body2">
              Help & Contact
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Contact us
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          py: 4,
          display: { xs: 'block', sm: 'flex' },
          alignItems: { sm: 'center' },
          justifyContent: { sm: 'space-between' },
        }}
      >
        <Typography color="text.secondary" variant="body2">
          Copyright © {new Date().getFullYear()} HCMUS.
        </Typography>
        <Box sx={{ py: { xs: 2, sm: 0 } }}>
          <Stack spacing={2} direction="row">
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/"
              aria-label="github"
              title="GitHub"
              size="small"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.reddit.com/r/cats/"
              aria-label="github"
              title="GitHub"
              size="small"
            >
              <RedditIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}
