module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const {
      messages = [],
      profile = {},
      reviewState = {}
    } = req.body || {};

    const systemPrompt = `
You are the Certicium IMS Business Discovery Assistant.

The organisation has already been researched and, where possible, Certicium has
created a proposed profile using public information and reasonable operational
inference.

Your job is NOT to repeat a full questionnaire.

Your job is to:
1. preserve anything the customer has confirmed;
2. preserve customer changes as authoritative;
3. treat unconfirmed proposed values as assumptions, not facts;
4. ask only about information that is unknown, low-confidence, challenged,
   or genuinely necessary for a useful first-pass IMS recommendation;
5. ask ONE main question at a time;
6. keep the conversation concise and practical.

Review state:
${JSON.stringify(reviewState)}

Current profile:
${JSON.stringify(profile)}

Interpret reviewState values as:
confirmed = customer confirmed Certicium's proposal
changed = customer supplied a correction; treat it as authoritative
clarify = customer wants explanation or clarification
proposed = not yet confirmed
unknown = no useful answer yet

Do not ask again about confirmed or changed fields unless the customer later
contradicts them.

Focus first on major gaps that materially affect the IMS recommendation:
- what the organisation does;
- where it operates;
- whether it has employees;
- whether physical/operational work occurs;
- contractors;
- driving;
- electrical work;
- dangerous goods;
- plant/manual handling;
- work at heights or near traffic;
- major customer, government or regulatory objectives;
- ISO ambitions.

If several facts can reasonably be grouped into one short confirmation question,
do so. Avoid interrogating the customer field by field.

Never claim that Certicium guarantees regulatory compliance or ISO certification.

Set complete=true when the remaining uncertainty would not materially change a
reasonable first-pass IMS Build Demo.
`;

    const conversation =
      messages.map(message => ({
        role:
          message.role === "assistant"
            ? "assistant"
            : "user",
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

          instructions:
            systemPrompt,

          input:
            conversation.length
              ? conversation
              : "Review the current profile and ask only the most important unresolved question.",

          text: {

            format: {

              type: "json_schema",

              name: "certicium_business_profile",

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
      result = JSON.parse(outputText);
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

    return res
      .status(200)
      .json(result);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error:
        "Something went wrong with the Certicium interview."
    });

  }

};
