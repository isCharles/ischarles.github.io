---
id: 1
slug: react-server-components-love-story
category: ENGINEERING
date: 2025-11-19
title: React Server Components: A Love Story
preview: 深入解析 RSC 架构，探讨为什么它是前端开发的未来，以及如何避免常见的陷阱。
tags:
  - REACT
  - PERFORMANCE
---

我以前把“服务端渲染”当成一个开关：要么 SSR，要么 CSR。RSC 把这个二选一拆成了“组件级别”的连续谱：同一棵树里，有些节点在服务器执行，有些节点在客户端交互。

真正的收益不是“更快一点”，而是把数据获取的拓扑结构变得更可控：让“靠近数据”的组件自然留在服务器，让“靠近交互”的组件自然留在客户端。

我最喜欢的一点是：你终于可以把“请求-拼装-返回”做成一种声明式的组合，而不是在客户端到处写 loading / error / race handling。

当然也有坑：边界不清会导致瀑布、序列化失败、以及难以调试的缓存一致性问题。我的原则是：先明确数据依赖图，再决定组件归属。


