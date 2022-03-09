import axios from 'axios'
import cheerio from 'cheerio'

const url = `https://www.iban.com/exchange-rates`

fetchData(url).then((res) => {
  const html = res.data
  const $ = cheerio.load(html)
  const statsTable = $(
    '.table.table-bordered.table-hover.downloads > tbody > tr'
  )

  statsTable.each(function () {
    const title = $(this).find('td').text()
    console.log(title)
  })
})

async function fetchData(url: string): Promise<any> {
  console.log('Crawling...')
  const response = await axios.get(url)

  if (response.status !== 200) {
    console.log('Error occured while fetching data')
    return
  }

  return response
}
