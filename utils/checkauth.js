import jwt from 'jsonwebtoken'
import apollo from 'apollo-server'

import {SECRET_KEY} from '../config.js'

const { AuthenticationError } = apollo



 const checkout = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
      // Bearer ....
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        try {
          const user = jwt.verify(token, SECRET_KEY);
          return user;
        } catch (err) {
          throw new AuthenticationError('Invalid/Expired token');
        }
      }
      throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
  };

  export default checkout