/*
   Build an HTTP query params from an object representing a filter query
   Example:
      Filter {a:'v1', b:'v2'} ==> '?a=v1&b=v2'
 */

export function buildQueryParams<T>(filter: T) : string {
  if (!filter){
    return ''
  }

  const keys = Object.keys(filter) as (keyof T)[];

  let queryParams = ''

  keys
    .filter(k => filter[k])
    .forEach((k, index) => {
      queryParams += `${index == 0 ? '?' : '&'}${k}=${filter[k]}`
    })

  return queryParams
}
