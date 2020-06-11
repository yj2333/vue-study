import require from '@/utils/require'

export function getSeachHot(oParams) {
  return require.get('/search/hot', {
    params: oParams.params
  })
}

export function getSeach(oParams) {
  return require.get('/search', {
    params: oParams.params
  })
}

