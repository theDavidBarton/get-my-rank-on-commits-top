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
 * @param {string} userName: (mandatory) exact GitHub user name
 * @param {string} country: (mandatory) your home country https://commits.top/
 * @return {string} rank: your rank on commits.top in Contributions category per your home country
 */

const getMyRank = async (userName, country) => {
  try {
    const commitsTopPage = `https://commits.top/${country.toLowerCase().replace(' ', '_')}_public.html`
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(commitsTopPage)
    let rank
    for (let i = 1; i < 257; i++) {
      rank = await page.$eval(`tr:nth-child(${i})`, el => el.innerText)
      if (rank.includes(userName)) {
        ;[rank] = rank.match(/[0-9]+/)
        break
      }
    }
    await browser.close()
    return {
      rank: rank,
      user: userName,
      country: country
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = getMyRank
