document.addEventListener('DOMContentLoaded', function() {
    // Function to update the date and time display
    function updateDateTime() {
        const now = new Date();
        document.getElementById('date-time').textContent = now.toLocaleString();
    }
    
    // Update the time every second
    setInterval(updateDateTime, 1000);

    // Mock data representing lights
    function populateTable() {
        const lights = [
            { id: 1, name: 'Street Light 1', status: 'Off (Auto)' },
            { id: 2, name: 'Street Light 2', status: 'Off (Auto)' },
            { id: 3, name: 'Street Light 3', status: 'Off (Auto)' },
        ];
    
        const tableBody = document.getElementById('lightsTable').getElementsByTagName('tbody')[0];
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }
        lights.forEach(light => {
            addLightRow(light.id, light.name, light.status);
        });
        console.log('Table populated');
    }
    
    // Function to add a single light row
    function addLightRow(id, name, status) {
        const tableBody = document.getElementById('lightsTable').getElementsByTagName('tbody')[0];
        if (!tableBody) {
            console.error('Table body not found');
            return;
        }
        const newRow = tableBody.insertRow();
        newRow.setAttribute('data-id', id);
        const statusClass = status.toLowerCase().includes('on') ? 'on' : 'off';
        newRow.innerHTML = `<td>${name}</td><td>${status}</td><td><button class="${statusClass}" onclick="toggleLight('${id}', this)">${status.includes('On') ? 'Turn Off' : 'Turn On'}</button></td>`;
        console.log(`Added row for: ${name}`);
    }
    // Simulate toggling a light
    window.toggleLight = function(id, button) {
        console.log('Button clicked:', id); // Log the id, not the name
    
        const row = button.closest('tr');
        const newStatus = button.textContent.includes('Turn Off') ? 'Off' : 'On';
    
        console.log('Sending request to update status:', id, newStatus); // Log correct data
    
        fetch(`/api/lights/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update response:', data); // Log server response
            if (newStatus === 'On') {
                button.textContent = 'Turn Off';
                button.className = 'on';
                row.cells[1].textContent = 'On (Manual)';
            } else {
                button.textContent = 'Turn On';
                button.className = 'off';
                row.cells[1].textContent = 'Off (Manual)';
            }
        })
        .catch(error => console.error('Error updating the light status:', error));
    };
    // Initially populate the table with lights
    populateTable();
});