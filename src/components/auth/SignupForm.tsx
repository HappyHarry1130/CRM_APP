import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Building2,
  MapPin,
  Globe,
  Briefcase,
} from "lucide-react";
import { SignupData } from "../../types";
import { db } from "../../utilies/firebase/firebaseConfig";
import firebase from "../../utilies/firebase/firebaseConfig";

interface SignupFormProps {
  step: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (data: SignupData) => void;
}

const COMPANY_STAGES = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E",
  "Growth",
];

export function SignupForm({
  step,
  onNextStep,
  onPrevStep,
  onSubmit,
}: SignupFormProps) {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    title: "",
    companyName: "",
    website: "",
    location: "",
    industry: "",
    size: "",
    stage: "",
    problem: "",
    solution: "",
    uniqueValue: "",
    competition: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check passwords match when either password field changes
    if (name === "password" || name === "passwordConfirm") {
      if (
        name === "password" &&
        formData.passwordConfirm &&
        value !== formData.passwordConfirm
      ) {
        setPasswordError("Passwords do not match");
      } else if (name === "passwordConfirm" && value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 10);
  const saveUserData = async (userData: SignupData, uid: string) => {
    try {
      await db
        .collection("users")
        .doc(uid)
        .set({
          firstName: userData.firstName,
          lastName: userData.lastName,
          title: userData.title,
          email: userData.email,
          planType: "free",
          connects: 10,
          trialEndDate: trialEndDate,
          trialActive: true,
          billingInterval: "monthly",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          company: {
            name: userData.companyName,
            website: userData.website,
            location: userData.location,
            industry: userData.industry,
            stage: userData.stage,
            size: userData.size,
          },
          companyDetails: {
            problem: userData.problem,
            solution: userData.solution,
            uniqueValue: userData.uniqueValue,
            competition: userData.competition,
          },
        });

      // await db.collection("companies").doc(uid).set({
      //   name: userData.companyName,
      //   website: userData.website,
      //   location: userData.location,
      //   industry: userData.industry,
      //   stage: userData.stage,
      //   size: userData.size,
      //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      // });

      // await db.collection("companyDetails").doc(uid).set({
      //   problem: userData.problem,
      //   solution: userData.solution,
      //   uniqueValue: userData.uniqueValue,
      //   competition: userData.competition,
      //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      // });
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && formData.password !== formData.passwordConfirm) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (step < 4) {
      onNextStep();
    } else {
      try {
        const userCredential = await firebase
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData.password);

        if (userCredential.user) {
          await saveUserData(formData, userCredential.user.uid);
          onSubmit(formData);
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md ${
                    passwordError ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Position/Title
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  required
                  placeholder="e.g. CEO, CTO, Founder"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700"
              >
                Website
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="www.example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="City, State, Country"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Industry
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="industry"
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                    placeholder="e.g. Artificial Intelligence, SaaS"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="stage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stage
                </label>
                <select
                  name="stage"
                  id="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  required
                >
                  <option value="">Select Stage</option>
                  {COMPANY_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-gray-700"
              >
                Problem Statement
              </label>
              <div className="mt-1">
                <textarea
                  name="problem"
                  id="problem"
                  rows={3}
                  value={formData.problem}
                  onChange={handleChange}
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="What problem are you solving?"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="solution"
                className="block text-sm font-medium text-gray-700"
              >
                Solution
              </label>
              <div className="mt-1">
                <textarea
                  name="solution"
                  id="solution"
                  rows={3}
                  value={formData.solution}
                  onChange={handleChange}
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="How are you solving this problem?"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="uniqueValue"
                className="block text-sm font-medium text-gray-700"
              >
                Unique Value & Features
              </label>
              <div className="mt-1">
                <textarea
                  name="uniqueValue"
                  id="uniqueValue"
                  rows={3}
                  value={formData.uniqueValue}
                  onChange={handleChange}
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="What makes your solution unique?"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="competition"
                className="block text-sm font-medium text-gray-700"
              >
                Competition
              </label>
              <div className="mt-1">
                <textarea
                  name="competition"
                  id="competition"
                  rows={3}
                  value={formData.competition}
                  onChange={handleChange}
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300"
                  placeholder="Who are your competitors and how do you differentiate?"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderStep()}
      <div className="flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={onPrevStep}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={step === 1 && !!passwordError}
          className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 4 ? "Create Account" : "Next"}
        </button>
      </div>
    </form>
  );
}
