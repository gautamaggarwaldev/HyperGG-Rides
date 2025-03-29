import React from "react";
import SettingForm from "./_components/SettingForm";

export const metadata = {
  title: "Settings | HyperGG Rides Admin",
  description: "Manage dealership working hours and admin users",
};

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingForm />
    </div>
  );
}
