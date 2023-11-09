import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { Grid, Paper } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Toolbar, Typography, TextField } from '@mui/material';
import { useCookies } from 'react-cookie';



function UserListingComponent() {

    const [pop, setPop] = React.useState(false);

    const [title, setTitle] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [stock, setStock] = React.useState(0);
    const [price, setPrice] = React.useState(0);
    const [img, setImage] = React.useState("../assets/phones/Apple.jpeg");
    const [cookies, setCookie, removeCookie] = useCookies(['email','shoppingCart','userId',"userFirstName","userLastName"]);

    const [phones, setPhones] = React.useState([]);

    function handleSubmit(e) {
        e.preventDefault();

        createNewPhone(title, brand, stock, price);
        // alert("Title: " + title + "\nBrand: " + brand + "\nStock: " + stock + "\nPrice: " + price + "\nImage: " + img);
        setPop(false);
    }

    function EnableButton(props) {
        console.log(phones);
        let isDisabled = props.disable;
        console.log("prev disabled: ", props.disable);
        if (isDisabled === undefined){
            isDisabled = false;
        } else {
            isDisabled = true;
        }
        console.log("disabled: ", isDisabled);
        if (isDisabled) {
            return (<Button color="secondary" onClick={(e) => handleEnable(e, props.id)} variant="contained" sx={{ mx: 1 }}> Enable </Button>);
        } else {
            return (<Button color="secondary" onClick={(e) => handleDisable(e, props.id)} variant="contained" sx={{ mx: 1 }}> Disable </Button>);
        }
    }

    React.useEffect(() => {
        getAllPhones()
    }, []);

    async function createNewPhone(){
        if (stock <= 0){
            alert("Stock should be a postivie integer");
        }
        if (price <= 0){
            alert("Price should be a postivie integer");
        } 
        switch (brand) {
            case "Apple": setImage("../assets/phones/Apple.jpeg");
                break;
            case "BlackBerry": setImage("../assets/phones/BlackBerry.jpeg");
             break;
            case "HTC":   setImage("../assets/phones/HTC.jpeg");
                break;
            case "Huawei": setImage("../assets/phones/Huawei.jpeg");
                break;
            case "LG":   setImage("../assets/phones/LG.jpeg");
                break;
            case "Motorola":   setImage("../assets/phones/Motorola.jpeg");
                break;
            case "Nokia":   setImage("../assets/phones/Nokia.jpeg");
                break;
            case "Samsung":   setImage("../assets/phones/Samsung.jpeg");
                break;
            case "Sony":   setImage("../assets/phones/Sony.jpeg");
                break;
            default:  setImage("../assets/phones/Apple.jpeg");
                break;
        }

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": title,
                "brand": brand,
                "image": img,
                "stock": stock,
                "seller": cookies.userId,
                "price": price,
                "reviews": [],
                "disable": false,
            })
        };
        try{
            const response = await fetch("http://localhost:3001/newPhone", config);
            const data = await response.json();
            if (data._id !== null){
                alert("Added Successfully");
            }
        } catch (e){
            console.log(e);
        }
    }

    async function getAllPhones(){
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": cookies.userId 
            })
        };
        try{
            const response = await fetch("http://localhost:3001/allPhonesBySeller", config);
            const data = await response.json();
            if (data === undefined || data.length === 0){
                alert("Nothing is found");
                return;
            } 
            setPhones(data);

        } catch (e){
            console.log(e);
        }
    }
    
    function handleAdd() {
        setPop(true);
    }

    function handleBack() {
        setPop(false);
    }

    if (pop) {
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
                    sx ={{ mx: 30}}
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            my: 2
                        }}>
                        <Toolbar>
                            <IconButton aria-label='back' onClick={handleBack}>
                                <ArrowBackIcon></ArrowBackIcon>
                            </IconButton>
                            <Typography variant="h5"> Add Listing </Typography>
                        </Toolbar>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ mx: 20, mt: 5, mb: 10 }}
                        >
                            <TextField fullWidth id="title" label="Phone Title" onChange={(event) => {
                                setTitle(event.target.value);
                            }} sx={{ my: 2 }}></TextField>

                            <TextField fullWidth id="brand" label="Phone Brand" onChange={(event) => {
                                setBrand(event.target.value);
                            }} sx={{ my: 2 }}></TextField>

                            <TextField fullWidth id="stock" label="stock" onChange={(event) => {
                                setStock(event.target.value);
                            }} sx={{ my: 2 }}></TextField>

                            <TextField fullWidth id="price" label="price" onChange={(event) => {
                                setPrice(event.target.value);
                            }} sx={{ my: 2 }}></TextField>

                            {/* <TextField fullWidth id="image" label="image" onChange={(event) => {
                                setImage(event.target.value);
                            }} sx={{ my: 2 }}></TextField> */}

                            <Button fullWidth variant="contained" type="submit" sx={{ my: 2 }}> Add</Button>

                        </Box>

                    </Paper>

                </Stack>
            </Box>
        );
    }

    async function handleRemove(e, phoneId){
        e.preventDefault()

        console.log(phoneId);
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "phoneId": phoneId
            })
        };
        try{
            const response = await fetch("http://localhost:3001/removePhone", config);
            const data = await response.json();
            if (data !== null){
                alert("removed successfully");   
            }
            getAllPhones()

        } catch (e){
            console.log(e);
        }
    }

    async function handleEnable(e, id){
        e.preventDefault();
        console.log(id);
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "phoneId": id,
            })
        };
        try{
            const response = await fetch("http://localhost:3001/enablePhone", config);
            const data = await response.json();
            if (data._id !== null){
                getAllPhones();
            }
        } catch (e){
            console.log(e);
        }
    }

    async function handleDisable(e, id){
        e.preventDefault();
        console.log(id);
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "phoneId": id,
            })
        };
        try{
            const response = await fetch("http://localhost:3001/disablePhone", config);
            const data = await response.json();
            if (data._id !== null){
                getAllPhones();
            }
        } catch (e){
            console.log(e);
        }
    }

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Toolbar>
                                <Typography variant="h6">
                                    Listing Management
                                </Typography>
                                {/* Place Holder  */}
                                <Box sx={{ flexGrow: 1 }} />

                                <Button variant="contained" onClick={handleAdd}>Add</Button>
                            </Toolbar>
                            <Divider></Divider>

                            <TableContainer component={Paper} sx={{ mt: 3, mb: 3 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="listing table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Phone Name</TableCell>
                                            <TableCell align="center">Brand</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">In Stock</TableCell>
                                            <TableCell align='center'>Operation</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {phones.map((listing) => (
                                            <TableRow
                                                key={listing._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row" sx={{ width: 400 }}>
                                                    {listing.title}
                                                </TableCell>
                                                <TableCell align="center">{listing.brand}</TableCell>
                                                <TableCell align="center"> $ {listing.price}</TableCell>
                                                <TableCell align="center"> {listing.stock}</TableCell>
                                                <TableCell align="center">

                                                    <EnableButton disable={listing.disable} id={listing._id}></EnableButton>
                                                    <Button variant="contained" onClick={(e) => handleRemove(e, listing._id)} sx={{ mx: 1 }}> Remove </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider variant="middle" />


                        </Paper>
                    </Grid>
                </Grid>
            </Container>

        </Box>
    );
}

export default UserListingComponent;