import React, { useRef, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { app, auth } from "../firebase-config";
import {
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { deepOrange } from '@mui/material/colors';

const theme = createTheme();

export default function ForgotPassword() {
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        email: data.get('email'),
    });
    try {
        await sendPasswordResetEmail(auth, data.get('email'));
        alert("A link has been sent to your email to reset the password\nPlease check your mail box");
    } catch (error) {
        console.log(error.message);
        alert(error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{
                width: 150,
                height: 150,
            }}>
                <AccountCircleIcon sx={{
                    bgcolor: deepOrange[400],
                    width: 150,
                    height: 150,
                }}></AccountCircleIcon>
            </Avatar>
          <Typography component="h1" variant="h5">
            Reset Your Password!
          </Typography>
          <Typography component="h1" variant="h6">
              Please input the regiesterd email.

          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={16}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send the reset password link
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="https://comp5347web.page.link/signinpage" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}