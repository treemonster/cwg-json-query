function s_rule(str) {
  let s=[], t, _ff
  str=str.replace(/\s+/g, '').split('')
  for(let i=0; i<str.length; i++) {
    if(!t) t=''
    let c=str[i], d=c+str[i+1], e=d+str[i+2]
    let ff=_=>{
      if(t && s[s.length-1] && Array.isArray(s[s.length-1])) {
        s[s.length-1].push(t)
        t=''
      }
    }
    switch(true) {
      case c==='(':
        s.push(c)
        break
      case c===')':
        ff()
        let n=[]
        for(let j=s.pop(); j!=='('; j=s.pop()) {
          n.unshift(j)
        }
        s.push(n)
        break
      case d==='&&' || d==='||':
        ff()
        s.push(d)
        i++
        break

      case ['$>', '$=', '$<', '$$'].includes(d):
        i+=d.length-1
        s.push([t, d])
        t=''
        break
      case ['$!=', '$<=', '$>='].includes(e):
        i+=e.length-1
        s.push([t, e])
        t=''
        break

      default:
        t+=c
        break
    }
    _ff=ff
  }
  _ff()
  return s
}

exports.filter=exp=>{
  let filter={}, _str
  exp.replace(/(^.*?)\s*(?:\,\s*(true|false|yes|no|1|0)){0,1}\s*\:\s*([\s\S]+)/ig, (_, key, match_remove, str)=>{
    filter={
      key,
      match_remove: match_remove? !!match_remove.match(/true|yes|1/i): false,
      rule: s_rule(str)
    }
  })
  return filter
}

/*
filter={
  key: '$.x.y',
  match_remove: true, // match_remove是true，所以符合条件的将被删除
  rule: [
    ['a', '$>', -1],
    '&&',
    [
      ['b', '$>', 10],
      '||',
      ['b', '$<', 6],
    ],
  ],
}

exp=`$.x.y,true: a $> -1 && (b $> 10 || b $< 6)`

*/


exports.group=exp=>{
  if(exp+''===exp) exp=[exp]
  let group={}
  exp.map(e=>e.replace(/(^[^:]+)\s*\:\s*([\s\S]+)/ig, (_, rows, str)=>{
    rows.split(',').map(a=>{
      a=a.trim()
      group[a]=group[a]||[]
      group[a].push(str)
    })
  }))
  return Object.keys(group).map(x=>{
    return this.filter(x+',0:'+'('+group[x].join(') || (')+')')
  })
}

/* 
    [
      `$.m1.c: x $= 3`,
      `$.m2.c: x $= 3 || x $= 5`,
    ]

  {
    '$.m1.c': ['x', '$=', 3],
    '$.m2.c': [
      ['x', '$=', 3],
      '||',
      ['x', '$=', 5],
    ]
  }

  $.m1.c,$.m2.c: x $!= 3

  {
    '$.m1.c': ['x', '$!=', 3],
    '$.m2.c': ['x', '$!=', 3],
  }
*/
