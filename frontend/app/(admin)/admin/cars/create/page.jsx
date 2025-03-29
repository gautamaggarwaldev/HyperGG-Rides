import React from 'react'
import AddCarForm from '../_components/AddCarForm';

export const metadata = {
    title: "Cars | HyperGG Rides Admin",
    description: "HyperGG Rides Admin Cars Page",
};

const AddCarPage = () => {

  return (
    <div className='p-6'>
    <h1 className='text-2xl font-bold mb-6'>Add New Car</h1>
    <AddCarForm />
    </div>
  )
}

export default AddCarPage
