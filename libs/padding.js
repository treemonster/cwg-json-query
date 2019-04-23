const {walk_json, get_filter_vars, flatten_data, rule_fix}=require('./libs')

module.exports=(padding, cdata, pdata)=>{
  let vars_c=get_filter_vars(padding.c, rule_fix(padding.cp, true))
  let vars_p=get_filter_vars(padding.p, rule_fix(padding.cp, false))
console.log(padding, vars_p)

  let L_vars_c=flatten_data(vars_c, cdata, padding.c)
  let L_vars_p=flatten_data(vars_p, pdata, padding.p)

  console.log(L_vars_p)

  process.exit()
  return cdata
}
