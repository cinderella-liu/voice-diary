# 语音记事本 - 设计文档

## 概述
安卓极简记事应用，通过语音输入自动归类，支持多维度数据分析图表。

## 功能模块

### 1. 语音输入 (首页)
- 点击麦克风按钮开始录音
- 识别完成后，根据关键词自动归类到对应模块
- 归类规则（中文关键词匹配）：
  - **checkin** (考勤): 上班、下班、打卡、签到、到岗、离岗、到公司、回家
  - **exercise** (运动): 运动、跑步、健身、游泳、攀岩、瑜伽、跑步机、俯卧撑、深蹲、举铁
  - **work** (工作计划): 工作、任务、项目、完成、汇报、开会、会议、deadline、甲方、需求、代码、bug、修复
- 无匹配时默认为 work（工作计划），可手动调整

### 2. 考勤模块 (checkin)
- 列表显示所有上下班记录
- 每条记录：日期、上班时间、下班时间、工作时长
- 左上角显示统计：本月平均工时、本月出勤天数
- 底部可手动添加记录

### 3. 运动模块 (exercise)
- 列表显示运动记录
- 每条记录：日期、运动类型、时长、备注
- 左上角统计：本月运动次数、本月总时长
- 底部可手动添加

### 4. 工作计划模块 (work)
- 列表显示工作计划/任务记录
- 每条记录：日期、任务内容、状态(待办/进行中/已完成)
- 左滑标记完成，右滑删除
- 左上角统计：待办数量、本月完成数

### 5. 数据分析图表 (analytics)
- 顶部选择：月/季度/半年/年度
- 三个图表并排或切换：
  - 考勤趋势图（折线图 - 每日工时）
  - 运动统计图（柱状图 - 每月运动次数/时长）
  - 工作计划完成率（饼图或环形图 - 完成 vs 未完成）
- 时间范围选择器

## 设计风格
- **简约复古** — 大量留白，卡片式布局
- **配色**：
  - 主背景: #F5F0E8 (米白)
  - 卡片: #FAF6EF (暖白)
  - 主色: #8B6F47 (暖棕)
  - 辅色: #A8B5A0 (灰绿)
  - 强调: #C17F4E (陶土橙)
  - 文字主: #3D3229 (深棕)
  - 文字次: #8B7D6B (灰棕)
- **字体**: 使用 Google Fonts 的 "ZCOOL KuaiLe"（站酷快乐体，手写感）
- **圆角**: 12px 卡片圆角
- **阴影**: 轻微阴影，自然

## 技术实现
- React Native + Expo SDK 56
- Expo Router (文件路由)
- react-native-voice (语音识别，中文)
- @react-native-async-storage/async-storage (本地存储)
- react-native-chart-kit + react-native-svg (图表)
- expo-speech (可选，语音反馈)

## 文件结构 (Expo Router)
```
src/
  app/
    _layout.tsx          # 根布局 - 字体加载、主题Provider
    (tabs)/
      _layout.tsx        # Tab导航布局（底部标签栏）
      index.tsx          # 首页 - 语音输入 + 最近动态
      checkin.tsx        # 考勤模块
      exercise.tsx       # 运动模块
      work.tsx           # 工作计划模块
      analytics.tsx      # 数据分析图表
  components/
    VoiceButton.tsx      # 语音录制按钮组件
    RecordCard.tsx       # 通用记录卡片组件
    EmptyState.tsx       # 空状态组件
    StatBadge.tsx        # 统计标签组件
  hooks/
    useRecords.ts        # 记录 CRUD hook (AsyncStorage)
    useVoice.ts          # 语音识别 hook
    useCategorize.ts     # 自动归类逻辑
  utils/
    storage.ts           # AsyncStorage 封装
    categorize.ts        # 关键词归类函数
    dateUtils.ts         # 日期格式化工具
    colors.ts            # 主题配色常量
    fonts.ts             # 字体配置
  types/
    index.ts             # 类型定义
```

## 数据类型
```typescript
interface Record {
  id: string;
  type: 'checkin' | 'exercise' | 'work';
  title: string;
  content: string;
  timestamp: string; // ISO string
  metadata?: {
    // checkin: { checkIn?: string, checkOut?: string, duration?: number }
    // exercise: { sportType?: string, duration?: number }
    // work: { status?: 'todo' | 'doing' | 'done' }
  };
  createdAt: string;
}
```
