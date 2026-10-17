import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';
import { apiRouter } from '../api/router.js';
import { writeFile } from 'node:fs/promises';

new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
})
    .generate(apiRouter)
    .then((spec) =>
        writeFile('openapi.json', JSON.stringify(spec, null, 4), 'utf-8'),
    )
    .then(() => console.log('OpenAPI spec written to openapi.json'))
    .catch(console.error);
