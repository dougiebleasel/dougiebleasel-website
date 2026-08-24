/*
 * ============================================================
 * TIWILI MASTER LIBRARY
 * Risk Management
 * ============================================================
 *
 * Master ID: TIW-RISK-001
 * Version: 1.0
 *
 * This file defines the CONTROLLED architecture for the
 * Tiwili Risk Management module.
 *
 * It is not a customer procedure.
 *
 * Customer procedures are generated from:
 *
 * Tiwili Master
 * + Business Discovery
 * + System Configuration
 * + Implementation Profile
 * + Existing Customer Material
 *
 * ============================================================
 */


const riskManagementMaster = {


  metadata: {

    id:
      "TIW-RISK-001",

    name:
      "Risk Management",

    version:
      "1.0",

    status:
      "active",

    category:
      "core-management-system",

    description:
      "Controlled Tiwili architecture for identifying, assessing, treating, accepting, escalating, monitoring and reviewing organisational and operational risk."

  },


  /*
   * ==========================================================
   * MASTER DESIGN PRINCIPLES
   * ==========================================================
   */

  principles: [

    "Risk management must support informed decision-making and the achievement of organisational objectives.",

    "Risks must be identified before they can be accepted or controlled.",

    "Risk assessments must consider the nature of the activity, foreseeable hazards, potential consequences and existing controls.",

    "Risk controls must be proportionate to the nature and level of risk.",

    "Where applicable, risk treatment should follow the hierarchy of controls.",

    "Residual risk must be reviewed after existing controls are considered.",

    "Additional treatment must be identified where residual risk is not acceptable.",

    "Higher or unacceptable risks must be escalated to an appropriate level of authority.",

    "Risk acceptance must never override applicable legal, regulatory or contractual requirements.",

    "Work must not commence or continue where serious or uncontrolled risk remains.",

    "Risk controls must be monitored and periodically reviewed for continued effectiveness.",

    "Workers must be able to raise risk concerns and stop unsafe work without adverse consequence when acting in good faith."

  ],


  /*
   * ==========================================================
   * REQUIRED RISK LIFECYCLE
   * LOCKED
   * ==========================================================
   */

  lifecycle: [

    {
      step: 1,
      id: "identify",
      name: "Identify",
      requirement:
        "Identify foreseeable hazards, threats, uncertainties and risk events relevant to the activity, project, site, service or organisational objective."
    },

    {
      step: 2,
      id: "analyse",
      name: "Analyse",
      requirement:
        "Determine potential causes, consequences, likelihood and the effectiveness of existing controls."
    },

    {
      step: 3,
      id: "evaluate",
      name: "Evaluate",
      requirement:
        "Determine the level and significance of risk using the approved risk assessment methodology."
    },

    {
      step: 4,
      id: "treat",
      name: "Treat",
      requirement:
        "Identify and implement additional controls or treatment where the current level of risk is not acceptable."
    },

    {
      step: 5,
      id: "accept",
      name: "Approve / Accept",
      requirement:
        "Obtain the required approval or formally accept residual risk within delegated authority."
    },

    {
      step: 6,
      id: "monitor",
      name: "Monitor",
      requirement:
        "Monitor implementation and effectiveness of controls and agreed treatment actions."
    },

    {
      step: 7,
      id: "review",
      name: "Review",
      requirement:
        "Review risk when conditions, assumptions, activities or organisational circumstances change and at defined periodic intervals."
    }

  ],


  /*
   * ==========================================================
   * LOCKED REQUIREMENTS
   *
   * These must not be removed or weakened by:
   * - Lean voice
   * - Light governance
   * - Customer preference
   * - AI generation
   * ==========================================================
   */

  lockedRequirements: {


    riskAssessment: [

      "Risks must be identified and assessed using an approved methodology.",

      "Risk assessment must consider likelihood and consequence or equivalent risk dimensions.",

      "Existing controls must be considered when determining residual risk.",

      "Additional controls must be considered where residual risk remains above the organisation's acceptable level.",

      "Risk assessments must be completed by persons with appropriate knowledge of the activity and risk."

    ],


    hierarchyOfControls: {

      requiredWhereRelevant:
        true,

      order: [

        {
          order: 1,
          control: "Elimination",
          description:
            "Remove the hazard or source of risk entirely."
        },

        {
          order: 2,
          control: "Substitution",
          description:
            "Replace the hazard, process, material or activity with a safer alternative."
        },

        {
          order: 3,
          control: "Isolation",
          description:
            "Separate people, assets or the environment from the hazard."
        },

        {
          order: 4,
          control: "Engineering",
          description:
            "Use physical or engineered measures to prevent or reduce exposure."
        },

        {
          order: 5,
          control: "Administrative",
          description:
            "Use procedures, training, supervision, planning, scheduling, signage or other administrative measures."
        },

        {
          order: 6,
          control: "Personal Protective Equipment",
          description:
            "Use protective equipment to reduce exposure where other controls do not fully eliminate the risk."
        }

      ]

    },


    riskAcceptance: [

      "Risk acceptance must be a deliberate decision following assessment.",

      "A risk must not be accepted simply because additional treatment is inconvenient or costly.",

      "Risk acceptance must not override applicable legal, regulatory or contractual obligations.",

      "Risk must not be accepted where required controls have not been implemented.",

      "Risk must not be accepted where controls are known to be ineffective.",

      "Risk must not be accepted where there remains a credible uncontrolled risk of serious injury, fatality, significant environmental harm or other intolerable consequence.",

      "Risk acceptance must occur within an appropriate level of delegated authority."

    ],


    stopWork: [

      "Work must not commence where a required risk assessment has not been completed.",

      "Work must not commence or continue where required controls are absent or ineffective.",

      "Work must stop where conditions change and create an unacceptable level of risk.",

      "Workers and contractors must have authority to stop work where they reasonably believe an unacceptable risk exists.",

      "Work may only recommence after the risk has been reassessed, appropriate controls have been implemented and appropriate approval has been provided.",

      "A person acting in good faith to stop unsafe work must not be penalised for doing so."

    ],


    monitoring: [

      "Risk ratings must remain subject to review.",

      "Control effectiveness must be periodically reviewed.",

      "Risk must be reconsidered following incidents, near misses, significant change or evidence that controls may not be effective.",

      "Risk treatment actions must have an owner and be monitored to completion."

    ]

  },


  /*
   * ==========================================================
   * TAILORABLE SECTIONS
   *
   * AI may tailor these using the customer's confirmed profile.
   * ==========================================================
   */

  tailorable: {

    introduction:
      true,

    purpose:
      true,

    scope:
      true,

    definitions:
      true,

    roleNames:
      true,

    responsibilityWording:
      true,

    riskCategories:
      true,

    examples:
      true,

    reviewFrequency:
      true,

    reportingFrequency:
      true,

    approvalRoleNames:
      true,

    escalationRoleNames:
      true,

    terminology:
      true,

    systemReferences:
      true,

    toolNames:
      true

  },


  /*
   * ==========================================================
   * REQUIRED PROCEDURE STRUCTURE
   * ==========================================================
   */

  procedureStructure: [

    {
      section: 1,
      id: "introduction",
      title: "Introduction",
      required: true
    },

    {
      section: 2,
      id: "scope",
      title: "Scope",
      required: true
    },

    {
      section: 3,
      id: "definitions",
      title: "Definitions",
      required: true
    },

    {
      section: 4,
      id: "roles",
      title: "Roles and Responsibilities",
      required: true
    },

    {
      section: 5,
      id: "competency",
      title: "Competency Requirements",
      required: true
    },

    {
      section: 6,
      id: "riskFramework",
      title: "Risk Management Framework",
      required: true
    },

    {
      section: 7,
      id: "identification",
      title: "Risk Identification",
      required: true
    },

    {
      section: 8,
      id: "evaluation",
      title: "Risk Evaluation",
      required: true
    },

    {
      section: 9,
      id: "treatment",
      title: "Risk Treatment and Controls",
      required: true
    },

    {
      section: 10,
      id: "review",
      title: "Risk Review",
      required: true
    },

    {
      section: 11,
      id: "escalation",
      title: "Risk Escalation",
      required: true
    },

    {
      section: 12,
      id: "acceptance",
      title: "Risk Acceptance",
      required: true
    },

    {
      section: 13,
      id: "stopWork",
      title: "Risk Tolerance and Stop Work",
      required: true,
      conditional:
        "operational-work"
    },

    {
      section: 14,
      id: "reporting",
      title: "Risk Reporting",
      required: true
    },

    {
      section: 15,
      id: "audit",
      title: "Audit and Assurance",
      required: true
    },

    {
      section: 16,
      id: "documentReview",
      title: "Document Review",
      required: true
    },

    {
      section: 17,
      id: "records",
      title: "Records",
      required: true
    }

  ],


  /*
   * ==========================================================
   * RISK TIER MODEL
   *
   * Based on the Tiwili three-tier architecture.
   * Inclusion is conditional on the customer's operating model.
   * ==========================================================
   */

  tierFramework: {


    enabledByDefault:
      true,


    tiers: [


      {
        tier: 1,

        name:
          "Overarching Risk",

        purpose:
          "Identify and manage higher-level risks associated with an organisation, service, operation, activity or major business area.",

        typicalUse: [

          "Organisation-wide operational risk",

          "Business service risk",

          "High-level HSEQ risk",

          "Major activity risk",

          "Portfolio or program risk"

        ],

        output:
          "Risk Register",

        reviewTriggers: [

          "Periodic review",

          "Significant organisational change",

          "Material operational change",

          "Regulatory change",

          "Change in risk appetite or business environment"

        ]

      },


      {
        tier: 2,

        name:
          "Project / Activity Risk",

        purpose:
          "Assess risk associated with a defined project, product, change, activity or planned body of work.",

        typicalUse: [

          "Projects",

          "New services",

          "Operational change",

          "Product introduction",

          "Planned high-risk activities"

        ],

        output:
          "Risk Assessment",

        reviewTriggers: [

          "Project milestones",

          "Scope change",

          "Incident or near miss",

          "Change in assumptions",

          "Changes to controls or work methods"

        ]

      },


      {
        tier: 3,

        name:
          "Point-of-Work Risk",

        purpose:
          "Confirm hazards and controls at the point work is performed and respond to changing local conditions.",

        typicalUse: [

          "Field work",

          "Site work",

          "Dynamic operational tasks",

          "Maintenance",

          "Construction",

          "High-risk physical work"

        ],

        output:
          "Point-of-work assessment",

        conditional:
          "field-or-operational-work",

        reviewTriggers: [

          "Before work starts",

          "When site conditions change",

          "When scope changes",

          "When new hazards emerge",

          "When required controls cannot be implemented"

        ]

      }

    ]

  },


  /*
   * ==========================================================
   * RISK CATEGORIES
   *
   * Generator selects only categories supported by the customer's
   * discovery and implementation profiles.
   * ==========================================================
   */

  availableRiskCategories: [

    {
      id: "health-safety",
      name: "Health and Safety"
    },

    {
      id: "quality",
      name: "Quality"
    },

    {
      id: "environment",
      name: "Environment"
    },

    {
      id: "compliance",
      name: "Legal and Compliance"
    },

    {
      id: "contractors",
      name: "Contractor"
    },

    {
      id: "driving",
      name: "Driving and Fleet"
    },

    {
      id: "dangerous-goods",
      name: "Dangerous Goods and Hazardous Materials"
    },

    {
      id: "plant",
      name: "Plant and Equipment"
    },

    {
      id: "manual-handling",
      name: "Manual Handling"
    },

    {
      id: "heights",
      name: "Working at Heights"
    },

    {
      id: "traffic",
      name: "Working Near Traffic"
    },

    {
      id: "psychosocial",
      name: "Psychosocial"
    },

    {
      id: "project",
      name: "Project"
    },

    {
      id: "technology",
      name: "Technology and Information"
    },

    {
      id: "business-continuity",
      name: "Business Continuity"
    },

    {
      id: "strategic",
      name: "Strategic"
    },

    {
      id: "financial",
      name: "Financial"
    },

    {
      id: "reputation",
      name: "Reputation"
    },

    {
      id: "change",
      name: "Change"
    }

  ],


  /*
   * ==========================================================
   * TIWILI DEFAULT RISK MATRIX
   *
   * This is the default only.
   *
   * If the customer has an appropriate existing matrix,
   * Tiwili may retain it.
   * ==========================================================
   */

  defaultRiskMatrix: {


    type:
      "5x5-weighted-likelihood",


    impactScale: [

      {
        score: 1,
        label: "Insignificant"
      },

      {
        score: 2,
        label: "Minor"
      },

      {
        score: 3,
        label: "Moderate"
      },

      {
        score: 4,
        label: "Major"
      },

      {
        score: 5,
        label: "Severe"
      }

    ],


    likelihoodScale: [

      {
        label: "Rare",
        score: 5
      },

      {
        label: "Unlikely",
        score: 10
      },

      {
        label: "Possible",
        score: 15
      },

      {
        label: "Likely",
        score: 20
      },

      {
        label: "Almost Certain",
        score: 25
      }

    ],


    calculation:
      "likelihoodScore * impactScore",


    thresholds: [

      {
        name: "Low",
        min: 0,
        maxExclusive: 20
      },

      {
        name: "Moderate",
        min: 20,
        maxExclusive: 45
      },

      {
        name: "High",
        min: 45,
        maxExclusive: 75
      },

      {
        name: "Significant",
        min: 75,
        maxExclusive: null
      }

    ],


    requiredRiskStates: [

      "Inherent",

      "Residual",

      "Target"

    ]

  },


  /*
   * ==========================================================
   * CONSEQUENCE ARCHITECTURE
   *
   * Structure is controlled.
   * Actual thresholds should be calibrated to the customer.
   * ==========================================================
   */

  consequenceArchitecture: {


    levels:
      5,


    categories: [

      "Strategic",

      "Financial",

      "Health and Safety",

      "Environment",

      "Legal and Compliance",

      "Operational",

      "Reputation"

    ],


    customerCalibrationRequired: [

      "Financial thresholds",

      "Revenue thresholds",

      "Property damage thresholds",

      "System outage durations",

      "Legal and penalty thresholds",

      "Customer impact thresholds"

    ],


    instruction:
      "Do not copy financial, revenue, penalty or property thresholds from another organisation. Calibrate consequence criteria to the customer's scale, activities and operating context."

  },


  /*
   * ==========================================================
   * REQUIRED TOOLS
   * ==========================================================
   */

  tools: [


    {
      id: "risk-register",

      name:
        "Risk Register",

      required:
        true,

      minimumFields: [

        "Risk ID",

        "Date Identified",

        "Business Area",

        "Risk Category",

        "Risk Description",

        "Causes",

        "Consequences",

        "Existing Controls",

        "Inherent Likelihood",

        "Inherent Impact",

        "Inherent Rating",

        "Control Effectiveness",

        "Residual Likelihood",

        "Residual Impact",

        "Residual Rating",

        "Further Treatment",

        "Action Owner",

        "Due Date",

        "Risk Owner",

        "Status",

        "Target Risk",

        "Review Date"

      ]

    },


    {
      id: "risk-assessment",

      name:
        "Risk Assessment",

      required:
        true,

      minimumSections: [

        "Activity / Scope",

        "Risk Identification",

        "Causes",

        "Consequences",

        "Existing Controls",

        "Inherent Assessment",

        "Residual Assessment",

        "Further Treatment",

        "Target Assessment",

        "Approval",

        "Review"

      ]

    },


    {
      id: "risk-matrix",

      name:
        "Risk Matrix",

      required:
        true

    },


    {
      id: "risk-treatment",

      name:
        "Risk Treatment and Action Tracking",

      required:
        true

    }

  ],


  /*
   * ==========================================================
   * AI CAPABILITY
   *
   * The system-config AI level determines how these appear.
   * ==========================================================
   */

  aiCapabilities: [


    {
      id:
        "risk-identification",

      name:
        "Risk Identification Assistant",

      purpose:
        "Help users identify relevant hazards, threats, causes and consequences from the activity being assessed."

    },


    {
      id:
        "risk-description",

      name:
        "Risk Description Assistant",

      purpose:
        "Help users express risks consistently using cause-event-consequence style descriptions."

    },


    {
      id:
        "controls",

      name:
        "Control Identification Assistant",

      purpose:
        "Help users identify existing and potential controls and consider the hierarchy of controls where relevant."

    },


    {
      id:
        "control-effectiveness",

      name:
        "Control Effectiveness Review",

      purpose:
        "Prompt users to consider whether controls are implemented, suitable and operating as intended."

    },


    {
      id:
        "treatment",

      name:
        "Risk Treatment Assistant",

      purpose:
        "Help identify further actions where residual risk remains outside tolerance."

    },


    {
      id:
        "review",

      name:
        "Risk Review Assistant",

      purpose:
        "Guide periodic risk reviews and identify changes requiring reassessment."

    }

  ],


  /*
   * ==========================================================
   * SYSTEM VOICE RULES
   * ==========================================================
   */

  voiceRules: {


    lean: {

      instruction:
        "Use short, practical and direct requirements.",

      guidanceLevel:
        "minimal",

      examples:
        "only where necessary",

      target:
        "Minimum documentation necessary to operate the control effectively."

    },


    balanced: {

      instruction:
        "Use practical requirements with concise explanation of intent and application.",

      guidanceLevel:
        "moderate",

      examples:
        "where helpful",

      target:
        "A system that is easy to use while providing sufficient context."

    },


    detailed: {

      instruction:
        "Provide additional guidance, context and examples while avoiding unnecessary repetition.",

      guidanceLevel:
        "high",

      examples:
        "regularly",

      target:
        "A more explanatory system suitable for complex or highly assured environments."

    }

  },


  /*
   * ==========================================================
   * GOVERNANCE RULES
   * ==========================================================
   */

  governanceRules: {


    light: {

      routineRisk:
        "Risk Owner",

      higherRisk:
        "Appropriate Manager",

      significantRisk:
        "Senior authorised role",

      principle:
        "Minimise unnecessary approval while preserving escalation of material risk."

    },


    controlled: {

      routineRisk:
        "Risk Owner",

      moderateRisk:
        "Manager review",

      highRisk:
        "Functional or senior manager approval",

      significantRisk:
        "Senior leadership escalation",

      principle:
        "Apply defined management oversight and escalation according to risk significance."

    },


    assured: {

      routineRisk:
        "Risk Owner",

      moderateRisk:
        "Manager review",

      highRisk:
        "Functional owner and assurance review",

      significantRisk:
        "Executive approval and documented assurance",

      principle:
        "Provide formal approval, traceability, evidence and escalation for material risk."

    }

  },


  /*
   * ==========================================================
   * CONDITIONAL CONTENT RULES
   * ==========================================================
   */

  conditionalRules: [


    {
      id:
        "tier-3",

      includeWhen: [

        "customerSites",

        "physicalSites",

        "manualHandling",

        "plant",

        "heights",

        "traffic",

        "electrical",

        "dangerousGoods"

      ],

      outcome:
        "Include point-of-work risk assessment requirements."

    },


    {
      id:
        "project-risk",

      includeWhen: [

        "projects",

        "customerSites",

        "manufacture",

        "infrastructure"

      ],

      outcome:
        "Include project/activity-level risk assessment."

    },


    {
      id:
        "contractor-risk",

      includeWhen: [
        "contractors"
      ],

      outcome:
        "Include contractor risk within identification and assessment requirements."

    },


    {
      id:
        "driving-risk",

      includeWhen: [
        "driving"
      ],

      outcome:
        "Include driving and journey risk as a relevant category."

    },


    {
      id:
        "dangerous-goods-risk",

      includeWhen: [
        "dangerousGoods"
      ],

      outcome:
        "Include dangerous goods and hazardous material risk."

    },


    {
      id:
        "environment-risk",

      includeWhen: [

        "waste",

        "emissions",

        "environmentalImpact",

        "iso14001"

      ],

      outcome:
        "Include environmental risk and impact categories."

    },


    {
      id:
        "psychosocial-risk",

      includeWhen: [
        "employees"
      ],

      outcome:
        "Include psychosocial risk within the organisation's risk categories."

    }

  ],


  /*
   * ==========================================================
   * REQUIRED RECORDS
   * ==========================================================
   */

  records: [

    "Risk Register",

    "Completed Risk Assessments",

    "Risk Treatment Actions",

    "Risk Acceptance Decisions",

    "Risk Reviews",

    "Risk Reports",

    "Approval and Escalation Records"

  ],


  /*
   * ==========================================================
   * QUALITY ASSURANCE RULES
   *
   * Generated modules must pass these before publication.
   * ==========================================================
   */

  qa: {


    mandatorySections: [

      "purpose",

      "scope",

      "roles",

      "riskFramework",

      "identification",

      "evaluation",

      "treatment",

      "review",

      "escalation",

      "acceptance",

      "reporting",

      "records"

    ],


    requiredChecks: [

      "All mandatory procedure sections are present.",

      "Generated roles match the customer's implementation profile.",

      "Customer terminology is used consistently.",

      "The hierarchy of controls has not been weakened.",

      "Risk acceptance safeguards are present.",

      "Stop-work requirements are included where operational work applies.",

      "Required tools referenced by the procedure exist.",

      "Risk matrix methodology is internally consistent.",

      "Risk register fields align with the procedure.",

      "Approval pathways align with the selected governance model.",

      "No legal obligation has been invented.",

      "No customer activity, role or location has been fabricated.",

      "Customer-specific financial or regulatory thresholds are not invented where data is unavailable."

    ],


    publicationStatus:
      "Generated content must remain Draft until reviewed and approved."

  }

};


module.exports =
  riskManagementMaster;
