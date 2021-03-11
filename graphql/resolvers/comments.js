import Post from '../../models/Post.js'
import checkauth from '../../utils/checkauth.js'


const commentsResolver={
    
   Mutation:{

    createComment:async(_,{postId,body},context)=>{

        const {username} = checkauth(context)

        if(body.trim()===''){
            throw new Error('empty body',{
                error:{
                    body:'cuerpo vacio'
                }
            })
        }

        const post = await Post.findById(postId)
        
        if(post){
            post.comments.unshift({
                body,
                username,
                createdAt:new Date().toISOString
            });

            await post.save();
            return post
        }else throw new Error('Post not exist')
    
    },

    deleteComment:async(_,{postId,commentId},context)=>{

        const {username} = checkauth(context)

        const post = await Post.findById(postId)

        if(post){
            const commentIndex = post.comments.findIndex(c=>c.id===commentId)

            if(post.comments[commentIndex].username===username){
                post.comments.splice(commentIndex,1)
                await post.save()
                return post;
            }else{
                throw new Error('not the current user')
            }
        }else{               
             throw new Error('post not found')

        }

    }
   }
    
}

export default commentsResolver