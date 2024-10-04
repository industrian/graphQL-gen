
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

                if (operation.operationId){

                // Do stuff here

                CreateFile(operation.operationId);

                console.log(processedId)

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
function CreateFile(operationId){

    /*try {
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }
    } catch (err) {
        console.error(err);
    }*/

    
    const processedId = operationId.split("ByProjectKey")[1];

    fs.writeFileSync("graphql-files/" + operationId+".graphql",processedId)

    
}

