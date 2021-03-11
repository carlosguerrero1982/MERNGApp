import postResolvers from './post.js'

import userResolvers from './users.js'

import commentsResolver from './comments.js'

const index={
    Query:{
        ...postResolvers.Query, ...userResolvers.Query
    },
   Mutation:{
        ...userResolvers.Mutation, ...postResolvers.Mutation, ...commentsResolver.Mutation
   },

   Subscription:{
       ...postResolvers.Subcription
   }
}

export default index