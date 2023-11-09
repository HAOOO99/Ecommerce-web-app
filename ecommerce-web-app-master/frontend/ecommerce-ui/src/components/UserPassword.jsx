import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { auth } from "../firebase-config";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updatePassword
} from "firebase/auth";

function UserEditComponent() {
    
    const [user, setUser] = React.useState({});

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser !== null){
            setUser(currentUser);
            console.log(currentUser.email)
        } 
    });


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const oldPassword = data.get('old-pwd')
        const newPassword = data.get('new-pwd')
        console.log({
            oldpassword: oldPassword,
            new_password: newPassword,
        });

        console.log(auth.currentUser.email)

        // Empty Check
        if (oldPassword === "" || newPassword === "") {
            alert("Password cannot be empty.")
        }

        // New password check
        if (newPassword.length < 6) {
            alert("Your new password is too weak, please input a password with at least 6 characters")
            // event.stopPropagation();
        }

        // Check the old password
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                auth.currentUser.email,
                oldPassword
            );

            const updatePasswordResult = await updatePassword(auth.currentUser, newPassword);
            alert("Changed password successfully!");

        } catch (error) {
            if (error.message.includes("auth/wrong-password")) {
                alert("Wrong old password!");
            } else {
                console.log(error.message);
                alert(error.message);
            }  
        }
        
        
    };

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
                        <Typography variant="h5" sx={{ml:-1}}>  Password Setting </Typography>
                        <TextField fullWidth 
                        id="old-pwd" 
                        name="old-pwd"
                        label="Old Password" 
                        type="password" 
                        sx={{ my: 2 }}>
                        </TextField>

                        <TextField fullWidth 
                        id="new-pwd" 
                        name="new-pwd"
                        label="New Password" 
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

export default UserEditComponent;