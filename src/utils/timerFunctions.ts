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

export { toHoursAndMinutes, toSeconds };
