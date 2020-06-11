import require from '@/utils/require';

export function getPlayList(oParams){
  return require.get('/playlist/detail', {
    params: oParams.params
  });
};

export function getPlayListComment(oParams){
  return require.get('/comment/playlist', {
    params: oParams.params
  });
};



