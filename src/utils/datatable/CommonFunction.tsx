import React from "react";

export const genrateCustomHeaderName = (headerName: string) => {
  return <span className="font-extrabold capitalize">{headerName}</span>;
};

export const generateCommonBodyRender = (baodyValue: any) => {
  return (
    <div className="ml-2">{baodyValue === null || "" ? "-" : baodyValue}</div>
  );
};

export const generateCustomFormatDate = (
  value: string | number | Date | null
) => {
  if (value === null || value === "") {
    return "-";
  }

  const startDate = new Date(value);
  const month = startDate.getMonth() + 1;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const day = startDate.getDate();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedYear = startDate.getFullYear();
  const formattedDate = `${formattedMonth}-${formattedDay}-${formattedYear}`;

  return <div>{formattedDate}</div>;
};

export const generatePriorityWithColor = (value: any) => {
  let isHighPriority;
  let isMediumPriority;
  let isLowPriority;

  if (value) {
    isHighPriority = value.toLowerCase() === "high";
    isMediumPriority = value.toLowerCase() === "medium";
    isLowPriority = value.toLowerCase() === "low";
  }

  return (
    <div>
      {value === null || value === "" ? (
        "-"
      ) : (
        <div className="inline-block mr-1">
          <div
            className={`w-[10px] h-[10px] rounded-full inline-block mr-2 ${
              isHighPriority
                ? "bg-defaultRed"
                : isMediumPriority
                ? "bg-yellowColor"
                : isLowPriority
                ? "bg-primary"
                : "bg-lightSilver"
            }`}
          ></div>
          {value}
        </div>
      )}
    </div>
  );
};

export const generateStatusWithColor = (value: any, rowIndex: any) => {
  const statusColorCode = rowIndex;

  return (
    <div>
      {value === null || value === "" ? (
        "-"
      ) : (
        <div className="inline-block mr-1">
          <div
            className="w-[10px] h-[10px] rounded-full inline-block mr-2"
            style={{ backgroundColor: statusColorCode }}
          ></div>
          {value}
        </div>
      )}
    </div>
  );
};

export const generateInitialTimer = (value: any) => {
  return (
    <div className="flex items-center gap-2">
      {value === null || value === 0 || value === "0" ? "00:00:00" : value}
    </div>
  );
};

export const generateDateWithoutTime = (value: any) => {
  return (
    <div>
      {value === null || value === 0 || value === ""
        ? "-"
        : value.split("T")[0]}
    </div>
  );
};

export const generateDateWithTime = (value: any) => {
  return (
    <div className="ml-2">
      {value === null || value === 0 || value === "0" ? (
        "-"
      ) : (
        <>
          {value.split("T")[0]}&nbsp;
          {value.split("T")[1]}
        </>
      )}
    </div>
  );
};