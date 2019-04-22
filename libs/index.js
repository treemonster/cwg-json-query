const formatL=require('./format')
const filterL=require('./filter')
const groupL=require('./group')
const removeL=require('./remove')
const {clone_json}=require('./libs')

module.exports=(data, {filter, group, remove})=>{

  let cdata=clone_json(data)
  ; (filter||[]).map(f=>{
    cdata=filterL(formatL.filter(f), cdata)
  })

  let _group={}
  if(group) for(let g in group) _group[g]=groupL(formatL.group(group[g]), clone_json(data))

  let res=Object.assign(cdata, _group)
  if(remove) res=removeL(remove, res)

  return res
}