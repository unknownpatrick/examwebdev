'use strict';

const HOST = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru';
const API_KEY = '619d919d-e099-4371-b800-7aa4e606d6df'; // СЮДА СВОЙ АПИ КЕЙ 

let routesData;
let filteredRoutes;

const itemsPerPage = 5;
let currentPage = 1;

function getRoute(id) {
 
}

function clearTable() {
    const tableBody = document.getElementById('ordersTable');
    tableBody.innerHTML = '';
}

function updateTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRoutes = filteredRoutes ?
        filteredRoutes.slice(startIndex, endIndex) :
        routesData.slice(startIndex, endIndex);
  
    clearTable();
    addRoutesToTable(currentRoutes);
    updatePagination();
}

function createPaginationItem(text, pageNumber) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item';
  
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = 'javascript:void(0)';
    pageLink.innerText = text;
  
    if (
        (text === 'Предыдущий' && currentPage === 1) ||
        (text === 'Следующий' && 
            currentPage === Math.ceil((filteredRoutes ? 
                filteredRoutes.length : routesData.length) / itemsPerPage)
        )) {
        pageItem.classList.add('disabled');
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            handlePageClick(pageNumber);
        });
    } else {
        pageLink.addEventListener('click', () => handlePageClick(pageNumber));
    }
 
    if (pageNumber === currentPage) {
        pageItem.classList.add('active');
    }
  
    pageItem.appendChild(pageLink);
  
    return pageItem;
}

function fetchRoutesFromApi() {
    fetch(
        `${HOST}/api/orders?api_key=${API_KEY}`
    )
        .then(response => response.json())
        .then(data => {
            routesData = data;
            updateTable();
        })
        .catch(error => console.error('Error fetching route data:', error));
}

async function addRoutesToTable(orders) {
    const tableBody = document.getElementById('ordersTable');
  
    orders.forEach(async (order) => {
        const route = await fetch(
            `${HOST}/api/routes/${order.route_id}?api_key=${API_KEY}`
        ).then(response => response.json());

        const guide = await fetch(
            `${HOST}/api/guides/${order.guide_id}?api_key=${API_KEY}`
        ).then(response => response.json());

        const row = tableBody.insertRow();
        row.insertCell(0).innerHTML = order.id;
        row.insertCell(1).innerHTML = route.name;
        row.insertCell(2).innerHTML = order.date;
        row.insertCell(3).innerHTML = order.price;

        const buttons = document.getElementById('orderButtons')
            .cloneNode(true);


        const viewModal = document.querySelector('#viewModal');
        const editModal = document.querySelector('#editModal');
        const deleteModal = document.querySelector('#deleteModal');

        row.insertCell(4).appendChild(buttons);

        buttons.classList.remove('d-none');
        buttons.querySelector('#viewOrderButton').addEventListener(
            'click',
            () => {
                viewModal.querySelector('#routeName').value = route.name;
                viewModal.querySelector('#guideFullName').value = guide.name;
                viewModal.querySelector('#orderDate').value = order.date;
                viewModal.querySelector('#startTime').value = order.time;
                viewModal.querySelector('#orderDuration').value = order.duration;
                viewModal.querySelector('#personsCount').value = order.persons;
                viewModal.querySelector('#price'
                ).textContent = order.price + ' руб.';
            },
        );
        buttons.querySelector('#editOrderButton').addEventListener(
            'click',
            () => { 
                const dateField = editModal.querySelector('#orderDate');
                const timeField = editModal.querySelector('#startTime');
                const durationField = editModal.querySelector('#orderDuration');
                const personsField = editModal.querySelector('#personsCount');
                const priceField = editModal.querySelector('#price');

                editModal.querySelector('#routeName').value = route.name;
                editModal.querySelector('#guideFullName').value = guide.name;
                dateField.value = order.date;
                timeField.value = order.time;
                durationField.value = order.duration;
                priceField.textContent = order.price + ' руб.';
                editModal.querySelector('#sendData').onclick = async () => {
                    const formData = new FormData();

                    formData.append("id", order.id);
                    formData.append("date", dateField.value);
                    formData.append("time", timeField.value);
                    formData.append("duration", durationField.value);
                    formData.append("persons", personsField.value);
                    formData.append("price", order.price); // TODO: make function to calculate

                    console.log(formData)

                    const requestOptions = {
                        method: 'PUT',
                        body: formData,
                        redirect: 'follow'
                    };

                    const guide = await fetch(
                        `${HOST}/api/orders/${order.id}?api_key=${API_KEY}`,
                        requestOptions
                    ).then(response => response.json()); 

                    fetchRoutesFromApi();
                };
            },
        );
        buttons.querySelector('#deleteOrderButton').addEventListener(
            'click',
            () => {
                deleteModal.onclick = async () => {
                    const requestOptions = {
                        method: 'DELETE',
                        redirect: 'follow'
                    };

                    const guide = await fetch(
                        `${HOST}/api/orders/${order.id}?api_key=${API_KEY}`,
                        requestOptions
                    ).then(response => response.json()); 

                    fetchRoutesFromApi();
                };
            }
        );
    });
}

