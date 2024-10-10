
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
    "Inventory": "InventoryEntry",
    "Login": "customerSignUp",
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
    "ShippingMethods": "ShippingMethod",
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

const exampleFileEndpoint = {
    "ApiClients": "api-client",
    "AssociateRoles": "associate-role",
    "AttributeGroups": "attribute-group",
    "BusinessUnits": "business-unit",
    "CartDiscounts": "cart-discount",
    "Carts": "cart",
    "CartsReplicate": "cart-replicate",
    "Categories": "category",
    "Channels": "channel",
    "CustomObjects": "custom-object",
    "CustomerGroups": "customer-group",
    "Customers": "customer",
    "DiscountCodes": "discount-code",
    "Extensions": "extension",
    "Inventory": "inventory",
    "Login": "login",
    "Messages": "message",
    "Orders": "order",
    "OrdersEdits": "order-edits",
    "OrdersImport": "order-import",
    "Payments": "payment",
    "ProductDiscounts": "product-discount",
    "ProductProjections": "product-projection",
    "ProductSelections": "product-selection",
    "ProductTailoringList": "product-tailoring",
    "ProductTailoring": "product-tailoring",
    "ProductTypes": "product-type",
    "Products": "product",
    "QuoteRequests": "quote-request",
    "Quotes": "quote",
    "Reviews": "review",
    "ShippingMethods": "shipping-method",
    "ShoppingLists": "shopping-list",
    "StagedQuotes": "staged-quote",
    "StandalonePrices": "standalone-price",
    "States": "state",
    "Stores": "store",
    "Subscriptions": "subscription",
    "TaxCategories": "tax-category",
    "TypeDefinitions": "type",
    "Zones": "zone"
};

function lowerCaseFirstLetter(stringValue) {
    return stringValue.charAt(0).toLowerCase() + stringValue.slice(1);
}

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


    /* try {
         if (fs.existsSync("graphql-files")) {
             //fs.rmSync("graphql-files", { recursive: true, force: true });
         }
 
         fs.mkdirSync("graphql-files");
     } catch (err) {
         console.error(err);
     }*/


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

// TODO: Uncomment out this function to process the files again. It is disabled as I'm now doing it manually.
// Step 3: Call the function with the file path to the OAS YAML
loadOASYaml('../commercetools-api-reference/oas/api/openapi.yaml');

/**
 * 
 * @param {string} operationId 
 */
function CreateFile(operationId) {

    if (operationId.startsWith("ByProjectKeyInStoreKeyByStoreKey")) {
        console.log(operationId)


        try {
            let graphQLFile = fs.readFileSync(`graphql-files/validated/ByProjectKey${operationId.split("ByProjectKeyInStoreKeyByStoreKey")[1]}.graphql`, 'utf8');

            console.log(graphQLFile)

            /*if (operationId.split("ByProjectKeyInStoreKeyByStoreKey")[1].includes("Post")) {

                if (graphQLFile.includes(") {")) {
                    graphQLFile = graphQLFile.replace(") {", `, storeKey: "{storeKey}" ) {`)
                    fs.writeFileSync("graphql-files/" + operationId + ".graphql", graphQLFile)
            }

            }*/

        } catch (e) {
            console.error(e)
            //console.error(`Nothing exists in validated for: ByProjectKey${operationId.split("ByProjectKeyInStoreKeyByStoreKey")[1]}.graphql`)
        }


        /*

        const processedIds = operationId.split("ByProjectKeyInStoreKeyByStoreKey")[1];

        let graphqlQuery = "";//processedIds[1].endsWith("Post") ? "mutation {" : "query {";

        // Do not create a query for Checking Project Exists
        if (processedIds[1] != "Head") {

            graphqlQuery += processInStoreStuff(processedIds)

            fs.writeFileSync("graphql-files/" + operationId + ".graphql", graphqlQuery)

        }*/
    }
}

