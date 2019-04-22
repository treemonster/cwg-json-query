const formatL=require('./format')
const filterL=require('./filter')
const groupL=require('./group')
const {clone_json}=require('./libs')

module.exports=(data, {filter, group})=>{

  let cdata=clone_json(data)
  ; (filter||[]).map(f=>{
    cdata=filterL(formatL.filter(f), cdata)
  })

  let _group={}
  for(let g in group) _group[g]=groupL(formatL.group(group[g]), clone_json(data))

  return {data: cdata, group: _group}
}