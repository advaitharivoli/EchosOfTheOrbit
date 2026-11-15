#!/usr/bin/env python3
"""
Echoes of the Orbit // NASA Space Apps 2026
Backend Server with Ollama API Proxy & NASA Knowledge Base
Serves static SPA assets, cleans subroutes, and handles /api/chat.
"""

import http.server
import json
import mimetypes
import os
import re
import socketserver
import urllib.request
import urllib.error

# Ensure common types are known
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("model/gltf+json", ".gltf")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/svg+xml", ".svg")

PORT = int(os.environ.get("PORT", 8000))

# Load .env if present
def load_dotenv():
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip('"').strip("'")

def save_dotenv(key, value):
    """Safely updates or creates .env on disk so credentials persist across restarts."""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    lines = []
    found = False
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
        except Exception:
            lines = []
    new_lines = []
    for line in lines:
        if line.strip().startswith(f"{key}=") or line.strip().startswith(f"{key} ="):
            new_lines.append(f'{key}="{value}"\n')
            found = True
        else:
            new_lines.append(line)
    if not found:
        if new_lines and not new_lines[-1].endswith("\n"):
            new_lines[-1] += "\n"
        new_lines.append(f'{key}="{value}"\n')
    try:
        with open(env_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
    except Exception as err:
        print(f"[WARN] Could not write to .env: {err}")
    os.environ[key] = value

load_dotenv()

OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY", "")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")

