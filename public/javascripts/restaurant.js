// script.js

// Smooth scrolling for navigation links
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to add a pending order
function addPendingOrder() {
    const pendingOrdersList = document.getElementById('pending-orders-list');
    const newOrder = document.createElement('p');
    newOrder.textContent = 'Order ' + (Math.floor(Math.random() * 1000) + 1);
    pendingOrdersList.appendChild(newOrder);
}

// Function to add a received order
function addReceivedOrder() {
    const receivedOrdersList = document.getElementById('received-orders-list');
    const newOrder = document.createElement('p');
    newOrder.textContent = 'Order ' + (Math.floor(Math.random() * 1000) + 1);
    receivedOrdersList.appendChild(newOrder);
}

// Function to complete a pending order
function completeOrder() {
    const pendingOrdersList = document.getElementById('pending-orders-list');
    const receivedOrdersList = document.getElementById('received-orders-list');
    const completedOrdersList = document.getElementById('completed-orders-list');
    
    const firstPendingOrder = pendingOrdersList.querySelector('p');
    
    if (firstPendingOrder) {
        completedOrdersList.appendChild(firstPendingOrder.cloneNode(true));
        pendingOrdersList.removeChild(firstPendingOrder);
    } else {
        const firstReceivedOrder = receivedOrdersList.querySelector('p');
        if (firstReceivedOrder) {
            completedOrdersList.appendChild(firstReceivedOrder.cloneNode(true));
            receivedOrdersList.removeChild(firstReceivedOrder);
        }
    }
}
