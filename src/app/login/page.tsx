"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import LoginPagePresenter from "../../components/LoginPresenter";

//Container for the Login Page
export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage = await error.response.data.error;
        console.log(error.message);
        toast.error(errorMessage);
      }
      //Reset the Form Inputs
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
