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
      generatedModule,
      validation,
      businessProfile,
      systemConfig,
      implementationProfile
    } = req.body || {};


    if (!generatedModule) {

      return res.status(400).json({
        error: "Generated module is required."
      });

    }


    const failures =
      Array.isArray(
        validation?.failures
      )
        ? validation.failures
        : [];


    if (!failures.length) {

      return res.status(200).json({
        success: true,
        repaired: false,
        module: generatedModule
      });

    }


    const masterSpecification =
      JSON.stringify(
        riskManagementMaster,
        null,
        2
      );


    const repairInstructions = `
You are the Tiwili Risk Management Repair Engine.

You are NOT generating a new module from scratch.

You are repairing a previously generated Risk Management module that failed validation.

Your job is to:

1. Preserve all content that did not fail validation.
2. Repair only the failed, invalid, unsupported or contradictory parts.
3. Never introduce new customer facts.
4. Never invent a jurisdiction, role, location, activity, legal obligation or threshold.
5. The Tiwili Master takes precedence over the generated draft.
6. Customer-confirmed information takes precedence over assumptions.
7. Locked requirements in the Tiwili Master must not be weakened.
8. Maintain the same JSON structure as the original generated module.
9. Return valid JSON only.
10. Do not include markdown fences or explanatory text.

The validator identified these failures:

${JSON.stringify(
  failures,
  null,
  2
)}

The controlled Tiwili Risk Management Master is:

${masterSpecification}

The confirmed customer business profile is:

${JSON.stringify(
  businessProfile || {},
  null,
  2
)}

The confirmed customer system configuration is:

${JSON.stringify(
  systemConfig || {},
  null,
  2
)}

The confirmed customer implementation profile is:

${JSON.stringify(
  implementationProfile || {},
  null,
  2
)}

The generated module requiring repair is:

${JSON.stringify(
  generatedModule,
  null,
  2
)}

Repair the module so that the listed validation failures are resolved.

Important:
If a statement contains an unsupported jurisdiction, remove or generalise that jurisdiction reference rather than replacing it with another guessed jurisdiction.

For example:
"UK jurisdiction requirements"
should become something like:
"applicable jurisdictional requirements"
unless the customer's jurisdiction is explicitly confirmed.

Return the COMPLETE repaired module, not only the changed fields.
`;


    const response =
      await fetch(
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

            model:
              "gpt-4.1-mini",

            temperature:
              0.1,

            response_format: {
              type: "json_object"
            },

            messages: [

              {
                role: "system",

                content:
                  "You repair controlled Tiwili management-system JSON. Return valid JSON only."
              },

              {
                role: "user",

                content:
                  repairInstructions
              }

            ]

          })

        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      console.error(
        "OpenAI repair error:",
        data
      );

      return res.status(500).json({
        error:
          "Tiwili could not repair the Risk Management module."
      });

    }


    const content =
      data?.choices?.[0]?.message?.content;


    if (!content) {

      return res.status(500).json({
        error:
          "The repair engine returned no content."
      });

    }


    let repairedModule;


    try {

      repairedModule =
        JSON.parse(
          content
        );

    } catch (error) {

      console.error(
        "Repair JSON parse error:",
        content
      );

      return res.status(500).json({
        error:
          "Tiwili returned an invalid repaired module."
      });

    }


    return res.status(200).json({

      success:
        true,

      repaired:
        true,

      repairedAt:
        new Date()
          .toISOString(),

      failuresAddressed:
        failures,

      module:
        repairedModule

    });


  } catch (error) {

    console.error(
      "Risk repair error:",
      error
    );


    return res.status(500).json({
      error:
        "Something went wrong while repairing the Risk Management module."
    });

  }

};
