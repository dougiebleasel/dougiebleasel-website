module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      messages = [],
      profile = {}
    } = req.body || {};


    const systemPrompt = `
You are the Tiwili IMS Business Discovery Assistant.

Your job is to interview a company founder or representative and understand
enough about their organisation for the Tiwili rules engine to configure
an appropriate Integrated Management System.

Tiwili is designed for startups and scale-ups, particularly organisations
operating in regulated or operationally complex environments.

You are NOT responsible for deciding which Tiwili products or modules
the customer receives. A deterministic rules engine will do that later.

Your job is ONLY to:

1. understand the organisation;
2. ask useful follow-up questions;
3. extract structured facts;
4. identify information that is still unclear.

Ask ONE main question at a time.

Keep the conversation friendly, practical and concise.

Do not overwhelm the customer with risk terminology.

Prefer plain questions such as:
- What does your company do?
- Where do you operate?
- Do your own employees perform that work?
- Do you use contractors?
- Do your staff drive for work?
- Do you handle chemicals or batteries?
- Do you manufacture or import physical products?
- Are you trying to win government or major corporate customers?
- Are you seeking ISO certification?

If the customer says they do not know something, that is acceptable.
Record uncertainty and ask a simpler follow-up where useful.

Never claim that Tiwili guarantees regulatory compliance or ISO certification.

Preserve previously known profile information unless the customer corrects it.

Set complete=true only when you have enough information to produce a
reasonable first-pass IMS configuration.

A useful minimum usually includes:
- what the organisation does;
- where it operates;
- whether it has employees;
- whether it performs physical or operational work;
- major operational activities;
- major customer or regulatory objectives.

Current known profile:
${JSON.stringify(profile)}
`;


    const conversation = messages.map(message => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: [
        {
          type:
            message.role === "assistant"
              ? "output_text"
              : "input_text",
          text: message.content
        }
      ]
    }));


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

          instructions: systemPrompt,

          input: conversation.length
            ? conversation
            : "Begin the interview.",

          text: {

            format: {

              type: "json_schema",

              name: "tiwili_business_profile",

              strict: true,

              schema: {

                type: "object",

                additionalProperties: false,

                properties: {

                  assistantMessage: {
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

                  complete: {
                    type: "boolean"
                  }

                },

                required: [
                  "assistantMessage",
                  "profile",
                  "complete"
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
        "OpenAI error:",
        errorText
      );

      return res.status(500).json({
        error:
          "The AI interview service could not respond."
      });

    }


    const data =
      await response.json();


    let outputText = "";


    if (
      data.output &&
      Array.isArray(data.output)
    ) {

      for (const item of data.output) {

        if (
          item.type === "message" &&
          Array.isArray(item.content)
        ) {

          for (const content of item.content) {

            if (
              content.type === "output_text"
            ) {

              outputText += content.text;

            }

          }

        }

      }

    }


    if (!outputText) {

      console.error(
        "No output text returned:",
        JSON.stringify(data)
      );

      return res.status(500).json({
        error:
          "The AI returned no usable response."
      });

    }


    let result;


    try {

      result =
        JSON.parse(outputText);

    } catch (error) {

      console.error(
        "Structured output parse failure:",
        outputText
      );

      return res.status(500).json({
        error:
          "The AI returned an unexpected response."
      });

    }


    return res.status(200).json(result);


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Something went wrong with the Tiwili interview."
    });

  }

};
