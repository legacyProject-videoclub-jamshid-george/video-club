import * as React from "react";
import "./StarRating.css";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

const StarRating = ({movieId,rateMovie,rateValue}) => {
  const [value, setValue] = React.useState(0);

  //on first load , set the value as the value that already exists in db.(initially zero, means unrated)
  React.useEffect(()=>{
    setValue(rateValue)
  },[])

 rateMovie(movieId,value);
  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Rating
        name='simple-controlled'
        value={value}
        //on click, set the rating value with user's preference
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
};

export default StarRating;
