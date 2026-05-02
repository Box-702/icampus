# 我的校园 AI

## 项目功能

- 1.校园智能问答模块：基于专属知识库的精准问答，支持学生手册、规章制度、办事流程、通知公告等内容检索，回答来源可追溯。
- 2.自动事务代办模块：对接校内官方系统，自动完成表单填写、流程提交、状态查询，如校内订水等功能。
- 3.智能导航模块：结合 MCP 协议对接地图服务，实现校园地点查询、最优路径规划，支持线下办事路线指引。
- 4.会话管理模块：支持多会话并行、历史记录追溯、会话删除，保留用户对话上下文，实现连续任务处理。
- 5.人机协同模块：自动识别验证码、登录拦截、权限校验等场景，主动请求用户协助，完成后无缝续接任务执行。
- 6.知识库管理模块：支持非结构化文档（PDF、Word）自动解析、清洗、入库，管理员可快速更新校园最新政策与流程。

## 推荐的 IDE 设置

[VS Code](https://code.visualstudio.com/) + [Vue (官方插件)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（并禁用 Vetur）。

## 推荐的浏览器设置

- 基于 Chromium 的浏览器（Chrome、Edge、Brave 等）：
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - 在 Chrome DevTools 中开启 [自定义对象格式化程序](http://bit.ly/object-formatters)
- Firefox：
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - 在 Firefox DevTools 中开启 [自定义对象格式化程序](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 自定义配置

参见 [Vite 配置参考](https://vite.dev/config/)。

## 项目设置

```sh
npm install
```

### 开发时编译并热重载

```sh
npm run dev
```

### 编译并压缩用于生产环境

```sh
npm run build
```