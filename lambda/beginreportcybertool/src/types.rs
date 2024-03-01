use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct RecommendationRequest {
    /// The name of the final report once stored in s3
    pub file_name: String,
    /// The user making the request
    pub user_identifier: String,
    /// The user's selection from the form
    pub responses: QuestionnaireData,
}

/// Parsed form from the user concerning their needs
#[derive(Serialize, Deserialize, Debug)]
pub struct QuestionnaireData {
    pub free_response: String,
    pub industry: Industry,
    pub regulatory_needs: Vec<RegulatoryAgencies>,
    pub threats: Threats,
    pub aware_of_cyber_incidents: BasicYesno,
    pub legacy_systems: LegacySystems,
    pub communications: Comms,
    pub remote_systems_needing_security: RemoteSystemsNeedingSecurity,
    pub cloud_reliance: CloudReliance,
    pub dedicated_it_status: DedicatedItStatus,
    pub specific_cyber_security_measures: SpecificCyberSecurityMeasures,
    pub cybersecurity_training_interval: CybersecurityTrainingInterval,
    pub formal_incident_plan: FormalIncidentPlan,
    pub threat_intelligence_services: ThreatIntelligenceServices,
    pub securing_emerging_tech: SecuringEmergingTech,
    pub budget_constraints: BudgetConstraints,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Industry {
    #[serde(rename = "Log_Analysis")]
    LogAnalysis,
    #[serde(rename = "Industrial_Control_Systems")]
    IndustrialControlSystems,
    #[serde(rename = "Firewall_Network_Security")]
    FirewallNetworkSecurity,
    #[serde(rename = "Secure_Communication_Data_Encryption")]
    SecureCommunicationDataEncryption,
    #[serde(rename = "Access_Control_Identity_Management")]
    AccessControlIdentityManagement,
    #[serde(rename = "Security_Information_Event_Management_Systems")]
    SecurityInformationEventManagementSystems,
    #[serde(rename = "Vulnerability_Management")]
    VulnerabilityManagement,
    #[serde(rename = "Threat_Intelligence_Platforms")]
    ThreatIntelligencePlatforms,
    #[serde(rename = "Supply_Chain_Risk_Management_Solution")]
    SupplyChainRiskManagementSolution,
    #[serde(rename = "Regulatory_Compliance_Tools")]
    RegulatoryComplianceTools,
    #[serde(rename = "Aviation_Focused_Tools")]
    AviationFocusedTools,
    #[serde(rename = "General_Tools")]
    GeneralTools,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum RegulatoryAgencies {
    #[serde(rename = "FAA")]
    Faa,
    #[serde(rename = "NIST")]
    Nist,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Threats {
    #[serde(rename = "Insider threats")]
    InsiderThreats,
    #[serde(rename = "Cyber espionage")]
    CyberEspionage,
    #[serde(rename = "Malware attacks")]
    MalwareAttacks,
    #[serde(rename = "Supply chain vulnerabilities")]
    SupplyChainVulnerabilities,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum BasicYesno {
    Yes,
    No,
    #[serde(rename = "Not sure")]
    NotSure,
    #[serde(rename = "Prefer not to answer")]
    PreferNotToAnswer,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum LegacySystems {
    Yes,
    No,
    #[serde(rename = "In the process of upgrading")]
    Upgrading,
    #[serde(rename = "Not applicable")]
    NotApplicable,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Comms {
    #[serde(rename = "Wired networks (e.g., Ethernet)")]
    Wired,
    #[serde(rename = "Wireless networks (e.g., Wi-Fi)")]
    Wireless,
    #[serde(rename = "Both wired and wireless")]
    WiredAndWireless,
    #[serde(rename = "Satellite communication")]
    Satellite,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum RemoteSystemsNeedingSecurity {
    #[serde(rename = "Yes, drones")]
    Drones,
    #[serde(rename = "Yes, satellites")]
    Satellites,
    #[serde(rename = "No remote systems")]
    None,
    #[serde(rename = "Not applicable")]
    NotApplicable,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum CloudReliance {
    #[serde(rename = "Heavily reliant on cloud services")]
    Heavily,
    #[serde(rename = "Partially reliant on cloud services")]
    Partially,
    #[serde(rename = "Minimal reliance on cloud services")]
    Minimal,
    #[serde(rename = "Not using cloud services")]
    None,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum DedicatedItStatus {
    #[serde(rename = "Yes, dedicated cybersecurity team")]
    DedicatedCyberSecurityTeam,
    #[serde(rename = "IT department handles cybersecurity")]
    ItHandlesCyber,
    #[serde(rename = "No dedicated team")]
    NoDedicatedTeam,
    #[serde(rename = "Not applicable")]
    NotApplicable,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum SpecificCyberSecurityMeasures {
    #[serde(rename = "Encryption")]
    Encryption,
    #[serde(rename = "Access controls")]
    AccessControl,
    #[serde(rename = "Intrusion detection systems")]
    IntrusionDetectionSystems,
    #[serde(rename = "None of the above")]
    None,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum CybersecurityTrainingInterval {
    Annually,
    #[serde(rename = "Semi-annually")]
    SemiAnnually,
    Quarterly,
    #[serde(rename = "Rarely or never")]
    Rarely,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum FormalIncidentPlan {
    #[serde(rename = "Yes, a well-defined plan")]
    WellDefined,
    #[serde(rename = "Yes, a basic plan")]
    Basic,
    #[serde(rename = "No formal plan")]
    None,
    #[serde(rename = "Not sure")]
    NotSure,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ThreatIntelligenceServices {
    #[serde(rename = "Yes, currently using threat intelligence")]
    Using,
    #[serde(rename = "Considering implementing threat intelligence")]
    Considering,
    #[serde(rename = "No, not considering threat intelligence")]
    No,
    #[serde(rename = "Not sure what threat intelligence is")]
    NotSure,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum SecuringEmergingTech {
    #[serde(rename = "IoT devices with security measures")]
    Iot,
    #[serde(rename = "AI with enhanced security protocols")]
    Ai,
    #[serde(rename = "Blockchain technology for enhanced security")]
    Blockchain,
    #[serde(rename = "Not planning to integrate emerging technologies")]
    None,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum BudgetConstraints {
    #[serde(rename = "Limited budget for cybersecurity")]
    Sufficent,
    #[serde(rename = "Moderate budget for cybersecurity")]
    Moderate,
    #[serde(rename = "Limited budget for cybersecurity")]
    Limited,
    #[serde(rename = "No budget")]
    None,
}

impl Default for RecommendationRequest {
    fn default() -> Self {
        Self {
            file_name: "test.pdf".into(),
            user_identifier: "illusion173@hotmail.com".into(),
            responses: QuestionnaireData {
                free_response: "I run a satellite company, and want a tool to verify my communication solutions are secure".into(),
                industry: Industry::LogAnalysis,
                regulatory_needs: vec![RegulatoryAgencies::Faa, RegulatoryAgencies::Nist],
                threats: Threats::InsiderThreats,
                aware_of_cyber_incidents: BasicYesno::NotSure,
                legacy_systems: LegacySystems::Upgrading,
                communications: Comms::Satellite,
                remote_systems_needing_security: RemoteSystemsNeedingSecurity::Satellites,
                cloud_reliance: CloudReliance::Heavily,
                dedicated_it_status: DedicatedItStatus::ItHandlesCyber,
                specific_cyber_security_measures: SpecificCyberSecurityMeasures::Encryption,
                cybersecurity_training_interval: CybersecurityTrainingInterval::Annually,
                formal_incident_plan: FormalIncidentPlan::WellDefined,
                threat_intelligence_services: ThreatIntelligenceServices::Considering,
                securing_emerging_tech: SecuringEmergingTech::Ai,
                budget_constraints: BudgetConstraints::Sufficent,
            },
        }
    }
}
