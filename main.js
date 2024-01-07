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
