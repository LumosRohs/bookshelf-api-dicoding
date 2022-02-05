const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  let finished

  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (finished !== undefined) {
    const filteredFinished = books.filter((book) => book.finished === true).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
    const filteredNotFinished = books.filter((book) => book.finished === false).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
    if (finished === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: filteredFinished
        }
      })
      response.code(200)
      return response
    } else if (finished === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: filteredNotFinished
        }
      })
      response.code(200)
      return response
    }
  }

  const newBooks = books.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  if (name !== undefined) {
    const filteredName = newBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))

    const response = h.response({
      status: 'success',
      data: {
        books: filteredName
      }
    })
    response.code(200)
    return response
  }

  if (reading !== undefined) {
    const filteredReading = books.filter((book) => book.reading === true).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
    const filteredNotReading = books.filter((book) => book.reading === false).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
    if (reading === '1') {
      const response = h.response({
        status: 'success',
        data: {
          books: filteredReading
        }
      })
      response.code(200)
      return response
    } else if (reading === '0') {
      const response = h.response({
        status: 'success',
        data: {
          books: filteredNotReading
        }
      })
      response.code(200)
      return response
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: newBooks
    }
  })
  response.code(200)
  return response
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.filter((b) => b.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === id)

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
