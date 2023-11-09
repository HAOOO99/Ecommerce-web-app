import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { auth } from "../firebase-config";
import {useCookies} from 'react-cookie';

function UserEditComponent() {

    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const firstName = data.get('firstname')
        const lastName = data.get('lastname')

        console.log({
            firstName: firstName,
            lastName: lastName
        });
        
        // Update names in firebase
        const displayName = firstName + " " + lastName;
        try {
            await updateProfile(auth.currentUser, 
                {displayName: displayName, photoURL: ""});
            
        } catch (error) {
            console.log(error.message);
            alert("Failed to update the user name\n" + error.message);
        }
        console.log(auth.currentUser.displayName)

        // Update names in DB
        updateProfile(cookies.userId, firstName, lastName, cookies.email);
    }

    async function updateProfile(id, firstName, lastName, email){
        if (id === null || firstName === null || lastName === null || email === null){
            return;
        }
        if (id === undefined || firstName === undefined || lastName === undefined || email === undefined){
            return;
        }
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
                setCookie("userFirstName", firstName);
                setCookie("userLastName", lastName);
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
                    {/* <Box>
                        Hello, {auth.currentUser.disp}
                    </Box> */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mx: 20, mt: 5, mb: 10 }}
                    >
                        <Typography variant="h5"> Profile Info </Typography>
                        <TextField fullWidth 
                        id="firstname" 
                        name='firstname'
                        defaultValue={cookies.userFirstName}
                        label="First Name" 
                        // onChange={(event)=>{
                        //     setFirst(event.target.value);
                        // }} 
                        sx={{ my: 2 }}></TextField>

                        <TextField fullWidth 
                        id="lastname" 
                        name='lastname'
                        defaultValue={cookies.userLastName}
                        label="Last Name" 
                        // onChange={(event)=>{
                        //     setLast(event.target.value);
                        // }} 
                        sx={{ my: 2 }}></TextField>

                        <Button fullWidth variant="contained" type="submit" sx={{my: 2}}> Submit</Button>

                    </Box>


                </Paper>

            </Stack>
        </Box>
    );
}

export default UserEditComponent;