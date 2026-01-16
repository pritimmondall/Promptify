# Raksha-AI: Privacy Guard for AI Chatbots

> **"Your Personal Firewall for AI Interactions."**
> A Chrome Extension that prevents accidental leakage of sensitive Indian PII (Personally Identifiable Information) to AI platforms like ChatGPT and Gemini.

---

## Table of Contents
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [System Architecture](#-system-architecture)
- [Data Flow](#-data-flow)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation Guide](#-installation-guide)
- [How to Use](#-how-to-use)

---

## 🚨 The Problem
AI chatbots collect massive amounts of user data. Users often accidentally paste sensitive information—like **Phone Numbers**, **PAN Cards**, or **Internal Code**—into prompts. Once sent, this data leaves your control and could potentially be used for model training.

## 💡 The Solution
**Raksha-AI** acts as a **Client-Side Interceptor**. It runs entirely in your browser, scanning your input in real-time. If it detects sensitive data, it:
1.  **Alerts** you visually (Red Badge).
2.  **Blocks** file uploads containing secrets.
3.  **Sanitizes** data automatically with "Smart Swap" (Pseudonymization).

---

## 🏗 System Architecture

This project follows a **Privacy-First Architecture**. No data is sent to any external server. Everything happens locally within the Chrome Browser.

```mermaid
graph TD
    subgraph Browser_Environment [User's Chrome Browser]
        User[User Input] -->|Types Prompt| DOM[Web Page DOM]
        
        subgraph Extension_Core [Raksha-AI Extension]
            Observer[Mutation Observer] -->|Watches| DOM
            Observer -->|Detects Input| Scanner[Regex Scanner Engine]
            
            Scanner -->|Match Found?| Logic{Sensitive Data?}
            
            Logic -->|Yes| UI[UI Overlay Manager]
            Logic -->|No| Silent[Stay Silent]
            
            UI -->|Trigger| Badge[Red Warning Badge]
            UI -->|Trigger| Block[Block Upload Event]
        end
        
        UI -->|User Clicks Clean| Cleaner[Sanitization Module]
        Cleaner -->|Replaces Text| DOM
    end
    
    DOM -->|Cleaned Data Only| ExternalAI[ChatGPT / Gemini Server]
