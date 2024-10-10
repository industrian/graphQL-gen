// Importing required modules using ES module syntax
import { buildSchema, parse, validate } from 'graphql';
import fs from 'fs';
import path from 'path';

let rerunValidation = false;

// 1. Load the schema SDL from a file
const schemaSDL = fs.readFileSync(path.join(path.resolve(), '../commercetools-api-reference/api-specs/graphql/schema.sdl'), 'utf-8');

// 2. Build the schema object from SDL
const schema = buildSchema(schemaSDL);

// 3. Define the folder where your GraphQL files are located
const graphqlFolder = path.join(path.resolve(), 'graphql-files');
const validatedFolder = path.join(path.resolve(), 'graphql-files/validated');
const impossibleFolder = path.join(path.resolve(), 'graphql-files/impossible');

// 4. Function to load and validate all GraphQL files in a folder
function validateGraphQLFiles(folderPath) {
    let totalNumberOfFiles = 0;
    let invalidFiles = 0;
    // Get all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter only .graphql files
    const graphqlFiles = files.filter(file => file.endsWith('.graphql'));

    // Iterate over each .graphql file and validate
    graphqlFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        const query = fs.readFileSync(filePath, 'utf-8');
        totalNumberOfFiles++;
        try {
            // Parse the GraphQL query
            const ast = parse(query);

            // Validate the query against the schema
            const errors = validate(schema, ast);

            if (errors.length > 0) {
                console.error(`Validation errors in ${file}:`);
                errors.forEach(
                    err => {
                        //console.error(err.message)

                        invalidFiles++;
                        // Replace enum values
                        if (err.message.includes("cannot represent non-enum value")) {
                            //console.log("Fixing enum")

                            let field = err.message.match(/Enum "([^"]*)"/)[1];
                            //console.log(field)

                            let value = err.message.match(/cannot represent non-enum value: "([^"]*)"/)[1];
                            //console.log(value)

                            let updatedQuery = query.replace(`: "${value}"`, `: ${value}`)
                            updatedQuery = updatedQuery.replace(`, "${value}"`, `, ${value}`)
                            updatedQuery = updatedQuery.replace(`"${value}", `, `${value}, `)
                            //console.log(updatedQuery)

                            fs.writeFileSync("graphql-files/" + file, updatedQuery)

                            //rerunValidation = true;
                        }
                    }
                );


                invalidFiles++;
            } else {
                // console.log(`${file} is valid!`);
                try {
                    fs.copyFileSync(graphqlFolder + "/" + file, validatedFolder + "/" + file);
                    console.log('Validated file copied successfully');

                    fs.unlinkSync(graphqlFolder + "/" + file);
                    console.log('Validated source file deleted successfully');
                } catch (err) {
                    console.error('Error copying file:', err);
                }



            }
        } catch (err) {
            if (err.message.includes('Unexpected Name "impossible"')) {
              /*  try {
                    fs.copyFileSync(graphqlFolder + "/" + file, impossibleFolder + "/" + file);
                    console.log('Impossible function file copied successfully');

                    fs.unlinkSync(graphqlFolder + "/" + file);
                    console.log('Impossible function file deleted successfully');
                } catch (err) {
                    console.error('Error copying file:', err);
                }*/
            }
        }
    });

    console.log(`${invalidFiles}/${totalNumberOfFiles} were invalid.`)
}


// 5. Validate all GraphQL files in the specified folder
validateGraphQLFiles(graphqlFolder);

if (rerunValidation) {
    rerunValidation = false;
    validateGraphQLFiles(graphqlFolder);
}

