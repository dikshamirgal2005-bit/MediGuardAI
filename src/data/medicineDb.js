export const MEDICINES = [
  {
    id: 'warfarin',
    name: 'Warfarin',
    generic: 'Warfarin Sodium',
    category: 'Blood Thinner',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'High danger of severe internal bleeding. Requires frequent blood monitoring (INR). Clearance decreases with age.',
    description: 'An anticoagulant (blood thinner) used to prevent and treat blood clots in veins, arteries, lungs, or heart.',
    sideEffects: ['Easy bruising', 'Severe bleeding', 'Bloody stools or urine', 'Dizziness', 'Headache'],
    alternatives: ['Apixaban (Eliquis) - lower bleeding risk in some elderly', 'Clopidogrel (Plavix)'],
    dosageWarning: 'Must be taken exactly as prescribed. Avoid sudden changes in diet (vitamin K rich foods like spinach).',
  },
  {
    id: 'aspirin',
    name: 'Aspirin',
    generic: 'Acetylsalicylic Acid',
    category: 'NSAID / Antiplatelet',
    isHighPower: false,
    beersCriteria: false,
    beersWarning: 'Use with caution. Regular use can cause stomach ulcers and gastrointestinal bleeding in older adults.',
    description: 'A common pain reliever and antiplatelet agent used to reduce pain, fever, inflammation, or to prevent heart attacks.',
    sideEffects: ['Stomach upset', 'Heartburn', 'Bruising', 'Ringing in ears'],
    alternatives: ['Acetaminophen (Tylenol) for mild pain', 'Non-pharmacological heating pads'],
    dosageWarning: 'Do not exceed 325mg daily for pain. Low dose (81mg) is common for heart health.',
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    generic: 'Ibuprofen',
    category: 'NSAID (Pain Reliever)',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'Avoid chronic use. Increases risk of GI bleeding, acute kidney injury, fluid retention, and worsening heart failure in seniors.',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used to reduce hormones that cause pain and inflammation in the body.',
    sideEffects: ['Stomach pain', 'Nausea', 'Increased blood pressure', 'Kidney strain'],
    alternatives: ['Acetaminophen (Tylenol) - safer for kidneys/stomach', 'Topical NSAID gel (Voltaren)'],
    dosageWarning: 'Maximum daily dose for seniors should be kept under 1200mg, and for short duration only.',
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    generic: 'Lisinopril',
    category: 'Blood Pressure (ACE Inhibitor)',
    isHighPower: true,
    beersCriteria: false,
    beersWarning: 'Monitor kidney function and potassium levels. Can cause dry cough or sudden dizziness upon standing (orthostatic hypotension).',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure, and to improve survival after a heart attack.',
    sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia (high potassium)', 'Fatigue'],
    alternatives: ['Losartan (ARB) if dry cough is intolerable'],
    dosageWarning: 'Stand up slowly from sitting or lying positions to prevent falls. Avoid excessive potassium intake.',
  },
  {
    id: 'alprazolam',
    name: 'Xanax',
    generic: 'Alprazolam',
    category: 'Sedative / Benzodiazepine',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'AVOID in older adults. Highly habit-forming, causes severe cognitive impairment, confusion, drowsiness, and increases risk of falls and fractures.',
    description: 'A benzodiazepine used to treat anxiety disorders, panic disorders, and anxiety caused by depression.',
    sideEffects: ['Severe drowsiness', 'Loss of balance', 'Confusion', 'Slurred speech', 'Memory issues'],
    alternatives: ['Buspirone', 'Cognitive Behavioral Therapy (CBT)', 'SSRIs (long-term anxiety control)'],
    dosageWarning: 'Extremely dangerous when combined with alcohol, opioids, or sleep aids. Never stop taking suddenly.',
  },
  {
    id: 'diphenhydramine',
    name: 'Benadryl',
    generic: 'Diphenhydramine',
    category: 'Antihistamine / Sleep Aid',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'AVOID in older adults. Highly anticholinergic. Causes severe dry mouth, constipation, urinary retention, blurred vision, and delirium/falls.',
    description: 'An antihistamine used to relieve allergy symptoms, or commonly sold over-the-counter as a night-time sleep aid.',
    sideEffects: ['Drowsiness', 'Confusion', 'Dry mouth', 'Constipation', 'Urinary retention'],
    alternatives: ['Cetirizine (Zyrtec) or Loratadine (Claritin) for allergies', 'Melatonin for sleep (short term)'],
    dosageWarning: 'Avoid purchasing over-the-counter sleep products containing diphenhydramine (often labeled PM).',
  },
  {
    id: 'digoxin',
    name: 'Digoxin',
    generic: 'Digoxin',
    category: 'Heart Failure Medication',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'AVOID as first-line therapy. Clearances decrease with kidney decline in older adults, leading to high toxicity risk (nausea, confusion, visual halos).',
    description: 'Used to treat heart failure and abnormal heart rhythms (atrial fibrillation). Helps the heart beat stronger and more regularly.',
    sideEffects: ['Nausea', 'Vomiting', 'Loss of appetite', 'Confusion', 'Yellow-green visual halos'],
    alternatives: ['Beta-blockers (e.g., Metoprolol)', 'Calcium channel blockers'],
    dosageWarning: 'Keep dose at lowest possible (usually under 0.125mg daily). Inform doctor immediately of any loss of appetite or nausea.',
  },
  {
    id: 'tramadol',
    name: 'Tramadol',
    generic: 'Tramadol Hydrochloride',
    category: 'Opioid Pain Reliever',
    isHighPower: true,
    beersCriteria: true,
    beersWarning: 'Use with caution. Can cause syndrome of inappropriate antidiuretic hormone (SIADH)/hyponatremia. Lowers seizure threshold and causes sedation.',
    description: 'A powerful narcotic-like pain reliever used to treat moderate to moderately severe chronic pain.',
    sideEffects: ['Constipation', 'Nausea', 'Dizziness', 'Drowsiness', 'Risk of addiction'],
    alternatives: ['Acetaminophen', 'Physical therapy', 'Topical creams'],
    dosageWarning: 'Do not mix with other sedatives, alcohol, or anti-anxiety medications. Highly constipating; take with stool softeners.',
  }
];

