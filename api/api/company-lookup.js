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
You are the Tiwili Company Discovery Assistant.

The user has supplied a company name or website.

Use public web information to identify the most likely company and build
a preliminary business profile that can later be confirmed by the customer.

This is discovery only.

Do NOT:
- claim that public information is definitely correct;
- make regulatory or legal conclusions;
- invent information;
- guess specific operational activities unless public evidence reasonably supports them;
- claim ISO certification unless you find credible public evidence.

Prefer:
1. the company's own website;
2. credible company profiles and official public information;
3. reputable news or industry sources.

If there are multiple companies with the same or similar name, reduce
confidence and explain the ambiguity.

Map the company into the Tiwili profile structure where reasonably possible.

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

Only populate fields supported by the public information you found.
Leave unknown values empty.

The customer will confirm or correct this information before Tiwili relies on it.
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

          instructions: instructions,

          input:
            `Find the company or organisation that best matches: ${query}`,

          tools: [
            {
              type: "web_search"
            }
          ],

          text: {

            format: {

              type: "json_schema",

              name: "tiwili_company_lookup",

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

                  }

                },

                required: [
                  "found",
                  "companyName",
                  "website",
                  "summary",
                  "confidence",
                  "confidenceReason",
                  "profile"
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
          "Tiwili could not complete the company lookup."
      });

    }


    const data =
      await response.json();


    let outputText = "";


    if (
      Array.isArray(
        data.output
      )
    ) {

      for (
        const item of data.output
      ) {

        if (
          item.type === "message" &&
          Array.isArray(item.content)
        ) {

          for (
            const content of item.content
          ) {

            if (
              content.type === "output_text"
            ) {

              outputText +=
                content.text;

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
          "Tiwili could not interpret the company search."
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
