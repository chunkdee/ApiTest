import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fakeRestProvider from 'ra-data-fakerest';
import sampleData from './datagenerator/generateSampleData2';
import * as crmTypes from './datagenerator/types/crmTypes';

const app = express();
const PORT = process.env.PORT || 3030;

// Initialize fakeRestProvider with clean sample data
const dataProvider = fakeRestProvider(sampleData, true);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Add this after your imports
type EntityRelation = {
  [key: string]: string[];
};

// Define relationships to exclude for each entity type
const entityRelations: EntityRelation = {
  'Company': ['contacts', 'opportunities'],
  'Contact': ['company', 'opportunities'],
  'Opportunity': ['company', 'contacts'],
  'Activity': ['contact', 'company'],
  'Task': ['assignedTo', 'company'],
  // Add other relationships as needed
};

// Add this helper function
const sanitizeData = (data: any, entityName: string): any => {
  if (!data) return null;
  
  const excludeFields = entityRelations[entityName] || [];
  
  if (Array.isArray(data)) {
    return data.map(item => {
      const sanitizedItem = { ...item };
      excludeFields.forEach(field => {
        if (sanitizedItem[field]) {
          // Replace with reference ID(s)
          if (Array.isArray(sanitizedItem[field])) {
            sanitizedItem[`${field}Ids`] = sanitizedItem[field].map((ref: any) => ref.id);
          } else {
            sanitizedItem[`${field}Id`] = sanitizedItem[field].id;
          }
          delete sanitizedItem[field];
        }
      });
      return sanitizedItem;
    });
  }
  
  // Handle single item
  const sanitizedItem = { ...data };
  excludeFields.forEach(field => {
    if (sanitizedItem[field]) {
      if (Array.isArray(sanitizedItem[field])) {
        sanitizedItem[`${field}Ids`] = sanitizedItem[field].map((ref: any) => ref.id);
      } else {
        sanitizedItem[`${field}Id`] = sanitizedItem[field].id;
      }
      delete sanitizedItem[field];
    }
  });
  return sanitizedItem;
};

// Generate swagger paths dynamically based on crmTypes
const generateSwaggerPaths = () => {
  const paths: any = {};
  Object.keys(sampleData).forEach(entityName => {
    const path = `/api/${entityName.toLowerCase()}`;
    paths[path] = {
      get: {
        tags: [entityName],
        summary: `Get all ${entityName}`,
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: `#/components/schemas/${entityName}`
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      post: {
        tags: [entityName],
        summary: `Create new ${entityName}`,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${entityName}`
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entityName}`
                }
              }
            }
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    };

    // Add individual item operations
    paths[`${path}/{id}`] = {
      get: {
        tags: [entityName],
        summary: `Get ${entityName} by ID`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entityName}`
                }
              }
            }
          },
          '404': {
            description: 'Not found'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      put: {
        tags: [entityName],
        summary: `Update ${entityName}`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${entityName}`
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${entityName}`
                }
              }
            }
          },
          '404': {
            description: 'Not found'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      delete: {
        tags: [entityName],
        summary: `Delete ${entityName}`,
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Deleted successfully'
          },
          '404': {
            description: 'Not found'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    };
  });
  return paths;
};

// Helper function to safely handle circular references
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  };
};

// Generate swagger schemas dynamically based on sample data
const generateSwaggerSchemas = () => {
  const schemas: any = {};
  Object.entries(sampleData).forEach(([entityName, entityData]) => {
    if (Array.isArray(entityData) && entityData.length > 0) {
      const sampleObject = JSON.parse(
        JSON.stringify(entityData[0], getCircularReplacer())
      );
      schemas[entityName] = {
        type: 'object',
        properties: Object.entries(sampleObject).reduce((acc: any, [key, value]) => {
          acc[key] = {
            type: typeof value,
            example: value
          };
          return acc;
        }, {})
      };
    }
  });
  return schemas;
};

// Swagger configuration
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'CRM API',
    version: '1.0.0',
    description: 'API documentation for CRM system'
  },
  servers: [
    {
      url: 'http://localhost:3030',
      description: 'Development server'
    }
  ],
  paths: generateSwaggerPaths(),
  components: {
    schemas: generateSwaggerSchemas()
  }
};

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Generate routes using ra-data-fakerest
Object.keys(sampleData).forEach(entityName => {
  // GET all
  app.get(`/api/${entityName.toLowerCase()}`, async (req, res) => {
    try {
      const { data } = await dataProvider.getList(entityName, {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {}
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Error fetching ${entityName} data` });
    }
  });

  // GET by ID
  app.get(`/api/${entityName.toLowerCase()}/:id`, async (req, res) => {
    try {
      const { data } = await dataProvider.getOne(entityName, { id: req.params.id });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: `${entityName} not found` });
      }
    } catch (error) {
      res.status(500).json({ error: `Error fetching ${entityName} data` });
    }
  });

  // POST
  app.post(`/api/${entityName.toLowerCase()}`, async (req, res) => {
    try {
      const { data } = await dataProvider.create(entityName, { data: req.body });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: `Error creating ${entityName}` });
    }
  });

  // PUT
  app.put(`/api/${entityName.toLowerCase()}/:id`, async (req, res) => {
    try {
      const { data } = await dataProvider.update(entityName, {
        id: req.params.id,
        data: req.body,
        previousData: {}
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Error updating ${entityName}` });
    }
  });

  // DELETE
  app.delete(`/api/${entityName.toLowerCase()}/:id`, async (req, res) => {
    try {
      const { data } = await dataProvider.delete(entityName, { id: req.params.id });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: `Error deleting ${entityName}` });
    }
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI available on http://localhost:${PORT}/api-docs`);
});
