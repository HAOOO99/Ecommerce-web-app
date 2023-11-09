import { Box, Button, TextField} from '@mui/material';
import * as React from 'react';


function PopUpAddListingComponent() {

    const [title, setTitle] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [stock, setStock] = React.useState(0);
    const [price, setPrice] = React.useState(0);
    const [img, setImage] = React.useState("");

    function handleSubmit(e) {
        e.preventDefault();
        alert("Title: " + title + "\nBrand: " + brand + "\nStock: " + stock + "\nPrice: " + price + "\nImage: " + img);
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mx: 100, mt: 5, mb: 10 }}
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

            <TextField fullWidth id="image" label="image" onChange={(event) => {
                setImage(event.target.value);
            }} sx={{ my: 2 }}></TextField>

            <Button fullWidth variant="contained" type="submit" sx={{ my: 2 }}> Add</Button>

        </Box>

    );
}

export default PopUpAddListingComponent;