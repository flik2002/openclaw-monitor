# SQLite安装问题解决方案

## 问题原因
Python 3.12+移除了`distutils`模块,导致node-gyp无法编译原生模块(sqlite3/better-sqlite3)。

## 解决方案(选择其一)

### 方案1: 安装setuptools(推荐)

```bash
# 安装setuptools(包含distutils)
pip install setuptools

# 然后重新安装依赖
cd backend
npm install
```

### 方案2: 使用预编译的sqlite3

```bash
cd backend

# 删除node_modules
rm -rf node_modules

# 使用预编译版本
npm install sqlite3 --build-from-source=false

# 或者指定预编译版本
npm install sqlite3@5.1.6
```

### 方案3: 降级Python版本

如果您有Python 3.11或更早版本:

```bash
# Windows (使用nvm-windows管理Node.js)
npm config set python "C:\Python311\python.exe"

# 然后重新安装
cd backend
npm install
```

### 方案4: 使用better-sqlite3(需要先解决Python问题)

```bash
# 先安装setuptools
pip install setuptools

# 然后安装better-sqlite3
cd backend
npm install better-sqlite3
```

## 快速修复步骤(推荐)

1. **安装setuptools:**
```bash
pip install setuptools
```

2. **清理并重新安装:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 验证安装

```bash
cd backend
node -e "const sqlite3 = require('sqlite3'); console.log('sqlite3安装成功');"
```

## 如果仍然失败

请尝试以下完整步骤:

```bash
# 1. 安装Python依赖
pip install setuptools distutils-precedence

# 2. 安装Windows构建工具
npm install -g windows-build-tools

# 3. 配置npm使用正确的Python
npm config set python "C:\Users\flik\AppData\Local\Python\pythoncore-3.14-64\python.exe"

# 4. 清理并重新安装
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 临时替代方案:使用JSON文件存储

如果SQLite安装持续失败,可以临时修改后端使用JSON文件存储数据:

```javascript
// backend/src/database/init.js
const fs = require('fs');
const path = require('path');

class JSONDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data.json');
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({
        users: [],
        gateway_configs: [],
        agents: [],
        announcements: [],
        advertisements: []
      }));
    }
  }

  get() {
    return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
  }

  save(data) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }
}

module.exports = new JSONDatabase();
```
