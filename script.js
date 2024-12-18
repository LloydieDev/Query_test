// Fetch data and display in the table
fetch('api/data')
  .then(response => response.json())
  .then(data => {
    console.log('Data from API:', data);

    const dataTable = document.getElementById('dataTable');
    const thead = dataTable.querySelector('thead tr');
    const tbody = dataTable.querySelector('tbody');

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="100%">No data available.</td></tr>';
      return;
    }

    // Get the column names (keys from the first object)
    const columns = Object.keys(data[0]);

    // Create table headers
    columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column;
      thead.appendChild(th);
    });

    // Create table rows
    data.forEach(item => {
      const row = document.createElement('tr');
      columns.forEach(column => {
        const td = document.createElement('td');
        td.textContent = item[column];
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

// Add event listener to the download CSV button
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const loadingIndicator = document.getElementById('loading');

// Add event listener to the download CSV button
downloadCsvBtn.addEventListener('click', () => {
  // Show the loading indication
  loadingIndicator.style.display = 'block';

  // Use the iframe to trigger the download
  downloadFrame.src = 'api/data-to-csv';

  // Listen for iframe load event to hide the loading indicator
  downloadFrame.onload = () => {
    // Hide the loading indication when the file starts downloading
    loadingIndicator.style.display = 'none';
  };
});
