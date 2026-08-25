const riskManagementMaster =
  require("../masters/risk-management");


/*
 * ============================================================
 * TIWILI RISK MANAGEMENT VALIDATOR
 * ============================================================
 *
 * This validator does not generate content.
 *
 * Its job is to independently check a generated Risk Management
 * module against:
 *
 * 1. The controlled Tiwili Master
 * 2. The customer's confirmed implementation profile
 * 3. The customer's system configuration
 *
 * ============================================================
 */


module.exports = async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  try {

    const {
      generatedModule,
      businessProfile,
      systemConfig,
      implementationProfile
    } = req.body || {};


    if (!generatedModule) {

      return res.status(400).json({
        error: "Generated module is required."
      });

    }


    const failures = [];
    const warnings = [];
    const passes = [];


    /*
     * ==========================================================
     * HELPERS
     * ==========================================================
     */


    function normalise(value) {

      return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    }


    function containsMeaningfulText(value) {

      return (
        typeof value === "string" &&
        value.trim().length >= 10
      );

    }


    function addFailure(
      check,
      message,
      severity = "high"
    ) {

      failures.push({
        check,
        severity,
        message
      });

    }


    function addWarning(
      check,
      message
    ) {

      warnings.push({
        check,
        severity: "warning",
        message
      });

    }


    function addPass(
      check,
      message
    ) {

      passes.push({
        check,
        message
      });

    }


    const procedure =
      generatedModule.procedure || {};

    const matrix =
      generatedModule.riskMatrix || {};

    const register =
      generatedModule.riskRegister || {};

    const governance =
      generatedModule.governance || {};


    /*
     * ==========================================================
     * CHECK 1
     * REQUIRED PROCEDURE CONTENT
     * ==========================================================
     */


    const requiredProcedureChecks = [

      {
        id: "purpose",
        label: "Purpose",
        value: procedure.purpose
      },

      {
        id: "scope",
        label: "Scope",
        value: procedure.scope
      },

      {
        id: "analysisAndEvaluation",
        label: "Risk Analysis and Evaluation",
        value:
          procedure.analysisAndEvaluation
      },

      {
        id: "treatment",
        label: "Risk Treatment",
        value: procedure.treatment
      },

      {
        id: "acceptanceAndEscalation",
        label: "Risk Acceptance and Escalation",
        value:
          procedure.acceptanceAndEscalation
      },

      {
        id: "monitoringAndReview",
        label: "Monitoring and Review",
        value:
          procedure.monitoringAndReview
      },

      {
        id: "communicationAndConsultation",
        label: "Communication and Consultation",
        value:
          procedure.communicationAndConsultation
      }

    ];


    requiredProcedureChecks.forEach(
      item => {

        if (
          !containsMeaningfulText(
            item.value
          )
        ) {

          addFailure(
            "required-content",
            `${item.label} is missing or contains insufficient content.`
          );

        }

      }
    );


    if (
      failures.filter(
        item =>
          item.check ===
          "required-content"
      ).length === 0
    ) {

      addPass(
        "required-content",
        "Required procedure content is present."
      );

    }


    /*
     * ==========================================================
     * CHECK 2
     * LOCKED PRINCIPLES
     * ==========================================================
     */


    const generatedPrinciples =
      Array.isArray(
        procedure.principles
      )
        ? procedure.principles
        : [];


    const principleText =
      normalise(
        generatedPrinciples.join(" ")
      );


    const lockedConcepts = [

      {
        name:
          "Risk identification before acceptance or control",

        terms: [
          "identified",
          "accepted"
        ]
      },

      {
        name:
          "Residual risk review",

        terms: [
          "residual",
          "risk"
        ]
      },

      {
        name:
          "Risk escalation",

        terms: [
          "escalat"
        ]
      },

      {
        name:
          "Legal and contractual safeguards",

        terms: [
          "legal",
          "contract"
        ]
      },

      {
        name:
          "Control monitoring",

        terms: [
          "control",
          "monitor"
        ]
      }

    ];


    lockedConcepts.forEach(
      concept => {

        const found =
          concept.terms.every(
            term =>
              principleText.includes(
                normalise(term)
              )
          );


        if (!found) {

          addFailure(
            "locked-principles",
            `Locked principle may be missing or weakened: ${concept.name}.`
          );

        }

      }
    );


    if (
      failures.filter(
        item =>
          item.check ===
          "locked-principles"
      ).length === 0
    ) {

      addPass(
        "locked-principles",
        "Core locked Risk Management principles are present."
      );

    }


    /*
     * ==========================================================
     * CHECK 3
     * HIERARCHY OF CONTROLS
     * ==========================================================
     */


    const generatedHierarchy =
      Array.isArray(
        procedure.controls?.hierarchy
      )
        ? procedure.controls.hierarchy
        : [];


    const expectedHierarchy =
      riskManagementMaster
        .lockedRequirements
        .hierarchyOfControls
        .order
        .map(
          item =>
            item.control
        );


    const hierarchyNormalised =
      generatedHierarchy.map(
        item =>
          normalise(
            typeof item === "string"
              ? item
              : item.control ||
                item.name
          )
      );


    const missingControls =
      expectedHierarchy.filter(
        expected => {

          const expectedNormal =
            normalise(expected);

          return !hierarchyNormalised
            .some(
              generated =>
                generated.includes(
                  expectedNormal
                ) ||
                expectedNormal.includes(
                  generated
                )
            );

        }
      );


    if (
      missingControls.length
    ) {

      addFailure(
        "hierarchy-of-controls",
        "Hierarchy of Controls is incomplete. Missing: " +
        missingControls.join(", ") +
        "."
      );

    } else {

      addPass(
        "hierarchy-of-controls",
        "Hierarchy of Controls matches the Tiwili Master."
      );

    }


    /*
     * ==========================================================
     * CHECK 4
     * RISK REGISTER FIELDS
     * ==========================================================
     */


    const requiredRegisterFields =
      riskManagementMaster
        .tools
        .find(
          tool =>
            tool.id ===
            "risk-register"
        )
        ?.minimumFields || [];


    const generatedRegisterFields =
      Array.isArray(
        register.fields
      )
        ? register.fields
        : [];


    const normalisedRegisterFields =
      generatedRegisterFields.map(
        field =>
          normalise(
            typeof field === "string"
              ? field
              : field.name ||
                field.label
          )
      );


    const missingRegisterFields =
      requiredRegisterFields.filter(
        required => {

          const requiredNormal =
            normalise(required);

          return !normalisedRegisterFields
            .some(
              field =>
                field === requiredNormal
            );

        }
      );


    if (
      missingRegisterFields.length
    ) {

      addFailure(
        "risk-register",
        "Risk Register is missing required fields: " +
        missingRegisterFields.join(", ") +
        "."
      );

    } else {

      addPass(
        "risk-register",
        "Risk Register contains all required Tiwili fields."
      );

    }


    /*
     * ==========================================================
     * CHECK 5
     * DEFAULT MATRIX INTEGRITY
     *
     * Only enforce this when the customer has NOT supplied an
     * existing matrix.
     * ==========================================================
     */


    const existingRiskMatrix =
      implementationProfile
        ?.existingSystem
        ?.riskMatrix;


    const usingCustomerMatrix =
      existingRiskMatrix &&
      existingRiskMatrix !== "no";


    if (!usingCustomerMatrix) {


      const expectedLikelihood =
        riskManagementMaster
          .defaultRiskMatrix
          .likelihoodScale;


      const generatedLikelihood =
        Array.isArray(
          matrix.likelihoodScale
        )
          ? matrix.likelihoodScale
          : [];


      const likelihoodMatches =
        expectedLikelihood.every(
          expected => {

            return generatedLikelihood
              .some(
                actual => {

                  if (
                    typeof actual !==
                    "object"
                  ) {
                    return false;
                  }

                  return (
                    normalise(
                      actual.label
                    ) ===
                    normalise(
                      expected.label
                    )
                    &&
                    Number(
                      actual.score
                    ) ===
                    Number(
                      expected.score
                    )
                  );

                }
              );

          }
        );


      if (!likelihoodMatches) {

        addFailure(
          "risk-matrix",
          "Generated likelihood scale does not match the controlled Tiwili default."
        );

      } else {

        addPass(
          "risk-matrix-likelihood",
          "Likelihood scale matches the controlled Tiwili default."
        );

      }


      const expectedImpact =
        riskManagementMaster
          .defaultRiskMatrix
          .impactScale;


      const generatedImpact =
        Array.isArray(
          matrix.consequenceScale
        )
          ? matrix.consequenceScale
          : [];


      const impactMatches =
        expectedImpact.every(
          expected => {

            return generatedImpact
              .some(
                actual => {

                  if (
                    typeof actual !==
                    "object"
                  ) {
                    return false;
                  }

                  return (
                    normalise(
                      actual.label
                    ) ===
                    normalise(
                      expected.label
                    )
                    &&
                    Number(
                      actual.score
                    ) ===
                    Number(
                      expected.score
                    )
                  );

                }
              );

          }
        );


      if (!impactMatches) {

        addFailure(
          "risk-matrix",
          "Generated consequence scale does not match the controlled Tiwili default."
        );

      } else {

        addPass(
          "risk-matrix-impact",
          "Consequence scale matches the controlled Tiwili default."
        );

      }


    } else {

      addWarning(
        "risk-matrix",
        `Customer indicated an existing risk matrix (${existingRiskMatrix}). The generated matrix requires review against the customer's source material.`
      );

    }


    /*
     * ==========================================================
     * CHECK 6
     * CUSTOMER ROLE CONSISTENCY
     * ==========================================================
     */


    const confirmedRoles = [

      implementationProfile
        ?.responsibilities
        ?.imsOwner,

      implementationProfile
        ?.responsibilities
        ?.documentApprover,

      implementationProfile
        ?.responsibilities
        ?.highRiskApprover,

      implementationProfile
        ?.responsibilities
        ?.incidentOwner,

      implementationProfile
        ?.terminology
        ?.managers,

      implementationProfile
        ?.terminology
        ?.people

    ]
      .filter(Boolean)
      .map(normalise);


    const generatedRoles =
      Array.isArray(
        procedure.responsibilities
      )
        ? procedure.responsibilities
            .map(
              role =>
                normalise(
                  role.role
                )
            )
            .filter(Boolean)
        : [];


    const suspiciousRoles =
      generatedRoles.filter(
        role => {

          if (
            confirmedRoles.length === 0
          ) {
            return false;
          }

          return !confirmedRoles.some(
            confirmed =>
              role === confirmed ||
              role.includes(confirmed) ||
              confirmed.includes(role)
          );

        }
      );


    if (
      suspiciousRoles.length
    ) {

      addWarning(
        "role-consistency",
        "Generated roles not directly confirmed in the implementation profile: " +
        suspiciousRoles.join(", ") +
        "."
      );

    } else {

      addPass(
        "role-consistency",
        "Generated roles align with confirmed customer terminology and responsibilities."
      );

    }


    /*
     * ==========================================================
     * CHECK 7
     * GOVERNANCE STRUCTURE
     * ==========================================================
     */


    const selectedGovernance =
      systemConfig?.governance;


    if (!selectedGovernance) {

      addWarning(
        "governance",
        "No governance level was found in the customer configuration."
      );

    } else {

      const masterGovernance =
        riskManagementMaster
          .governanceRules[
            selectedGovernance
          ];


      if (!masterGovernance) {

        addFailure(
          "governance",
          `Unknown governance configuration: ${selectedGovernance}.`
        );

      } else {

        addPass(
          "governance",
          `Generated module is configured for the ${selectedGovernance} governance model.`
        );

      }

    }


    /*
     * ==========================================================
     * CHECK 8
     * STOP WORK APPLICABILITY
     * ==========================================================
     */


    const profileText =
      normalise(
        JSON.stringify(
          businessProfile || {}
        )
        +
        " "
        +
        JSON.stringify(
          implementationProfile || {}
        )
      );


    const operationalIndicators = [

      "field",
      "site work",
      "plant",
      "equipment",
      "manual handling",
      "working at heights",
      "traffic",
      "construction",
      "maintenance",
      "dangerous goods",
      "electrical"

    ];


    const operationalWorkDetected =
      operationalIndicators.some(
        term =>
          profileText.includes(
            normalise(term)
          )
      );


    const wholeProcedureText =
      normalise(
        JSON.stringify(
          procedure
        )
      );


    const stopWorkPresent =
      (
        wholeProcedureText.includes(
          "stop work"
        )
        ||
        wholeProcedureText.includes(
          "work must not commence"
        )
        ||
        wholeProcedureText.includes(
          "work must not continue"
        )
      );


    if (
      operationalWorkDetected &&
      !stopWorkPresent
    ) {

      addFailure(
        "stop-work",
        "Operational or physical work appears applicable, but stop-work requirements were not detected."
      );

    } else if (
      operationalWorkDetected &&
      stopWorkPresent
    ) {

      addPass(
        "stop-work",
        "Stop-work controls are present for an operational work context."
      );

    } else {

      addPass(
        "stop-work",
        "No clear operational-work trigger requiring additional stop-work content was detected."
      );

    }


    /*
     * ==========================================================
     * CHECK 9
     * RISK ACCEPTANCE SAFEGUARDS
     * ==========================================================
     */


    const acceptanceText =
      normalise(
        procedure
          .acceptanceAndEscalation
      );


    const acceptanceSafeguards = [

      {
        label:
          "Controls cannot be absent",

        terms: [
          "controls",
          "absent"
        ]
      },

      {
        label:
          "Ineffective controls cannot support acceptance",

        terms: [
          "ineffective"
        ]
      },

      {
        label:
          "Serious uncontrolled risk cannot be accepted",

        terms: [
          "serious",
          "uncontrolled"
        ]
      },

      {
        label:
          "Delegated authority is required",

        terms: [
          "delegated",
          "authority"
        ]
      }

    ];


    acceptanceSafeguards.forEach(
      safeguard => {

        const found =
          safeguard.terms.every(
            term =>
              acceptanceText.includes(
                normalise(term)
              )
          );


        if (!found) {

          addFailure(
            "risk-acceptance",
            `Risk acceptance safeguard may be missing: ${safeguard.label}.`
          );

        }

      }
    );


    if (
      failures.filter(
        item =>
          item.check ===
          "risk-acceptance"
      ).length === 0
    ) {

      addPass(
        "risk-acceptance",
        "Core risk acceptance safeguards are present."
      );

    }


    /*
     * ==========================================================
     * CHECK 10
     * SUSPICIOUS / UNCONFIRMED JURISDICTIONS
     * ==========================================================
     */


    const generatedText =
      normalise(
        JSON.stringify(
          generatedModule
        )
      );


    const customerText =
      normalise(
        JSON.stringify(
          businessProfile || {}
        )
        +
        " "
        +
        JSON.stringify(
          implementationProfile || {}
        )
      );


    const jurisdictions = [

      {
        name: "United Kingdom",
        terms: [
          "united kingdom",
          "uk jurisdiction",
          "uk law",
          "uk legislation"
        ]
      },

      {
        name: "Australia",
        terms: [
          "australia",
          "australian law",
          "australian legislation"
        ]
      },

      {
        name: "New Zealand",
        terms: [
          "new zealand",
          "nz law",
          "nz legislation"
        ]
      },

      {
        name: "United States",
        terms: [
          "united states",
          "us law",
          "us legislation"
        ]
      }

    ];


    jurisdictions.forEach(
      jurisdiction => {

        const appearsInGenerated =
          jurisdiction.terms.some(
            term =>
              generatedText.includes(
                normalise(term)
              )
          );


        const confirmedByCustomer =
          jurisdiction.terms.some(
            term =>
              customerText.includes(
                normalise(term)
              )
          );


        if (
          appearsInGenerated &&
          !confirmedByCustomer
        ) {

          addFailure(
            "fabricated-jurisdiction",
            `${jurisdiction.name} appears in the generated module but was not confirmed by the customer profile.`,
            "critical"
          );

        }

      }
    );


    if (
      failures.filter(
        item =>
          item.check ===
          "fabricated-jurisdiction"
      ).length === 0
    ) {

      addPass(
        "fabricated-jurisdiction",
        "No obvious unconfirmed jurisdiction was detected."
      );

    }


    /*
     * ==========================================================
     * FINAL RESULT
     * ==========================================================
     */


    const criticalFailures =
      failures.filter(
        item =>
          item.severity ===
          "critical"
      );


    const highFailures =
      failures.filter(
        item =>
          item.severity ===
          "high"
      );


    let status =
      "PASS";


    if (
      criticalFailures.length > 0
    ) {

      status =
        "FAIL";

    } else if (
      highFailures.length > 0
    ) {

      status =
        "REPAIR_REQUIRED";

    } else if (
      warnings.length > 0
    ) {

      status =
        "PASS_WITH_WARNINGS";

    }


    return res.status(200).json({

      success: true,

      validator: {
        name:
          "Tiwili Risk Management Validator",

        master:
          riskManagementMaster
            .metadata
            .id,

        masterVersion:
          riskManagementMaster
            .metadata
            .version,

        validatedAt:
          new Date()
            .toISOString()
      },

      result: {

        status,

        publishable:
          status === "PASS" ||
          status ===
            "PASS_WITH_WARNINGS",

        counts: {
          passed:
            passes.length,

          warnings:
            warnings.length,

          failures:
            failures.length,

          critical:
            criticalFailures.length
        }

      },

      passes,

      warnings,

      failures

    });


  } catch (error) {

    console.error(
      "Tiwili validation error:",
      error
    );


    return res.status(500).json({
      error:
        "Something went wrong while validating the Risk Management module."
    });

  }

};
