import dayjs from "dayjs";

import "dayjs/locale/pt";
import "dayjs/locale/en";

export const dateTool = (locale: string) => {
  dayjs.locale(locale);

  return dayjs;
};
