import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { User, SignupData } from "../../types";
import firebase from "../../utilies/firebase/firebaseConfig";
import { db } from "../../utilies/firebase/firebaseConfig";
interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState(1);

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      console.log("please fill out all fields");
      return;
    }
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = response.user;

      if (user) {
        if (user) {
          try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            const userData = userDoc.data();

            if (userData && companyData && companyDetailsData) {
              const userProfile: User = {
                id: user.uid,
                email: user.email || "",
                firstName: userData.firstName,
                lastName: userData.lastName,
                title: userData.title,
                company: {
                  name: userData.companyData.name,
                  website: companyData.website,
                  size: companyData.size,
                  industry: companyData.industry,
                  stage: companyData.stage,
                  description: companyDetailsData.description || "",
                  location: {
                    city: companyData.location?.split(",")[0]?.trim() || "",
                    state: companyData.location?.split(",")[1]?.trim() || "",
                    country: companyData.location?.split(",")[2]?.trim() || "",
                  },
                  problem: companyDetailsData.problem,
                  solution: companyDetailsData.solution,
                  uniqueValue: companyDetailsData.uniqueValue,
                  competition: companyDetailsData.competition,
                },
                createdAt:
                  userData.createdAt?.toDate().toISOString() ||
                  new Date().toISOString(),
              };
              onLogin(userProfile);
            } else {
              console.error("User data not found in Firestore");
              await firebase.auth().signOut();
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            await firebase.auth().signOut();
          }
        } else {
          console.log("Please verify your email before logging in.");
          await firebase.auth().signOut();
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  // const handleLogin = (email: string, password: string) => {
  //   // Mock login - in a real app, this would validate with a backend
  //   const mockUser: User = {
  //     id: '1',
  //     email,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     title: 'CEO',
  //     company: {
  //       name: 'TechVision AI',
  //       website: 'https://techvision.ai',
  //       size: '1-10',
  //       industry: 'Artificial Intelligence',
  //       stage: 'Seed',
  //       description: 'AI-powered enterprise solutions',
  //       location: {
  //         city: 'San Francisco',
  //         state: 'CA',
  //         country: 'United States'
  //       },
  //       problem: 'Enterprise data processing inefficiencies',
  //       solution: 'AI-powered automation platform',
  //       uniqueValue: 'Contextual understanding and processing',
  //       competition: 'Traditional OCR solutions'
  //     },
  //     createdAt: new Date().toISOString()
  //   };
  //   onLogin(mockUser);
  // };

  const handleSignup = (formData: SignupData) => {
    const user: User = {
      id: crypto.randomUUID(),
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title,
      company: {
        name: formData.companyName,
        website: formData.website,
        size: formData.size || "1-10",
        industry: formData.industry || "Technology",
        stage: formData.stage || "Seed",
        description: formData.description || "",
        location: {
          city: formData.location.split(",")[0]?.trim() || "",
          state: formData.location.split(",")[1]?.trim() || "",
          country: formData.location.split(",")[2]?.trim() || "United States",
        },
        problem: formData.problem || "",
        solution: formData.solution || "",
        uniqueValue: formData.uniqueValue || "",
        competition: formData.competition || "",
      },
      createdAt: new Date().toISOString(),
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setSignupStep(1);
            }}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? (
            <LoginForm onSubmit={handleLogin} />
          ) : (
            <SignupForm
              step={signupStep}
              onNextStep={() => setSignupStep((prev) => prev + 1)}
              onPrevStep={() => setSignupStep((prev) => prev - 1)}
              onSubmit={handleSignup}
            />
          )}
        </div>
      </div>
    </div>
  );
}
