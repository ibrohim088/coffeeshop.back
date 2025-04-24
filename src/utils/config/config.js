import {config} from 'dotenv'
config()
const dbConfig = {
   jwt:{
      secret : process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
   },
   port: process.env.PORT
}
export default dbConfig;