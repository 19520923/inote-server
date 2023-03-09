export const success = (res, status) => (entity) => {
  if (entity) {
    res.status(status || 200).json(entity);
  }
  return null;
};

export const notFound = (res) => (entity) => {
  if (!entity || (entity && entity.deleteFlag)) {
    res.status(404).end();
    return null;
  }

  return entity;
};

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === "admin";
    const isAuthor = entity[userField] && entity[userField].equals(user.id);
    if (isAuthor || isAdmin) {
      return entity;
    }
    res.status(401).end();
  }
  return null;
};
