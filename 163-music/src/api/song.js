import require from '@/utils/require';

export function getSongUrl(oParams){
  return require.get('/song/url', {
    params: oParams.params
  });
};

export function getSongDetail(oParams){
  return require.get('/song/detail', {
    params: oParams.params
  });
};

export function getSongLyric(oParams){
  return require.get('/lyric', {
    params: oParams.params
  });
};

export function getSimiSong(oParams){//相似歌曲
  return require.get('/simi/song', {
    params: oParams.params
  });
};

export function getCommentMusic(oParams){//歌曲评论
  return require.get('/comment/music', {
    params: oParams.params
  });
};