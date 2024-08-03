import { Box } from '@mui/material'
import React from 'react'

const Pagination = ({value,onChange,total}) => {
  return (
    <Box>
        Page <input type='number' value={value} onChange={(e)=>onChange(e)} style={{width:"60px"}}/>  out of {Math.ceil(total)}
    </Box>
  )
}

export default Pagination