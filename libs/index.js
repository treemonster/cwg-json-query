const formatL=require('./format')
const filterL=require('./filter')
const groupL=require('./group')
const removeL=require('./remove')

module.exports=(data)=>{
  let fn={
    filter: filter=>{
      filter.map(f=>{
        data=filterL(formatL.filter(f), data)
      })
      return {...fn, data}
    },
    group: group=>{
      let _group={}
      for(let g in group) _group[g]=groupL(formatL.group(group[g]), data)
      data=Object.assign(data, _group)
      return {...fn, data}
    },
    remove: remove=>{
      data=removeL(remove, data)
      return {...fn, data}
    },
  }
  return fn
}
