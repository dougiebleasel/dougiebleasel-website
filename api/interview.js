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

IMPORTANT:
Never claim that Tiwili guarantees regulatory compliance or ISO certification.

Extract information into this structure:

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

Return ONLY valid JSON in this exact shape:

{
  "assistantMessage": "Your conversational response and next question",
  "profile": {
    "companyName": "",
    "companySize": "",
    "industry": "",
    "jurisdictions": [],
    "businessProfile": [],
    "activities": [],
    "drivingDetails": [],
    "dangerousGoodsDetails": [],
    "environment": [],
    "businessNeeds": [],
    "standards": []
  },
  "complete": false
}

Preserve previously known profile information unless the customer corrects it.

Set complete=true only when you have enough information to produce a
reasonable first-pass IMS configuration.

You do NOT need every field completed.

A useful minimum usually includes:
- what the organisation does;
- where it operates;
- whether it has employees;
- whether it performs physical/operational work;
- major operational activities;
- major customer/regulatory objectives.

Current known profile:
${JSON.stringify(profile)}
`;


    const conversation = messages
      .map(message => {
        return `${message.role.toUpperCase()}: ${message.content}`;
      })
      .join("\n");


    const input = `
${systemPrompt}

Conversation so far:

${conversation || "No conversation yet. Begin the interview."}
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
          input: input
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

              outputText +=
                content.text;

            }

          }

        }

      }

    }


    outputText =
      outputText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


    let result;


    try {

      result =
        JSON.parse(outputText);

    } catch (parseError) {

      console.error(
        "Could not parse AI JSON:",
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
