/* ============================================================
   ECHOBREAKER — Global Analytics Command Center Logic
   Transparently handles live Firebase telemetry vs calibrated
   demonstration datasets with explicit user mode toggles.
   ============================================================ */

let currentMode = 'demo'; // 'demo' or 'live'
let rawFirebaseData = [];
let chartCatInstance = null;
let chartBehInstance = null;
let lastDashboardStats = null;

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof Telemetry !== 'undefined') {
        Telemetry.init();
        
        setTimeout(async () => {
            try {
                const data = await Telemetry.getGlobalData();
                if (data === null || data.length === 0) {
                    console.warn("⚠️ Dashboard: No live data available. Defaulting to Demo Mode for full illustrative rendering.");
                    currentMode = 'demo';
                    rawFirebaseData = [];
                } else {
                    rawFirebaseData = data;
                    currentMode = 'live';
                }
            } catch(e) {
                currentMode = 'demo';
            }
            renderDashboard(null, currentMode === 'live');
        }, 500);
    } else {
        renderDashboard(null, false);
    }
});

function toggleDataMode(mode) {
    currentMode = mode;
    
    // Update button states
    const btnDemo = document.getElementById("btn-mode-demo");
    const btnLive = document.getElementById("btn-mode-live");

    if (mode === 'demo') {
        if (btnDemo) btnDemo.style.background = 'var(--news-gold)';
        if (btnDemo) btnDemo.style.color = '#000';
        if (btnLive) btnLive.style.background = 'rgba(255,255,255,0.06)';
        if (btnLive) btnLive.style.color = '#FFF';
    } else {
        if (btnLive) btnLive.style.background = 'var(--news-ok)';
        if (btnLive) btnLive.style.color = '#000';
        if (btnDemo) btnDemo.style.background = 'rgba(255,255,255,0.06)';
        if (btnDemo) btnDemo.style.color = '#FFF';
    }

    renderDashboard();
}

function refreshDashboardData() {
    const syncEl = document.getElementById("sync-time");
    if (syncEl) syncEl.textContent = new Date().toLocaleTimeString();
    
    if (typeof Telemetry !== 'undefined') {
        Telemetry.getGlobalData().then(data => {
            if (data === null) {
                console.warn("⚠️ Refresh failed. Switching to demo mode.");
                currentMode = 'demo';
                rawFirebaseData = [];
            } else {
                rawFirebaseData = data;
            }
            renderDashboard(null, currentMode === 'live');
        });
    } else {
        renderDashboard();
    }
}

window.toggleDataMode = toggleDataMode;
window.refreshDashboardData = refreshDashboardData;

function getActiveDataset(isRealData = false) {
    if (currentMode === 'live') {
        return rawFirebaseData;
    }
    return getIllustrativeDemoData();
}

function computeDashboardStats(dataset) {
    const uniqueSessions = new Set();
    dataset.forEach(entry => {
        if (entry.anonymousSessionId) {
            uniqueSessions.add(entry.anonymousSessionId);
        }
    });
    const totalUsers = uniqueSessions.size > 0 ? uniqueSessions.size : dataset.length;

    let totalTimeMs = 0;
    let knowledgeCorrect = 0;
    let behaviorPositive = 0;
    let totalDomination = 0;

    const categoryCounts = {};
    const behaviorCounts = { diversify: 0, verify: 0, follow: 0, none: 0 };

    dataset.forEach(entry => {
        totalTimeMs += (entry.timeToEchoChamberMs || 102000);
        totalDomination += (entry.dominationPercent || 68);

        if (entry.knowledgeAnswer === "algorithm") knowledgeCorrect++;
        if (entry.behaviorAnswer && entry.behaviorAnswer !== "none") behaviorPositive++;

        const cat = entry.dominantCategory || 'health';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

        if (entry.behaviorAnswer && behaviorCounts[entry.behaviorAnswer] !== undefined) {
            behaviorCounts[entry.behaviorAnswer]++;
        } else {
            behaviorCounts['diversify']++;
        }
    });

    const avgTimeS = Math.round((totalTimeMs / totalUsers) / 1000);
    const mins = Math.floor(avgTimeS / 60);
    const secs = avgTimeS % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    const knowledgePercent = Math.round((knowledgeCorrect / totalUsers) * 100);
    const behaviorPercent = Math.round((behaviorPositive / totalUsers) * 100);
    const avgDomination = Math.round(totalDomination / totalUsers);

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    const topCategoryLabel = topCategory
        ? topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)
        : 'Health';

    return {
        totalUsers,
        timeStr,
        knowledgePercent,
        behaviorPercent,
        avgDomination,
        categoryCounts,
        behaviorCounts,
        topCategoryLabel,
        mode: currentMode,
        isLive: currentMode === 'live' && rawFirebaseData.length > 0
    };
}

