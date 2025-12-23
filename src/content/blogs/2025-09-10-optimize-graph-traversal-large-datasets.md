---
id: 3
slug: optimize-graph-traversal-large-datasets
category: ALGORITHMS
date: 2025-09-10
title: Optimizing Graph Traversal for Large Datasets
preview: 在处理数百万节点时，传统的 DFS/BFS 已经不够用了。看看这些高级优化技巧。
tags:
  - CS
  - MATH
---

大规模图遍历里，最贵的往往不是算法复杂度，而是“内存访问模式”。缓存不命中、随机访问、以及分支预测失败，会把理想的 \(O(E)\) 变成现实里的慢动作。

几个实战技巧：

1. 把邻接表变成紧凑的 CSR（Compressed Sparse Row）结构，顺序扫描更友好  
2. 访问位图用 bitset/roaring bitmap，减少内存占用和 cache miss  
3. 分层/分块：把高频子图提到更热的内存区域  
4. 如果是最短路，先问自己：真的需要 Dijkstra 吗？能不能 A\* / 双向 / 多源 / 近似？  

优化的第一步永远是：把 profiler 打开。


