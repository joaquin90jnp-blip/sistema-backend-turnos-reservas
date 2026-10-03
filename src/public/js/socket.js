// Cliente Socket.io — escucha eventos y actualiza vistas sin recargar
const socket = io();

socket.on('connect', () => {
  console.log('Socket conectado', socket.id);
  const status = document.getElementById('realtime-status');
  if (status) status.textContent = 'Conectado en tiempo real (' + socket.id + ')';
});

socket.on('disconnect', () => {
  console.log('Socket desconectado');
  const status = document.getElementById('realtime-status');
  if (status) status.textContent = 'Desconectado';
});

socket.on('serviceCreated', (service) => {
  console.log('serviceCreated', service);
  const tbody = document.getElementById('services-table-body');
  if (tbody) {
    if (tbody.textContent.includes('No hay servicios')) tbody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.dataset.id = service._id;
    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.description}</td>
      <td>${service.duration}</td>
      <td>$${service.price}</td>
      <td>${service.category}</td>
      <td><span class="badge ${service.available ? 'available' : 'unavailable'}">${service.available ? 'Disponible' : 'No disponible'}</span></td>
      <td class="mono">${service._id}</td>
    `;
    tbody.appendChild(tr);
    const count = document.getElementById('services-count');
    if (count) count.textContent = tbody.querySelectorAll('tr').length;
  }

  const availBody = document.getElementById('availability-services-body');
  if (availBody) {
    if (availBody.textContent.includes('Sin servicios')) availBody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.dataset.id = service._id;
    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.category}</td>
      <td>${service.duration} min</td>
      <td>$${service.price}</td>
      <td><span class="badge ${service.available ? 'available' : 'unavailable'}">${service.available ? 'Sí' : 'No'}</span></td>
    `;
    availBody.appendChild(tr);
  }
});

socket.on('serviceUpdated', (service) => {
  console.log('serviceUpdated', service);
  document.querySelectorAll(`tr[data-id="${service._id}"]`).forEach((tr) => {
    const cells = tr.children;
    if (cells.length >= 6) {
      if (cells[5]) cells[5].innerHTML = `<span class="badge ${service.available ? 'available' : 'unavailable'}">${service.available ? 'Disponible' : 'No disponible'}</span>`;
      if (cells[3]) cells[3].textContent = '$' + service.price;
    }
    if (cells.length === 5 && cells[4]) {
      cells[4].innerHTML = `<span class="badge ${service.available ? 'available' : 'unavailable'}">${service.available ? 'Sí' : 'No'}</span>`;
    }
  });
});

socket.on('serviceDeleted', ({ id }) => {
  console.log('serviceDeleted', id);
  document.querySelectorAll(`tr[data-id="${id}"]`).forEach((tr) => tr.remove());
  const count = document.getElementById('services-count');
  if (count) {
    const tbody = document.getElementById('services-table-body');
    if (tbody) count.textContent = tbody.querySelectorAll('tr').length;
  }
});

socket.on('bookingCreated', (booking) => {
  console.log('bookingCreated', booking);
  const tbody = document.getElementById('bookings-table-body');
  if (tbody) {
    if (tbody.textContent.includes('No hay reservas')) tbody.innerHTML = '';
    const tr = document.createElement('tr');
    tr.dataset.id = booking._id;
    tr.innerHTML = `
      <td>${booking.clientName}</td>
      <td>${booking.clientEmail}</td>
      <td>${booking.date}</td>
      <td>${booking.time}</td>
      <td><span class="badge status-${booking.status}">${booking.status}</span></td>
      <td><em>Sin servicios</em></td>
    `;
    tbody.appendChild(tr);
    const count = document.getElementById('bookings-count');
    if (count) count.textContent = tbody.querySelectorAll('tr').length;
  }
});

socket.on('bookingUpdated', (booking) => {
  console.log('bookingUpdated', booking);
  const tr = document.querySelector(`#bookings-table-body tr[data-id="${booking._id}"]`);
  if (tr) {
    const servicesCell = tr.children[5];
    if (servicesCell) {
      if (!booking.services || booking.services.length === 0) {
        servicesCell.innerHTML = '<em>Sin servicios</em>';
      } else {
        const ul = document.createElement('ul');
        booking.services.forEach((item) => {
          const li = document.createElement('li');
          const name = item.service?.name || item.service;
          li.textContent = `${name} x ${item.quantity}`;
          ul.appendChild(li);
        });
        servicesCell.innerHTML = '';
        servicesCell.appendChild(ul);
      }
    }
    if (tr.children[4]) tr.children[4].innerHTML = `<span class="badge status-${booking.status}">${booking.status}</span>`;
  } else {
    const tbody = document.getElementById('bookings-table-body');
    if (tbody) {
      const newTr = document.createElement('tr');
      newTr.dataset.id = booking._id;
      newTr.innerHTML = `<td>${booking.clientName}</td><td>${booking.clientEmail}</td><td>${booking.date}</td><td>${booking.time}</td><td>${booking.status}</td><td>${booking.services.length} servicios</td>`;
      tbody.appendChild(newTr);
    }
  }
});

socket.on('bookingDeleted', ({ id }) => {
  console.log('bookingDeleted', id);
  document.querySelectorAll(`#bookings-table-body tr[data-id="${id}"]`).forEach((tr) => tr.remove());
});
