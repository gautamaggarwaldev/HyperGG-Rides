import { getUserTestDrives } from "@/actions/testDrive";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ReservationList from "./_components/ReservationList";

export const metadata = {
  title: "My Reservations | HyperGG Rides",
  description: "Manage your test drive reservations",
};

const ReservationPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  // Fetch reservations on the server
  const reservationsResult = await getUserTestDrives();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-6xl mb-6 gradient-title">Your Reservations</h1>
      <ReservationList initialData={reservationsResult} />
    </div>
  );
};

export default ReservationPage;
