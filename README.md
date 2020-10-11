# get-my-rank-on-commits-top

Get my rank on commits.top

## Usage

```javascript
const getMyRank = require('get-my-rank-on-commits-top')

!(async () => {
  const rankObj = await getMyRank('theDavidBarton', 'Hungary')
  console.log(rankObj)
})()
```

```javascript
{
    rank: '27',
    user: 'theDavidBarton',
    country: 'Hungary'
}
```

## Source

https://commits.top/

# Copyright

MIT License

Copyright (c) 2020 David Barton
