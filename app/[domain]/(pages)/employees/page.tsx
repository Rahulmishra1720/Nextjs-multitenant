import React from 'react';
import { Metadata } from 'next/types';
import Employee from '../../../components/Employee';

export const metadata: Metadata = {
    title: "Employees",
};

const page = () => {
    return (
        <Employee />
    )
};

export default page;