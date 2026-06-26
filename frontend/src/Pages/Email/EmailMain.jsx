import { Outlet } from "react-router-dom";
import React from 'react'

const EmailMain = () => {
    return (
        <section className='w-full flex justify-center'>
            <Outlet />
        </section>
    )
}

export default EmailMain ;
