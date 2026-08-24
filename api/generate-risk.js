const riskManagementMaster =
  require("../masters/risk-management");
module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured."
    });
  }

  try {

    const {
      businessProfile,
      systemConfig,
      implementationProfile
    } = req.body || {};

    if (!implementationProfile) {
      return res.status(400).json({
        error: "Implementation profile is required."
      });
    }

    const masterSpecification = `
TIWILI MASTER MODULE
MODULE: RISK MANAGEMENT
VERSION: 0.1

PURPOSE
Create a practical organisation-specific Risk Management module.

CORE PRINCIPLE
This is a controlled management system module.
Do not invent regulatory requirements.
Do not claim legal compliance or certification.
Do not remove mandatory management-system controls merely because
the customer has selected a lean voice or light governance.

MANDATORY PROCEDURE SECTIONS

1. Purpose
2. Scope
3. Risk Management Principles
4. Roles and Responsibilities
5. Risk Identification
6. Risk Analysis and Evaluation
7. Risk Controls
8. Risk Treatment
9. Risk Acceptance and Escalation
10. Monitoring and Review
11. Communication and Consultation
12. Records

MANDATORY RISK PROCESS

Identify
→ Analyse
→ Evaluate
→ Treat
→ Approve / Accept
→ Monitor
→ Review

CONTROL PRINCIPLE

Controls should follow the hierarchy of controls where relevant:

1. Elimination
2. Substitution
3. Engineering controls
4. Administrative controls
5. Personal protective equipment

The generated procedure must make clear that controls should be
reasonably selected according to the nature of the risk and the
organisation's operating context.

REQUIRED TOOLS

The module must include:

- Risk Matrix
- Risk Register
- Risk Assessment
- Risk Treatment / Action tracking

RISK REGISTER MINIMUM FIELDS

- Risk ID
- Date identified
- Business area
- Risk category
- Risk description
- Causes
- Consequences
- Existing controls
- Inherent likelihood
- Inherent consequence
- Inherent rating
- Control effectiveness
- Residual likelihood
- Residual consequence
- Residual rating
- Further treatment
- Action owner
- Due date
- Risk owner
- Status
- Review date

CONDITIONAL RISK CATEGORIES

Only include these where supported by the customer's profile:

- Health and safety
- Quality
- Environmental
- Compliance
- Contractor
- Driving
- Plant and equipment
- Dangerous goods
- Working at heights
- Manual handling
- Psychosocial
- Project
- Information / technology
- Business continuity
- Strategic
- Financial
- Reputation
- Change

SYSTEM VOICE

LEAN:
Use short, practical language.
Avoid unnecessary explanation.
Keep requirements clear and actionable.

BALANCED:
Provide concise requirements with enough explanation
for users to understand their purpose and application.

DETAILED:
Provide additional guidance, context and practical examples
without becoming repetitive or unnecessarily bureaucratic.

AI ASSISTANCE

ON-DEMAND:
AI assistance is available only when requested.

ASSISTED:
Identify useful points where Tiwili AI can help the user.

GUIDED:
Design the module so Tiwili AI can actively walk users through
risk identification, assessment, treatment and review.

GOVERNANCE

LIGHT:
Minimise unnecessary approvals.
Routine risks may be managed by their risk owner.
Higher risks must still be appropriately escalated.

CONTROLLED:
Include manager oversight, defined approval and escalation.

ASSURED:
Include formal review, evidence, approval, escalation
and stronger traceability.

IMPORTANT:
The customer's governance preference must never override
mandatory regulatory, contractual or critical-risk controls.

TAILORING RULES

Use the customer's:

- legal entity name
- workforce context
- locations
- terminology
- management roles
- existing system information
- technology environment
- operational profile
- selected system voice
- selected AI level
- selected governance level

Do not fabricate roles, locations, activities or legal obligations.

Where necessary information is unavailable, use a sensible
generic management-system requirement rather than inventing facts.
`;

    const userContext = `
BUSINESS DISCOVERY

${JSON.stringify(
  businessProfile || {},
  null,
  2
)}

SYSTEM CONFIGURATION

${JSON.stringify(
  systemConfig || {},
  null,
  2
)}

IMPLEMENTATION PROFILE

${JSON.stringify(
  implementationProfile || {},
  null,
  2
)}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          model: "gpt-4.1-mini",

          temperature: 0.2,

          response_format: {
            type: "json_object"
          },

          messages: [

            {
              role: "system",

              content: `
You are the Tiwili Management System Generation Engine.

You create controlled, practical management-system content from
Tiwili master specifications and confirmed customer information.

The Tiwili master specification takes precedence over stylistic
preferences.

Return valid JSON only.

The required JSON structure is:

{
  "module": {
    "name": "Risk Management",
    "version": "Draft 0.1",
    "organisation": "",
    "systemName": "",
    "voice": "",
    "aiLevel": "",
    "governanceLevel": ""
  },

  "procedure": {
    "purpose": "",
    "scope": "",
    "principles": [],
    "responsibilities": [
      {
        "role": "",
        "responsibilities": []
      }
    ],
    "riskIdentification": {
      "content": "",
      "categories": []
    },
    "analysisAndEvaluation": "",
    "controls": {
      "content": "",
      "hierarchy": []
    },
    "treatment": "",
    "acceptanceAndEscalation": "",
    "monitoringAndReview": "",
    "communicationAndConsultation": "",
    "records": []
  },

  "riskMatrix": {
    "recommendedApproach": "",
    "likelihoodScale": [],
    "consequenceScale": [],
    "ratingMethod": "",
    "note": ""
  },

  "riskRegister": {
    "fields": []
  },

  "riskAssessment": {
    "steps": []
  },

  "aiTools": [
    {
      "name": "",
      "purpose": "",
      "interaction": ""
    }
  ],

  "governance": {
    "workflow": [],
    "escalationRules": []
  },

  "qa": {
    "mandatorySectionsPresent": true,
    "requiredToolsPresent": true,
    "rolesConsistent": true,
    "customerTerminologyUsed": true,
    "warnings": []
  }
}

Do not include markdown fences.
Do not include commentary outside the JSON.
`
            },

            {
              role: "user",

              content:
                masterSpecification +
                "\n\n" +
                userContext
            }

          ]

        })

      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      console.error(
        "OpenAI generation error:",
        data
      );

      return res.status(500).json({
        error:
          "Tiwili could not generate the Risk Management module."
      });

    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {

      return res.status(500).json({
        error:
          "The generation engine returned no content."
      });

    }

    let generatedModule;

    try {

      generatedModule =
        JSON.parse(content);

    } catch (parseError) {

      console.error(
        "Generated JSON could not be parsed:",
        content
      );

      return res.status(500).json({
        error:
          "Tiwili generated an invalid module response."
      });

    }

    return res.status(200).json({
      success: true,
      generatedAt:
        new Date().toISOString(),
      module:
        generatedModule
    });

  } catch (error) {

    console.error(
      "Risk generation error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong while generating the Risk Management module."
    });

  }

};
