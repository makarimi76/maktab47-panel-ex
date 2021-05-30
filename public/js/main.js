let currentPage = 1
let pageStep = 10
let pageHash = ''
let totalData = []
let sliceData = []

// Update pageHash
$(document).ready(function () {
    pageHash = location.hash.slice(1)
    getData()
});
$(window).on('hashchange', async (e) => {
    currentPage = 1
    pageHash = e.target.location.hash.slice(1)
    getData()
})


// Fetch data & update totalData
const getData = () => {
    $('main').empty()
    $.get(`http://localhost:3000/${pageHash}`, (data) => {
        totalData = data
        updateDom()
    })
}


// Update DOM
const updateDom = () => {
    sliceData = totalData.slice((currentPage - 1) * pageStep, currentPage * pageStep)

    $('main').empty()

    let tbody = ''

    $('main').append('<table class="table table-striped table-sm"></table>')

    if (pageHash === 'orders') {
        $('table').append(`
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>state</th>
                    <th>create</th>
                </tr>
            </thead>      
        `)

        sliceData.map(item => {
            tbody += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.state}</td>
                    <td>${item.createAt}</td>
                </tr>
                `
        })

    } else if (pageHash === 'products') {
        $('table').append(`
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>state</th>
                    <th>create</th>
                    <th>quantity</th>
                </tr>
            </thead>
    `)
        sliceData.map(item => {
            tbody += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.state}</td>
                    <td>${item.createAt}</td>
                    <td>${Math.ceil(Math.random() * 100)}</td>
                </tr>
                `
        })
    }

    // Pagination
    $('main').append(`<ul id='pagination' class="pagination justify-content-center"></ul>`)

    const totalPage = totalData.length / pageStep

    let pagination = ''
    for (let i = 1; i <= totalPage; i++) {
        if (currentPage == i) {
            pagination += `
            <li class="page-item active"><a class="page-link" href="#" onclick="return false">${i}</a></li>
            `
        } else {
            pagination += `
            <li class="page-item" onclick="pageHandler(${i})" ><a class="page-link" href="#" onclick="return false">${i}</a></li>
            `
        }
    }

    $('.pagination').html(`
        ${currentPage !== 1 ? `
            <li class="page-item" onclick="pageHandler(${currentPage - 1})"><a class="page-link" href="#" onclick="return false">Previous</a></li>
        ` : ''}
        ${pagination}
        ${!(currentPage + 1 > totalPage) ? `
            <li class="page-item" onclick="pageHandler(${currentPage + 1})"><a class="page-link" href="#" onclick="return false">Next</a></li>
        ` : ''}
    `)

    $('table').append('<tbody></tbody>')
    $('tbody').html(tbody)
}


// Page Handler
const pageHandler = (page) => {
    currentPage = page
    updateDom()
}