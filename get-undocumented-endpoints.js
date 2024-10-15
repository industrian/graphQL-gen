// This returns an array of request examples which do not currently have a GraphQL example.
// This could feasibly be used to autogenerate a list of requests which are currently not supported.

import fs from "fs";
import yaml from "js-yaml";

const pathToGraphQLExamples = "graphql-files/validated";
const pathToOASYAML = "../commercetools-api-reference/oas/api/openapi.yaml";

// Stores all potential endpoints
let endpoints = [];

// Stores the endpoints with no examples.
let endpointsWithNoExamples = [];

loadOASYaml(pathToOASYAML);

// Step 1: Load the OAS YAML file from API reference
function loadOASYaml(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const oasDocument = yaml.load(fileContents);

    // Step 2: Iterate through the OAS content
    iterateOAS(oasDocument);
  } catch (e) {
    console.error(e);
  }
}

// Step 2: Function to iterate through OAS content, putting all endpoint names in an array
function iterateOAS(oasDocument) {
  // Example: Iterate over paths
  if (oasDocument.paths) {
    for (const path in oasDocument.paths) {
      const methods = oasDocument.paths[path];
      for (const method in methods) {
        const operation = methods[method];

        if (operation.operationId) {
          //console.log(operation.operationId)
          endpoints.push(operation.operationId + ".graphql");
        }
      }
    }
  }

  checkIfEndpointDocumented();
}

function checkIfEndpointDocumented() {
  endpoints.forEach((endpoint) => {
    if (!fs.existsSync(`${pathToGraphQLExamples}/${endpoint}`)) {
      endpointsWithNoExamples.push(endpoint.split(".graphql")[0]);
    }
  });
}

console.log(endpointsWithNoExamples);

// TODO: Use the content of endpointsWithNoExamples to autogenerate a Markdown list of unsupported GraphQL calls.
// This list could be included in the GraphQL docs, and updated whenever a new GraphQL example is added.
