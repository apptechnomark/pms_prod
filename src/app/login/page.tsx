/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import {
  Button,
  Password,
  Toast,
  Loader,
  Email,
} from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { hasToken } from "@/utils/commonFunction";
import Pabs from "@/assets/icons/Pabs";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [emailHasError, setEmailHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);

  useEffect(() => {
    hasToken(router);
  }, [router]);

  useEffect(() => {
    email.trim().length > 0 && setEmailHasError(true);
    password.trim().length > 0 && setPasswordHasError(true);
  }, [email, password]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    email.trim().length <= 0 && setEmailError(true);
    password.trim().length <= 0 && setPasswordError(true);

    if (
      email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      password.trim() !== "" &&
      emailHasError &&
      passwordHasError
    ) {
      setClicked(true);
      try {
        const response = await axios.post(`${process.env.api_url}/auth/token`, {
          Username: email,
          Password: password,
        });

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            Toast.success("You are successfully logged in.");
            setEmail("");
            setPassword("");
            setEmailHasError(false);
            setPasswordHasError(false);
            setClicked(false);
            localStorage.setItem(
              "token",
              response.data.ResponseData.Token.Token
            );
            router.push("/");
          } else {
            setClicked(false);
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Data does not match.");
            } else {
              Toast.error(data);
            }
          }
        } else {
          setClicked(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Login failed. Please try again.");
          } else {
            Toast.error(data);
          }
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
    <div className="flex flex-col justify-center min-h-screen relative">
      <Toast position="top_right" />
      <div className="flex items-center justify-between max-h-screen min-w-full relative">
        <img
          src="https://staging-tms.azurewebsites.net/assets/images/pages/login-v2.svg"
          alt="Login"
          className="w-[50%]"
        />
        <span className="absolute -top-10 left-4">
          <Pabs width="200" height="50" />
        </span>
        <div className="loginWrapper flex items-center flex-col pt-[10%] !w-[40%] font-normal border-l border-lightSilver">
          <p className="font-bold mb-[20px] text-darkCharcoal text-2xl">
            Welcome to PABS-PMS
          </p>
          <form
            className="text-start w-full max-w-3xl py-5 px-3 flex flex-col items-center justify-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-4 w-[300px] lg:w-[356px]">
              <Email
                label="Email"
                type="email"
                validate
                getValue={(e) => setEmail(e)}
                getError={(e) => setEmailHasError(e)}
                hasError={emailError}
                autoComplete="off"
              />
            </div>
            <div className="mb-5 w-[300px] lg:w-[356px]">
              <Password
                label="Password"
                validate
                novalidate
                getValue={(e) => setPassword(e)}
                getError={(e) => setPasswordHasError(e)}
                hasError={passwordError}
                autoComplete="off"
              />
            </div>
            <div className="pb-0 w-[300px] lg:w-[356px] flex justify-between items-center">
              <div className="flex items-center justify-center text-slatyGrey">
                {/* <CheckBox id="agree" label="Keep me logged in" /> */}
              </div>
              <Link
                href="/forgot-password"
                className="text-[#0592C6] font-semibold text-sm lg:text-base underline"
              >
                Forgot Password?
              </Link>
            </div>
            {clicked ? (
              <span className="mt-[35px]">
                <Loader size="sm" />
              </span>
            ) : (
              <Button
                type="submit"
                variant="btn-secondary"
                className="rounded-full !w-[300px] !font-semibold mt-[35px]"
              >
                SIGN IN
              </Button>
            )}
          </form>
          {/* <div className="pb-4 flex justify-between items-center mt-[20px] text-darkCharcoal text-sm lg:text-base">
            Don&rsquo;t have an accout?&nbsp;
            <Link href={""} className="text-primary font-semibold underline">
              Sign Up
            </Link>
          </div> */}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default page;
