import User from '../../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {SECRET_KEY} from '../../config.js'
import apollo from 'apollo-server'
import {validateRegisterInput} from '../../utils/validator.js'
import {validateLoginInput} from '../../utils/validator.js'

function generateToken(user){

  return  jwt.sign({
    id:user.id,
    email:user.email,
    username:user.username
},SECRET_KEY,{expiresIn:'1h'});

}

const { UserInputError } = apollo

const userResolvers={
    Mutation:{

      login:async(_,{username,password})=>{

        const {valid,errors}= validateLoginInput(username,password);


        if(!valid){
          throw new UserInputError('Errors',{errors})
        }

        const user = await User.findOne({username});

        if(!user){
          errors.general="User not found";
          throw new UserInputError('not found',{errors})
        }

          const match = await bcrypt.compare(password,user.password);

          if(!match){
            errors.general="Wrong credential";
            throw new UserInputError('Wrong Password',{errors})
          }

          const token = generateToken(user)

          return {
            ... user._doc,
            id:user._id,
            token
        };
      },
  
     register:async(_,{input:{username,email,password,confirmPassword}},context,info)=>{

      const {valid,errors}= validateRegisterInput(username,email,password,confirmPassword);

      if(!valid){
        throw new UserInputError('Errors',{errors})
      }

        const user = await User.findOne({ username });
        if (user) {
          throw new UserInputError('Username is taken', {
            errors: {
              username: 'This username is taken'
            }
          });
        }
        
        password = await bcrypt.hash(password,12)

        const newUser = new User({
            email,
            username,
            password,
            createdAt:new Date().toISOString()
        });

        const res = await newUser.save();

        const token = generateToken(res)

        return {
            ... res._doc,
            id:res._id,
            token
        };
     }

  },

  Query:{

    getUsers: async()=>{
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    },

    getUser:async(_,{id})=>{
      try {
        const user = await User.findById(id)
        return user;

      } catch (error) {
        console.log(error);
            throw new Error(error)
      }
    }

    
}
}
  
  export default userResolvers