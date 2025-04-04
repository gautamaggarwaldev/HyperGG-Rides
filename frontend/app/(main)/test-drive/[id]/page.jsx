import { getCarById } from "@/actions/carListing";
import { notFound } from "next/navigation";
import React from "react";
import TestDriveForm from "./_components/TestDriveForm";

export async function generateMetadata() {
  return {
    title: `Book Test Drive | HyperGG Rides`,
    description: `Schedule a test drive in few seconds`,
  };
}

const TestDrivePage = async ({ params }) => {
  const { id } = params;
  const result = await getCarById(id);

  if (!result.success) notFound();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-6xl mb-6 gradient-title">
        Book a Test Drive With Us !!
      </h1>

      <TestDriveForm
        car={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
};

export default TestDrivePage;
