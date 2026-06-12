---
id: 19
slug: localhost-is-a-lie
category: DEBUG
date: 2026-06-12
title: localhost 有时候是个谎言
preview: localhost 这个词太熟了，以至于我很晚才意识到：它不是一个固定地点，而是相对当前进程的位置。
tags:
  - Network
  - WSL
  - Docker
---

`localhost` 是一个很容易让人放松警惕的词。它看起来明确，其实很依赖上下文。

在浏览器里访问 localhost，通常是 Windows 宿主机。在 WSL 里访问 localhost，是 WSL 自己。在 Docker 容器里访问 localhost，就是容器内部。

这就导致一个常见误会：我明明在宿主机启动了 MySQL，容器里的应用却连不上 `localhost:3306`。原因很简单，容器里的 localhost 不是宿主机。

这个问题一旦想明白，很多配置就不再奇怪：

- 容器之间用 service name
- 宿主机访问容器靠端口映射
- WSL 和 Windows 之间要确认网络桥接方式
- 生产环境不要照搬本地 localhost 配置

我现在看到配置里的 `localhost` 会本能地问一句：这是相对于谁？

这个问题很小，但能救很多时间。

