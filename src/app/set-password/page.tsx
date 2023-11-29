/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { Button, Typography, Password, Toast } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import Footer from "@/components/common/Footer";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const Page = () => {
  const getToken = useSearchParams();
  const token = getToken.get("token");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorNew, setPasswordErrorNew] = useState(false);
  const [error, setError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [cPasswordHasError, setCPasswordHasError] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password.trim() === "") {
      setPasswordError(true);
    }
    if (passwordNew.trim() === "") {
      setPasswordErrorNew(true);
    }
    if (password !== passwordNew) {
      setError(true);
    } else {
      setError(false);
    }
    if (
      password !== "" &&
      passwordNew !== "" &&
      password === passwordNew &&
      passwordHasError &&
      cPasswordHasError
    ) {
      setClicked(true);
      try {
        const response = await axios.post(
          `${process.env.api_url}/auth/setpassword`,
          { Token: token, Password: password, TokenType: 2 }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            setClicked(false);
            Toast.success("Password set successfully.");
            router.push(`/login`);
          } else {
            setClicked(false);
            const data = response.data.Message;
            if (data === null) {
              Toast.error("Please try again.");
            } else {
              Toast.error(data);
            }
          }
        } else {
          setClicked(false);
          const data = response.data.Message;
          if (data === null) {
            Toast.error("Please try again after sometime.");
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
    <div className="flex flex-col justify-between min-h-screen">
      <div className="loginWrapper flex items-center flex-col pt-[55px]">
        <Typography
          type="h3"
          className="mb-[50px] font-semibold text-darkCharcoal"
        >
          PMS
        </Typography>
        <Typography
          type="h5"
          className="text-primary font-bold mb-[20px] text-darkCharcoal"
        >
          Please set a password for your account.
        </Typography>
        <form
          className="text-start w-full max-w-3xl py-5 px-3 flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <div className="mb-5 w-[300px] lg:w-[356px]">
            <Password
              label="Password"
              validate
              getValue={(e) => setPassword(e)}
              getError={(e) => {
                setPasswordHasError(e);
              }}
              hasError={passwordError}
              autoComplete="off"
            />
          </div>
          <div className="mb-5 w-[300px] lg:w-[356px]">
            <Password
              label="Confirm Password"
              validate
              getValue={(e) => setPasswordNew(e)}
              getError={(e) => {
                setCPasswordHasError(e);
              }}
              hasError={passwordErrorNew}
              autoComplete="off"
            />
          </div>
          <div className="pb-5 w-[300px] lg:w-[356px] flex justify-between items-center">
            <Button
              type="submit"
              variant="btn-primary"
              className="rounded-full sm:!w-[356px] !w-[256px] !font-semibold mt-[35px]"
            >
              CONTINUE
            </Button>
          </div>
        </form>
        <div className="pb-4 flex justify-between items-center mt-[20px] text-darkCharcoal text-sm lg:text-base">
          Don&rsquo;t have an accout?&nbsp;
          <Link href={""} className="text-primary font-semibold underline">
            Sign Up
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Page;
