import { Outlet } from "react-router-dom";
import React from 'react'

const PasswordMain = () => {
    return (
        <section className='w-full flex justify-center'>
            <Outlet />
        </section>
    )
}

export default PasswordMain ;
