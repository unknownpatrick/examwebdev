'use strict'

const API_KEY = '' // СЮДА СВОЙ АПИ КЕЙ 

document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromApi();
});
  
let routesData;
let filteredRoutes;
  
const itemsPerPage = 5;
let currentPage = 1;
  
function fetchRoutesFromApi() {
    fetch(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        routesData = data;
        updateTable();
      })
      .catch(error => console.error('Error fetching route data:', error));
  }
  
function updateTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRoutes = filteredRoutes ? filteredRoutes.slice(startIndex, endIndex) : routesData.slice(startIndex, endIndex);
  
    clearTable();
    addRoutesToTable(currentRoutes);
    updatePagination();
    
    const searchKeyword = document.getElementById('routeNameInput').value.toLowerCase();
    if (searchKeyword) {
      highlightSearchResult(searchKeyword);
    }
}
  
function searchRoutes() {
    const searchKeyword = document.getElementById('routeNameInput').value.toLowerCase();
    const selectedObject = document.getElementById('mainObjectSelect').value.toLowerCase();
  
    filteredRoutes = routesData.filter(route => 
        route.name.toLowerCase().includes(searchKeyword) &&
        route.mainObject.toLowerCase().includes(selectedObject)
    );
  
    const limitedRoutes = filteredRoutes.slice(0, itemsPerPage);
  
    clearTable();
    addRoutesToTable(limitedRoutes);
    updatePaginationAfterSearch(filteredRoutes);
    highlightSearchResult(searchKeyword);
}
  
function resetSearch() {
    document.getElementById('routeNameInput').value = '';
    document.getElementById('mainObjectSelect').value = '';
    filteredRoutes = null;
    updateTable();
}
  
function clearTable() {
    const tableBody = document.getElementById('routesTableBody');
    tableBody.innerHTML = '';
}
  
function addRoutesToTable(routes) {
    const tableBody = document.getElementById('routesTableBody');
  
    routes.forEach(route => {
      const row = tableBody.insertRow();
      row.insertCell(0).innerHTML = route.name;
      row.insertCell(1).innerHTML = route.description;
      row.insertCell(2).innerHTML = route.mainObject;
  
      const selectButton = document.createElement('button');
      selectButton.innerText = 'Выбрать';
      selectButton.addEventListener('click', () => handleSelectRoute(route.id));
      row.insertCell(3).appendChild(selectButton);
    });
}
  
