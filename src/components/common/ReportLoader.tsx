import { Spinner } from "next-ts-lib";

const ReportLoader = () => {
  return (
    <div className="h-screen w-full flex justify-center my-[20%]">
      <Spinner />
    </div>
  );
};

export default ReportLoader;
