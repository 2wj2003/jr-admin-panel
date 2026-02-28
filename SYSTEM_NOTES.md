# JR Commerce — System Notes & Troubleshooting Guide

> อัปเดตล่าสุด: 2026-02-28

---

## สถาปัตยกรรมระบบ

```
┌─────────────────┐     Public REST API (/api/*)         ┌───────────────┐
│  web (Next.js)  │ ──────────────────────────────────► │               │
│  jr.co.th       │                                      │  api (Strapi) │
└─────────────────┘                                      │  :1337        │
                                                         │               │
┌─────────────────┐     Admin API (/admin/*, /content-   │               │
│ admin (Next.js) │ ──  manager/collection-types/*)  ──► │               │
│ admin.jr.co.th  │                                      └───────────────┘
└─────────────────┘
```

| Layer | URL | Auth Method |
|---|---|---|
| `web` (ลูกค้า) | `jr.co.th` | ไม่ต้อง login — ใช้ Public Role permissions |
| `admin` (แอดมิน) | `admin.jr.co.th` | Admin JWT (`/admin/login`) |
| `api` (Strapi) | `api.jr.co.th` | ขึ้นอยู่กับ endpoint |

---

## กฎสำคัญ: 2 Auth System ที่แยกกัน

Strapi มี **2 ระบบ Auth ที่ไม่เกี่ยวข้องกัน**:

| | Users-Permissions JWT | Admin JWT |
|---|---|---|
| ออก token จาก | `POST /api/auth/local` | `POST /admin/login` |
| ใช้กับ endpoint | `/api/*` (Public REST API) | `/admin/*`, `/content-manager/*`, `/upload/*` |
| ควบคุมด้วย | Public/Authenticated Role ใน Users & Permissions | Admin Roles ใน Settings > Roles |
| เก็บ config ที่ | `config/sync/user-role.*.json` | `config/sync/admin-role.*.json` |

> ⚠️ **ห้ามสลับกัน** — Admin JWT ที่ส่งไปยัง `/api/*` จะถูกละเว้น (Public role จะถูกใช้แทน)

---

## Admin Panel (`admin/`) — หลักการ Fetch ข้อมูล

### ✅ ถูกต้อง — ใช้ Content Manager API
```typescript
// admin/src/lib/strapi.ts — fetchCollection()
const url = `/content-manager/collection-types/${uid}`;
// รับ Admin JWT ✓ — เห็นข้อมูลทุก record ✓
```

### ❌ ผิด — ใช้ Public API กับ Admin JWT
```typescript
// อย่าทำแบบนี้ใน admin panel!
const url = `/api/${endpoint}`;
// Admin JWT ถูกละเว้น — ถูกจำกัดด้วย Public Role ✗
```

**เหตุผลที่ Media Library ทำงานได้เสมอ:** ใช้ `/upload/files` ซึ่งเป็น Admin API โดยตรง

---

## Chat System — หลักการทำงาน

```
ลูกค้า (web)          →  POST /api/chat-sessions      (สร้าง session)
                       →  POST /api/chat-messages      (ส่งข้อความ)
                       →  GET  /api/chat-messages      (polling 3s)

แอดมิน (admin panel)  →  GET  /content-manager/collection-types/api::chat-session.chat-session
                       →  POST /content-manager/collection-types/api::chat-message.chat-message
                       →  GET  /content-manager/collection-types/api::chat-message.chat-message
```

ลูกค้าเรียก `/api/*` ดังนั้น **Public Role ต้องมี permissions** สำหรับ chat content types

---

## Checklist: การเพิ่ม Content Type ใหม่

เมื่อสร้าง Content Type ใหม่ใน Strapi ต้องทำทั้ง 3 ขั้นตอนนี้ทุกครั้ง:

### 1. เพิ่ม UID mapping ใน `admin/src/lib/strapi.ts`

```typescript
const COLLECTION_UIDS: Record<string, string> = {
  // ... ที่มีอยู่แล้ว ...
  "my-new-things": "api::my-new-thing.my-new-thing",  // ← เพิ่ม
};
```

### 2. เพิ่ม Public permissions ใน `api/config/sync/user-role.public.json`

> ⚠️ ต้องทำทุกครั้งที่ content type นั้นต้องให้ลูกค้าเข้าถึงได้

```json
{
  "action": "api::my-new-thing.my-new-thing.find"
},
{
  "action": "api::my-new-thing.my-new-thing.findOne"
},
{
  "action": "api::my-new-thing.my-new-thing.create"
}
```

### 3. Restart Strapi หลังแก้ sync config

Config sync จะโหลด permissions ใหม่ตอน bootstrap เท่านั้น:
```bash
# ใน api/
yarn develop   # หรือ npm run develop
```

---

## Config Sync — กฎการทำงาน

ไฟล์ใน `api/config/sync/` คือ **source of truth** สำหรับ permissions และ settings

