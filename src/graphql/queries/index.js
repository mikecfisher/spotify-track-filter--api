import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { bookType } from '../types'

export default new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    book: {
      description: 'a graph node of type book',
      type: new GraphQLList(bookType),
      args: {
        uuid: {
          description: 'unique id (uuid) of book',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { uuid }) => 'book'
    },

    books: {
      description: 'a collection of nodes of type book',
      type: new GraphQLList(bookType),
      resolve: (root, args) => 'books'
    }
  })
})