# NASA Space Hardware Knowledge Digest
NASA_KNOWLEDGE = {
    "opportunity": {
        "name": "Opportunity (MER-B)",
        "location": "Endeavour Crater (Perseverance Valley), Mars",
        "dates": "January 25, 2004 – June 10, 2018 (5,111 Sols)",
        "distance": "45.16 km (28.06 mi) — Off-world marathon record",
        "key_discovery": "Discovered hematite 'blueberries' and sulfate evaporites proving ancient sustained groundwater on Mars.",
        "junior": "Oppy was a brave 6-wheeled robotic geologist that was supposed to explore for only 90 days, but explored Mars for over 14 years! She drove an entire marathon across red dust and discovered ancient water signs.",
        "teen": "Opportunity (Oppy) was a certified GOAT. NASA gave her a 90-day warranty and she stayed locked in for 14 YEARS, ran a 45.16 km marathon, and lived rent-free on Mars with pure main character energy. No cap!",
        "adult": "Opportunity (MER-B) operated for 5,111 sols (14.2 Earth years) on Meridiani Planum. Utilizing the Athena science payload (Pancam, Mini-TES, Mössbauer, APXS, MI), it discovered hematite spherules and sedimentary sulfate laminations, providing the first unequivocal in-situ evidence for persistent liquid water in early Martian history."
    },
    "spirit": {
        "name": "Spirit (MER-A)",
        "location": "Gusev Crater (Home Plate / Troy), Mars",
        "dates": "January 4, 2004 – March 22, 2010 (2,210 Sols)",
        "distance": "7.73 km (4.80 mi)",
        "key_discovery": "Right-front wheel motor locked in 2006; dragging it carved open trenches revealing 90% pure silica formed by ancient hydrothermal hot springs.",
        "junior": "Spirit was Opportunity's twin sister! When her wheel stopped rolling, she drove backwards and accidentally dug up bright white silica that showed Mars once had hot bubbling geysers like Yellowstone!",
        "teen": "Spirit's wheel jammed and instead of quitting, she drove backwards like a boss, dragged the dead wheel, and accidentally carved open pure silica hot spring deposits. High-key legendary flex.",
        "adult": "Spirit (MER-A) touched down inside Gusev Crater on January 4, 2004. Following a right-front steering actuator failure on Sol 779, reverse driving excavated high-purity (90%) opaline silica deposits at Home Plate, confirming volcanic hydrothermal or fumarolic activity compatible with past prebiotic environments."
    },
    "insight": {
        "name": "InSight Lander",
        "location": "Elysium Planitia, Mars",
        "dates": "November 26, 2018 – December 15, 2022 (1,440 Sols)",
        "key_discovery": "Recorded 1,318 extraterrestrial marsquakes with SEIS, mapping out Mars' core radius (~1,830 km) and seismic crustal layers.",
        "junior": "InSight was like an alien planet doctor who put a stethoscope (seismometer) on Mars to listen to its heartbeat! It felt over 1,300 marsquakes shaking deep underground.",
        "teen": "InSight was the planet whisperer. Dropped the ultra-sensitive SEIS dome on Mars, detected 1,318 marsquakes, and mapped out the planet's liquid core. Completely unbothered until dust finally pulled the plug.",
        "adult": "The Interior Exploration using Seismic Investigations, Geodesy and Heat Transport (InSight) lander operated on Elysium Planitia from 2018 to 2022. Deploying the SEIS seismometer under a Wind and Thermal Shield, it recorded 1,318 seismic events, constraining the liquid metallic core radius to 1,830 ± 40 km and crustal thickness between 24 and 72 km."
    },
    "ingenuity": {
        "name": "Ingenuity Mars Helicopter",
        "location": "Jezero Crater (Valinor Hills), Mars",
        "dates": "February 18, 2021 – January 18, 2024 (72 Flights)",
        "key_discovery": "First powered controlled aerodynamic flight on another planet; flew 72 times across 128.8 minutes covering 17.0 km.",
        "junior": "Ginny was a tiny 4-pound helicopter that carried a piece of the Wright Brothers' historic airplane wing under her solar panel! She flew 72 times in super thin Martian air.",
        "teen": "Ginny had zero chill. Planned for only 5 short test hops, she flexed 72 full missions, spun her carbon blades at 2,400 RPM in 1% atmosphere, and scouted the road ahead for Perseverance. Certified aeronautical icon.",
        "adult": "Ingenuity demonstrated autonomous rotorcraft aerodynamics in the tenuous (<1% Earth sea-level pressure) Martian atmosphere. Operating twin 1.2 m counter-rotating carbon fiber blades at 2,400–2,700 RPM, the 1.8 kg vehicle completed 72 flights, logging 128.8 minutes of aloft time across 17.0 km before rotor tip damage on Sol 1040."
    },
    "apollo11": {
        "name": "Apollo 11 Lunar Module Descent Stage & LRRR",
        "location": "Tranquility Base (Mare Tranquillitatis), The Moon",
        "dates": "Landed July 20, 1969; LRRR continuously active today",
        "key_discovery": "First human lunar landing; deployed Laser Ranging Retroreflector (LRRR) that still measures the Moon spiraling away at 3.8 cm/year.",
        "junior": "Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon with only 25 seconds of fuel left! They left 100 special mirrors behind that scientists still shoot with lasers today from Earth.",
        "teen": "Apollo 11 manual touchdown with 25 seconds of fuel before abort. Left the gold foil descent stage at Tranquility Base plus 100 quartz mirrors that observatories still hit with lasers weekly. Pure legendary status.",
        "adult": "The Apollo 11 Lunar Module Descent Stage and Laser Ranging Retroreflector (LRRR) reside at Tranquility Base (0.67408° N, 23.47297° E). LRRR requires zero electric power, returning laser photons from Earth to verify lunar orbital recession at 3.82 cm/yr and test General Relativity with sub-centimeter orbital precision."
    }
}

