import require from '@/utils/require';

export function getIndexUs(oParams){
  return require.get('/get/index/us', {
    params: oParams.params
  });
};
export function putIndexUs(oParams){
  return require.put('/put/index/us', oParams.data);
};


export function getIndexImgNews(oParams){
  return require.get('/get/index/news_img', {
    params: oParams.params
  });
};

export function getIndexNews(oParams){
  return require.get('/get/index/news', {
    params: oParams.params
  });
};
export function getIndexProducts(oParams){
  return require.get('/get/index/products', {
    params: oParams.params
  });
};
