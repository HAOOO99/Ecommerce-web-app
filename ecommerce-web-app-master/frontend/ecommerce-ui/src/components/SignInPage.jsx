import React, { useRef, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BackgroudImage from '../assets/images/taurus-original.png';
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { deepOrange } from '@mui/material/colors';
import md5 from "js-md5";

const theme = createTheme();

const logout = async () => {
    await signOut(auth);
};

export default function SignInSide() {
    const [user, setUser] = useState({});

    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart']);

    const navigate = useNavigate();
    const handleLogInTransit = () =>{
        navigate('/');
    }

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser !== null){
            setUser(currentUser);
            console.log(currentUser.email)
            setCookie('email', currentUser.email, { path: '/' });
            setCookie("shoppingCart","",{path:'/'});
        } 
    });

    async function syncUserDB(data){
        const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "email": data
          })
        };
        try{
          const response = await fetch("http://localhost:3001/userInfoByEmail", config);
          const data = await response.json();
         
          setCookie("userId",data._id,{path:'/'});
          setCookie("userFirstName",data.firstname,{path:'/'});
          setCookie("userLastName",data.lastname,{path:'/'});
          
          
          console.log("DATA: " + JSON.stringify(data));
        } catch (e){
          console.log(e);
        }
    }

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            console.log({
                email: data.get('email'),
                password: data.get('password'),
            });
            
            const user = await signInWithEmailAndPassword(
                auth,
                data.get('email'),
                data.get('password')
            );
            if (auth.currentUser.emailVerified === false) {
                
                await signOut(auth);
                alert("The registered email is not verified yet.\n Please check your mailbox.");
            } else {

                await syncUserDB(data.get('email'));
                console.log(user);
                console.log(auth.currentUser.email);
                console.log(auth.currentUser.emailVerified);
                alert("Login successfully!");
                // TODO backend log in
                handleLogInTransit();
                
            }  
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${BackgroudImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
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
                        <Typography component="h1" variant="h5" sx={{ my: 3 }}>
                            Welcome to SellPhone Web
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>

                            <Grid container>
                                <Grid item xs>
                                    <Link href="https://comp5347web.page.link/forgotpassword" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="http://localhost:3000/signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}