const getMyRank = require('./index')

!(async () => {
  const rankObj = await getMyRank('theDavidBarton', 'Hungary')
  console.log(rankObj.rank)
})()