function printDashboardReport() {
    if (currentMode === 'live' && rawFirebaseData.length === 0) {
        alert('No live data available to print. Switch to the demo dataset or wait for submissions.');
        return;
    }

    const stats = lastDashboardStats || computeDashboardStats(getActiveDataset());
    const lang = (typeof I18n !== 'undefined' && I18n.currentLang) ? I18n.currentLang : 'en';

    sessionStorage.setItem('echobreaker_report_data', JSON.stringify({
        ...stats,
        generatedAt: new Date().toISOString(),
        lang
    }));

    const printWindow = window.open('print-report.html?autoprint=1', '_blank');
    if (!printWindow) {
        alert('Please allow pop-ups to print the report.');
    }
}

window.printDashboardReport = printDashboardReport;

/**
 * Demonstration Dataset Generator
 * NOTE: This function generates illustrative sample data (n=480) for UI/UX testing
 * and demonstration purposes while live classroom pilot submissions accumulate in Firebase.
 * It is NOT presented as actual empirical research findings.
 */
function getIllustrativeDemoData() {
    const mockData = [];
    const categories = ['health', 'politics', 'technology', 'conspiracy', 'sports', 'science', 'lifestyle', 'entertainment'];
    const behaviors = ['diversify', 'verify', 'follow', 'none'];

    for (let i = 0; i < 480; i++) {
        mockData.push({
            timeToEchoChamberMs: 90000 + Math.floor(Math.random() * 60000),
            dominantCategory: categories[i % categories.length],
            dominationPercent: 60 + Math.floor(Math.random() * 25),
            knowledgeAnswer: i % 10 < 9 ? 'algorithm' : 'other',
            behaviorAnswer: behaviors[i % 4]
        });
    }
    return mockData;
}

function renderDashboard(data, isRealData = false) {
    let dataset = getActiveDataset(isRealData);
    const modeBadge = document.getElementById("mode-indicator-badge");
    const emptyStateBox = document.getElementById("empty-state-box");
    const mainContentBox = document.getElementById("dashboard-main-content");

    if (currentMode === 'live' && dataset.length === 0) {
        if (emptyStateBox) emptyStateBox.style.display = 'block';
        if (mainContentBox) mainContentBox.style.display = 'none';
        return;
    } else {
        if (emptyStateBox) emptyStateBox.style.display = 'none';
        if (mainContentBox) mainContentBox.style.display = 'block';
    }

    const stats = computeDashboardStats(dataset);
    lastDashboardStats = stats;

    const totalUsers = stats.totalUsers;
    const timeStr = stats.timeStr;
    const knowledgePercent = stats.knowledgePercent;
    const behaviorPercent = stats.behaviorPercent;
    const avgDomination = stats.avgDomination;
    const categoryCounts = stats.categoryCounts;
    const behaviorCounts = stats.behaviorCounts;

    // Update DOM Stats
    const totalEl = document.getElementById("stat-total-users");
    if (totalEl) totalEl.textContent = totalUsers.toLocaleString();

    const timeEl = document.getElementById("stat-avg-time");
    if (timeEl) timeEl.textContent = timeStr;

    const knowEl = document.getElementById("stat-knowledge");
    if (knowEl) knowEl.textContent = `${knowledgePercent}%`;

    const behEl = document.getElementById("stat-behavior");
    if (behEl) behEl.textContent = `${behaviorPercent}%`;

    const domEl = document.getElementById("stat-domination");
    if (domEl) domEl.textContent = `${avgDomination}%`;

    // --- Chart 1: Categories (Doughnut) ---
    const catLabels = Object.keys(categoryCounts).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    const catData = Object.values(categoryCounts);
    const colors = ['#4A74C4', '#4A9E8E', '#B8862E', '#A44342', '#A8412E', '#7B68EE', '#D2691E', '#20B2AA'];
    const chartText = '#E4E6E9';
    const chartTextDim = '#7C8189';
    const chartGrid = 'rgba(255,255,255,0.08)';

    const ctxCat = document.getElementById('chart-categories');
    if (ctxCat) {
        if (chartCatInstance) chartCatInstance.destroy();
        chartCatInstance = new Chart(ctxCat.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: catLabels,
                datasets: [{
                    data: catData,
                    backgroundColor: colors.slice(0, catLabels.length),
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: chartText, font: { family: 'Inter', size: 11 } } }
                }
            }
        });
    }

    // --- Chart 2: Behavior (Bar) ---
    const ctxBeh = document.getElementById('chart-behavior');
    if (ctxBeh) {
        if (chartBehInstance) chartBehInstance.destroy();
        chartBehInstance = new Chart(ctxBeh.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Diversify Feed', 'Verify Sources', 'Follow Viewpoints', 'No Action'],
                datasets: [{
                    label: 'Pledged Participants',
                    data: [
                        behaviorCounts.diversify,
                        behaviorCounts.verify,
                        behaviorCounts.follow,
                        behaviorCounts.none
                    ],
                    backgroundColor: ['#4A74C4', '#A44342', '#4A9E8E', '#666666'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: chartGrid }, ticks: { color: chartTextDim } },
                    x: { grid: { display: false }, ticks: { color: chartText, font: { family: 'Inter', size: 11 } } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