function updatePagination() {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil((filteredRoutes ? filteredRoutes.length : routesData.length) / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Previous', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = createPaginationItem(i, i);
      paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Next', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function createPaginationItem(text, pageNumber) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item';
  
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = 'javascript:void(0)';
    pageLink.innerText = text;
  
    if ((text === 'Previous' && currentPage === 1) || (text === 'Next' && currentPage === Math.ceil((filteredRoutes ? filteredRoutes.length : routesData.length) / itemsPerPage))) {
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
  
function updatePaginationAfterSearch(filteredRoutes) {
    const paginationElement = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  
    paginationElement.innerHTML = '';
  
    const prevItem = createPaginationItem('Previous', currentPage - 1);
    paginationElement.appendChild(prevItem);
  
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = createPaginationItem(i, i);
      paginationElement.appendChild(pageItem);
    }
  
    const nextItem = createPaginationItem('Next', currentPage + 1);
    paginationElement.appendChild(nextItem);
}
  
function handlePageClick(pageNumber) {
    currentPage = pageNumber;
    updateTable();
  }
  
function highlightSearchResult(searchKeyword) {
    const tableBody = document.getElementById('routesTableBody');
    const rows = tableBody.getElementsByTagName('tr');
  
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const nameCell = cells[0];

        const cellValue = nameCell.innerText;

        const lowerCaseCellValue = cellValue.toLowerCase();
        const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
  
        if (lowerCaseCellValue.includes(lowerCaseSearchKeyword)) {
            const startIndex = lowerCaseCellValue.indexOf(lowerCaseSearchKeyword);
            const endIndex = startIndex + searchKeyword.length;
  
            const highlightedText = cellValue.substring(0, startIndex) +
          `<span class="search-highlight">${cellValue.substring(startIndex, endIndex)}</span>` +
            cellValue.substring(endIndex);
  
            nameCell.innerHTML = highlightedText;
        }
    }
}

function guideDownload() {
    let id = document.querySelector('.test-input').value;
    let guideTable = document.querySelector('.guide-table');
    let url = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides`);
    url.searchParams.append('api_key', API_KEY);
    let xhr = new XMLHttpRequest();
    let arroption = [];
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function() {
        arroption = [];
        
        // using the function:
        removeOptions(document.getElementById('select_language'));
        guideTable.innerHTML = '';
        for (var i in this.response) {
            console.log(i, 'id guid')
            let row = document.createElement("tr");
            row.innerHTML = `
            <th scope="col" id = "${this.response[i].name}" name = "${i}"><img src="imgs/1.png"></th>
            <th scope="col" id = "${this.response[i].name}" name = "${i}">${this.response[i].name}</th>
            <th scope="col" id = "${this.response[i].name}" name = "${i}">${this.response[i].language}</th>
            <th scope="col" id = "${this.response[i].name}" name = "${i}">${this.response[i].workExperience}</th>
            <th scope="col" id = "${this.response[i].name}" name = "${i}">${this.response[i].pricePerHour}</th>
            <th scope="col" id = "${this.response[i].name}" name = "${i}">
            <button class = "rounded-3 choose" id = "${this.response[i].name}" name = "${i}">Выбрать</button></th> 
            `; // в последнее значение класса, где кнопка, надо будет сунуть свое значение стиля))
            if ((document.getElementById('guide-input-expfrom').value != '' &&
            document.getElementById('guide-input-expfrom').value > this.response[i].workExperience) ||
            (document.getElementById('guide-input-expto').value != '' &&
            document.getElementById('guide-input-expto').value < this.response[i].workExperience) &&
            document.getElementById('select_language').value == this.response[i].language) {
                row.classList.add("d-none");
            }
            guideTable.append(row);
            arroption.push(this.response[i].language);
        }
        console.log(arroption);
        createselect(getoptionforselect(arroption));
    }
    xhr.send();
}

function guideOptions() {
    var list = document.querySelectorAll('.guide-table tr');
    var from = Number(document.getElementById('guide-input-expfrom').value);
    var to = Number(document.getElementById('guide-input-expto').value);
    for (var i in list) {
        if ((from == 0 || from <= list[i].cells[3].innerHTML) &&
        (to == 0 || to >= list[i].cells[3].innerHTML) &&
        (document.getElementById('select_language').options[document.getElementById('select_language').selectedIndex].innerHTML == 'Язык экскурсии' ||
        document.getElementById('select_language').options[document.getElementById('select_language').selectedIndex].innerHTML == list[i].cells[2].innerHTML))
        {
            list[i].classList.remove("d-none");
        }else{
            list[i].classList.add("d-none");
        }
        console.log(list[i].cells[2].innerHTML);
    }
}

// берем только уникальные языыки
function getoptionforselect(q){
    return [... new Set(q)];    
}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
    const selects = document.getElementById('select_language');
    var option = document.createElement('option');
    option.value = "";
    option.innerHTML = "Язык экскурсии";
    selects.appendChild(option);
}  

// тут мы создаем селект с языками (заполняем option-ами внутренность селекта)
function createselect(arr){
    const select = document.getElementById('select_language');
    for(let i in arr){
        console.log(arr[i]);
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = arr[i];
        select.appendChild(opt);
    }  
}

// тут мы обрабатываем события нажатия на кнопку выбрать в таблице гидов 
function clickHandler(event) {
    const screen = document.querySelector('.screen');
    const target = event.target;
    const row = document.querySelectorAll('th');
    let idd = 0;
    if (target.classList.contains('choose')) {
        for(let i = 6; i< row.length; i++){
            if(target.id == row[i].id){
                row[i].classList.add('table-success');
                idd = row[i].getAttribute('name')
            }
            else{
                row[i].classList.remove('table-success');
            }
        }   
        getIDguide(idd);
    } 
}
//возвращаем id гида 
function getIDguide(id){
    console.log(id)
    return id
}


window.onload = function() {
    document.querySelector('.test').onclick = guideDownload;
    document.getElementById('guide-input-expfrom').oninput = guideOptions;
    document.getElementById('guide-input-expto').oninput = guideOptions;
    document.getElementById('select_language').onchange = guideOptions;
    const table = document.querySelector('.table');
    table.addEventListener('click', clickHandler);
}
