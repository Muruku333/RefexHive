'use client';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { getBackgroundDots } from '@/utils/getBackgroundDots';

import Form from './Form';
export default function Login() {
  const theme = useTheme();
  const boxRadius = { xs: 24, sm: 32, md: 40 };
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        size={{ sm: 8, md: 8.5 }}
        display={{ xs: 'none', sm: 'block' }}
        // sx={{
        //   ...bgGradient({
        //     direction: '90deg',
        //     startColor: 'rgba(40, 121, 182, 0.55) 25%',
        //     middleColor: 'rgba(125, 194, 68, 0.55) 50%',
        //     endColor: 'rgb(238, 106, 49,0.55) 100%',
        //     // color: alpha(theme.palette.background.default, 0.9),
        //     imgUrl: '/assets/images/aircrafts/aircraft_1.jpg',
        //   }),
        // }}
      >
        <video
          playsInline
          width="100%"
          height="100%"
          style={{ display: 'flex', objectFit: 'cover' }}
          preload="metadata"
          autoPlay={true}
          loop={true}
          muted={true}
          poster={'/assets/videos/thumbnails/login-thumbnail.jpg'}
        >
          <source src={'/assets/videos/login-slides.mp4'} type="video/mp4" />
        </video>
      </Grid>
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}
      {/* <CssBaseline /> */}
      <Grid
        size={{ xs: 12, sm: 4, md: 3.5 }}
        component={Paper}
        elevation={6}
        square
        sx={{
          //   height: { xs: 592, sm: 738, md: 878 },
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   width: 1,
          //   zIndex: -1,
          //   borderBottomLeftRadius: boxRadius,
          //   borderBottomRightRadius: boxRadius,
          // background: getBackgroundDots(theme.palette.grey[300], 60, 35),
          bgcolor: 'grey.100'
        }}
      >
        <Box
          sx={{
            // my: { xs: 8, sm: 8, md: 9 },
            // mx: { xs: 3, sm: 2, md: 7 },
            height: 1,
            pt: { xs: 8, sm: 8, md: 9 },
            px: { xs: 3, sm: 2, md: 7 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
    <LockOutlinedIcon />
  </Avatar> */}
          <Typography component="h1" variant="h5">
            <img src="/assets/logo/refex_logo.png" alt="logo" height={75} />
          </Typography>
          <Form />
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ position: 'absolute', bottom: 0 }}>
            <Typography color="text.disabled">
              Developed&nbsp;by&nbsp;
              <Link color="inherit" target="_blank" href="https://refex.co.in/" rel="noopener noreferrer">
                Refex IT
              </Link>
              &nbsp;© {new Date().getFullYear()}
              &nbsp;|&nbsp;
              <Link color="inherit" target="_blank" href="/privacy-policy">
                Privacy Policy
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
