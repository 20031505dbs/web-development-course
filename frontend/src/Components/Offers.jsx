
import React from "react";
import {Box,Typography,Paper} from '@mui/material'


const offers=[
    'Flat 50% Off on Sarees',
    'Buy 1 Get 1 Free on Kurtas'
]
function Offers() {


    return(
        <>
        <Box sx={{my:5}}>
            <Typography variant="h4" gutterBottom>
                Exclusive Offers
            </Typography>
            <Box sx={{display:'flex',gap:2,justifyContent:'center'}}></Box>
            {offers.map((offer,index)=>(

                <Paper key={index} sx={{p:2,backgroundColor:'#fic40f',color:'black',}}>
                {offer}
            </Paper>
            ))}
        </Box>
        
        </>
    )
    
}

export default Offers;