// 提取filter中所有的操作数
function _get_filter_vars(f_key, f_rules, e={}) {
  for(let i=0; i<f_rules.length; i++) {
    let a=f_rules[i]
    if(a+'' === a) continue
    else if(a[0]+'' === a[0]) {
      e[f_key+'.'+a[0]]=1
    }else if(Array.isArray(a[0])) {
      _get_filter_vars(f_key, a, e)
    }
  }
  return e
}
// 补充父级的vars
function get_filter_vars(f_key, f_rules) {
  let vars=_get_filter_vars(f_key, f_rules)
  Object.keys(vars).map(o=>{
    let r=/\.[^\.]+$/
    while(o.match(r)) {
      o=o.replace(r, '')
      vars[o]=vars[o]||2
    }
  })
  return vars
}

// 把原始数据中的操作数提取到扁平数组中
function flatten_data(vars, data, filter_key, key='$') {
  if(Array.isArray(data)) {
    return data.map(d=>flatten_data(vars, d, filter_key, key)).reduce((a,b)=>a.concat(b), [])
  }else {
    let p={}, arrs=[], res=[], item=null
    if(key===filter_key) item=data
    for(let k in data) {
      let k2=key+'.'+k
      if(!vars[k2]) continue
      p[k2]=data[k]
      if(vars[k2]===1) continue
      if(Array.isArray(data[k])) arrs.push([k2, data[k]])
      else if(typeof data[k]==='object') arrs.push([k2, [data[k]]])
    }
    res.push(p)
    for(let i=0; i<arrs.length; i++) {
      let [k, data]=arrs[i]
      let e=flatten_data(vars, data, filter_key, k)
      let n_res=[]
      for(let j=0; j<e.length; j++) {
        for(let k=0; k<res.length; k++) {
          n_res.push(Object.assign({}, res[k], e[j]))
        }
      }
      if(n_res.length>0) res=n_res
    }
    res.map(r=>item? Object.assign(r, {$item: item}): r)
    return res
  }
}

// 遍历json
function walk_json(cdata, fn, key='$') {
  if(Array.isArray(cdata)) {
    cdata.map(d=>walk_json(d, fn, key))
  }else {
    fn(cdata, key)
    for(let k in cdata) {
      let d=cdata[k]
      if(Array.isArray(d) || typeof d==='object')
        walk_json(d, fn, key+'.'+k)
    }
  }
}

// 代入运算
function sub_obj_rule(vars, filter) {
  let {key, rule}=filter
  let _rule=JSON.parse(JSON.stringify(rule))
  let rr=r=>r.map(t=>{
    if(t+'' === t) return t
    if(Array.isArray(t[0])) return rr(t)
    let v=vars[key+'.'+t[0]], e=t[2]
    if(v===undefined) return false
    switch(t[1]) {
      case '$>': return v>e
      case '$=': return v==e
      case '$<': return v<e
      case '$!=': return v!=e
      case '$<=': return v<=e
      case '$>=': return v>=e
      case '$$': return (any=>{
        let _reg, _str
        e.replace(/^\/(.*)\/([igu]*)$|^.*/, (_, a, b)=>{
          _reg=new RegExp(a||_, b)
        })
        if(Array.isArray(any) || (typeof any).match(/string|number|boolean/) || any===null) {
          _str=any+''
        }else _str=JSON.stringify(any)
        return !!_str.match(_reg)
      })(v)
    }
  })
  return _calc(rr(_rule))
}

function _calc(arr_exp) {
  if((typeof arr_exp).match(/boolean|string/)) return arr_exp
  let res=[]
  while(arr_exp.length) {
  	let e=arr_exp.shift(), o=res[res.length-1]
    if(o==='&&' || o==='||') {
      res.pop()
      let x=res.pop(), y=_calc(e)
      res.push(o==='&&'? x && y: x || y)
    }else res.push(_calc(e))
  }
  return res[0]
}

function clone_json(data) {
  return JSON.parse(JSON.stringify(data))
}

function filter_json(filter, cdata) {

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
  return {cdata, L_vars, vars}
}


module.exports={
  get_filter_vars,
  flatten_data,
  sub_obj_rule,
  clone_json,
  filter_json,
  walk_json,
}
