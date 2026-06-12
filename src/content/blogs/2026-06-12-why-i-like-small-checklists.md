---
id: 22
slug: why-i-like-small-checklists
category: NOTES
date: 2026-06-07
title: 我开始喜欢小 checklist
preview: checklist 看起来笨，但它能减少很多“我以为我做了”的错误。
tags:
  - Workflow
  - Debug
  - Notes
---

我以前不太喜欢 checklist，觉得它像形式主义。后来发现，对于重复但容易漏的事情，它非常有效。

比如部署前：

- 构建是否通过
- 环境变量是否齐全
- 端口是否冲突
- 数据库是否初始化
- 对象存储 bucket 是否存在
- 公开访问是否需要鉴权

这些事情每一项都不难，但漏一项就会浪费很久。

debug 也一样。先看请求，再看日志，再看配置，再看依赖服务。顺序固定下来以后，大脑负担会小很多。

checklist 的价值不是证明我严谨，而是承认我会忘。工程里很多可靠性，都是建立在承认人会犯错的基础上。

这点挺朴素，但很有用。