function searchRoutes() { 
    filteredRoutes = routesData;
 
    const limitedRoutes = filteredRoutes.slice(0, itemsPerPage);
  
    clearTable();
    addRoutesToTable(limitedRoutes);
    updatePaginationAfterSearch(filteredRoutes);
    highlightSearchResult(searchKeyword);
}
  
function resetSearch() { document.getElementById('routeNameInput').value = '';
    document.getElementById('mainObjectSelect').value = '';
    filteredRoutes = null;
    updateTable();
}

  
function updatePagination() {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil((filteredRoutes ? filteredRoutes.length :
        routesData.length) / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Предыдущий', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = createPaginationItem(i, i);
        paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Следующий', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function updatePaginationAfterSearch(filteredRoutes) {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Предыдущий', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = createPaginationItem(i, i);
        paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Следующий', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function handlePageClick(pageNumber) {
    currentPage = pageNumber;
    updateTable();
}
  
function highlightSearchResult(searchKeyword) {
    const tableBody = document.getElementById('ordersTable');
    const rows = tableBody.getElementsByTagName('tr');
  
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const nameCell = cells[0];

        const cellValue = nameCell.innerText;

        const lowerCaseCellValue = cellValue.toLowerCase();
        const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
  
        if (lowerCaseCellValue.includes(lowerCaseSearchKeyword)) {
            const startIndex = lowerCaseCellValue
                .indexOf(lowerCaseSearchKeyword);

            const endIndex = startIndex + searchKeyword.length; 
            const highlightedText = cellValue.substring(0, startIndex) +
                `<span class="search-highlight">${
                    cellValue.substring(startIndex, endIndex)}</span>` +
            cellValue.substring(endIndex);
  
            nameCell.innerHTML = highlightedText;
        }
    }
}

function guideOptions() {
    let list = document.querySelectorAll('.guide-table tr');
    let from = Number(document.getElementById('guide-input-expfrom').value);
    let to = Number(document.getElementById('guide-input-expto').value);
    for (let i in list) {
        if ((from == 0 || from <= list[i].cells[3].innerHTML) &&
        (to == 0 || to >= list[i].cells[3].innerHTML) &&
        (document.getElementById('select_language')
            .options[document.getElementById('select_language').selectedIndex]
            .innerHTML == 'Язык экскурсии' ||
        document.getElementById('select_language')
            .options[document.getElementById('select_language').selectedIndex]
            .innerHTML == list[i].cells[2].innerHTML)) {

            list[i].classList.remove("d-none");
        } else {
            list[i].classList.add("d-none");
        }
    }
}

function getoptionforselect(q) {
    return [... new Set(q)];    
}

function removeOptions(selectElement) {
    let i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
    const selects = document.getElementById('select_language');
    let option = document.createElement('option');
    option.value = "";
    option.innerHTML = "Язык экскурсии";
    selects.appendChild(option);
}  

function clickHandler(event) {
    const screen = document.querySelector('.screen');
    const target = event.target;
    const row = document.querySelectorAll('th');
    let id = 0;
    if (target.classList.contains('choose')) {
        for (let i = 6; i < row.length; i++) {
            if (target.id == row[i].id) {
                row[i].classList.add('table-success');
                id = row[i].getAttribute('name');
            } else {
                row[i].classList.remove('table-success');
            }
        }
    }
}

window.onload = function() {
    fetchRoutesFromApi();
};
