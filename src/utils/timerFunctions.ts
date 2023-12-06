const toHoursAndMinutes = (totalSeconds: number) => {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().length === 1 ? `0${hours}` : hours}:${
    minutes.toString().length === 1 ? `0${minutes}` : minutes
  }:${seconds.toString().length === 1 ? `0${seconds}` : seconds}`;
};

const toSeconds = (time: string) => {
  if (/\d+:\d+:\d+/.test(time)) {
    const hours = parseInt(time.split(":")[0]) * 60 * 60;
    const minutes = parseInt(time.split(":")[1]) * 60;
    const seconds = parseInt(time.split(":")[2]);
    return hours + minutes + seconds;
  } else console.error("Please provide the time in hh:mm:ss format!");
};

const getDates = (startDate?: any, endDate?: any) => {
  let array = [];
  let date = new Date();

  let startParts = startDate ? startDate.split("-") : null;
  let endParts = endDate ? endDate.split("-") : null;

  let startDay = startParts
    ? parseInt(startParts[2])
    : new Date(date.getFullYear(), date.getMonth(), 1).getDate();
  let startMonth = startParts ? parseInt(startParts[1]) - 1 : date.getMonth();
  let startYear = startParts ? parseInt(startParts[0]) : date.getFullYear();

  let endDay = endParts ? parseInt(endParts[2]) : date.getDate();
  let endMonth = endParts ? parseInt(endParts[1]) - 1 : date.getMonth();
  let endYear = endParts ? parseInt(endParts[0]) : date.getFullYear();

  let current = new Date(startYear, startMonth, startDay);

  while (current <= new Date(endYear, endMonth, endDay)) {
    let d =
      current.getFullYear() +
      "-" +
      (current.getMonth() + 1) +
      "-" +
      (current.getDate().toString().length > 1
        ? current.getDate()
        : "0" + current.getDate());
    array.push(d);
    current.setDate(current.getDate() + 1);
  }

  return array;
};

const getFormattedDate = (newValue: any) => {
  if (
    newValue !== "" &&
    newValue.$y !== undefined &&
    newValue.$M !== undefined &&
    newValue.$D !== undefined
  ) {
    const year = newValue.$y;
    const month =
      (newValue.$M + 1).toString().length > 1
        ? newValue.$M + 1
        : `0${newValue.$M + 1}`;
    const date =
      newValue.$D.toString().length > 1 ? newValue.$D : `0${newValue.$D}`;
    const formattedDate = year + "-" + month + "-" + date;

    return formattedDate;
  }
};

const getStartDate = (startDate: any, endDate: any) => {
  const trimmedStartDate = startDate.toString().trim();
  const trimmedEndDate = endDate.toString().trim();
  if (trimmedStartDate.length <= 0) {
    if (trimmedEndDate.length <= 0) {
      const dates = getDates();
      return dates.length > 0 ? getFormattedDate(dates[0]) : null;
    } else {
      return getFormattedDate(endDate);
    }
  } else {
    return getFormattedDate(startDate);
  }
};

const getEndDate = (startDate: any, endDate: any) => {
  const trimmedEndDate = endDate.toString().trim();
  const trimmedStartDate = startDate.toString().trim();
  return trimmedEndDate.length <= 0
    ? trimmedStartDate.length <= 0
      ? getFormattedDate(getDates()[getDates().length - 1])
      : getFormattedDate(startDate)
    : getFormattedDate(endDate);
};

export {
  toHoursAndMinutes,
  toSeconds,
  getDates,
  getFormattedDate,
  getStartDate,
  getEndDate,
};
