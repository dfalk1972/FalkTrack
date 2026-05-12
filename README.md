# 🔧 FalkTrack

### Asset & Job Management Platform for Field Operations

FalkTrack is a full-stack web application that helps companies in the 
automotive, municipal water & sewer, and agriculture industries track 
job progress, log employee time, and manage asset maintenance records 
— all from a single responsive platform usable on desktop, tablet, or 
mobile.

> Built as a Capstone Project for a Full-Stack Web Development course.
> Two businesses have already expressed interest in using FalkTrack 
> in production.

---

## 🚀 Live Demo
🚧 In Development — [falktrack.com](https://falktrack.com)

---

## 📋 Features

- 🔐 **Email/Password Authentication** with company-scoped accounts
- ✅ **Admin User Approval** — new accounts require admin activation
- 👷 **Role-Based Access** — Admin and Worker roles with different permissions
- 📋 **Job Tracking** — create, assign, and manage jobs with full detail pages
- ⏱️ **Time Logging** — start/stop timers on jobs with manual entry option
- 🔢 **Hour Aggregation** — total hours auto-calculated when job is marked complete
- 📁 **Job Templates** — save recurring jobs for quick selection
- 🚜 **Asset Registry** — scrollable gallery of company assets with photo thumbnails
- 🔧 **Maintenance Records** — log maintenance history with notes, cost, and next due date
- 📸 **Photo & Video Uploads** — attach media to jobs and maintenance records via Cloudinary
- 🔔 **Push Notifications** *(stretch goal)* — browser notifications for upcoming maintenance

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Cloudinary |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Railway |

---

## 🗄️ Database Schema

The application uses 9 tables in a multi-tenant PostgreSQL database:

- **companies** — pre-seeded by platform admin
- **users** — company-scoped with role and approval status
- **job_templates** — reusable job definitions per company
- **jobs** — job records with status and aggregated hours
- **time_entries** — individual clock-in/clock-out records per job
- **job_media** — Cloudinary URLs for job photos and videos
- **assets** — company equipment and vehicle registry
- **maintenance_records** — maintenance history per asset
- **maintenance_media** — Cloudinary URLs for maintenance photos

---

## 🗺️ Frontend Flow Diagram

![FalkTrack Flow Diagram](diagrams/FalkTrack_Flow_Diagram.png)

---

## 👥 Target Industries

- 🚗 **Automotive** — shops tracking repair jobs and vehicle assets
- 🚰 **Municipal Water & Sewer** — crews logging fieldwork and equipment maintenance  
- 🌾 **Agriculture** — tracking maintenance on sprayers and agronomy equipment

---

## 📁 Project Documents

- [Project Proposal](FalkTrack_Proposal_v3_1.docx)
- [Frontend Flow Diagram](diagrams/FalkTrack_Flow_Diagram.png)

---

## 🗓️ Development Roadmap

- [x] Project Proposal (Step 2) — revised to v3
- [x] Frontend Flow Diagram (Step 3)
- [ ] Backend Setup & Database
- [ ] Frontend Build — React + Tailwind CSS
- [ ] Supabase Integration
- [ ] Cloudinary Media Upload
- [ ] Deployment (Vercel + Railway)
- [ ] V2 Roadmap — Inspections, Notifications, PDF Export, QR Codes

---

## 👨‍💻 Developer

**D. Falk**  
GitHub: [@dfalk1972](https://github.com/dfalk1972)  
Domain: [falktrack.com](https://falktrack.com)

---

*FalkTrack — Built for the field. 🐾*
