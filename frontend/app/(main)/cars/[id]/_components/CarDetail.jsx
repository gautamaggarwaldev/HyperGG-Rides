"use client";

import { toggleSavedCar } from "@/actions/carListing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useFetch from "@/hooks/useFetch";
import { formatCurrency } from "@/lib/helper";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Car,
  Currency,
  Fuel,
  Gauge,
  Heart,
  LocateFixed,
  MessageSquare,
  Share2,
  Info,
  Clock,
  Phone,
  Mail,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import EmiCalculator from "./EmiCalculator";

const CarDetail = ({ car, testDriveInfo }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  const handleSaveCar = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;

    await toggleSavedCarFn(car.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on Vehiql!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test drive");
      router.push("/sign-in");
      return;
    }
    router.push(`/test-drive/${car.id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section - Full Width with Gradient Overlay */}
      <div className="relative h-[500px] w-full bg-black">
        {car.images && car.images.length > 0 ? (
          <Image
            src={car.images[currentImageIndex]}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            className="object-cover opacity-90"
            priority
            quality={100}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
            <Car className="h-32 w-32 text-gray-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content Container */}
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-12">
          {/* Badges */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="px-3 py-1.5">
              {car.bodyType}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              {car.transmission}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              {car.fuelType}
            </Badge>
          </div>

          {/* Title and Price */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1.5">
                  <Gauge className="h-5 w-5" />
                  <span>{car.mileage.toLocaleString()} miles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Car className="h-5 w-5" />
                  <span>{car.color}</span>
                </div>
              </div>
            </div>

            <div className="text-4xl font-bold text-white">
              {formatCurrency(car.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
                  {car.images &&
                    car.images.length > 1 &&
                    car.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative rounded-lg h-24 w-32 flex-shrink-0 transition-all duration-200 ${
                          index === currentImageIndex
                            ? "ring-4 ring-blue-500 scale-[1.02]"
                            : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${car.year} ${car.make} ${car.model} - view ${
                            index + 1
                          }`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </button>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant={isWishlisted ? "default" : "outline"}
                    className={`flex-1 gap-2 ${
                      isWishlisted ? "bg-red-600 hover:bg-red-700" : ""
                    }`}
                    onClick={handleSaveCar}
                    disabled={savingCar}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`}
                    />
                    {isWishlisted ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Description */}
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="h-6 w-6 text-blue-600" />
                  About This Vehicle
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {car.description ||
                    "No description provided for this vehicle."}
                </p>
              </CardContent>
            </Card>

            {/* Features & Specifications */}
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold">Highlights</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{car.transmission} Transmission</span>
                    </li>
                    <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{car.fuelType} Engine</span>
                    </li>
                    <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{car.bodyType} Body Style</span>
                    </li>
                    {car.seats && (
                      <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{car.seats} Seats</span>
                      </li>
                    )}
                    <li className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{car.color} Exterior</span>
                    </li>
                  </ul>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-500 mb-2">
                        General
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make</span>
                          <span className="font-medium">{car.make}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model</span>
                          <span className="font-medium">{car.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year</span>
                          <span className="font-medium">{car.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Body Type</span>
                          <span className="font-medium">{car.bodyType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-500 mb-2">
                        Performance
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Type</span>
                          <span className="font-medium">{car.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission</span>
                          <span className="font-medium">
                            {car.transmission}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mileage</span>
                          <span className="font-medium">
                            {car.mileage.toLocaleString()} miles
                          </span>
                        </div>
                        {car.seats && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Seats</span>
                            <span className="font-medium">{car.seats}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Price & Test Drive */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Price</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(car.price)}
                  </div>
                </div>

                {car.status === "SOLD" || car.status === "UNAVAILABLE" ? (
                  <Alert variant="destructive">
                    <AlertTitle className="capitalize">
                      This car is {car.status.toLowerCase()}
                    </AlertTitle>
                    <AlertDescription>
                      Please check again later.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button
                    size="lg"
                    className="w-full py-6 text-lg"
                    onClick={handleBookTestDrive}
                    disabled={testDriveInfo.userTestDrive}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {testDriveInfo.userTestDrive
                      ? `Test Drive Booked`
                      : "Schedule Test Drive"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Financing Options */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-medium mb-2">
                          <Currency className="h-6 w-6 text-blue-600" />
                          <h3>Financing Options</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          Estimated Monthly Payment
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(car.price / 60)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          *Based on ₹0 down payment and 4.5% interest rate for
                          60 months
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Payment Calculator</DialogTitle>
                  <EmiCalculator price={car.price} />
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Contact & Dealership */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Contact Options */}
                <div>
                  <div className="flex items-center gap-2 text-lg font-medium mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <h3>Contact Us</h3>
                  </div>
                  <div className="space-y-3">
                    <a href="mailto:queryhyperggrides2324@gmail.com">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                      >
                        <Mail className="h-5 w-5" />
                        Email Us
                      </Button>
                    </a>
                    {testDriveInfo.dealership?.phone && (
                      <a href="contactto:+91 96547 XXXXX">
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2"
                        >
                          <Phone className="h-5 w-5" />
                          Call Dealership
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* Dealership Info */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-lg font-medium mb-4">
                    <LocateFixed className="h-6 w-6 text-blue-600" />
                    <h3>Dealership</h3>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium">Vehiql Motors</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {testDriveInfo.dealership?.address ||
                        "Address not available"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center mb-3">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Hours of Operation
                    </h4>
                    <div className="space-y-2 text-sm">
                      {testDriveInfo.dealership?.workingHours
                        ? testDriveInfo.dealership.workingHours
                            .sort((a, b) => {
                              const days = [
                                "MONDAY",
                                "TUESDAY",
                                "WEDNESDAY",
                                "THURSDAY",
                                "FRIDAY",
                                "SATURDAY",
                                "SUNDAY",
                              ];
                              return (
                                days.indexOf(a.dayOfWeek) -
                                days.indexOf(b.dayOfWeek)
                              );
                            })
                            .map((day) => (
                              <div
                                key={day.dayOfWeek}
                                className="flex justify-between"
                              >
                                <span className="text-gray-600">
                                  {day.dayOfWeek.charAt(0) +
                                    day.dayOfWeek.slice(1).toLowerCase()}
                                </span>
                                <span className="font-medium">
                                  {day.isOpen
                                    ? `${day.openTime} - ${day.closeTime}`
                                    : "Closed"}
                                </span>
                              </div>
                            ))
                        : [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day, index) => (
                            <div key={day} className="flex justify-between">
                              <span className="text-gray-600">{day}</span>
                              <span className="font-medium">
                                {index < 5
                                  ? "9:00 - 18:00"
                                  : index === 5
                                  ? "10:00 - 16:00"
                                  : "Closed"}
                              </span>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
