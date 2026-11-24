/**
 * ============================================================================
 * Dynamic Programming Optimization Toolkit - Core Application Engine
 * Authors: Group 12 (DAA College Capstone Project)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundCanvas();
    initKnapsackVisualizer();
    initDPChallenge();
    initFloydWarshall();
    initComplexitySimulator();
    initCodeViewer();
    initPresentationDeck();
    initSmoothNavigation();
});

// Toast notification utility
function showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

/* ==========================================================================
   1. BACKGROUND CANVAS ANIMATION (MATRIX CONNECTING PARTICLES)
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numNodes = Math.min(45, Math.floor(width / 32));
    const nodes = [];

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
        ctx.lineWidth = 1;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        for (const node of nodes) {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. 0/1 KNAPSACK PROBLEM INTERACTIVE VISUALIZER
   ========================================================================== */
function initKnapsackVisualizer() {
    // Project Dataset specification:
    // Item 1: W=2, V=3
    // Item 2: W=3, V=4
    // Item 3: W=4, V=5
    // Item 4: W=5, V=6
    // Capacity = 5
    let dataset = [
        { id: 1, weight: 2, value: 3 },
        { id: 2, weight: 3, value: 4 },
        { id: 3, weight: 4, value: 5 },
        { id: 4, weight: 5, value: 6 }
    ];
    let capacity = 5;

    let steps = [];
    let currentStepIdx = 0;
    let isPlaying = false;
    let timer = null;
    let playSpeed = 800; // ms

    function computeSteps() {
        steps = [];
        const n = dataset.length;
        const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

        // Step 0: Base initialization
        steps.push({
            i: 0,
            w: 0,
            val: 0,
            tableSnapshot: JSON.parse(JSON.stringify(dp)),
            title: "Base Row and Column Initialized",
            detail: "Row 0 represents 0 items available; Column 0 represents 0 capacity. All base entries evaluate to profit 0.",
            decision: "Base Case",
            equation: "DP[0][w] = 0, DP[i][0] = 0",
            excludeCell: null,
            includeCell: null
        });

        for (let i = 1; i <= n; i++) {
            const item = dataset[i - 1];
            for (let w = 0; w <= capacity; w++) {
                if (w === 0) {
                    dp[i][0] = 0;
                    steps.push({
                        i,
                        w: 0,
                        val: 0,
                        tableSnapshot: JSON.parse(JSON.stringify(dp)),
                        title: `Item ${item.id} with Zero Capacity`,
                        detail: `Capacity w = 0. No item can fit when capacity is zero.`,
                        decision: "Base Column",
                        equation: `DP[${i}][0] = 0`,
                        excludeCell: null,
                        includeCell: null
                    });
                    continue;
                }

                if (item.weight > w) {
                    // Cannot fit item
                    dp[i][w] = dp[i - 1][w];
                    steps.push({
                        i,
                        w,
                        val: dp[i][w],
                        tableSnapshot: JSON.parse(JSON.stringify(dp)),
                        title: `Item ${item.id} Cannot Fit (Weight ${item.weight} > Capacity ${w})`,
                        detail: `Item ${item.id} has weight ${item.weight}, which exceeds current capacity ${w}. Must carry forward the previous optimal value DP[${i-1}][${w}].`,
                        decision: "Must Exclude",
                        equation: `DP[${i}][${w}] = DP[${i-1}][${w}] = ${dp[i-1][w]}`,
                        excludeCell: { r: i - 1, c: w },
                        includeCell: null
                    });
                } else {
                    // Fits: compare exclude vs include
                    const excludeVal = dp[i - 1][w];
                    const includeVal = dp[i - 1][w - item.weight] + item.value;
                    const chosenVal = Math.max(excludeVal, includeVal);
                    dp[i][w] = chosenVal;

                    const decisionText = includeVal > excludeVal ? "Include Item" : "Exclude Item";
                    steps.push({
                        i,
                        w,
                        val: chosenVal,
                        tableSnapshot: JSON.parse(JSON.stringify(dp)),
                        title: `Item ${item.id} (Wt ${item.weight}, Val ${item.value}) Fits in Capacity ${w}`,
                        detail: `Comparing Options:\n` +
                                `&bull; Exclude Item ${item.id}: DP[${i-1}][${w}] = ${excludeVal}\n` +
                                `&bull; Include Item ${item.id}: DP[${i-1}][${w - item.weight}] + ${item.value} = ${dp[i-1][w - item.weight]} + ${item.value} = ${includeVal}\n` +
                                `Optimal: max(${excludeVal}, ${includeVal}) = ${chosenVal}.`,
                        decision: decisionText,
                        equation: `DP[${i}][${w}] = max(DP[${i-1}][${w}], DP[${i-1}][${w - item.weight}] + ${item.value}) = max(${excludeVal}, ${includeVal}) = ${chosenVal}`,
                        excludeCell: { r: i - 1, c: w },
                        includeCell: { r: i - 1, c: w - item.weight }
                    });
                }
            }
        }
    }

    function renderItemList() {
        const container = document.getElementById('item-list-container');
        if (!container) return;
        container.innerHTML = '';

        dataset.forEach((item) => {
            const row = document.createElement('div');
            row.className = 'item-row';
            row.id = `item-row-${item.id}`;
            const ratio = (item.value / item.weight).toFixed(2);

            row.innerHTML = `
                <div class="item-info">
                    <div class="item-badge">${item.id}</div>
                    <div>
                        <div style="font-size:0.85rem; font-weight:600; color:#fff;">Item ${item.id}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">Ratio: ${ratio} v/w</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.82rem; font-family:var(--font-mono); color:var(--accent-cyan);">Wt: ${item.weight}</div>
                    <div style="font-size:0.82rem; font-family:var(--font-mono); color:var(--accent-emerald);">Val: ${item.value}</div>
                </div>
            `;
            container.appendChild(row);
        });

        document.getElementById('capacity-badge').innerText = `Capacity W = ${capacity}`;
    }

    function renderTableSkeleton() {
        const table = document.getElementById('dp-table');
        if (!table) return;
        table.innerHTML = '';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>Item \\ W</th>`;
        for (let w = 0; w <= capacity; w++) {
            headerRow.innerHTML += `<th>w=${w}</th>`;
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const numRows = dataset.length;

        for (let i = 0; i <= numRows; i++) {
            const tr = document.createElement('tr');
            tr.id = `dp-row-${i}`;
            const label = i === 0 ? "0 (None)" : `I${i} (w:${dataset[i-1].weight}, v:${dataset[i-1].value})`;
            tr.innerHTML = `<th style="text-align:left;">${label}</th>`;

            for (let w = 0; w <= capacity; w++) {
                const td = document.createElement('td');
                td.id = `cell-${i}-${w}`;
                td.innerText = '-';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
    }

    function applyStep(idx) {
        if (idx < 0 || idx >= steps.length) return;
        currentStepIdx = idx;

        const step = steps[idx];
        const snapshot = step.tableSnapshot;

        document.querySelectorAll('.dp-matrix td').forEach(td => {
            td.className = '';
        });
        document.querySelectorAll('.item-row').forEach(r => r.classList.remove('item-active'));

        for (let r = 0; r <= dataset.length; r++) {
            for (let c = 0; c <= capacity; c++) {
                const cell = document.getElementById(`cell-${r}-${c}`);
                if (!cell) continue;

                const isComputedBefore = (r < step.i) || (r === step.i && c <= step.w);
                if (isComputedBefore) {
                    cell.innerText = snapshot[r][c];
                    cell.classList.add('computed');
                } else {
                    cell.innerText = '-';
                }
            }
        }

        const currCell = document.getElementById(`cell-${step.i}-${step.w}`);
        if (currCell) currCell.classList.add('current-cell');

        if (step.excludeCell) {
            const exCell = document.getElementById(`cell-${step.excludeCell.r}-${step.excludeCell.c}`);
            if (exCell) exCell.classList.add('ref-exclude');
        }

        if (step.includeCell) {
            const inCell = document.getElementById(`cell-${step.includeCell.r}-${step.includeCell.c}`);
            if (inCell) inCell.classList.add('ref-include');
        }

        if (step.i > 0) {
            const itemRow = document.getElementById(`item-row-${dataset[step.i - 1].id}`);
            if (itemRow) itemRow.classList.add('item-active');
        }

        document.getElementById('calc-progress').innerText = `Step ${idx + 1} / ${steps.length}`;
        document.getElementById('step-title-text').innerText = step.title;
        document.getElementById('step-detail-text').innerHTML = step.detail.replace(/\n/g, '<br>');
        
        const badge = document.getElementById('step-decision-badge');
        badge.innerText = step.decision;
        if (step.decision === "Include Item") {
            badge.className = "badge badge-emerald";
        } else if (step.decision === "Must Exclude") {
            badge.className = "badge badge-amber";
        } else {
            badge.className = "badge badge-cyan";
        }

        const eqBox = document.getElementById('step-equation-box');
        if (step.equation) {
            eqBox.style.display = 'block';
            eqBox.innerText = step.equation;
        } else {
            eqBox.style.display = 'none';
        }

        document.getElementById('btn-step-prev').disabled = (idx === 0);
        document.getElementById('btn-step-next').disabled = (idx === steps.length - 1);
        document.getElementById('btn-backtrack').disabled = (idx !== steps.length - 1);
    }

    function play() {
        if (isPlaying) return;
        isPlaying = true;
        document.getElementById('icon-play').style.display = 'none';
        document.getElementById('icon-pause').style.display = 'block';

        timer = setInterval(() => {
            if (currentStepIdx < steps.length - 1) {
                applyStep(currentStepIdx + 1);
            } else {
                pause();
                showToast("Table calculation complete. You can now trace selected items!");
            }
        }, playSpeed);
    }

    function pause() {
        isPlaying = false;
        clearInterval(timer);
        document.getElementById('icon-play').style.display = 'block';
        document.getElementById('icon-pause').style.display = 'none';
    }

    function reset() {
        pause();
        document.getElementById('backtrack-result-card').style.display = 'none';
        document.querySelectorAll('.item-row').forEach(r => r.classList.remove('item-selected'));
        applyStep(0);
    }

    function traceBacktrack() {
        pause();
        const n = dataset.length;
        const lastSnapshot = steps[steps.length - 1].tableSnapshot;
        let currW = capacity;
        const chosenItems = [];

        document.querySelectorAll('.dp-matrix td').forEach(td => {
            td.className = 'computed';
        });

        for (let i = n; i > 0; i--) {
            const cell = document.getElementById(`cell-${i}-${currW}`);
            if (cell) cell.classList.add('backtrack-chosen');

            if (lastSnapshot[i][currW] !== lastSnapshot[i - 1][currW]) {
                const item = dataset[i - 1];
                chosenItems.push(item);

                const itemRow = document.getElementById(`item-row-${item.id}`);
                if (itemRow) itemRow.classList.add('item-selected');

                currW -= item.weight;
            }
        }

        const baseCell = document.getElementById(`cell-0-${currW}`);
        if (baseCell) baseCell.classList.add('backtrack-chosen');

        const resultCard = document.getElementById('backtrack-result-card');
        resultCard.style.display = 'block';

        const totalValue = chosenItems.reduce((acc, it) => acc + it.value, 0);
        const totalWeight = chosenItems.reduce((acc, it) => acc + it.weight, 0);

        document.getElementById('backtrack-summary-text').innerHTML = 
            `Optimal solution packs <strong>${chosenItems.length} items</strong> for maximum profit of 
             <strong style="color:var(--accent-emerald); font-size:1.1rem;">${totalValue}</strong> 
             utilizing <strong style="color:var(--accent-cyan);">${totalWeight} / ${capacity}</strong> weight capacity.`;

        const pillsContainer = document.getElementById('backtrack-item-pills');
        pillsContainer.innerHTML = '';
        chosenItems.reverse().forEach(it => {
            const pill = document.createElement('div');
            pill.style.background = 'rgba(16, 185, 129, 0.15)';
            pill.style.border = '1px solid var(--accent-emerald)';
            pill.style.padding = '0.35rem 0.8rem';
            pill.style.borderRadius = '9999px';
            pill.style.fontSize = '0.82rem';
            pill.style.color = '#a7f3d0';
            pill.innerHTML = `<strong>Item ${it.id}</strong> (Weight: ${it.weight}, Value: ${it.value})`;
            pillsContainer.appendChild(pill);
        });

        showToast("Backtrack path traced with glowing green highlight!");
    }

    document.getElementById('btn-step-next').addEventListener('click', () => {
        pause();
        if (currentStepIdx < steps.length - 1) applyStep(currentStepIdx + 1);
    });

    document.getElementById('btn-step-prev').addEventListener('click', () => {
        pause();
        if (currentStepIdx > 0) applyStep(currentStepIdx - 1);
    });

    document.getElementById('btn-play-pause').addEventListener('click', () => {
        if (isPlaying) pause();
        else play();
    });

    document.getElementById('btn-reset').addEventListener('click', reset);
    document.getElementById('btn-backtrack').addEventListener('click', traceBacktrack);

    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playSpeed = parseInt(btn.dataset.speed, 10);
            if (isPlaying) {
                pause();
                play();
            }
        });
    });

    document.getElementById('btn-edit-dataset').addEventListener('click', () => {
        const customW = prompt("Enter knapsack capacity W (1 to 8):", capacity);
        if (customW && !isNaN(customW) && parseInt(customW) > 0) {
            capacity = Math.min(8, parseInt(customW));
            renderItemList();
            renderTableSkeleton();
            computeSteps();
            reset();
            showToast(`Capacity set to W = ${capacity}`);
        }
    });

    renderItemList();
    renderTableSkeleton();
    computeSteps();
    applyStep(0);
}

/* ==========================================================================
   3. DP TABLE CHALLENGE (STUDENT 2 INTERACTIVE MANUAL MODE)
   ========================================================================== */
function initDPChallenge() {
    const dataset = [
        { id: 1, weight: 2, value: 3 },
        { id: 2, weight: 3, value: 4 },
        { id: 3, weight: 4, value: 5 },
        { id: 4, weight: 5, value: 6 }
    ];
    const capacity = 5;

    const n = dataset.length;
    const correctDP = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        const wt = dataset[i - 1].weight;
        const val = dataset[i - 1].value;
        for (let w = 0; w <= capacity; w++) {
            if (wt > w) correctDP[i][w] = correctDP[i - 1][w];
            else correctDP[i][w] = Math.max(correctDP[i - 1][w], correctDP[i - 1][w - wt] + val);
        }
    }

    const table = document.getElementById('challenge-dp-table');
    if (!table) return;

    function buildChallengeGrid() {
        table.innerHTML = '';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>Item \\ W</th>`;
        for (let w = 0; w <= capacity; w++) {
            headerRow.innerHTML += `<th>w=${w}</th>`;
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (let i = 0; i <= n; i++) {
            const tr = document.createElement('tr');
            const label = i === 0 ? "0 (None)" : `I${i} (w:${dataset[i-1].weight}, v:${dataset[i-1].value})`;
            tr.innerHTML = `<th style="text-align:left;">${label}</th>`;

            for (let w = 0; w <= capacity; w++) {
                const td = document.createElement('td');
                td.id = `chal-cell-${i}-${w}`;

                if (i === 0 || w === 0) {
                    td.innerText = '0';
                    td.classList.add('computed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'dp-cell-input';
                    input.dataset.row = i;
                    input.dataset.col = w;
                    input.placeholder = '?';
                    input.addEventListener('input', () => {
                        input.classList.remove('correct', 'incorrect');
                    });
                    td.appendChild(input);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
    }

    function checkAnswers() {
        const inputs = document.querySelectorAll('.challenge-table input.dp-cell-input');
        let total = inputs.length;
        let correctCount = 0;

        inputs.forEach(input => {
            const r = parseInt(input.dataset.row, 10);
            const c = parseInt(input.dataset.col, 10);
            const expected = correctDP[r][c];
            const entered = parseInt(input.value.trim(), 10);

            if (entered === expected) {
                input.className = 'dp-cell-input correct';
                correctCount++;
            } else {
                input.className = 'dp-cell-input incorrect';
            }
        });

        const percent = Math.round((correctCount / total) * 100);
        document.getElementById('challenge-score').innerText = `${correctCount} / ${total} (${percent}%)`;

        const feedback = document.getElementById('challenge-feedback-box');
        feedback.style.display = 'block';
        if (correctCount === total) {
            feedback.style.background = 'rgba(16, 185, 129, 0.15)';
            feedback.style.border = '1px solid var(--accent-emerald)';
            feedback.style.color = '#6ee7b7';
            feedback.innerHTML = `<strong>100% Accuracy!</strong> You have successfully solved the 0/1 Knapsack recurrence relation!`;
            showToast("Challenge passed with 100% accuracy!");
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.15)';
            feedback.style.border = '1px solid #ef4444';
            feedback.style.color = '#fca5a5';
            feedback.innerHTML = `<strong>Keep Going:</strong> ${total - correctCount} cells are incorrect or unfilled. Check the cells highlighted in red.`;
        }
    }

    function autoFillNext() {
        const inputs = document.querySelectorAll('.challenge-table input.dp-cell-input');
        for (const input of inputs) {
            const r = parseInt(input.dataset.row, 10);
            const c = parseInt(input.dataset.col, 10);
            const expected = correctDP[r][c];

            if (input.value === '' || parseInt(input.value, 10) !== expected) {
                input.value = expected;
                input.className = 'dp-cell-input correct';

                const item = dataset[r - 1];
                const feedback = document.getElementById('challenge-feedback-box');
                feedback.style.display = 'block';
                feedback.style.background = 'rgba(6, 182, 212, 0.12)';
                feedback.style.border = '1px solid var(--accent-cyan)';
                feedback.style.color = '#bae6fd';

                if (item.weight > c) {
                    feedback.innerHTML = `<strong>Auto-Filled DP[${r}][${c}] = ${expected}:</strong> Item ${item.id} (wt: ${item.weight}) &gt; capacity ${c}, so copied directly from DP[${r-1}][${c}].`;
                } else {
                    const ex = correctDP[r - 1][c];
                    const inc = correctDP[r - 1][c - item.weight] + item.value;
                    feedback.innerHTML = `<strong>Auto-Filled DP[${r}][${c}] = ${expected}:</strong> max(Exclude: DP[${r-1}][${c}]=${ex}, Include: DP[${r-1}][${c-item.weight}]+${item.value}=${inc}) = ${expected}.`;
                }
                showToast(`Filled DP[${r}][${c}] = ${expected}`);
                break;
            }
        }
    }

    function showHint() {
        const inputs = document.querySelectorAll('.challenge-table input.dp-cell-input');
        for (const input of inputs) {
            const r = parseInt(input.dataset.row, 10);
            const c = parseInt(input.dataset.col, 10);
            const expected = correctDP[r][c];

            if (input.value === '' || parseInt(input.value, 10) !== expected) {
                const item = dataset[r - 1];
                const feedback = document.getElementById('challenge-feedback-box');
                feedback.style.display = 'block';
                feedback.style.background = 'rgba(99, 102, 241, 0.12)';
                feedback.style.border = '1px solid #818cf8';
                feedback.style.color = '#e0e7ff';

                if (item.weight > c) {
                    feedback.innerHTML = `<strong>Hint for DP[${r}][${c}]:</strong> Item ${item.id} has weight ${item.weight}, but current capacity is only ${c}. It cannot fit! Look directly above at DP[${r-1}][${c}].`;
                } else {
                    feedback.innerHTML = `<strong>Hint for DP[${r}][${c}]:</strong> Item ${item.id} fits! Compare DP[${r-1}][${c}] with DP[${r-1}][${c - item.weight}] + ${item.value}.`;
                }
                input.focus();
                break;
            }
        }
    }

    function revealAll() {
        const inputs = document.querySelectorAll('.challenge-table input.dp-cell-input');
        inputs.forEach(input => {
            const r = parseInt(input.dataset.row, 10);
            const c = parseInt(input.dataset.col, 10);
            input.value = correctDP[r][c];
            input.className = 'dp-cell-input correct';
        });
        document.getElementById('challenge-score').innerText = `${inputs.length} / ${inputs.length} (100%)`;
        showToast("Full solution table revealed!");
    }

    document.getElementById('btn-challenge-check').addEventListener('click', checkAnswers);
    document.getElementById('btn-challenge-autosolve').addEventListener('click', autoFillNext);
    document.getElementById('btn-challenge-hint').addEventListener('click', showHint);
    document.getElementById('btn-challenge-reveal').addEventListener('click', revealAll);
    document.getElementById('btn-challenge-reset').addEventListener('click', () => {
        buildChallengeGrid();
        document.getElementById('challenge-score').innerText = `0 / 20 (0%)`;
        document.getElementById('challenge-feedback-box').style.display = 'none';
        showToast("Challenge table reset.");
    });

    buildChallengeGrid();
}

/* ==========================================================================
   4. COMPLEXITY & BENCHMARKING SIMULATOR
   ========================================================================== */
function initComplexitySimulator() {
    const nSlider = document.getElementById('sim-n-slider');
    const wSlider = document.getElementById('sim-w-slider');
    const nValDisplay = document.getElementById('sim-n-val');
    const wValDisplay = document.getElementById('sim-w-val');
    const bruteOpsDisplay = document.getElementById('sim-ops-brute');
    const dpOpsDisplay = document.getElementById('sim-ops-dp');

    function updateMetrics() {
        const n = parseInt(nSlider.value, 10);
        const w = parseInt(wSlider.value, 10);

        nValDisplay.innerText = n;
        wValDisplay.innerText = w;

        const bruteOps = Math.pow(2, n);
        bruteOpsDisplay.innerText = bruteOps.toLocaleString();

        const dpOps = n * w;
        dpOpsDisplay.innerText = dpOps.toLocaleString();
    }

    nSlider.addEventListener('input', updateMetrics);
    wSlider.addEventListener('input', updateMetrics);
    updateMetrics();

    document.getElementById('btn-run-live-bench').addEventListener('click', () => {
        const resultsEl = document.getElementById('live-bench-results');
        resultsEl.innerHTML = `<em>Running live benchmark across synthetic items...</em>`;

        setTimeout(() => {
            const testItems = [
                { w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 5 }, { w: 5, v: 6 },
                { w: 1, v: 2 }, { w: 4, v: 7 }, { w: 3, v: 5 }, { w: 2, v: 3 },
                { w: 5, v: 8 }, { w: 3, v: 4 }, { w: 4, v: 6 }, { w: 2, v: 4 },
                { w: 3, v: 5 }, { w: 1, v: 2 }, { w: 4, v: 7 }, { w: 5, v: 9 },
                { w: 2, v: 3 }, { w: 3, v: 4 }, { w: 4, v: 6 }, { w: 2, v: 5 }
            ];
            const testW = 35;

            // 1. Recursive Benchmark (bounded to 18 to prevent browser hang)
            const recN = 18;
            let recCalls = 0;
            function testRec(idx, remW) {
                recCalls++;
                if (idx < 0 || remW <= 0) return 0;
                if (testItems[idx].w > remW) return testRec(idx - 1, remW);
                return Math.max(testRec(idx - 1, remW), testItems[idx].v + testRec(idx - 1, remW - testItems[idx].w));
            }

            const t0 = performance.now();
            const recAns = testRec(recN - 1, testW);
            const t1 = performance.now();
            const recDuration = (t1 - t0).toFixed(2);

            // 2. DP Tabulation Benchmark
            const t2 = performance.now();
            const dp = Array.from({ length: 21 }, () => Array(testW + 1).fill(0));
            for (let i = 1; i <= 20; i++) {
                const wt = testItems[i - 1].w;
                const val = testItems[i - 1].v;
                for (let w = 0; w <= testW; w++) {
                    if (wt > w) dp[i][w] = dp[i - 1][w];
                    else dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
                }
            }
            const dpAns = dp[20][testW];
            const t3 = performance.now();
            const dpDuration = (t3 - t2).toFixed(3);

            resultsEl.innerHTML = `
                <div style="margin-bottom:0.35rem; color:var(--accent-cyan); font-weight:600;">Benchmark Execution Finished:</div>
                <div style="color:#f87171;">&bull; Naive Recursion (N=18): ${recDuration} ms | ${recCalls.toLocaleString()} calls (Result: ${recAns})</div>
                <div style="color:#34d399;">&bull; DP Tabulation (N=20): ${dpDuration} ms | 720 loop iterations (Result: ${dpAns})</div>
                <div style="margin-top:0.35rem; color:#9ca3af; font-size:0.75rem;">Summary: Dynamic Programming eliminates exponential tree recursion, delivering immediate results with zero recursion stack overhead.</div>
            `;
            showToast("Benchmark executed successfully!");
        }, 50);
    });
}

/* ==========================================================================
   4.5. FLOYD-WARSHALL SHORTEST PATHS MODULE (SIMPLE & SHORT)
   ========================================================================== */
function initFloydWarshall() {
    const nodes = [
        { id: 0, label: "V1", x: 95, y: 65 },
        { id: 1, label: "V2", x: 355, y: 65 },
        { id: 2, label: "V3", x: 355, y: 185 },
        { id: 3, label: "V4", x: 95, y: 185 }
    ];

    const edges = [
        { from: 0, to: 1, weight: 3, d: "M 115 54 Q 225 30 335 54", tx: 225, ty: 33 },
        { from: 1, to: 0, weight: 8, d: "M 335 76 Q 225 100 115 76", tx: 225, ty: 97 },
        { from: 1, to: 2, weight: 2, d: "M 355 85 L 355 165", tx: 375, ty: 125 },
        { from: 2, to: 3, weight: 1, d: "M 335 185 L 115 185", tx: 225, ty: 204 },
        { from: 3, to: 0, weight: 2, d: "M 85 165 Q 60 125 85 85", tx: 55, ty: 125 },
        { from: 0, to: 3, weight: 7, d: "M 105 85 Q 130 125 105 165", tx: 135, ty: 125 },
        { from: 2, to: 0, weight: 5, d: "M 338 172 Q 225 130 112 78", tx: 225, ty: 138 }
    ];

    const floydSteps = [
        {
            k: 0,
            badge: "Base Graph (k = 0)",
            matrix: [
                [0, 3, "∞", 7],
                [8, 0, 2, "∞"],
                [5, "∞", 0, 1],
                [2, "∞", "∞", 0]
            ],
            updatedCells: [],
            explainer: "<strong>Base Distance Matrix D<sup>(0)</sup>:</strong> Directly initialized from graph adjacency weights. If no directed edge connects vertices <em>i</em> and <em>j</em>, distance is &infin; (Infinity). Diagonal values are 0."
        },
        {
            k: 1,
            badge: "Pivot: Vertex 1 (k = 1)",
            matrix: [
                [0, 3, "∞", 7],
                [8, 0, 2, 15],
                [5, 8, 0, 1],
                [2, 5, "∞", 0]
            ],
            updatedCells: [[1, 3], [2, 1], [3, 1]],
            explainer: "<strong>Allowing intermediate Vertex 1:</strong><br>&bull; D[2][4] = min(&infin;, D[2][1] + D[1][4] = 8 + 7) = <strong>15</strong><br>&bull; D[3][2] = min(&infin;, D[3][1] + D[1][2] = 5 + 3) = <strong>8</strong><br>&bull; D[4][2] = min(&infin;, D[4][1] + D[1][2] = 2 + 3) = <strong>5</strong>"
        },
        {
            k: 2,
            badge: "Pivot: Vertex 2 (k = 2)",
            matrix: [
                [0, 3, 5, 7],
                [8, 0, 2, 15],
                [5, 8, 0, 1],
                [2, 5, 7, 0]
            ],
            updatedCells: [[0, 2], [3, 2]],
            explainer: "<strong>Allowing intermediate Vertex 2:</strong><br>&bull; D[1][3] = min(&infin;, D[1][2] + D[2][3] = 3 + 2) = <strong>5</strong><br>&bull; D[4][3] = min(&infin;, D[4][2] + D[2][3] = 5 + 2) = <strong>7</strong>"
        },
        {
            k: 3,
            badge: "Pivot: Vertex 3 (k = 3)",
            matrix: [
                [0, 3, 5, 6],
                [7, 0, 2, 3],
                [5, 8, 0, 1],
                [2, 5, 7, 0]
            ],
            updatedCells: [[0, 3], [1, 3], [1, 0]],
            explainer: "<strong>Allowing intermediate Vertex 3:</strong><br>&bull; D[1][4] = min(7, D[1][3] + D[3][4] = 5 + 1) = <strong>6</strong><br>&bull; D[2][4] = min(15, D[2][3] + D[3][4] = 2 + 1) = <strong>3</strong><br>&bull; D[2][1] = min(8, D[2][3] + D[3][1] = 2 + 5) = <strong>7</strong>"
        },
        {
            k: 4,
            badge: "Final: Vertex 4 (k = 4 - All-Pairs)",
            matrix: [
                [0, 3, 5, 6],
                [5, 0, 2, 3],
                [3, 6, 0, 1],
                [2, 5, 7, 0]
            ],
            updatedCells: [[2, 0], [2, 1], [1, 0]],
            explainer: "<strong>Allowing intermediate Vertex 4 (Final All-Pairs Matrix D<sup>(4)</sup>):</strong><br>&bull; D[3][1] = min(5, D[3][4] + D[4][1] = 1 + 2) = <strong>3</strong><br>&bull; D[3][2] = min(8, D[3][4] + D[4][2] = 1 + 5) = <strong>6</strong><br>&bull; D[2][1] = min(7, D[2][4] + D[4][1] = 3 + 2) = <strong>5</strong><br><span style='color:var(--accent-emerald); font-weight:600;'>&check; All shortest paths computed in O(V&sup3;) = 64 operations!</span>"
        }
    ];

    const shortestPaths = {
        "0-0": { cost: 0, path: [0] },
        "0-1": { cost: 3, path: [0, 1] },
        "0-2": { cost: 5, path: [0, 1, 2] },
        "0-3": { cost: 6, path: [0, 1, 2, 3] },
        "1-0": { cost: 5, path: [1, 2, 3, 0] },
        "1-1": { cost: 0, path: [1] },
        "1-2": { cost: 2, path: [1, 2] },
        "1-3": { cost: 3, path: [1, 2, 3] },
        "2-0": { cost: 3, path: [2, 3, 0] },
        "2-1": { cost: 6, path: [2, 3, 0, 1] },
        "2-2": { cost: 0, path: [2] },
        "2-3": { cost: 1, path: [2, 3] },
        "3-0": { cost: 2, path: [3, 0] },
        "3-1": { cost: 5, path: [3, 0, 1] },
        "3-2": { cost: 7, path: [3, 0, 1, 2] },
        "3-3": { cost: 0, path: [3] }
    };

    let currentStep = 0;

    function drawSVG() {
        const svg = document.getElementById('floyd-graph-svg');
        if (!svg) return;

        const defs = svg.querySelector('defs');
        svg.innerHTML = '';
        if (defs) svg.appendChild(defs);

        const edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        edgesG.id = 'floyd-edges-g';

        edges.forEach(e => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', e.d);
            path.setAttribute('class', 'floyd-edge-path');
            path.setAttribute('id', `floyd-edge-${e.from}-${e.to}`);
            path.setAttribute('marker-end', 'url(#arrow)');
            edgesG.appendChild(path);

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', e.tx - 11);
            rect.setAttribute('y', e.ty - 9);
            rect.setAttribute('width', 22);
            rect.setAttribute('height', 18);
            rect.setAttribute('class', 'floyd-weight-bg');
            edgesG.appendChild(rect);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', e.tx);
            text.setAttribute('y', e.ty);
            text.setAttribute('class', 'floyd-weight-text');
            text.setAttribute('id', `floyd-weight-${e.from}-${e.to}`);
            text.textContent = e.weight;
            edgesG.appendChild(text);
        });
        svg.appendChild(edgesG);

        const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodesG.id = 'floyd-nodes-g';

        nodes.forEach(n => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('transform', `translate(${n.x}, ${n.y})`);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', 20);
            circle.setAttribute('class', 'floyd-node-circle');
            circle.setAttribute('id', `floyd-node-circle-${n.id}`);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'floyd-node-text');
            text.textContent = n.label;

            g.appendChild(circle);
            g.appendChild(text);
            nodesG.appendChild(g);
        });
        svg.appendChild(nodesG);
    }

    function updateHighlights(pivotK, activePath) {
        nodes.forEach(n => {
            const circle = document.getElementById(`floyd-node-circle-${n.id}`);
            if (circle) {
                circle.classList.remove('active', 'pivot');
                if (pivotK && n.id === pivotK - 1) circle.classList.add('pivot');
            }
        });

        edges.forEach(e => {
            const path = document.getElementById(`floyd-edge-${e.from}-${e.to}`);
            const weight = document.getElementById(`floyd-weight-${e.from}-${e.to}`);
            if (path) {
                path.classList.remove('active');
                path.setAttribute('marker-end', 'url(#arrow)');
            }
            if (weight) weight.classList.remove('active');
        });

        if (activePath && activePath.length > 0) {
            activePath.forEach(nId => {
                const circle = document.getElementById(`floyd-node-circle-${nId}`);
                if (circle) circle.classList.add('active');
            });

            for (let i = 0; i < activePath.length - 1; i++) {
                const u = activePath[i];
                const v = activePath[i + 1];
                const path = document.getElementById(`floyd-edge-${u}-${v}`);
                const weight = document.getElementById(`floyd-weight-${u}-${v}`);
                if (path) {
                    path.classList.add('active');
                    path.setAttribute('marker-end', 'url(#arrow-active)');
                }
                if (weight) weight.classList.add('active');
            }
        }
    }

    function renderTable(stepIdx, queryCell = null) {
        const step = floydSteps[stepIdx];
        const table = document.getElementById('floyd-table');
        if (!table) return;

        let html = `<thead><tr><th style="background:rgba(15,23,42,0.8); color:var(--text-muted);">i \\ j</th>`;
        for (let j = 0; j < 4; j++) {
            html += `<th>V${j + 1}</th>`;
        }
        html += `</tr></thead><tbody>`;

        for (let i = 0; i < 4; i++) {
            html += `<tr><th style="color:var(--accent-cyan);">V${i + 1}</th>`;
            for (let j = 0; j < 4; j++) {
                const isUpdated = step.updatedCells.some(([r, c]) => r === i && c === j);
                const isQuery = queryCell && queryCell.src === i && queryCell.dst === j;
                let classes = [];
                if (isUpdated) classes.push('updated-cell');
                if (isQuery) classes.push('selected-query');

                const val = step.matrix[i][j];
                const disp = (val === "∞") ? "&infin;" : val;
                html += `<td class="${classes.join(' ')}">${disp}</td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody>`;
        table.innerHTML = html;

        const badge = document.getElementById('floyd-k-badge');
        if (badge) badge.innerText = step.badge;

        const explainer = document.getElementById('floyd-step-explainer');
        if (explainer) explainer.innerHTML = step.explainer;

        updateHighlights(step.k, null);
    }

    function queryPath(src, dst) {
        const key = `${src}-${dst}`;
        const res = shortestPaths[key];
        const display = document.getElementById('path-result-display');
        if (!res) {
            if (display) display.innerHTML = `No path between Node ${src + 1} and Node ${dst + 1}`;
            return;
        }

        const pathStr = res.path.map(n => `Node ${n + 1}`).join(' &rarr; ');
        if (display) {
            display.innerHTML = `Shortest Path: <strong>${pathStr}</strong> &bull; Total Cost = <strong>${res.cost}</strong>`;
        }

        currentStep = 4;
        renderTable(4, { src, dst });
        updateHighlights(null, res.path);
    }

    // Attach Stepper Listeners
    document.getElementById('btn-floyd-prev')?.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderTable(currentStep);
            const disp = document.getElementById('path-result-display');
            if (disp) disp.innerHTML = '';
        }
    });

    document.getElementById('btn-floyd-next')?.addEventListener('click', () => {
        if (currentStep < floydSteps.length - 1) {
            currentStep++;
            renderTable(currentStep);
            const disp = document.getElementById('path-result-display');
            if (disp) disp.innerHTML = '';
        }
    });

    // Attach Query Listener
    document.getElementById('btn-find-path')?.addEventListener('click', () => {
        const src = parseInt(document.getElementById('path-src').value, 10);
        const dst = parseInt(document.getElementById('path-dst').value, 10);
        queryPath(src, dst);
    });

    // Initialize View
    drawSVG();
    renderTable(0);
}

