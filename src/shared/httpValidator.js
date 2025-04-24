const schema = {
   params: Joi.object({
      id: Joi.string().length(24).hex().required()
   })
};

const isValid = httpValidator({ params: req.params }, schema)
