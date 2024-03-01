export const tool_function_categories = [
  "",
  "Aircraft Log & Anomaly Detection Tools",
  "Firewall and Network Security",
  "Endpoint Security",
  "Secure Communication and Data Encryption",
  "Access Control and Identity Management",
  "Security Information and Event Management (SIEM) Systems",
  "Vulnerability Management",
  "Threat Intelligence Platforms",
  "Supply Chain Risk Management Solution",
  "Regulatory Compliance Tools",
  "Aviation Focused Tools",
  "General Tools",
  "Industrial Control Systems Cyber Tools",
];

export const tool_function_categories_cleaner_dict = {
  "Industrial Control Systems": "Industrial_Control_Systems",
  "Cybersecurity Service Provider": "Cybersecurity_Service_Provider",
  "Virtual Private Network": "Virtual_Private_Network",
  "Aircraft Log & Anomaly Detection Tools": "Log_Analysis",
  "Firewall and Network Security": "Firewall_Network_Security",
  "Secure Communication and Data Encryption":
    "Secure_Communication_Data_Encryption",
  "Access Control and Identity Management":
    "Access_Control_Identity_Management",
  "Security Information and Event Management (SIEM) Systems":
    "Security_Information_Event_Management_Systems",
  "Vulnerability Management": "Vulnerability_Management",
  "Threat Intelligence Platforms": "Threat_Intelligence_Platforms",
  "Supply Chain Risk Management Solution":
    "Supply_Chain_Risk_Management_Solution",
  "Regulatory Compliance Tools": "Regulatory_Compliance_Tools",
  "Aviation Focused Tools": "Aviation_Focused_Tools",
  "General Tools": "General_Tools",
  "Endpoint Security": "Endpoint_Security",
};

export const question_list_converter_dict = {
  question_1: "industry",
  question_2: "regulatory_needs",
  question_3: "threats",
  question_4: "aware_of_cyber_incidents",
  question_5: "legacy_systems",
  question_6: "communications",
  question_7: "remote_systems_needing_security",
  question_8: "cloud_reliance",
  question_9: "dedicated_it_status",
  question_10: "specific_cyber_security_measures",
  question_11: "cybersecurity_training_interval",
  question_12: "formal_incident_plan",
  question_13: "threat_intelligence_services",
  question_14: "securing_emerging_tech",
  question_15: "budget_constraints",
};

