const formatL=require('./format')
const filterL=require('./filter')
const groupL=require('./group')

module.exports=(data, {filter, group})=>{
  ; (filter||[]).map(f=>{
    data=filterL(formatL.filter(f), data)
  })

  let _group={}
  for(let g in group) _group[g]=groupL(formatL.group(group[g]), data)

  return {data, _group}
}