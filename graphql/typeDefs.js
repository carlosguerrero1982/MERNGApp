import gql from 'graphql-tag'


export const typeDefs=gql `

type Post{
    id:ID!
    body:String!
    createdAt:String!
    username:String! 
    comments:[Comment!]!
    likes:[Like]!
}

type Comment {
    id:ID!
    body:String!
    createdAt:String!
    username:String! 
    
}

type Like {
    id:ID!
    createdAt:String!
    username:String! 
    
}

 type Query{

     getPosts:[Post]
     getUsers:[User]
     getUser(id:ID):User
     getPost(postId:ID!):Post
 }

 type User{

    id:ID!
    email:String! 
    token:String! 
    username:String!
    createdAt:String! 

 }
 

input registerInput{

    username:String!
    password:String!
    confirmPassword:String! 
    email:String!

}

type Mutation{
    register(input:registerInput):User!
    login(username:String!,password:String!):User!
    createPost(body:String!):Post!
    deletePost(postId:ID!):String!
    createComment(postId:String!,body:String!):Post!
    deleteComment(postId:ID!,commentId:ID!):Post!
    likePost(postId:ID!):Post!
}

type Subscription{
    newPost:Post!
}

`