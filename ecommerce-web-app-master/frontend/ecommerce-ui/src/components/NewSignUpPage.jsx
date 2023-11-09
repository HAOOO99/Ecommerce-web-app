import React, { useState } from "react";
// import { useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from "../firebase-config";
// import { app } from "../firebase-config";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    updateProfile,
    signOut
} from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { deepOrange } from '@mui/material/colors';
import md5 from 'js-md5';

const theme = createTheme();

export default function SignUp() {
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    async function syncUserDB(data){
      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "firstname": data.get('firstName'),
            "lastname": data.get('lastName'),
            "email": data.get('email'),
            "password": md5(data.get('password'))
        })
      };
      try{
        const response = await fetch("http://localhost:3001/newUser", config);
        const data = await response.json();
        console.log("DATA: " + JSON.stringify(data));
      } catch (e){
        console.log(e);
      }
    }

    const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        firstname: data.get('firstName'),
        lastname: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
    });

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');


    try {

        // create account
        const user = await createUserWithEmailAndPassword(
            auth,
            data.get('email'),
            data.get('password')
        );  
        // console.log(user);

        // Add display name to this account
        const displayName = firstName + " " + lastName;
        try {
            await updateProfile(auth.currentUser, 
                {displayName: displayName, photoURL: null});
            
        } catch (error) {
            console.log(error.message);
            alert("Failed to add the user name\n" + error.message);
        }
        console.log(auth.currentUser.displayName)
        // Send the email verification
        const actionCodeSettings = {
            url: 'https://comp5347web.page.link/signinpage',
            handleCodeInApp: false
        };
        
        if (user != null) {
            console.log("user is not null")
            syncUserDB(data);
            await sendEmailVerification(auth.currentUser, actionCodeSettings);
            console.log("email has been sent")
            alert("The verification email has been sent to your mailbox!\n" + 
            "Please verify your email before login");

            await signOut(auth);
        }
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="http://localhost:3000/login" variant="body2">
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

// import React, { useRef, useState } from "react";
// import {
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut
// } from "firebase/auth";
// // import "./App.css";
// import { app, auth } from "../firebase-config";
// import { Form, Button, Card, Alert } from "react-bootstrap"
// import 'bootstrap/dist/css/bootstrap.min.css'
// // import auth from './firebase';

// function App() {
//     const [registerEmail, setRegisterEmail] = useState("");
//     const [registerPassword, setRegisterPassword] = useState("");
//     const [loginEmail, setLoginEmail] = useState("");
//     const [loginPassword, setLoginPassword] = useState("");

//     const emailRef = useRef()
//     const passwordRef = useRef()
//     const passwordConfirmRef = useRef()

//     const [user, setUser] = useState({});

//     onAuthStateChanged(auth, (currentUser) => {
//         setUser(currentUser);
//     });

//     const register = async () => {
//         try {
//             const user = await createUserWithEmailAndPassword(
//                 auth,
//                 emailRef.current.value,
//                 passwordRef.current.value
//             );  
//             console.log(emailRef.current.value);
//             console.log(user);
//             const actionCodeSettings = {
//                url: 'https://comp5347web.page.link/signinpage',
//                handleCodeInApp: false
//             };
            
//             if (user != null) {
//                 console.log("user is not null")
//                 await sendEmailVerification(auth.currentUser, actionCodeSettings);
//                 console.log("email has been sent")
//                 await signOut(auth);
//             }
//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     // const verify = async () => {
//     //     try {
//     //         await sendEmailVerification(
//     //             auth,
//     //             emailRef.current.value,
//     //             passwordRef.current.value
//     //         );  
//     //         console.log(emailRef.current.value)
//     //         console.log(user);
//     //     } catch (error) {
//     //         console.log(error.message);
//     //     }
//     // };

// //   const login = async () => {
// //     try {
// //     //   const user = await signInWithEmailAndPassword(
// //     //     auth,
// //     //     loginEmail,
// //     //     loginPassword
// //     //   );
// //         const user = await signInWithEmailAndPassword(
// //             auth,
// //             "qyn699@gmail.com",
// //             "Yql990709"
// //         );
// //       console.log(user);
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };

// //   const logout = async () => {
// //     await signOut(auth);
// //   };

//   return (
//     <div>
//         <Card>
//             <Card.Body>
//                 <h2 className="text-center mb-4">
//                     Sign Up
//                 </h2>
//                 <Form>
//                     <Form.Group id = "email">
//                         <Form.Label> Email </Form.Label>
//                         <Form.Control type="email" ref={emailRef} required/>
//                     </Form.Group>
//                     <Form.Group id = "password">
//                         <Form.Label> Password </Form.Label>
//                         <Form.Control type="password" ref={passwordRef} required/>
//                     </Form.Group>
//                     {/* <Form.Group id = "password-confirm">
//                         <Form.Label> Password Confirmation </Form.Label>
//                         <Form.Control type="password-confirm" ref={passwordConfirmRef} required/>
//                     </Form.Group> */}
//                     <Button onClick={register} className="w-100"> Sign Up</Button>
//                 </Form>
//             </Card.Body>
//         </Card>

//     <h4> User Signed Up: </h4>
//     {user?.email}

//     {/* <button onClick={logout}> Sign Out </button> */}
//   </div>
    
//   );
// }

// export default App;