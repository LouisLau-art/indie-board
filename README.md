# 🚀 Indie Board

一个极简的独立产品发现榜，帮助您发现优秀的独立开发者作品。

## ✨ 特性

- 📋 **产品展示** - 按点赞数实时排序的产品卡片
- ➕ **提交功能** - 简单的表单提交新产品
- 👍 **点赞系统** - 每 IP 每 24 小时限投一票
- 🔄 **实时更新** - 5 秒轮询同步最新数据
- 🌙 **暗色模式** - 支持 Emerald/Forest 主题切换

## 🛠 技术栈 (Bleeding Edge)

- **Framework**: [Nuxt 4.2.2](https://nuxt.com)
- **UI**: [Vue 3.5.25](https://vuejs.org) (Reactive Props Destructure, useTemplateRef)
- **Styling**: [UnoCSS 66.x](https://unocss.dev) + [DaisyUI 4.12.24](https://daisyui.com)
- **Database**: [Better-SQLite3 12.x](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM 0.45.x](https://orm.drizzle.team)
- **Runtime**: Bun

## 🚀 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

首次运行会自动初始化数据库并插入 3 条示例数据 (Vue, Nuxt, Vite)。

## 📁 项目结构

```
indie-board/
├── app/                      # Nuxt 4 应用目录
│   ├── app.vue              # 根组件 + 全局样式
│   ├── pages/
│   │   └── index.vue        # 主页
│   └── components/
│       ├── ProductCard.vue  # 产品卡片
│       ├── SubmitForm.vue   # 提交表单
│       └── ThemeToggle.vue  # 主题切换
├── server/                   # Nitro 服务端
│   ├── api/products/        # API 路由
│   ├── database/            # Drizzle ORM
│   └── plugins/             # 数据库初始化
├── public/                   # 静态资源
├── nuxt.config.ts           # Nuxt 配置
├── uno.config.ts            # UnoCSS + DaisyUI 配置
└── drizzle.config.ts        # Drizzle 配置
```

## 🎨 DaisyUI 主题

使用 `@ameinhardt/unocss-preset-daisy` 集成 DaisyUI：

- **亮色**: Emerald 主题
- **暗色**: Forest 主题

## 📝 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | 获取所有产品（按点赞数排序） |
| POST | `/api/products` | 提交新产品 |
| POST | `/api/products/:id/vote` | 为产品投票 |

## 📜 License

[MIT](LICENSE)
