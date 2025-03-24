import React, { useState } from 'react'

export const Home = () => {
    const [role,setRole]=useState();
    const token =sessionStorage.getItem("token");
    const {rol}=token?JSON.parse("token"):{};
    setRole(rol);
  return (
    <div>
        {role ==="admin"? (
         ""
        ):("")}
        

    </div>
  )
}
