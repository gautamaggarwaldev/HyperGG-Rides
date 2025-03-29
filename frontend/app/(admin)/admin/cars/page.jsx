import React from 'react'
import CarList from './_components/CarList';

export const metadata = {
    title: "Cars | HyperGG Rides Admin",
    description: "HyperGG Rides Admin Cars Page",
};

const CarsPage = () => {


    
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'> Cars Management</h1>
      <CarList />
    </div>
  )
}

export default CarsPage
