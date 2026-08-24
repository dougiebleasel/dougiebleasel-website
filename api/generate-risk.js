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

const masterSpecification =
  JSON.stringify(
    riskManagementMaster,
    null,
    2
  );

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
