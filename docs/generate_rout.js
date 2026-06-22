const fs = require('fs');

const swaggerPath = 'C:/FPT/Project/smart-wardrobe/smart-wardrobe-be/docs/swagger.json';
const outputPath = 'C:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/docs/ROUT.md';

try {
  const data = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  let markdown = '# Smart Wardrobe API Routes\n\n';
  markdown += 'This document is auto-generated from `swagger.json` to provide comprehensive details about API requests and responses.\n\n';

  const tags = {};

  // Group by tags
  for (const [path, methods] of Object.entries(data.paths || {})) {
    for (const [method, details] of Object.entries(methods)) {
      const tag = (details.tags && details.tags.length > 0) ? details.tags[0] : 'Uncategorized';
      if (!tags[tag]) tags[tag] = [];
      tags[tag].push({ path, method: method.toUpperCase(), details });
    }
  }

  function getAnchorId(name) {
    return name.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
  }

  // Helper to format schema type
  function formatSchemaType(schema) {
    if (!schema) return 'any';
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop();
      const shortName = refName.split('.').pop();
      return `[${shortName}](#${getAnchorId(refName)})`;
    }
    if (schema.type === 'array' && schema.items) {
      return `Array<${formatSchemaType(schema.items)}>`;
    }
    return schema.type || 'object';
  }

  function formatSchemaTree(schema, depth = 0, visited = new Set()) {
    if (depth > 1) return ''; // limit depth
    if (!schema) return '';
    let res = '';
    const indent = '  '.repeat(depth + 2); // Adjust indent based on markdown list nesting
    
    if (schema.$ref) {
      if (visited.has(schema.$ref)) return '';
      visited.add(schema.$ref);
      const refName = schema.$ref.split('/').pop();
      const def = data.definitions[refName];
      if (def && def.properties) {
        for (const [key, prop] of Object.entries(def.properties)) {
           let type = prop.type || 'object';
           if (prop.$ref) type = `ref: ${prop.$ref.split('/').pop().split('.').pop()}`;
           if (prop.type === 'array' && prop.items) {
             if (prop.items.$ref) type = `Array<${prop.items.$ref.split('/').pop().split('.').pop()}>`;
             else type = `Array<${prop.items.type}>`;
           }
           let reqMark = (def.required && def.required.includes(key)) ? ' **(Required)**' : '';
           let desc = prop.description ? ' - ' + prop.description.replace(/\n/g, ' ') : '';
           res += `${indent}- \`${key}\` (${type})${reqMark}${desc}\n`;
        }
      } else if (def && def.allOf) {
         res += `${indent}- *(Complex composed object)*\n`;
      } else if (def && def.enum) {
         const vals = def.enum.map((e, i) => {
             return def['x-enum-varnames'] ? `${def['x-enum-varnames'][i]}=${e}` : e;
         }).join(', ');
         res += `${indent}- *(Enum: ${vals})*\n`;
      }
      visited.delete(schema.$ref);
    } else if (schema.type === 'array' && schema.items) {
      res += formatSchemaTree(schema.items, depth, visited);
    } else if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
         let type = prop.type || 'object';
         let reqMark = (schema.required && schema.required.includes(key)) ? ' **(Required)**' : '';
         let desc = prop.description ? ' - ' + prop.description.replace(/\n/g, ' ') : '';
         res += `${indent}- \`${key}\` (${type})${reqMark}${desc}\n`;
      }
    }
    return res;
  }

  // Generate Endpoints
  for (const [tag, endpoints] of Object.entries(tags)) {
    markdown += `## ${tag}\n\n`;
    for (const ep of endpoints) {
      const { path, method, details } = ep;
      markdown += `### \`${method}\` \`${path}\`\n\n`;
      if (details.summary) markdown += `**Summary**: ${details.summary}\n\n`;
      if (details.description) markdown += `**Description**: ${details.description}\n\n`;

      // Parameters (query, path, header)
      const nonBodyParams = (details.parameters || []).filter(p => p.in !== 'body');
      if (nonBodyParams.length > 0) {
        markdown += `**Request Parameters**:\n\n`;
        markdown += `| Name | In | Type | Required | Description |\n`;
        markdown += `| --- | --- | --- | --- | --- |\n`;
        nonBodyParams.forEach(p => {
          let pType = p.type || formatSchemaType(p.schema);
          if (p.type === 'array' && p.items && p.items.type) {
            pType = `Array<${p.items.type}>`;
          }
          let desc = (p.description || '').replace(/\n/g, ' ');
          markdown += `| \`${p.name}\` | ${p.in} | ${pType} | ${p.required ? 'Yes' : 'No'} | ${desc} |\n`;
        });
        markdown += `\n`;
      }

      // Request Body
      const bodyParam = (details.parameters || []).find(p => p.in === 'body');
      if (bodyParam) {
        markdown += `**Request Body**:\n\n`;
        if (bodyParam.description) markdown += `${bodyParam.description}\n\n`;
        markdown += `- Schema: ${formatSchemaType(bodyParam.schema)}\n`;
        const tree = formatSchemaTree(bodyParam.schema);
        if (tree) markdown += `    **Properties**:\n${tree}`;
        markdown += `\n`;
      }

      // Responses
      if (details.responses) {
        markdown += `**Responses**:\n\n`;
        for (const [statusCode, resDetails] of Object.entries(details.responses)) {
          markdown += `- **${statusCode}**: ${resDetails.description || ''}\n`;
          if (resDetails.schema) {
            // Handle allOf (typically used for APIResponse wrapper in this project)
            if (resDetails.schema.allOf) {
              const dataProp = resDetails.schema.allOf.find(item => item.properties && item.properties.data);
              if (dataProp && dataProp.properties && dataProp.properties.data) {
                 markdown += `  - Data Schema: ${formatSchemaType(dataProp.properties.data)}\n`;
                 const tree = formatSchemaTree(dataProp.properties.data);
                 if (tree) markdown += `    **Properties**:\n${tree}`;
              } else {
                 markdown += `  - Schema: Complex allOf schema\n`;
              }
            } else {
              markdown += `  - Schema: ${formatSchemaType(resDetails.schema)}\n`;
              const tree = formatSchemaTree(resDetails.schema);
              if (tree) markdown += `    **Properties**:\n${tree}`;
            }
          }
        }
        markdown += `\n`;
      }
      markdown += `---\n\n`;
    }
  }

  // Definitions
  markdown += `## Models (Definitions)\n\n`;
  if (data.definitions) {
    for (const [defName, defDetails] of Object.entries(data.definitions)) {
      const shortName = defName.split('.').pop();
      markdown += `### <a id="${getAnchorId(defName)}"></a>\`${shortName}\`\n\n`;
      if (defDetails.description) markdown += `${defDetails.description}\n\n`;
      
      if (defDetails.properties) {
        markdown += `| Property | Type | Required | Description |\n`;
        markdown += `| --- | --- | --- | --- |\n`;
        for (const [propName, propDetails] of Object.entries(defDetails.properties)) {
          let reqMark = (defDetails.required && defDetails.required.includes(propName)) ? 'Yes' : 'No';
          let desc = (propDetails.description || '').replace(/\n/g, ' ');
          markdown += `| \`${propName}\` | ${formatSchemaType(propDetails)} | ${reqMark} | ${desc} |\n`;
        }
        markdown += `\n`;
      } else if (defDetails.allOf) {
        markdown += `*Composed of multiple schemas (allOf):*\n`;
        defDetails.allOf.forEach(item => {
           markdown += `- ${formatSchemaType(item)}\n`;
        });
        markdown += `\n`;
      } else if (defDetails.enum) {
        markdown += `*Enum values:*\n\n`;
        const varnames = defDetails['x-enum-varnames'] || [];
        const descriptions = defDetails['x-enum-comments'] || {};
        defDetails.enum.forEach((val, i) => {
           let name = varnames[i] ? ` (**${varnames[i]}**)` : '';
           let desc = '';
           if (varnames[i] && descriptions[varnames[i]]) {
             desc = ` - ${descriptions[varnames[i]]}`;
           }
           markdown += `- \`${val}\`${name}${desc}\n`;
        });
        markdown += `\n`;
      } else {
        markdown += `*No properties defined.*\n\n`;
      }
    }
  }

  fs.writeFileSync(outputPath, markdown);
  console.log(`Successfully generated ROUT.md at ${outputPath}`);
} catch (e) {
  console.error('Error:', e);
}
