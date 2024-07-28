import React from 'react'
import Payroll from '../../../components/Payroll';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
    title: "Payroll",
};

const page = () => {
  return (
    <Payroll />
  )
}

export default page;