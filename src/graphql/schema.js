import { buildSchema } from 'graphql'

export const schema = buildSchema(`
#
# Let's start simple.
# Here we only use a little information from Spotify API
# from e.g. https://api.spotify.com/v1/artists/3t5xRXzsuZmMDkQzgOX35S
# This should be extended on-demand (only, when needed)
#
type Artist {
  name: String
  image_url: String
  albums: [Album]
}
# could also be a single
type Album {
  name: String
  image_url: String
  tracks: [Track]
}
type Track {
  name: String
  preview_url: String
  artists: [Artists]
  track_number: Int
}

# The "root of all queries."

type Query {
  queryArtists(byName: String = "Red Hot Chili Peppers"): [Artist]
}
`
)
