#include <iostream>
#include <vector>
#include <iomanip>

using namespace std;

/**
 * Dynamic Programming Optimization Toolkit
 * Problem: All-Pairs Shortest Path (Floyd-Warshall Algorithm)
 * 
 * DP Formulation:
 * State: D[k][i][j] = Shortest distance from node i to node j using intermediate nodes from {1, 2, ..., k}
 * Recurrence:
 *   D[k][i][j] = min( D[k-1][i][j], D[k-1][i][k] + D[k-1][k][j] )
 * Base Case:
 *   D[0][i][j] = weight of direct edge (i -> j) if exists, 0 if i == j, else INF
 * 
 * Complexity:
 *   Time:  O(V^3)
 *   Space: O(V^2)
 */

const int INF = 1e9; // Represents infinity (no direct path)

void printMatrix(const vector<vector<int>>& dist, int V, const string& title) {
    cout << "\n--- " << title << " ---\n     ";
    for (int j = 0; j < V; j++) cout << setw(6) << ("V" + to_string(j + 1));
    cout << "\n   " << string(6 * V + 2, '-') << "\n";

    for (int i = 0; i < V; i++) {
        cout << "V" << (i + 1) << " |";
        for (int j = 0; j < V; j++) {
            if (dist[i][j] >= INF / 2) {
                cout << setw(6) << "INF";
            } else {
                cout << setw(6) << dist[i][j];
            }
        }
        cout << "\n";
    }
}

int main() {
    cout << "========================================================\n";
    cout << " DYNAMIC PROGRAMMING OPTIMIZATION TOOLKIT (C++ ENGINE)   \n";
    cout << " Floyd-Warshall: All-Pairs Shortest Path Demonstration  \n";
    cout << "========================================================\n";

    // 4-Node Directed Weighted Graph
    // V = 4
    int V = 4;
    vector<vector<int>> dist = {
        {0,   3,   INF, 7  },
        {8,   0,   2,   INF},
        {5,   INF, 0,   1  },
        {2,   INF, INF, 0  }
    };

    printMatrix(dist, V, "Initial Adjacency Matrix D^(0)");

    // Intermediate predecessor matrix for path reconstruction
    vector<vector<int>> nextNode(V, vector<int>(V, -1));
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            if (i != j && dist[i][j] < INF) nextNode[i][j] = j;
        }
    }

    // Dynamic Programming Step: Iterate over all possible intermediate nodes k
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                // If path through intermediate node k is shorter
                if (dist[i][k] < INF && dist[k][j] < INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        nextNode[i][j] = nextNode[i][k];
                    }
                }
            }
        }
        printMatrix(dist, V, "Matrix after allowing intermediate node V" + to_string(k + 1) + " [k=" + to_string(k + 1) + "]");
    }

    cout << "\n========================================================\n";
    cout << " ALL-PAIRS SHORTEST PATHS COMPUTED SUCCESSFULLY!        \n";
    cout << "========================================================\n";

    // Display sample shortest paths
    cout << "\nSample Path Lookups:\n";
    auto reconstructPath = [&](int u, int v) {
        if (dist[u][v] >= INF) return;
        cout << "Shortest Path from V" << (u + 1) << " to V" << (v + 1) << " (Distance = " << dist[u][v] << "): V" << (u + 1);
        int curr = u;
        while (curr != v) {
            curr = nextNode[curr][v];
            cout << " -> V" << (curr + 1);
        }
        cout << "\n";
    };

    reconstructPath(0, 2); // V1 -> V3: V1 -> V2 -> V3 (3 + 2 = 5)
    reconstructPath(1, 3); // V2 -> V4: V2 -> V3 -> V4 (2 + 1 = 3)
    reconstructPath(3, 1); // V4 -> V2: V4 -> V1 -> V2 (2 + 3 = 5)

    return 0;
}

