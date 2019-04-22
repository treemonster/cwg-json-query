const {walk_json}=require('./libs')

module.exports=(remove, cdata)=>{
  let rm={}
  remove.map(r=>{
    r.replace(/^(.*?)\.([^\.]+$)/, (_, x, y)=>{
      rm[x]=rm[x]||{}
      rm[x][y]=1
    })
  })

  walk_json(cdata, (o, key)=>{
    if(!rm[key]) return;
    Object.keys(rm[key]).map(k=>{
      delete o[k]
    })
  })
  return cdata
}
