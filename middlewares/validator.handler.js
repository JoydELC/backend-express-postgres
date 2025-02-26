const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    console.log({data, schema, property})
    const { error } = schema.validate(data, { abortEarly: false });
    console.error({error})
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  }
}

module.exports = validatorHandler;
