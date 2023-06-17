// import dayjs from "dayjs";
// import "dayjs/locale/en";

// dayjs.locale("en");

// export const getFirstDayOfWeek = () => {
//   const currentDate = dayjs();
//   const firstDayOfWeek = currentDate.startOf("week");
//   return firstDayOfWeek.format("MMMM DD, YYYY");
// };

// export const getLastDayOfWeek = () => {
//   const currentDate = dayjs();
//   const lastDayOfWeek = currentDate.endOf("week");
//   return lastDayOfWeek.format("MMMM DD, YYYY");
// };

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/en"; // Import the locale package

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("en"); // Set the locale to "en" (English)
dayjs.tz.setDefault("Asia/Manila"); // Set the default timezone to Philippine time

export const getFirstDayOfWeek = () => {
  const currentDate = dayjs().startOf("week");
  const firstDayOfWeek = currentDate.add(currentDate.utcOffset(), "minute");
  return firstDayOfWeek.format("MMMM DD, YYYY");
};

export const getLastDayOfWeek = () => {
  const currentDate = dayjs().endOf("week");
  const lastDayOfWeek = currentDate.add(currentDate.utcOffset(), "minute");
  return lastDayOfWeek.format("MMMM DD, YYYY");
};
