import _ from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "../constants";

export const getChangesContent = (task, changes) => {
  const contentArray = Object.keys(changes).map((e) => {
    switch (e) {
      case "start_date":
      case "due_date":
        return `${e}: ${moment(task[e]).format(DATE_FORMAT)} → ${moment(
          changes[e]
        ).format(DATE_FORMAT)}`;

      case "content":
        return "content: Content changed";

      case "priority":
      case "status":
        return `${e}: ${task[e]} → ${changes[e]}`;

      case "assignee":
        return ` ${task[e].username} → ${changes[e].username}`;
    }
  });

  return contentArray.join("\n");
};
