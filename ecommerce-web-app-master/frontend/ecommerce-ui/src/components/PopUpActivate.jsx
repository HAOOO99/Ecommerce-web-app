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
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { deepOrange } from '@mui/material/colors';

const theme = createTheme();

export default function ResetPassword() {
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const handleSubmit = async (event) => {
       
    // event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //     email: data.get('firstName'),
    //     email: data.get('lastName'),
    //     email: data.get('email'),
    //     password: data.get('password'),
    // });
    // try {
    //     const user = await createUserWithEmailAndPassword(
    //         auth,
    //         data.get('email'),
    //         data.get('password')
    //     );  
    //     console.log(user);
    //     const actionCodeSettings = {
    //         url: 'https://comp5347web.page.link/signinpage',
    //         handleCodeInApp: false
    //     };
        
    //     if (user != null) {
    //         console.log("user is not null")
    //         await sendEmailVerification(auth.currentUser, actionCodeSettings);
    //         console.log("email has been sent")
    //         alert("Email has been sent!");
    //         await signOut(auth);
    //     }
    // } catch (error) {
    //     console.log(error.message);
    //     alert(error.message);
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            // display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="div" variant="h5">
            You haven't activated your account yet.
          </Typography>
          <Typography component="div" variant="body1" sx={{mt:5}}>
          Please activate via email fisrt , by clicking on “Send Email” button
          </Typography>
          <Box component="form" noValidate  onSubmit={handleSubmit} sx={{ mt: 5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              sx={{ mt: 7, mb: 2 }}
            >
              Send Email
            </Button>
            
        
          </Box>
          
          <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="https://comp5347web.page.link/signinpage" variant="body2">
                  Send Again
                </Link>
              </Grid>
            </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
