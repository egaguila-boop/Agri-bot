// Temperature History Chart
const tempCtx = document.getElementById('tempChart').getContext('2d');

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeToggle.textContent = '☀️';
        updateHistoryCharts('#666');
    } else {
        themeToggle.textContent = '🌙';
        updateHistoryCharts('rgba(255,255,255,0.6)');
    }
});

new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: ['6AM','9AM','12PM','3PM','6PM','9PM','12AM','3AM'],
        datasets: [{
            label: 'Temperature',
            data: [22,24,28,30,29,26,24,23],
            borderColor: '#ff6b6b',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: getChartOptions('#ff6b6b')
});

// pH Level History Chart
const phCtx = document.getElementById('phChart').getContext('2d');
new Chart(phCtx, {
    type: 'line',
    data: {
        labels: ['6AM','9AM','12PM','3PM','6PM','9PM','12AM','3AM'],
        datasets: [{
            label: 'pH Level',
            data: [6.2,6.5,6.8,7.0,6.9,6.7,6.5,6.4],
            borderColor: '#ffa500',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: getChartOptions('#ffa500')
});

// Soil Moisture History Chart
const moistureCtx = document.getElementById('moistureChart').getContext('2d');
new Chart(moistureCtx, {
    type: 'line',
    data: {
        labels: ['6AM','9AM','12PM','3PM','6PM','9PM','12AM','3AM'],
        datasets: [{
            label: 'Soil Moisture',
            data: [65,62,58,55,60,68,72,70],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: getChartOptions('#00d4ff')
});

function getChartOptions(borderColor) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y: {
                ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        }
    };
}

// Update history charts for light mode
function updateHistoryCharts(tickColor) {
    [Chart.getChart(tempCtx), Chart.getChart(phCtx), Chart.getChart(moistureCtx)].forEach(chart => {
        if (chart) {
            chart.options.scales.x.ticks.color = tickColor;
            chart.options.scales.y.ticks.color = tickColor;
            chart.update();
        }
    });
}

// Simulate real-time data updates
// Store real-time sensor history for sensor detail view
const sensorHistory = {
    temperature: [22, 24, 28, 30, 29, 26, 24, 23],
    ph: [6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.0],
    moisture: [65, 64, 63, 62, 60, 58, 55, 55]
};

function updateSensorData() {
    const tempSpan = document.getElementById('temperature');
    const moistureSpan = document.getElementById('moisture');
    const phSpan = document.getElementById('ph');
    
    if (tempSpan && moistureSpan && phSpan) {
        let temp = parseFloat(tempSpan.textContent);
        let moisture = parseFloat(moistureSpan.textContent);
        let ph = parseFloat(phSpan.textContent);
        
        temp = Math.max(18, Math.min(35, temp + (Math.random() - 0.5) * 2));
        moisture = Math.max(35, Math.min(85, moisture + (Math.random() - 0.5) * 5));
        ph = Math.max(5.5, Math.min(7.5, ph + (Math.random() - 0.5) * 0.2));
        
        tempSpan.textContent = temp.toFixed(1);
        moistureSpan.textContent = moisture.toFixed(0);
        phSpan.textContent = ph.toFixed(1);
        
        // Update sensor history for real-time tracking
        sensorHistory.temperature.shift();
        sensorHistory.temperature.push(temp);
        sensorHistory.ph.shift();
        sensorHistory.ph.push(ph);
        sensorHistory.moisture.shift();
        sensorHistory.moisture.push(moisture);
        
        // Update sensor detail section if it's visible
        updateSensorDetailView();
    }
    
    const tempChart = Chart.getChart(tempCtx);
    const phChart = Chart.getChart(phCtx);
    const moistureChart = Chart.getChart(moistureCtx);
    
    if (tempChart) {
        const newTemp = 22 + Math.random() * 10;
        tempChart.data.datasets[0].data.shift();
        tempChart.data.datasets[0].data.push(newTemp);
        tempChart.update('none');
    }
    
    if (phChart) {
        const newPh = 6.2 + Math.random() * 1;
        phChart.data.datasets[0].data.shift();
        phChart.data.datasets[0].data.push(newPh);
        phChart.update('none');
    }
    
    if (moistureChart) {
        const newMoisture = 55 + Math.random() * 20;
        moistureChart.data.datasets[0].data.shift();
        moistureChart.data.datasets[0].data.push(newMoisture);
        moistureChart.update('none');
    }
}

// Update sensor detail section with latest real-time data
function updateSensorDetailView() {
    const sensorDetailSection = document.getElementById('sensor-detail-section');
    if (!sensorDetailSection || !sensorDetailSection.classList.contains('active')) {
        return; // Only update if sensor detail section is visible
    }
    
    const currentSensorType = document.getElementById('sensor-detail-title').textContent;
    let sensorType = '';
    
    if (currentSensorType.includes('Temperature')) {
        sensorType = 'temperature';
    } else if (currentSensorType.includes('pH')) {
        sensorType = 'ph';
    } else if (currentSensorType.includes('Moisture')) {
        sensorType = 'moisture';
    }
    
    if (sensorType && sensorHistory[sensorType]) {
        const tempSpan = document.getElementById('temperature');
        const moistureSpan = document.getElementById('moisture');
        const phSpan = document.getElementById('ph');
        
        // Get current values
        let currentValue = '';
        let unit = '';
        
        if (sensorType === 'temperature') {
            currentValue = tempSpan ? tempSpan.textContent : '25';
            unit = '°C';
        } else if (sensorType === 'ph') {
            currentValue = phSpan ? phSpan.textContent : '6.5';
            unit = '';
        } else if (sensorType === 'moisture') {
            currentValue = moistureSpan ? moistureSpan.textContent : '62';
            unit = '%';
        }
        
        // Update current value display
        const valueDisplay = document.getElementById('sensor-current-value');
        if (valueDisplay) {
            valueDisplay.textContent = currentValue + unit;
        }
        
        // Update chart with real-time data
        if (sensorDetailChart) {
            const historyData = sensorHistory[sensorType];
            sensorDetailChart.data.datasets[0].data = [...historyData];
            sensorDetailChart.update('none');
        }
    }
}

setInterval(updateSensorData, 3000);

// Tab Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
        const targetId = this.getAttribute('data-target');
        e.preventDefault();
        
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(targetId + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// Login Functionality
const authOverlay = document.getElementById('auth-overlay');
const loginForm = document.getElementById('login-form');
const userBtn = document.getElementById('user-btn');

const dashboardSections = document.querySelectorAll('.history-section, .data-table-section, .logs-section, .ai-section, .chart-section, .cards, .nav-tabs');

function hideDashboard() {
    dashboardSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide page sections when not logged in
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Only show sensors section if logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('sensors-section').classList.add('active');
    }
}

function showDashboard() {
    document.querySelector('.cards').style.display = 'grid';
    document.querySelector('.nav-tabs').style.display = 'flex';
    dashboardSections.forEach(section => {
        if (!section.classList.contains('cards') && !section.classList.contains('nav-tabs')) {
            section.style.display = 'block';
        }
    });
    
    // Show sensors section by default when logged in
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('sensors-section').classList.add('active');
}

function updateUserButton() {
    const userName = localStorage.getItem('userName');
    if (localStorage.getItem('isLoggedIn') === 'true' && userName) {
        userBtn.textContent = '👤 ' + userName;
    }
}

if (localStorage.getItem('isLoggedIn') === 'true') {
    // Add login entry for returning user
    addLoginEntry();
    
    authOverlay.classList.add('hidden');
    showDashboard();
    updateUserButton();
} else {
    authOverlay.classList.remove('hidden');
    hideDashboard();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = loginForm.querySelector('input[type="text"]').value;
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (name && email && password.length >= 6) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        // Add login entry to history
        addLoginEntry();
        
        window.location.href = '../index.html';
    } else {
        alert('Please enter your name, valid email and password (min 6 characters)');
    }
});

userBtn.addEventListener('click', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        userBtn.textContent = 'Login';
        authOverlay.classList.remove('hidden');
        hideDashboard();
    }
});

