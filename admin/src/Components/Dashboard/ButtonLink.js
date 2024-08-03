import React, { useEffect ,useState} from "react";
import {Link,useLocation} from "react-router-dom"
import {Button,Typography,useMediaQuery} from "@mui/material"
import {useDispatch} from "react-redux"
import { openMenu,closeMenu } from "../Redux/MenuSlice";

const ButtonLink = ({text,path}) => {
  const dispatch = useDispatch()
    const [active, setActive] = useState(false)
    const location = useLocation();

    const isMobile = useMediaQuery('(max-width:900px)'); 

    const handleClick = () => {
      if (isMobile) {
        dispatch(closeMenu())
      }
    };

    useEffect(()=>{
        console.log(location.pathname)
        if(location.pathname === path){
            setActive(true)
        }
        else{
            setActive(false)
        }
    },[location])
  return (
    <Button
        variant={active?"contained":"text"}
      sx={{
        display: "flex",
        padding:"8px",
        textDecoration: "none",
        color: "#a6d0e4",
        backgroundColor:active?"white":"transparent",
        width:"100%",
        justifyContent:"center",
        marginBottom:"5px"
      }}
      onClick={handleClick}
      to={path}
      LinkComponent={Link}
    >
      <Typography variant="body1" ml={1} sx={{fontWeight:'700',color:'black'}}>
        {text}
      </Typography>
    </Button>
  );
};

export default ButtonLink;
