const filterL=require('./libs/filter')
const formatL=require('./libs/format')
const groupL=require('./libs/group')
const removeL=require('./libs/remove')
const libsL=require('./libs')

let filter, cdata, exp

/*
// $.x
// (a $= 1 && d.e $> 0 ) || (a $= 2 || (b $> 0 && c $< 3) || y.z $< 100)
filter={
  key: '$.x',
  match_remove: false, // false表示符合条件的表示需要保留的，true表示符合条件的需要删除
  rule: [
    [
      ['a', '$=', 1],
      '&&',
      ['d.e', '$>', 0],
    ],
    '||',
    [
      ['a', '$=', 2],
      '||',
      [
        ['b', '$>', 0],
        '&&',
        ['c', '$<', 3],
      ],
    ],
    '||',
    [
      ['y.z', '$<', 100],
    ],
    '||',
    [
      ['y.rr', '$$', '11|12'],
    ],
  ]
}

// 此处也可以支持数组
cdata=[{
  x: [
    {y: [[{z: 11}, {z: 22}]], a: 1, b: 1, c: 1, d: [{e: 1}, {e: 2}]},
    {y: [[{z: 11}, {z: 22}]], a: 1, b: 1, c: 1, d: [{e: 3}, {e: 5}]},
    {y: [[{z: 11}, {z: 22}]], a: 2, b: 1, c: 1, d: []},
    {y: [[{z: 11}, {z: 222}]], a: 1, b: 1, c: 4, d: []}, // removed
    {y: [[{z: 11}, {z: 221}]], a: 1, b: 2, c: 6, d: []}, // removed
    {y: [[{z: 11}, {z: 222}]], a: 12, b: 3, c: 5, d: []}, // removed
  ]
}, {
  x: [
    {y: [[{z: 11}, {z: 22}]], a: 1, b: 1, c: 1, d: [{e: 1}, {e: 2}]},
    {y: [[{z: 11}, {z: 22}]], a: 1, b: 1, c: 1, d: [{e: 3}, {e: 5}]},
    {y: [[{z: 11}, {z: 22}]], a: 2, b: 1, c: 1, d: []},
    {y: [[{z: 11}, {z: 22}]], a: 1, b: 1, c: 4, d: []},
    {y: [[{z: 11}, {z: 221}]], a: 1, b: 2, c: 6, d: []}, // removed
    {y: [[{z: 11}, {z: 222}]], a: 2, b: 3, c: 5, d: []},
    {y: [[{z: 11, rr: [11, 22]}, {z: 221, rr: [12, 33]}]], a: 1, b: 2, c: 6, d: []},
    {y: [[{z: 11, rr: [11, 22]}, {z: 221, rr: [162, 33]}]], a: 1, b: 2, c: 6, d: []}, // removed
  ]
},]

console.log(JSON.stringify(filterL(filter, cdata), null, 2))


filter={
  key: '$.x.y',
  match_remove: true, // match_remove是true，所以符合条件的将被删除
  rule: [
    ['a', '$>', -1],
    '&&',
    [[
      ['b', '$>', 10],
      '||',
      ['b', '$<', 6],
    ]],
  ],
}

cdata=[{
  x: [{
    y: [
      {a: 0, b: 11}, // removed
      {a: 0, b: 8},
    ],
  }, {
    y: [
      {a: 0, b: 11}, // removed
      {a: 0, b: 8},
      {a: 0, b: 3}, // removed
    ],
  }]
}]

console.log(JSON.stringify(filterL(filter, cdata), null, 2))


exp=`$.x.y,true: a $> -1 && (b $> 10 || b $< 6)`
console.log(JSON.stringify(formatL.filter(exp), null, 2))
*/

/*
cdata={
  m1: [{
    a: 1,
    b: 1,
    c: [{x: 1, y: 1}, {x: 1, y: 11}],
  }, {
    a: 2,
    b: 2,
    c: [{x: 2, y: 2}, {x: 2, y: 22}],
  }, {
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }],
  m2: [{
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }, {
    a: 5,
    b: 5,
    c: [{x: 5, y: 5}, {x: 5, y: 55}],
  }]
}

f={
  filter: [
    '$.m1.c,true: x $> 0 && y $< 10',
    '$.m2,true: a $< 5',
  ],
  group: {
    x0: [
      `$.m1.c: x $= 3`,
      `$.m2.c: x $= 3 || x $= 5`,
    ], // 标准写法
    x1: `$.m1.c,$.m2.c: x $!= 3`, // 简写
  },
}
*/

// console.log(JSON.stringify(libsL(cdata, f), null, 2))
/*
console.log(formatL.group([
  `$.m1.c: x $= 3`,
  `$.m2.c: x $= 3 || x $= 5`,
]))
console.log(formatL.group(`$.m1.c,$.m2.c: x $!= 3`))
*/

/*
console.log(JSON.stringify(groupL(formatL.group([
  `$.m1.c: x $= 3`,
  `$.m2.c: x $= 3 || x $= 5`,
]), {
  m1: [{
    a: 1,
    b: 1,
    c: [{x: 1, y: 1}, {x: 1, y: 11}],
  }, {
    a: 2,
    b: 2,
    c: [{x: 2, y: 2}, {x: 2, y: 22}],
  }, {
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }],
  m2: [{
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }, {
    a: 5,
    b: 5,
    c: [{x: 5, y: 5}, {x: 5, y: 55}],
  }]
})))
*/

cdata={
  m1: [{
    a: 1,
    b: 1,
    c: [{x: 1, y: 1}, {x: 1, y: 11}],
  }, {
    a: 2,
    b: 2,
    c: [{x: 2, y: 2}, {x: 2, y: 22}],
  }, {
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }],
  m2: [{
    a: 3,
    b: 3,
    c: [{x: 3, y: 3}, {x: 3, y: 33}],
  }, {
    a: 5,
    b: 5,
    c: [{x: 5, y: 5}, {x: 5, y: 55}],
  }]
}

pdata={
  m1: [{
    f: {a: 1, b: 1},
    o: {q: 11, w: 22, e: 33},
    s: [{x: 111}, {x: 1110}],
  }, {
    f: {a: 0, b: 2},
    o: {q: 55, w: 66, e: 77},
    s: [{x: 222}, {x: 2220}],
  }, {
    f: {a: 3, b: 3},
    o: {q: 88, w: 99, e: 122},
    s: [{x: 333}, {x: 3330}],
  }, ],
}

console.log(JSON.stringify(
  libsL(cdata).padding(pdata, [
  	// 选择元素 : 填充规则 : 选取规则
  	// 以下语句表示：选取$.m1和$p.m1这两个元素作为操作数，当这两个操作数下的a相等或者b相等时，把$p.m1的o，p，和s.x分别填充给$.m1
  	// 此处判断条件中的元素必须是一对一比较，不可以数组比较，即此处的a、b、f.a、f.b、f 都不可以是数组，否则逻辑上会产生歧义
  	'$.m1, $p.m1 : o <= o, q <= o.q, sx <= s.x : a $= f.a || b $= f.b'
  ]).filter([
    // 符合条件的保留
    // 等价于 $.xx,false: ....
    '$.m1.c: x $> 0 && y $< 10',
    '$.m2: a $< 5',
  ]).group({
    x0: [
      `$.m1.c: x $= 3`,
      `$.m2.c: x $= 3 || x $= 5`,
    ], // 标准写法
    x1: `$.m1.c,$.m2.c: x $!= 3`, // 简写
  }).remove([
    '$.m1.c.y',
    '$.x1.y',
  ]),
null, 2))
