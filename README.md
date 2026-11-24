# Dynamic Programming Optimization Toolkit

**DAA College Capstone Project &bull; Group 12**  
*Course:* Design and Analysis of Algorithms (DAA)  
*Primary Demonstration:* 0/1 Knapsack Problem Optimization  
*Secondary Demonstration:* All-Pairs Shortest Path (Floyd-Warshall)  
*Implementation Language:* Pure ANSI C  

---

## Quick Start

1. Open **`index.html`** in any modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox).
   * **Zero installation / No web server required:** Double-click `index.html` directly from your desktop.
2. Press **`P`** at any time to launch the **Fullscreen Presentation Slide Deck** (9 slides).
3. Press **`N`** while in presentation mode to toggle **Speaker Talking Notes** for each student.

---

## Group 12 Project Allotment & Role Breakdown

As per the college evaluation rubrics:

| Student | Assigned Role & Deliverables | Features Demonstrated in Toolkit |
|---|---|---|
| **A. PAVAN KUMAR**<br>`AP25110100011` | **Student 1: Formulate 0/1 Knapsack Problem** | Mathematical recurrence, boundary conditions, why greedy fails, and naive recursion in C. |
| **SATHWIK. M**<br>`AP25110100015` | **Student 2: Demonstrate DP Table Construction** | Interactive 2D matrix visualizer, row-by-row state construction, cell dependency highlights, and the **Manual DP Table Challenge**. |
| **B. JITHENDRA**<br>`AP25110100026` | **Student 3: Explain Subproblem Reuse & Shortest Paths** | Visualizing how cached cells eliminate redundant branches, backtracking item recovery trace ({Item 1, Item 2}), and **All-Pairs Shortest Path (Floyd-Warshall)** visualizer. |
| **DARSI BHARANI**<br>`AP25110100027` | **Student 4: Complexity Analysis & Space Optimization** | $O(2^N) \to O(N \cdot W)$ operations proof, 1D array space compression ($O(W)$), empirical benchmarks, and Pure C engine integration. |

---

## Sample Dataset Walkthrough (0/1 Knapsack)

* **Knapsack Capacity ($W$):** 5  
* **Available Items:**
  * **Item 1:** Weight = 2, Value = 3 (Ratio: 1.50)
  * **Item 2:** Weight = 3, Value = 4 (Ratio: 1.33)
  * **Item 3:** Weight = 4, Value = 5 (Ratio: 1.25)
  * **Item 4:** Weight = 5, Value = 6 (Ratio: 1.20)

### Mathematical Recurrence:
$$DP[i][w] = \begin{cases} 
DP[i-1][w] & \text{if } wt[i] > w \\ 
\max(DP[i-1][w], \; DP[i-1][w - wt[i]] + val[i]) & \text{otherwise} 
\end{cases}$$

### Complete DP Table ($5 \times 6$):
| Items $\backslash$ W | w = 0 | w = 1 | w = 2 | w = 3 | w = 4 | w = 5 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **0 (None)** | 0 | 0 | 0 | 0 | 0 | 0 |
| **Item 1 (w:2, v:3)** | 0 | 0 | 3 | 3 | 3 | 3 |
| **Item 2 (w:3, v:4)** | 0 | 0 | 3 | 4 | 4 | **7** |
| **Item 3 (w:4, v:5)** | 0 | 0 | 3 | 4 | 5 | **7** |
| **Item 4 (w:5, v:6)** | 0 | 0 | 3 | 4 | 5 | **7** |

* **Optimal Profit:** **7**
* **Optimal Selection:** **Item 1 (Weight 2) + Item 2 (Weight 3)** (Total Weight = 5 / 5)

---

## Secondary Demonstration: Floyd-Warshall (Graph DP)

* **Vertices:** 4 ($V = 4$)
* **Time Complexity:** $O(V^3)$
* **Space Complexity:** $O(V^2)$
* **DP Recurrence:**
  $$D^{(k)}[i][j] = \min\left( D^{(k-1)}[i][j],\; D^{(k-1)}[i][k] + D^{(k-1)}[k][j] \right)$$
* **Interactive Tool:** Live matrix stepper through intermediate pivots $k = 0 \dots 4$ with SVG directed graph and instant path query tool!

---

## Compiling & Running the C Source Code

The ANSI C programs are self-contained and compile with any standard C compiler:

### 1. 0/1 Knapsack (`knapsack.c`):
```bash
gcc -O2 knapsack.c -o knapsack
./knapsack
```

### 2. Floyd-Warshall (`floyd_warshall.c`):
```bash
gcc -O2 floyd_warshall.c -o floyd_warshall
./floyd_warshall
```

---

## Presentation Keyboard Shortcuts

| Shortcut Key | Action |
|---|---|
| **`P`** | Toggle Fullscreen Presentation Slides |
| **`N`** | Toggle Speaker Talking Points / Notes |
| **`&rarr;` / `Space`** | Next Slide |
| **`&larr;`** | Previous Slide |
| **`Esc`** | Exit Presentation Mode |
| **`Ctrl + P`** | Print / Save Clean PDF Report Handout |
