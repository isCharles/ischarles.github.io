---
id: 13
slug: github-pages-dns-public
category: DEBUG
date: 2026-06-12
title: GitHub Pages、DNS，以及第一次把站点放到公网
preview: 域名解析这件事，文档看起来很简单，真的操作时每一步都像在等一个看不见的状态更新。
tags:
  - GitHubPages
  - DNS
  - Cloudflare
---

把个人网站挂到自己的域名上，比我想象中更有仪式感。不是因为技术多难，而是因为它第一次让我感觉“这个东西真的在公网了”。

流程大概是：买域名，改 nameserver，接 Cloudflare，配 DNS 记录，再让 GitHub Pages 识别 custom domain。

每一步单独看都不复杂，但组合起来有几个容易让人不安的地方：

- DNS 生效不是立刻的
- Cloudflare 有代理和 DNS only 的区别
- GitHub Pages 有自己的校验
- HTTPS 证书也需要一点时间

我以前对 DNS 的理解停在“域名指向 IP”。这次之后会多想一层：谁在管理解析，解析记录是什么类型，浏览器最终访问的是哪个服务。

公网部署也让我意识到一个问题：只要放出去，就要考虑权限、隐私、日志和滥用。能访问和适合公开访问，是两件事。

这个感觉很重要。它让一个本地玩具开始接近真正的服务。