export const question_list = [
  {
    question_1: {
      Question:
        "What specific aerospace-related projects or systems are you involved in, and what kind of data or assets do they handle?",
      "Answer choices": tool_function_categories,
    },
  },
  {
    question_2: {
      Question:
        "Are there any regulatory compliance requirements (e.g., FAA, NIST, or other standards) that your organization must adhere to regarding cybersecurity?",
      "Answer choices": [
        {
          A: "FAA",
        },
        {
          B: "NIST",
        },
      ],
    },
  },
  {
    question_3: {
      Question:
        "What are the primary threats or vulnerabilities you anticipate facing in the aerospace industry?",
      "Answer choices": [
        {
          A: "Insider threats",
        },
        {
          B: "Cyber espionage",
        },
        {
          C: "Malware attacks",
        },
        {
          D: "Supply chain vulnerabilities",
        },
      ],
    },
  },
  {
    question_4: {
      Question:
        "Are you aware of any recent cybersecurity incidents or breaches within the aerospace industry that have raised concerns?",
      "Answer choices": [
        {
          A: "Yes",
        },
        {
          B: "No",
        },
        {
          C: "Not sure",
        },
        {
          D: "Prefer not to answer",
        },
      ],
    },
  },
  {
    question_5: {
      Question:
        "Do you use any legacy systems or equipment that might be more susceptible to cyberattacks?",
      "Answer choices": [
        {
          A: "Yes",
        },
        {
          B: "No",
        },
        {
          C: "In the process of upgrading",
        },
        {
          D: "Not applicable",
        },
      ],
    },
  },
  {
    question_6: {
      Question:
        "What kind of network infrastructure and communication protocols are in place in your aerospace organization?",
      "Answer choices": [
        {
          A: "Wired networks (e.g., Ethernet)",
        },
        {
          B: "Wireless networks (e.g., Wi-Fi)",
        },
        {
          C: "Both wired and wireless",
        },
        {
          D: "Satellite communication",
        },
      ],
    },
  },
  {
    question_7: {
      Question:
        "Are there remote or unmanned systems that require special cybersecurity measures, like drones or satellites?",
      "Answer choices": [
        {
          A: "Yes, drones",
        },
        {
          B: "Yes, satellites",
        },
        {
          C: "No remote systems",
        },
        {
          D: "Not applicable",
        },
      ],
    },
  },
  {
    question_8: {
      Question:
        "What is the extent of your reliance on cloud-based services or platforms for aerospace operations?",
      "Answer choices": [
        {
          A: "Heavily reliant on cloud services",
        },
        {
          B: "Partially reliant on cloud services",
        },
        {
          C: "Minimal reliance on cloud services",
        },
        {
          D: "Not using cloud services",
        },
      ],
    },
  },
  {
    question_9: {
      Question:
        "Do you have a dedicated IT security team or department responsible for cybersecurity in your aerospace organization?",
      "Answer choices": [
        {
          A: "Yes, dedicated cybersecurity team",
        },
        {
          B: "IT department handles cybersecurity",
        },
        {
          C: "No dedicated team",
        },
        {
          D: "Not applicable",
        },
      ],
    },
  },
  {
    question_10: {
      Question:
        "Are you currently implementing any specific cybersecurity measures, such as encryption, access controls, or intrusion detection systems?",
      "Answer choices": [
        {
          A: "Encryption",
        },
        {
          B: "Access controls",
        },
        {
          C: "Intrusion detection systems",
        },
        {
          D: "None of the above",
        },
      ],
    },
  },
  {
    question_11: {
      Question:
        "How often do you conduct cybersecurity training or awareness programs for your aerospace employees?",
      "Answer choices": [
        {
          A: "Annually",
        },
        {
          B: "Semi-annually",
        },
        {
          C: "Quarterly",
        },
        {
          D: "Rarely or never",
        },
      ],
    },
  },
  {
    question_12: {
      Question:
        "Do you have a formal incident response plan in case of a cybersecurity breach or incident?",
      "Answer choices": [
        {
          A: "Yes, a well-defined plan",
        },
        {
          B: "Yes, a basic plan",
        },
        {
          C: "No formal plan",
        },
        {
          D: "Not sure",
        },
      ],
    },
  },
  {
    question_13: {
      Question:
        "Have you considered the use of threat intelligence services to stay updated on aerospace-specific threats?",
      "Answer choices": [
        {
          A: "Yes, currently using threat intelligence",
        },
        {
          B: "Considering implementing threat intelligence",
        },
        {
          C: "No, not considering threat intelligence",
        },
        {
          D: "Not sure what threat intelligence is",
        },
      ],
    },
  },
  {
    question_14: {
      Question:
        "Are there any emerging technologies (e.g., IoT devices, AI, or blockchain) that you plan to integrate into your aerospace systems, and how will you secure them?",
      "Answer choices": [
        {
          A: "IoT devices with security measures",
        },
        {
          B: "AI with enhanced security protocols",
        },
        {
          C: "Blockchain technology for enhanced security",
        },
        {
          D: "Not planning to integrate emerging technologies",
        },
      ],
    },
  },
  {
    question_15: {
      Question:
        "What budget constraints or limitations do you have when it comes to investing in cybersecurity technologies for the aerospace industry?",
      "Answer choices": [
        {
          A: "Limited budget for cybersecurity",
        },
        {
          B: "Moderate budget for cybersecurity",
        },
        {
          C: "Sufficient budget for cybersecurity",
        },
        {
          D: "No budget",
        },
      ],
    },
  },
];