document.querySelectorAll('.btn').forEach(btn => {
    if (btn.textContent === 'Refresh' || btn.id === 'refresh-btn') {
        btn.addEventListener('click', () => {
            location.reload();
        });
    }
});

const modalTabs = ['about', 'history', 'table', 'logs', 'ai', 'credits', 'sensor-detail', 'profile'];

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function(e) {
        const targetId = this.getAttribute('data-target');
        if (modalTabs.includes(targetId)) {
            e.preventDefault();
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const modal = document.getElementById(targetId + '-modal');
            if (modal) {
                modal.classList.add('active');
            }
        }
    });
});

document.querySelectorAll('.maximize-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-target');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('minimized');
            modal.classList.toggle('maximized');
            if (modal.classList.contains('maximized')) {
                this.textContent = '❐';
            } else {
                this.textContent = '☐';
            }
        }
    });
});

document.querySelectorAll('.about-close').forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-close');
        if (modalId) {
            document.getElementById(modalId).classList.remove('active');
        } else {
            document.getElementById('about-modal').classList.remove('active');
        }
    });
});

document.querySelectorAll('.about-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

const sensorData = {
    ph: {
        title: '⚗️ pH Level History',
        currentValue: () => document.getElementById('ph')?.textContent || '6.5',
        unit: '',
        color: '#ffa500',
        data: [6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.0],
        min: 5.5,
        max: 7.5,
        minVal: 5.5,
        maxVal: 7.5,
        tips: [
            'Maintain pH between 6.0-7.0 for optimal nutrient absorption',
            'Test pH levels weekly',
            'Use pH adjusters sparingly',
            'Calibrate pH meter regularly'
        ]
    },
    moisture: {
        title: '💧 Soil Moisture History',
        currentValue: () => document.getElementById('moisture')?.textContent || '62',
        unit: '%',
        color: '#00d4ff',
        data: [65, 64, 63, 62, 60, 58, 55, 55],
        min: 35,
        max: 85,
        minVal: 35,
        maxVal: 85,
        tips: [
            'Keep moisture between 60-80% for best results',
            'Water early morning to reduce evaporation',
            'Use mulch to retain moisture',
            'Check soil moisture daily'
        ]
    },
    temperature: {
        title: '🌡️ Temperature History',
        currentValue: () => document.getElementById('temperature')?.textContent || '25',
        unit: '°C',
        color: '#ff6b6b',
        data: [22, 24, 28, 30, 29, 26, 24, 23],
        min: 18,
        max: 35,
        minVal: 18,
        maxVal: 35,
        tips: [
            'Maintain temperature between 18-24°C',
            'Use ventilation on hot days',
            'Monitor temperature fluctuations',
            'Protect plants from extreme heat'
        ]
    }
};

let sensorDetailChart = null;

document.querySelectorAll('.card.clickable').forEach(card => {
    card.addEventListener('click', function() {
        const sensorType = this.getAttribute('data-sensor');
        const sensor = sensorData[sensorType];
        
        if (sensor) {
            document.getElementById('sensor-detail-title').textContent = sensor.title;
            document.getElementById('sensor-current-value').textContent = sensor.currentValue() + sensor.unit;
            document.getElementById('sensor-min').textContent = sensor.minVal + sensor.unit;
            document.getElementById('sensor-max').textContent = sensor.maxVal + sensor.unit;
            
            // Use real-time sensor history data
            const historyData = sensorHistory[sensorType] || sensor.data;
            const avg = historyData.reduce((a, b) => a + b, 0) / historyData.length;
            document.getElementById('sensor-avg').textContent = avg.toFixed(1) + sensor.unit;
            
            const tipsContainer = document.getElementById('sensor-tips');
            tipsContainer.innerHTML = '<h4>💡 Tips for Optimal Levels</h4><ul>' + 
                sensor.tips.map(tip => `<li>${tip}</li>`).join('') + '</ul>';
            
            const ctx = document.getElementById('sensorDetailChart').getContext('2d');
            
            if (sensorDetailChart) {
                sensorDetailChart.destroy();
            }
            
            // Create chart with real-time data
            sensorDetailChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'],
                    datasets: [{
                        label: sensor.title,
                        data: [...historyData],
                        borderColor: sensor.color,
                        backgroundColor: sensor.color + '20',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: getChartOptions(sensor.color)
            });
            
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('sensor-detail-section').classList.add('active');
            
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        }
    });
});

const notificationBtn = document.getElementById('notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('logs-section').classList.add('active');
    });
}

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 600) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// User Dropdown Menu Functionality
const dropdownItems = document.querySelectorAll('.dropdown-item');