/* ==========================================================================
   5. C SOURCE CODE VIEWER (6 TABS)
   ========================================================================== */
function initCodeViewer() {
    const tabBtns = document.querySelectorAll('.code-tab-btn');
    const tabs = {
        'tab-full': document.getElementById('tab-full'),
        'tab-rec': document.getElementById('tab-rec'),
        'tab-memo': document.getElementById('tab-memo'),
        'tab-tab': document.getElementById('tab-tab'),
        'tab-opt': document.getElementById('tab-opt'),
        'tab-floyd': document.getElementById('tab-floyd')
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.dataset.tab;
            Object.keys(tabs).forEach(k => {
                if (tabs[k]) tabs[k].style.display = (k === targetTab) ? 'block' : 'none';
            });
        });
    });

    document.getElementById('btn-copy-code').addEventListener('click', () => {
        const activeBtn = document.querySelector('.code-tab-btn.active');
        const activeTab = tabs[activeBtn.dataset.tab];
        if (activeTab) {
            navigator.clipboard.writeText(activeTab.innerText).then(() => {
                showToast("C source code copied to clipboard!");
            });
        }
    });
}

/* ==========================================================================
   6. FULLSCREEN PRESENTATION DECK (8 SLIDES)
   ========================================================================== */
function initPresentationDeck() {
    const overlay = document.getElementById('presentation-overlay');
    const slideCard = document.getElementById('active-slide-card');
    const slideCounter = document.getElementById('pres-slide-counter');

    let currentSlide = 0;
    let showNotes = false;

    const slides = [
        // Slide 1
        {
            student: "Group 12 &bull; College Project Presentation",
            title: "Dynamic Programming Optimization Toolkit",
            points: [
                "<strong>Submitted by Group 12:</strong>",
                "• <strong>A. PAVAN KUMAR</strong> (Reg No: AP25110100011) — Student 1: Problem Formulation",
                "• <strong>SATHWIK. M</strong> (Reg No: AP25110100015) — Student 2: DP Table Construction",
                "• <strong>B. JITHENDRA</strong> (Reg No: AP25110100026) — Student 3: Subproblem Reuse & Backtracking",
                "• <strong>DARSI BHARANI</strong> (Reg No: AP25110100027) — Student 4: Complexity Analysis & Space Optimization",
                "Demonstration: 0/1 Knapsack Problem — Table Construction, Manual Verification, and Pure C Implementation."
            ],
            notes: "Welcome respected faculty and fellow students. Today, Group 12 presents our DAA project: Dynamic Programming Optimization Toolkit. The team includes A. Pavan Kumar, Sathwik. M, B. Jithendra, and Darsi Bharani. Each member will demonstrate their allotted role."
        },
        // Slide 2
        {
            student: "Core Algorithmic Foundations",
            title: "Principles of Dynamic Programming",
            points: [
                "Formulated by Richard Bellman in 1957; rooted in the Principle of Optimality.",
                "Two Required Conditions: Overlapping Subproblems and Optimal Substructure.",
                "Overlapping Subproblems: Evaluates the exact same state repeatedly in naive recursion.",
                "Optimal Substructure: The optimal solution to the overall problem is composed of optimal solutions to its subproblems.",
                "Eliminates exponential redundancies by caching results in a table for instant O(1) lookups."
            ],
            notes: "Before diving into Knapsack, we highlight Bellman's principle: whenever a problem contains overlapping subproblems and optimal substructure, dynamic programming allows us to cache subproblem answers and avoid repeating work."
        },
        // Slide 3
        {
            student: "Student 1: A. PAVAN KUMAR (Reg No: AP25110100011)",
            title: "0/1 Knapsack Problem Formulation",
            points: [
                "Problem Definition: Maximize total value $\\sum v_i x_i$ subject to capacity $\\sum w_i x_i \\le W$, where $x_i \\in \\{0, 1\\}$.",
                "Why 0/1: Items are indivisible; each item is either taken once or left behind. Fractional parts are prohibited.",
                "Why Greedy Fails: Picking by highest value/weight ratio leaves unused capacity that cannot fit better item combinations.",
                "State Representation: $DP[i][w]$ is the maximum profit achievable using the first $i$ items with capacity $w$.",
                "Recurrence: If $wt[i] > w$, then $DP[i][w] = DP[i-1][w]$. Otherwise, $DP[i][w] = \\max(DP[i-1][w], DP[i-1][w-wt[i]] + val[i])$."
            ],
            notes: "A. Pavan Kumar presenting: I formulated the 0/1 Knapsack recurrence. In 0/1 Knapsack, greedy sorting by ratio fails because it can leave awkward empty space. Our DP state systematically evaluates both choices: excluding the item vs including it."
        },
        // Slide 4
        {
            student: "Student 2: SATHWIK. M (Reg No: AP25110100015)",
            title: "2D DP Table Construction Walkthrough",
            points: [
                "Constructs a 2D matrix of size $(N + 1) \\times (W + 1)$.",
                "Base row $i = 0$ is 0 (0 items available); base column $w = 0$ is 0 (0 capacity available).",
                "Dataset Walkthrough: Items with weights {2, 3, 4, 5} and values {3, 4, 5, 6} under capacity $W = 5$.",
                "For cell $DP[2][5]$: Exclude gives $DP[1][5] = 3$; Include gives $DP[1][5-3] + 4 = 3 + 4 = 7$. Optimal value is $\\max(3, 7) = 7$.",
                "Final cell $DP[4][5] = 7$ yields the global optimal value."
            ],
            notes: "Sathwik. M presenting: Here we demonstrate how the 2D table is built row by row. At each cell, we look up the cell directly above (excluding) and the offset cell to the left (including). Reusing these cached subproblems is what makes DP so fast."
        },
        // Slide 5
        {
            student: "Student 2: SATHWIK. M (Reg No: AP25110100015)",
            title: "The DP Table Challenge (Manual Table Construction)",
            points: [
                "Allotment Task: Solve a 0/1 Knapsack instance manually by filling the DP table and explain reuse of previously computed solutions.",
                "Step 1: Check if item fits ($wt[i] \\le w$). If NO, copy from cell directly above: $DP[i][w] = DP[i-1][w]$.",
                "Step 2: If YES, compare Exclude ($DP[i-1][w]$) vs Include ($val[i] + DP[i-1][w - wt[i]]$). Take the maximum.",
                "Key Principle: Proves that every cell is derived strictly from existing cached subproblems in row $i-1$."
            ],
            notes: "Sathwik. M presenting: To satisfy our project challenge, we demonstrated how anyone can manually compute the table using these two simple rules. If the item doesn't fit, copy from above. If it fits, compare above with offset cell plus value."
        },
        // Slide 6
        {
            student: "Student 3: B. JITHENDRA (Reg No: AP25110100026)",
            title: "Subproblem Reuse & Backtracking Item Trace",
            points: [
                "Subproblem Reuse: Row 1 stores solutions for 1 item; Row 2 reuses Row 1 for 2 items; Row 3 reuses Row 2, etc.",
                "Backtracking Algorithm: Starts at $DP[4][5] = 7$ and moves backwards towards row 0.",
                "Condition: If $DP[i][w] \\ne DP[i-1][w]$, item $i$ was included; subtract $w_i$ from remaining capacity.",
                "Trace: $DP[4][5] == DP[3][5]$ (Item 4 excluded); $DP[3][5] == DP[2][5]$ (Item 3 excluded); $DP[2][5] \\ne DP[1][5]$ (Item 2 chosen!); $DP[1][2] \\ne DP[0][2]$ (Item 1 chosen!).",
                "Result: Chosen Items = {Item 1, Item 2}. Total Weight = 2 + 3 = 5 / 5 (100% capacity), Total Value = 3 + 4 = 7."
            ],
            notes: "B. Jithendra presenting: I focused on subproblem reuse and backtracking. By tracing differences between adjacent rows from DP[4][5] backwards, we discover the exact items chosen: Item 1 and Item 2, utilizing 100% of capacity."
        },
        // Slide 7
        {
            student: "Student 3: B. JITHENDRA (Reg No: AP25110100026)",
            title: "Second DP Application: Floyd-Warshall All-Pairs Shortest Path",
            points: [
                "Syllabus Requirement: Demonstrate another DP application from syllabus (Graph Shortest Paths).",
                "Problem Definition: Finds the shortest paths between all pairs of $V$ vertices in a directed, weighted graph.",
                "DP Principle: Subproblems indexed by intermediate vertex $k \\in \\{1, 2, \\dots, V\\}$.",
                "State Recurrence: $D^{(k)}[i][j] = \\min( D^{(k-1)}[i][j], D^{(k-1)}[i][k] + D^{(k-1)}[k][j] )$.",
                "Efficiency: Runs in $O(V^3)$ polynomial time using 3 nested loops, replacing $V$ separate runs of Dijkstra.",
                "Backtracking & Path Recovery: Uses predecessor matrix $nextNode[i][j]$ for $O(V)$ route reconstruction."
            ],
            notes: "B. Jithendra presenting: In line with our syllabus requirements for Student 3, I also implemented the Floyd-Warshall algorithm. It applies dynamic programming to graph theory. In O(V^3) time, it checks whether routing through intermediate vertex k yields a shorter path between every pair (i, j)."
        },
        // Slide 8
        {
            student: "Student 4: DARSI BHARANI (Reg No: AP25110100027)",
            title: "Asymptotic Complexity & Empirical Benchmarks",
            points: [
                "Brute Force Recursion: $O(2^N)$ time complexity. For $N = 30$, $2^{30} > 1$ billion function calls.",
                "Dynamic Programming: $O(N \\cdot W)$ polynomial time complexity. For $N = 30, W = 50$, $N \\cdot W = 1,500$ operations.",
                "Speedup: Over $700,000\\times$ faster than brute force on moderate inputs.",
                "Live JavaScript benchmark confirms: Recursion takes significant time and hits recursion depth limits, while DP executes in under 1 millisecond."
            ],
            notes: "Darsi Bharani presenting: I conducted the complexity and benchmark analysis. At N=30, naive recursion explodes exponentially to over a billion calls, while our DP approach executes in a fraction of a millisecond."
        },
        // Slide 9
        {
            student: "Student 4: DARSI BHARANI (Reg No: AP25110100027)",
            title: "Space Optimization: $O(N \\cdot W) \\to O(W)$ & Pure C Engine",
            points: [
                "Key Insight: Any row $DP[i][w]$ depends only on the immediately preceding row $DP[i-1][\\dots]$.",
                "Optimization: Compress the 2D matrix into a single 1D array of size $(W + 1)$.",
                "Crucial Traversal Direction: Iterate capacity $w$ backwards from $W$ down to $wt[i]$.",
                "Traversing backwards ensures no item is counted multiple times, preserving the 0/1 constraint.",
                "Reduces memory footprint by up to $80\\% - 95\\%$ while maintaining the same optimal answer."
            ],
            notes: "Finally, we proved space optimization: since we only need the prior row, we compress the table into a single 1D array. By traversing backwards, we strictly maintain the 0/1 condition and slash memory consumption from O(N * W) down to O(W). Thank you!"
        }
    ];

    function renderSlide(idx) {
        if (idx < 0 || idx >= slides.length) return;
        currentSlide = idx;

        const slide = slides[idx];
        slideCounter.innerText = `Slide ${idx + 1} / ${slides.length}`;

        const pointsHTML = slide.points.map(pt => `<li>${pt}</li>`).join('');
        const notesHTML = `
            <div class="speaker-notes-box" style="display: ${showNotes ? 'block' : 'none'};">
                <strong>Speaker Talking Notes:</strong><br>${slide.notes}
            </div>
        `;

        slideCard.innerHTML = `
            <div class="slide-speaker-badge">
                <span class="badge badge-cyan">${slide.student}</span>
            </div>
            <h2 class="slide-heading">${slide.title}</h2>
            <ul class="slide-points-list">
                ${pointsHTML}
            </ul>
            ${notesHTML}
        `;

        document.getElementById('btn-pres-prev').disabled = (idx === 0);
        document.getElementById('btn-pres-next').disabled = (idx === slides.length - 1);
    }

    function openPresentation() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderSlide(currentSlide);
    }

    function closePresentation() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('btn-toggle-presentation').addEventListener('click', openPresentation);
    document.getElementById('btn-close-presentation').addEventListener('click', closePresentation);

    document.getElementById('btn-pres-prev').addEventListener('click', () => {
        if (currentSlide > 0) renderSlide(currentSlide - 1);
    });

    document.getElementById('btn-pres-next').addEventListener('click', () => {
        if (currentSlide < slides.length - 1) renderSlide(currentSlide + 1);
    });

    document.getElementById('btn-toggle-notes').addEventListener('click', () => {
        showNotes = !showNotes;
        const box = document.querySelector('.speaker-notes-box');
        if (box) box.style.display = showNotes ? 'block' : 'none';
        showToast(showNotes ? "Speaker notes shown" : "Speaker notes hidden");
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            if (!overlay.classList.contains('active')) openPresentation();
            else closePresentation();
        } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePresentation();
        } else if (overlay.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                if (currentSlide < slides.length - 1) renderSlide(currentSlide + 1);
            } else if (e.key === 'ArrowLeft') {
                if (currentSlide > 0) renderSlide(currentSlide - 1);
            } else if (e.key === 'n' || e.key === 'N') {
                showNotes = !showNotes;
                const box = document.querySelector('.speaker-notes-box');
                if (box) box.style.display = showNotes ? 'block' : 'none';
            }
        }
    });
}

/* ==========================================================================
   7. SMOOTH NAVIGATION
   ========================================================================== */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 100;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}
