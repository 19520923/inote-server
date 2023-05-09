import _ from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "../constants";

export const getChangesContent = (task, changes) => {
  const contentArray = Object.keys(changes).map((e) => {
    if (_.includes(["start_date", "due_date"], e)) {
      return `${e}: ${moment(task[e]).format(DATE_FORMAT)} → ${moment(
        changes[e]
      ).format(DATE_FORMAT)}`;
    }
    if (e === "content") {
      return "Content updated";
    }
    if (_.includes(["priority", "status"], e)) {
      return `${e}: ${task[e]} → ${changes[e]}`;
    }
  });

  return contentArray.join("\n");
};
