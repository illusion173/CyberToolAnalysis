//! Rust types related to the tools database and requests for this endpoint.

use debug_ignore::DebugIgnore;
use serde::{Deserialize, Serialize};
use std::time::Duration;

fn display_seconds<S>(t: &Duration, s: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    s.serialize_str(&format!("{t:?}"))
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RecommendToolsResponse {
    pub status: Result<String, String>,
    #[serde(serialize_with = "display_seconds")]
    pub time_taken: Duration,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ReportLocation {
    /// The name of the final report once stored in s3
    pub user_id: String,
    /// The user making the request
    pub report_id: String,
    /// The user's selection from the form
    pub date_made: String,
    /// The file name the user entered
    pub file_name: String,
}

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
#[derive(Deserialize, Debug, Serialize)]
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
    pub budget_constraints: u32,
}

#[derive(Clone, Deserialize, Debug, Serialize)]
pub struct ToolRow {
    #[serde(rename = "Tool_Function")]
    pub industry: Industry,
    #[serde(rename = "Tool_Name")]
    pub name: String,
    #[serde(rename = "Tool_ID")]
    pub id: String,

    // Optional fields:
    #[serde(rename = "AI/ML_Use")]
    pub ai_ml_use: Option<bool>,
    #[serde(rename = "Approved")]
    pub approved: Option<bool>,
    #[serde(rename = "Aviation_Specific")]
    pub aviation_apecific: Option<bool>,
    #[serde(rename = "Cloud_Capable")]
    pub cloud_capable: Option<bool>,
    #[serde(rename = "Company")]
    pub company: Option<String>,
    #[serde(rename = "Customers")]
    pub customers: Option<Vec<String>>,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "Keywords")]
    pub keywords: Option<Vec<String>>,
    #[serde(rename = "Maturity_Level")]
    pub maturity_level: Option<u32>,
    #[serde(rename = "Tool_URL")]
    pub url: Option<String>,
    #[serde(rename = "ToolBox")]
    pub tool_box: Option<bool>,

    // Modified automatically by this function
    #[serde(rename = "Cached_Sentence_Embedding")]
    pub cached_sentence_embedding: DebugIgnore<Option<Vec<f32>>>,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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
    #[serde(rename = "Virtual_Private_Network")]
    VirtualPrivateNetwork,
    #[serde(rename = "Cybersecurity_Service_Provider")]
    CybersecurityServiceProvider,
    #[serde(rename = "Endpoint_Security")]
    EndpointSecurity,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
pub enum RegulatoryAgencies {
    #[serde(rename = "FAA")]
    Faa,
    #[serde(rename = "NIST")]
    Nist,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
pub enum Threats {
    #[serde(rename = "Insider threats")]
    Insider,
    #[serde(rename = "Cyber espionage")]
    CyberEspionage,
    #[serde(rename = "Malware attacks")]
    MalwareAttacks,
    #[serde(rename = "Supply chain vulnerabilities")]
    SupplyChainVulnerabilities,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
pub enum BasicYesno {
    Yes,
    No,
    #[serde(rename = "Not sure")]
    NotSure,
    #[serde(rename = "Prefer not to answer")]
    PreferNotToAnswer,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
pub enum LegacySystems {
    Yes,
    No,
    #[serde(rename = "In the process of upgrading")]
    Upgrading,
    #[serde(rename = "Not applicable")]
    NotApplicable,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
pub enum CybersecurityTrainingInterval {
    Annually,
    #[serde(rename = "Semi-annually")]
    SemiAnnually,
    Quarterly,
    #[serde(rename = "Rarely or never")]
    Rarely,
}

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

#[derive(Copy, Clone, Deserialize, Debug, Serialize)]
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

impl Default for RecommendationRequest {
    fn default() -> Self {
        Self {
            file_name: "test.pdf".into(),
            user_identifier: "illusion173@hotmail.com".into(),
            responses: QuestionnaireData {
                free_response: "I run a satellite company, and want a tool to verify my communication solutions are secure".into(),
                industry: Industry::AviationFocusedTools,
                regulatory_needs: vec![RegulatoryAgencies::Faa, RegulatoryAgencies::Nist],
                threats: Threats::Insider,
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
                budget_constraints: 5000,
            },
        }
    }
}

// Used to generate mock json request for testing with aws Api Gateway
//#[test]
fn print_rec_request() {
    let a = RecommendationRequest::default();
    println!("{}", serde_json::to_string_pretty(&a).unwrap());
    panic!("Json printed above");
}

#[test]
fn prod_bug() {
    let s = r#"
{"file_name":"anothertest.pdf","user_identifier":"illusion173@hotmail.com","responses":{"industry":"Industrial_Control_Systems","regulatory_needs":["NIST","FAA"],"threats":"Insider threats","aware_of_cyber_incidents":"Yes","legacy_systems":"Yes","communications":"Wired networks (e.g., Ethernet)","remote_systems_needing_security":"Yes, drones","cloud_reliance":"Heavily reliant on cloud services","dedicated_it_status":"Yes, dedicated cybersecurity team","specific_cyber_security_measures":"Encryption","cybersecurity_training_interval":"Annually","formal_incident_plan":"Yes, a well-defined plan","threat_intelligence_services":"Yes, currently using threat intelligence","securing_emerging_tech":"IoT devices with security measures","free_response":"I need a good tiool!","budget_constraints":9999}}
"#;
    let a: RecommendationRequest = serde_json::from_str(s).unwrap();
}
