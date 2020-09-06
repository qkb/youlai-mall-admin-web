import request from '@/utils/request'

export function pageList(queryParams) {
  return request({
    url: '/youlai-admin/users',
    method: 'get',
    params: queryParams
  })
}

export function detail(id) {
  return request({
    url: '/youlai-admin/users/' + id,
    method: 'get'
  });
}

export function add(data) {
  return request({
    url: '/youlai-admin/users',
    method: 'post',
    data: data
  })
}


export function update(id, data) {
  return request({
    url: '/youlai-admin/users/' + id,
    method: 'put',
    data: data
  });
}

export function del(ids) {
  return request({
    url: '/youlai-admin/users',
    method: 'delete',
    params: {ids: ids}
  })
}
