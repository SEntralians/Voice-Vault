import dayjs from "dayjs";

export const getFirstDayOfWeek = () => {
  const currentDate = dayjs();
  const firstDayOfWeek = currentDate.startOf("week");
  return firstDayOfWeek.format("MMMM DD, YYYY");
};

export const getLastDayOfWeek = () => {
  const currentDate = dayjs();
  const lastDayOfWeek = currentDate.endOf("week");
  return lastDayOfWeek.format("MMMM DD, YYYY");
};