// Get login history from localStorage or initialize empty
function getLoginHistory() {
    const stored = localStorage.getItem('loginHistory');
    return stored ? JSON.parse(stored) : [];
}

// Save login history to localStorage
function saveLoginHistory(history) {
    localStorage.setItem('loginHistory', JSON.stringify(history));
}

// Add new login entry when user logs in
function addLoginEntry() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;
    
    const now = new Date();
    const entry = {
        date: now.toLocaleDateString('en-US'),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        device: navigator.userAgent.includes('Chrome') ? 'Chrome - Windows' : 
               navigator.userAgent.includes('Safari') ? 'Safari - iOS' : 'Browser',
        location: 'Local Device'
    };
    
    const history = getLoginHistory();
    history.unshift(entry); // Add to beginning
    saveLoginHistory(history);
}

// Render login history in Profile section
function renderProfileLoginHistory() {
    const profileLoginHistoryContainer = document.getElementById('profileLoginHistoryContainer');
    if (!profileLoginHistoryContainer) return;
    
    const history = getLoginHistory();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || history.length === 0) {
        profileLoginHistoryContainer.innerHTML = '<div class="log-entry info"><span class="log-time">--:--</span><span class="log-icon">ℹ️</span><span class="log-message">No login history yet. Please log in to see your login history.</span></div>';
        return;
    }
    
    profileLoginHistoryContainer.innerHTML = history.map(entry => 
        '<div class="log-entry info">' +
            '<span class="log-time">' + entry.time + '</span>' +
            '<span class="log-icon">📱</span>' +
            '<span class="log-message">' +
                '<strong>' + entry.device + '</strong><br>' +
                '<span style="opacity:0.7">' + entry.location + ' - ' + entry.date + '</span>' +
            '</span>' +
        '</div>'
    ).join('');
}

