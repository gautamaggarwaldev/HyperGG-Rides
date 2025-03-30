"use client";
import React, { useState } from "react";

function EmiCalculator({ price = 100000 }) {
  const [carValue, setCarValue] = useState(price);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(3);

  const downPaymentAmount = (carValue * downPaymentPercent) / 100;
  const loanAmount = carValue - downPaymentAmount;

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const { emi, totalInterest, totalPayment } = calculateEMI();

  // Custom compact currency formatter for limited space
  const formatCompactCurrency = (value) => {
    if (value >= 10000000) { // 1 crore+
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) { // 1 lakh+
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-2 md:p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          HyperGG Rides - Car Loan EMI Calculator
        </h1>

        <div className="grid md:grid-cols-2 gap-3">
          {/* Left Column - Inputs */}
          <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Loan Parameters
            </h2>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Car Value
              </label>
              <div className="flex items-center mb-1">
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-12">
                  ₹1L
                </span>
                <input
                  type="range"
                  min="100000"
                  max="20000000"
                  value={carValue}
                  onChange={(e) => setCarValue(Number(e.target.value))}
                  className="flex-grow h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mx-1"
                />
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-12 text-right">
                  ₹2Cr
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">₹</span>
                <input
                  type="number"
                  value={carValue}
                  onChange={(e) => setCarValue(Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Down Payment ({downPaymentPercent}%)
              </label>
              <div className="flex items-center mb-1">
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-6">0%</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="flex-grow h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mx-1"
                />
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-8 text-right">50%</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">₹</span>
                <input
                  type="number"
                  value={downPaymentAmount}
                  onChange={(e) =>
                    setDownPaymentPercent(Math.min(((e.target.value / carValue) * 100), 50))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interest Rate (%)
              </label>
              <div className="flex items-center mb-1">
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-6">7%</span>
                <input
                  type="range"
                  min="7"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="flex-grow h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mx-1"
                />
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-8 text-right">15%</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={interestRate}
                  min="7"
                  max="15"
                  step="0.1"
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">%</span>
              </div>
            </div>

            <div className="mb-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Loan Tenure (Years)
              </label>
              <div className="flex items-center mb-1">
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-6">1</span>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="flex-grow h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mx-1"
                />
                <span className="inline-block text-xs text-gray-600 dark:text-gray-400 w-6 text-right">7</span>
              </div>
              <input
                type="number"
                value={loanTenure}
                min="1"
                max="7"
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white dark:bg-gray-800 rounded-md p-3 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Loan Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Car Value
                </h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactCurrency(carValue)}
                </p>
              </div>

              <div className="flex justify-between items-center pb-1 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Down Payment ({downPaymentPercent}%)
                </h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactCurrency(downPaymentAmount)}
                </p>
              </div>

              <div className="flex justify-between items-center pb-1 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Loan Amount
                </h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactCurrency(loanAmount)}
                </p>
              </div>

              <div className="flex justify-between items-center pb-1 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 p-2 rounded">
                <h3 className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  Monthly EMI
                </h3>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  {formatCompactCurrency(emi)}
                </p>
              </div>

              <div className="flex justify-between items-center pb-1 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Total Interest Payable
                </h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactCurrency(totalInterest)}
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Total Amount Payable
                </h3>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatCompactCurrency(totalPayment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
            How is EMI calculated?
          </h3>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            EMI = P × r × (1 + r)^n/((1 + r)^n - 1), where P is Principal (loan amount), r is monthly interest rate, and n is total number of months.
          </p>
          <div className="mt-2 pl-2 border-l-2 border-yellow-400 dark:border-yellow-600">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Tip: A higher down payment will reduce your EMI and total interest payable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmiCalculator;