
import fs from 'fs';
import yaml from 'js-yaml'

const singularEndpoint = {
    "ApiClients": "ApiClient",
    "AssociateRoles": "AssociateRole",
    "AttributeGroups": "AttributeGroup",
    "BusinessUnits": "BusinessUnit",
    "CartDiscounts": "CartDiscount",
    "Carts": "Cart",
    "Categories": "Category",
    "Channels": "Channel",
    "CustomObjects": "CustomObject",
    "CustomerGroups": "CustomerGroup",
    "Customers": "Customer",
    "DiscountCodes": "DiscountCode",
    "Extensions": "Extension",
    "Inventory": "Inventory",
    "Messages": "Message",
    "Orders": "Order",
    "OrdersEdits": "OrderEdit",
    "Payments": "Payment",
    "ProductDiscounts": "ProductDiscount",
    "ProductProjections": "ProductProjection",
    "ProductSelections": "ProductSelection",
    "ProductTailoringList": "ProductTailoring",
    "ProductTypes": "ProductType",
    "Products": "Product",
    "QuoteRequests": "QuoteRequest",
    "Quotes": "Quote",
    "Reviews": "Review",
    "ShippingMethods": "ShippingMethid",
    "ShoppingLists": "ShoppingList",
    "StagedQuotes": "StagedQuote",
    "StandalonePrices": "StandalonePrice",
    "States": "State",
    "Stores": "Store",
    "Subscriptions": "Subscription",
    "TaxCategories": "TaxCategory",
    "TypeDefinitions": "TypeDefinition",
    "Zones": "Zone"
};

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

    let graphqlQuery = "";//processedIds[1].endsWith("Post") ? "mutation {" : "query {";



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

        if (processedIds[1].includes("AsAssociate")) {
            // TODO: AsAssociate stuff
        }
        else {
            if (processedIds[1].includes("InStore")) {
                // TODO: InStore stuff
            }
            else {
                if (processedIds[1].startsWith("Me")) {
                    // TODO: Me endpoint stuff
                }
                else {
                    let keyOrID = processedIds[1].includes("ByID") ? `id: "{id}"` : `key: "{key}"`;

                    // Calling an individual resource
                    if (processedIds[1].includes("KeyByKey") || processedIds[1].includes("ByID")) {
                        const endpointAndMethod = processedIds[1].includes("ByID") ? processedIds[1].split("ByID") : processedIds[1].split("KeyByKey");


                        let endpointName = endpointAndMethod[0];
                        if (endpointName === "ProductTailoring") { endpointName = "ProductTailoringList"; }
                        if (endpointName === "Types") { endpointName = "TypeDefinitions"; }

                        let updateActionName = "setKey";
                        if (endpointName === "TypeDefinitions" || endpointName === "Channel" || endpointName === "State") {
                            updateActionName = "changeKey";
                        }


                        if (endpointAndMethod[1] === "Post") {

                            graphqlQuery += `mutation{
                            update${singularEndpoint[endpointName]}(
                                ${keyOrID}
                                version: 1
                                actions:[
                                    {
                                        ${updateActionName}:{
                                            key: "new-key"
                                        }
                                    }
                                ]
                            )
                            {
                                id
                                version
                                name
                            }
                        }`;
                        }

                        if (endpointAndMethod[1] === "Delete") {

                            graphqlQuery += `mutation{
                            delete${singularEndpoint[endpointName]}(
                                ${keyOrID}
                                version: 1                                
                            )
                            {
                                id
                                version
                                name
                            }
                        }`;
                        }

                        if (endpointAndMethod[1] === "Head") {

                            graphqlQuery += `query{
                                ${lowerCaseFirstLetter(endpointName)}(where:${processedIds[1].includes("ByID") ? '"id=\\\"{id}\\\""' : '"key=\\\"{key}\\\""'}){
                                    exists
                                }
                            }`;
                        }

                        if (endpointAndMethod[1] === "Get") {

                            graphqlQuery += `query{
                                ${lowerCaseFirstLetter(singularEndpoint[endpointName])}(${keyOrID}){
                                    id
                                    version
                                    createdAt
                                    #...
                                }
                                }`;
                        }

                    }
                    else {
                        let endpointName = "";

                        if (processedIds[1].split("Get").length === 2) {

                            endpointName = lowerCaseFirstLetter(processedIds[1].split("Get")[0]);
                            //console.log(endpointName)
                            if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
                            if (endpointName === "types") { endpointName = "typeDefinitions"; }

                            graphqlQuery += `query{
                                ${endpointName}{
                                    offset
                                    count
                                    total
                                    results{
                                    id
                                    version
                                    createdAt
                                    #...
                                    }
                                }
                            }`;
                        }

                        if (processedIds[1].split("Head").length === 2) {


                            endpointName = lowerCaseFirstLetter(processedIds[1].split("Head")[0]);
                            //console.log(endpointName)
                            if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
                            if (endpointName === "types") { endpointName = "typeDefinitions"; }

                            graphqlQuery += `query{
                                ${endpointName}(where:"id=\\\"{id}\\\""){
                                    exists
                                }
                            
                        }`;
                        }
                    }


                    // Normal endpoints


                    // By Key
                }
            }
        }

        //graphqlQuery += "}";

        fs.writeFileSync("graphql-files/" + operationId + ".graphql", graphqlQuery)

    }
}


function lowerCaseFirstLetter(stringValue) {
    return stringValue.charAt(0).toLowerCase() + stringValue.slice(1);
}

