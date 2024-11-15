import React, { useState } from "react";
import { X, User, CreditCard, Check, LogOut } from "lucide-react";
import { User as UserType } from "../../types";
import { db } from "../../utilies/firebase/firebaseConfig";
import firebase from "../../utilies/firebase/firebaseConfig";
import { useEffect } from "react";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onLogout: () => void;
}

interface BillingInfo {
  plan: "free" | "pro" | "enterprise";
  interval: "monthly" | "annual";
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: [
      "Basic search functionality",
      "Limited contacts",
      "Standard support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    features: [
      "Advanced search & filters",
      "Unlimited contacts",
      "Priority support",
      "Custom tags",
      "Export functionality",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: [
      "All Pro features",
      "Custom integrations",
      "Dedicated account manager",
      "SLA support",
      "Custom reporting",
    ],
  },
];

export function UserSettingsModal({
  isOpen,
  onClose,
  user,
  onLogout,
}: UserSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [billing, setBilling] = useState<BillingInfo>({
    plan: "free",
    interval: "annual",
  });

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = db
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          setBilling({
            plan: userData?.planType || "free",
            interval: userData?.billingInterval || "annual",
          });
          console.log("Current plan:", userData?.planType);
        }
      });

    return () => unsubscribe();
  }, [user?.uid]);

  const [tempProfile, setTempProfile] = useState(user);

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile(user);
    setIsEditing(false);
  };

  const handleSelectPlan = (planId: string) => {
    console.log(user);
    fetch("http://localhost:5000/api/v1/create-subscription-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        plan: PLANS.find((p) => p.id === planId)?.price,
        customerId: user.id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json().then((json) => Promise.reject(json));
      })
      .then((session) => {
        console.log(session.url);
        window.location = session.url;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "billing"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Billing
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.firstName}
                        onChange={(e) =>
                          setTempProfile((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.lastName}
                        onChange={(e) =>
                          setTempProfile((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.title}
                        onChange={(e) =>
                          setTempProfile((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.title}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Current Plan
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-900">Pro Plan</p>
                        <p className="text-sm text-blue-700">Billed annually</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Plans
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-4 ${
                          billing.plan === plan.id
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold">{plan.name}</h4>
                          <span className="text-lg font-bold">
                            {plan.price}
                          </span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                            billing.plan === plan.id
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            billing.plan === plan.id
                              ? handleCancel()
                              : handleSelectPlan(plan.id);
                          }}
                        >
                          {billing.plan === plan.id
                            ? "Current Plan"
                            : "Select Plan"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
