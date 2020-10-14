const getMyRank = require('./index')

!(async () => {
  console.time('time')
  const rankObj = await getMyRank('theDavidBarton', 'Hungary')
  console.timeEnd('time')
  console.log(rankObj)
})()
