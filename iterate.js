
import fs from 'fs';
import yaml from 'js-yaml'

// Step 1: Load the OAS YAML file
function loadOASYaml(filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const oasDocument = yaml.load(fileContents);

        // Step 2: Iterate through the OAS content
        iterateOAS(oasDocument);
    } catch (e) {
        console.error(e);
    }
}

// Step 2: Function to iterate through OAS content
function iterateOAS(oasDocument) {


    try {
        if (fs.existsSync("graphql-files")) {
            fs.rmSync("graphql-files", { recursive: true, force: true });
        }

        fs.mkdirSync("graphql-files");
    } catch (err) {
        console.error(err);
    }


    // Example: Iterate over paths
    if (oasDocument.paths) {
        //console.log('API Paths:');
        for (const path in oasDocument.paths) {
            //console.log(`Path: ${path}`);
            const methods = oasDocument.paths[path];
            for (const method in methods) {
                //console.log(`  Method: ${method}`);
                // Accessing operation details (e.g., summary, responses)
                const operation = methods[method]

                if (operation.operationId) {

                    // Do stuff here

                    CreateFile(operation.operationId);

                    //console.log(processedId)

                }
                //console.log(`    Summary: ${operation.summary || 'No summary'}`);
                //console.log(`    Responses:`);
                for (const statusCode in operation.responses) {
                    // console.log(`      Status Code: ${statusCode}`);
                }
            }
        }
    }

    // Example: Iterate over components (schemas)
    if (oasDocument.components && oasDocument.components.schemas) {
        //console.log('\nSchemas:');
        for (const schemaName in oasDocument.components.schemas) {
            //    console.log(`Schema: ${schemaName}`);
        }
    }
}

// Step 3: Call the function with the file path to the OAS YAML
loadOASYaml('../commercetools-api-reference/oas/api/openapi.yaml');

/**
 * 
 * @param {string} operationId 
 */
function CreateFile(operationId) {

    const processedIds = operationId.split("ByProjectKey");

    let graphqlQuery = processedIds[1].endsWith("Post") ? "mutation {" : "query {";



    // Do not create a query for Checking Project Exists
    if (processedIds[1] != "Head") {

        // Special case for getting a Project
        if (processedIds[1] === "Get") {
            graphqlQuery = `query{
  project{
    version
    key
    name
    countries
    currencies
    #...
  }
`;
        }

        // Special case for updating a Project
        if (processedIds[1] === "Post") {
            graphqlQuery = `mutation{
  updateProject(
    version:1
    actions:[
      {
        changeCurrencies:{
          currencies:["EUR","USD"]
        }
      }
    ]
  ){
    version
    key
    name
    countries
    currencies
    #...
  }
`;
        }

        graphqlQuery += "}";

        fs.writeFileSync("graphql-files/" + operationId + ".graphql", graphqlQuery)

    }
}

