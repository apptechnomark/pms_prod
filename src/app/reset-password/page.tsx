/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button, Typography, Password, Toast, Loader } from "next-ts-lib";
import "next-ts-lib/dist/index.css";
import Footer from "@/components/common/Footer";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Pabs from "@/assets/icons/Pabs";

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

  const validatePassword = (password: string) => password.trim() !== "";

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(password);
    const isNewPasswordValid = validatePassword(passwordNew);
    const passwordsMatch = password === passwordNew;

    setPasswordError(!isPasswordValid);
    setPasswordErrorNew(!isNewPasswordValid);
    setError(!passwordsMatch);

    if (
      isPasswordValid &&
      isNewPasswordValid &&
      passwordsMatch &&
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
          const { ResponseStatus, Message } = response.data;
          if (ResponseStatus === "Success") {
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
    <div className="flex flex-col justify-between min-h-screen">
      <div className="loginWrapper flex items-center flex-col pt-[90px]">
        <span className="-ml-6">
          <Pabs width="150" height="50" />
        </span>
        <Typography type="h5" className="text-primary font-bold my-[20px]">
          Please set a password for your account.
        </Typography>
        <form
          className="w-[320px] lg:w-[384px] text-startmax-w-3xl py-5 flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <div className="mb-5 w-full px-3">
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
          <div className="mb-5 w-full px-3">
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
          <div className="pb-5 flex justify-center items-center w-[320px] lg:w-[384px]">
            {clicked ? (
              <span className="mt-[35px] w-full text-center">
                <Loader size="sm" />
              </span>
            ) : (
              <Button
                type="submit"
                variant="btn-primary"
                className="rounded-full !font-semibold mt-[35px] w-full"
              >
                CONTINUE
              </Button>
            )}
          </div>
        </form>
        {/* <div className="pb-4 flex justify-between items-center mt-[20px] text-darkCharcoal text-sm lg:text-base">
          Don&rsquo;t have an accout?&nbsp;
          <Link href={""} className="text-primary font-semibold underline">
            Sign Up
          </Link>
        </div> */}
      </div>
      <Footer />
    </div>
  );
};
export default Page;
