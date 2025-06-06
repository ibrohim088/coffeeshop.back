export const validator = (schema) => {
   return (req, res, next) => {
      const { error } = schema.validator(req.body);
      if (error) {
         return res.status(400).json({ error: error.details[0].message });
      }
      next();
   }
}