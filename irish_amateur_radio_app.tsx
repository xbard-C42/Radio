import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, BookOpen, Radio, Zap, Settings, Award, FileText, CheckCircle2, Circle, Play, RotateCcw, Target } from 'lucide-react';

const IrishAmateurRadioApp = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const frequencyBands = {
    hf_primary: [
      { band: "160m", freq: "1810-1850 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "160m", freq: "1850-2000 kHz", power: "10W (10 dBW)", status: "Primary", maritime: false, notes: "" },
      { band: "80m", freq: "3500-3800 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "40m", freq: "7000-7100 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "40m", freq: "7100-7200 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "20m", freq: "14000-14350 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "17m", freq: "18068-18168 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "15m", freq: "21000-21450 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "12m", freq: "24890-24990 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "10m", freq: "28000-29700 kHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" }
    ],
    hf_secondary: [
      { band: "2200m", freq: "135.7-137.8 kHz", power: "1W e.i.r.p.", status: "Secondary", maritime: false, notes: "" },
      { band: "630m", freq: "472.0-479.0 kHz", power: "5W e.i.r.p.", status: "Secondary", maritime: false, notes: "No interference to maritime/aero" },
      { band: "60m", freq: "5000-5500 kHz", power: "200W (23 dBW)", status: "Secondary", maritime: false, notes: "Spot frequencies only" },
      { band: "60m", freq: "5351.5-5366.5 kHz", power: "15W e.i.r.p.", status: "Secondary", maritime: false, notes: "" },
      { band: "30m", freq: "10100-10130 kHz", power: "400W (26 dBW)", status: "Secondary", maritime: false, notes: "Morse only" },
      { band: "30m", freq: "10130-10150 kHz", power: "400W (26 dBW)", status: "Secondary", maritime: false, notes: "Digimodes ≤500Hz" }
    ],
    vhf_uhf: [
      { band: "10m", freq: "30.000-49.000 MHz", power: "50W (17 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "6m", freq: "50.000-52.000 MHz", power: "100W (20 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "4m", freq: "54.000-69.900 MHz", power: "50W (17 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "4m", freq: "69.900-70.500 MHz", power: "50W/25W mobile", status: "Secondary", maritime: false, notes: "Fixed operation higher power" },
      { band: "2m", freq: "144.000-146.000 MHz", power: "400W (26 dBW)", status: "Primary", maritime: true, notes: "" },
      { band: "70cm", freq: "430.000-432.000 MHz", power: "50W (17 dBW)", status: "Primary", maritime: false, notes: "" },
      { band: "70cm", freq: "432.000-440.000 MHz", power: "400W (26 dBW)", status: "Primary", maritime: false, notes: "" }
    ],
    microwave: [
      { band: "23cm", freq: "1240-1300 MHz", power: "158W (22 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "13cm", freq: "2300-2400 MHz", power: "158W (22 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "6cm", freq: "5570-5650 MHz", power: "158W (22 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "6cm", freq: "5650-5850 MHz", power: "158W (22 dBW)", status: "Secondary", maritime: false, notes: "" },
      { band: "3cm", freq: "10000-10500 MHz", power: "158W (22 dBW)", status: "Secondary", maritime: false, notes: "10270-10300 prohibited" },
      { band: "1.2cm", freq: "24000-24050 MHz", power: "50W (17 dBW)", status: "Primary", maritime: false, notes: "" }
    ]
  };

  const renderFrequencyTable = (bands, title) => {
    return (
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-3">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Band</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Frequency</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Max Power</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Maritime</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((band, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-medium">{band.band}</td>
                  <td className="border border-gray-300 px-3 py-2">{band.freq}</td>
                  <td className="border border-gray-300 px-3 py-2">{band.power}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      band.status === 'Primary' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {band.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {band.maritime ? '✓' : '✗'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs">{band.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const learningModules = {
    'regulatory': {
      title: 'Regulatory Framework',
      icon: FileText,
      topics: {
        'amateur-service': {
          title: 'Amateur Service Definition',
          content: `**ITU Definition**: "A radiocommunication service for the purpose of self-training, intercommunication and technical investigations carried out by amateurs... solely with a personal aim and without pecuniary interest."

**Key Principles:**
- Non-commercial hobby only
- Personal aim, no monetary gain
- Self-training and technical investigation
- Emergency communications permitted
- Can only communicate with other licensed amateurs (except emergencies)

**ComReg Role:**
- Issues licences under Wireless Telegraphy Act 1926
- Manages spectrum allocation
- Enforces regulations
- Coordinates with international bodies`,
          quiz: [
            {
              q: "Amateur radio communications must be for:",
              options: ["Commercial purposes", "Personal aim without pecuniary interest", "Business use", "Government communications"],
              correct: 1
            },
            {
              q: "During normal operation, you can communicate with:",
              options: ["Anyone", "Only other amateur licensees", "Commercial stations", "Government agencies"],
              correct: 1
            }
          ]
        },
        'licence-types': {
          title: 'Licence Types & Requirements',
          content: `**CEPT Class 1 Licence:**
- Requires HAREC + Morse code (5 wpm minimum)
- Call-sign format: EI/EJ + digit + alphanumeric + letter
- Example: EI2CC

**CEPT Class 2 Licence:**
- Requires HAREC only (no Morse)
- Call-sign format: EI/EJ + digit + alphanumeric + alphanumeric + B
- Example: EI2CAB

**Other Licence Types:**
- **Club Licence**: For amateur radio clubs
- **Visitor Temporary**: For foreign amateurs (max 12 months)
- **Special Event**: Temporary call-signs for events
- **Automatic Station**: Repeaters, beacons, etc.

**Fees:**
- Standard licence: €100
- Reduced fee (65+, disability): €30
- Amendments: €30
- Temporary licences: €30`,
          quiz: [
            {
              q: "CEPT Class 1 requires:",
              options: ["HAREC only", "HAREC + Morse code", "Morse code only", "No examination"],
              correct: 1
            },
            {
              q: "A CEPT Class 2 call-sign always ends with:",
              options: ["Any letter", "The letter B", "A number", "Two letters"],
              correct: 1
            }
          ]
        },
        'call-signs': {
          title: 'Call-sign Allocation System',
          content: `**Irish Prefixes:**
- **EI**: Mainland Ireland
- **EJ**: Irish islands

**Call-sign Patterns:**

**Individual Licences:**
- CEPT Class 1: EI/EJ + [2-9] + [0-9,A-Z] + [A-Z]
- CEPT Class 2: EI/EJ + [2-9] + [0-9,A-Z] + [0-9,A-Z] + B

**Special Formats:**
- **Visitor**: EI/EJ + [2-9] + V + [0-9,A-Z] + [A-Z]
- **Club**: EI + [0-9] + up to 4 characters ending in letter
- **Special Event**: EI/EJ + [0-9] + up to 5 characters ending in letter

**Rules:**
- Sequential assignment (no choice for individual licences)
- Lifetime duration (except temporary)
- "Silent key" transfer possible to immediate family
- No re-issue of lapsed call-signs`,
          quiz: [
            {
              q: "EJ call-signs are used for:",
              options: ["All of Ireland", "Mainland Ireland", "Irish islands", "Northern Ireland"],
              correct: 2
            },
            {
              q: "Can you choose your own call-sign for a CEPT Class 1 licence?",
              options: ["Yes, any available call-sign", "No, assigned sequentially", "Yes, from a list", "Only for special events"],
              correct: 1
            }
          ]
        }
      }
    },
    'technical': {
      title: 'Technical Knowledge',
      icon: Zap,
      topics: {
        'frequency-bands': {
          title: 'Frequency Bands & Power Limits',
          content: `## Complete Irish Amateur Frequency Allocations

**HF Bands - Primary Allocation:**
- **1810-1850 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **1850-2000 kHz**: 10W (10 dBW) P.E.P.
- **3500-3800 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **7000-7100 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted  
- **7100-7200 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **14000-14350 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **18068-18168 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **21000-21450 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **24890-24990 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted
- **28000-29700 kHz**: 400W (26 dBW) P.E.P. - Maritime mobile permitted

**HF Bands - Secondary Allocation:**
- **135.7-137.8 kHz**: 1W (0 dBW) e.i.r.p.
- **472.0-479.0 kHz**: 5W (7 dBW) e.i.r.p. - No interference to maritime/aero nav
- **5000-5500 kHz**: 200W (23 dBW) P.E.P. - Spot frequencies only: 5.280, 5.300, 5.332, 5.348, 5.400, 5.405 MHz
- **5351.5-5366.5 kHz**: 15W (12 dBW) e.i.r.p.
- **10100-10130 kHz**: 400W (26 dBW) P.E.P. - Morse only
- **10130-10150 kHz**: 400W (26 dBW) P.E.P. - Narrowband digimodes ≤500Hz, SSB emergency only

**VHF Bands:**
- **30.000-49.000 MHz**: 50W (17 dBW) P.E.P. - Secondary
- **50.000-52.000 MHz**: 100W (20 dBW) P.E.P. - Secondary  
- **54.000-69.900 MHz**: 50W (17 dBW) P.E.P. - Secondary
- **69.900-70.500 MHz**: Fixed 50W (17 dBW), Mobile 25W (14 dBW) P.E.P. - Secondary
- **144.000-146.000 MHz**: 400W (26 dBW) P.E.P. - Primary, Maritime mobile permitted

**UHF Bands:**
- **430.000-432.000 MHz**: 50W (17 dBW) P.E.P. - Primary
- **432.000-440.000 MHz**: 400W (26 dBW) P.E.P. - Primary

**SHF/Microwave Bands:**
- **1240-1300 MHz**: 158W (22 dBW) P.E.P. - Secondary
- **2300-2400 MHz**: 158W (22 dBW) P.E.P. - Secondary
- **5570-5650 MHz**: 158W (22 dBW) P.E.P. - Secondary
- **5650-5850 MHz**: 158W (22 dBW) P.E.P. - Secondary
- **10000-10500 MHz**: 158W (22 dBW) P.E.P. - Secondary (10270-10300 GHz prohibited)
- **24000-24050 MHz**: 50W (17 dBW) P.E.P. - Primary
- **47000-47200 MHz**: 50W (17 dBW) P.E.P. - Primary
- **76000-81000 MHz**: 50W (17 dBW) P.E.P. - Secondary/Primary mix
- **134000-141000 MHz**: 50W (17 dBW) P.E.P. - Primary/Secondary mix
- **241000-250000 MHz**: 50W (17 dBW) P.E.P. - Secondary/Primary mix

**Additional Bands (Application Required):**
- **1300-1304 MHz**: 10W (10 dBW) P.E.P. - Repeater operation only
- **2400-2450 MHz**: 25W (14 dBW) P.E.P. - AMSAT satellite operation only

**Mobile Operation Restrictions:**
- **Land Mobile**: Maximum 17 dBW P.E.P. (except 70.125-70.450 MHz: 14 dBW)
- **Maritime Mobile**: Maximum 10 dBW P.E.P.
- **Islands in harbour areas** (e.g., Spike Island): Maximum 17 dBW P.E.P.

**Power Calculation Formula:**
e.i.r.p. (dBW) = P.E.P. (dBW) + Antenna Gain (dBi) - System Losses (dB)

**Key Notes:**
- P.E.P. measured at transmitter/amplifier output
- Primary allocation = full rights, Secondary = no interference/protection
- Maritime mobile permitted on specified HF bands only
- All power limits are Peak Envelope Power (P.E.P.)`,
          quiz: [
            {
              q: "What is the maximum power on 3.5-3.8 MHz?",
              options: ["100W", "400W (26 dBW)", "1000W", "10W"],
              correct: 1
            },
            {
              q: "How do you calculate e.i.r.p.?",
              options: ["Power × Antenna Gain", "P.E.P. (dBW) + Antenna Gain (dBi)", "Power - Antenna Gain", "Power ÷ Antenna Gain"],
              correct: 1
            },
            {
              q: "Which band requires application for use?",
              options: ["144-146 MHz", "28-29.7 MHz", "1300-1304 MHz", "432-440 MHz"],
              correct: 2
            },
            {
              q: "Maximum e.i.r.p. on 5351.5-5366.5 kHz:",
              options: ["15W (12 dBW)", "400W (26 dBW)", "158W (22 dBW)", "50W (17 dBW)"],
              correct: 0
            },
            {
              q: "Maritime mobile is permitted on:",
              options: ["All amateur bands", "Only VHF bands", "Specified HF bands only", "Only UHF bands"],
              correct: 2
            },
            {
              q: "The 10130-10150 kHz band allows:",
              options: ["All modes", "Narrowband digimodes ≤500Hz + emergency SSB", "Morse only", "FM only"],
              correct: 1
            }
          ]
        },
        'antennas': {
          title: 'Antenna Theory & Practice',
          content: `**Half-Wave Antenna Characteristics:**
- Designed for specific frequency (e.g., 40m band)
- Can operate on harmonics of fundamental frequency
- **Odd harmonics** (3rd, 5th): Easier impedance matching when centre-fed
- **Even harmonics** (2nd, 4th): Very high impedance, harder to match

**Feed Point Impedance:**
- Centre-fed dipole: ~73Ω on fundamental
- High impedance at even harmonics (potentially infinite)
- Alternative: feed closer to ends for even harmonics

**Non-Resonant Wire Antennas:**
- Impedance is resistive (no reactance) when fed at centre
- Exception: high reactance close to ends
- Higher impedance but low reactance = easier matching

**Practical Considerations:**
- SWR meter placement: immediately after transceiver/amplifier
- Before any low-pass filters
- Ensures accurate reading for equipment protection`,
          quiz: [
            {
              q: "A half-wave antenna for 40m will have easier matching on:",
              options: ["Even harmonics (20m, 10m)", "Odd harmonics (15m, 8.5m)", "All harmonics equally", "No harmonics work"],
              correct: 1
            },
            {
              q: "Where should an SWR meter be placed?",
              options: ["Before the transceiver", "After low-pass filters", "Immediately after transceiver/amplifier", "At the antenna"],
              correct: 2
            }
          ]
        },
        'equipment': {
          title: 'Equipment Standards & Safety',
          content: `**Equipment Construction:**
- All controls, meters, indicators clearly labelled
- Power supply details clearly indicated
- Home-built equipment must minimise interference
- SWR measurement capability mandatory
- Accurate frequency measurement required

**RF Safety (ICNIRP Compliance):**
- Non-ionising radiation limits must be observed
- Calculate exposure levels for your station
- Consider antenna location and power levels

**Spurious Emissions:**
- Must comply with ITU-R SM.1541-6 limits
- Out-of-band emission standards
- Proper filtering required

**Power Measurement:**
- P.E.P. measured at transmitter/amplifier output
- SSB measurement uses 1 kHz tone
- Include all losses (cables, connectors, switches)

**Technical Standards:**
- Good engineering practice required
- Minimise interference potential
- Proper grounding and shielding`,
          quiz: [
            {
              q: "What measurement capability is mandatory for all amateur stations?",
              options: ["Power meter", "SWR meter", "Frequency counter", "Antenna analyser"],
              correct: 1
            },
            {
              q: "Where is P.E.P. measured?",
              options: ["At the antenna", "At the transmitter output", "At the microphone", "At the receiver"],
              correct: 1
            }
          ]
        }
      }
    },
    'operational': {
      title: 'Operational Procedures',
      icon: Radio,
      topics: {
        'logging': {
          title: 'Logbook Requirements',
          content: `**Mandatory Logbook Information:**
1. **Dates** of transmission
2. **Times** (UTC) of first/last transmissions
3. **Frequency band** of transmission
4. **Mode** of transmission (SSB, CW, FM, etc.)
5. **Power level** (dBW or Watts)
6. **Call-signs** of stations contacted

**Additional Requirements:**
- Record changes to frequency, mode, or power
- Keep logbook at amateur station
- Available for inspection by authorised officers
- Must be kept up to date

**UTC Time Standard:**
- All times must be in UTC (Coordinated Universal Time)
- No local time permitted in official logs
- Ireland: UTC+0 (winter) / UTC+1 (summer)

**Record Keeping:**
- Permanent record required
- Digital logs acceptable
- Paper logs acceptable
- Must be readable and organised`,
          quiz: [
            {
              q: "All logbook times must be recorded in:",
              options: ["Local time", "GMT", "UTC", "Any time zone"],
              correct: 2
            },
            {
              q: "Which is NOT required in the logbook?",
              options: ["Power level", "Frequency band", "Weather conditions", "Call-signs contacted"],
              correct: 2
            }
          ]
        },
        'mobile-operation': {
          title: 'Mobile & Maritime Operation',
          content: `**Land Mobile Operation:**
- Call-sign suffix: "/M" (pronounced "slash mobile")
- Announce location at start, end, and every 30 minutes
- Maximum power typically 17 dBW
- Prohibited: at sea, estuaries, docks, harbours, airports

**Maritime Mobile Operation:**
- Call-sign suffix: "/MM" (pronounced "slash maritime mobile")
- Applies to ALL Irish waters (rivers, lakes, seas)
- Announce geographical position every 30 minutes
- Maximum power: 10 dBW
- Subject to ship's master approval

**Position Reporting:**
- Beginning and end of each contact
- Every 30 minutes during extended operation
- Include position in logbook
- Use standard geographical references

**Restrictions:**
- Cannot replace ship's radio equipment
- Must not interfere with vessel's radio
- Cease operation if interference occurs
- Follow maritime regulations`,
          quiz: [
            {
              q: "Maritime mobile applies to:",
              options: ["Only seas around Ireland", "Only rivers and lakes", "All Irish waters including rivers and lakes", "Only international waters"],
              correct: 2
            },
            {
              q: "Position must be announced every:",
              options: ["15 minutes", "30 minutes", "60 minutes", "Only at start and end"],
              correct: 1
            }
          ]
        },
        'emergency': {
          title: 'Emergency Communications',
          content: `**Emergency Use Permitted:**
- Provide communications during emergencies/disasters
- Amateur Radio Emergency Network (AREN) participation
- Override normal amateur-to-amateur restriction
- Coordinate with emergency services when needed

**Emergency Procedures:**
- Monitor emergency frequencies
- Provide traffic handling when required
- Maintain log of emergency communications
- Follow emergency coordinator instructions

**AREN (Amateur Radio Emergency Network):**
- Irish amateur emergency organisation
- Coordinates emergency communications
- Training and preparedness activities
- Works with government agencies

**Legal Framework:**
- Emergency use specifically permitted in regulations
- Normal restrictions may be relaxed during declared emergencies
- Must not interfere with official emergency services
- Document all emergency traffic properly

**Good Practice:**
- Maintain emergency power supplies
- Know local emergency frequencies
- Participate in emergency exercises
- Keep emergency contact information current`,
          quiz: [
            {
              q: "During emergencies, amateurs can:",
              options: ["Only contact other amateurs", "Contact anyone as needed", "Not operate at all", "Only contact emergency services"],
              correct: 1
            },
            {
              q: "What does AREN stand for?",
              options: ["Amateur Radio Emergency Network", "Amateur Radio Emergency Node", "Amateur Radio Emergency Notice", "Amateur Radio Emergency News"],
              correct: 0
            }
          ]
        }
      }
    },
    'exam-prep': {
      title: 'HAREC Exam Preparation',
      icon: Award,
      topics: {
        'exam-structure': {
          title: 'HAREC Examination Structure',
          content: `**HAREC Standard:**
- Based on ECC T/R 61-02
- Harmonised across Europe
- Covers electronics theory, regulations, safety

**Examination Topics:**
1. **Electronic Theory** (40% of questions)
2. **Regulatory Terms** (30% of questions)
3. **Operational Practices** (20% of questions)
4. **Safety** (10% of questions)

**Administered by IRTS:**
- Under agreement with ComReg
- Contact: https://www.irts.ie/cgi/st.cgi?applying
- Regular examination sessions
- Both theory and Morse code tests available

**Morse Code Test (for Class 1):**
- 5 words per minute minimum
- Send and receive requirement
- A1A emission designation
- Optional for Class 2 licence

**Recognition:**
- ComReg recognises equivalent foreign licences
- Must meet T/R 61-02 standard
- Novice/Intermediate licences NOT recognised
- Full licence equivalency required`,
          quiz: [
            {
              q: "What percentage of HAREC questions cover electronic theory?",
              options: ["30%", "40%", "50%", "60%"],
              correct: 1
            },
            {
              q: "Minimum Morse code speed for Class 1:",
              options: ["3 wpm", "5 wpm", "12 wpm", "20 wpm"],
              correct: 1
            }
          ]
        }
      }
    }
  };

  const quizQuestions = {
    'quick-test': [
      {
        q: "What is the ITU definition's key phrase for amateur radio?",
        options: ["Commercial communication", "Personal aim without pecuniary interest", "Government service", "Emergency only"],
        correct: 1
      },
      {
        q: "EI call-signs are used for:",
        options: ["All of Ireland", "Irish islands", "Mainland Ireland", "Northern Ireland"],
        correct: 2
      },
      {
        q: "Maximum power on 144-146 MHz:",
        options: ["100W", "400W (26 dBW)", "1000W", "50W"],
        correct: 1
      },
      {
        q: "Logbook times must be in:",
        options: ["Local time", "UTC", "GMT", "Any time zone"],
        correct: 1
      },
      {
        q: "Maritime mobile maximum power:",
        options: ["400W", "100W", "10 dBW", "50W"],
        correct: 2
      },
      {
        q: "Which band requires application for additional use?",
        options: ["144-146 MHz", "28-29.7 MHz", "1300-1304 MHz", "432-440 MHz"],
        correct: 2
      },
      {
        q: "The 5351.5-5366.5 kHz band has maximum:",
        options: ["15W e.i.r.p.", "400W P.E.P.", "158W P.E.P.", "50W P.E.P."],
        correct: 0
      }
    ]
  };

  const handleTopicComplete = (moduleKey, topicKey) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(`${moduleKey}-${topicKey}`);
    setCompletedTopics(newCompleted);
  };

  const startQuiz = (quizKey) => {
    setCurrentQuiz(quizKey);
    setQuizAnswers({});
    setShowResults(false);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const getQuizScore = (questions) => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    return { correct, total: questions.length };
  };

  const calculateOverallProgress = () => {
    const totalTopics = Object.values(learningModules).reduce((sum, module) => 
      sum + Object.keys(module.topics).length, 0
    );
    return Math.round((completedTopics.size / totalTopics) * 100);
  };

  const renderQuiz = (questions, title) => {
    const score = showResults ? getQuizScore(questions) : null;
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={() => setCurrentQuiz(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6">
            <p className="font-medium mb-3">{qIndex + 1}. {question.q}</p>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => {
                let className = "p-3 border rounded cursor-pointer transition-colors ";
                
                if (showResults) {
                  if (oIndex === question.correct) {
                    className += "bg-green-100 border-green-500 text-green-800";
                  } else if (quizAnswers[qIndex] === oIndex && oIndex !== question.correct) {
                    className += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    className += "bg-gray-50 border-gray-200";
                  }
                } else {
                  if (quizAnswers[qIndex] === oIndex) {
                    className += "bg-blue-100 border-blue-500";
                  } else {
                    className += "hover:bg-gray-50 border-gray-200";
                  }
                }

                return (
                  <div
                    key={oIndex}
                    className={className}
                    onClick={() => !showResults && handleQuizAnswer(qIndex, oIndex)}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          {showResults && score && (
            <div className="text-lg font-semibold">
              Score: {score.correct}/{score.total} ({Math.round((score.correct/score.total)*100)}%)
            </div>
          )}
          
          <div className="space-x-2">
            {!showResults ? (
              <button
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length !== questions.length}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => startQuiz(currentQuiz)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTopicContent = (moduleKey, topicKey, topic) => {
    const isCompleted = completedTopics.has(`${moduleKey}-${topicKey}`);
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{topic.title}</h3>
          <button
            onClick={() => handleTopicComplete(moduleKey, topicKey)}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
              isCompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
        
        <div className="prose max-w-none mb-6">
          {topic.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <h4 key={i} className="font-bold text-lg mt-4 mb-2">{paragraph.slice(2, -2)}</h4>;
            }
            if (paragraph.startsWith('- **')) {
              return (
                <ul key={i} className="list-disc ml-6 mb-4">
                  {paragraph.split('\n').map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{__html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="mb-4" dangerouslySetInnerHTML={{__html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
            );
          })}
          
          {/* Add interactive frequency tables for frequency-bands topic */}
          {topicKey === 'frequency-bands' && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Interactive Frequency Tables</h3>
              {renderFrequencyTable(frequencyBands.hf_primary, "HF Bands - Primary Allocation")}
              {renderFrequencyTable(frequencyBands.hf_secondary, "HF Bands - Secondary Allocation")}
              {renderFrequencyTable(frequencyBands.vhf_uhf, "VHF/UHF Bands")}
              {renderFrequencyTable(frequencyBands.microwave, "Microwave Bands (Selected)")}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-bold mb-2">Key Patterns to Notice:</h5>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Primary vs Secondary:</strong> Primary = full rights, Secondary = no interference protection</li>
                  <li>• <strong>Maritime Mobile:</strong> Only permitted on specified HF bands + 2m VHF</li>
                  <li>• <strong>Power Limits:</strong> Generally higher on lower frequencies, restrictions on some secondary bands</li>
                  <li>• <strong>Mobile Restrictions:</strong> Land mobile typically 17 dBW, Maritime mobile 10 dBW</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {topic.quiz && (
          <div className="border-t pt-4">
            <button
              onClick={() => startQuiz(`${moduleKey}-${topicKey}`)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Target className="w-4 h-4" />
              <span>Topic Quiz ({topic.quiz.length} questions)</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (currentQuiz) {
    if (currentQuiz === 'quick-test') {
      return renderQuiz(quizQuestions['quick-test'], 'Quick Assessment Test');
    }
    
    const [moduleKey, topicKey] = currentQuiz.split('-');
    const topic = learningModules[moduleKey]?.topics[topicKey];
    if (topic?.quiz) {
      return renderQuiz(topic.quiz, `${topic.title} Quiz`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Radio className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Irish Amateur Radio HAREC Learning System</h1>
                <p className="text-gray-600">Complete study guide for ComReg amateur radio licensing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-lg font-semibold">{calculateOverallProgress()}%</div>
              </div>
              <button
                onClick={() => startQuiz('quick-test')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                <span>Quick Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-4 sticky top-6">
              <h2 className="font-bold text-lg mb-4">Learning Modules</h2>
              
              {Object.entries(learningModules).map(([moduleKey, module]) => {
                const ModuleIcon = module.icon;
                const moduleCompleted = Object.keys(module.topics).every(topicKey => 
                  completedTopics.has(`${moduleKey}-${topicKey}`)
                );
                
                return (
                  <div key={moduleKey} className="mb-4">
                    <button
                      onClick={() => setActiveSection(moduleKey)}
                      className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                        activeSection === moduleKey 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ModuleIcon className="w-5 h-5" />
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {moduleCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                    
                    {activeSection === moduleKey && (
                      <div className="ml-8 mt-2 space-y-1">
                        {Object.entries(module.topics).map(([topicKey, topic]) => {
                          const isCompleted = completedTopics.has(`${moduleKey}-${topicKey}`);
                          return (
                            <button
                              key={topicKey}
                              onClick={() => setActiveSection(`${moduleKey}-${topicKey}`)}
                              className="w-full text-left flex items-center space-x-2 p-2 text-sm rounded hover:bg-gray-100"
                            >
                              {isCompleted ? 
                                <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                                <Circle className="w-4 h-4 text-gray-400" />
                              }
                              <span>{topic.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-2xl font-bold mb-4">Irish Amateur Radio Licensing Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg mb-2">Licence Types</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>CEPT Class 1:</strong> HAREC + Morse (5 wpm)</li>
                        <li><strong>CEPT Class 2:</strong> HAREC only</li>
                        <li><strong>Club Licence:</strong> For amateur radio clubs</li>
                        <li><strong>Visitor Temporary:</strong> Foreign amateurs</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Key Requirements</h3>
                      <ul className="space-y-1 text-sm">
                        <li>Pass HAREC examination</li>
                        <li>€100 licence fee (€30 reduced rate)</li>
                        <li>Lifetime licence duration</li>
                        <li>Maintain detailed logbook</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(learningModules).map(([moduleKey, module]) => {
                    const ModuleIcon = module.icon;
                    const topicCount = Object.keys(module.topics).length;
                    const completedCount = Object.keys(module.topics).filter(topicKey => 
                      completedTopics.has(`${moduleKey}-${topicKey}`)
                    ).length;
                    
                    return (
                      <div key={moduleKey} className="bg-white rounded-lg border p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <ModuleIcon className="w-6 h-6 text-blue-600" />
                          <h3 className="font-bold">{module.title}</h3>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {completedCount}/{topicCount} topics completed
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(completedCount/topicCount)*100}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => setActiveSection(moduleKey)}
                          className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Start Learning
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              (() => {
                // Handle topic-specific content
                if (activeSection.includes('-')) {
                  const [moduleKey, topicKey] = activeSection.split('-');
                  const module = learningModules[moduleKey];
                  const topic = module?.topics[topicKey];
                  
                  if (topic) {
                    return renderTopicContent(moduleKey, topicKey, topic);
                  }
                }
                
                // Handle module overview
                const module = learningModules[activeSection];
                if (module) {
                  return (
                    <div className="bg-white rounded-lg border p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <module.icon className="w-8 h-8 text-blue-600" />
                        <h2 className="text-2xl font-bold">{module.title}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(module.topics).map(([topicKey, topic]) => {
                          const isCompleted = completedTopics.has(`${activeSection}-${topicKey}`);
                          
                          return (
                            <div key={topicKey} className="border rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">{topic.title}</h3>
                                <div className="flex items-center space-x-2">
                                  {topic.quiz && (
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                      {topic.quiz.length} quiz questions
                                    </span>
                                  )}
                                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mb-3">
                                {topic.content.split('\n\n')[0].replace(/\*\*/g, '').substring(0, 150)}...
                              </p>
                              <button
                                onClick={() => setActiveSection(`${activeSection}-${topicKey}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                              >
                                Start Topic →
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                
                return <div>Content not found</div>;
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrishAmateurRadioApp;