# 期末复习题库系统

基于 Vue 3 + Express + SQLite 的智能练习系统，支持多种题型、练习模式与模拟考试。

## 功能特性

- **多种题型支持**：单选题、多选题、填空题、简答题
- **双模式练习**：练习模式（可切换题目顺序）、模拟考试模式（随机出题）
- **错题本**：自动收集练习过程中的错题，支持按学科、题型、时间筛选，并可将错题导出为专门题库进行巩固
- **练习记录**：完整保存每次练习的答题结果、正确率、用时，可追溯历史
- **题目笔记**：每道题目可附加个人笔记，支持 AI 智能解析
- **进度保存**：中途退出可恢复做题进度，继续练习
- **题库管理**：支持导入自定义题库（MD 格式），内置题库与用户题库分开管理
- **数据导出/导入**：支持整机数据备份与恢复

## 技术栈

- **前端**：Vue 3 + Pinia + Vue Router + Vite
- **后端**：Express.js + Node.js 原生 SQLite（node:sqlite）
- **样式**：原生 CSS（自定义 Design System），支持暗色主题

## 项目结构

```
FinalPrep/
├── server/               # Express 后端
│   ├── server.js         # 服务端入口
│   └── data/             # SQLite 数据库文件目录
├── src/                  # Vue 3 前端源码
│   ├── components/       # 公共组件
│   │   ├── wrongbook/    # 错题本相关组件
│   │   └── notes/        # 笔记相关组件
│   ├── stores/           # Pinia 状态管理
│   │   ├── quiz.js       # 答题状态（答题进度、模式、分数）
│   │   ├── bank.js       # 题库管理
│   │   ├── history.js    # 练习记录
│   │   ├── wrongBook.js  # 错题本聚合
│   │   └── note.js       # 笔记管理
│   ├── views/            # 页面视图
│   ├── utils/            # 工具函数（API、解析器、验证器）
│   ├── router/           # 路由配置
│   └── style.css         # 全局样式 & Design System
├── public/
│   └── banks/            # 内置题库 MD 文件
├── index.html
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18

### 安装依赖

```bash
npm install
cd server && npm install
```

### 启动开发服务器

```bash
# 终端 1：启动后端（端口 3000）
cd server
node server.js

# 终端 2：启动前端（端口 5173）
npm run dev
```

访问 http://localhost:5173 即可使用。

### 构建生产版本

```bash
npm run build
```

## 题库格式

题库为 Markdown 文件，内含 JSON 代码块：

```markdown
```json
{
  "name": "操作系统-文件系统",
  "subject": "操作系统",
  "questions": [
    {
      "id": 1,
      "type": "single",
      "question": "以下哪种文件系统不支持日志功能？",
      "options": [
        { "label": "A", "text": "ext3" },
        { "label": "B", "text": "NTFS" },
        { "label": "C", "text": "FAT32" },
        { "label": "D", "text": "ext4" }
      ],
      "answer": "C",
      "score": 2
    }
  ]
}
```
```

## API 路由

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/banks | 获取用户题库列表 |
| POST | /api/banks | 新增题库 |
| DELETE | /api/banks/:id | 删除题库 |
| GET | /api/history | 获取练习历史记录 |
| POST | /api/history | 保存练习记录 |
| GET | /api/sessions | 获取所有进行中的会话 |
| PUT | /api/sessions | 保存/更新会话进度 |
| GET | /api/notes | 获取笔记列表 |
| POST | /api/notes | 保存题目笔记 |
| GET | /api/export | 导出全部数据 |
| POST | /api/import | 导入全部数据 |

## License

MIT