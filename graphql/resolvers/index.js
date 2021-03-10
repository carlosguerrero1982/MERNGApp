import postResolvers from './post.js'

import userResolvers from './users.js'


const index={
    Query:{
        ...postResolvers.Query, ...userResolvers.Query
    },
   Mutation:{
        ...userResolvers.Mutation, ...postResolvers.Mutation
   }
}

export default index