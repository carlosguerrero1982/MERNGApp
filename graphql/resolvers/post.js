import Post from '../../models/Post.js'
import checkauth from '../../utils/checkauth.js'

 const postResolvers={
  Query:{

    getPosts: async()=>{
        try {
            const posts = await Post.find().sort({createdAt:-1});
            return posts;
        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    },

    getPost:async(_,{postId})=>{

        try {
            const post= await Post.findById(postId);
            if(post){
                return post
            }else{

                throw new Error('not found')
            }
            
        } catch (error) {
            console.log(error);
            throw new Error(error)

        }
    }

    
},


Mutation:{

    async createPost(_, { body }, context) {

        const user = checkauth(context);
        console.log(user);
  
        const newPost = new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
        });
  
        const post = await newPost.save();

        context.pubsub.publish('NEW POST',{
            newPost:post
        })
  
        return post;
   
    },

    deletePost:async(_,{postId},context)=>{

        const user = checkauth(context);

        try {
            const post = await Post.findById(postId)
            if(user.username === post.username){
                await post.delete();
                return "deleted"
            }else{
                console.log("not deleted");
                throw new Error('not deleted')
    
            }
        } catch (error) {
            console.log(error);
            throw new Error(error)

        }

    },

    likePost:async(_,{postId},context)=>{

        const {username} = checkauth(context);

        const post = await Post.findById(postId)

        if(post){
            if(post.likes.find(l=>l.username===username)){
                post.likes= post.likes.filter(like=>like.username!==username)
                
            }else{
                post.likes.push({
                    username,
                    createdAt:new Date().toISOString
                })
            }

            await post.save();
                return post
        }else{
            throw new Error('Post not exist')
        }


    }

    
 },

 Subcription:{
    newPost:{
        subscribe:(_,__,{pubsub})=> pubsub.asyncIterator('NEW POST')
        
    }
}

}

export default postResolvers
