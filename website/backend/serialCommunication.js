document.addEventListener('DOMContentLoaded', function() {
    // Function to update the date and time display
    function updateDateTime() {
        const now = new Date();
        document.getElementById('date-time').textContent = now.toLocaleString();
    }

    // Update the time every second
    setInterval(updateDateTime, 1000);

    // WebSocket connection
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = function() {
        console.log('Connected to WebSocket');
        fetchLights();
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Received update:', data);
        updateLightStatus(data.id, data.status);
    };

    socket.onclose = function() {
        console.log('Disconnected from WebSocket');
    };

    // Function to fetch light data from the server and populate the table
    function fetchLights() {
        fetch('/api/lights')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('lightsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach(light => {
                addLightRow(light.id, light.name, light.status);
            });
        })
        .catch(error => console.error('Error fetching lights:', error));
    }

    // Function to dynamically add a light row to the table
    function addLightRow(id, name, status) {
        const tableBody = document.getElementById('lightsTable').getElementsByTagName('tbody')[0];
        const newRow = tableBody.insertRow();
        const statusClass = status.toLowerCase().includes('on') ? 'on' : 'off';
        newRow.innerHTML = `<td>${name}</td><td>${status}</td><td><button class="${statusClass}" onclick="toggleLight(${id}, this)">${status.includes('On') ? 'Turn Off' : 'Turn On'}</button></td>`;
    }

    // Function to toggle a light's status
    window.toggleLight = function(id, button) {
        const newStatus = button.textContent.includes('Turn Off') ? 'Off' : 'On';
        fetch(`/api/lights/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            socket.send(JSON.stringify({ id: id, status: newStatus }));
            button.textContent = newStatus === 'On' ? 'Turn Off' : 'Turn On';
            button.className = newStatus === 'On' ? 'on' : 'off';
            button.parentNode.previousSibling.textContent = `${newStatus} (Manual)`;
        })
        .catch(error => console.error('Error updating light:', error));
    };

    // Function to update the status of a light in the table
    function updateLightStatus(id, status) {
        const table = document.getElementById('lightsTable');
        const rows = table.getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 0 && cells[0].innerText == id) {
                cells[1].innerText = status;
                const button = row.getElementsByTagName('button')[0];
                const newStatusClass = status.toLowerCase().includes('on') ? 'on' : 'off';
                button.className = newStatusClass;
                button.textContent = status.includes('On') ? 'Turn Off' : 'Turn On';
                break;
            }
        }
    }

    // Initially fetch and populate the table with lights
    fetchLights();
});