/*
MIT License

Copyright (c) 2020 David Barton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const puppeteer = require('puppeteer')

/*
 * @param {string} userName: (mandatory) exact GitHub user name; case sensitive!
 * @param {string} country: (mandatory) your home country https://commits.top/
 * @return {string} rank: your rank on commits.top in Commits category per your home country
 * @return {string} rankContrib: your rank on commits.top in Contributions category per your home country
 * @return {string} rankAll: your rank on commits.top in All (private, public) commits category per your home country
 */

const getMyRank = async (userName, country) => {
  try {
    const cmTopPage = `https://commits.top/${country.toLowerCase().replace(' ', '_')}.html`
    const cmTopPageContrib = `https://commits.top/${country.toLowerCase().replace(' ', '_')}_public.html`
    const cmTopPageAll = `https://commits.top/${country.toLowerCase().replace(' ', '_')}_private.html`
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    const pageContrib = await browser.newPage()
    const pageAll = await browser.newPage()
    const visit = async (url, pge) => {
      // abort all images, source: https://github.com/GoogleChrome/puppeteer/blob/master/examples/block-images.js
      await pge.setRequestInterception(true)
      pge.on('request', request => {
        if (request.resourceType() === 'image') {
          request.abort()
        } else {
          request.continue()
        }
      })
      await pge.goto(url, { waitUntil: 'domcontentloaded' })
      let rank
      // top 256 GitHub users present
      for (let i = 1; i < 257; i++) {
        rank = await pge.$eval(`tbody > tr:nth-child(${i})`, el => el.innerText)
        if (rank.includes(userName)) {
          ;[rank] = rank.match(/[0-9]+/)
          break
        } else if (i === 256) {
          rank = null
        }
      }
      return rank
    }

    const [rankCm, rankContrib, rankAll] = await Promise.all([
      visit(cmTopPage, page),
      visit(cmTopPageContrib, pageContrib),
      visit(cmTopPageAll, pageAll)
    ])

    const rankObj = {
      rank: rankCm,
      rankContrib: rankContrib,
      rankAll: rankAll,
      user: userName,
      country: country
    }
    await browser.close()
    return rankObj
  } catch (e) {
    console.error(e)
  }
}

module.exports = getMyRank
