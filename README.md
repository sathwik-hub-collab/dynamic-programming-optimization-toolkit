# dynamic-programming-optimization-toolkit
An interactive toolkit demonstrating Dynamic Programming optimization techniques, including 0/1 Knapsack, DP table construction, shortest path algorithms, and performance comparison.

# Dynamic Programming Optimization Toolkit

An interactive and educational toolkit designed to demonstrate and visualize important Dynamic Programming (DP) optimization techniques. This project is developed as part of a Design and Analysis of Algorithms (DAA) academic project.

The toolkit helps students understand how Dynamic Programming works through algorithm implementations, step-by-step explanations, DP table construction, output demonstrations, and comparisons of optimization techniques.

## Project Overview

Dynamic Programming is an algorithmic technique that solves complex problems by breaking them into smaller overlapping subproblems and storing their results to avoid repeated calculations.

The **Dynamic Programming Optimization Toolkit** demonstrates how DP can be applied to optimization problems such as the 0/1 Knapsack Problem and shortest path problems.

The project aims to make algorithm learning easier through practical examples, visual explanations, and interactive demonstrations.

## Objectives

- Understand the fundamental concepts of Dynamic Programming.
- Implement the 0/1 Knapsack Problem using Dynamic Programming.
- Demonstrate DP table construction step by step.
- Explore shortest path algorithms using Dynamic Programming.
- Compare different algorithmic approaches and their results.
- Integrate the demonstrations into one educational optimization toolkit.

## Main Modules

### 1. 0/1 Knapsack Problem

The 0/1 Knapsack Problem is an optimization problem in which a set of items has individual weights and values. The objective is to select items to maximize the total value without exceeding the capacity of the knapsack.

Each item can either be selected completely or excluded. Items cannot be divided.

**Example:**

| Item | Weight | Value |
|---|---:|---:|
| 1 | 2 | 3 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |

Knapsack capacity = 5

**Optimal result:**
- Selected items: Item 1 and Item 2
- Total weight: 5
- Maximum value: 7

**Dynamic Programming recurrence:**

- If there are no items or capacity is zero, the result is zero.
- If the current item exceeds the available capacity, exclude it.
- Otherwise, compare including and excluding the current item and select the maximum value.

Time Complexity: O(n × W)  
Space Complexity: O(n × W)

### 2. DP Table Construction

This module demonstrates how a Dynamic Programming table is created and filled.

The table stores the maximum value achievable using the first `i` items with a knapsack capacity of `w`.

For the sample Knapsack problem, the DP table is:

| Items / Capacity | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|---:|
| 0 items | 0 | 0 | 0 | 0 | 0 | 0 |
| Item 1 | 0 | 0 | 3 | 3 | 3 | 3 |
| Items 1, 2 | 0 | 0 | 3 | 4 | 4 | 7 |
| Items 1, 2, 3 | 0 | 0 | 3 | 4 | 5 | 7 |
| Items 1, 2, 3, 4 | 0 | 0 | 3 | 4 | 5 | 7 |

This module explains:
- Base case initialization.
- How rows and columns represent items and capacities.
- Include and exclude decisions.
- How each cell is calculated.
- How the final answer is obtained from the table.

### 3. Shortest Path Using Dynamic Programming

This module demonstrates the application of Dynamic Programming to shortest path problems.

The Floyd–Warshall algorithm is used to find the shortest distances between every pair of vertices in a weighted graph.

**Key concepts:**
- Graph representation using an adjacency matrix.
- Distance matrix initialization.
- Intermediate vertex selection.
- Distance updates using the Floyd–Warshall recurrence.
- Final shortest distance matrix.

**Recurrence relation:**

`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`

Time Complexity: O(V³)  
Space Complexity: O(V²)

### 4. Comparison and Toolkit Integration

This module brings the individual demonstrations together and compares their algorithmic behavior.

It includes:
- Comparison of Dynamic Programming applications.
- Time and space complexity analysis.
- Comparison of input, output, and results.
- Explanation of how Dynamic Programming improves problem-solving efficiency.
- Integration of the modules into one toolkit.

## Technologies Used

- **Programming Language:** C
- **Frontend:** HTML, CSS, JavaScript (if using a web-based interface)
- **Algorithms:** Dynamic Programming, 0/1 Knapsack, Floyd–Warshall
- **Development Tools:** Code editor and C compiler
- **Version Control:** Git and GitHub

## Suggested Project Structure

```text
dynamic-programming-optimization-toolkit/
│
├── README.md
│
├── knapsack/
│   ├── knapsack.c
│   ├── pseudocode.txt
│   └── output.txt
│
├── dp-table/
│   ├── table-example.txt
│   └── explanation.md
│
├── shortest-path/
│   ├── floyd_warshall.c
│   ├── pseudocode.txt
│   └── output.txt
│
├── comparison/
│   └── complexity-analysis.md
│
├── docs/
│   ├── project-overview.md
│   └── presentation-notes.md
│
└── assets/
    └── screenshots/
```

## How to Run

### Run the 0/1 Knapsack Program

1. Open the project folder.
2. Navigate to the `knapsack` directory.
3. Compile the C program:

```bash
gcc knapsack.c -o knapsack
```

4. Execute the program:

```bash
./knapsack
```

### Expected Output

```text
Maximum value = 7
Selected items: 2 1
```

### Run the Floyd–Warshall Program

1. Navigate to the `shortest-path` directory.
2. Compile the program:

```bash
gcc floyd_warshall.c -o floyd
```

3. Execute the program:

```bash
./floyd
```

## Learning Outcomes

After exploring this toolkit, students will be able to:

- Explain the concept and properties of Dynamic Programming.
- Identify overlapping subproblems and optimal substructure.
- Implement optimization algorithms using C.
- Construct and interpret DP tables.
- Understand shortest path calculations using Floyd–Warshall.
- Analyze time and space complexity.
- Compare algorithmic approaches and their results.

## Project Team Contributions

| Module | Contribution |
|---|---|
| Student 1 | Formulate and implement 0/1 Knapsack |
| Student 2 | Demonstrate DP table construction |
| Student 3 | Demonstrate another DP application, such as shortest paths |
| Student 4 | Compare results and integrate the DP Optimization Toolkit |

## Conclusion

The Dynamic Programming Optimization Toolkit provides a practical way to understand and demonstrate Dynamic Programming concepts. By combining algorithm implementations, DP table demonstrations, shortest path calculations, and complexity comparisons, the project makes optimization techniques easier to learn and understand.

---

**Academic Project:** Design and Analysis of Algorithms (DAA)  
**Project Title:** Dynamic Programming Optimization Toolkit
