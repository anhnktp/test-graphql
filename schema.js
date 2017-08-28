var axios = require("axios");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// // Hardcoded data
// const customers = [
//     {
//         id: '1',
//         name: 'John Doe',
//         email: 'jdoe@gmail.com',
//         age: 36
//     },
//     {
//         id: '2',
//         name: 'Steve Smith',
//         email: 'Steve@gmail.com',
//         age: 23
//     },
//     {
//         id: '3',
//         name: 'Sara william',
//         email: 'sara@gmail.com',
//         age: 24
//     }
// ]
//Custmer Type
const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields: () => ({
        id: {type:GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
})
//Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type: CustomerType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (parentValue, args, context) => {
                // for(let i = 0;i < customers.length; i++){
                //     if (customers[i].id == args.id){
                //         return customers[i];
                //     }
                // }
                console.log("123"+parentValue);
                console.log("232")
                console.log(context)
                return axios.get('http://localhost:3000/customers/'+args.id)
                            .then(res => {
                                return res.data;
                            });
            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(){
                return axios.get('http://localhost:3000/customers')
                .then(res => res.data);
            }
        }
    }
})
// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers',args)
                    .then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                    .then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id,args)
                    .then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})
