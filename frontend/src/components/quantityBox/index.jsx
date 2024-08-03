// import React, { useState, useEffect } from 'react';

// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// const QuantityBox = (props) => {
//     const [inputValue, setinputValue] = useState(1);
//     const [cartItems, setcartItems] = useState([]);

//     useEffect(() => {
//         setcartItems(props.cartItems);
//         //setinputValue(props.item.quantity)
//     }, [props.cartItems])

//     const updateCart=(items)=>{
//         props.updateCart(items)
//     }

//     // const plus = () => {
//     //     setinputValue(inputValue + 1)
//     // }

//     // const minus = () => {
//     //     if (inputValue !== 1) {
//     //         setinputValue(inputValue - 1)
//     //     }
//     // }

//     return (
//         <div className='addCartSection pt-4 pb-4 d-flex align-items-center '>
//             <div className='counterSec mr-3'>
//                 <input type='number' value={inputValue} />
//                 <span className='arrow plus'

//                    onClick={
//                     () => {
//                         setinputValue(inputValue + 1);
//                         const _cart = props.cartItems?.map((cartItem, key) => {
//                             return key === parseInt(props.index) ? { ...cartItem, quantity: inputValue+1 } : {...cartItem}

//                         });

//                         updateCart(_cart);
//                         setcartItems(_cart);

//                     }
//                 }

//                 ><KeyboardArrowUpIcon /></span>

//                 <span className='arrow minus'
//                  onClick={
//                         () => {
//                             if (inputValue !== 1) {
//                                 setinputValue(inputValue - 1)
//                             }

//                             const _cart = props.cartItems?.map((cartItem, key) => {
//                                 return key === parseInt(props.index) ? { ...cartItem, quantity: cartItem.quantity !== 1 ? inputValue-1 : cartItem.quantity } : {...cartItem}
//                             });

//                             updateCart(_cart);
//                             setcartItems(_cart);

//                         }
//                     }
//                 ><KeyboardArrowDownIcon /></span>
//             </div>

//         </div>
//     )
// }

// export default QuantityBox;

import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";

const QuantityBox = (props) => {
  const [inputValue, setInputValue] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setInputValue(props.item.quantity);
  }, [props.item.quantity]);

  const updateCart = (items) => {
    props.updateCart(items);
  };

  const handleIncrease = () => {
    if (inputValue < 10) {
      // Max quantity limit set to 10
      const newValue = inputValue + 1;
      setInputValue(newValue);
      const updatedCart = props.cartItems.map((cartItem, key) =>
        key === parseInt(props.index)
          ? { ...cartItem, quantity: newValue }
          : cartItem
      );
      updateCart(updatedCart);
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
    }
  };

  const handleDecrease = () => {
    if (inputValue > 1) {
      const newValue = inputValue - 1;
      setInputValue(newValue);
      const updatedCart = props.cartItems.map((cartItem, key) =>
        key === parseInt(props.index)
          ? { ...cartItem, quantity: newValue }
          : cartItem
      );
      updateCart(updatedCart);
      setShowTooltip(false);
    }
  };

  return (
    <div className="addCartSection pt-4 pb-4 d-flex align-items-center">
      <div className="counterSec mr-3">
        <input type="number" value={inputValue} readOnly />
        <Tooltip
          title="Maximum quantity reached (10)"
          open={showTooltip}
          disableHoverListener
          arrow
        >
          <span className="arrow plus" onClick={handleIncrease}>
            <KeyboardArrowUpIcon />
          </span>
        </Tooltip>
        <span className="arrow minus" onClick={handleDecrease}>
          <KeyboardArrowDownIcon />
        </span>
      </div>
    </div>
  );
};


export default QuantityBox;

