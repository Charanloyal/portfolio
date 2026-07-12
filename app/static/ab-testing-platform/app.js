// AeroTest - Application Script Logic

document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            item.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Re-render charts when switching tabs to fix rendering size bugs
            if (tabId === 'sample-size') {
                renderSampleSizeChart();
            } else if (tabId === 'hypothesis-test') {
                renderHypothesisChart();
            }
        });
    });

    // --- Mathematical Helpers ---

    // Approximation of Standard Normal Cumulative Distribution Function (CDF)
    // Precision: ~ 7 decimal places. A&S Formula 7.1.26
    function normalCDF(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = (x < 0) ? -1 : 1;
        const absX = Math.abs(x) / Math.sqrt(2.0);

        const t = 1.0 / (1.0 + p * absX);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

        return 0.5 * (1.0 + sign * y);
    }

    // Standard Normal PDF (for plotting distribution curves)
    function normalPDF(x, mean, stdDev) {
        const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
    }

    function getZAlpha(alpha) {
        if (alpha === 0.01) return 2.576;
        if (alpha === 0.05) return 1.960;
        if (alpha === 0.10) return 1.645;
        return 1.960;
    }

    function getZBeta(power) {
        if (power === 0.80) return 0.842;
        if (power === 0.90) return 1.282;
        if (power === 0.95) return 1.645;
        return 0.842;
    }

    // --- Tab 1: Sample Size Logic ---
    const baseCrInput = document.getElementById('baseline-cr');
    const mdeInput = document.getElementById('mde');
    const mdeTypeInput = document.getElementById('mde-type');
    const alphaInput = document.getElementById('alpha');
    const powerInput = document.getElementById('power');
    const sampleSizeResult = document.getElementById('sample-size-result');
    const targetCrResult = document.getElementById('target-treatment-cr');
    const totalExperimentResult = document.getElementById('total-experiment-size');

    let sampleSizeChartInstance = null;

    function calculateSampleSize() {
        const p1 = parseFloat(baseCrInput.value) / 100;
        const mdeVal = parseFloat(mdeInput.value) / 100;
        const mdeType = mdeTypeInput.value;
        const alpha = parseFloat(alphaInput.value);
        const power = parseFloat(powerInput.value);

        let p2;
        if (mdeType === 'absolute') {
            p2 = p1 + mdeVal;
        } else {
            p2 = p1 * (1 + mdeVal);
        }

        if (p2 <= 0 || p2 >= 1) {
            sampleSizeResult.innerText = "Error";
            targetCrResult.innerText = "Out of range";
            totalExperimentResult.innerText = "--";
            return;
        }

        const zAlpha = getZAlpha(alpha);
        const zBeta = getZBeta(power);

        // Standard sample size formula for two independent proportions
        const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
        const denominator = Math.pow(p1 - p2, 2);
        const n = Math.ceil(numerator / denominator);

        sampleSizeResult.innerText = n.toLocaleString();
        targetCrResult.innerText = (p2 * 100).toFixed(2) + '%';
        totalExperimentResult.innerText = (n * 2).toLocaleString();

        renderSampleSizeChart();
    }

    function renderSampleSizeChart() {
        const ctx = document.getElementById('sample-size-chart').getContext('2d');
        const p1 = parseFloat(baseCrInput.value) / 100;
        const alpha = parseFloat(alphaInput.value);
        const power = parseFloat(powerInput.value);
        const mdeType = mdeTypeInput.value;

        // Generate line chart data for different MDE ranges
        const mdes = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 3.0];
        const dataPoints = mdes.map(m => {
            const mdeVal = m / 100;
            const p2 = (mdeType === 'absolute') ? (p1 + mdeVal) : (p1 * (1 + mdeVal));
            const zAlpha = getZAlpha(alpha);
            const zBeta = getZBeta(power);
            const num = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
            const den = Math.pow(p1 - p2, 2);
            return Math.ceil(num / den);
        });

        if (sampleSizeChartInstance) {
            sampleSizeChartInstance.destroy();
        }

        sampleSizeChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mdes.map(m => m + '%'),
                datasets: [{
                    label: 'Sample Size Required',
                    data: dataPoints,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Required: ${context.parsed.y.toLocaleString()} users/group`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Minimum Detectable Effect (MDE)', color: '#94a3b8' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Sample Size (Per Group)', color: '#94a3b8' },
                        ticks: { color: '#94a3b8', callback: val => val.toLocaleString() }
                    }
                }
            }
        });
    }

    // Attach listeners for Tab 1
    [baseCrInput, mdeInput, mdeTypeInput, alphaInput, powerInput].forEach(elem => {
        elem.addEventListener('input', calculateSampleSize);
    });


    // --- Tab 2: Hypothesis Tester & SRM Check ---
    const visitorsA = document.getElementById('visitors-a');
    const conversionsA = document.getElementById('conversions-a');
    const visitorsB = document.getElementById('visitors-b');
    const conversionsB = document.getElementById('conversions-b');
    const hypAlpha = document.getElementById('hyp-alpha');

    const sigCard = document.getElementById('sig-card');
    const pValueResult = document.getElementById('p-value-result');
    const crAResult = document.getElementById('cr-a-result');
    const crBResult = document.getElementById('cr-b-result');
    const upliftResult = document.getElementById('uplift-result');
    const ciResult = document.getElementById('ci-result');
    const srmAlert = document.getElementById('srm-alert');
    const srmPVal = document.getElementById('srm-p-val');

    let hypothesisChartInstance = null;

    function runHypothesisTest() {
        const nA = parseInt(visitorsA.value);
        const cA = parseInt(conversionsA.value);
        const nB = parseInt(visitorsB.value);
        const cB = parseInt(conversionsB.value);
        const alpha = parseFloat(hypAlpha.value);

        if (nA <= 0 || nB <= 0 || cA < 0 || cB < 0 || cA > nA || cB > nB) {
            pValueResult.innerText = "Error";
            return;
        }

        const crA = cA / nA;
        const crB = cB / nB;
        
        crAResult.innerText = (crA * 100).toFixed(2) + '%';
        crBResult.innerText = (crB * 100).toFixed(2) + '%';

        const uplift = (crB - crA) / crA * 100;
        upliftResult.innerText = (uplift >= 0 ? '+' : '') + uplift.toFixed(2) + '%';

        // Two-proportions pooled Z-test
        const pPool = (cA + cB) / (nA + nB);
        const sePool = Math.sqrt(pPool * (1 - pPool) * (1/nA + 1/nB));
        const zStat = (crB - crA) / sePool;
        
        // Two-sided p-value
        const pValue = 2 * (1 - normalCDF(Math.abs(zStat)));
        pValueResult.innerText = pValue < 0.0001 ? '< 0.0001' : pValue.toFixed(4);

        // Confidence interval for difference (unpooled standard error)
        const seDiff = Math.sqrt((crA * (1 - crA) / nA) + (crB * (1 - crB) / nB));
        const zCrit = getZAlpha(alpha);
        const diff = crB - crA;
        const ciLow = (diff - zCrit * seDiff) * 100;
        const ciHigh = (diff + zCrit * seDiff) * 100;
        ciResult.innerText = `[${ciLow.toFixed(2)}%, ${ciHigh.toFixed(2)}%]`;

        // Update card styling based on significance
        const isSignificant = pValue < alpha;
        if (isSignificant) {
            sigCard.className = "metric-highlight success";
            sigCard.querySelector('.metric-label').innerHTML = `Significant Uplift (α = ${alpha}) 🎉`;
        } else {
            sigCard.className = "metric-highlight warning";
            sigCard.querySelector('.metric-label').innerHTML = `Not Statistically Significant (α = ${alpha})`;
        }

        // --- SRM Analysis (Sample Ratio Mismatch) ---
        const totalObserved = nA + nB;
        const expectedCount = totalObserved / 2;
        const chiSquare = Math.pow(nA - expectedCount, 2) / expectedCount + Math.pow(nB - expectedCount, 2) / expectedCount;
        
        // Chi-Square 1 DOF p-value is equivalent to standard normal squared tail probability
        const srmP = 2 * (1 - normalCDF(Math.sqrt(chiSquare)));
        srmPVal.innerText = srmP.toFixed(5);

        if (srmP < 0.001) {
            srmAlert.className = "alert-box alert-danger";
            srmAlert.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <div>
                    <strong>Potential SRM Alert (p = ${srmP.toFixed(6)}):</strong> The split ratio deviates critically from 50/50. Downstream metrics are highly suspect!
                </div>
            `;
        } else {
            srmAlert.className = "alert-box alert-success";
            srmAlert.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <div>
                    <strong>SRM Validation Passed:</strong> Assignment proportions align perfectly with expectations (p = ${srmP.toFixed(4)}).
                </div>
            `;
        }

        renderHypothesisChart();
    }

    function renderHypothesisChart() {
        const ctx = document.getElementById('hypothesis-chart').getContext('2d');
        const nA = parseInt(visitorsA.value);
        const cA = parseInt(conversionsA.value);
        const nB = parseInt(visitorsB.value);
        const cB = parseInt(conversionsB.value);

        const crA = cA / nA;
        const crB = cB / nB;

        // Compute standard deviations of the sample proportions
        const sdA = Math.sqrt(crA * (1 - crA) / nA);
        const sdB = Math.sqrt(crB * (1 - crB) / nB);

        // Generate points for the probability density curves
        const minVal = Math.min(crA - 4 * sdA, crB - 4 * sdB);
        const maxVal = Math.max(crA + 4 * sdA, crB + 4 * sdB);
        const step = (maxVal - minVal) / 100;
        
        const labels = [];
        const dataA = [];
        const dataB = [];

        for (let x = minVal; x <= maxVal; x += step) {
            labels.push((x * 100).toFixed(2) + '%');
            dataA.push(normalPDF(x, crA, sdA));
            dataB.push(normalPDF(x, crB, sdB));
        }

        if (hypothesisChartInstance) {
            hypothesisChartInstance.destroy();
        }

        hypothesisChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Control (Group A) PDF',
                        data: dataA,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.03)',
                        fill: true,
                        borderWidth: 1.5,
                        pointRadius: 0,
                        tension: 0.3
                    },
                    {
                        label: 'Treatment (Group B) PDF',
                        data: dataB,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.03)',
                        fill: true,
                        borderWidth: 1.5,
                        pointRadius: 0,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } }
                    },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { size: 9 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { display: false }
                    }
                }
            }
        });
    }

    // Attach listeners for Tab 2
    [visitorsA, conversionsA, visitorsB, conversionsB, hypAlpha].forEach(elem => {
        elem.addEventListener('input', runHypothesisTest);
    });


    // --- Tab 3: Business ROI Logic ---
    const monthlyTrafficInput = document.getElementById('monthly-traffic');
    const roiBaselineCrInput = document.getElementById('roi-baseline-cr');
    const roiUpliftInput = document.getElementById('roi-uplift');
    const aovInput = document.getElementById('aov');
    const costInput = document.getElementById('cost');

    const roiAnnualUplift = document.getElementById('roi-annual-uplift');
    const roiMonthlyUplift = document.getElementById('roi-monthly-uplift');
    const roiConversionsLift = document.getElementById('roi-conversions-lift');
    const roiPctVal = document.getElementById('roi-pct-val');
    const roiPayback = document.getElementById('roi-payback');

    const tableBaseConv = document.getElementById('table-base-conv');
    const tableProjConv = document.getElementById('table-proj-conv');
    const tableLiftConv = document.getElementById('table-lift-conv');
    const tableBaseRev = document.getElementById('table-base-rev');
    const tableProjRev = document.getElementById('table-proj-rev');
    const tableLiftRev = document.getElementById('table-lift-rev');

    function calculateROIEstimate() {
        const traffic = parseInt(monthlyTrafficInput.value);
        const crBase = parseFloat(roiBaselineCrInput.value) / 100;
        const upliftRel = parseFloat(roiUpliftInput.value) / 100; // e.g. 10% uplift
        const aov = parseFloat(aovInput.value);
        const cost = parseFloat(costInput.value);

        if (traffic <= 0 || crBase <= 0 || upliftRel <= 0 || aov <= 0) return;

        // Baseline Calculations
        const baseConv = traffic * crBase;
        const baseRev = baseConv * aov;

        // Projected Calculations
        const crProj = crBase * (1 + upliftRel);
        const projConv = traffic * crProj;
        const projRev = projConv * aov;

        // Incremental Increases
        const liftConv = projConv - baseConv;
        const liftRevMonth = projRev - baseRev;
        const liftRevYear = liftRevMonth * 12;

        // ROI metrics
        const netProfitYear1 = liftRevYear - cost;
        const roiPct = cost > 0 ? (netProfitYear1 / cost) * 100 : 0;
        const payback = liftRevMonth > 0 ? (cost / liftRevMonth) : 0;

        // Update UI displays
        roiAnnualUplift.innerText = '$' + Math.round(liftRevYear).toLocaleString();
        roiMonthlyUplift.innerText = '$' + Math.round(liftRevMonth).toLocaleString();
        roiConversionsLift.innerText = '+' + Math.round(liftConv).toLocaleString();
        
        if (cost > 0) {
            roiPctVal.innerText = Math.round(roiPct).toLocaleString() + '%';
            roiPayback.innerText = payback <= 1 ? 'Instant' : payback.toFixed(1) + ' Months';
        } else {
            roiPctVal.innerText = 'Infinite';
            roiPayback.innerText = 'Instant';
        }

        // Update Table
        tableBaseConv.innerText = Math.round(baseConv).toLocaleString();
        tableProjConv.innerText = Math.round(projConv).toLocaleString();
        tableLiftConv.innerText = '+' + Math.round(liftConv).toLocaleString() + ` (${(upliftRel * 100).toFixed(1)}%)`;

        tableBaseRev.innerText = '$' + Math.round(baseRev).toLocaleString();
        tableProjRev.innerText = '$' + Math.round(projRev).toLocaleString();
        tableLiftRev.innerText = '+$' + Math.round(liftRevMonth).toLocaleString();
    }

    // Attach listeners for Tab 3
    [monthlyTrafficInput, roiBaselineCrInput, roiUpliftInput, aovInput, costInput].forEach(elem => {
        elem.addEventListener('input', calculateROIEstimate);
    });

    // --- Page Initialization ---
    calculateSampleSize();
    runHypothesisTest();
    calculateROIEstimate();
});
