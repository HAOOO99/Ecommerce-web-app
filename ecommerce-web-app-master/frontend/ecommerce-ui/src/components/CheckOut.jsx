// import * as React from 'react';
import React, { useRef, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TopBarHome from './TopBarHome';
import Typography from '@mui/material/Typography';
import { Button, CardActions, Divider, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepOrange } from '@mui/material/colors';
import { borderRight, Box } from '@mui/system';
import { integerPropType } from "@mui/utils";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";



const theme = createTheme({
    palette: {
        primary: {
            main: deepOrange[500],
        },
    },
});


function CheckOut() {
    const [rowsData, setRowsData] = useState([])
    const [cookies, setCookie] = useCookies(['email', 'shoppingCart']);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    React.useEffect(() => {
        // Check if the page is visited by raw url
        if (cookies.email === undefined) {
            navigate('/login');
            alert('Please Log In First!');
            return;
        }

        // Copy Paste Cookie Shopping Cart
        rollback();

    }, []);

    const deleteTableRows = (index) => {
        // rows.splice(index, 1);
        // setRowsData(rows);
        // console.log(rows);
    }

    function handleChange(e, index, newValue){
        e.preventDefault()
        if (index < 0 || index >= rowsData.length){
            return;
        }
        let temp = [];
        for (var i = 0; i<rowsData.length; i++){
            temp.push(rowsData[i]);
        }
        temp[index].count = parseInt(newValue);
        setRowsData(temp);
    }

    // sync all states to the cookies, which might be updated in the page
    function rollback(){
        let cart = []        
        let sum = 0;
        for (var i = 0; i< cookies.shoppingCart.length; i++){
            cart.push({"id":cookies.shoppingCart[i].id,
            "count":parseInt(cookies.shoppingCart[i].count),
            "phoneName":cookies.shoppingCart[i].phoneName,
            "price":parseFloat(cookies.shoppingCart[i].price),
            "stock":parseInt(cookies.shoppingCart[i].stock)});
            sum += parseInt(cookies.shoppingCart[i].price) * parseInt(cookies.shoppingCart[i].count)
        }

        setRowsData(cart);
        setTotal(sum);
    }

    function handleRemove(e, index){
        e.preventDefault();
        if (index < 0 || index >= rowsData.length){
            return;
        }
        console.log("REMOVE");
        let cart = [];
        let sum = 0;
        for (var i = 0 ; i<rowsData.length; i++){
            if (i === index){
                continue;
            }
            cart.push({
                "id":rowsData[i].id,
                "count":parseInt(rowsData[i].count),
                "phoneName":rowsData[i].phoneName,
                "price":parseFloat(rowsData[i].price),
                "stock":parseInt(rowsData[i].stock)
            });
            sum += parseInt(rowsData[i].price) * parseInt(rowsData[i].count)
        }
        setCookie('shoppingCart', 
            JSON.stringify(cart),
            {'path': '/'}
        );
        setRowsData(cart);
        setTotal(sum);
    }

    function handleUpdate(e, index){
        e.preventDefault()
        if (index < 0 || index >= rowsData.length){
            return;
        }

        if (rowsData[index].count < 0){
            alert("Quantity should be a positive integer.");
            return;
        }

        console.log("Update");
        let stock= cookies.shoppingCart[index].stock;
        if (rowsData[index].count > stock){
            alert("There are only " + stock + " phones left, you can not exceed it");
            return;
        } else {
            let cart = []        
            let sum = 0;
            console.log("SUCCESS IN UPDATE");
            if (rowsData[index].count === 0){
                console.log("REMOVE")
                for (var i = 0; i< rowsData.length; i++){
                    if (i === index){
                        continue;
                    }
                    cart.push({"id":rowsData[i].id,
                    "count":parseInt(rowsData[i].count),
                    "phoneName":rowsData[i].phoneName,
                    "price":parseFloat(rowsData[i].price),
                    "stock":parseInt(rowsData[i].stock)});
                    sum += parseInt(rowsData[i].price) * parseInt(rowsData[i].count)
                }
            } else {
                for (var i = 0; i< rowsData.length; i++){
                    cart.push({"id":rowsData[i].id,
                    "count":parseInt(rowsData[i].count),
                    "phoneName":rowsData[i].phoneName,
                    "price":parseFloat(rowsData[i].price),
                    "stock":parseInt(rowsData[i].stock)});
                    sum += parseInt(rowsData[i].price) * parseInt(rowsData[i].count)
                }

            }
            setCookie('shoppingCart', 
                JSON.stringify(cart),
                {'path': '/'}
            );

            setRowsData(cart);

            console.log(cookies.shoppingCart);
            setTotal(sum);

        }
        console.log(rowsData);
        console.log(cookies.shoppingCart);
    }

    function handleBack(){
        navigate('/');
    }

    async function checkout() {

        const cart = [];
        for (var i = 0; i<cookies.shoppingCart.length; i++){
            cart.push({"id":cookies.shoppingCart[i].id,
                "count":parseInt(cookies.shoppingCart[i].count)
            });
        }

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                cart
            )
        };
        try{
            const response = await fetch("http://localhost:3001/checkout", config);
            const data = await response.json();
            console.log(data);
            if (data === "OK"){
                setCookie('shoppingCart', "");
                
                alert("Your cart is empty!");
                navigate('/');
                return;
            }
        } catch (e){
            console.log(e);
        }
    }

    function handleCheckout(){
        checkout();
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopBarHome></TopBarHome>
            <main>
                {/* <Container sx={{
                    py: 3,
                    mx: "auto"
                }}> */}

                <Typography variant="h5" component="div" sx={{ py: 3, px: 3 }}>
                    Your Shopping Items
                </Typography>

                <Container sx={{
                    py: 5,
                    mx: "auto"
                }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody id="table">
                                {rowsData.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                                    >
                                        <TableCell component="th" scope="row">
                                            {row.phoneName}
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField id="phone-quantity" type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                size="small"
                                                style={{ width: '30%' }}
                                                variant="outlined"
                                                value={row.count}
                                                onChange={(e) => handleChange(e, index, e.target.value)}
                                            >

                                            </TextField>
                                            <Button variant="contained" sx={{ mx: 3 }}
                                                // onChange={()=>ChangePrice(index)} 
                                                onClick={(e) => handleUpdate(e, index)}>Update</Button>
                                        </TableCell>
                                        <TableCell align="right">${row.price}</TableCell>
                                        <TableCell align="right">
                                            <Button variant="contained" onClick={(e)=>handleRemove(e,index)}>Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>


                        </Table>
                    </TableContainer>


                </Container>
                <Divider variant="middle" />
                <Container sx={{
                    mx: "auto",

                }}>

                    <Typography variant="h6" component="span" sx={{ ml: 115 }}>Total: ${total}</Typography>

                </Container>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ my: 5 }}>
                        <Grid item xs={5}>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={handleBack}> Back</Button>
                            <Button variant="contained" onClick={handleCheckout} sx={{ mx: 3 }}> Confirm</Button>
                        </Grid>
                        <Grid item xs={5}>
                        </Grid>
                        {/* <Grid item xs={6} >
                        
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained"> Confirm</Button>
                    </Grid>
                     */}
                    </Grid>
                </Box>
            </main>
        </ThemeProvider>
    );
}

export default CheckOut;