// Update profile info when user logs in
function updateProfileInfo() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const totalLogins = document.getElementById('total-logins');
    const lastLogin = document.getElementById('last-login');
    
    if (isLoggedIn) {
        if (profileName && userName) {
            profileName.textContent = userName;
        }
        if (profileEmail && userEmail) {
            profileEmail.textContent = userEmail;
        }
        
        const history = getLoginHistory();
        if (totalLogins) {
            totalLogins.textContent = history.length > 0 ? history.length : '1';
        }
        if (lastLogin && history.length > 0) {
            lastLogin.textContent = history[0].date + ', ' + history[0].time;
        } else if (lastLogin) {
            const now = new Date();
            lastLogin.textContent = now.toLocaleDateString() + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    } else {
        if (profileName) {
            profileName.textContent = 'Guest User';
        }
        if (profileEmail) {
            profileEmail.textContent = 'Not logged in';
        }
        if (totalLogins) {
            totalLogins.textContent = '0';
        }
        if (lastLogin) {
            lastLogin.textContent = 'Never';
        }
    }
}

// Initialize profile
renderProfileLoginHistory();
updateProfileInfo();

// Handle dropdown item clicks
dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const action = item.getAttribute('data-action');
        
        switch(action) {
            case 'profile':
                // Navigate to profile section
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.page-section').forEach(section => {
                    section.classList.remove('active');
                });
                const profileTab = document.querySelector('.nav-tab[data-target="profile"]');
                if (profileTab) profileTab.classList.add('active');
                document.getElementById('profile-section').classList.add('active');
                break;
                
            case 'settings':
                alert('Settings - Theme: Dark, Notifications: Enabled, Data Refresh: 3 seconds');
                break;
                
            case 'logout':
                // Perform logout - show login overlay directly
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                userBtn.textContent = 'Login';
                authOverlay.classList.remove('hidden');
                
                // Hide dashboard sections
                document.querySelector('.cards').style.display = 'none';
                document.querySelector('.nav-tabs').style.display = 'none';
                document.querySelector('.top-bar').style.display = 'none';
                document.querySelector('.main-content').style.display = 'none';
                break;
        }
    });
});

