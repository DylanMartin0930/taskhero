"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import LoginPagePresenter from "@/components/LoginPresenter";
import { sendGTMEvent } from "@next/third-parties/google";

// Container for the Login Page
export default function LoginPage() {
  const router = useRouter();
  const [userToken, setUserToken] = React.useState("");
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async (e) => {
    sendGTMEvent({ event: "Login", category: "User", action: "Login" });
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      setUserToken(response.data.encryptedUserId); // Store the user token from the response
      console.log("Login success", response.data);
      toast.success("Login successful");

      // Redirect to the profile page with the encrypted user ID in the URL
      router.push(`dashboard/profile/id?=${response.data.encryptedUserId}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage = await error.response.data.error;
        console.log(error.message);
        toast.error(errorMessage);
      }
      // Reset the Form Inputs
      setUser({ email: "", password: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <LoginPagePresenter
      loading={loading}
      user={user}
      setUser={setUser}
      onLogin={onLogin}
      buttonDisabled={buttonDisabled}
    />
  );
}
