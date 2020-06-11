import require from '@/utils/require'

export function getHotSongList(oParams) {
  return require.get('/top/list', {
    params: oParams.params
  });
};

