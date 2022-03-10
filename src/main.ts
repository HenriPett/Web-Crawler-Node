import axios from 'axios'
import cheerio from 'cheerio'
import { Worker } from 'worker_threads'

const workDir = __dirname + '/dbWorker.ts'

const main = async () => {
  const url = `https://www.iban.com/exchange-rates`

  const res = await fetchData(url)
  if (!res.data) {
    console.log('Invalid data obj')
    return
  }
  const html = res.data
  const dataObj = new Object()

  const $ = cheerio.load(html)

  const statsTable = $(
    '.table.table-bordered.table-hover.downloads > tbody > tr'
  )

  statsTable.each(function () {
    const title = $(this).find('td').text()
    const newStr = title.split('\t')
    newStr.shift()
    formatStr(newStr, dataObj)
  })
  return dataObj
}

async function fetchData(url: string): Promise<any> {
  console.log('Crawling...')
  const response = await axios.get(url)

  if (response.status !== 200) {
    console.log('Error occured while fetching data')
    return
  }

  return response
}

function formatStr(arr: Array<any>, dataObj: any) {
  // regex to match all the words before the first digit
  let regExp = /[^A-Z]*(^\D+)/
  let newArr = arr[0].split(regExp) // split array element 0 using the regExp rule
  dataObj[newArr[1]] = newArr[2] // store object
}

main().then((res) => {
  const worker = new Worker(workDir)
  console.log('Sending data to dbWorker')
  worker.postMessage(res)
  worker.on('message', (message: string) => {
    console.log(message)
  })
})
