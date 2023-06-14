import _ from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "../constants";

export const getChangesContent = (task, newTask, changes) => {
  const contentArray = Object.keys(changes).map((e) => {
    switch (e) {
      case "start_date":
      case "due_date":
        return `◉ ${_.capitalize(_.lowerCase(e))}: ${moment(task[e]).format(
          DATE_FORMAT
        )} → ${moment(newTask[e]).format(DATE_FORMAT)}`;

      case "content":
        return "◉ Content: Content changed";

      case "priority":
      case "status":
      case "actual":
      case "estimate":
        return `◉ ${_.capitalize(_.lowerCase(e))}: ${_.capitalize(
          _.lowerCase(task[e])
        )} → ${_.capitalize(_.lowerCase(newTask[e]))}`;

      case "assignee":
        if (task[e].id && task[e].id !== newTask[e].id) {
          return `◉ ${_.capitalize(_.lowerCase(e))}: ${task[e].username} → ${
            newTask[e].username
          }`;
        }

      case "milestone":
      case "activity":
        if (task[e].id && task[e].id !== newTask[e].id) {
          return `◉ ${_.capitalize(_.lowerCase(e))}: ${_.capitalize(
            _.lowerCase(task[e].name)
          )} → ${_.capitalize(_.lowerCase(newTask[e].name))}`;
        }
    }
  });

  return _.compact(contentArray).join("\n");
};
