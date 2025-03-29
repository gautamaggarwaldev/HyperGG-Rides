import { getCarFilters } from '@/actions/carListing';
import React from 'react'
import CarFilter from './_components/CarFilter';
import CarListing from './_components/CarListing';

export const metadata = {
    title: "Cars | HyperGG Rides",
    description: "Browse and search your dream car",
};

const CarsPage = async () => {

    const filtersData = await getCarFilters();
    
  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-6xl mb-4 gradient-title'>Browse Cars</h1>

      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='w-full lg:w-80 flex-shrink-0'>
            {/* filters */}
            <CarFilter filters={filtersData.data}/>
        </div>


        <div className='flex-1'>
            {/* listing */}
            <CarListing />
        </div>
      </div>
    </div>
  )
}

export default CarsPage
