const {get_filter_vars, flatten_data, sub_obj_rule}=require('./libs')

module.exports=(filter, cdata)=>{

  let vars=get_filter_vars(filter.key, filter.rule)
  // console.log(vars,cdata)

  let L_vars=flatten_data(vars, cdata, filter.key)
  // console.log(L_vars)

  // 对于数组中的每组数据执行解析规则
  for(let i=0; i<L_vars.length; i++) {
    let v=L_vars[i], r=sub_obj_rule(v, filter)
    if(filter.match_remove? !r: r) continue
    for(let j=0; j<v[filter.key].length; j++) {
      if(v[filter.key][j] !== v.$item) continue
      v[filter.key].splice(j, 1)
      break
    }
  }
  // console.log(cdata)
  return cdata
}

