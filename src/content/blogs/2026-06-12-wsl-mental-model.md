---
id: 10
slug: wsl-mental-model
category: DEBUG
date: 2025-07-11
title: WSL 给我的最大教训：先搞清楚自己在哪
preview: WSL 很方便，但也很容易让人忘记自己到底是在 Windows、Linux，还是 Docker 的网络里。
tags:
  - WSL
  - Windows
  - DevEnv
---

WSL 对我来说是一个很实用的工具，但它也制造过不少混乱。

最大的问题不是命令不会用，而是我经常忘记“当前这个命令到底在哪个世界执行”。PowerShell、WSL shell、Docker container，它们看起来都在同一台电脑上，但文件路径、网络、进程和环境变量都不完全一样。

比如：

- Windows 的 `E:\Projects` 和 WSL 的 `/mnt/e/Projects`
- Windows 的 Redis 和 WSL 的 Redis
- Docker Desktop 管理的容器网络
- IDEA 在 Windows 跑，后端却连 WSL 里的服务

这些组合一多，问题就会变得很像玄学。其实不是玄学，是上下文不清楚。

我现在排查环境问题，会先问三句话：

1. 这个进程在哪里跑？
2. 它访问的 localhost 是谁？
3. 它读的配置文件是哪一份？

这三个问题比很多搜索结果都管用。
