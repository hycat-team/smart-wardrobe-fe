// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const swaggerPath = 'd:/Project/smart-wardrobe/smart-wardrobe-be/docs/swagger.json';
const outputPath = 'd:/Project/smart-wardrobe/smart-wardrobe-fe/docs/ROUT.md';

try {
  const data = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  let markdown = '# Smart Wardrobe API Routes\n\n';
  
  const tags = {};
  
  for (const [path, methods] of Object.entries(data.paths || {})) {
    for (const [method, details] of Object.entries(methods)) {
      const tag = (details.tags && details.tags.length > 0) ? details.tags[0] : 'Uncategorized';
      if (!tags[tag]) tags[tag] = [];
      
      let params = [];
      let bodyRef = null;
      if (details.parameters) {
        details.parameters.forEach(p => {
          if (p.in === 'body') {
            bodyRef = p.schema && p.schema.$ref ? p.schema.$ref.split('/').pop() : 'object';
          } else {
            params.push(`${p.name} (${p.in}${p.required ? ', required' : ''})`);
          }
        });
      }
      
      let resSchema = null;
      if (details.responses && details.responses['200'] && details.responses['200'].schema) {
         if (details.responses['200'].schema.$ref) {
            resSchema = details.responses['200'].schema.$ref.split('/').pop();
         } else if (details.responses['200'].schema.allOf) {
            // try to find data ref
            details.responses['200'].schema.allOf.forEach(item => {
                if (item.properties && item.properties.data) {
                    if (item.properties.data.$ref) {
                        resSchema = item.properties.data.$ref.split('/').pop();
                    } else if (item.properties.data.items && item.properties.data.items.$ref) {
                        resSchema = item.properties.data.items.$ref.split('/').pop() + '[]';
                    }
                }
            })
         }
      }
      if (!resSchema && details.responses && details.responses['201'] && details.responses['201'].schema) {
         if (details.responses['201'].schema.allOf) {
            details.responses['201'].schema.allOf.forEach(item => {
                if (item.properties && item.properties.data) {
                    if (item.properties.data.$ref) {
                        resSchema = item.properties.data.$ref.split('/').pop();
                    }
                }
            })
         }
      }
      
      tags[tag].push({
        path,
        method: method.toUpperCase(),
        summary: details.summary || '',
        params: params.join(', '),
        body: bodyRef,
        resSchema: resSchema,
        description: details.description || ''
      });
    }
  }
  
  for (const [tag, endpoints] of Object.entries(tags)) {
    markdown += `## ${tag}\n\n`;
    markdown += '| Method | Endpoint | Summary | Req Body/Params | Response Schema |\n';
    markdown += '| --- | --- | --- | --- | --- |\n';
    for (const ep of endpoints) {
      let reqStr = [];
      if (ep.params) reqStr.push(`Params: ${ep.params}`);
      if (ep.body) reqStr.push(`Body: \`${ep.body}\``);
      markdown += `| **${ep.method}** | \`${ep.path}\` | ${ep.summary} | ${reqStr.join('<br>')} | ${ep.resSchema ? `\`${ep.resSchema}\`` : 'N/A'} |\n`;
    }
    markdown += '\n';
  }

  // extract definitions
  markdown += `\n## Definitions (Models)\n\n`;
  if (data.definitions) {
      for (const [defName, defDetails] of Object.entries(data.definitions)) {
          let shortName = defName.split('.').pop(); // e.g. smart-wardrobe-be_internal_modules_identity_application_dto.UserRes -> UserRes
          markdown += `### \`${shortName}\`\n\n`;
          markdown += `| Property | Type | Description |\n`;
          markdown += `| --- | --- | --- |\n`;
          if (defDetails.properties) {
              for (const [propName, propDetails] of Object.entries(defDetails.properties)) {
                  let type = propDetails.type || 'object';
                  if (propDetails.$ref) type = `ref: \`${propDetails.$ref.split('/').pop()}\``;
                  if (type === 'array' && propDetails.items) {
                      if (propDetails.items.$ref) type = `array of \`${propDetails.items.$ref.split('/').pop()}\``;
                      else if (propDetails.items.type) type = `array of ${propDetails.items.type}`;
                  }
                  markdown += `| **${propName}** | ${type} | ${propDetails.description || ''} |\n`;
              }
          }
          markdown += '\n';
      }
  }
  
  fs.writeFileSync(outputPath, markdown);
  console.log(`Successfully generated ROUT.md at ${outputPath}`);
} catch (e) {
  console.error('Error:', e);
}