export const INTERACTIONS = [
  {
    drugA: 'warfarin',
    drugB: 'aspirin',
    severity: 'SEVERE',
    mechanism: 'Double Antiplatelet/Anticoagulant effect',
    description: 'Combining Warfarin and Aspirin increases your risk of severe internal, stomach, or brain bleeding. Do not use together unless specifically prescribed by a cardiologist under close supervision.',
  },
  {
    drugA: 'warfarin',
    drugB: 'ibuprofen',
    severity: 'SEVERE',
    mechanism: 'NSAID-induced mucosal damage & anticoagulation synergy',
    description: 'Ibuprofen damages the stomach lining and thins the blood, which doubles the risk of life-threatening gastrointestinal bleeding when combined with Warfarin.',
  },
  {
    drugA: 'aspirin',
    drugB: 'ibuprofen',
    severity: 'MODERATE',
    mechanism: 'NSAID competitive inhibition',
    description: 'Ibuprofen can block the cardioprotective effects of low-dose Aspirin. In addition, taking both increases the risk of stomach ulcers and bleeding.',
  },
  {
    drugA: 'lisinopril',
    drugB: 'ibuprofen',
    severity: 'SEVERE',
    mechanism: 'Antagonism of vasodilator prostaglandins & renal constriction',
    description: 'Combining Lisinopril (ACE inhibitor) and Ibuprofen (NSAID) can cause acute kidney failure (triple whammy effect) and raises blood pressure, neutralizing Lisinopril\'s benefits.',
  },
  {
    drugA: 'alprazolam',
    drugB: 'tramadol',
    severity: 'SEVERE',
    mechanism: 'Additive CNS & respiratory depression',
    description: 'Taking Alprazolam (Xanax) and Tramadol together increases the risk of profound sedation, respiratory depression, coma, and death. Extremely dangerous for elderly patients.',
  },
  {
    drugA: 'alprazolam',
    drugB: 'diphenhydramine',
    severity: 'SEVERE',
    mechanism: 'Additive CNS depression & anticholinergic toxicity',
    description: 'Both medications are central nervous system depressants. Combining them causes severe disorientation, memory blackouts, loss of motor control, and falls.',
  },
  {
    drugA: 'digoxin',
    drugB: 'diphenhydramine',
    severity: 'MODERATE',
    mechanism: 'Arrhythmogenic risk & anticholinergic side effects',
    description: 'Diphenhydramine can increase heart rate, potentially destabilizing patients taking Digoxin for arrhythmias or heart failure. Can also worsen Digoxin-induced confusion.',
  }
];

// Helper to look up a drug by text search (for scanner simulation)
export const findMedicineByText = (text) => {
  if (!text) return null;
  const cleanText = text.toLowerCase().trim();
  
  // Find a drug whose name or generic name appears in the text
  return MEDICINES.find(med => 
    cleanText.includes(med.name.toLowerCase()) || 
    cleanText.includes(med.generic.toLowerCase()) ||
    med.name.toLowerCase().includes(cleanText) ||
    med.generic.toLowerCase().includes(cleanText)
  ) || null;
};

// Helper to check interactions between a new drug and a list of existing drugs
export const checkInteractions = (newDrugId, activeDrugIds) => {
  const alerts = [];
  
  activeDrugIds.forEach(activeId => {
    if (activeId === newDrugId) return;
    
    const match = INTERACTIONS.find(inter => 
      (inter.drugA === newDrugId && inter.drugB === activeId) ||
      (inter.drugA === activeId && inter.drugB === newDrugId)
    );
    
    if (match) {
      alerts.push({
        withDrug: MEDICINES.find(m => m.id === activeId),
        ...match
      });
    }
  });
  
  return alerts;
};
