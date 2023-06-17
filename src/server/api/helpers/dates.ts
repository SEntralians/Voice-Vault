import dayjs from "dayjs";
import "dayjs/locale/en";

dayjs.locale("en");

export const getFirstDayOfWeek = () => {
  const currentDate = dayjs();
  const firstDayOfWeek = currentDate.startOf("week");
  return firstDayOfWeek;
};

export const getLastDayOfWeek = () => {
  const currentDate = dayjs();
  const lastDayOfWeek = currentDate.endOf("week");
  return lastDayOfWeek;
};
