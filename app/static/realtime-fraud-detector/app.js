// SentinelShield - Real-Time Fraud & Drift Simulator

// State Variables
let isStreamPaused = false;
let currentScenario = 'normal'; // 'normal' or 'drift'
let isCalibrated = false;
let transactions = [];
let driftChart = null;

// Configuration
const KAFKA_RATE = 1250; // txn/sec
const MAX_VISIBLE_ROWS = 10;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  startStreaming();
  setupEventListeners();
  generateInitialStream();
});

// Event Listeners Setup
function setupEventListeners() {
  // Pause/Resume Stream
  document.getElementById('btn-pause-stream').addEventListener('click', (e) => {
    isStreamPaused = !isStreamPaused;
    e.target.textContent = isStreamPaused ? 'Resume Feed' : 'Pause Feed';
    e.target.classList.toggle('active', isStreamPaused);
  });

  // Outlier Sandbox Test
  document.getElementById('btn-test-anomaly').addEventListener('click', runSandboxInference);

  // Scenarios
  document.getElementById('btn-scenario-normal').addEventListener('click', (e) => {
    setScenario('normal');
  });
  document.getElementById('btn-scenario-drift').addEventListener('click', (e) => {
    setScenario('drift');
  });

  // SMOTE Calibration
  document.getElementById('btn-trigger-smote').addEventListener('click', triggerSmoteCalibration);
}

// Scenario Handler
function setScenario(type) {
  currentScenario = type;
  document.getElementById('btn-scenario-normal').classList.toggle('active', type === 'normal');
  document.getElementById('btn-scenario-drift').classList.toggle('active', type === 'drift');
  
  const statusIndicator = document.querySelector('.status-indicator');
  
  if (type === 'drift') {
    statusIndicator.className = 'status-indicator warning';
    document.getElementById('drift-status-card').classList.add('drifted');
    document.getElementById('val-drift').textContent = 'DRIFT DETECTED';
    document.getElementById('val-drift-sub').textContent = 'KS-Test: p = 0.00004 (Significant)';
    // Shift Chart.js production distribution
    updateChartData(110, 45); // Average transaction amount shifted
  } else {
    statusIndicator.className = 'status-indicator live';
    document.getElementById('drift-status-card').classList.remove('drifted');
    document.getElementById('val-drift').textContent = isCalibrated ? 'CALIBRATED' : 'STABLE';
    document.getElementById('val-drift-sub').textContent = 'KS-Test: p = 0.814 (No Drift)';
    // Reset Chart.js production distribution
    updateChartData(45, 25);
  }
}

// SMOTE Calibration Handler
function triggerSmoteCalibration() {
  const btn = document.getElementById('btn-trigger-smote');
  const statsBox = document.getElementById('smote-stats-output');
  
  btn.textContent = 'Calibrating SMOTE Over-sampling...';
  btn.disabled = true;

  setTimeout(() => {
    isCalibrated = true;
    btn.textContent = 'Run SMOTE Calibration';
    btn.disabled = false;
    statsBox.style.display = 'block';
    
    // Reset drift indicator since model is now calibrated to new distribution
    if (currentScenario === 'drift') {
      document.getElementById('drift-status-card').classList.remove('drifted');
      document.getElementById('drift-status-card').style.borderColor = 'rgba(16, 185, 129, 0.4)';
      document.getElementById('val-drift').textContent = 'RE-ALIGNED';
      document.getElementById('val-drift-sub').textContent = 'Balanced Ratio: 10%. Threshold: 0.72';
    }
  }, 1500);
}

// Generate Live Transaction Stream
function startStreaming() {
  setInterval(() => {
    if (isStreamPaused) return;

    // Simulate minor ingestion noise
    const noise = Math.floor(Math.random() * 80 - 40);
    document.getElementById('val-rate').textContent = (KAFKA_RATE + noise).toLocaleString();
    
    // In drift scenario, offset lag increases unless calibrated
    if (currentScenario === 'drift' && !isCalibrated) {
      const currentLag = parseInt(document.getElementById('val-lag').textContent);
      document.getElementById('val-lag').textContent = currentLag + Math.floor(Math.random() * 3 + 1);
    } else {
      document.getElementById('val-lag').textContent = '0';
    }

    const newTxn = generateTransaction();
    addTransactionToTable(newTxn);
  }, 1500);
}