function processInStoreStuff(processedIds) {
    let inStoreProcessedIds = processedIds;
    let graphqlQuery = "";

    if (inStoreProcessedIds.startsWith("Me")) {
        // TODO: Me endpoint stuff
        //graphqlQuery += processMeEndpoints(inStoreProcessedIds, true)
    }
    else {

        let keyOrID = processedIds[1].includes("ByID") ? `id: "{id}"` : `key: "{key}"`;

        console.log(processedIds)
        if (processedIds[1].includes("KeyByKey") || processedIds[1].includes("ByID")) {
            const endpointAndMethod = processedIds[1].includes("ByID") ? processedIds[1].split("ByID") : processedIds[1].split("KeyByKey");


            let endpointName = endpointAndMethod[0];
            if (endpointName === "ProductTailoring") { endpointName = "ProductTailoringList"; }
            if (endpointName === "Types") { endpointName = "TypeDefinitions"; }

            let updateActionName = "setKey";
            if (endpointName === "TypeDefinitions" || endpointName === "Channel" || endpointName === "State") {
                updateActionName = "changeKey";
            }

            // Updating a resource
            if (endpointAndMethod[1] === "Post") {

                graphqlQuery += `${jsonToGraphQLMutation(JSON.parse(getContentOfExampleFile(exampleFileEndpoint[endpointName], "update")), `update${singularEndpoint[endpointName]}`, keyOrID)}`
            }

            // Deleting a resource
            if (endpointAndMethod[1] === "Delete") {

                graphqlQuery += `mutation{
                            delete${singularEndpoint[endpointName]}(
                            inStore(key:"{storeKey}"
                                ${keyOrID}
                                ${includeVersion ? "version: 1" : ""}                          
                            )
                            {
                                id
                                ${includeVersion ? "version" : ""}        
                                #...
                            }
                        }`;
            }

            // Checking existence of a resource
            if (endpointAndMethod[1] === "Head") {

                let addContainerToCustomObject = lowerCaseFirstLetter(singularEndpoint[endpointName]) === "customObjects" ? `container:"{container}"` : ""

                graphqlQuery += `${queryText}
                                ${lowerCaseFirstLetter(endpointName)}( ${addContainerToCustomObject}
                                where:${processedIds[1].includes("ByID") ? '"id=\\\"{id}\\\""' : '"key=\\\"{key}\\\""'}){
                                    exists`
                if (displayClosingBracket) { graphqlQuery += "}" }
                graphqlQuery += `}`;
            }

            // Quering a resource
            if (endpointAndMethod[1] === "Get") {


                let addContainerToCustomObject = lowerCaseFirstLetter(singularEndpoint[endpointName]) === "customObjects" ? `container:"{container}"` : ""


                graphqlQuery += `${queryText}
                                ${lowerCaseFirstLetter(singularEndpoint[endpointName])}(${addContainerToCustomObject}
                                ${keyOrID}){
                                    id

                                ${includeVersion ? "version" : ""}     
                                    createdAt
                                    #...
                                    `

                if (displayClosingBracket) { graphqlQuery += "}" }
                graphqlQuery += `}`;
            }

        }
        else {
            let endpointName = "";

            // Get all resources
            if (processedIds[1].split("Get").length === 2) {

                endpointName = lowerCaseFirstLetter(processedIds[1].split("Get")[0]);
                //console.log(endpointName)
                if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
                if (endpointName === "types") { endpointName = "typeDefinitions"; }
                if (endpointName === "inventory") { endpointName = "inventoryEntries"; }


                let addContainerToCustomObject = endpointName === "customObjects" ? `(container:"{container}")` : ""

                if (queryText != "") {
                    graphqlQuery += `query${addContainerToCustomObject}{\n`
                }

                graphqlQuery += `${endpointName}{
                                    offset
                                    count
                                    total
                                    results{
                                    id
                                    ${includeVersion ? "version" : ""}     
                                    createdAt
                                    #...
                                    }`

                if (displayClosingBracket) { graphqlQuery += "}" }
                graphqlQuery += `}`;
            }

            // Check existence using query predicate
            if (processedIds[1].split("Head").length === 2) {

                endpointName = lowerCaseFirstLetter(processedIds[1].split("Head")[0]);
                //console.log(endpointName)
                if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
                if (endpointName === "types") { endpointName = "typeDefinitions"; }
                if (endpointName === "inventory") { endpointName = "inventoryEntries"; }


                let addContainerToCustomObject = endpointName === "customObjects" ? ` container:"{container}"` : ""

                graphqlQuery += `
                                ${endpointName}(where:"id=\\\"{id}\\\""${addContainerToCustomObject}){
                                    exists
                                }
                            
                        `;
            }

            // Create a resource
            if (processedIds[1].split("Post").length === 2) {

                //console.log(processedIds[1])
                endpointName = processedIds[1].split("Post")[0];
                if (!["", "Graphql", "LoginPost", "OrdersOrderNumberByOrderNumber", "ProductProjectionsSearch", "ProductsSearch"].includes(endpointName)) {

                    if (endpointName === "Types") { endpointName = "TypeDefinitions"; }

                    console.log(endpointName)


                    //console.log(processedIds[1].split("Post")[0])
                    //console.log(endpointName)

                    graphqlQuery += `${jsonToGraphQLMutation(JSON.parse(getContentOfExampleFile(exampleFileEndpoint[endpointName], "create")), `create${singularEndpoint[endpointName]}`)}`
                }
            }
        }
        return graphqlQuery;


        // Special case for posting, deleting
        if (inStoreProcessedIds[1].endsWith("Post")) {

        }
        else if (inStoreProcessedIds[1].endsWith("Delete")) {


            graphqlQuery += `mutation{
                delete${singularEndpoint[endpointName]}(
                inStore(key:"{storeKey}"
                    ${keyOrID}
                    ${includeVersion ? "version: 1" : ""}                          
                )
                {
                    id
                    ${includeVersion ? "version" : ""}        
                    #...
                }
            }`;
        }
        else {
            graphqlQuery += `query{
            inStore(key:"{storeKey}"){
            //${processStuff(inStoreProcessedIds, true)}
            }
            }`
        }
    }

    return graphqlQuery;
}

