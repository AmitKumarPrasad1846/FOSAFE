/**
 * FOSAFE Internationalization & Language Manager
 * Bilingual support for English (EN) and Hindi (हिन्दी).
 * Simple, accessible, human-friendly translations designed for miners,
 * safety operators, fleet managers, and hackathon evaluators.
 */

const STORAGE_KEY = 'fosafe_lang';

export const DICTIONARY = {
  en: {
    // Nav & Shell
    'nav.brand': 'FOSAFE',
    'nav.tech': 'TECH',
    'nav.physics': 'HOW IT WORKS',
    'nav.platform': 'PLATFORM',
    'nav.about': 'ABOUT',
    'nav.access': 'ACCESS',
    'nav.login': 'LOGIN',
    'nav.theme_toggle': 'Toggle Theme',
    'nav.lang_toggle': 'Language',

    // Hero Station (Station 01)
    'hero.marker': 'STATION 01 // OVERVIEW',
    'hero.title_line1': 'SMART FOG SAFETY',
    'hero.title_line2': 'FOR MINE TRUCKS',
    'hero.subtitle': 'Heavy fog and dust blind truck drivers in open mines. FOSAFE uses smart sensors and radar to warn drivers before an accident happens.',
    'hero.btn_platform': 'EXPLORE SYSTEM',
    'hero.btn_scroll': 'HOW IT WORKS ↓',
    'hero.card_primary': 'TRUCK UNIT',
    'hero.card_primary_sub': 'CAT 797F (400 Tons)',
    'hero.card_distance': 'TRUCK DISTANCE',
    'hero.card_distance_val': '08.4 m',
    'hero.card_distance_sub': 'CLOSING: 4.2 km/h',
    'hero.card_status': 'SAFETY STATUS',
    'hero.card_status_val': 'CAUTION: TRUCK NEARBY',
    'hero.card_status_sub': 'SLOW DOWN ADVISORY',

    // Station 02: The Problem
    's02.marker': 'STATION 02 // THE DANGER',
    's02.title': 'Why Fog is Deadly in Open Mines',
    's02.lead': 'In open mines, cold morning fog and heavy coal dust trap visibility below 15 meters.',
    's02.p1': 'A fully loaded 400-ton mining truck is heavier than a jumbo jet. Moving downhill on a mine ramp, it needs more than 60 meters to stop safely. When drivers cannot see past 15 meters, stopping in time becomes impossible without a smart warning system.',
    's02.card1_label': '400T STOPPING DISTANCE',
    's02.card1_sub': 'At 30 km/h on an 8% wet mine ramp',
    's02.card2_label': 'DRIVER SIGHTLINE (FOG)',
    's02.card2_sub': 'Dense morning fog & dust',
    's02.alert': 'THE PROBLEM: Drivers cannot see obstacles in time to stop safely.',

    // Station 03: The 4 Steps
    's03.marker': 'STATION 03 // SIMPLE 4-STEP SYSTEM',
    's03.title': 'How FOSAFE Protects Every Truck',
    's03.lead': 'A simple, automatic safety loop that works 24/7 inside the mine without requiring mobile network.',
    's03.step1_title': '1. SENSE',
    's03.step1_desc': 'Distance sensors and radar check the road ahead 100 times every second.',
    's03.step1_tag': 'Radar · Ultrasonic · Tilt Sensors',
    's03.step2_title': '2. THINK',
    's03.step2_desc': 'A fast on-truck computer calculates distance, speed, and crash risk instantly.',
    's03.step2_tag': 'Instant calculation in <0.05s',
    's03.step3_title': '3. WARN',
    's03.step3_desc': 'Bright warning lights and a loud buzzer alert the driver inside the truck cab.',
    's03.step3_tag': 'In-Cab Lights & Loud Buzzer',
    's03.step4_title': '4. TRACK',
    's03.step4_desc': 'Mine supervisors see all trucks live on a digital map in the control room.',
    's03.step4_tag': 'Live Map & Emergency Radio',

    // Station 04: The Device
    's04.marker': 'STATION 04 // ON-TRUCK HARDWARE',
    's04.title': 'The In-Cab Safety Computer',
    's04.lead': 'A heavy-duty, dustproof box mounted inside the truck cabin. It connects to sensors and keeps running even if the internet drops.',

    // Station 05: Fog Intelligence
    's05.marker': 'STATION 05 // FOG ADAPTATION',
    's05.title': 'Smart Warnings That Adapt to Weather',
    's05.lead': 'As morning fog gets thicker, FOSAFE automatically gives drivers earlier warnings and larger safety buffers so they have plenty of time to slow down.',

    // Station 06: Driver HUD
    's06.marker': 'STATION 06 // CAB DASHBOARD',
    's06.title': 'Driver Safety Screen',
    's06.lead': 'A simple, clear screen on the driver’s dashboard. Green means road is clear, yellow means vehicle ahead, and flashing red means stop immediately.',
    's06.tag': 'IN-CAB SCREEN',

    // Station 07: Control Room
    's07.marker': 'STATION 07 // DISPATCH ROOM',
    's07.title': 'Mine Fleet Control Room',
    's07.lead': 'Mine supervisors can see every hauler on a live radar map, monitor blind curves, and broadcast emergency alerts in seconds.',
    's07.tag': 'DISPATCH CONSOLE',

    // Station 08: Real-Time Speed
    's08.marker': 'STATION 08 // INSTANT SPEED',
    's08.title': 'Instant Alerts — Zero Lag',
    's08.lead': 'The system processes every measurement in under 0.05 seconds — 10 times faster than human eye-to-foot reaction time.',

    // Station 09: One-Touch Fog Mode
    's09.marker': 'STATION 09 // ONE-TOUCH CONTROL',
    's09.title': 'One-Touch Fog Assist Button',
    's09.lead': 'When driving into dense fog, the operator presses the "Fog Assist" button. The truck instantly increases warning distance and notifies nearby haulers.',

    // Station 10: Operational Tiers
    's10.marker': 'STATION 10 // FIELD TESTED',
    's10.title': 'Built for Real Mining Operations',
    's10.lead': 'Designed for easy installation on 24V mining vehicles, fully adhering to mine safety circulars and guidelines.',
    's10.tier1_label': 'CAB UNIT',
    's10.tier1_title': 'Driver Safety Screen',
    's10.tier1_desc': 'Works 100% standalone inside the truck. Doesn’t need internet or cellular signal to save lives.',
    's10.tier1_tag': 'Instant Buzzer · Works Offline',
    's10.tier2_label': 'SUPERVISOR',
    's10.tier2_title': 'Mine Control Dashboard',
    's10.tier2_desc': 'Live radar view of the whole pit. Tracks truck speeds, fog levels, and hazardous blind turns.',
    's10.tier2_tag': 'Live Radar · Speed Tracking',
    's10.tier3_label': 'SIMULATOR',
    's10.tier3_title': 'Safety Testing Simulator',
    's10.tier3_desc': 'Interactive digital simulator to test truck braking scenarios in thick virtual fog.',
    's10.tier3_tag': 'Virtual Tests · Safety Data',

    // Collaboration Specs
    's10.spec1_title': 'MINE OPERATORS',
    's10.spec1_desc': 'Quick plug-and-play installation on existing 24V haul trucks and utility pickups.',
    's10.spec2_title': 'SAFETY REGULATIONS',
    's10.spec2_desc': 'Complies with DGMS proximity circulars and modern collision avoidance guidelines.',
    's10.spec3_title': 'EASY FLEET INTEGRATION',
    's10.spec3_desc': 'Connects easily with existing mine dispatch radios and GPS tracking systems.',
    's10.spec4_title': 'AUTONOMOUS READY',
    's10.spec4_desc': 'Ready to interface directly with self-driving and robot haulage trucks.',

    // Call to Action
    's10.cta_title': 'Ready to experience FOSAFE?',
    's10.cta_desc': 'Test the live interactive dashboard or view hardware technical specifications.',
    's10.cta_launch': 'LAUNCH PLATFORM →',
    's10.cta_specs': 'HARDWARE SPECS',

    // Rail Markers
    'rail.s01': '01 · OVERVIEW',
    'rail.s02': '02 · THE DANGER',
    'rail.s03': '03 · 4 STEPS',
    'rail.s04': '04 · HARDWARE',
    'rail.s05': '05 · FOG ADAPT',
    'rail.s06': '06 · CAB HUD',
    'rail.s07': '07 · CONTROL',
    'rail.s08': '08 · FAST SPEED',
    'rail.s09': '09 · FOG BUTTON',
    'rail.s10': '10 · FIELD READY',

    // Technology Page
    'tech.marker': 'HARDWARE SPECS // ON-VEHICLE COMPUTER',
    'tech.title': 'Vehicle Safety Unit Technology',
    'tech.lead': 'A rugged dustproof computer installed in each truck cabin. Operates 100% locally on distance sensors — saving lives even if the mine radio or mobile network drops.',
    'tech.core_header': 'SMART DUAL-CORE PROCESSOR',
    'tech.core0_title': 'CORE 0: RADIO & DISPATCH TRACKING',
    'tech.core0_badge': 'COMMUNICATIONS',
    'tech.core0_desc': 'Broadcasts GPS coordinates, fog status, and emergency alerts to the central control room without delaying safety alerts.',
    'tech.core1_title': 'CORE 1: INSTANT CRASH PREVENTION',
    'tech.core1_badge': 'HIGH PRIORITY',
    'tech.core1_desc': 'Runs the emergency collision loop. Scans distance sensors 100 times per second and triggers the loud cab alarm in under 0.015 seconds.',
    'tech.table_title': 'Connected Sensors & Fail-Safes',

    // How It Works Page
    'how.marker': 'PHYSICS & BRAKING DYNAMICS',
    'how.title': 'How Heavy Mining Trucks Stop',
    'how.lead': 'A loaded 400-ton mining truck cannot stop like an ordinary car. Use the live calculator below to see how vehicle speed and steep downhill slopes affect stopping distance.',
    'how.calc_title': 'TRUCK BRAKING DISTANCE CALCULATOR',
    'how.calc_subtitle': 'Live physics calculation for ultra-class haul trucks',
    'how.speed_label': 'TRUCK SPEED',
    'how.grade_label': 'ROAD SLOPE (DOWNHILL GRADE)',
    'how.total_stopping': 'TOTAL STOPPING DISTANCE',
    'how.brake_dist': 'Actual Braking Distance',
    'how.reaction_dist': 'Driver Reaction Distance',
    'how.summary_alert': 'In thick fog (15m sightline), any truck moving faster than 20 km/h downhill cannot stop in time without FOSAFE alerts.',

    // Platform Page
    'platform.marker': '3 OPERATIONAL TIERS',
    'platform.title': 'Unified Mine Safety Platform',
    'platform.lead': 'Experience all three components of FOSAFE: the Driver Cab Screen, the Central Mine Control Room, and the Testing Simulator.',
    'platform.tab_driver': 'DRIVER CAB SCREEN',
    'platform.tab_control': 'MINE CONTROL ROOM',
    'platform.tab_simulator': 'TEST SIMULATOR',

    // Collaboration Page
    'collab.marker': 'FIELD TRIALS & DEPLOYMENT',
    'collab.title': 'Collaboration & Mine Trials',
    'collab.lead': 'Designed for straightforward 24V installation on existing haul trucks and utility pickups. Fully compliant with DGMS proximity safety guidelines.',
    'collab.form_title': 'Request a Demonstration or Mine Pilot',
    'collab.form_name': 'Mine Name / Location',
    'collab.form_fleet': 'Number of Trucks',
    'collab.form_submit': 'REQUEST TRIAL INFORMATION →',

    // About Page
    'about.marker': 'WHY FOSAFE WAS BUILT',
    'about.title': 'The Reality of Open-Cast Mines',
    'about.lead': 'Why drivers 5.5 meters off the ground cannot see small vehicles, and why cold winter morning fog is the leading safety hazard in coal mines.',
    'about.blind_title': 'Blind Spots of Massive Haul Trucks',
    'about.blind_desc': 'In trucks like the Cat 797F, the driver sits nearly two stories in the air. The front blind spot extends 14 meters forward — an entire pickup truck can be completely hidden right in front of the bumper.',

    // Login Page
    'login.marker': 'INSTANT ACCESS PORTAL',
    'login.title': 'Try FOSAFE Live Demo',
    'login.lead': 'Select a role below to explore the interface as a Truck Driver, Mine Dispatcher, or Safety Engineer.',
    'login.role_operator': 'Truck Driver',
    'login.role_dispatch': 'Mine Dispatcher',
    'login.role_qa': 'Safety Engineer',
    'login.submit_btn': 'ENTER PLATFORM DEMO →'
  },

  hi: {
    // Nav & Shell
    'nav.brand': 'FOSAFE',
    'nav.tech': 'तकनीक',
    'nav.physics': 'यह कैसे काम करता है',
    'nav.platform': 'प्लेटफ़ॉर्म',
    'nav.about': 'हमारे बारे में',
    'nav.access': 'प्रवेश',
    'nav.login': 'लॉगिन',
    'nav.theme_toggle': 'थीम बदलें',
    'nav.lang_toggle': 'भाषा',

    // Hero Station (Station 01)
    'hero.marker': 'स्टेशन 01 // परिचय',
    'hero.title_line1': 'खदान ट्रकों के लिए',
    'hero.title_line2': 'स्मार्ट कोहरा सुरक्षा',
    'hero.subtitle': 'खुली खदानों में घना कोहरा और धूल ड्राइवरों की नज़र छीन लेते हैं। FOSAFE स्मार्ट सेंसर और रडार की मदद से दुर्घटना होने से पहले ही ड्राइवर को सतर्क कर देता है।',
    'hero.btn_platform': 'सिस्टम देखें',
    'hero.btn_scroll': 'पूरी प्रक्रिया देखें ↓',
    'hero.card_primary': 'मुख्य वाहन',
    'hero.card_primary_sub': 'CAT 797F (400 टन डंपर)',
    'hero.card_distance': 'अगली गाड़ी की दूरी',
    'hero.card_distance_val': '08.4 मीटर',
    'hero.card_distance_sub': 'पास आने की गति: 4.2 किमी/घंटा',
    'hero.card_status': 'सुरक्षा स्थिति',
    'hero.card_status_val': 'सावधान: गाड़ी नज़दीक है',
    'hero.card_status_sub': 'गति धीमी करने का सुझाव',

    // Station 02: The Problem
    's02.marker': 'स्टेशन 02 // असली खतरा',
    's02.title': 'खदानों में कोहरा क्यों जानलेवा है?',
    's02.lead': 'सर्दियों के मौसम में खदान की गहराई में घना कोहरा और कोयले की धूल जम जाती है, जिससे 15 मीटर से आगे कुछ नहीं दिखता।',
    's02.p1': '400 टन का भरा हुआ डंपर हवाई जहाज से भी भारी होता है। ढलान पर चलते समय इसे पूरी तरह रुकने में 60 मीटर से अधिक की दूरी चाहिए। जब आगे केवल 15 मीटर ही दिख रहा हो, तो बिना स्मार्ट सिस्टम के टक्कर से बचना नामुमकिन है।',
    's02.card1_label': '400 टन डंपर रुकने की दूरी',
    's02.card1_sub': '30 किमी/घंटा की गति, 8% ढलान पर',
    's02.card2_label': 'ड्राइवर की नज़र (कोहरे में)',
    's02.card2_sub': 'घने कोहरे और धूल में दृश्यता',
    's02.alert': 'मुख्य समस्या: ड्राइवर को सामने की गाड़ी इतनी देर से दिखती है कि ब्रेक लगाना नामुमकिन हो जाता है।',

    // Station 03: The 4 Steps
    's03.marker': 'स्टेशन 03 // 4 आसान चरण',
    's03.title': 'FOSAFE ड्राइवरों की जान कैसे बचाता है?',
    's03.lead': 'एक पूरी तरह स्वचालित सुरक्षा प्रणाली, जो बिना मोबाइल नेटवर्क या इंटरनेट के भी खदान में 24 घंटे काम करती है।',
    's03.step1_title': '1. पहचान (सेंसर)',
    's03.step1_desc': 'सोनार और रडार सेंसर हर सेकंड 100 बार आगे की सड़क और गाड़ियों की जांच करते हैं।',
    's03.step1_tag': 'रडार · अल्ट्रासोनिक · झुकाव सेंसर',
    's03.step2_title': '2. सोच (कंप्यूटर)',
    's03.step2_desc': 'ट्रक में लगा स्मार्ट कंप्यूटर तुरंत दूरी, गति और टक्कर के खतरे का हिसाब लगाता है।',
    's03.step2_tag': '0.05 सेकंड से भी कम में गणना',
    's03.step3_title': '3. चेतावनी (अलर्ट)',
    's03.step3_desc': 'केबिन में लगी तेज़ लाल लाइट और ज़ोरदार बज़र ड्राइवर को तुरंत ब्रेक लगाने को कहते हैं।',
    's03.step3_tag': 'तेज़ बज़र और डैशबोर्ड लाइट',
    's03.step4_title': '4. निगरानी (कंट्रोल रूम)',
    's03.step4_desc': 'कंट्रोल रूम में बैठे अधिकारी लाइव नक्शे पर खदान की हर गाड़ी की स्थिति देख सकते हैं।',
    's03.step4_tag': 'लाइव नक्शा और इमरजेंसी रेडियो',

    // Station 04: The Device
    's04.marker': 'स्टेशन 04 // ट्रक का उपकरण',
    's04.title': 'केबिन में लगा सुरक्षा कंप्यूटर',
    's04.lead': 'धूल और झटकों को झेलने वाला एक मज़बूत कंप्यूटर, जो ड्राइवर के केबिन में लगता है और इंटरनेट न होने पर भी काम करता है।',

    // Station 05: Fog Intelligence
    's05.marker': 'स्टेशन 05 // मौसम अनुकूलन',
    's05.title': 'कोहरे के हिसाब से बदलने वाली सुरक्षा',
    's05.lead': 'जैसे-जैसे कोहरा गहरा होता जाता है, FOSAFE चेतावनी देने की दूरी को अपने आप बढ़ा देता है ताकि ड्राइवर को संभलने का पूरा समय मिले।',

    // Station 06: Driver HUD
    's06.marker': 'स्टेशन 06 // ड्राइवर स्क्रीन',
    's06.title': 'ड्राइवर सुरक्षा स्क्रीन',
    's06.lead': 'ड्राइवर के सामने लगा सादा और साफ़ डिस्प्ले। हरा मतलब रास्ता साफ़ है, पीला मतलब आगे गाड़ी है, और चमकती लाल लाइट का मतलब तुरंत ब्रेक लगाएं।',
    's06.tag': 'केबिन स्क्रीन',

    // Station 07: Control Room
    's07.marker': 'स्टेशन 07 // कंट्रोल रूम',
    's07.title': 'खदान फ्लीट कंट्रोल रूम',
    's07.lead': 'सुपरवाइज़र एक ही रडार स्क्रीन पर सभी ट्रकों को देख सकते हैं, खतरनाक मोड़ों की निगरानी कर सकते हैं और तुरंत आपातकालीन संदेश भेज सकते हैं।',
    's07.tag': 'कंट्रोल स्क्रीन',

    // Station 08: Real-Time Speed
    's08.marker': 'स्टेशन 08 // तुरंत प्रतिक्रिया',
    's08.title': 'पलक झपकते ही चेतावनी — बिना देरी',
    's08.lead': 'यह सिस्टम 0.05 सेकंड में निर्णय लेता है — इंसान के पैर से ब्रेक दबाने की गति से 10 गुना तेज़।',

    // Station 09: One-Touch Fog Mode
    's09.marker': 'स्टेशन 09 // एक बटन से चालू',
    's09.title': 'एक-टच कोहरा सुरक्षा बटन',
    's09.lead': 'घने कोहरे में घुसते ही ड्राइवर डैशबोर्ड पर मौजूद "फॉग असिस्ट" बटन दबाता है। ट्रक तुरंत सुरक्षित दूरी बढ़ा लेता है और आसपास की गाड़ियों को अलर्ट भेजता है।',

    // Station 10: Operational Tiers
    's10.marker': 'स्टेशन 10 // खदानों के लिए तैयार',
    's10.title': 'असली खदानों की ज़रूरतों के लिए निर्मित',
    's10.lead': 'खदान में चलने वाले 24 वोल्ट के भारी वाहनों में आसानी से लगने वाला, सरकारी सुरक्षा मानकों के अनुरूप बना सिस्टम।',
    's10.tier1_label': 'केबिन यूनिट',
    's10.tier1_title': 'ड्राइवर स्क्रीन व अलार्म',
    's10.tier1_desc': 'ट्रक के अंदर स्वतंत्र रूप से काम करता है। इसे जान बचाने के लिए इंटरनेट या मोबाइल नेटवर्क की ज़रूरत नहीं होती।',
    's10.tier1_tag': 'तुरंत बज़र · बिना इंटरनेट सक्षम',
    's10.tier2_label': 'सुपरवाइज़र',
    's10.tier2_title': 'माइन कंट्रोल डैशबोर्ड',
    's10.tier2_desc': 'पूरी खदान का लाइव रडार नज़ारा। ट्रकों की गति, कोहरे का स्तर और खतरनाक अंधे मोड़ों की निगरानी।',
    's10.tier2_tag': 'लाइव रडार · गति निगरानी',
    's10.tier3_label': 'सिम्युलेटर',
    's10.tier3_title': 'सुरक्षा टेस्ट सिम्युलेटर',
    's10.tier3_desc': 'कंप्यूटर पर घने कोहरे और अचानक ब्रेक लगाने की स्थितियों का अभ्यास करने वाला टूल।',
    's10.tier3_tag': 'वर्चुअल टेस्ट · सुरक्षा डेटा',

    // Collaboration Specs
    's10.spec1_title': 'खदान ऑपरेटर',
    's10.spec1_desc': 'मौजूदा 24V डंपर और इंस्पेक्शन जीप में बिना किसी जटिल बदलाव के तुरंत लग जाता है।',
    's10.spec2_title': 'सुरक्षा मानक',
    's10.spec2_desc': 'DGMS के निकटता सुरक्षा सर्कुलर और आधुनिक टक्कर-रोधी दिशानिर्देशों के अनुकूल।',
    's10.spec3_title': 'रेडियो व GPS से जुड़ाव',
    's10.spec3_desc': 'खदान के मौजूदा वॉकी-टॉकी, रेडियो और GPS फ्लीट सिस्टम से आसानी से जुड़ जाता है।',
    's10.spec4_title': 'भविष्य के रोबोट ट्रक',
    's10.spec4_desc': 'बिना ड्राइवर वाले ऑटोमैटिक ट्रकों के साथ भी काम करने के लिए पूरी तरह सक्षम।',

    // Call to Action
    's10.cta_title': 'क्या आप FOSAFE का अनुभव करना चाहते हैं?',
    's10.cta_desc': 'इंटरैक्टिव कंट्रोल रूम चलाकर देखें या तकनीकी हार्डवेयर विवरण पढ़ें।',
    's10.cta_launch': 'सिस्टम खोलें →',
    's10.cta_specs': 'हार्डवेयर विवरण',

    // Rail Markers
    'rail.s01': '01 · परिचय',
    'rail.s02': '02 · असली खतरा',
    'rail.s03': '03 · 4 चरण',
    'rail.s04': '04 · उपकरण',
    'rail.s05': '05 · कोहरा सुरक्षा',
    'rail.s06': '06 · ड्राइवर HUD',
    'rail.s07': '07 · कंट्रोल रूम',
    'rail.s08': '08 · तेज़ स्पीड',
    'rail.s09': '09 · फॉग बटन',
    'rail.s10': '10 · तैयार सिस्टम',

    // Technology Page
    'tech.marker': 'हार्डवेयर विवरण // ट्रक का सुरक्षा कंप्यूटर',
    'tech.title': 'वाहन सुरक्षा यूनिट तकनीक',
    'tech.lead': 'हर ट्रक के केबिन में लगा एक बेहद मजबूत, धूल-रोधी कंप्यूटर। यह खदान के इंटरनेट या वॉकी-टॉकी सिग्नल के बिना भी 100% स्वतंत्र रूप से काम करता है।',
    'tech.core_header': 'स्मार्ट डुअल-कोर प्रोसेसर',
    'tech.core0_title': 'कोर 0: रेडियो व कंट्रोल रूम संपर्क',
    'tech.core0_badge': 'संचार व्यवस्था',
    'tech.core0_desc': 'GPS लोकेशन, कोहरे का स्तर और आपातकालीन अलर्ट सीधे कंट्रोल रूम को भेजता है, जिससे ब्रेक अलार्म में कोई रुकावट नहीं आती।',
    'tech.core1_title': 'कोर 1: तुरंत दुर्घटना रोकथाम',
    'tech.core1_badge': 'उच्च प्राथमिकता',
    'tech.core1_desc': 'इमरजेंसी टक्कर रोकने वाला मुख्य दिमाग। यह सेंसर को सेकंड में 100 बार पढ़ता है और 0.015 सेकंड से भी कम में बज़र बजा देता है।',
    'tech.table_title': 'जुड़े हुए सेंसर और सुरक्षा नियम',

    // How It Works Page
    'how.marker': 'भौतिक विज्ञान और ब्रेक का हिसाब',
    'how.title': 'भारी खदान डंपर कैसे रुकते हैं',
    'how.lead': '400 टन भरा हुआ डंपर सामान्य गाड़ी की तरह तुरंत नहीं रुक सकता। नीचे दिए गए लाइव कैलकुलेटर से देखें कि गति और ढलान से रुकने की दूरी कैसे बदलती है।',
    'how.calc_title': 'डंपर ब्रेकिंग दूरी कैलकुलेटर',
    'how.calc_subtitle': 'भारी खदान ट्रकों के लिए लाइव गति और दूरी गणना',
    'how.speed_label': 'ट्रक की गति',
    'how.grade_label': 'सड़क का ढलान (% ग्रेड)',
    'how.total_stopping': 'रुकने की कुल दूरी',
    'how.brake_dist': 'ब्रेक लगाने पर चली दूरी',
    'how.reaction_dist': 'ड्राइवर की प्रतिक्रिया दूरी',
    'how.summary_alert': 'घने कोहरे (15 मीटर दृश्यता) में 20 किमी/घंटा से तेज़ चलने वाला कोई भी ट्रक बिना FOSAFE चेतावनी के समय पर नहीं रुक सकता।',

    // Platform Page
    'platform.marker': '3 कार्य स्तर',
    'platform.title': 'एकीकृत खदान सुरक्षा प्लेटफ़ॉर्म',
    'platform.lead': 'FOSAFE के तीनों हिस्सों का अनुभव लें: केबिन स्क्रीन, खदान का मुख्य कंट्रोल रूम और टेस्टिंग सिम्युलेटर।',
    'platform.tab_driver': 'केबिन ड्राइवर स्क्रीन',
    'platform.tab_control': 'माइन कंट्रोल रूम',
    'platform.tab_simulator': 'सुरक्षा सिम्युलेटर',

    // Collaboration Page
    'collab.marker': 'खदान ट्रायल व उपयोग',
    'collab.title': 'साझेदारी और खदान परीक्षण',
    'collab.lead': 'मौजूदा डंपर और इंस्पेक्शन जीपों पर आसान 24V इंस्टॉलेशन। सरकारी DGMS सुरक्षा मानकों के पूरी तरह अनुकूल।',
    'collab.form_title': 'डेमो या खदान पायलट के लिए अनुरोध करें',
    'collab.form_name': 'खदान का नाम व स्थान',
    'collab.form_fleet': 'ट्रकों की कुल संख्या',
    'collab.form_submit': 'ट्रायल की जानकारी भेजें →',

    // About Page
    'about.marker': 'FOSAFE क्यों बनाया गया',
    'about.title': 'खुली खदानों की ज़मीनी हकीकत',
    'about.lead': '5.5 मीटर ऊंचे केबिन से नीचे की गाड़ियां क्यों नहीं दिखतीं, और सर्दियों का कोहरा खदानों के लिए सबसे बड़ा खतरा क्यों है।',
    'about.blind_title': 'विशाल डंपर के खतरनाक ब्लाइंड स्पॉट',
    'about.blind_desc': 'कैटरपिलर 797F जैसे ट्रकों में ड्राइवर दो मंजिला मकान की ऊंचाई पर बैठता है। बम्पर के आगे 14 मीटर तक ड्राइवर को कुछ नहीं दिखता — पूरी जीप छिप सकती है।',

    // Login Page
    'login.marker': 'तुरंत डेमो एक्सेस पोर्टल',
    'login.title': 'FOSAFE लाइव चलाकर देखें',
    'login.lead': 'ड्राइवर, कंट्रोल रूम अधिकारी या इंजीनियर के रूप में सिस्टम चलाने के लिए अपनी भूमिका चुनें।',
    'login.role_operator': 'ट्रक ड्राइवर',
    'login.role_dispatch': 'कंट्रोल रूम ऑपरेटर',
    'login.role_qa': 'सुरक्षा इंजीनियर',
    'login.submit_btn': 'प्लेटफ़ॉर्म में प्रवेश करें →'
  }
};

class I18nManager {
  constructor() {
    this.currentLang = this.detectInitialLang();
    this.subscribers = [];
  }

  detectInitialLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') return stored;
    } catch {
      // ignore
    }
    return 'en';
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'hi') return;
    if (this.currentLang === lang) return;

    this.currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }

    // Set html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Notify internal subscribers
    this.subscribers.forEach(cb => {
      try { cb(lang); } catch (e) { console.error('i18n subscriber error', e); }
    });

    // Dispatch global DOM event for components and pages
    window.dispatchEvent(new CustomEvent('fosafe:lang-change', { detail: { lang } }));
  }

  toggle() {
    const next = this.currentLang === 'en' ? 'hi' : 'en';
    this.setLang(next);
    return next;
  }

  t(key, fallback = '') {
    const dict = DICTIONARY[this.currentLang] || DICTIONARY.en;
    if (dict[key] !== undefined) return dict[key];
    const enDict = DICTIONARY.en;
    if (enDict[key] !== undefined) return enDict[key];
    return fallback || key;
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.subscribers.push(callback);
      return () => {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
      };
    }
    return () => {};
  }
}

export const i18n = new I18nManager();
