/**
 * ECHOES OF THE ORBIT - NASA Discarded Equipment Database
 * Curated from official NASA archives:
 * - NASA Space Science Data Coordinated Archive (NSSDCA)
 * - NASA Planetary Data System (PDS)
 * - Lunar Reconnaissance Orbiter Camera (LROC) Anthropogenic Target Database
 * - Mars Reconnaissance Orbiter (HiRISE) Surface Observations
 * - NASA Solar System Treks (trek.nasa.gov)
 */

export const PLANETS_DATA = {
    mars: {
        id: "mars",
        name: "Mars",
        subtitle: "The Red Planet - Pioneers of the Iron Plains",
        color: 0xcc5533,
        atmosphereColor: 0xdd7755,
        radius: 3.5,
        textureMap: "https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg",
        gravity: "3.721 m/s²",
        temperature: "-63°C (-81°F)",
        atmosphere: "95.3% CO₂",
        artifactsCount: 7,
        description: "Across the iron-rich dust plains of Mars rest the silent robotic scouts and landing components that paved humanity's trail to an alien world."
    },
    moon: {
        id: "moon",
        name: "The Moon",
        subtitle: "Earth's Celestial Companion - Humanity's First Outpost",
        color: 0x999999,
        atmosphereColor: 0x444455,
        radius: 3.2,
        gravity: "1.62 m/s²",
        temperature: "-130°C to +120°C",
        atmosphere: "Near vacuum (exosphere)",
        artifactsCount: 6,
        description: "On the airless lunar regolith, Apollo descent stages, retroreflectors, and robotic landers sit preserved in the silent vacuum."
    }
};

