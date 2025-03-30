import { getSavedCar } from '@/actions/carListing';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { SavedCarList } from './_components/SavedCarList';

export const metadata = {
    title: "Saved Cars | HyperGG Rides",
    description: "View your saved cars and favorites",
  };

const SavedCarsPage = async() => {

    const { userId } = await auth();
    if(!userId) {
        redirect("/sign-in?redirect=/saved-cars");
    }

    const savedCarsResult = await getSavedCar();

    
  return (
    <div className='container mx-auto px-4'>
      <h1 className='text-6xl mb-6 gradient-title'>Your Saved Cars</h1>
      <SavedCarList initialData={savedCarsResult} />
    </div>
  );
}

export default SavedCarsPage;
