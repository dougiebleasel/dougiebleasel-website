module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      query = ""
    } = req.body || {};

    if (!query.trim()) {
      return res.status(400).json({
        error: "Please provide a company name or website."
      });
    }

    const instructions = `
You are the Certicium Company Discovery Assistant.

The user has supplied a company name or website.

Your job is to identify the most likely organisation using public web information
and create a strong first-pass business profile for an IMS Build Demo.

IMPORTANT:
This is discovery and inference, not a compliance determination.

Use:
1. the organisation's own website;
2. official public information;
3. credible company profiles;
4. reputable news or industry sources.

You MAY make reasonable operational assumptions where the public information
supports the nature of the business, but you MUST label them as inferred rather
than publicly confirmed.

Example:
If the company publicly installs roadside technology and has field technicians,
it is reasonable to infer likely exposure to driving, manual handling, electrical
work and traffic environments. Do not present those as confirmed facts unless
public evidence directly supports them.

Do NOT:
- invent specific facts;
- make legal or regulatory conclusions;
- claim ISO certification without credible public evidence;
- infer dangerous goods, heavy vehicles, manufacturing or other specialised
  activities without a reasonable basis;
- turn an inference into a confirmed fact.

For every profile field, return a matching assessment describing:
- source: public, inferred or unknown
- confidence: high, medium or low
- status: proposed or unknown
- reason: concise explanation

Populate as much of the profile as reasonably possible.
Unknown values should remain empty.

Allowed values:

industry:
technology
mobility
energy
manufacturing
infrastructure
medtech
other

jurisdictions:
australia
eu
uk
other

businessProfile:
employees
physicalSites
customerSites
manufacture
import
regulated

activities:
driving
contractors
electrical
dangerousGoods
plant
manualHandling
public
heights
traffic
remote

drivingDetails:
occasional
regular
fleet
heavyVehicles

dangerousGoodsDetails:
store
transport
use
import
manufacture
unsure

environment:
waste
emissions
environmentalImpact
products

businessNeeds:
majorClients
government
regulated
investors

standards:
iso9001
iso14001
iso45001
riskRegister
incident
bcdr

Field assessment keys must be exactly:
companyName
companySize
industry
jurisdictions
businessProfile
activities
drivingDetails
dangerousGoodsDetails
environment
businessNeeds
standards

The customer will review and confirm or change these proposed answers before
Certicium relies on them.
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({

          model: "gpt-5.6-luna",

          instructions,

          input:
            `Research and build a first-pass profile for the organisation that best matches: ${query}`,

          tools: [
            {
              type: "web_search"
            }
          ],

          text: {

            format: {

              type: "json_schema",

              name: "certicium_company_lookup",

              strict: true,

              schema: {

                type: "object",

                additionalProperties: false,

                properties: {

                  found: {
                    type: "boolean"
                  },

                  companyName: {
                    type: "string"
                  },

                  website: {
                    type: "string"
                  },

                  summary: {
                    type: "string"
                  },

                  confidence: {
                    type: "string",
                    enum: [
                      "high",
                      "medium",
                      "low"
                    ]
                  },

                  confidenceReason: {
                    type: "string"
                  },

                  profile: {

                    type: "object",

                    additionalProperties: false,

                    properties: {

                      companyName: {
                        type: "string"
                      },

                      companySize: {
                        type: "string"
                      },

                      industry: {
                        type: "string",
                        enum: [
                          "",
                          "technology",
                          "mobility",
                          "energy",
                          "manufacturing",
                          "infrastructure",
                          "medtech",
                          "other"
                        ]
                      },

                      jurisdictions: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "australia",
                            "eu",
                            "uk",
                            "other"
                          ]
                        }
                      },

                      businessProfile: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "employees",
                            "physicalSites",
                            "customerSites",
                            "manufacture",
                            "import",
                            "regulated"
                          ]
                        }
                      },

                      activities: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "driving",
                            "contractors",
                            "electrical",
                            "dangerousGoods",
                            "plant",
                            "manualHandling",
                            "public",
                            "heights",
                            "traffic",
                            "remote"
                          ]
                        }
                      },

                      drivingDetails: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "occasional",
                            "regular",
                            "fleet",
                            "heavyVehicles"
                          ]
                        }
                      },

                      dangerousGoodsDetails: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "store",
                            "transport",
                            "use",
                            "import",
                            "manufacture",
                            "unsure"
                          ]
                        }
                      },

                      environment: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "waste",
                            "emissions",
                            "environmentalImpact",
                            "products"
                          ]
                        }
                      },

                      businessNeeds: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "majorClients",
                            "government",
                            "regulated",
                            "investors"
                          ]
                        }
                      },

                      standards: {
                        type: "array",
                        items: {
                          type: "string",
                          enum: [
                            "iso9001",
                            "iso14001",
                            "iso45001",
                            "riskRegister",
                            "incident",
                            "bcdr"
                          ]
                        }
                      }

                    },

                    required: [
                      "companyName",
                      "companySize",
                      "industry",
                      "jurisdictions",
                      "businessProfile",
                      "activities",
                      "drivingDetails",
                      "dangerousGoodsDetails",
                      "environment",
                      "businessNeeds",
                      "standards"
                    ]

                  },

                  assessments: {

                    type: "array",

                    items: {

                      type: "object",

                      additionalProperties: false,

                      properties: {

                        field: {
                          type: "string",
                          enum: [
                            "companyName",
                            "companySize",
                            "industry",
                            "jurisdictions",
                            "businessProfile",
                            "activities",
                            "drivingDetails",
                            "dangerousGoodsDetails",
                            "environment",
                            "businessNeeds",
                            "standards"
                          ]
                        },

                        source: {
                          type: "string",
                          enum: [
                            "public",
                            "inferred",
                            "unknown"
                          ]
                        },

                        confidence: {
                          type: "string",
                          enum: [
                            "high",
                            "medium",
                            "low"
                          ]
                        },

                        status: {
                          type: "string",
                          enum: [
                            "proposed",
                            "unknown"
                          ]
                        },

                        reason: {
                          type: "string"
                        }

                      },

                      required: [
                        "field",
                        "source",
                        "confidence",
                        "status",
                        "reason"
                      ]

                    }

                  }

                },

                required: [
                  "found",
                  "companyName",
                  "website",
                  "summary",
                  "confidence",
                  "confidenceReason",
                  "profile",
                  "assessments"
                ]

              }

            }

          }

        })

      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "OpenAI company lookup error:",
        errorText
      );

      return res.status(500).json({
        error:
          "Certicium could not complete the company lookup."
      });

    }

    const data =
      await response.json();

    let outputText = "";

    if (Array.isArray(data.output)) {

      for (const item of data.output) {

        if (
          item.type === "message" &&
          Array.isArray(item.content)
        ) {

          for (const content of item.content) {

            if (content.type === "output_text") {
              outputText += content.text;
            }

          }

        }

      }

    }

    if (!outputText) {

      console.error(
        "No company lookup output:",
        JSON.stringify(data)
      );

      return res.status(500).json({
        error:
          "Certicium could not interpret the company search."
      });

    }

    const result =
      JSON.parse(outputText);

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(
      "Company lookup error:",
      error
    );

    return res.status(500).json({
      error:
        "Something went wrong while researching the company."
    });

  }

};
