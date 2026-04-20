# API 規範文檔

## 基礎信息

- Base URL: `${NEXT_PUBLIC_API_URL}/api`
- 認證方式: Bearer Token (JWT)
- 響應格式: JSON

## 通用響應格式

### 成功響應

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### 錯誤響應

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤描述"
  }
}
```

### 錯誤代碼

| 代碼 | 說明 |
|------|------|
| `VALIDATION_ERROR` | 請求參數驗證失敗 |
| `UNAUTHORIZED` | 未認證或 token 過期 |
| `FORBIDDEN` | 無權限訪問 |
| `NOT_FOUND` | 資源不存在 |
| `INTERNAL_ERROR` | 服務器內部錯誤 |

---

## 認證 API

### POST /auth/login

登入並獲取 JWT Token。

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-001",
      "email": "user@example.com",
      "name": "張三",
      "role": "admin"
    }
  }
}
```

### POST /auth/logout

登出並使 token 失效。

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": { "success": true }
}
```

### GET /auth/me

獲取當前用戶信息。

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "user-001",
    "email": "user@example.com",
    "name": "張三",
    "role": "admin"
  }
}
```

---

## 學校 API

### GET /schools

獲取學校列表。

**Query Parameters:**
| 參數 | 類型 | 說明 |
|------|------|------|
| `page` | number | 頁碼，默認 1 |
| `pageSize` | number | 每頁數量，默認 20 |
| `search` | string | 搜索關鍵詞 |
| `district` | string | 地區篩選 |
| `grade` | string | 成熟度等級 A/B/C/D |
| `type` | string | 學校類型 |
| `status` | string | 狀態篩選 |

**Response:**
```json
{
  "data": {
    "schools": [
      {
        "id": "school-001",
        "name": "聖保羅男女中學",
        "district": "中西區",
        "type": "直資",
        "level": "中學",
        "maturityGrade": "A",
        "overallScore": 85,
        "status": "completed",
        "website": "https://www.spcc.edu.hk",
        "dimensions": {
          "curriculum": 88,
          "faculty": 85,
          "infrastructure": 90,
          "management": 82,
          "partnerships": 78,
          "innovation": 86,
          "assessment": 80,
          "culture": 84
        },
        "updatedAt": "2024-03-15T10:00:00Z"
      }
    ],
    "total": 570
  },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 570,
    "totalPages": 29
  }
}
```

### GET /schools/:id

獲取學校詳情。

**Response:**
```json
{
  "data": {
    "id": "school-001",
    "name": "聖保羅男女中學",
    "district": "中西區",
    "type": "直資",
    "level": "中學",
    "maturityGrade": "A",
    "overallScore": 85,
    "status": "completed",
    "website": "https://www.spcc.edu.hk",
    "dimensions": { ... },
    "analysisHistory": [ ... ],
    "recommendations": [ ... ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-03-15T10:00:00Z"
  }
}
```

### POST /schools

創建新學校。

**Request:**
```json
{
  "name": "學校名稱",
  "district": "地區",
  "type": "官立",
  "level": "中學",
  "website": "https://..."
}
```

### PUT /schools/:id

更新學校信息。

### DELETE /schools/:id

刪除學校。

### GET /schools/dashboard

獲取儀表板統計數據。

**Response:**
```json
{
  "data": {
    "totalSchools": 570,
    "analyzedSchools": 456,
    "averageScore": 58.5,
    "gradeDistribution": [
      { "grade": "A", "count": 45, "percentage": 8 },
      { "grade": "B", "count": 156, "percentage": 27 },
      { "grade": "C", "count": 234, "percentage": 41 },
      { "grade": "D", "count": 135, "percentage": 24 }
    ],
    "districtStats": [
      { "district": "中西區", "avgScore": 72, "count": 35 },
      { "district": "灣仔區", "avgScore": 68, "count": 28 }
    ],
    "recentlyUpdated": [ ... ]
  }
}
```

---

## 解決方案 API

### GET /solutions

獲取解決方案列表。

**Query Parameters:**
| 參數 | 類型 | 說明 |
|------|------|------|
| `category` | string | 類別篩選 |
| `targetDimension` | string | 目標維度 |
| `minGrade` | string | 最低適用等級 |

### GET /solutions/recommendations/:schoolId

獲取針對特定學校的推薦方案。

**Response:**
```json
{
  "data": {
    "school": { ... },
    "recommendations": [
      {
        "solution": { ... },
        "matchScore": 95,
        "targetDimensions": ["curriculum", "faculty"],
        "reason": "該學校在課程發展和師資培訓維度需要加強"
      }
    ]
  }
}
```

---

## 工作流 API

### GET /workflows

獲取工作流列表。

**Query Parameters:**
| 參數 | 類型 | 說明 |
|------|------|------|
| `status` | string | active/paused/completed |
| `stage` | string | 階段篩選 |
| `assignee` | string | 負責人 |

### GET /workflows/stats

獲取工作流統計。

**Response:**
```json
{
  "data": {
    "total": 24,
    "byStatus": {
      "active": 12,
      "paused": 3,
      "completed": 9
    },
    "byStage": {
      "discovery": 2,
      "analysis": 4,
      "recommendation": 3,
      "implementation": 2,
      "review": 1
    },
    "recentActivity": [ ... ]
  }
}
```

---

## 數據抓取 API

### GET /scraping/tasks

獲取抓取任務列表。

### POST /scraping/tasks

創建新抓取任務。

**Request:**
```json
{
  "url": "https://www.school.edu.hk",
  "schoolName": "學校名稱"
}
```

### POST /scraping/tasks/:id/start

開始抓取任務。

### POST /scraping/tasks/:id/pause

暫停抓取任務。

### POST /scraping/tasks/:id/retry

重試失敗的任務。

### GET /scraping/stats

獲取抓取統計。

**Response:**
```json
{
  "data": {
    "total": 50,
    "completed": 35,
    "running": 5,
    "failed": 3,
    "pending": 7,
    "totalPages": 1250,
    "totalDocuments": 450
  }
}
```

---

## 用戶 API

### GET /users

獲取用戶列表 (管理員)。

### GET /users/me

獲取當前用戶詳情。

### PUT /users/me

更新當前用戶信息。

**Request:**
```json
{
  "name": "新名稱",
  "preferences": {
    "theme": "dark",
    "language": "zh-TW"
  }
}
```

---

## WebSocket 事件

### 連接

```javascript
const ws = new WebSocket(`${WS_URL}/ws?token=${token}`)
```

### 事件類型

| 事件 | 說明 |
|------|------|
| `scraping:progress` | 抓取進度更新 |
| `scraping:completed` | 抓取完成 |
| `workflow:updated` | 工作流狀態更新 |
| `notification` | 系統通知 |

### 消息格式

```json
{
  "type": "scraping:progress",
  "data": {
    "taskId": "task-001",
    "progress": 65,
    "pagesCollected": 28
  }
}
```
