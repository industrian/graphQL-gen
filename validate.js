// Importing required modules using ES module syntax
import { buildSchema, parse, validate } from 'graphql';
import fs from 'fs';
import path from 'path';

// 1. Load the schema SDL from a file
const schemaSDL = fs.readFileSync(path.join(path.resolve(), '../commercetools-api-reference/api-specs/graphql/schema.sdl'), 'utf-8');

// 2. Build the schema object from SDL
const schema = buildSchema(schemaSDL);

// 3. Define the folder where your GraphQL files are located
const graphqlFolder = path.join(path.resolve(), 'graphql-files');

// 4. Function to load and validate all GraphQL files in a folder
function validateGraphQLFiles(folderPath) {
    // Get all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter only .graphql files
    const graphqlFiles = files.filter(file => file.endsWith('.graphql'));

    // Iterate over each .graphql file and validate
    graphqlFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        const query = fs.readFileSync(filePath, 'utf-8');
        try {
            // Parse the GraphQL query
            const ast = parse(query);

            // Validate the query against the schema
            const errors = validate(schema, ast);

            if (errors.length > 0) {
                console.error(`Validation errors in ${file}:`);
                errors.forEach(err => console.error(err.message));
            } else {
                console.log(`${file} is valid!`);
            }
        } catch (err) {
            console.error(`Error parsing ${file}:`, err.message);
        }
    });
}


// 5. Validate all GraphQL files in the specified folder
validateGraphQLFiles(graphqlFolder);
