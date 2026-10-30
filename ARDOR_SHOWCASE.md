# Ardor 静态产品展示

访问 `/ardor/`。它是 Vite 的独立 HTML 入口，不加载个人站 React 应用、不需要登录，也不连接 Ardor API。首页项目卡片提供 PRODUCT TOUR 入口。

## 页面结构

- 首屏用一句话说明 Ardor 是什么，紧接一张真实对话界面。随后按“求职记录 → 面试复盘 → 定向学习 → Agent 执行”讲产品关系。
- 六张 2× 产品截图可点击放大；预览对话框支持“原始尺寸 / 适应窗口”切换，桌面和手机都能滚动阅读。
- 页头品牌锁定使用官方 slogan：中文“让热望，有回响。”，英文 “AI for a more capable you”，替换旧的 AI CAREER WORKSPACE 标签。
- 页面中英双语，右上角“EN / 中文”即时切换；首次访问跟随浏览器语言，之后记住访客选择。`<html lang>`、标题、描述、章节、图片替代文本和放大对话框文案会一起切换。
- 官方四瓣标志使用新的 `ardor-mark.svg` 地址，并提供 32px PNG 与 apple-touch 回退，避免旧火焰 favicon 继续命中缓存。
- 每类入口只保留一处：页头只有品牌与语言切换，首屏不再重复“界面”跳转，GitHub 只在页尾出现一次，页脚只留个人网站链接。
- 页面只保留每章一段说明，不重复口号、标签或功能清单；具体能力由图中的真实界面表达。

## 截图与隐私

使用实际 Ardor 前端和完全虚构的用户“林澄”渲染。学校、学历、公司、岗位、经历、日期、文件名与账户身份全部独立构造；没有复制个人数据库、原始简历、对话或凭据。

场景包含三份简历、七项 A/B/C 修改建议、六门不同状态的课程、八道面试复盘问题、跨模块规划与十三步执行轨迹。LaTeX 工作区右侧的页面预览由截图脚本在浏览器中绘制一张虚构 A4 简历后提供，不读取任何已存 PDF。业务复杂度参考实际使用场景，不能将截图中的成绩、指标、耗时当作产品效果或性能基准。

## 本地验证

```sh
npm run build
node scripts/check-ardor.mjs
npm run dev
```

打开 `/ardor/`，分别检查四个章节、六张截图、放大预览的缩放切换、390px/900px/1440px 布局及个人主页项目入口。中英两套文案都要检查：标语、章节、图片替代文本、放大对话框按钮，以及切换后刷新仍保持所选语言。

截图重建需要现有 Ardor 前端已完成生产构建，且其锁定依赖包含 Playwright；不会在本站安装或运行 Ardor 后端：

```sh
ARDOR_FRONTEND_DIR=/absolute/path/to/ardor/frontend node scripts/capture-ardor.mjs
```

脚本启动独立 3127 端口，所有 API 由虚构夹具响应，生成对话、简历分析、写简历、面试记录、学习和执行轨迹六张 2× 截图，结束后关闭自己的服务。Windows 可设 `ARDOR_CAPTURE_BROWSER=msedge` 使用本机 Edge。

浏览器回归可使用相同环境变量执行 `node scripts/test-ardor-browser.mjs`（默认预览地址 `http://127.0.0.1:4175`，可通过 `SHOWCASE_BASE` 覆盖）。必须实际找到四个章节和六个截图按钮，分别在中英两种语言下验证章节、按钮文案、图片替代文本、放大与缩放切换、Esc 关闭、刷新持久化和手机预览边界；同时检查英文浏览器首次访问默认英文、favicon 使用新地址、GitHub 只有一个入口、零后台请求及个人主页入口。QA 全页截图写入忽略的依赖缓存，不进入部署产物。

## 部署

既有 GitHub Pages 工作流会发布 `dist`，其中包含独立 `ardor/index.html` 与本地图片/CSS/JS。当前 URL 沿用 `https://ischarlesyang.com/ardor/`。没有配置 `ardor.ischarlesyang.com`、DNS 或新增付费服务。若以后切换子域名，需要单独配置站点根目录和域名，不能只添加 CNAME 就假定路径会自动变换。
