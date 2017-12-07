import express from 'express'
import graphqlHTTP from 'express-graphql'
import logger from 'morgan'
import bodyParser from 'body-parser'
import _debug from 'debug'
import cors from 'cors'

import schema from '../data/schema'
import { fetchArtistsByName, fetchTracksOfAlbum } from '../data/resolvers'

// import loaders from './graphql/loaders'

/**
 * Base App Configuration
 */
const app = express()
const debug = _debug('api:server')
// const Book = new Book()

debug('configuring server middleware')

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

debug('finished configuring server middleware')

/**
 * Authenticated Routs / Middleware
 */

const rootValue = {
  queryArtists: ({ byName }) => fetchArtistsByName(byName),
  queryTracks: ({byId}) => fetchTracksOfAlbum(byId)
}

/**
* GraphQL routes
*/
app.use('/graphql', cors({origin: '*'}), graphqlHTTP(request => ({
  schema: schema,
  graphiql: process.env.NODE_ENV !== 'production',
  rootValue: rootValue
})))

app.use('/', (req, res) => {
  res.json({ message: 'welcome to tenshi api!' })
})

/**
 * Error handling
 * Note: must be declared after routes
 */
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  let status = err.status || 500

  debug(err)
  res.status(status)
  res.end('Server Error: ' + status)
})

export default app
