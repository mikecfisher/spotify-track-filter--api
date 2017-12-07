import fetch from 'node-fetch'
import clientCredentials from './client-credentials'

function errorMsg (error) {
  if (error) {
    const {
        status = '', message = 'no details'
    } = error
    return `Error: ${status}: ${message}`
  }
  return 'An unknown error!'
}

function throwExceptionOnError (data) {
  if (data.error) {
    throw new Error(errorMsg(data.error))
  }
}

const headers = {
  'Accept': 'application/json',
  'Authorization': ''
}

let awaitingAuthorization

const spotifyProxy = () => {
  if (awaitingAuthorization && !clientCredentials.isExpired()) {
    return awaitingAuthorization
  }
  if (!awaitingAuthorization || clientCredentials.isExpired()) {
    awaitingAuthorization = new Promise((resolve, reject) => {
      clientCredentials.authenticate()
        .then((token) => {
          headers.Authorization = 'Bearer ' + token.access_token
          resolve(headers)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  return awaitingAuthorization
}

const haveHeadersWithAuthToken = async() => {
  return await spotifyProxy()
}

export const fetchArtistsByName = async(name) => {
  console.log(`debug: query artist ${name} `)

  const response = await fetch(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
    headers: await haveHeadersWithAuthToken()
  })
  const data = await response.json()
  throwExceptionOnError(data)

  return (data.artists.items || [])
        .map(artistRaw => spotifyJsonToArtist(artistRaw))
}

export const fetchAlbumsOfArtist = async(artistId, limit) => {
  console.log(`debug: query albums of artist ${artistId} `)
  console.log('limit passed in', limit)

  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
    headers: await haveHeadersWithAuthToken()
  })
  const data = await response.json()
  throwExceptionOnError(data)

  return (data.items || [])
        .slice(0, limit)
        .map(albumRaw => spotifyJsonToAlbum(albumRaw))
}

const spotifyJsonToArtist = (raw) => {
  return {
    ...raw,

    image: raw.images[0] ? raw.images[0].url : '',

    albums: (args, object) => {
      const artistId = raw.id
      const {
                limit = 1
            } = args
      return fetchAlbumsOfArtist(artistId, limit)
    }
  }
}

const spotifyJsonToAlbum = (albumRaw) => {
  return {
    ...albumRaw,
    image: albumRaw.images[0] ? albumRaw.images[0].url : ''
  }
}

export const fetchTracksOfAlbum = async(albumId, limit) => {
  console.log(`debug: query tracks of album ${albumId} `)

  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: await haveHeadersWithAuthToken()
  })
  const data = await response.json()
  throwExceptionOnError(data)

  return (data.items || [])
        .slice(0, limit)
        .map(tracksRaw => spotifyJsonToTracks(tracksRaw))
}

const spotifyJsonToTracks = (tracksRaw) => {
  return {
    ...tracksRaw
  }
}
