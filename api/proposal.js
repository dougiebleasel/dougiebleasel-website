module.exports = async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  if (!process.env.RESEND_API_KEY) {

    console.error(
      "RESEND_API_KEY is not configured."
    );

    return res.status(500).json({
      error:
        "Proposal email service is not configured."
    });

  }


  try {

    const enquiry =
      req.body || {};


    const company =
      String(
        enquiry.company ||
        "Unknown organisation"
      );


    const service =
      String(
        enquiry.service ||
        "Not specified"
      );


    const contact =
      enquiry.contact || {};


    const profile =
      enquiry.profile || {};


    const recommendation =
      enquiry.recommendation || {};


    if (
      !contact.name ||
      !contact.email
    ) {

      return res.status(400).json({
        error:
          "Name and email are required."
      });

    }


    function escapeHtml(value) {

      return String(
        value ?? ""
      )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    }


    function arrayText(value) {

      if (
        Array.isArray(value) &&
        value.length
      ) {

        return value
          .map(escapeHtml)
          .join(", ");

      }

      return "Not specified";

    }


    function moduleNames(value) {

      if (
        !Array.isArray(value) ||
        !value.length
      ) {

        return "None recorded";

      }


      return value
        .map(item => {

          if (
            Array.isArray(item)
          ) {

            return escapeHtml(
              item[0]
            );

          }


          if (
            item &&
            typeof item === "object" &&
            item.title
          ) {

            return escapeHtml(
              item.title
            );

          }


          return escapeHtml(
            item
          );

        })
        .join("<br>");

    }


    const subject =
      "New Tiwili proposal request — " +
      company +
      " — " +
      service;


    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#202422;line-height:1.5;max-width:760px;margin:auto;">

        <div style="background:#123524;color:#F4F6F5;padding:24px 28px;border-radius:10px 10px 0 0;">

          <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#8FE06F;font-weight:700;">
            New Tiwili Opportunity
          </div>

          <h1 style="margin:7px 0 0;font-size:28px;">
            ${escapeHtml(company)}
          </h1>

          <div style="margin-top:6px;color:#D5DDD8;">
            ${escapeHtml(service)}
          </div>

        </div>


        <div style="border:1px solid #DCE3DF;border-top:0;padding:28px;border-radius:0 0 10px 10px;">

          <h2 style="font-size:18px;margin:0 0 12px;">
            Contact
          </h2>

          <p style="margin:0 0 18px;">
            <strong>Name:</strong>
            ${escapeHtml(contact.name)}
            <br>

            <strong>Email:</strong>
            ${escapeHtml(contact.email)}
            <br>

            <strong>Phone:</strong>
            ${escapeHtml(
              contact.phone ||
              "Not provided"
            )}
          </p>


          <h2 style="font-size:18px;margin:24px 0 12px;">
            Notes
          </h2>

          <p style="margin:0 0 18px;">
            ${escapeHtml(
              contact.notes ||
              "No additional notes provided."
            )}
          </p>


          <h2 style="font-size:18px;margin:24px 0 12px;">
            Business profile
          </h2>

          <p style="margin:0 0 18px;">

            <strong>Company size:</strong>
            ${escapeHtml(
              profile.companySize ||
              "Not specified"
            )}
            <br>

            <strong>Industry:</strong>
            ${escapeHtml(
              profile.industry ||
              "Not specified"
            )}
            <br>

            <strong>Jurisdictions:</strong>
            ${arrayText(
              profile.jurisdictions
            )}
            <br>

            <strong>Business profile:</strong>
            ${arrayText(
              profile.businessProfile
            )}
            <br>

            <strong>Activities:</strong>
            ${arrayText(
              profile.activities
            )}
            <br>

            <strong>Driving:</strong>
            ${arrayText(
              profile.drivingDetails
            )}
            <br>

            <strong>Dangerous goods:</strong>
            ${arrayText(
              profile.dangerousGoodsDetails
            )}
            <br>

            <strong>Environment:</strong>
            ${arrayText(
              profile.environment
            )}
            <br>

            <strong>Business goals:</strong>
            ${arrayText(
              profile.businessNeeds
            )}
            <br>

            <strong>Standards and tools:</strong>
            ${arrayText(
              profile.standards
            )}

          </p>


          <h2 style="font-size:18px;margin:24px 0 12px;">
            Recommended IMS
          </h2>


          <table style="border-collapse:collapse;width:100%;font-size:13px;">

            <tr>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;width:28%;">
                <strong>Core IMS</strong>
              </td>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                ${moduleNames(
                  recommendation.core
                )}
              </td>

            </tr>


            <tr>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                <strong>Risk modules</strong>
              </td>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                ${moduleNames(
                  recommendation.risks
                )}
              </td>

            </tr>


            <tr>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                <strong>Environment</strong>
              </td>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                ${moduleNames(
                  recommendation.environment
                )}
              </td>

            </tr>


            <tr>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                <strong>Assurance</strong>
              </td>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                ${moduleNames(
                  recommendation.assurance
                )}
              </td>

            </tr>


            <tr>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                <strong>Digital and AI</strong>
              </td>

              <td style="vertical-align:top;padding:10px;border:1px solid #DCE3DF;">
                ${moduleNames(
                  recommendation.tools
                )}
              </td>

            </tr>

          </table>


          <p style="margin:26px 0 0;font-size:11px;color:#66716B;">
            Generated from the Tiwili discovery and recommendation journey.
          </p>

        </div>

      </div>
    `;


    const resendResponse =
      await fetch(
        "https://api.resend.com/emails",
        {

          method: "POST",

          headers: {

            "Authorization":
              `Bearer ${process.env.RESEND_API_KEY}`,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              from:
                "Tiwili <onboarding@resend.dev>",

              to: [
                "dougie.bleasel@gmail.com"
              ],

              subject,

              html

            })

        }
      );


    const resendData =
      await resendResponse.json();


    if (!resendResponse.ok) {

      console.error(
        "Resend error:",
        resendData
      );

      return res.status(500).json({
        error:
          "Tiwili could not send the proposal email."
      });

    }


    return res.status(200).json({

      sent: true,

      id:
        resendData.id ||
        null

    });


  } catch (error) {

    console.error(
      "Proposal submission error:",
      error
    );


    return res.status(500).json({
      error:
        "Something went wrong while sending the proposal request."
    });

  }

};
