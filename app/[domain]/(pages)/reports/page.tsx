import React from 'react'
import Report from '../../../components/Report';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
    title: "Reports",
};

const page = () => {
    return (
        <Report />
    )
}

export default page;