---
id: 7
slug: spring-boot-configuration
category: TECH
date: 2025-04-15
title: Spring Boot 简单，直到配置开始说话
preview: Spring Boot 的上手体验很好，但我真正开始尊重它，是从读配置开始的。
tags:
  - SpringBoot
  - Java
  - Backend
---

Spring Boot 很容易给人一种错觉：建个项目，引几个 starter，写 Controller、Service、Mapper，然后就能跑。

这当然是它好用的地方。但项目稍微复杂一点，真正决定系统行为的东西经常藏在配置里。

比如数据库连接池、JPA 的 `ddl-auto`、Redis 连接、上传文件大小、日志级别、跨域、profile、对象存储地址、第三方 API key。很多时候代码没变，配置一变，系统行为就完全不一样。

我以前看配置文件比较快，像扫一眼说明书。现在会慢一点，尤其会问几个问题：

- 这个配置有没有默认值
- 这个默认值适合开发环境还是生产环境
- 如果配置缺失，应用是启动失败还是静默降级
- 敏感信息有没有进入 Git
- Docker 里和本地跑的时候路径是不是一致

Spring Boot 的便利很大一部分来自自动配置，但自动也意味着你要知道它自动做了什么。否则出了问题，你只能看到结果，看不到原因。

我现在对“能跑起来”这句话更谨慎了。能跑起来只是第一步，知道它为什么能跑起来，才算真正开始掌握。