function processStuff(processedIds, isInStore, isMeEndpoint) {
    let graphqlQuery = "";
    let queryText = isInStore === true ? "" : "query {";
    if (isMeEndpoint === true) { queryText = ""; }
    let addStoreKey = isInStore === true ? '\nstoreKey:"{storeKey}"' : ""

    if (isMeEndpoint) { queryText = ""; }
    console.log("QUERYTEXT: " + queryText)

    let displayClosingBracket = true;
    if (isInStore === true) { displayClosingBracket = false; }
    if (isMeEndpoint === true) { displayClosingBracket = false; }
    //const meEndpointText = isMeEndpoint === true ? "" : "\nme {";

    //console.log("QUERYTEXT: " + queryText)
    let keyOrID = processedIds[1].includes("ByID") ? `id: "{id}"` : `key: "{key}"`;

    const includeVersion = processedIds[1].startsWith("ApiClients") ? false : true;

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

        // Updating a resource
        if (endpointAndMethod[1] === "Post") {

            graphqlQuery += `${jsonToGraphQLMutation(JSON.parse(getContentOfExampleFile(exampleFileEndpoint[endpointName], "update")), `update${singularEndpoint[endpointName]}`, keyOrID)}`
        }

        // Deleting a resource
        if (endpointAndMethod[1] === "Delete") {

            graphqlQuery += `mutation{
                            delete${singularEndpoint[endpointName]}(${addStoreKey}
                                ${keyOrID}
                                ${includeVersion ? "version: 1" : ""}                          
                            )
                            {
                                id
                                ${includeVersion ? "version" : ""}        
                                #...
                            }
                        }`;
        }

        // Checking existence of a resource
        if (endpointAndMethod[1] === "Head") {

            let addContainerToCustomObject = lowerCaseFirstLetter(singularEndpoint[endpointName]) === "customObjects" ? `container:"{container}"` : ""

            graphqlQuery += `${queryText}
                                ${lowerCaseFirstLetter(endpointName)}( ${addContainerToCustomObject}
                                where:${processedIds[1].includes("ByID") ? '"id=\\\"{id}\\\""' : '"key=\\\"{key}\\\""'}){
                                    exists`
            if (displayClosingBracket) { graphqlQuery += "}" }
            graphqlQuery += `}`;
        }

        // Quering a resource
        if (endpointAndMethod[1] === "Get") {


            let addContainerToCustomObject = lowerCaseFirstLetter(singularEndpoint[endpointName]) === "customObjects" ? `container:"{container}"` : ""


            graphqlQuery += `${queryText}
                                ${lowerCaseFirstLetter(singularEndpoint[endpointName])}(${addContainerToCustomObject}
                                ${keyOrID}){
                                    id

                                ${includeVersion ? "version" : ""}     
                                    createdAt
                                    #...
                                    `

            if (displayClosingBracket) { graphqlQuery += "}" }
            graphqlQuery += `}`;
        }

    }
    else {
        let endpointName = "";

        // Get all resources
        if (processedIds[1].split("Get").length === 2) {

            endpointName = lowerCaseFirstLetter(processedIds[1].split("Get")[0]);
            //console.log(endpointName)
            if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
            if (endpointName === "types") { endpointName = "typeDefinitions"; }
            if (endpointName === "inventory") { endpointName = "inventoryEntries"; }


            let addContainerToCustomObject = endpointName === "customObjects" ? `(container:"{container}")` : ""

            if (queryText != "") {
                graphqlQuery += `query${addContainerToCustomObject}{\n`
            }

            graphqlQuery += `${endpointName}{
                                    offset
                                    count
                                    total
                                    results{
                                    id
                                    ${includeVersion ? "version" : ""}     
                                    createdAt
                                    #...
                                    }`

            if (displayClosingBracket) { graphqlQuery += "}" }
            graphqlQuery += `}`;
        }

        // Check existence using query predicate
        if (processedIds[1].split("Head").length === 2) {

            endpointName = lowerCaseFirstLetter(processedIds[1].split("Head")[0]);
            //console.log(endpointName)
            if (endpointName === "productTailoring") { endpointName = "productTailoringList"; }
            if (endpointName === "types") { endpointName = "typeDefinitions"; }
            if (endpointName === "inventory") { endpointName = "inventoryEntries"; }


            let addContainerToCustomObject = endpointName === "customObjects" ? ` container:"{container}"` : ""

            graphqlQuery += `query{
                                ${endpointName}(where:"id=\\\"{id}\\\""${addContainerToCustomObject}){
                                    exists
                                }
                            
                        }`;
        }

        // Create a resource
        if (processedIds[1].split("Post").length === 2) {

            //console.log(processedIds[1])
            endpointName = processedIds[1].split("Post")[0];
            if (!["", "Graphql", "LoginPost", "OrdersOrderNumberByOrderNumber", "ProductProjectionsSearch", "ProductsSearch"].includes(endpointName)) {

                if (endpointName === "Types") { endpointName = "TypeDefinitions"; }

                console.log(endpointName)


                //console.log(processedIds[1].split("Post")[0])
                //console.log(endpointName)

                graphqlQuery += `${jsonToGraphQLMutation(JSON.parse(getContentOfExampleFile(exampleFileEndpoint[endpointName], "create")), `create${singularEndpoint[endpointName]}`)}`
            }
        }
    }
    return graphqlQuery;
}


