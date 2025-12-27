# **Vercel-Clone — Deployment Platform (Full System Design)**
**Built by Sunilkumar T**  
*Backend Engineering • DevOps • Distributed Systems • PSG Tech*

---
<img width="10772" height="10272" alt="Vercel-clone" src="https://github.com/user-attachments/assets/f7dfdbeb-7bdb-4991-b305-7e111f19ea9a" />



## **Overview**
A fully functional deployment platform inspired by Vercel.

This system can:
- Clone repositories  
- Build projects inside isolated Docker containers  
- Stream logs in real-time  
- Upload artifacts to S3  
- Serve deployments dynamically through Nginx  
- Route requests based on project/build/domain  

This README documents the **full architecture**, **flow**, and **engineering behind the platform**.

---

---

## **System Components**

### **1. Route Handler**
Handles all incoming requests:
- Maps domain/subdomain → project  
- Computes correct build path  
- Fetches files from S3  
- Proxies static assets  
- Returns HTML/CSS/JS

---

### **2. Deploy Service**
Responsible for:
- Accepting deployment requests  
- Cloning GitHub repos  
- Preparing build job metadata  
- Pushing build jobs to Redis  

Used by:
- Web dashboard  
- CLI (future)  
- API triggers

---

### **3. Build Worker**
A Docker-isolated worker that:
- Pulls jobs from Redis queue  
- Spawns a fresh Docker container  
- Installs dependencies  
- Executes build commands  
- Streams logs  
- Uploads final artifacts to S3  

Output stored at:

```
s3://bucket/main/<projectId>/<buildId>/
```

---

### **4. Upload Service**
Handles:
- Static file uploads  
- Signed URLs  
- Metadata  
- File validation  
- Direct S3 operations  

---

### **5. Static File Server**
Used for:
- Production asset downloads  
- CDN-style serving  
- Optimized static serving for JS/CSS/Images  

---

### **6. Redis Queue / PubSub**
Used for:
- Build job scheduling  
- Realtime log streaming  
- Worker coordination  
- Deploy pipeline events  

---

### **7. Nginx Reverse Proxy**
Entry point for all public traffic.

Functions:
- Reverse proxy to route-handler  
- SSL termination  
- Dynamic routing based on domain  
- Caching static content  
- WebSocket proxy (for build logs)  

Example routing:

```
projectId.sunildev.com → route-handler
mycustomdomain.com → route-handler
```

---

## **Deployment Flow**

### **1. User triggers deployment**
- Code/upload → Deploy service  
- Repo cloned  
- Build job created  
- Job pushed into Redis queue  

### **2. Build worker handles job**
- Pulls job from queue  
- Builds using Docker  
- Streams logs  
- Stores output in S3  

### **3. Serving deployed site**
- Nginx intercepts request  
- Forwards to route-handler  
- Route-handler resolves correct build folder  
- Fetches index.html + assets from S3  
- Returns final site  

---

## **Key Features**
- Docker build isolation  
- Redis-based distributed queue  
- Real-time log streaming  
- S3-based artifact storage  
- Zero downtime routing  
- Dynamic domain/subdomain routing  
- Clean multi-service architecture  
- Production-grade reverse proxy (Nginx)

architechture diagram pdf

[vercelclone.pdf](https://github.com/user-attachments/files/23559241/vercelclone.pdf)

