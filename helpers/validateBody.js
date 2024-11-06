import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.reduce((acc, item, index) => {
        const text = item.message.replace('"', "field ");
        const message = text.replace('"', ":");
        const mark = index === error.details.length - 1 ? "." : ", ";
        acc += message + mark;
        return acc;
      }, "");

      next(HttpError(400, errors));
    }
    next();
  };

  return func;
};

export default validateBody;