function getContentOfExampleFile(endpoint, createOrUpdate) {

    console.log("Endpoint: " + endpoint)

    let processedFilename = `${endpoint}-${createOrUpdate}.example`;

    if (endpoint === "cart-replicate") { processedFilename = endpoint + ".example" }
    if (endpoint === "order-import") { processedFilename = endpoint + ".example" }
    if (endpoint === "login") { processedFilename = "Customer/CustomerSignIn" }


    try {
        const fileContents = fs.readFileSync(`../commercetools-api-reference/api-specs/api/examples/${processedFilename}.json`, 'utf8');
        //console.log(fileContents);
        return fileContents;
    } catch (e) {
        console.error(e);
        return "{}";
    }
}

function jsonToGraphQLMutation(json, mutationName, updateKeyOrId, isInStore, isMeEndpoint, isAssociate) {

    let version = 1;
    let addStoreKey = isInStore ? '\nstoreKey:"{storeKey}"' : "";
    // Helper function to recursively build the mutation input

    const buildInputFields = (obj) => {
        let fields = Object.keys(obj).map(key => {
            let value = obj[key];

            // Handle nested objects recursively
            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {

                // Special case for localized strings
                if (value["en"]) {
                    return `${key}: [{ locale:"en" value: "${value["en"]}" } ]`
                }
                else {
                    return `${key}: {\n ${buildInputFields(value)} \n}`;
                }
            } else if (Array.isArray(value)) {
                // Check if the array contains objects or primitives
                const arrayValues = value.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        // Recursively process objects in the array
                        return `{\n ${buildInputFields(item)} \n}`;
                    } else if (typeof item === 'string') {
                        // Wrap strings in quotes
                        return `"${item}"`;
                    } else {
                        // Numbers, booleans, etc., don't need quotes
                        return item;
                    }
                });
                return `${key}: [\n${arrayValues.join(', ')}\n]`;
            } else if (typeof value === 'string') {
                if (updateKeyOrId && key === "action") {
                    return value + ": {"
                }
                return `${key}: "${value}"`;  // Wrap strings in quotes
            } else {
                if (updateKeyOrId && key === "version") {
                    version = value;
                    return ""
                }
                else {
                    if (key === "w") {
                        return `width: ${value}`
                    }
                    if (key === "h") {
                        return `height: ${value}`
                    }
                    // Numbers, booleans, etc., don't need quotes
                    return `${key}: ${value}`;    // Leave numbers, booleans, etc., as is
                }

            }

        });

        fields = fields.filter(str => str !== "");
        return fields.join('\n');
    };


    // Create mutation string with input fields and return fields

    if (updateKeyOrId) {

        let values = buildInputFields(json);
        const lastIndex = values.lastIndexOf("]");
        if (lastIndex !== -1) {
            // Replace the last occurrence of "]" with "}]"
            values = values.slice(0, lastIndex) + "}]" + values.slice(lastIndex + 1);
        }

        return `mutation {
            ${mutationName}(${addStoreKey}
                version: ${version}
                ${updateKeyOrId}                
                ${values}                
            ){
                id
                version
                lastModifiedAt
                #...
            }
        }`;

    }
    else {



        return `mutation {
    ${mutationName}(${addStoreKey}
        draft: {
      ${buildInputFields(json)}
    }) {
      id${mutationName === "createApiClient" ? "" : "\nversion"}
      createdAt
      #...
    }
  }`;
    }
}