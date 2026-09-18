const characterBody = {
  type: "object",
  required: ["name", "description"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    avatar: { type: "string", format: "uri" },
    personality: {
      type: "object",
      properties: {
        traits: { type: "array", items: { type: "string" } },
        temperament: { type: "string" },
        values: { type: "array", items: { type: "string" } },
        behavioralPatterns: { type: "array", items: { type: "string" } },
      },
    },
    communicationStyle: {
      type: "object",
      properties: {
        formality: { type: "string", enum: ["casual", "neutral", "formal"] },
        sentenceLength: { type: "string", enum: ["short", "medium", "long"] },
        vocabulary: { type: "string" },
        emojiUsage: { type: "string", enum: ["none", "low", "medium", "high"] },
      },
    },
    backstory: { type: "string" },
    relationships: { type: "array", items: { type: "string" } },
    speechPatterns: { type: "array", items: { type: "string" } },
    currentState: {
      type: "object",
      properties: {
        mood: { type: "string" },
        trust: { type: "number", minimum: 0, maximum: 1 },
        affection: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    worldId: { type: "string" },
  },
};

const character = {
  allOf: [
    { type: "object", properties: { _id: { type: "string" }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } },
    characterBody,
  ],
};

const worldBody = {
  type: "object",
  required: ["name", "description"],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    lore: { type: "string" },
    locations: { type: "array", items: { type: "string" } },
    factions: { type: "array", items: { type: "string" } },
    events: { type: "array", items: { type: "string" } },
  },
};

const world = {
  allOf: [
    { type: "object", properties: { _id: { type: "string" }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } },
    worldBody,
  ],
};

const conversationBody = {
  type: "object",
  required: ["characterId"],
  properties: {
    characterId: { type: "string" },
    worldId: { type: "string" },
    title: { type: "string" },
  },
};

const conversation = {
  allOf: [
    {
      type: "object",
      properties: {
        _id: { type: "string" },
        currentScene: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },
    conversationBody,
  ],
};

const message = {
  type: "object",
  properties: {
    _id: { type: "string" },
    conversationId: { type: "string" },
    role: { type: "string", enum: ["user", "assistant", "system"] },
    content: { type: "string" },
    tokenUsage: {
      type: "object",
      properties: {
        inputTokens: { type: "number" },
        outputTokens: { type: "number" },
        totalTokens: { type: "number" },
      },
    },
    model: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const error = {
  type: "object",
  properties: {
    error: { type: "string" },
    details: { type: "object" },
  },
};

function crudPaths(resource: string, bodySchemaName: string, responseSchemaName: string) {
  return {
    [`/api/v1/${resource}`]: {
      get: {
        tags: [resource],
        summary: `List ${resource}`,
        responses: {
          "200": {
            description: "OK",
            content: { "application/json": { schema: { type: "array", items: { $ref: `#/components/schemas/${responseSchemaName}` } } } },
          },
        },
      },
      post: {
        tags: [resource],
        summary: `Create a ${resource.slice(0, -1)}`,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: `#/components/schemas/${bodySchemaName}` } } },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: `#/components/schemas/${responseSchemaName}` } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    [`/api/v1/${resource}/{id}`]: {
      get: {
        tags: [resource],
        summary: `Get a ${resource.slice(0, -1)} by id`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: `#/components/schemas/${responseSchemaName}` } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      patch: {
        tags: [resource],
        summary: `Update a ${resource.slice(0, -1)}`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: `#/components/schemas/${bodySchemaName}` } } },
        },
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: `#/components/schemas/${responseSchemaName}` } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: [resource],
        summary: `Delete a ${resource.slice(0, -1)}`,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  };
}

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Fantasy Character Chat App API",
    version: "0.1.0",
    description:
      "MVP backend API for the Fantasy Character Chat App. Auth/users are not implemented yet (explicit MVP scope decision) — no endpoint here requires a token.",
  },
  servers: [{ url: "/" }],
  tags: [{ name: "characters" }, { name: "worlds" }, { name: "conversations" }],
  paths: {
    "/health": {
      get: {
        tags: ["health"],
        summary: "Health check",
        responses: { "200": { description: "OK" } },
      },
    },
    ...crudPaths("characters", "CharacterInput", "Character"),
    ...crudPaths("worlds", "WorldInput", "World"),
    "/api/v1/conversations": {
      get: {
        tags: ["conversations"],
        summary: "List conversations",
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Conversation" } } } } },
        },
      },
      post: {
        tags: ["conversations"],
        summary: "Start a conversation with a character",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ConversationInput" } } },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Conversation" } } } },
          "400": { description: "Character or world not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/v1/conversations/{id}": {
      get: {
        tags: ["conversations"],
        summary: "Get a conversation by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Conversation" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        tags: ["conversations"],
        summary: "Delete a conversation and its messages",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Deleted" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/api/v1/conversations/{id}/messages": {
      get: {
        tags: ["conversations"],
        summary: "List messages in a conversation",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Message" } } } } },
        },
      },
      post: {
        tags: ["conversations"],
        summary: "Send a message and get the character's AI-generated reply",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["message"], properties: { message: { type: "string", minLength: 1, maxLength: 4000 } } } } },
        },
        responses: {
          "201": {
            description: "Assistant reply",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { $ref: "#/components/schemas/Message" },
                    usage: {
                      type: "object",
                      properties: { inputTokens: { type: "number" }, outputTokens: { type: "number" }, totalTokens: { type: "number" } },
                    },
                  },
                },
              },
            },
          },
          "502": { description: "AI provider failure", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
  components: {
    schemas: {
      CharacterInput: characterBody,
      Character: character,
      WorldInput: worldBody,
      World: world,
      ConversationInput: conversationBody,
      Conversation: conversation,
      Message: message,
      Error: error,
    },
  },
};
