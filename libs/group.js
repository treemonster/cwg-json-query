const {filter_json, clone_json}=require('./libs')

module.exports=(group, cdata)=>{
  let t=[]
  for(let i=0; i<group.length; i++) {
    let filter=group[i]
    let {L_vars}=filter_json(filter, clone_json(cdata))
    for(let j=0; j<L_vars.length; j++) {
      if(!L_vars[j].$item) continue
      t=t.concat(L_vars[j][filter.key])
    }
  }
  return [...new Set(t)]
}

