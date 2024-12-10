"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifieEmail = async () => {
    if (!token) {
      console.log("No token provided");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/verifyEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Redirect to login page if verification is successful
        // router.push('/login'); (if you want to navigate programmatically)
      } else {
        console.log("Verification was not successful");
      }
    } catch (error) {
      console.log("Catch error:", error);
    }
  };

  useEffect(() => {
    verifieEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{token ? "Vérification successufly" : "Token manquant."}</p>
      <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}>Login</a>
    </div>
  );
}
