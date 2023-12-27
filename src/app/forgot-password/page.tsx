"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Typography, Email, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import Pabs from "@/assets/icons/Pabs";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const router = useRouter();
  const [forgetValue, setForgetValue] = useState("");
  const [error, setError] = useState(false);
  const [emailError, setEmaiLError] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (forgetValue.trim() === "") {
      setError(true);
    } else {
      setError(false);
      setClicked(true);
      try {
        if (forgetValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && emailError) {
          const response = await axios.post(
            `${process.env.api_url}/auth/forgotpassword`,
            { Username: forgetValue }
          );
          if (response.status === 200) {
            if (response.data.ResponseStatus === "Success") {
              toast.success("Please check your email.");
              router.push(`/forgot-confirm/?email=${forgetValue}`);
            } else {
              toast.error("Please try again.");
              setClicked(false);
            }
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again after sometime.");
            } else {
              toast.error(data);
            }
            setClicked(false);
          }
        }
      } catch (error) {
        setClicked(false);
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <div className="flex items-center justify-between max-h-screen min-w-full relative">
        <img
          src="https://staging-tms.azurewebsites.net/assets/images/pages/forgot-password-v2.svg"
          alt="FP"
          className="w-[50%]"
        />
        <span className="absolute top-10 left-4">
          <Pabs width="200" height="50" />
        </span>
        <div className="forgetWrapper flex items-start flex-col pt-5 min-w-[30%]">
          <Typography type="h3" className="pt-14 pb-2 font-bold">
            Forgot Password?
          </Typography>
          <p className="text-gray-500 text-[14px]">
            Enter your email and we&rsquo;ll send you
            <br />
            instructions to reset your password
          </p>
          <form
            className="text-start w-full max-w-md py-5 flex flex-col items-start justify-center"
            onSubmit={handleSubmit}
          >
            <div className="pb-2 w-[300px] lg:w-[356px]">
              <Email
                label="Email"
                type="email"
                id="email"
                name="email"
                validate
                getValue={(e) => setForgetValue(e)}
                getError={(e) => setEmaiLError(e)}
                hasError={error}
              />
            </div>
            {clicked ? (
              <span className="mt-[35px] w-[300px] lg:w-[356px] text-center">
                <Loader size="sm" />
              </span>
            ) : (
              <Button
                type="submit"
                variant="btn-secondary"
                className="rounded-full !font-semibold mt-[20px] !w-[300px]"
              >
                SEND EMAIL
              </Button>
            )}
            <div className="backLoignWrapper pt-5 flex items-center justify-center min-w-[70%]">
              <Link href="login">
                <div className="backArrow flex items-center justify-center">
                  <div className="ml-2.5 flex items-center justify-center">
                    <Typography
                      type="text"
                      className="!text-[14px] !font-normal text-[#0592C6]"
                    >
                      Back to Login
                    </Typography>
                  </div>
                </div>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
