这是一个简易的json数据分组和过滤工具

使用示例：

```
const libsL=require('cwg-json-query')

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
  remove: [
    '$.m1.c.y',
    '$.x1.y',
  ],
}

console.log(JSON.stringify(libsL(cdata).filter(f.filter).group(f.group).remove(f.remove), null, 2))

```

输出：
```
{
  "data": {
    "m1": [
      {
        "a": 1,
        "b": 1,
        "c": [
          {
            "x": 1
          }
        ]
      },
      {
        "a": 2,
        "b": 2,
        "c": [
          {
            "x": 2
          }
        ]
      },
      {
        "a": 3,
        "b": 3,
        "c": [
          {
            "x": 3
          }
        ]
      }
    ],
    "m2": [
      {
        "a": 5,
        "b": 5,
        "c": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 55
          }
        ]
      }
    ],
    "x0": [
      {
        "x": 3,
        "y": 33
      },
      {
        "x": 5,
        "y": 5
      },
      {
        "x": 5,
        "y": 55
      }
    ],
    "x1": [
      {
        "x": 1
      },
      {
        "x": 2
      },
      {
        "x": 5
      },
      {
        "x": 5
      }
    ]
  }
}

```