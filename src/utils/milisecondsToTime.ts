export function convertMilliseconds(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `safe in: ${hours > 0 ? `${hours} hours, ` : ""}${
    minutes > 0 ? `${minutes} minutes, ` : ""
  }${seconds > 1 ? `${seconds} seconds` : ""}`;
}
