import json
import re
import os

danh_sach_path = r"J:\Other computers\My Computer (2)\MTDES23\CLAUDE SKILL\Skills_Antigravity\DANH_SACH_SKILL.md"
skills_index_path = r"J:\Other computers\My Computer (2)\MTDES23\CLAUDE SKILL\Skills_Antigravity\skills_index.json"
output_path = r"C:\Users\NCPC\.gemini\antigravity\scratch\skill-marketplace\skills-data.json"

skills_list = []

# Parse 119 curated skills
if os.path.exists(danh_sach_path):
    with open(danh_sach_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Table pattern: | STT | **name** | description |
    pattern = r"\|\s*(\d+)\s*\|\s*\*\*([^\*]+)\*\*\s*\|\s*([^\|]+)\|"
    matches = re.findall(pattern, content)
    for stt, name, desc in matches:
        clean_name = name.strip()
        clean_desc = desc.strip()
        if clean_desc == "Chưa có mô tả" or clean_desc == ">-" or clean_desc == "/":
            clean_desc = f"Bộ kỹ năng {clean_name} chuyên dụng cho Antigravity và Claude Code."
        
        # Category estimation
        cat = "video-media"
        price = 199000
        tags = ["Antigravity", "Thực chiến"]
        
        if any(w in clean_name for w in ["video", "cut", "sfx", "subtitle", "audio", "voice", "caption", "remotion", "capcut", "gameplay", "talking-head"]):
            cat = "video-media"
            price = 249000
            tags.append("Video Editing")
        elif any(w in clean_name for w in ["tts", "speech", "whisper", "music", "sound", "elevenlabs"]):
            cat = "audio-voice"
            price = 299000
            tags.append("Voice AI")
        elif any(w in clean_name for w in ["3d", "blender", "rodin", "meshy", "tripo"]):
            cat = "3d-vfx"
            price = 349000
            tags.append("3D & VFX")
        elif any(w in clean_name for w in ["gsap", "motion", "animate", "ui", "design"]):
            cat = "design-motion"
            price = 199000
            tags.append("UI/UX Motion")
        elif "agent" in clean_name:
            cat = "agents"
            price = 399000
            tags.append("Multi-Agent")
        
        skills_list.append({
            "id": clean_name,
            "name": clean_name,
            "category": cat,
            "isCurated": True,
            "badge": "Hot Thực Chiến",
            "rating": 5.0,
            "reviewsCount": 48 + (int(stt) * 3) % 80,
            "price": price,
            "originalPrice": price + 150000,
            "description": clean_desc,
            "tags": tags,
            "downloads": 120 + (int(stt) * 17) % 350
        })

print(f"Parsed {len(skills_list)} curated skills.")

# Also supplement with top popular skills from skills_index.json
if os.path.exists(skills_index_path):
    with open(skills_index_path, "r", encoding="utf-8") as f:
        all_skills = json.load(f)
    
    curated_ids = set(s["id"] for s in skills_list)
    added = 0
    for s in all_skills:
        s_id = s.get("id")
        if s_id and s_id not in curated_ids:
            cat = s.get("category", "general")
            desc = s.get("description", "").strip()
            if not desc:
                desc = f"Kỹ năng tự động hóa {s.get('name', s_id)} chuẩn hóa."
            skills_list.append({
                "id": s_id,
                "name": s.get("name", s_id),
                "category": cat,
                "isCurated": False,
                "badge": "Chính Hãng" if s.get("risk") == "safe" else "Mở Rộng",
                "rating": 4.9,
                "reviewsCount": 15 + added % 30,
                "price": 99000,
                "originalPrice": 199000,
                "description": desc[:250] + ("..." if len(desc) > 250 else ""),
                "tags": [cat.capitalize(), "Claude/Agy"],
                "downloads": 50 + (added * 7) % 200
            })
            added += 1

print(f"Total skills in database: {len(skills_list)}")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(skills_list, f, ensure_ascii=False, indent=2)

print("Saved skills-data.json successfully.")
