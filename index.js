import pkg from 'apollo-server';
import mongoose from 'mongoose'
import {connection} from './config.js'
import User from './models/User.js'
import Post from './models/Post.js'
import {typeDefs} from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'

const {ApolloServer,PubSub} = pkg;


const pubsub = new PubSub()

const server = new ApolloServer({

    typeDefs,
    resolvers,
    context:({req,res})=>({req,res,pubsub})

});

mongoose.connect(connection,{useNewUrlParser:true}).
then(()=>{
    console.log('conectado base datos');
    return server.listen({port:5000}).then(console.log('conectado en el 5000'))
})




