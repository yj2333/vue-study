import require from '@/utils/require';

export function getAlbum(oParams) {
  return require.get('/album', {
    params: oParams.params
  });
};

export function getAlbumComment(oParams) {
  return require.get('/comment/album', {
    params: oParams.params
  });
};