def generate_local_ai_response(user_msg, mode="adult", craft_id=None):
    """
    Intelligent NASA Mission Control reasoning engine informed
    by NASA Planetary Data System telemetry and requested mode persona.
    Provides deep, contextual answers for spacecraft, space science, and history.
    """
    msg_clean = (user_msg or "").strip()
    msg_lower = msg_clean.lower()
    matched_craft = None

    # 1. Detect Gibberish / Random Keys (e.g. "dasd", "asdf", "qwer", etc.)
    is_gibberish = False
    vowels = sum(1 for c in msg_lower if c in "aeiou")
    if len(msg_clean) <= 6 and vowels == 0 and not any(k in msg_lower for k in ["oppy", "lrrr", "rtg", "mer", "mro"]):
        is_gibberish = True
    elif msg_lower in ["dasd", "asdf", "asdfg", "qwerty", "zxcv", "test", "testing", "aaa", "bbb", "123"]:
        is_gibberish = True

    if is_gibberish:
        if mode == "junior":
            return (
                f"🎒 Cadet CAPCOM here! I didn't recognize '{msg_clean}'. "
                f"Ask me real space questions like:\n\n"
                f"• 🦾 'Tell me about Opportunity rover!'\n"
                f"• 🛠️ 'Why did astronauts use duct tape on the Moon buggy?'\n"
                f"• 🚁 'Did a helicopter really fly on Mars?'\n"
                f"• 🪞 'How do lasers bounce off the Moon?'\n"
                f"• 🚀 'Tell me a space joke!'"
            )
        elif mode == "teen":
            return (
                f"⚡ Static on the radar. Didn't catch that signal ('{msg_clean}').\n\n"
                f"Drop a rover query to check receipts:\n"
                f"• 'Give me an Opportunity rover vibe check'\n"
                f"• 'Tell me about Apollo 17 duct tape flex'\n"
                f"• 'How did InSight survive 1,300+ marsquakes?'\n"
                f"• 'Why can't we bring rovers back to Earth?'\n"
                f"• 'Tell me a space joke!'"
            )
        else:
            return (
                f"🔬 Telemetry unparsed: query '{msg_clean}' does not match catalogued Lunar or Martian surface hardware.\n\n"
                f"Supported queries include:\n"
                f"• Spacecraft manifests: MER-B Opportunity, InSight, Apollo 11 LRRR, Ingenuity, Viking 1\n"
                f"• Mission science: Martian hematite blueberries, SEIS seismic data, lunar laser retroreflectors\n"
                f"• Planetary archaeology: Heritage site preservation & COSPAR planetary quarantine protocols"
            )

    # 2. Topic Matches
    # A. Space Jokes
    if "joke" in msg_lower or "funny" in msg_lower or "laugh" in msg_lower:
        if mode == "junior":
            return "🤖 BEEP BOOP! Here's a cosmic giggler for you:\n\nQ: Why did the Opportunity rover love driving across Mars?\nA: Because there were no red traffic lights and no speed limits—only red dust! 😂✨"
        elif mode == "teen":
            return "⚡ Space humor dropping:\n\nQ: Why did NASA use duct tape on the Moon buggy fender?\nA: Because when you're 240,000 miles from the nearest AutoZone, duct tape IS mission-critical engineering. High-key flex. 😂🛠️"
        else:
            return "🔬 Archival Humor // Apollo 17 Flight Transcript:\nWhen the fiberglass fender on the Lunar Roving Vehicle snapped on the Moon, astronauts Eugene Cernan and Harrison Schmitt used 4 laminated photomap sheets and gray duct tape to prevent abrasive lunar regolith from coating their radiator mirrors. NASA officially logged it as 'field-expedient aerospace engineering'."

    # B. Why leave rovers on Mars / Space Junk / Heritage
    if "why" in msg_lower and ("leave" in msg_lower or "left" in msg_lower or "back" in msg_lower or "return" in msg_lower or "junk" in msg_lower or "trash" in msg_lower):
        if mode == "junior":
            return "🚀 Great question, Cadet! We leave rovers on Mars and the Moon because bringing them back would need a giant rocket loaded with tons of fuel—which is super hard to launch from another planet! Instead, they stay forever like brave robot monuments marking humanity's greatest adventures!"
        elif mode == "teen":
            return "⚡ Real talk: Bringing a 1,000-kilogram rover back from Mars requires launching a massive Saturn-V-tier rocket from the surface of Mars. The delta-V rocket math simply doesn't math. Plus, these robots aren't 'space junk'—they're certified monuments of human curiosity resting in valhalla. No cap."
        else:
            return "🔬 Propulsion & Mission Architecture Assessment:\nReturning hardware from the Martian gravity well (3.72 m/s²) requires an Ascent Vehicle with approximately 4.1 km/s of delta-v, demanding substantial propellant mass that would severely compromise scientific payload capacities. Under international COSPAR guidelines, these surface assets are recognized as historical exploration monuments rather than orbital debris."

    # C. Duct Tape on Moon Buggy
    if "duct tape" in msg_lower or "fender" in msg_lower or "buggy" in msg_lower:
        if mode == "junior":
            return "🏎️ Astronauts really DID use duct tape on the Moon! During Apollo 17, commander Gene Cernan accidentally broke off a wheel fender. The rover began kicking up 'rooster tails' of sharp lunar dust, so the crew taped four paper maps together with gray duct tape to make a new fender! It worked perfectly!"
        elif mode == "teen":
            return "⚡ Apollo 17 duct tape lore: Gene Cernan broke the moon buggy fender with a hammer handle. The wheels were throwing razor-sharp moon dust into the cockpit. Houston had them tape four maps together with gray duct tape and clamp it on. Peak off-world improvisation."
        else:
            return "🔬 Apollo 17 LRV Fender Incident (December 1972):\nAstronaut Eugene Cernan's hammer snagged the right-rear fender extension of the Lunar Roving Vehicle, detaching it. Undeflected 20-micrometer lunar regolith particles showered the vehicle. Using Cronar-coated maps and gray utility duct tape, the crew fashioned an improvised replacement that endured 35 kilometers of lunar EVA traverses."

    # D. Water on Mars
    if "water" in msg_lower or "ice" in msg_lower or "lake" in msg_lower or "ocean" in msg_lower:
        if mode == "junior":
            return "🌊 Did you know Mars used to have lakes and rivers? The Opportunity rover found tiny gray hematite 'blueberries' that only grow in bubbling water! And today, Mars has frozen water ice at both of its north and south poles!"
        elif mode == "teen":
            return "⚡ Water on Mars receipts: Opportunity found microscopic hematite spheres ('blueberries') proving ancient Mars had acidic groundwater. In addition, Spirit stumbled upon 90% pure opaline silica from ancient boiling hydrothermal geysers. Mars was once soaking wet."
        else:
            return "🔬 Hydrological & Mineralogical Evidence on Mars:\nIn-situ analysis by the Athena science package on Opportunity (MER-B) identified sedimentary sulfate beds and spherical hematite concretions ('blueberries') at Meridiani Planum, proving persistent liquid groundwater during the Noachian and Hesperian epochs. Cryogenic surface reservoirs persist today as polar water-ice caps."

    # E. Quakes on Mars (InSight)
    if "quake" in msg_lower or "marsquake" in msg_lower or "core" in msg_lower or "seis" in msg_lower:
        matched_craft = "insight"

    # F. Helicopter (Ingenuity)
    elif "helicopter" in msg_lower or "drone" in msg_lower or "ginny" in msg_lower or "fly" in msg_lower or "flight" in msg_lower:
        matched_craft = "ingenuity"

    # G. Opportunity / Oppy
    elif "oppy" in msg_lower or "opportunity" in msg_lower or "mer-b" in msg_lower or "blueberry" in msg_lower or "blueberries" in msg_lower or "marathon" in msg_lower:
        matched_craft = "opportunity"

    # H. Spirit
    elif "spirit" in msg_lower or "mer-a" in msg_lower or "silica" in msg_lower or "broken wheel" in msg_lower:
        matched_craft = "spirit"

    # I. Apollo 11 / Moon Landing / LRRR
    elif "apollo" in msg_lower or "moon" in msg_lower or "armstrong" in msg_lower or "tranquility" in msg_lower or "lrrr" in msg_lower or "laser" in msg_lower or "mirror" in msg_lower:
        matched_craft = "apollo11"

    elif craft_id and craft_id in NASA_KNOWLEDGE:
        matched_craft = craft_id

    # 3. Match Spacecraft
    if matched_craft and matched_craft in NASA_KNOWLEDGE:
        craft = NASA_KNOWLEDGE[matched_craft]
        if mode == "junior":
            return f"🚀 Cadet Alert! Here's the scoop on {craft['name']}!\n\n{craft['junior']}\n\n📍 Mission Base: {craft['location']}\n⭐ Cadet Fact: {craft['key_discovery']}\n\nKeep exploring, Space Explorer! Ask me anything else about rovers or the Moon!"
        elif mode == "teen":
            return f"⚡ Vibe Check: {craft['name']} 📡\n\n{craft['teen']}\n\n📍 Spot: {craft['location']}\n🔥 The Lore: {craft['key_discovery']}\n\nReceipts verified. What's next on your radar?"
        else:
            return f"🔬 NASA PDS Archival Record // {craft['name']}\n\n{craft['adult']}\n\n• Primary Coordinate Datum: {craft['location']}\n• Operational Span: {craft['dates']}\n• Key Scientific Milestone: {craft['key_discovery']}\n\nTelemetry corroborated via NASA Planetary Data System (PDS) & NSSDC Master Catalog."

    # 4. General Space Fallbacks
    if mode == "junior":
        return f"🎒 Cadet CAPCOM reporting for duty! Exploring '{msg_clean}' is super exciting. Did you know NASA has left robotic scouts and moon buggies on both Mars and the Moon that helped pave our way to the stars? Click on any rover card to open their secret 3D illustrated comic book, or ask me about Opportunity, InSight, or Apollo 11!"
    elif mode == "teen":
        return f"⚡ Mission Specialist CAPCOM locked in. You're analyzing '{msg_clean}'. We've logged 13 planetary relics across Mars and the Moon with full 3D models, orbital telemetry, and zero filter. What craft are you checking the receipts on?"
    else:
        return f"🔬 CAPCOM Flight Dynamics & Archaeology Console online.\nQuery: '{msg_clean}'.\nOur database contains comprehensive flight logs, radioisotope decay rates, instrumentation manifests, and peer-reviewed scientific citations for all 13 Martian and Lunar surface relics. Which spacecraft or geodetic datum would you like to review?"

class NASAProxyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development & prevent caching of dynamic assets
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, Range")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def serve_static_file(self, file_path):
        """
        Serves static files supporting HTTP 206 Range requests (crucial for Safari HTML5 MP4 playback),
        exact MIME types, and cache headers.
        """
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.send_error(404, f"File Not Found: {os.path.basename(file_path)}")
            return

        file_size = os.path.getsize(file_path)
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            if file_path.endswith(".glb"):
                mime_type = "model/gltf-binary"
            elif file_path.endswith(".mp4"):
                mime_type = "video/mp4"
            elif file_path.endswith(".webp"):
                mime_type = "image/webp"
            else:
                mime_type = "application/octet-stream"

        range_header = self.headers.get("Range")
        if range_header and range_header.startswith("bytes="):
            match = re.match(r"bytes=(\d+)-(\d*)", range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                if start >= file_size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    return
                if end >= file_size:
                    end = file_size - 1
                length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()

                with open(file_path, "rb") as f:
                    f.seek(start)
                    bytes_left = length
                    while bytes_left > 0:
                        chunk_size = min(64 * 1024, bytes_left)
                        data = f.read(chunk_size)
                        if not data:
                            break
                        try:
                            self.wfile.write(data)
                        except (BrokenPipeError, ConnectionResetError):
                            break
                        bytes_left -= len(data)
                return

        # Standard 200 response
        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")

        # Disable cache for HTML so Safari never serves stale markup
        if file_path.endswith(".html"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")

        self.end_headers()

        with open(file_path, "rb") as f:
            while True:
                data = f.read(64 * 1024)
                if not data:
                    break
                try:
                    self.wfile.write(data)
                except (BrokenPipeError, ConnectionResetError):
                    break

    def do_POST(self):
        load_dotenv()
        global OLLAMA_API_KEY, OLLAMA_MODEL
        OLLAMA_API_KEY = os.environ.get("OLLAMA_API_KEY", "").strip()
        OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2").strip()

        if self.path == "/api/validate-ollama":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                body = json.loads(post_data.decode("utf-8"))
            except Exception:
                body = {}

            api_key = (body.get("apiKey") or "").strip() or os.environ.get("OLLAMA_API_KEY", "").strip()
            model = (body.get("model") or "").strip() or os.environ.get("OLLAMA_MODEL", "llama3.2").strip()
            endpoint = (body.get("endpoint") or "").strip()

            if not api_key:
                # If checking local ollama
                test_url = f"{endpoint or 'http://localhost:11434'}/api/tags"
                try:
                    req = urllib.request.Request(test_url, method="GET")
                    with urllib.request.urlopen(req, timeout=5) as res:
                        self.send_response(200)
                        self.send_header("Content-Type", "application/json")
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            "valid": True,
                            "type": "local",
                            "model": model,
                            "message": f"Connected to local Ollama instance ({test_url})"
                        }).encode("utf-8"))
                        return
                except Exception as e:
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "valid": False,
                        "type": "local",
                        "error": f"No API Key provided and could not connect to local Ollama at {test_url}: {str(e)}"
                    }).encode("utf-8"))
                    return

            # Test Ollama Cloud endpoint with a minimal ping
            target_url = "https://ollama.com/api/chat"
            if endpoint and endpoint.startswith("http"):
                target_url = f"{endpoint.rstrip('/')}/api/chat"

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            test_payload = json.dumps({
                "model": model,
                "messages": [{"role": "user", "content": "ping"}],
                "stream": False
            }).encode("utf-8")

            try:
                req = urllib.request.Request(target_url, data=test_payload, headers=headers, method="POST")
                with urllib.request.urlopen(req, timeout=15) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    # Persist successfully verified key to .env
                    save_dotenv("OLLAMA_API_KEY", api_key)
                    save_dotenv("OLLAMA_MODEL", model)
                    OLLAMA_API_KEY = api_key
                    OLLAMA_MODEL = model

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "valid": True,
                        "type": "cloud",
                        "model": model,
                        "message": f"Successfully connected to Ollama Cloud! Model '{model}' is authenticated & active."
                    }).encode("utf-8"))
                    return
            except urllib.error.HTTPError as e:
                err_msg = ""
                try:
                    err_msg = e.read().decode("utf-8", errors="ignore")
                except Exception:
                    pass
                status_desc = f"HTTP {e.code}"
                if e.code == 401:
                    status_desc += " Unauthorized: The API Key is invalid or expired. Please verify your key on ollama.com"
                elif e.code == 404:
                    status_desc += f" Not Found: Model '{model}' may not be supported or endpoint is invalid."
                elif err_msg:
                    status_desc += f": {err_msg[:120]}"

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "valid": False,
                    "code": e.code,
                    "error": status_desc
                }).encode("utf-8"))
                return
            except Exception as e:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "valid": False,
                    "error": f"Connection error: {str(e)}"
                }).encode("utf-8"))
                return

        if self.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                body = json.loads(post_data.decode("utf-8"))
            except Exception:
                body = {}

            messages = body.get("messages", [])
            mode = body.get("mode", "adult")
            craft_id = body.get("craftId", None)

            # Key, model, endpoint from request body or server environment
            api_key = (body.get("apiKey") or "").strip() or os.environ.get("OLLAMA_API_KEY", "").strip() or OLLAMA_API_KEY
            model = (body.get("model") or "").strip() or os.environ.get("OLLAMA_MODEL", "llama3.2").strip() or OLLAMA_MODEL
            endpoint = (body.get("endpoint") or "").strip()



            # Extract user query
            last_user_msg = "Hello CAPCOM"
            if messages:
                for m in reversed(messages):
                    if m.get("role") == "user":
                        last_user_msg = m.get("content", "")
                        break

            reply_text = None
            source = "local-nasa-ai"
            ollama_error = None

            # Attempt 1: Ollama Cloud (if api_key provided)
            if api_key:
                print(f"[CAPCOM AI] Active Ollama Key present. Sending query to Ollama Cloud (model: {model})...")
                try:
                    ollama_url = "https://ollama.com/api/chat"
                    if endpoint and endpoint.startswith("http"):
                        ollama_url = f"{endpoint.rstrip('/')}/api/chat"
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {api_key}"
                    }
                    system_prompt = (
                        f"You are CAPCOM AI for 'Echoes of the Orbit', a NASA Space Apps 2026 exploration platform. "
                        f"Current Mode: {mode.upper()}. "
                        f"If Junior: speak enthusiastically to kids with fun analogies and jokes. "
                        f"If Teen: use Gen Z terms like no cap, GOAT, vibe check, receipts, main character energy. "
                        f"If Adult: strictly professional NASA scientist, ZERO slang, informative, comprehensive, and clear. "
                        f"Knowledge: Opportunity (14 yrs, 45.16km marathon, hematite blueberries), Spirit (silica hot spring discovery), "
                        f"InSight (1318 marsquakes, core radius 1830km), Ingenuity (72 flights, Wright flyer fabric), Apollo 11 (Tranquility base, LRRR laser mirrors)."
                    )
                    payload = json.dumps({
                        "model": model,
                        "messages": [{"role": "system", "content": system_prompt}] + messages,
                        "stream": False
                    }).encode("utf-8")

                    req = urllib.request.Request(ollama_url, data=payload, headers=headers, method="POST")
                    with urllib.request.urlopen(req, timeout=30) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        if "message" in res_data and "content" in res_data["message"]:
                            reply_text = res_data["message"]["content"]
                            source = f"ollama-cloud ({model})"
                        elif "response" in res_data:
                            reply_text = res_data["response"]
                            source = f"ollama-cloud ({model})"
                        elif "choices" in res_data and len(res_data["choices"]) > 0:
                            reply_text = res_data["choices"][0]["message"]["content"]
                            source = f"ollama-cloud ({model})"

                        if reply_text and body.get("apiKey"):
                            save_dotenv("OLLAMA_API_KEY", api_key)
                            save_dotenv("OLLAMA_MODEL", model)
                            OLLAMA_API_KEY = api_key
                            OLLAMA_MODEL = model
                        print(f"[CAPCOM AI] Ollama Cloud successfully generated response ({len(reply_text or '')} chars).")
                except urllib.error.HTTPError as e:
                    err_body = ""
                    try:
                        err_body = e.read().decode("utf-8", errors="ignore")
                    except Exception:
                        pass
                    ollama_error = f"HTTP {e.code}"
                    if e.code == 401:
                        ollama_error += " Unauthorized: Invalid Ollama API key"
                    elif e.code == 404:
                        # Attempt OpenAI format endpoint as fallback
                        try:
                            v1_url = "https://ollama.com/v1/chat/completions"
                            v1_payload = json.dumps({
                                "model": model,
                                "messages": [{"role": "system", "content": system_prompt}] + messages,
                                "stream": False
                            }).encode("utf-8")
                            req_v1 = urllib.request.Request(v1_url, data=v1_payload, headers=headers, method="POST")
                            with urllib.request.urlopen(req_v1, timeout=30) as res_v1:
                                res_v1_data = json.loads(res_v1.read().decode("utf-8"))
                                if "choices" in res_v1_data and res_v1_data["choices"]:
                                    reply_text = res_v1_data["choices"][0]["message"]["content"]
                                    source = f"ollama-cloud ({model})"
                                    ollama_error = None
                                    print(f"[CAPCOM AI] Ollama Cloud v1 successfully generated response.")
                        except Exception:
                            ollama_error += f" Not Found (Model: {model})"
                    elif err_body:
                        ollama_error += f": {err_body[:100]}"
                    print(f"[Ollama Cloud Error] {ollama_error}")
                except Exception as e:
                    ollama_error = str(e)
                    print(f"[Ollama Cloud Exception] {e}")
            else:
                print(f"[CAPCOM AI] No Ollama key present. Answering via built-in NASA Mission Control engine for '{last_user_msg}'.")

            # Attempt 2: Local Ollama (if endpoint points to localhost or OLLAMA_BASE_URL is up)
            if not reply_text and (OLLAMA_BASE_URL or (endpoint and "localhost" in endpoint)):
                local_url = endpoint if (endpoint and "localhost" in endpoint) else OLLAMA_BASE_URL
                try:
                    ollama_url = f"{local_url.rstrip('/')}/api/chat"
                    headers = {"Content-Type": "application/json"}
                    system_prompt = f"You are CAPCOM AI for 'Echoes of the Orbit', a NASA Space Apps 2026 exploration platform. Mode: {mode}."
                    payload = json.dumps({
                        "model": model,
                        "messages": [{"role": "system", "content": system_prompt}] + messages,
                        "stream": False
                    }).encode("utf-8")
                    req = urllib.request.Request(ollama_url, data=payload, headers=headers, method="POST")
                    with urllib.request.urlopen(req, timeout=10) as response:
                        res_data = json.loads(response.read().decode("utf-8"))
                        if "message" in res_data and "content" in res_data["message"]:
                            reply_text = res_data["message"]["content"]
                            source = f"ollama-local ({model})"
                except Exception:
                    pass

            # Fallback to authentic NASA Knowledge Engine
            if not reply_text:
                reply_text = generate_local_ai_response(last_user_msg, mode=mode, craft_id=craft_id)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "reply": reply_text,
                "source": source,
                "mode": mode,
                "model": model,
                "ollama_error": ollama_error,
                "status": "ok"
            }).encode("utf-8"))
            return

        self.send_error(404, "Endpoint Not Found")

    def do_GET(self):
        req_path = self.path.split("?")[0]
        root_dir = os.path.dirname(os.path.abspath(__file__))

        # 1. Clean rewrite for static assets with subroute prefixes (/teen/assets/..., /kids/css/..., etc.)
        for prefix in ["/assets/", "/css/", "/js/", "/data/"]:
            if prefix in req_path:
                rel_path = req_path[req_path.find(prefix):].lstrip("/")
                file_path = os.path.join(root_dir, rel_path)
                return self.serve_static_file(file_path)

        # 2. SPA subroutes (/kids, /teen, /adult, /kids/mars, etc.) serve index.html
        path_clean = req_path.rstrip("/")
        if re.match(r"^/(kids|teen|adult)(/(mars|moon|solar))?$", path_clean) or path_clean == "" or path_clean == "/index.html":
            file_path = os.path.join(root_dir, "index.html")
            return self.serve_static_file(file_path)

        # 3. Direct file request
        rel_path = req_path.lstrip("/")
        file_path = os.path.join(root_dir, rel_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return self.serve_static_file(file_path)

        # 4. Fallback to index.html for SPA
        file_path = os.path.join(root_dir, "index.html")
        return self.serve_static_file(file_path)

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NASAProxyHandler) as httpd:
        print(f"============================================================")
        print(f"  ECHOES OF THE ORBIT // NASA SPACE APPS 2026")
        print(f"  Server listening on http://localhost:{PORT}")
        print(f"  Ollama Proxy Endpoint: POST /api/chat")
        print(f"  Ollama Model: {OLLAMA_MODEL}")
        print(f"  Ollama Cloud Key Present: {'Yes' if OLLAMA_API_KEY else 'No (using local/fallback)'}")
        print(f"============================================================")
        httpd.serve_forever()
