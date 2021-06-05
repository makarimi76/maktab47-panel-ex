let currentPage = 1
let pageStep = 10
let pageHash = ''
let totalData = []
let sliceData = []
const defaultSrc =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr5BAakErp9tMExh_VNadeyHVAl5v3uKBlww&usqp=CAU'

// Update pageHash
$(document).ready(function () {
	pageHash = location.hash.slice(1)
	getData()
})
$(window).on('hashchange', async (e) => {
	currentPage = 1
	pageHash = e.target.location.hash.slice(1)
	getData()
})

// Fetch data & update totalData
const getData = () => {
	$('main').empty()
	if (pageHash == 'orders' || pageHash == 'products')
		$.get(`http://localhost:3000/${pageHash}`, (data) => {
			totalData = data
			updateDom()
		})
}

// Update DOM
const updateDom = () => {
	sliceData = totalData.slice(
		(currentPage - 1) * pageStep,
		currentPage * pageStep
	)

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
					<th>image</th>
                </tr>
            </thead>      
        `)

		sliceData.map((item) => {
			tbody += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.state}</td>
                    <td>${item.createAt}</td>
                    <td><img class="rounded-circle" width="50px" src=${
											item.image || defaultSrc
										}/></td>
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
		sliceData.map((item) => {
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
	$('main').append(
		`<ul id='pagination' class="pagination justify-content-center"></ul>`
	)

	const totalPage = Math.ceil(totalData.length / pageStep)

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
        ${
					currentPage !== 1
						? `
            <li class="page-item" onclick="pageHandler(${
							currentPage - 1
						})"><a class="page-link" href="#" onclick="return false">Previous</a></li>
        `
						: ''
				}
        ${pagination}
        ${
					!(currentPage + 1 > totalPage)
						? `
            <li class="page-item" onclick="pageHandler(${
							currentPage + 1
						})"><a class="page-link" href="#" onclick="return false">Next</a></li>
        `
						: ''
				}
    `)

	$('table').append('<tbody></tbody>')
	$('tbody').html(tbody)
}

// Page Handler
const pageHandler = (page) => {
	currentPage = page
	updateDom()
}

function updateJsonList(data) {
	//data.id data.title data.avatar data.name
	//data.state data.createdAt
	if (data.title == 'orders') {
		$.post('/orders', data).done(function () {
			getData()
		})
	} else if (data.title == 'products') {
		$.post('/products', data).done(function () {
			getData()
		})
	}
}

$('.modal-body button[type="submit"]').click(function () {
	let modalData = {}
	modalData.name = $('.modal-body #name').val()
	modalData.title = window.location.hash.slice(1)
	modalData.id = totalData.length + 1
	modalData.createAt = new Date()
	modalData.state = $('.modal-body #state').val()
	updateJsonList(modalData)
})
