'use strict'
const File = use('App/Models/File')
const PDFParser = require('pdf2json')
const fs = require('fs')
const Helpers = use('Helpers')

class ReaderFileController {
  async show ({ params }) {
    const pdfData2 = await File.findOrFail(params.id)
    const tmpPath = Helpers.tmpPath('uploads')

    console.log(pdfData2.$attributes.name)

    console.log(tmpPath)
    if (await pdfData2) {
      const pdfParser = new PDFParser()

      await pdfParser.on('pdfParser_dataError', function (errData) {
        console.error(errData.parserError)
      })
      await pdfParser.on('pdfParser_dataReady', function (pdfData) {
        // Gravando em disco
        fs.writeFile(tmpPath, JSON.stringify(pdfData), function (err) {
          if (err) {
            return console.log(err)
          }
          console.log('Salvou arquivo')
        })

        // Todo o objeto
        console.log(pdfData)

        // Conteudo fica dentro de pages
        console.log(pdfData.formImage.Pages)

        // Teste - primeira pagina - primeiro texto
        console.log(pdfData.formImage.Pages[0].Texts[0].R)
      })

      await pdfParser.loadPDF(pdfData2)
    } else {
      console.log('Arquivo não localizado')
    }
  }
}

module.exports = ReaderFileController
