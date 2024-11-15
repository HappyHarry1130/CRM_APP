import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import firebase from "../utilies/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const unsubscribeSnapshot = userRef.onSnapshot(
          (doc) => {
            if (doc.exists) {
              const userData = doc.data();
              if (userData && userData.subscription) {
                setSessionId(userData.subscription.sessionId || "");
              }
            }
          },
          (error) => {
            console.error("Error fetching subscription data:", error);
          }
        );

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePaymentSuccess = () => {
    fetch(
      "https://yaxlyu982rsci2-8000.proxy.runpod.net/api/v1/payment-success",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: sessionId, firebaseId: userId }),
      }
    )
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        console.log(data.message);
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="m-0 p-0">
      <div className="w-full min-h-[80vh] flex flex-col justify-center items-center">
        <div className="my-10 text-green-600 text-2xl mx-auto flex flex-col justify-center items-center">
          <CheckCircle
            size={120}
            className="text-green-500"
            strokeWidth={1.5}
          />
          <h3 className="mt-[40px] text-4xl pt-20 lg:pt-0 font-bold text-center text-slate-700">
            Payment Successful
          </h3>
        </div>
        <button
          onClick={() => handlePaymentSuccess()}
          className="w-40 uppercase bg-[#009C96] text-white text-xl my-16 px-2 py-2 rounded"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Success;
