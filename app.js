var api = "https://gateway.holdstation.com/services/launchpad/api/staking/wallets?list=";
var fetchInProgress = false;
var input,inputArray;
var resultTable = document.getElementById("result");
var errorContainer = document.getElementById("errorContainer");

var SearchBTN=document.getElementById('searchButton');
SearchBTN.addEventListener('click', results);
var addToWatchListBTN=document.getElementById('addToWatchlistButton');
addToWatchListBTN.addEventListener('click', addToWatchlist);

// Load watchlist from localStorage
var watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
});

function processAddress(address) {
  // if (fetchInProgress) {
  //   // If fetch is in progress, ignore the click
  //   return;
  // }
  
  // // Clear existing table content
  // errorContainer.innerHTML='';
  
  // var headerRow = document.createElement("tr");
  
  // var addressHeader = document.createElement("th");
  // addressHeader.textContent = "Address";
  // headerRow.appendChild(addressHeader);
  
  // var pendingRewardHeader = document.createElement("th");
  // pendingRewardHeader.textContent = "Pending Reward";
  // headerRow.appendChild(pendingRewardHeader);
  
  // var harvestedRewardHeader = document.createElement("th");
  // harvestedRewardHeader.textContent = "Harvested Reward";
  // headerRow.appendChild(harvestedRewardHeader);
  
  // resultTable.appendChild(headerRow);
  
  // fetchInProgress = true;
  
  var api_address = api + address;
  fetch(api_address)
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      var dataRow = document.createElement("tr");
      
      var addressCell = document.createElement("td");
      addressCell.textContent = data[0].address;
      dataRow.appendChild(addressCell);
      
      var pendingRewardCell = document.createElement("td");
      pendingRewardCell.textContent = data[0].pendingReward;
      dataRow.appendChild(pendingRewardCell);
      
      var harvestedRewardCell = document.createElement("td");
      harvestedRewardCell.textContent = data[0].harvestedReward;
      dataRow.appendChild(harvestedRewardCell);
      
      resultTable.appendChild(dataRow);
      if (!watchlist.includes(address)) {
        watchlist.push(address);
        updateWatchlist();
        saveWatchlistToLocalStorage();
      }
    } else {
      input=document.getElementById("Input");
      input.style.borderColor="red";
      var errorDiv =document.createElement("div");
      errorDiv.style.color = "red";
      errorDiv.textContent = `Error: No data found for address ${address}`;
      errorContainer.appendChild(errorDiv);
      input.parentElement.parentElement.append(errorDivContainer);
    }
    
    fetchInProgress = false;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    fetchInProgress = false;
  });
}
function results() {

  SearchBTN
  if (fetchInProgress) {
    // If fetch is in progress, ignore the click
    return;
  }
  
  // Clear existing table content
  resultTable.innerHTML='';
  errorContainer.innerHTML='';
  
  var headerRow = document.createElement("tr");
  
  var addressHeader = document.createElement("th");
  addressHeader.textContent = "Address";
  headerRow.appendChild(addressHeader);
  
  var pendingRewardHeader = document.createElement("th");
  pendingRewardHeader.textContent = "Pending Reward";
  headerRow.appendChild(pendingRewardHeader);
  
  var harvestedRewardHeader = document.createElement("th");
  harvestedRewardHeader.textContent = "Harvested Reward";
  headerRow.appendChild(harvestedRewardHeader);
  
  resultTable.appendChild(headerRow);
  
  fetchInProgress = true;
    input = document.getElementById("Input").value;
    inputArray = input.split(",");
    console.log(inputArray);
    for (let address of inputArray) {
      console.log(address);
      processAddress(address);
    }
  }

function addToWatchlist() {
input = document.getElementById("Input").value.trim();
inputArray = input.split(",");
  if (input !== '') {
    for (let address of inputArray) {
      if (!watchlist.includes(address)) {
        watchlist.push(address);
      }
    }
    updateWatchlist();
    saveWatchlistToLocalStorage();
  }
}

function removeFromWatchlist(address) {
  watchlist = watchlist.filter(item => item !== address);
  updateWatchlist();
  saveWatchlistToLocalStorage();
}

function updateWatchlist() {
    var watchlistItems = document.getElementById("watchlistItems");
    watchlistItems.innerHTML = "";
    if(watchlist.length>0){
    var headerRow = document.createElement("tr");
    
    var addressHeader = document.createElement("th");
    addressHeader.textContent = "Address";
    headerRow.appendChild(addressHeader);
    watchlistItems.appendChild(headerRow);
    }
    
    watchlist.forEach(function (address) {
      
      var addressCell = document.createElement("tr");
      addressCell.id="listItems";
      var addressLink= document.createElement("a");
      addressLink.textContent= address;
      addressLink.href=`https://debank.com/profile/${address}`;
      addressCell.appendChild(addressLink);
      
      var watchlistBtn = document.createElement("div");
      var searchBtn = document.createElement("button");
      searchBtn.textContent = "Search";
      searchBtn.onclick = function () {
        resultTable.innerHTML='';
        errorContainer.innerHTML='';
        
        var headerRow = document.createElement("tr");
        
        var addressHeader = document.createElement("th");
        addressHeader.textContent = "Address";
        headerRow.appendChild(addressHeader);
        
        var pendingRewardHeader = document.createElement("th");
        pendingRewardHeader.textContent = "Pending Reward";
        headerRow.appendChild(pendingRewardHeader);
        
        var harvestedRewardHeader = document.createElement("th");
        harvestedRewardHeader.textContent = "Harvested Reward";
        headerRow.appendChild(harvestedRewardHeader);
        
        resultTable.appendChild(headerRow);
        processAddress(address);
      }
      var deleteBtn = document.createElement("button");
      deleteBtn.classList = "delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = function () {
        removeFromWatchlist(address);
      };
      watchlistBtn.appendChild(searchBtn);
      watchlistBtn.appendChild(deleteBtn);
      addressCell.appendChild(watchlistBtn);
      watchlistItems.appendChild(addressCell);
    });
  }

function saveWatchlistToLocalStorage() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Initial load of watchlist
updateWatchlist();
