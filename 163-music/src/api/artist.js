import require from '@/utils/require'

export function getArtist(oParams) {
  return require.get('/artists', {
    params: oParams.params
  })
}

export function getArtistAlbum(oParams) {
  return require.get('/artists/album', {
    params: oParams.params
  })
}