// Generate single Transaction payload
function generateTransaction() {
  const categories = ['Retail', 'Grocery', 'Wire Transfer', 'Travel', 'E-Commerce'];
  const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Berlin, DE', 'Paris, FR', 'Mumbai, IN', 'Moscow, RU'];
  
  const id = Math.floor(100000 + Math.random() * 900000);
  const location = locations[Math.floor(Math.random() * locations.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  let amount = 0;
  let velocity = 0;
  let distance = 0;
  let isFraud = false;

  // Decide if this event is fraud based on active scenario
  const fraudProbability = currentScenario === 'drift' ? 0.35 : 0.015;
  if (Math.random() < fraudProbability) {
    isFraud = true;
    amount = Math.floor(Math.random() * 700 + 350); // Large amount
    velocity = Math.floor(Math.random() * 6 + 4);    // Large velocity
    distance = Math.floor(Math.random() * 150 + 60); // Large distance from home
  } else {
    amount = Math.floor(Math.random() * 100 + 10);
    velocity = Math.floor(Math.random() * 2 + 1);
    distance = Math.floor(Math.random() * 15 + 1);
  }

  // Isolation Forest Path calculation simulation
  // Normal values have deeper path depths (longer search). Fraud is isolated quickly (short paths).
  let pathLength = 0;
  let score = 0;
  
  if (isFraud) {
    pathLength = (2.1 + Math.random() * 0.9).toFixed(1);
    score = (0.72 + Math.random() * 0.25).toFixed(2);
  } else {
    pathLength = (5.5 + Math.random() * 2.5).toFixed(1);
    score = (0.08 + Math.random() * 0.25).toFixed(2);
  }

  return {
    timestamp: new Date().toLocaleTimeString(),
    location,
    amount,
    category,
    pathLength,
    score,
    isFraud
  };
}

// Add row to stream table
function addTransactionToTable(txn) {
  const tbody = document.getElementById('transaction-stream-body');
  const tr = document.createElement('tr');
  
  let statusBadge = '';
  if (txn.score > 0.7) {
    statusBadge = '<span class="status-badge fraud">Fraud Warning</span>';
  } else if (txn.score > 0.45) {
    statusBadge = '<span class="status-badge suspect">Suspect</span>';
  } else {
    statusBadge = '<span class="status-badge normal">Normal</span>';
  }

  tr.innerHTML = `
    <td>${txn.timestamp}</td>
    <td>${txn.location}</td>
    <td>$${txn.amount}</td>
    <td>${txn.category}</td>
    <td>${txn.pathLength}</td>
    <td>${txn.score}</td>
    <td>${statusBadge}</td>
  `;

  tbody.insertBefore(tr, tbody.firstChild);

  // Keep list size capped
  if (tbody.children.length > MAX_VISIBLE_ROWS) {
    tbody.removeChild(tbody.lastChild);
  }
}

// Generate pre-loaded rows
function generateInitialStream() {
  for (let i = 0; i < MAX_VISIBLE_ROWS; i++) {
    const txn = generateTransaction();
    addTransactionToTable(txn);
  }
}

// Sandbox Outlier scoring engine
function runSandboxInference() {
  const amount = parseFloat(document.getElementById('input-amount').value);
  const velocity = parseFloat(document.getElementById('input-velocity').value);
  const distance = parseFloat(document.getElementById('input-distance').value);
  
  // Scoring logic based on deviations from normal centers (45 USD, 1.5 velocity, 8 miles distance)
  const zAmount = Math.max(0, (amount - 45) / 25);
  const zVelocity = Math.max(0, (velocity - 1.5) / 1.5);
  const zDistance = Math.max(0, (distance - 8) / 8);
  
  // Outlier distance metric
  const deviation = zAmount * 0.45 + zVelocity * 0.35 + zDistance * 0.4;
  
  // Isolation Forest Path mapping simulation
  // Max path is ~8.5, min path is ~1.8
  let path = Math.max(1.8, 8.2 - (deviation * 0.8));
  let score = Math.min(0.99, 0.05 + (deviation * 0.15));

  // Round results
  path = path.toFixed(1);
  score = score.toFixed(2);

  const resultsDiv = document.getElementById('outlier-results');
  resultsDiv.style.display = 'block';
  document.getElementById('result-path').textContent = path;
  document.getElementById('result-score').textContent = score;

  const evalText = document.getElementById('result-evaluation-text');
  if (score > 0.68) {
    evalText.innerHTML = '🚨 WARNING: Anomalous metrics. Highly isolated node. Flagged as FRAUD.';
    evalText.style.color = '#f43f5e';
  } else if (score > 0.4) {
    evalText.innerHTML = '⚠️ SUSPECT: High deviation. Monitor transaction for velocity alerts.';
    evalText.style.color = '#ff9f43';
  } else {
    evalText.innerHTML = '✅ NORMAL: Search path length is deep inside baseline clusters.';
    evalText.style.color = '#10b981';
  }
}

// Chart.js Distribution Functions
function initCharts() {
  const ctx = document.getElementById('driftChart').getContext('2d');
  
  // Normal distributions mapping values ($10 to $200)
  const labels = Array.from({length: 40}, (_, i) => 10 + i * 5);
  const baselineData = labels.map(x => normalProbability(x, 45, 25));
  const currentData = labels.map(x => normalProbability(x, 45, 25));

  driftChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(x => `$${x}`),
      datasets: [
        {
          label: 'Baseline Reference',
          data: baselineData,
          borderColor: '#4facfe',
          backgroundColor: 'rgba(79, 172, 254, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        },
        {
          label: 'Production Stream',
          data: currentData,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.03)' },
          ticks: { display: false }
        }
      }
    }
  });
}

function updateChartData(avg, stdDev) {
  if (!driftChart) return;
  const labels = Array.from({length: 40}, (_, i) => 10 + i * 5);
  const updatedData = labels.map(x => normalProbability(x, avg, stdDev));
  
  driftChart.data.datasets[1].data = updatedData;
  driftChart.data.datasets[1].borderColor = currentScenario === 'drift' ? '#f43f5e' : '#00f2fe';
  driftChart.data.datasets[1].backgroundColor = currentScenario === 'drift' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(0, 242, 254, 0.15)';
  
  driftChart.update();
}

function normalProbability(x, mean, stdDev) {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
}
