import { getCarById } from "@/actions/carListing";
import { notFound } from "next/navigation";
import React from "react";
import CarDetail from "./_components/CarDetail";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = await getCarById(id);

  if (!result.success) {
    return {
      title: "Car Not Found | HyperGG Rides",
      description: "The requested car could not be found",
    };
  } 
  const car = result.data;

  return {
    title: `${car.year} ${car.make} ${car.model} | HyperGG Rides`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}
const CarPage = async ({ params }) => {
  const { id } = await params;
  const result = await getCarById(id);

  if(!result.success) {
    notFound();
  }

  return <div className="container mx-auto px-4 py-12">
    <CarDetail car={result.data} testDriveInfo={result.data.testDriveInfo} />
  </div>;
};

export default CarPage;