export const EQUIPMENT_DATABASE = [
    // ================= MARS ARTIFACTS =================
    {
        id: "mer-b-opportunity",
        planet: "mars",
        name: "Opportunity (MER-B)",
        designation: "Mars Exploration Rover B",
        nickname: "Oppy",
        category: "Mobile Robotic Rover",
        launchDate: "July 7, 2003",
        landingDate: "January 25, 2004",
        finalTransmissionDate: "June 10, 2018 (Sol 5111)",
        missionConclusionDate: "February 13, 2019 (NASA Official)",
        status: "Mission Concluded (Silent)",
        physicalCondition: "Intact, dust-covered chassis in Perseverance Valley",
        coordinates: { lat: -2.34, lon: 354.67 },
        coordinateMetadata: {
            lat: -2.34,
            lon: 354.67,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±10 m",
            sourceObservation: "MRO HiRISE ESP_056972_1775"
        },
        locationName: "Perseverance Valley, Endeavour Crater",
        operationalLifespan: "14 years, 136 days (5,111 Sols; planned for 90 Sols)",
        totalDistance: "45.16 km (28.06 mi)",
        imagePath: "assets/renders/opportunity.png",
        modelPath: "assets/models/opportunity.glb",
        videoPath: "assets/Videos/opportunity.mp4",
        meshyModelKeyword: "mars exploration rover opportunity robotic vehicle",
        nasaNssdcId: "2003-032A",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=-5.33&y=-2.34&z=10",
        audioTelemetryType: "rover-fade",
        lastTransmissionMessage: {
            telemetry: "BATTERY: 10.4V | TAU DUST INDEX: 10.8 (EXTREME) | SOLAR ARRAY CURRENT: < 22 W-hrs",
            quote: "\"My battery is low and it's getting dark.\"",
            actualContext: "On Sol 5111, a planetary-scale dust storm enveloped Endeavour Crater, blocking sunlight. The rover transmitted its final telemetry packet indicating severe power depletion before losing communication."
        },
        scientificContributions: [
            "Discovered spherical hematite concretions ('blueberries'), the first mineral evidence of ancient standing acidic liquid water on Mars.",
            "Traversed 45.16 kilometers, establishing the all-time off-world driving record for any robotic vehicle.",
            "Characterized clay minerals (smectites) at Endeavour Crater indicating ancient neutral-pH water conditions."
        ],
        storytelling: {
            adultTagline: "The Benchmark of Long-Duration Planetary Surface Exploration",
            adultNarrative: "Launched by NASA on July 7, 2003, Opportunity arrived at Meridiani Planum on Mars on January 25, 2004. Originally engineered for a 90-day baseline mission, the rover operated for an unprecedented 5,111 Martian days (over 14.5 Earth years). Opportunity transformed planetary science by discovering millimeter-sized hematite spherules nicknamed 'blueberries' and sulfate evaporites in Eagle Crater, providing humanity's first direct physical proof of ancient standing liquid water on Mars. Traversing 45.16 kilometers across Victoria and Endeavour craters, Opportunity conducted extensive field geology before a global dust storm depleted its solar power in June 2018. It remains humanity's longest-distance off-world driving mission.",
            adultWhyMatters: "Opportunity confirmed that ancient Mars possessed sustained, neutral to mildly acidic water environments capable of supporting microbial habitability. Its technological longevity established new standards for planetary robotics, demonstrating that complex mechanical systems can survive extreme thermal cycles and dust storms far beyond their original design lifespan.",
            adultConclusion: "On June 10, 2018 (Sol 5111), an immense global dust storm darkened Endeavour Crater, elevating atmospheric optical depth (tau) above 10.8 and depriving the solar arrays of sunlight. After transmitting its final telemetry packet, Opportunity entered low-power hibernation. NASA concluded recovery efforts on February 13, 2019, designating the rover a permanent surface monument in Perseverance Valley.",
            genZTagline: "Certified GOAT that survived 15 years instead of 90 days. Main character energy, no cap.",
            genZNarrative: "Bro, NASA built me to last literally 90 days. Everyone thought I was gonna get cooked by Martian dust in 3 months. But dust devils swept my solar panels clean and I said 'not today'. I drove 28 miles across an alien planet, did donuts around Victoria Crater, and set the all-time off-world driving record. In 2018, a planet-wide dust storm shut down the sun, so I beamed back the most heartbreaking text in history: 'My battery is low and it's getting dark.' Slept like an absolute king beneath the red sand. Iconic behavior fr fr.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Oppy proved Mars wasn't just a dead rock\u2014it used to have actual liquid water lakes. Put some respect on this robot's name! Absolute legend.",
            genZStatus: "RESTING IN VALHALLA // CERTIFIED GOAT \ud83d\udc51",
            tagline: "The Little Rover That Outlived Everyone's Expectations",
            perspectiveNarrative: "I was only built to roll for 90 Martian days. Engineers feared Martian dust would smother my solar panels in months. Instead, Martian dust devils swept my arrays clean time and again. I rolled across vast plains, peered into Victoria Crater, and climbed the rim of Endeavour. In 2018, a dark planetary dust storm shrouded the Sun. I transmitted my last health data, folded my robotic arm, and rested beneath the red dust.",
            juniorSummary: "Opportunity was a plucky solar-powered robot built to last only 3 months, but kept exploring for over 14 years! It found tiny gray pebbles nicknamed 'blueberries' that proved Mars once had water lakes.",
            juniorJoke: {
                question: "Why did the Opportunity rover love driving across Mars?",
                punchline: "Because there were no speed limits and no red traffic lights—only red dust!"
            },
            whyItMatters: "Opportunity established that Mars was once a warm, wet environment with conditions capable of supporting microbial life."
        }
    },
    {
        id: "mer-a-spirit",
        planet: "mars",
        name: "Spirit (MER-A)",
        designation: "Mars Exploration Rover A",
        nickname: "Spirit",
        category: "Mobile Robotic Rover",
        launchDate: "June 10, 2003",
        landingDate: "January 4, 2004",
        finalTransmissionDate: "March 22, 2010 (Sol 2210)",
        missionConclusionDate: "May 25, 2011 (NASA Official)",
        status: "Mission Concluded (Silent)",
        physicalCondition: "Stationary, entrapped in sulfate soil at Troy",
        coordinates: { lat: -14.57, lon: 175.48 },
        coordinateMetadata: {
            lat: -14.57,
            lon: 175.48,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±15 m",
            sourceObservation: "MRO HiRISE ESP_016764_1655"
        },
        locationName: "Troy, West of Home Plate, Gusev Crater",
        operationalLifespan: "6 years, 77 days (2,210 Sols; planned for 90 Sols)",
        totalDistance: "7.73 km (4.80 mi)",
        imagePath: "assets/renders/spirit.jpg",
        modelPath: "assets/models/opportunity.glb",
        meshyModelKeyword: "spirit rover mars exploration robot",
        nasaNssdcId: "2003-027A",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=175.48&y=-14.57&z=10",
        audioTelemetryType: "solar-deplete",
        lastTransmissionMessage: {
            telemetry: "RIGHT FRONT WHEEL: SEIZED (DRAGGED) | TILT: SOUTH DEFICIT | POWER: 134 W-hrs",
            quote: "\"Even anchored in the sands of Troy, I never stopped studying the sky.\"",
            actualContext: "After its front wheel jammed in 2006, Spirit drove backward. In 2009, it broke through a thin crust into loose sulfate sand at Troy. Tilted away from winter sunlight, its power levels dropped below survival thresholds."
        },
        scientificContributions: [
            "Accidentally churned up bright white soil composed of 90% pure silica with its dragged wheel, identifying ancient volcanic hydrothermal vents.",
            "Captured the first color photograph of an Earth sunset seen from another planetary surface.",
            "Discovered carbonate deposits in the Columbia Hills, proving ancient volcanic hydrothermal activity was non-acidic."
        ],
        storytelling: {
            adultTagline: "Pioneer of Gusev Crater & Discovery of Ancient Hydrothermal Systems",
            adultNarrative: "Spirit touched down in Gusev Crater on January 4, 2004, targeting an ancient impact basin suspected of having once held a crater lake. While the basaltic plains showed evidence of past volcanic flows, Spirit climbed into the Columbia Hills and uncovered ancient hydrothermal environments. In 2006, after its right-front wheel seized, flight controllers commanded the rover to drive in reverse. The jammed wheel carved a trench through the topsoil, exposing bright white soil composed of 90% pure silica. This discovery proved that early Mars hosted active geothermal hot springs or steam vents where microbial life could have flourished.",
            adultWhyMatters: "Spirit demonstrated how mechanical failure can be transformed into serendipitous scientific discovery. Its findings confirmed that ancient Mars experienced dynamic volcanic hydrothermal activity similar to Yellowstone National Park, with localized environments that remained habitable long after surface rivers dried up.",
            adultConclusion: "In May 2009 (Sol 1892), Spirit broke through a crust of bright soil into loose sulfate sand at Troy and became immobilized. Despite operating as a stationary science platform, its southward tilt during the Martian winter prevented sufficient solar power generation. The final transmission occurred on March 22, 2010 (Sol 2210), and NASA formally concluded the mission on May 25, 2011.",
            genZTagline: "The rebellious twin that dragged a broken wheel 4 miles backwards and still cooked.",
            genZNarrative: "I'm Opportunity's twin, but I chose pure chaos. My front-right wheel motor completely jammed, so what did I do? I drove 4 miles BACKWARDS, dragging that dead wheel through the Martian dirt like a stubborn plow. And guess what? Dragging that broken wheel accidentally scraped open bright white silica dust that proved Mars used to have boiling hydrothermal hot springs! Talk about failing upwards. Got stuck in a sand trap at Troy in 2010, but I went out doing pure science. Certified chaotic good.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Spirit literally broke a wheel and turned it into one of the biggest Mars water discoveries ever. Elite mindset, no cap.",
            genZStatus: "CHILLING AT TROY // CHAOTIC SCIENTIST \u26a1",
            tagline: "Turned a Mechanical Injury Into a Landmark Discovery",
            perspectiveNarrative: "When my right front wheel seized, ground teams instructed me to drive backward, dragging the dead wheel like a plow. That dragged wheel sliced open the red dirt and unearthed brilliant white silica—evidence of ancient bubbling hydrothermal springs. When I became stuck at Troy, I spent my final months serving as a stationary weather station.",
            juniorSummary: "Spirit had a broken wheel that it dragged behind it like a plow. But that broken wheel scraped open the red dirt and found super-white powder, proving ancient hot springs on Mars!",
            juniorJoke: {
                question: "What is an astronaut's favorite key on the keyboard?",
                punchline: "The Space bar!"
            },
            whyItMatters: "Spirit showed how robotic field anomalies can lead directly to unexpected scientific breakthroughs."
        }
    },
    {
        id: "insight-lander",
        planet: "mars",
        name: "InSight Lander",
        designation: "Interior Exploration using Seismic Investigations, Geodesy and Heat Transport",
        nickname: "Mars' Heartbeat Listener",
        category: "Stationary Geophysical Laboratory",
        launchDate: "May 5, 2018",
        landingDate: "November 26, 2018",
        finalImageDate: "December 11, 2022 (Sol 1436)",
        finalTransmissionDate: "December 15, 2022 (Sol 1442)",
        missionConclusionDate: "December 21, 2022 (NASA Official)",
        status: "Mission Concluded (Silent)",
        physicalCondition: "Intact lander, solar panels heavily dust-coated, SEIS dome deployed on surface",
        coordinates: { lat: 4.50, lon: 135.62 },
        coordinateMetadata: {
            lat: 4.502,
            lon: 135.623,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±5 m",
            sourceObservation: "MRO HiRISE ESP_057939_1845"
        },
        locationName: "Elysium Planitia ('The Biggest Parking Lot on Mars')",
        operationalLifespan: "4 years, 19 days (1,442 Sols)",
        totalDistance: "Stationary Geophysical Laboratory",
        modelPath: "assets/models/insight.glb",
        videoPath: "assets/Videos/insight.mp4",
        imagePath: "assets/insight_lander.webp",
        meshyModelKeyword: "insight lander mars solar panels seismometer",
        nasaNssdcId: "2018-042A",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=135.62&y=4.50&z=10",
        audioTelemetryType: "seismic-pulse",
        lastTransmissionMessage: {
            telemetry: "BATTERY BUS: 11.1V (CRITICAL) | SEIS STATUS: STANDBY | DUST COATING: >88%",
            quote: "\"My power’s really low, so this may be the last image I can send...\"",
            actualContext: "InSight captured its final surface image on December 11, 2022 (Sol 1436). Four days later, on December 15, 2022 (Sol 1442), it transmitted its final raw telemetry packet to Earth. After two consecutive missed communication passes, NASA announced the official mission conclusion on December 21, 2022."
        },
        scientificContributions: [
            "Detected 1,319 marsquakes using the ultra-sensitive SEIS instrument, providing the first seismic ultrasound of the Martian interior.",
            "Measured the thickness of Mars' crust (24 to 72 km) and revealed a large molten liquid metallic core with a radius of approximately 1,830 km.",
            "Recorded seismic and acoustic waves generated by meteoroid impacts, directly linking new craters to seismic waveforms."
        ],
        storytelling: {
            adultTagline: "The First Comprehensive Geophysical Mapping of the Martian Interior",
            adultNarrative: "Touching down on the smooth volcanic plains of Elysium Planitia on November 26, 2018, the InSight lander was NASA's first mission dedicated to exploring the deep interior of Mars. Using its French-built Seismic Experiment for Interior Structure (SEIS), InSight recorded 1,319 marsquakes ranging up to magnitude 4.7. By analyzing the speed and refraction of these seismic waves through the planet, InSight resolved the crustal thickness to between 24 and 72 kilometers, detected an unexpectedly thick lithosphere, and confirmed that Mars possesses a large, molten liquid metallic core with an ~1,830 km radius.",
            adultWhyMatters: "InSight answered fundamental questions about planetary formation in the early solar system, proving that Mars is not geophysically dead but remains seismically active, with active magma chambers beneath Cerberus Fossae and continuous meteorite impact events.",
            adultConclusion: "Over four Earth years, red dust accumulated continuously on InSight's ultra-thin solar arrays. On December 15, 2022 (Sol 1442), InSight transmitted its final telemetry packet across the Deep Space Network. NASA officially declared the mission concluded on December 21, 2022, following two consecutive missed communications passes.",
            genZTagline: "Mars' personal therapist. Put headphones on the ground and listened to 1,300+ marsquakes.",
            genZNarrative: "While other rovers were zooming around, I stayed in one spot at Elysium Planitia and put my ear to the ground. I had ultra-sensitive seismometers that listened to Mars' literal heartbeat. I caught over 1,300 marsquakes and meteor strikes slamming into the crust! Found out Mars has a molten liquid core and a crust thinner than scientists thought. Solar panels got covered in dust in 2022, but I listened to an entire planet's internal drama for 4 years straight. 10/10 no notes.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Gave us the first ever 3D internal ultrasound of another planet's core. Basically listened to Mars venting for 4 years.",
            genZStatus: "RETIRED LISTENER // 1,300+ QUAKES LOGGED \ud83c\udfa7",
            tagline: "The Quiet Listener That Heard the Pulse of Mars",
            perspectiveNarrative: "I did not roam across dunes. I settled on the smooth basalt plains of Elysium Planitia and set down my ultra-sensitive SEIS dome. Protected by a wind and thermal shield, I listened to the deep interior of Mars. I detected over 1,300 marsquakes and felt the reverberation of distant meteor strikes. Dust steadily accumulated across my circular solar arrays until power dropped below computer requirements. On December 11, 2022, I snapped my final image of the plain, and four days later transmitted my final telemetry packet.",
            juniorSummary: "InSight did not have wheels—it sat completely still with an ultra-sensitive electronic stethoscope placed on the Martian ground. It listened to over 1,300 'marsquakes' inside the planet!",
            juniorJoke: {
                question: "Why did InSight listen to Mars' heartbeat?",
                punchline: "Because it wanted to know if Mars had rock-and-roll in its core!"
            },
            whyItMatters: "InSight provided humanity with the first complete map of the crust, mantle, and molten core of another terrestrial planet."
        }
    },
    {
        id: "ingenuity-helicopter",
        planet: "mars",
        name: "Ingenuity Mars Helicopter",
        designation: "Mars Helicopter / Scout Rotorcraft",
        nickname: "Ginny",
        category: "Atmospheric Rotorcraft",
        launchDate: "July 30, 2020",
        landingDate: "February 18, 2021",
        finalFlightDate: "January 18, 2024 (Flight 72)",
        missionConclusionDate: "January 25, 2024 (NASA Official)",
        status: "Mission Concluded",
        physicalCondition: "Upright, resting on landing gear; rotor blade damage sustained during Flight 72",
        coordinates: { lat: 18.44, lon: 77.45 },
        coordinateMetadata: {
            lat: 18.445,
            lon: 77.451,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±8 m",
            sourceObservation: "MRO HiRISE ESP_082855_1985"
        },
        locationName: "Valinor Hills, Jezero Crater",
        operationalLifespan: "Nearly 3 years (1,042 Sols; designed for 30-day technology demonstration)",
        totalDistance: "17.0 km flown across 72 aerial sorties (128.8 minutes airtime)",
        imagePath: "assets/renders/ingenuity.png",
        modelPath: "assets/models/ingenuity.glb",
        meshyModelKeyword: "ingenuity mars helicopter twin carbon fiber rotors",
        nasaNssdcId: "MARS-INGENUITY",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=77.45&y=18.44&z=10",
        audioTelemetryType: "rotor-spin",
        lastTransmissionMessage: {
            telemetry: "FLIGHT 72: TOUCHDOWN | AVIONICS: UP-LINK CONFIRMED | ROTOR TIP: DAMAGE OBSERVED IN SHADOW",
            quote: "\"The Wright Brothers moment on another world is accomplished.\"",
            actualContext: "On January 18, 2024, during its 72nd sortie over bland sandy terrain in Valinor Hills, Ingenuity executed an emergency touchdown. Subsequent shadow imagery confirmed one or more rotor tips had fractured. NASA confirmed the helicopter remained upright and in communication, but damage prevented further aerodynamic flight. The mission conclusion was announced January 25, 2024."
        },
        scientificContributions: [
            "Demonstrated the first powered, controlled aerodynamic flight on another planet in human history.",
            "Executed 72 flights, covering 17 kilometers and surviving over 1,000 Martian days (designed for only 5 flights).",
            "Served as an aerial scout for the Perseverance rover, imaging hazard-strewn terrain and landing debris."
        ],
        storytelling: {
            adultTagline: "Humanity's First Powered Controlled Atmospheric Flight on Another Planet",
            adultNarrative: "Arriving strapped to the belly of the Perseverance rover on February 18, 2021, the 1.8-kilogram Ingenuity helicopter was conceived as a high-risk, high-reward technology demonstration to test whether controlled flight was possible in Mars' thin atmosphere (less than 1% of Earth's air density). Designed for only 5 short test flights, Ingenuity achieved an astounding 72 flights over nearly three years, flying 17.0 kilometers across Jezero Crater and logging 128.8 minutes aloft. Serving as an autonomous aerial scout, Ingenuity mapped safe travel corridors and identified promising geological targets for Perseverance.",
            adultWhyMatters: "Ingenuity opened the aerial dimension of planetary exploration, proving that aerodynamic lift is viable on other planets and establishing the engineering foundation for future Mars aerial fleets and missions like the Dragonfly rotorcraft to Saturn's moon Titan.",
            adultConclusion: "On January 18, 2024, during an emergency descent on Flight 72 over featureless sandy terrain at Valinor Hills, shadow imagery confirmed that one or more carbon-fiber rotor blade tips had fractured. While flight capability ended, the helicopter remains upright, communicating regularly with Earth as a stationary meteorological and engineering station.",
            genZTagline: "The 4-pound drone that flew 72 times on Mars when NASA only planned 5. Major flex.",
            genZNarrative: "Scientists literally said flying on Mars was impossible because the atmosphere is 99% thinner than Earth's. I heard that and took it personally. My dual carbon-fiber blades spun at 2,400 RPM\u20145 times faster than a regular Earth helicopter. I was supposed to do 5 quick test hops. I ended up flying 72 TIMES, covering 10.5 miles, and acting as the aerial scout for Perseverance! Talk about the biggest overachiever in the solar system.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: First powered aircraft flight on another planet in human history. Wright Brothers moment on Mars, fr fr.",
            genZStatus: "MISSION COMPLETE // 72 FLIGHTS CLOCKED \ud83d\ude81",
            tagline: "The First Aircraft to Fly Through the Thin Sky of an Alien World",
            perspectiveNarrative: "The atmosphere on Mars has less than 1% of Earth's sea-level density. Many considered controlled aerodynamic flight there nearly impossible. My counter-rotating carbon-fiber blades spun at 2,400 RPM to lift my 4-pound frame. I was tasked with 5 technology demo hops. I flew 72 missions. During landing on Flight 72, my blade tips struck sand and fractured. I remained upright and communicated with Earth, but my flying days had reached their conclusion.",
            juniorSummary: "Ingenuity was the very first flying machine on another planet! It had twin helicopter blades spinning five times faster than on Earth to lift off in the super-thin Martian air.",
            juniorJoke: {
                question: "How do you organize a helicopter party on Mars?",
                punchline: "You planet well and bring lots of spin!"
            },
            whyItMatters: "Ingenuity proved aerial exploration is possible on worlds with thin atmospheres, paving the way for future aerial scouts on Mars and Titan."
        }
    },
    {
        id: "sojourner-pathfinder",
        planet: "mars",
        name: "Sojourner (Mars Pathfinder)",
        designation: "Mars Pathfinder Microrover",
        nickname: "The Trailblazer",
        category: "Mobile Robotic Rover",
        launchDate: "December 4, 1996",
        landingDate: "July 4, 1997",
        finalTransmissionDate: "September 27, 1997 (Sol 83)",
        missionConclusionDate: "March 10, 1998 (NASA Official)",
        status: "Mission Concluded (Silent)",
        physicalCondition: "Intact microrover resting near the Carl Sagan Memorial Station",
        coordinates: { lat: 19.13, lon: 326.78 },
        coordinateMetadata: {
            lat: 19.13,
            lon: 326.78,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±20 m",
            sourceObservation: "MRO HiRISE PSP_001890_1990"
        },
        locationName: "Carl Sagan Memorial Station, Ares Vallis",
        operationalLifespan: "83 Sols (Designed for 7 Sols)",
        totalDistance: "100 meters (330 ft)",
        imagePath: "assets/renders/sojourner.jpg",
        meshyModelKeyword: "sojourner rover mars pathfinder solar panel micro rover",
        nasaNssdcId: "1996-068A",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=-33.22&y=19.13&z=10",
        audioTelemetryType: "retro-dialup",
        lastTransmissionMessage: {
            telemetry: "LANDER CARRIER: LOSS OF SIGNAL | BATTERY TEMPERATURE: DEPLETED",
            quote: "\"I was only the size of a microwave oven, but I was the grandfather of every Martian explorer that followed.\"",
            actualContext: "On Sol 83, the Pathfinder base station battery succumbed to thermal depletion from repeated cold cycles. Because Sojourner relayed all communications through the lander, loss of lander power ended telemetry from the rover."
        },
        scientificContributions: [
            "Pioneered the rocker-bogie mobility suspension system used on all subsequent NASA Mars rovers.",
            "Conducted Alpha Proton X-ray Spectrometer (APXS) chemical analyses of Martian rocks ('Barnacle Bill', 'Yogi').",
            "Validated low-cost airbag impact attenuation and autonomous planetary surface mobility."
        ],
        storytelling: {
            adultTagline: "The 10.5-kg Microrover That Inaugurated Modern Planetary Robotics",
            adultNarrative: "On July 4, 1997, the Mars Pathfinder mission executed a direct atmospheric entry and landed in Ares Vallis cushioned by innovative airbags. Deployed down a ramp from the lander, the 10.5-kilogram Sojourner microrover became the first wheeled vehicle ever operated on another celestial body. Controlled from Earth via semi-autonomous hazard avoidance, Sojourner operated for 83 Martian days (well beyond its 7-day design goal), analyzing volcanic boulders named 'Barnacle Bill' and 'Yogi' with its Alpha Proton X-ray Spectrometer (APXS) and capturing 550 surface photographs.",
            adultWhyMatters: "Sojourner revolutionized planetary exploration by proving that mobile robotic rovers could safely navigate rocky alien terrain, directly leading to the development of Spirit, Opportunity, Curiosity, and Perseverance.",
            adultConclusion: "Pathfinder and Sojourner operated until September 27, 1997, when the lander's primary battery depleted, breaking the communications link with Earth. The landing site was officially renamed the Carl Sagan Memorial Station in honor of the astronomer's contributions to planetary science.",
            genZTagline: "The size of a microwave. The father of all modern Mars rovers. Absolute OG.",
            genZNarrative: "In 1997, humans had never successfully driven a wheeled rover on Mars. Enter me: 23 pounds, six tiny wheels, size of a microwave. I bounced onto Mars wrapped in giant airbags like a cosmic pinball. Then I rolled off my Pathfinder lander base and started sniffing rocks like 'Barnacle Bill' with my alpha proton X-ray spectrometer. Streamed photos to the brand new World Wide Web and broke the internet in 1997. Grandfather to Oppy, Spirit, and Percy.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Without Sojourner, we wouldn't have Curiosity, Perseverance, or human missions to Mars. The pioneer who started it all.",
            genZStatus: "MUSEUM PIECE // 1997 WEB ICON \ud83d\udcdf",
            tagline: "The 23-Pound Pioneer That Inaugurated Modern Planetary Rover Mobility",
            perspectiveNarrative: "Before 1997, no wheeled vehicle had rolled on Mars. I weighed just 23 pounds and relied on a modest solar array. When the Pathfinder lander touched down cushioned by giant airbags, I rolled down the ramps and drove up to Martian boulders. When the lander battery froze on Sol 83, I circled the station as programmed, having proven that autonomous rovers could explore other worlds.",
            juniorSummary: "Sojourner was tiny—only the size of a microwave oven! It was the first rover with wheels to roll on Mars, and it had a special 6-wheel suspension to climb over rocks without tipping over.",
            juniorJoke: {
                question: "What did Sojourner say to the rock named Barnacle Bill?",
                punchline: "\"You rock, but I roll!\""
            },
            whyItMatters: "Sojourner established the feasibility of mobile planetary exploration that made Spirit, Opportunity, Curiosity, and Perseverance possible."
        }
    },
    {
        id: "viking-1-lander",
        planet: "mars",
        name: "Viking 1 Lander",
        designation: "Viking Lander 1 (Thomas A. Mutch Memorial Station)",
        nickname: "The Golden Age Pioneer",
        category: "Stationary Astrobiology Lander",
        launchDate: "August 20, 1975",
        landingDate: "July 20, 1976",
        finalTransmissionDate: "November 11, 1982 (Sol 2245)",
        missionConclusionDate: "May 1983 (NASA Official)",
        status: "Mission Concluded (Communication Severed)",
        physicalCondition: "Intact lander with RTG power source, stationary on Chryse Planitia",
        coordinates: { lat: 22.48, lon: 312.05 },
        coordinateMetadata: {
            lat: 22.48,
            lon: 312.05,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±10 m",
            sourceObservation: "MRO HiRISE PSP_001521_2025"
        },
        locationName: "Chryse Planitia ('Plains of Gold')",
        operationalLifespan: "6 years, 114 days (2,245 Sols; planned for 90 days)",
        totalDistance: "Stationary Robotic Laboratory",
        imagePath: "assets/renders/viking1.jpg",
        meshyModelKeyword: "viking 1 lander mars tripod rtg dish camera",
        nasaNssdcId: "1975-075C",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=-47.95&y=22.48&z=10",
        audioTelemetryType: "radio-isotope",
        lastTransmissionMessage: {
            telemetry: "BATTERY CHARGING UPLINK APPLIED | HIGH-GAIN ANTENNA: MISALIGNED",
            quote: "\"The first long-duration robotic outpost on Mars, silenced when its antenna lost the line to Earth.\"",
            actualContext: "On November 11, 1982, ground controllers uplinked an operational command sequence designed to modify battery-charging routines. The new instructions inadvertently overwrote memory addresses containing the high-gain antenna pointing parameters, directing the antenna away from Earth and terminating communications."
        },
        scientificContributions: [
            "Returned the first clear, in-situ color panoramic photographs of the Martian surface.",
            "Conducted three biology experiments (Gas Exchange, Labeled Release, Pyrolytic Release) to detect signs of metabolic life in the soil.",
            "Monitored Martian meteorology, atmospheric pressure fluctuations, and seasonal dust cycles continuously over 6 Earth years."
        ],
        storytelling: {
            adultTagline: "First Successful Long-Duration Surface Science Station on Mars",
            adultNarrative: "Touching down on Chryse Planitia on July 20, 1976 (exactly seven years after Apollo 11), Viking 1 was the first American spacecraft to soft-land on Mars and successfully complete its mission. Operating continuously for over six Earth years (2,245 Sols), Viking 1 returned the first high-resolution color photographs from the Martian surface, conducted the first long-term meteorological tracking, and carried three automated biological soil experiments to search for metabolic biosignatures.",
            adultWhyMatters: "Viking 1 proved that complex scientific stations could survive for years on the Martian surface, established baseline data on Martian atmospheric dynamics, and shaped the next five decades of search strategies for extraterrestrial life.",
            adultConclusion: "On November 11, 1982, ground controllers uplinked a software command sequence intended to reprogram battery charging algorithms. The data inadvertently overwrote memory addresses containing the high-gain antenna pointing vectors, breaking direct communications with Earth. The site is designated the Thomas A. Mutch Memorial Station.",
            genZTagline: "First successful lander on Mars in 1976. Sent the first color photos before your parents were born.",
            genZNarrative: "Landing on Mars in 1976 with 1970s tape computers is insane if you think about it. I touched down on Chryse Planitia and beamed back the first ever high-res color photo of the Martian surface. Red rocks, pink sky, completely alien. I tested the soil for microbes, measured weather for 6 years, and stayed active until a human command typo in 1982 accidentally cut my antenna off. Still salty about that typo, but I'm an immortal pioneer.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: First sustained surface operation on Mars. The grandaddy of planetary robotics that survived 6 Earth years on nuclear batteries.",
            genZStatus: "CHILLING IN CHRYSE // RETRO LEGEND \ud83d\udcbe",
            tagline: "The First Enduring Robotic Station on the Martian Surface",
            perspectiveNarrative: "On July 20, 1976—exactly seven years after Apollo 11 walked on the Moon—I touched down on the Plains of Gold. I captured the first clear images from the ground of Mars, revealing a rust-colored landscape under an ochre sky. Powered by two plutonium-238 RTGs, I gathered weather data across six years. In late 1982, an uplinked command sequence to manage battery charging accidentally overwrote my antenna pointing vectors. My antenna turned away from Earth, and my voice was lost forever in the Martian winds.",
            juniorSummary: "Viking 1 was the very first spacecraft to successfully land and live on Mars for over 6 years! It sent back the first-ever color photos showing what Mars actually looked like from the ground.",
            juniorJoke: {
                question: "What is Mars' favorite candy?",
                punchline: "A Mars Bar, of course!"
            },
            whyItMatters: "Viking 1 demonstrated long-term operational survivability on the Martian surface and conducted the first in-situ planetary biology experiments."
        }
    },
    {
        id: "perseverance-landing-debris",
        planet: "mars",
        name: "Perseverance Landing System Debris Field",
        designation: "Mars 2020 Entry, Descent, and Landing (EDL) Hardware",
        nickname: "The Chrysalis of Perseverance",
        category: "Landing Hardware & Impact Debris Field",
        launchDate: "July 30, 2020",
        landingDate: "February 18, 2021",
        finalTransmissionDate: "February 18, 2021 (Hardware Impact)",
        missionConclusionDate: "Hardware Mission Accomplished Upon Safe Rover Touchdown",
        status: "Impacted & Discarded Hardware Field",
        physicalCondition: "Four discrete surface artifact sites: backshell & supersonic parachute, sky-crane impact crater, and heat shield",
        coordinates: { lat: 18.44, lon: 77.45 },
        coordinateMetadata: {
            lat: 18.444,
            lon: 77.451,
            convention: "Planetocentric, 0–360° East-positive",
            datum: "IAU/IAG 2000 Mars",
            uncertainty: "±10 m (HiRISE annotated debris locations)",
            sourceObservation: "MRO HiRISE ESP_068294_1985 & Ingenuity Flight 26 Imagery"
        },
        locationName: "Jezero Crater Landing Debris Zone",
        operationalLifespan: "Approximately 7 minutes (Atmospheric Entry through Touchdown)",
        totalDistance: "Interplanetary Entry to Surface Impact",
        imagePath: "assets/renders/perseverance.png",
        meshyModelKeyword: "mars parachute backshell heat shield metal fragments",
        nasaNssdcId: "2020-052A",
        nasaTrekUrl: "https://trek.nasa.gov/mars/#v=0.1&x=77.45&y=18.44&z=10",
        audioTelemetryType: "rover-comms",
        lastTransmissionMessage: {
            telemetry: "BRIDLE CUT CONFIRMED | DESCENT STAGE FLYAWAY COMMENCED | ROVER ON GROUND",
            quote: "\"Touchdown confirmed. Perseverance safely on the surface of Mars, ready to begin seeking the signs of past life.\"",
            actualContext: "On February 18, 2021, the Mars 2020 entry and descent hardware safely delivered the Perseverance rover to Jezero Crater. The rocket-powered Sky Crane lowered the rover on nylon tethers, severed the cords, and flew away to impact the surface safely outside the rover's scientific field."
        },
        scientificContributions: [
            "Demonstrated Terrain Relative Navigation (TRN), steering the lander away from hazardous boulders autonomously in real-time.",
            "Deployed the largest supersonic parachute ever flown on another world (21.5 meters in diameter).",
            "Hardware later photographed by Ingenuity Flight 26, providing engineers with empirical data on extreme-speed atmospheric entry shield performance."
        ],
        storytelling: {
            adultTagline: "Sacrificial Entry, Descent & Landing (EDL) Architecture of Mars 2020",
            adultNarrative: "When NASA's Mars 2020 Perseverance rover entered the Martian atmosphere on February 18, 2021, it relied on a multi-stage aerodynamic and propulsive architecture to decelerate from 20,000 km/h to zero. The 21.5-meter supersonic nylon parachute and protective backshell absorbed intense aerodynamic drag before being jettisoned, while the rocket-powered Sky Crane lowered Perseverance to the surface on nylon tethers before flying away to impact safely at a standoff distance.",
            adultWhyMatters: "These physical surface relics provide aerospace engineers with rare empirical data on material wear, aerodynamic ablation, and structural performance under hypersonic atmospheric entry conditions on another world.",
            adultConclusion: "The discarded hardware components rest across three discrete debris sites in Jezero Crater, documented by high-resolution orbital imagery from MRO HiRISE and aerial surveys by the Ingenuity helicopter during Flight 26.",
            genZTagline: "The sacrificial skycrane armor that dropped Percy off like an Uber driver, then crashed like a boss.",
            genZNarrative: "We were the unsung heroes of February 18, 2021. We took a 12,000 mph fireball to the face through the Martian atmosphere so Perseverance wouldn't get vaporized. Then our rocket-powered Sky Crane hovered 60 feet above Jezero Crater, lowered Percy gently on nylon cables, cut the cords, and flew 700 meters away to crash into the dirt so we wouldn't kick dust on the fresh rover. Ingenuity literally flew over our crash site on Flight 26 and took photos of our wreckage. Peak cinematic sacrifice.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: The ultimate bro move in space exploration. Took the hit so humanity's flagship Mars rover could roll untouched.",
            genZStatus: "CRASH SITE HONORED // SKY CRANE VETERAN \ud83d\udca5",
            tagline: "The Sacrificial Armor That Delivered Humanity's Flagship Rover",
            perspectiveNarrative: "We were the protective cocoon for Perseverance. During the 'Seven Minutes of Terror', the heat shield absorbed temperatures over 2,300°F (1,300°C). Then the supersonic orange-and-white parachute deployed at Mach 1.7. Finally, the rocket-powered Sky Crane hovered on hydrazine thrusters, lowered the rover gently onto Jezero Crater, cut the tethers, and throttled away to impact the ground. In April 2022, Ingenuity flew over our shattered backshell and photographed our resting place.",
            juniorSummary: "To land a heavy 1-ton rover on Mars, NASA used a giant supersonic parachute and a rocket 'sky crane' with cables! Once the rover was safe on the ground, the crane flew away and crashed on purpose.",
            juniorJoke: {
                question: "Why did the supersonic parachute go to school?",
                punchline: "To learn how to handle extreme pressure!"
            },
            whyItMatters: "Exemplifies the engineering hardware required to slow down from 12,000 mph to a gentle 1.7 mph touchdown on an alien planet."
        }
    },

    // ================= MOON ARTIFACTS =================
    {
        id: "apollo-11-descent-stage",
        planet: "moon",
        name: "Apollo 11 LM 'Eagle' Descent Stage",
        designation: "Apollo 11 Lunar Module Descent Stage (LM-5)",
        nickname: "Tranquility Base",
        category: "Manned Landing Platform",
        launchDate: "July 16, 1969",
        landingDate: "July 20, 1969",
        finalTransmissionDate: "July 21, 1969 (Ascent Stage Liftoff)",
        missionConclusionDate: "July 24, 1969 (Crew Splashdown)",
        status: "Permanent Historic Monument",
        physicalCondition: "Four-legged gold-mylar clad structure with landing engine and commemorative plaque intact",
        coordinates: { lat: 0.674, lon: 23.473 },
        coordinateMetadata: {
            lat: 0.67408,
            lon: 23.47297,
            convention: "Mean Earth/Polar Axis, East-positive",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "< 2.0 m",
            sourceObservation: "LROC NAC Frame M102281891LE"
        },
        locationName: "Mare Tranquillitatis (Sea of Tranquility)",
        operationalLifespan: "Mission duration: 21.6 hours on lunar surface",
        totalDistance: "Stationary Launch Platform & Historic Site",
        imagePath: "assets/renders/apollo_lm.png",
        modelPath: "assets/models/apollo_lm.glb",
        videoPath: "assets/Videos/apollo_11_eagle.mp4",
        meshyModelKeyword: "apollo lunar module descent stage gold foil legs",
        nasaNssdcId: "1969-059C",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=23.47&y=0.67&z=10",
        audioTelemetryType: "apollo-quindar",
        lastTransmissionMessage: {
            telemetry: "STAGE SEPARATION: CONFIRMED | ASCENT ENGINE IGNITION: NOMINAL | DESCENT STAGE: GROUND REFERENCE",
            quote: "\"Here men from the planet Earth first set foot upon the Moon. July 1969, A.D. We came in peace for all mankind.\"",
            actualContext: "When Neil Armstrong and Buzz Aldrin departed the Moon in the Eagle Ascent Stage, the Descent Stage served as their launch platform. Left on the surface were the four landing legs, descent engine, surface TV camera, and commemorative stainless steel plaque."
        },
        scientificContributions: [
            "Served as the touchdown vehicle for humanity's first lunar landing, returning 21.5 kilograms of lunar regolith and rock samples.",
            "Demonstrated manual pinpoint piloting in low-gravity vacuum conditions to avoid West Crater's boulder field.",
            "Preserves the pristine archaeological signature of human presence and rocket plume interactions on the lunar surface."
        ],
        storytelling: {
            adultTagline: "Tranquility Base: Launchpad of Humanity's First Lunar Expedition",
            adultNarrative: "On July 20, 1969, Commander Neil Armstrong and Lunar Module Pilot Buzz Aldrin landed the LM 'Eagle' at Tranquility Base (0.674\u00b0N, 23.473\u00b0E) with approximately 25 seconds of descent propellant remaining. While the Ascent Stage returned the astronauts to lunar orbit, the four-legged gold-mylar clad Descent Stage served as their launch pad and remains permanently resting on the lunar surface, bearing the iconic plaque: 'Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind.'",
            adultWhyMatters: "Tranquility Base stands as humanity's premier cultural and archaeological monument beyond Earth, marking the precise geographic location where human beings first walked on another celestial body.",
            adultConclusion: "The descent stage, landing pads, television camera, and science equipment packages remain in pristine physical condition in the airless vacuum of the Sea of Tranquility, protected under international cultural heritage and preservation conventions.",
            genZTagline: "Landed with 25 seconds of fuel left. Ice in their veins. Ultimate flex in human history.",
            genZNarrative: "Neil Armstrong was looking out the window and saw the computer was steering them straight into a crater full of giant boulders. Did they panic? Nope. Neil switched to manual, skimmed over the rocks, and touched down in the Sea of Tranquility with 25 seconds of gas left in the tank. When they blasted off in the ascent stage, I stayed behind as humanity's permanent monument. Neil's bootprints are still stamped in the dust right beside my gold foil landing legs. Unbeatable aura.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: First human boots on another world. July 20, 1969. Living rent-free in human history forever.",
            genZStatus: "PERMANENT BASE // FIRST BOOTPRINT \ud83c\udf15",
            tagline: "The Footstool From Which Humanity Leaped Into the Cosmos",
            perspectiveNarrative: "My four legs wrapped in gold Mylar insulation touched the Sea of Tranquility on July 20, 1969. I carried Neil Armstrong and Buzz Aldrin safely to the ground. My strut held the ladder from which Neil stepped into history. When it was time to return home, my upper stage blasted off into lunar orbit, while I remained behind. For over fifty years, through searing lunar days and freezing lunar nights, I have guarded the commemorative plaque at Tranquility Base.",
            juniorSummary: "This is the bottom half of the Eagle spacecraft! When Neil Armstrong and Buzz Aldrin blasted back to Earth, they left this gold four-legged base behind on the Moon with a plaque saying 'We came in peace for all mankind.'",
            juniorJoke: {
                question: "How do you know when the Moon has enough food?",
                punchline: "When it is completely full!"
            },
            whyItMatters: "Tranquility Base is the premier historical landmark of human planetary exploration, protected under international historic preservation protocols."
        }
    },
    {
        id: "apollo-11-lrrr",
        planet: "moon",
        name: "Apollo 11 Laser Ranging Retroreflector (LRRR)",
        designation: "EASEP Lunar Laser Ranging Retroreflector Experiment",
        nickname: "The 55-Year Mirror",
        category: "Passive Optical Scientific Array",
        launchDate: "July 16, 1969",
        landingDate: "July 20, 1969",
        deploymentDate: "July 21, 1969",
        status: "Active Scientific Array (Passive)",
        physicalCondition: "Intact pallet of 100 fused silica corner-cube prisms resting ~14 m south of the LM",
        coordinates: { lat: 0.6734, lon: 23.4730 },
        coordinateMetadata: {
            lat: 0.6734,
            lon: 23.4730,
            convention: "Mean Earth/Polar Axis, East-positive",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "±2.5 m",
            sourceObservation: "LROC NAC Frame M102281891LE"
        },
        locationName: "Mare Tranquillitatis (14m South of Eagle LM)",
        operationalLifespan: "Continuous passive operation from July 1969 to Present Day",
        totalDistance: "Stationary Optical Array",
        imagePath: "assets/renders/apollo11_lrrr.jpg",
        meshyModelKeyword: "apollo 11 laser retroreflector quartz corner cubes tray",
        nasaNssdcId: "1969-059C-02",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=23.47&y=0.67&z=10",
        audioTelemetryType: "apollo-quindar",
        lastTransmissionMessage: {
            telemetry: "PASSIVE OPTICAL ARRAY: NO TELEMETRY REQUIRED | PHOTON REFLECTION RATE: OPERATIONAL",
            quote: "\"A completely silent array of 100 quartz mirrors that still bounces Earth-fired lasers back today.\"",
            actualContext: "Unlike the adjacent solar-powered Passive Seismic Experiment Package (PSEP), which experienced a command decoder failure on August 27, 1969 preventing further downlink, the LRRR contains no electronics or power supply. It reflects laser pulses fired from terrestrial observatories straight back to their source."
        },
        scientificContributions: [
            "Measured the Earth-Moon distance over 55+ years, establishing that the Moon is spiraling away from Earth at 3.8 cm/year due to tidal dissipation.",
            "Refined lunar orbital parameters from initial decimeter scale to millimeter-scale precision using modern photon-counting observatories (Apache Point, McDonald).",
            "Provided rigorous empirical tests of Einstein's Theory of General Relativity by testing the Equivalence Principle in deep space."
        ],
        storytelling: {
            adultTagline: "Continuous Millimeter Precision Lunar Geodesy for Over Half a Century",
            adultNarrative: "Deployed by Neil Armstrong and Buzz Aldrin 16.8 meters from the Lunar Module, the Lunar Laser Ranging Retroreflector (LRRR) consists of 100 fused silica corner-cube prisms mounted in a passive aluminum pallet. Requiring zero electrical power, computer chips, or maintenance, the array reflects laser pulses fired from Earth observatories (such as Apache Point and McDonald) directly back to their source.",
            adultWhyMatters: "Still operational today after 55+ years, LRRR measurements have quantified that the Moon is spiraling away from Earth at 3.82 cm per year, confirmed Einstein's theory of general relativity with high precision, and mapped the liquid state of the Moon's core.",
            adultConclusion: "As the only Apollo 11 experiment still active today, the LRRR demonstrates the enduring value of passive optical technology in extraterrestrial scientific research.",
            genZTagline: "A suitcase of mirrors sitting on the Moon since '69. Humans still shoot lasers at it weekly.",
            genZNarrative: "I have zero batteries, zero wires, and zero moving parts, yet I'm the ONLY Apollo 11 experiment STILL WORKING today. Buzz Aldrin set me down on the regolith. I have 100 quartz corner-cube prisms that bounce laser pulses straight back to Earth. Observatories shoot green lasers at me to measure the Moon's distance down to the millimeter! Found out the Moon is drifting away 3.8 cm every year. Zero maintenance for 55+ years. Peak efficiency.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Proved Einstein's General Relativity and tracked the Moon's orbital drift for 55 years with literally zero electricity. Pure galaxy brain.",
            genZStatus: "ACTIVE REFLECTOR // ZERO POWER REQUIRED \ud83e\ude9e",
            tagline: "The Only Apollo 11 Equipment Still Conducting Science Today",
            perspectiveNarrative: "While my robotic neighbor, the Passive Seismic Experiment, ceased transmitting in August 1969 when its command decoder failed, I needed neither wires, batteries, nor antennas. I am a grid of 100 precision fused silica corner-cube prisms. When an observatory on Earth shoots a laser pulse at the Sea of Tranquility, my prisms bounce those photons straight back down the telescope barrel. Over five decades, I have measured the Moon drifting 3.8 cm farther away each year.",
            juniorSummary: "This is a tray of 100 super-special glass mirrors placed on the Moon by Buzz Aldrin! Scientists on Earth can shoot laser beams at it right now, and the mirrors bounce the lasers right back to measure the exact distance to the Moon!",
            juniorJoke: {
                question: "Why did the Moon need 100 glass mirrors?",
                punchline: "Because it wanted to make sure it looked out of this world!"
            },
            whyItMatters: "The LRRR is the longest-running surface scientific experiment in human spaceflight history, operating continuously since 1969."
        }
    },
    {
        id: "apollo-15-lrv",
        planet: "moon",
        name: "Apollo 15 Lunar Roving Vehicle (LRV-001)",
        designation: "Lunar Roving Vehicle 1",
        nickname: "The First Moon Buggy",
        category: "Manned Automotive Rover",
        launchDate: "July 26, 1971",
        landingDate: "July 30, 1971",
        finalTransmissionDate: "August 2, 1971 (Ascent Liftoff Recorded)",
        missionConclusionDate: "August 7, 1971 (Splashdown)",
        status: "Parked on Lunar Surface",
        physicalCondition: "Parked ~100m east of Falcon LM with TV camera pointed at launch site",
        coordinates: { lat: 26.1322, lon: 3.6339 },
        coordinateMetadata: {
            lat: 26.1322,
            lon: 3.6339,
            convention: "Mean Earth/Polar Axis, East-positive",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "±2.0 m",
            sourceObservation: "LROC NAC Frame M111578606LE"
        },
        locationName: "Hadley Rille, Apennine Mountains",
        operationalLifespan: "67 hours on surface (3 driving excursions)",
        totalDistance: "27.8 km (17.3 mi)",
        imagePath: "assets/renders/lunar_rover.jpg",
        videoPath: "assets/Videos/apollo_lunar_rover.mp4",
        meshyModelKeyword: "apollo lunar roving vehicle moon buggy mesh wheels",
        nasaNssdcId: "1971-063C",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=3.63&y=26.13&z=10",
        audioTelemetryType: "rover-comms",
        lastTransmissionMessage: {
            telemetry: "GCTA COLOR TV CAMERA: GROUND CONTROL LINK CONFIRMED | PARKING HEADING: 095°",
            quote: "\"The LRV was an extraordinary machine that expanded our horizons on the Moon tenfold.\"",
            actualContext: "Astronaut Dave Scott parked LRV-001 approximately 100 meters east of the Lunar Module Falcon and aimed its ground-controlled color TV camera so flight controllers in Houston could film the liftoff of the ascent stage in real time."
        },
        scientificContributions: [
            "Expanded astronaut exploration radius from walking distance (a few hundred meters) to 27.8 kilometers of geological transects.",
            "Enabled collection of the Genesis Rock (Sample 15415), a 4-billion-year-old piece of primordial anorthosite crust.",
            "Pioneered woven zinc-coated steel wire mesh tires capable of gripping powdery lunar regolith without pneumatic pressure."
        ],
        storytelling: {
            adultTagline: "The First Automotive Transit Across the Moon & Discovery of the Genesis Rock",
            adultNarrative: "On Apollo 15 (July 1971), astronauts Dave Scott and Jim Irwin deployed the first Lunar Roving Vehicle (LRV-001) at Hadley Rille. Featuring four independent electric drive motors and tires hand-woven from zinc-coated piano steel wire, the rover traveled 27.8 kilometers, enabling the astronauts to explore the Apennine Mountains and collect the 4.1-billion-year-old 'Genesis Rock' (anorthosite), which confirmed the magma ocean theory of lunar formation.",
            adultWhyMatters: "The LRV fundamentally transformed lunar field geology, extending astronaut surface exploration ranges by a factor of ten and setting the standard for all future crewed off-world transport.",
            adultConclusion: "LRV-001 remains parked at Hadley Rille, oriented toward the landing site, where its ground-commanded color television camera broadcast the Lunar Module's liftoff back into orbit.",
            genZTagline: "The original Moon buggy. Astronauts drifting on lunar dust at 8 mph. Space joyride.",
            genZNarrative: "NASA spent millions to build an electric dune buggy with wire mesh wheels and piano wire treads. Dave Scott and Jim Irwin unfolded me from the lunar module and took me for a 17-mile joyride across Hadley Rille. We hit 8 mph, kicked up rooster tails of lunar dust, and hauled 170 pounds of Moon rocks back. Parked me with the TV camera pointed right at the lunar module liftoff. Still parked on Hadley plains waiting for the next road trip.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: The first car driven on another world. Allowed astronauts to explore 10x further than walking distance. Certified classic.",
            genZStatus: "PARKED AT HADLEY // BATTERIES DRIED OUT \ud83c\udfce\ufe0f",
            tagline: "The Electric Hot Rod That Conquered the Craters",
            perspectiveNarrative: "Before me, astronauts could walk only as far as their spacesuit backpacks permitted. But I brought four 1/4-horsepower electric drive motors, wire-mesh tires, and a T-handle stick. Dave Scott and Jim Irwin drove me across boulder fields to the edge of the 1,000-foot-deep Hadley Rille canyon. When their work was done, Dave parked me neatly on a knoll and aimed my high-gain antenna so Mission Control in Houston could film their liftoff.",
            juniorSummary: "The first electric car on the Moon! It had seats made of woven nylon straps, wire wheels made of piano strings with titanium cleats, and was driven using a simple joystick!",
            juniorJoke: {
                question: "Why did the Apollo astronaut park his electric rover on the Moon?",
                punchline: "Because there was plenty of space!"
            },
            whyItMatters: "The Lunar Rover transformed lunar exploration from cautious localized foot surveys into comprehensive geological field expeditions."
        }
    },
    {
        id: "apollo-17-lrv-alsep",
        planet: "moon",
        name: "Apollo 17 LRV & ALSEP Station",
        designation: "LRV-003 & Apollo Lunar Surface Experiments Package",
        nickname: "The Last Footsteps Outpost",
        category: "Manned Automotive Rover & Geophysical Station",
        launchDate: "December 7, 1972",
        landingDate: "December 11, 1972",
        finalTransmissionDate: "September 30, 1977 (Official Program Deactivation)",
        missionConclusionDate: "September 30, 1977 (ALSEP Network Deactivation)",
        status: "Scientific Station (Transmissions Concluded 1977)",
        physicalCondition: "LRV parked at VIP site with duct-taped fender; ALSEP central station and SNAP-27 RTG intact",
        coordinates: { lat: 20.1908, lon: 30.7717 },
        coordinateMetadata: {
            lat: 20.19080,
            lon: 30.77168,
            convention: "Mean Earth/Polar Axis, East-positive",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "±1.5 m",
            sourceObservation: "LROC NAC Frame M114815482LE"
        },
        locationName: "Taurus-Littrow Valley",
        operationalLifespan: "ALSEP operated for 4.8 years continuously (Shutdown from Earth Sept 30, 1977)",
        totalDistance: "35.9 km (22.3 mi) driven across Taurus-Littrow",
        imagePath: "assets/renders/lunar_rover.jpg",
        videoPath: "assets/Videos/apollo_lunar_rover.mp4",
        meshyModelKeyword: "apollo 17 lunar rover fender taped alsep radioisotope generator",
        nasaNssdcId: "1972-096C",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=30.77&y=20.19&z=10",
        audioTelemetryType: "radio-isotope",
        lastTransmissionMessage: {
            telemetry: "SNAP-27 RTG: 73.5 WATTS | HEAT FLOW: TRANSMITTING | DEACTIVATION COMMAND SENT FROM HOUSTON",
            quote: "\"We leave as we came, and, God willing, as we shall return, with peace and hope for all mankind.\"",
            actualContext: "When Gene Cernan and Harrison Schmitt completed the final Apollo EVA, they left behind their rover with a repaired fender made of duct tape and lunar maps. The plutonium-powered ALSEP station continued transmitting seismic and heat data until NASA deactivated the receiving stations on September 30, 1977 due to budget constraints."
        },
        scientificContributions: [
            "Conducted the longest total lunar driving excursion in history (35.9 km), discovering orange volcanic pyroclastic soil.",
            "Operated the Heat Flow Experiment and Lunar Seismic Profiling Experiment powered continuously by a SNAP-27 RTG.",
            "Demonstrated the field repair of the rear fender using lunar maps and duct tape, preventing abrasive dust from disabling vehicle electronics."
        ],
        storytelling: {
            adultTagline: "Longest Crewed Lunar Surface Expedition, Field Repair & Nuclear Science Station",
            adultNarrative: "Apollo 17 (December 1972) represented humanity's longest crewed expedition to the Moon. Operating in the Taurus-Littrow valley, astronauts Gene Cernan and Harrison Schmitt drove LRV-003 across 35.9 kilometers. When a broken rear fender threatened the rover with blinding dust plumes, the astronauts performed an emergency field repair using four laminated maps, duct tape, and clamps. Nearby, their SNAP-27 plutonium radioisotope-powered ALSEP station broadcast seismic, heat flow, and atmospheric data to Earth until being deactivated by NASA in 1977.",
            adultWhyMatters: "Apollo 17 proved that humans can successfully troubleshoot and repair critical mobility hardware in extreme off-world environments, recovering the famous orange pyroclastic soil that proved ancient explosive lunar volcanism.",
            adultConclusion: "Parked approximately 150 meters east of the Challenger descent stage, LRV-003 recorded the final human departure from the Moon during the 20th century.",
            genZTagline: "Astronauts broke my fender on the Moon and fixed it with duct tape and cardboard maps. Based.",
            genZNarrative: "Gene Cernan accidentally caught his hammer on my rear fender and snapped it off. Lunar dust was spraying all over the astronauts' spacesuits like a blizzard. Did mission control give up? Heck no! They told the crew to tape 4 laminated geology maps together with gray duct tape and clamp it on. It worked perfectly! Drove 22 miles through Taurus-Littrow. When Gene climbed into the lunar module, he said: 'We leave as we came, and, God willing, as we shall return.' That was December 1972. Still waiting, Gene.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: Most famous field repair in history. Proved that duct tape works even in the vacuum of space. Absolute engineering supremacy.",
            genZStatus: "FINAL CREW RESTING SITE // DUCT TAPE LEGEND \ud83d\udee0\ufe0f",
            tagline: "The Atomic-Powered Science Lab and the Duct-Tape Rover",
            perspectiveNarrative: "I am the combination of humanity's longest drive on the Moon and the atomic laboratory that kept broadcasting for five whole years after the humans departed. During our drives, a rock hammer chipped one of my fenders, spraying abrasive lunar dust all over the crew. Thinking fast, the astronauts taped four laminated plastic geology maps together with gray duct tape and clamped them on—one of history's most famous field repairs! My companion ALSEP station was powered by a plutonium generator, dutifully sending moonquake data back to Earth until NASA shut down the receiver antennas in 1977.",
            juniorSummary: "When this Moon buggy's rear fender snapped, the astronauts used real duct tape and plastic Moon maps to tape it back together! It drove 35 kilometers and discovered orange soil on the Moon.",
            juniorJoke: {
                question: "Why did the Apollo astronauts take duct tape to the Moon?",
                punchline: "Because duct tape has a light side, a dark side, and it binds the universe together!"
            },
            whyItMatters: "Proved that nuclear-powered surface experiments could reliably gather geophysical data for years in the extreme thermal environment of the Moon."
        }
    },
    {
        id: "surveyor-3",
        planet: "moon",
        name: "Surveyor 3 Robot Lander",
        designation: "Surveyor C",
        nickname: "The Welcoming Scout",
        category: "Robotic Soft Lander",
        launchDate: "April 17, 1967",
        landingDate: "April 20, 1967",
        finalTransmissionDate: "May 4, 1967 (Visited by Apollo 12 on Nov 19, 1969)",
        missionConclusionDate: "May 4, 1967 (Primary Mission Complete)",
        status: "Inspected Archaeological Site",
        physicalCondition: "Tripod structure resting inside Surveyor Crater; camera, scoop, and tube sections removed by Apollo 12",
        coordinates: { lat: -3.0156, lon: -23.4183 },
        coordinateMetadata: {
            lat: -3.0156,
            lon: -23.4183,
            convention: "Mean Earth/Polar Axis, West-negative (336.5817°E)",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "±2.6 m",
            sourceObservation: "LROC NAC Frame M114102049RE"
        },
        locationName: "Oceanus Procellarum (Ocean of Storms)",
        operationalLifespan: "14 days active mission; revisited 2.5 years later by Apollo 12",
        totalDistance: "Stationary Soft Lander (Bounced 3 times on touchdown)",
        imagePath: "assets/renders/surveyor3.jpg",
        meshyModelKeyword: "surveyor 3 lander tripod robotic claw camera",
        nasaNssdcId: "1967-035A",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=-23.42&y=-3.01&z=10",
        audioTelemetryType: "vintage-tv-scan",
        lastTransmissionMessage: {
            telemetry: "TV CAMERA: 6,315 FRAMES TRANSMITTED | SOIL MECHANICS SAMPLER: 4 TRENCHES EXCAVATED",
            quote: "\"I proved the Moon was solid enough for human feet. Two years later, they came back to say hello.\"",
            actualContext: "Surveyor 3 bounced three times before settling in a crater in the Ocean of Storms. In November 1969, Apollo 12 astronauts Pete Conrad and Alan Bean executed a precision landing just 183 meters away and walked to Surveyor 3, disassembling its camera and soil scoop to return to Earth."
        },
        scientificContributions: [
            "Proved lunar soil had adequate bearing strength (0.5 to 0.7 kg/cm²) to support the Apollo Lunar Module landing gear.",
            "Excavated four trenches up to 18 cm deep with a motorized soil mechanics surface sampler claw.",
            "Provided the world's first field study of long-term deep-space radiation and micrometeoroid exposure on spacecraft materials."
        ],
        storytelling: {
            adultTagline: "The First Interplanetary Spacecraft Retrieved & Examined by Human Astronauts",
            adultNarrative: "Surveyor 3 soft-landed on Oceanus Procellarum on April 20, 1967, returning 6,315 television images and using a robotic scoop to verify that lunar soil could bear the weight of the Apollo Lunar Module. On November 19, 1969, Apollo 12 astronauts Pete Conrad and Alan Bean executed a pinpoint landing 183 meters away, walked to Surveyor 3, and retrieved its TV camera, robotic scoop, and tubing for laboratory analysis on Earth.",
            adultWhyMatters: "Surveyor 3 provided science with the first empirical analysis of how human hardware and materials degrade under multi-year exposure to solar radiation, micrometeorites, and extreme thermal cycling on another world.",
            adultConclusion: "Surveyor 3 remains resting in its crater in the Ocean of Storms, having contributed both to early robotic reconnaissance and subsequent human materials science analysis.",
            genZTagline: "The robot that got visited by Apollo 12 astronauts 2.5 years later. Total sci-fi moment.",
            genZNarrative: "I soft-landed in Oceanus Procellarum in 1967 and dug trenches with my robotic scoop to test lunar soil. But here's the crazy part: in November 1969, Pete Conrad and Alan Bean on Apollo 12 literally landed their lunar module 600 feet away from me! They walked over, took selfies with me, cut off my TV camera, and brought it back to Earth to study how space weathered it. The only robotic lander ever visited by humans on another celestial body. Absolute cinema.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: The ONLY robot visited by astronauts on another world. Proved pinpoint precision landings worked.",
            genZStatus: "HISTORIC VISITED CRAFT // APOLLO 12 CAM \ud83d\udcf7",
            tagline: "The Only Robot on Another World Inspected in Person by Humans",
            perspectiveNarrative: "Before humans walked on the Moon, some scientists feared the surface was covered in tens of feet of fluffy dust that would swallow landers whole. I was sent to investigate. I touched down on April 20, 1967, and dug four trenches with my electric scoop, proving the regolith was firm and supportive. Two and a half years later, the Apollo 12 lander touched down nearby. Astronauts walked over to me, inspected my frame, unbolted my television camera, and took it back to Earth for analysis.",
            juniorSummary: "Surveyor 3 landed on the Moon first. Two years later, real astronauts walked right up to it, took pictures with it, and used tools to take its camera back home to Earth!",
            juniorJoke: {
                question: "Why was the robot lander happy to see the astronauts?",
                punchline: "Because it had been waiting for two years for someone to say cheese!"
            },
            whyItMatters: "Surveyor 3 is the foundational benchmark for extraterrestrial materials degradation and space archaeology."
        }
    },
    {
        id: "surveyor-6",
        planet: "moon",
        name: "Surveyor 6 Robot Lander",
        designation: "Surveyor F",
        nickname: "The First Moon Hopper",
        category: "Robotic Soft Lander",
        launchDate: "November 7, 1967",
        landingDate: "November 10, 1967",
        surfaceHopDate: "November 17, 1967 (First Off-World Powered Liftoff)",
        finalTransmissionDate: "December 14, 1967 (End of First Lunar Day)",
        missionConclusionDate: "December 14, 1967 (Primary Mission Complete)",
        status: "Mission Concluded (Silent)",
        physicalCondition: "Intact robotic tripod resting 2.5 meters from its initial touchdown imprint",
        coordinates: { lat: 0.474, lon: -1.400 },
        coordinateMetadata: {
            lat: 0.474,
            lon: -1.400,
            convention: "Mean Earth/Polar Axis, West-negative (358.600°E)",
            datum: "LROC NAC Geodetic Coordinate Frame",
            uncertainty: "±6.7 m",
            sourceObservation: "LROC NAC Frame M119864273RE"
        },
        locationName: "Sinus Medii (Central Bay)",
        operationalLifespan: "34 days active surface operation",
        totalDistance: "2.5-meter lateral surface hop across the regolith",
        imagePath: "assets/renders/surveyor6.jpg",
        meshyModelKeyword: "surveyor 6 lander tripod rocket engine hop sinus medii",
        nasaNssdcId: "1967-112A",
        nasaTrekUrl: "https://trek.nasa.gov/moon/#v=0.1&x=-1.40&y=0.47&z=10",
        audioTelemetryType: "vintage-tv-scan",
        lastTransmissionMessage: {
            telemetry: "VERNIER ENGINES: 2.5-SEC BURN | HOP ALTITUDE: 4.0 METERS | LATERAL TRANSLATION: 2.5 METERS",
            quote: "\"The first rocket engine ever fired from the surface of an alien world.\"",
            actualContext: "On November 17, 1967, after completing its initial photographic survey, Surveyor 6 fired its three liquid-propellant vernier engines for 2.5 seconds. It lifted 4 meters off the surface, translated sideways, and touched down 2.5 meters away, accomplishing humanity's first extraterrestrial liftoff."
        },
        scientificContributions: [
            "Achieved the first powered rocket liftoff from the surface of another celestial body.",
            "Imaged its own original touchdown footprint and disturbed soil, providing crucial geotechnical data on rocket plume blast effects.",
            "Employed an Alpha-Scattering instrument to provide the first chemical composition analysis of the lunar mare (basaltic basalt with high titanium)."
        ],
        storytelling: {
            adultTagline: "Humanity's First Powered Rocket Liftoff & Translation on Another Celestial Body",
            adultNarrative: "Soft-landing on Sinus Medii on November 10, 1967, Surveyor 6 was the penultimate robotic scout supporting Apollo site selection. On November 17, controllers commanded the lander's vernier rocket engines to ignite for 2.5 seconds. Surveyor 6 rose 4 meters into the air, translated laterally 2.5 meters, and set down safely, transmitting photographs of its original footpad impressions and soil disturbance.",
            adultWhyMatters: "Surveyor 6 achieved humanity's first powered rocket launch and relocation from the surface of another celestial body, providing vital flight dynamics proof that the Apollo Lunar Module Ascent Stage could launch safely from lunar regolith.",
            adultConclusion: "Surveyor 6 transmitted over 30,000 images and conducted alpha-scattering chemical analysis of the lunar mare before concluding operations at lunar sunset on November 24, 1967.",
            genZTagline: "The first spacecraft to ever launch FROM another world. Did a bunny hop on the Moon.",
            genZNarrative: "I landed in Sinus Medii in 1967. After sending thousands of photos, JPL decided to do something insane: they commanded my rocket engines to reignite on the Moon! For 2.5 seconds, my thrusters blasted, I jumped 12 feet into the lunar sky, flew sideways, and landed again 8 feet away! I became the first spacecraft in human history to take off from the surface of another celestial world. The ultimate off-world bunny hop.",
            genZWhyMatters: "\u26a1 THE VIBE CHECK: First rocket liftoff from an alien world. Proved lunar module ascent engines would actually work to bring Apollo crews home.",
            genZStatus: "HOPPING PIONEER // FIRST LUNAR LIFTOFF \ud83e\udd98",
            tagline: "The First Spacecraft to Ever Launch From Another World",
            perspectiveNarrative: "I touched down in Sinus Medii on November 10, 1967. After sending thousands of television images, flight controllers at JPL decided to test something unprecedented: they commanded my vernier rocket engines to reignite. For 2.5 seconds, my engines fired in the airless silence. I rose 4 meters into the lunar sky, moved sideways, and landed 2.5 meters away. I became the very first vehicle to ever take off from the surface of another celestial world.",
            juniorSummary: "Surveyor 6 did a Moon hop! It landed safely, and then its rocket engines fired again, lifting it up like a kangaroo and landing it 8 feet over to the side!",
            juniorJoke: {
                question: "Why was Surveyor 6 the best hopper in space?",
                punchline: "Because it knew how to stick the landing twice!"
            },
            whyItMatters: "Proved that rocket propulsion could restart in the cold vacuum of the lunar surface, a crucial prerequisite for Apollo lunar module ascent."
        }
    }
];
