import _ from "lodash";

export const calculateSuitablePoint = (taskReviews, tags) => {
  const taskTopics = taskReviews.map((taskReview) => taskReview.task.topics);
  const tagMatrix = tags.map((tag) =>
    taskTopics.map((taskTopic, index) => {
      return _.findIndex(
        taskTopic,
        (e) => String(e._id) === String(tag._id)
      ) !== -1
        ? 1 * taskReviews[index].avg_point
        : 0;
    })
  );

  const tagPoints = tagMatrix.map((tag) => _.sum(tag));

  const totalTagPoints = _.sum(tagPoints) || 1;
  const avgTagPoints = tagPoints.map((e) => e / totalTagPoints);
  return avgTagPoints;
};
