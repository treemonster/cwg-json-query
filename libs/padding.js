const {walk_json, get_filter_vars, flatten_data, rule_fix, clone_json, sub_obj_rule}=require('./libs')

module.exports=(padding, cdata, pdata)=>{

  let vars_c=get_filter_vars(padding.c, rule_fix(clone_json(padding.cp), false))
  let vars_p=get_filter_vars(padding.p, rule_fix(clone_json(padding.cp), true))

  let L_vars_c=flatten_data(vars_c, cdata, padding.c)
  let L_vars_p=flatten_data(vars_p, pdata, padding.p)

  for(let c=0; c<L_vars_c.length; c++) {
    for(let p=0; p<L_vars_p.length; p++) {
      let vars=clone_json(L_vars_c[c]), filter={
        key: padding.c,
        rule: rule_fix(clone_json(padding.cp), false, '\0.')
      }
      for(let kp in vars_p) {
        vars[padding.c+'.\0.'+kp.substr(padding.p.length+1)]=L_vars_p[p][kp]
      }
      if(!sub_obj_rule(vars, filter, 1)) continue
      let pi=L_vars_p[p].$item, ci=L_vars_c[c].$item
      padding.p2c.map(([fp, fc])=>{
        walk_json(pi, (p, key)=>{
          if(key!=='$' && (fp+'.').indexOf(key.substr(2)+'.')===-1) return
          if(key === '$.'+fp) {
            Array.isArray(ci[fc])? ci[fc].push(p): (ci[fc]=p)
            return
          }
          let ff=p[fp.split('.')[(key.match(/\./g)||[]).length]]
          if(Array.isArray(ff)) ci[fc]=ci[fc]||[]
        })
      })
    }
  }
  return cdata
}
