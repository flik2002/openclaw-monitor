# Token计算问题分析

## 问题描述

用户反馈:
- 大模型提供商提示: 100w token已经用完
- 今天才开始使用100w额度
- 当前显示: 10.6w Token

这说明我们的Token计算方式不合理。

## 问题分析![alt text](image-7.png)

### 当前的计算方式

```
总Token = System Prompt + Tool Definition + Conversation History + Tool Call Chain
```

**问题:**
1. **计算的是上下文Token,不是实际消耗**
   - 上下文Token: 当前会话的所有消息
   - 实际消耗: 每次API请求的Input + Output

2. **重复计算**
   - 历史会话的Token被累加
   - 但历史会话的Token已经消耗过了

3. **估算不准确**
   - System Prompt: 固定5000 Token (实际可能不同)
   - Tool Definition: 固定3500 Token (实际可能不同)

### 正确的计算方式

**实际Token消耗 = 每次API请求的 (Input + Output)**

```
总消耗 = Σ (每次请求的input + 每次请求的output)
```

**不包括:**
- ❌ 历史会话的Token (已经消耗过了)
- ❌ 上下文Token (这是当前状态,不是消耗)

## 解决方案

### 方案1: 使用真实usage数据 (推荐)

OpenClaw会话文件中的每条消息都有 `usage` 字段:

```json
{
  "type": "message",
  "usage": {
    "input": 1234,        // 本次请求的输入Token
    "output": 567,        // 本次请求的输出Token
    "cacheRead": 100,     // 缓存读取Token
    "cacheWrite": 50,     // 缓存写入Token
    "totalTokens": 1951   // 总Token
  }
}
```

**计算方式:**
```javascript
totalTokens = Σ (usage.input + usage.output)
```

**优点:**
- ✅ 准确反映实际消耗
- ✅ 与大模型提供商一致
- ✅ 不重复计算

**缺点:**
- ❌ 需要OpenClaw记录真实usage
- ❌ 当前所有usage都是0

### 方案2: 改进估算算法

如果OpenClaw不记录真实usage,我们需要改进估算:

**当前会话的实际消耗:**
```javascript
// 每次对话的消耗 = 用户输入 + 助手输出
for (每次对话) {
  消耗 += 用户消息Token
  消耗 += 助手回复Token
}

// 加上System Prompt和Tool Definition (只算一次)
总消耗 = System Prompt + Tool Definition + 对话消耗
```

**不包括:**
- ❌ 历史会话 (已经消耗过了)
- ❌ 上下文累积 (这是状态,不是消耗)

### 方案3: 区分显示

在监控页面区分显示:

1. **实际消耗Token** - 真实消耗,与提供商一致
2. **上下文Token** - 当前会话的上下文大小
3. **历史Token** - 历史会话的Token (仅供参考)

## 建议

### 短期方案

1. **修改计算逻辑**
   - 只计算当前会话的Token
   - 不累加历史会话
   - 标注为"上下文Token",不是"消耗Token"

2. **添加说明**
   - 在监控页面添加提示
   - 说明这是估算值,不是真实消耗
   - 真实消耗以大模型提供商为准

### 长期方案

1. **等待OpenClaw支持**
   - 等待OpenClaw记录真实usage
   - 使用真实数据计算

2. **或使用大模型API**
   - 直接查询大模型提供商的API
   - 获取真实的Token消耗

## 实现建议

### 修改 `calculateTotalTokens()` 函数

```javascript
async function calculateTotalTokens() {
  // 只计算当前会话的实际消耗
  // 不累加历史会话
  
  let totalTokens = 0;
  
  // 1. System Prompt (只算一次)
  totalTokens += 5000; // 估算值
  
  // 2. Tool Definition (只算一次)
  totalTokens += 3500; // 估算值
  
  // 3. 当前会话的对话消耗
  for (每条消息) {
    if (有真实usage) {
      totalTokens += usage.input + usage.output;
    } else {
      // 估算
      totalTokens += 消息Token;
    }
  }
  
  return {
    totalTokens,
    tokenSource: hasRealUsage ? 'api' : 'estimate',
    note: '这是当前会话的上下文Token,不是实际消耗'
  };
}
```

### 修改前端显示

```html
<div class="card">
  <div class="card-label">TOKEN 使用</div>
  <div class="card-value">10.6万</div>
  <div class="card-note">* 估算值,实际消耗以提供商为准</div>
</div>
```
