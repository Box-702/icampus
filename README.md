# 莞工校园 AI 助手 (iCampus)

面向东莞理工学院师生的智能校园助手前端应用。

## 核心功能

| 模块 | 说明 |
|------|------|
| 智能问答 | 基于专属知识库的精准问答，支持学生手册、规章制度、办事流程、通知公告等内容检索，回答来源可追溯 |
| 事务代办 | 对接校内官方系统，自动完成表单填写、流程提交、状态查询（如校内订水等） |
| 智能导航 | 结合 MCP 协议对接高德地图，实现校园地点查询、最优路径规划 |
| 会话管理 | 多会话并行、历史记录追溯、会话删除，保留对话上下文 |
| 人机协同 | 自动识别验证码、登录拦截等场景，主动请求用户协助后无缝续接 |
| 知识库管理 | 支持 PDF/Word 文档自动解析、清洗、入库 |

## 技术栈

### 前端

- **Vue 3** (Composition API) — 渐进式前端框架
- **Vite 5** — 构建工具
- **Element Plus** — UI 组件库
- **Pinia** — 状态管理
- **Vue Router 4** — 路由
- **marked + DOMPurify** — Markdown 渲染 & XSS 防护
- **Axios** — HTTP 请求

### 后端 (Go)

后端仓库独立维护，主要技术栈：

- **Go 1.24**
- **Milvus / Zilliz Cloud** — 向量数据库，知识库语义检索
- **MySQL 8.0** — 用户数据与会话持久化
- **智谱 AI API** — 大语言模型
- **DeepSeek API** — MCP Agent 地图服务
- **SSE** — 流式对话响应

## 快速开始

**环境要求**：Node.js >= 18，npm >= 9

```bash
# 安装依赖
npm install

# 配置环境变量
# VITE_USE_MOCK=true   —— Mock 模式，无需后端即可开发
# VITE_USE_MOCK=false  —— 连接真实 Go 后端

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

**构建生产版本**

```bash
npm run build     # 输出到 dist/
npm run preview   # 预览构建结果
```

## 项目结构

```
src/
├── api/aiApi.js              # AI 对话 API（SSE 流式 + Mock 回退）
├── components/chat/
│   ├── ChatMessage.vue        # 消息气泡组件
│   └── ChatInput.vue          # 输入区组件
├── layouts/MainLayout.vue     # 主布局（侧边栏 + 内容区）
├── router/index.js            # 路由配置 + 导航守卫
├── services/api.js            # Axios 实例 + 拦截器
├── stores/
│   ├── user.js                # Pinia 用户状态
│   └── chat.js                # Pinia 聊天状态
├── utils/markdown.js          # 安全 Markdown 渲染
├── views/
│   ├── ChatView.vue           # 聊天主页面
│   ├── LoginView.vue          # 登录/注册页
│   └── ProfileView.vue        # 个人中心页
├── App.vue
└── main.js
```

## 特性

- **XSS 防护**：AI 回复经 marked 解析后由 DOMPurify 消毒，杜绝注入攻击
- **SSE 流式对话**：后端逐 token 推送，前端实时渲染打字效果，支持中途取消
- **Pinia 状态管理**：用户状态与聊天状态集中管理，自动同步 localStorage
- **构建分包**：Element Plus / 图标 / 第三方库独立 chunk，主应用仅 22KB

## 推荐工具

- IDE：[VS Code](https://code.visualstudio.com/) + [Vue (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 浏览器插件：[Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

---

Private — 校园项目
