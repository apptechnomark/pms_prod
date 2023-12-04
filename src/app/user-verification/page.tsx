"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Loader, Password, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import axios from "axios";
import Footer from "@/components/common/Footer";
import Pabs from "@/assets/icons/Pabs";

const Page = () => {
  const router = useRouter();
  const Token = useSearchParams();
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [cPasswordError, setCPasswordError] = useState(false);
  const [cPasswordErrorMsg, setCPasswordErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [cPasswordHasError, setCPasswordHasError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const checkToken = async () => {
    setShowPass(true);
    const token = await Token.get("token");
    try {
      const response = await axios.post(
        `${process.env.api_url}/auth/validatetoken`,
        {
          Token: `${token}`,
          TokenType: 3,
        }
      );

      if (response.status === 200) {
        if (response.data.ResponseStatus === "Success") {
          setShowPass(false);
        } else {
          setMessage(false);
          const data = response.data.Message;
          if (data === null && response.data.ErrorData.ErrorCode === "1003") {
            Toast.error("Invalid link.");
            router.push("/login");
          } else if (
            data === null &&
            response.data.ErrorData.ErrorCode === "1004"
          ) {
            Toast.error("Link has been Expired.");
            router.push("/login");
          } else {
            router.push("/login");
          }
          setShowPass(true);
        }
      } else {
        setShowPass(true);
        setMessage(true);
        Toast.error("Please try again.");
      }
    } catch (error) {
      setMessage(true);
      setShowPass(true);
      console.error(error);
    }
  };

  useEffect(() => {
    checkToken();
  }, [Token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = await Token.get("token");
    const isPasswordEmpty = password === "";
    const isCPasswordEmpty = cPassword === "";
    const passwordsMatch = password === cPassword;

    setPasswordError(isPasswordEmpty);
    setPasswordErrorMsg(isPasswordEmpty ? "This is a required field" : "");

    setCPasswordError(isCPasswordEmpty);
    setCPasswordErrorMsg(isCPasswordEmpty ? "This is a required field" : "");

    setError(!passwordsMatch);

    const isFormValid =
      !isPasswordEmpty &&
      !isCPasswordEmpty &&
      passwordsMatch &&
      passwordHasError &&
      cPasswordHasError;

    if (isFormValid) {
      setClicked(true);

      try {
        const response = await axios.post(
          `${process.env.api_url}/auth/setpassword`,
          {
            token,
            password,
            TokenType: 3,
          }
        );

        if (response.status === 200) {
          const { ResponseStatus, Message } = response.data;
          if (ResponseStatus === "Success") {
            setPassword("");
            setCPassword("");
            setPasswordHasError(false);
            setCPasswordHasError(false);
            setClicked(false);
            Toast.success("Password set successfully.");
            router.push(`/login`);
          } else {
            setClicked(false);
            Toast.error(Message || "Please try again.");
          }
        } else {
          setClicked(false);
          const data = response.data.Message;
          Toast.error(data || "Please try again after some time.");
        }
      } catch (error) {
        setClicked(false);
        console.error(error);
      }
    } else {
      setClicked(false);
    }
  };

  return (
    <>
      {showPass ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" />
        </div>
      ) : message ? (
        <div className="flex items-center justify-center min-h-screen">
          Please Try again later.
        </div>
      ) : (
        <div className="flex flex-col justify-between min-h-screen">
          <div className="flex items-center flex-col mt-[100px]">
            <span className="-ml-6">
              <Pabs width="150" height="50" />
            </span>
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <span className="pb-[25px] text-primary font-bold text-xl lg:text-2xl mx-5 sm:mx-auto">
                Please set a password for your account.
              </span>
              <form
                className="text-start w-full max-w-md py-5 px-3 flex flex-col items-center justify-center"
                onSubmit={handleSubmit}
              >
                <div className="pb-4 w-[300px] lg:w-[356px]">
                  <Password
                    label="Password"
                    name="password"
                    getValue={(e) => setPassword(e)}
                    getError={(e) => setPasswordHasError(e)}
                    hasError={passwordError}
                    validate
                    errorMessage={passwordErrorMsg}
                    minChar={8}
                    maxChar={28}
                  />
                </div>
                <div className="pb-4 w-[300px] lg:w-[356px]">
                  <Password
                    label="Confirm Password"
                    getValue={(e) => setCPassword(e)}
                    getError={(e) => setCPasswordHasError(e)}
                    hasError={cPasswordError}
                    name="ConfirmpPassword"
                    validate
                    errorMessage={cPasswordErrorMsg}
                    minChar={8}
                    maxChar={28}
                  />
                </div>
                {error && (
                  <span className="text-defaultRed text-sm lg:text-base">
                    Password does not match!
                  </span>
                )}
                {clicked ? (
                  <Loader size="sm" />
                ) : (
                  <Button
                    type="submit"
                    variant="btn-primary"
                    className="rounded-full !w-[300px] !font-semibold mt-[20px]"
                  >
                    CONTINUE
                  </Button>
                )}
              </form>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Page;
