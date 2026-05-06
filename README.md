# 🎓 莞工校园 AI 助手 (iCampus)

> 面向东莞理工学院师生的智能校园助手前端应用 —— 智能问答 · 事务代办 · 校园导航

[![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vite.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.13-409EFF?logo=element)](https://element-plus.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859)](https://pinia.vuejs.org/)

---

## ✨ 核心功能

| 模块 | 说明 |
|------|------|
| 🧠 **智能问答** | 基于专属知识库的精准问答，支持学生手册、规章制度、办事流程、通知公告等内容检索，回答来源可追溯 |
| 🤖 **事务代办** | 对接校内官方系统，自动完成表单填写、流程提交、状态查询（如校内订水等） |
| 🗺️ **智能导航** | 结合 MCP 协议对接高德地图，实现校园地点查询、最优路径规划 |
| 💬 **会话管理** | 多会话并行、历史记录追溯、会话删除，保留对话上下文 |
| 🧑‍🤝‍🧑 **人机协同** | 自动识别验证码、登录拦截等场景，主动请求用户协助后无缝续接 |
| 📚 **知识库管理** | 支持 PDF/Word 文档自动解析、清洗、入库 |

---

## 🛠️ 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| **Vue 3** (Composition API) | 渐进式前端框架 |
| **Vite 5** | 极速开发构建工具 |
| **Element Plus** | 企业级 UI 组件库 |
| **Pinia** | 轻量级状态管理 |
| **Vue Router 4** | SPA 路由 |
| **marked + DOMPurify** | 安全 Markdown 渲染 & XSS 防护 |
| **Axios** | HTTP 请求 |

### 后端 (Go)

后端仓库独立维护，技术栈：

| 技术 | 用途 |
|------|------|
| **Go 1.24** | 高性能后端语言 |
| **Milvus / Zilliz Cloud** | 向量数据库 — 知识库语义检索 |
| **MySQL 8.0** | 用户数据 & 会话持久化 |
| **智谱 AI API** | LLM 大语言模型 |
| **DeepSeek API** | MCP Agent 地图服务 |
| **SSE (Server-Sent Events)** | 流式对话响应 |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.development .env.local
# 编辑 .env.local：
#   VITE_USE_MOCK=true    # Mock 模式（无需后端）
#   VITE_USE_MOCK=false   # 真实 API（需启动 Go 后端）

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

### 构建生产版本

```bash
npm run build   # 输出到 dist/
npm run preview # 预览生产构建
```

---

## 📁 项目结构

```
icampus/
├── public/images/            # 静态资源
│   ├── ligon-icon.jpg        # 学校 Logo
│   ├── login.jpg             # 登录背景
│   └── ...
├── src/
│   ├── api/
│   │   └── aiApi.js          # AI 对话 API（SSE 流式 + Mock）
│   ├── components/
│   │   └── chat/
│   │       ├── ChatMessage.vue   # 消息气泡组件
│   │       └── ChatInput.vue     # 输入区组件
│   ├── layouts/
│   │   └── MainLayout.vue    # 主布局（侧边栏 + 内容区）
│   ├── router/
│   │   └── index.js          # 路由配置 + 导航守卫
│   ├── services/
│   │   └── api.js            # Axios 实例 + 拦截器
│   ├── stores/
│   │   ├── user.js           # Pinia 用户状态
│   │   └── chat.js           # Pinia 聊天状态
│   ├── utils/
│   │   └── markdown.js       # 安全 Markdown 渲染 (marked + DOMPurify)
│   ├── views/
│   │   ├── ChatView.vue      # 聊天主页面
│   │   ├── LoginView.vue     # 登录/注册页
│   │   └── ProfileView.vue   # 个人中心页
│   ├── App.vue               # 根组件
│   └── main.js               # 入口文件
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── vite.config.js             # Vite 配置（含代理 & 分包）
└── package.json
```

---

## 🎨 特性亮点

### 🔒 XSS 安全防护
所有 AI 回复经 `marked` 解析为 HTML 后，再通过 `DOMPurify` 严格消毒，杜绝 XSS 攻击。参见 `src/utils/markdown.js`。

### ⚡ SSE 流式对话
后端通过 Server-Sent Events 逐 token 推送回复，前端实时渲染打字效果：
- 流式光标动画 (`▊` 闪烁)
- 等待时三点跳动指示器
- 支持「停止生成」中途取消

### 🗃️ Pinia 状态管理
- `userStore`: 用户名 / Token / 个人信息集中管理，自动同步 localStorage
- `chatStore`: 消息列表 / 历史记录 / 流式状态统一控制

### 📦 构建分包优化
```js
// vite.config.js — manualChunks
element-plus   → 887 KB  (UI 库, 浏览器长期缓存)
element-icons  → 171 KB  (图标库)
vendor         → 208 KB  (Vue/Router/Pinia/Axios)
app            →  22 KB  (业务代码)
```

---

## 🔗 相关仓库

- 后端服务: `campus` (Go + Milvus + MySQL)
- 推荐 IDE: [VS Code](https://code.visualstudio.com/) + [Vue (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- 浏览器插件: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

---

## 📄 License

Private — 校园项目