| ไฟล์ | ควบคุม |
|---|---|
| `user-role.public.json` | สิทธิ์ของผู้ใช้ที่ไม่ได้ login (ลูกค้าทั่วไป) |
| `user-role.authenticated.json` | สิทธิ์ของผู้ใช้ที่ login แล้ว |
| `admin-role.strapi-super-admin.json` | สิทธิ์ของ Super Admin |
| `admin-role.strapi-editor.json` | สิทธิ์ของ Editor |
| `admin-role.strapi-author.json` | สิทธิ์ของ Author |

> ⚠️ **config-sync override** — ถ้า Strapi import sync ทุกครั้งที่รีสตาร์ท permissions ที่ตั้งผ่าน Strapi Admin UI จะถูก **ล้างทิ้ง** และถูกแทนที่ด้วย sync file  
> ดังนั้น **ต้องแก้ที่ sync file เสมอ** อย่าแก้แค่ใน Admin UI

Bootstrap ใน `api/src/index.js` ก็ไม่เพียงพอเพราะ config-sync จะ run หลัง bootstrap

---

## ปัญหาที่เคยเจอ & วิธีแก้

### 🔴 ระบบแชทไม่ทำงาน (403 Forbidden)

**สาเหตุ:** `user-role.public.json` ไม่มี permissions สำหรับ `chat-message` / `chat-session`

**แก้:** เพิ่ม permissions ใน `api/config/sync/user-role.public.json` แล้ว restart Strapi

```json
{ "action": "api::chat-message.chat-message.find" },
{ "action": "api::chat-message.chat-message.findOne" },
{ "action": "api::chat-message.chat-message.create" },
{ "action": "api::chat-message.chat-message.update" },
{ "action": "api::chat-session.chat-session.find" },
{ "action": "api::chat-session.chat-session.findOne" },
{ "action": "api::chat-session.chat-session.create" },
{ "action": "api::chat-session.chat-session.update" }
```

---

### 🔴 Admin Panel ไม่แสดงข้อมูล (นอกจาก Media Library)

**สาเหตุ:** `fetchCollection()` ใช้ `/api/*` (Public API) แต่ Admin JWT ทำงานเฉพาะกับ `/content-manager/*`

**แก้:** เปลี่ยน URL ใน `admin/src/lib/strapi.ts` เป็น Content Manager API

```typescript
// ❌ เดิม
const url = `/api/${endpoint}`;
// ✅ แก้แล้ว
const url = `/content-manager/collection-types/${uid}`;
```

---

### 🟡 เพิ่ม content type ใหม่แล้วแอดมินดูไม่เห็น

**สาเหตุ:** ลืมเพิ่ม UID ใน `COLLECTION_UIDS` map ใน `admin/src/lib/strapi.ts`

**แก้:** เพิ่ม entry ใน `COLLECTION_UIDS` ดูตัวอย่างที่ Checklist ข้างบน

---

### 🟡 เพิ่ม content type ใหม่แล้วลูกค้าเข้าไม่ได้

**สาเหตุ:** ลืมเพิ่ม permissions ใน `user-role.public.json`

**แก้:** เพิ่ม permissions และ restart Strapi

---

## Environment Variables

### `api/` (Strapi)
| Variable | ใช้ทำอะไร | ตัวอย่าง |
|---|---|---|
| `DATABASE_CLIENT` | ประเภท database | `sqlite` / `postgres` |
| `ADMIN_JWT_SECRET` | Secret สำหรับ Admin JWT | string ยาว random |
| `JWT_SECRET` | Secret สำหรับ Users-Permissions JWT | string ยาว random |
| `APP_KEYS` | Session keys (comma-separated) | 4 strings คั่นด้วย `,` |
| `AWS_*` | S3 credentials สำหรับ file upload | - |

### `admin/` (Next.js Admin Panel)
| Variable | ใช้ทำอะไร | ตัวอย่าง |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | URL ของ Strapi API | `https://api.jr.co.th` |

### `web/` (Next.js Website)
| Variable | ใช้ทำอะไร | ตัวอย่าง |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL ของ Strapi API | `https://api.jr.co.th` |

---

## Response Format Differences

| API | Response Format | ใช้ใน |
|---|---|---|
| Content Manager API | `{ results: [...flat], pagination: {...} }` | `admin/` fetchCollection |
| Public REST API | `{ data: [{ id, attributes: {...} }], meta: { pagination } }` | `web/` chat.ts, query/* |
| Upload API | `[...files]` หรือ `{ results, pagination }` | Media Library |

Content Manager API คืน **flat objects** (ไม่มี `attributes` wrapper):
```json
// Content Manager API
{ "id": 1, "name": "สินค้า A", "price": 100, "publishedAt": "..." }

// Public REST API  
{ "id": 1, "attributes": { "name": "สินค้า A", "price": 100 } }
```

`admin/src/lib/strapi.ts` จะ wrap flat objects เป็น `{ id, attributes: item }` อัตโนมัติ เพื่อให้ components ใช้ `item.attributes.name` ได้เหมือนเดิม
