---
id: 5
slug: docker-made-redis-disappear
category: DEBUG
date: 2026-06-12
title: Docker 让我以为 Redis 数据消失了
preview: 有一次我打开 Redis，发现昨天刚重建的缓存不见了，旧数据反而回来了。最后问题不在 Redis，而在我自己没搞清楚运行环境。
tags:
  - Docker
  - Redis
  - WSL
---

这篇不是一个很高级的问题，但我觉得值得记下来。因为它暴露的不是技术难点，而是环境心智模型的问题。

我在 Windows 上跑 IDEA，在 WSL 里跑一部分服务，又用 Docker Desktop 跑另一个项目。表面上大家都说自己连的是 `127.0.0.1:6379`，但这个 `127.0.0.1` 到底是谁的本机，其实要看进程跑在哪里。

那天我看到 Redis 里的数据“不对”，第一反应是缓存丢了。后来才发现，我看到的可能根本不是同一个 Redis：

- Windows 本地可以有 Redis
- WSL 里可以有 Redis
- Docker 容器里也可以有 Redis
- Docker 还可能把容器端口映射到宿主机端口

如果端口又刚好都是 6379，人就很容易晕。

这件事之后，我开始养成几个习惯。先看进程在哪里跑，再看端口是谁占用，再看应用配置连的是哪个 host。不要一上来就怀疑数据没了，也不要一看到 `localhost` 就默认它指向自己以为的那个地方。

环境问题有时候不难，但它很会制造错觉。

