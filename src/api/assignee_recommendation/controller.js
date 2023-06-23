import { success, notFound } from "../../services/response/";
import { AssigneeRecommendation } from ".";
import { Project } from "../project";
import _ from "lodash";

export const index = async (
  { querymen: { query, select, cursor } },
  res,
  next
) => {
  try {
    const project = await Project.findById(query.project);
    const members = [...project.members, ...project.hosts];
    const arrResult = [];
    for (const member of members) {
      const assignee_points = await AssigneeRecommendation.find({
        user: member,
        tag: query.tags,
      });
      const totalPoint = _.sumBy(assignee_points, (e) => e.avg_point);
      if (totalPoint > 0) {
        arrResult.push({ user: member.view(), avg_point: totalPoint });
      }
    }

    res
      .status(200)
      .json(_.sortBy(arrResult, (e) => -e.avg_point))
      .end();
  } catch {
    next();
  }
};
