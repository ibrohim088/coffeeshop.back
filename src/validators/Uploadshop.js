import Joi from "joi";

const dateRegax = /^\d{4}\/(0[1-9] | [0-2])$/;

export const postSchema = {
   body: Joi.object({
      name: Joi.string().required(),
      logo: Joi.array().required().min(1),
   })
}


export const oneIDSchema = {
   params: Joi.object({
      id: Joi.string().hex().length(24).required()
   })
}
