import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { auth } from "../firebase-config";
import {useCookies} from 'react-cookie';

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged,
    signOut,
    verifyBeforeUpdateEmail
} from "firebase/auth";
import validator from 'validator'
import { useNavigate } from "react-router-dom";


function UserChangeEmail() {
    
    const [user, setUser] = React.useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);


    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser !== null){
            setUser(currentUser);
            console.log("Current User is not null" + currentUser.email)
        } 
    });

    const navigate = useNavigate();
    const handleLogInTransit = () =>{
        navigate('/login');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')
        const password = data.get('password')
        console.log({
            email: email,
            password: password,
        });

        console.log(auth.currentUser.email)

        // New email validate
        if (!validator.isEmail(email)) {
            alert("Invalid Email Format!")
        }

        // Update email in firebase
        const actionCodeSettings = {
            url: 'https://comp5347web.page.link/signinpage',
            handleCodeInApp: false
        };

        try {
            // Need to reauthenticateWithCredential to update the email
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            )
            const result = await reauthenticateWithCredential(
                auth.currentUser, 
                credential
            )
        } catch (error) {
            if (error.message.includes("auth/wrong-password")) {
                alert("Wrong password!");
            } else {
                console.log(error.message);
                alert(error.message);
            }  
            console.log(error.message);
        }

        try {
            // Update email
            if (email != auth.currentUser.email) {
                await verifyBeforeUpdateEmail(auth.currentUser, email, actionCodeSettings);
                updateProfile(cookies.userId,cookies.userFirstName,cookies.userLastName,email);
                alert("The verification email has sent to your new email address!\n" +
                "Please check your mailbox~");
                await signOut(auth);
                handleLogInTransit();
            } else {
                console.log("You input the same email, no need to update");
            }
        } catch (error) {
            if (error.messgae.includes("(auth/email-already-in-use)")) {
                alert("This email is already in use!\nFailed to update the email");
            } else {
                console.log(error.message);
                alert("Failed to update the email\n" + error.message);
            }     
        }
        
        
    };

    async function updateProfile(id, firstName, lastName, email){
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": id,
                "userInfo": {
                    "firstname": firstName,
                    "lastname": lastName,
                    "email": email,
                },
            })
        };
        try{
            const response = await fetch("http://localhost:3001/updateUserInfo", config);
            const data = await response.json();
            console.log(data);
            if (data !== undefined && data !== null) {
                alert("update successful");
                // setCookie("email", email);
                return;
            }
        } catch (e){
            console.log(e);
        }
    }

    return (
        <Box sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        }}>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        my: 10
                    }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mx: 20, mt: 5, mb: 10 }}
                    >
                        <Typography variant="h5" sx={{ml:-1}}>  Email Setting </Typography>
                        

                        <TextField fullWidth 
                        id="email" 
                        name="email"
                        label="New Email" 
                        sx={{ my: 2 }}>
                        </TextField>

                        <TextField fullWidth 
                        id="password" 
                        name="password"
                        label="Your Password" 
                        type="password" 
                        sx={{ my: 2 }}>
                        </TextField>

                        <Button fullWidth 
                        variant="contained" 
                        type="submit" 
                        sx={{my: 2}}> 
                        Confirm
                        </Button>

                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
}

export default UserChangeEmail;