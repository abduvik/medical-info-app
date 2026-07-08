"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "// Prisma schema for the patient time-series case study.\n//\n// Design notes:\n// - `Patient` corresponds to a single \"client_id\" returned by the mock API.\n// - `Observation` corresponds to a single timepoint (row) in that patient's\n//   time series. A patient can have zero, one, or many observations.\n// - The mock API's measurement fields (creatine, chloride, fasting_glucose,\n//   potassium, sodium, total_calcium, total_protein - and their *_unit\n//   companions) are NOT modeled as fixed columns. They're stored as-is in\n//   `metadata` (a JSON column), so the schema doesn't need to change if the\n//   mock API adds/removes/renames measurement fields.\n// - `dateTesting` + `patientId` is unique so re-fetching the same patient\n//   (unlikely, since client_id is randomly generated, but possible) never\n//   creates duplicate timepoints.\n// - Cascading delete on Patient -> Observation keeps \"reset\" simple and safe.\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Patient {\n  id           String        @id @default(uuid())\n  clientId     String        @unique\n  birthdate    DateTime?\n  gender       Int?\n  ethnicity    Int?\n  createdAt    DateTime      @default(now())\n  observations Observation[]\n\n  @@index([createdAt])\n}\n\nmodel Observation {\n  id          String   @id @default(uuid())\n  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)\n  patientId   String\n  dateTesting DateTime\n\n  /// Unstructured measurement data for this timepoint, e.g.\n  /// { \"creatine\": 1.2, \"creatine_unit\": \"mg/dL\", \"chloride\": 101, ... }\n  metadata Json\n\n  createdAt DateTime @default(now())\n\n  @@unique([patientId, dateTesting])\n  @@index([patientId, dateTesting])\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Patient\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"birthdate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"gender\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"ethnicity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"observations\",\"kind\":\"object\",\"type\":\"Observation\",\"relationName\":\"ObservationToPatient\"}],\"dbName\":null},\"Observation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"patient\",\"kind\":\"object\",\"type\":\"Patient\",\"relationName\":\"ObservationToPatient\"},{\"name\":\"patientId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dateTesting\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"patient\",\"observations\",\"_count\",\"Patient.findUnique\",\"Patient.findUniqueOrThrow\",\"Patient.findFirst\",\"Patient.findFirstOrThrow\",\"Patient.findMany\",\"data\",\"Patient.createOne\",\"Patient.createMany\",\"Patient.createManyAndReturn\",\"Patient.updateOne\",\"Patient.updateMany\",\"Patient.updateManyAndReturn\",\"create\",\"update\",\"Patient.upsertOne\",\"Patient.deleteOne\",\"Patient.deleteMany\",\"having\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"Patient.groupBy\",\"Patient.aggregate\",\"Observation.findUnique\",\"Observation.findUniqueOrThrow\",\"Observation.findFirst\",\"Observation.findFirstOrThrow\",\"Observation.findMany\",\"Observation.createOne\",\"Observation.createMany\",\"Observation.createManyAndReturn\",\"Observation.updateOne\",\"Observation.updateMany\",\"Observation.updateManyAndReturn\",\"Observation.upsertOne\",\"Observation.deleteOne\",\"Observation.deleteMany\",\"Observation.groupBy\",\"Observation.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"patientId\",\"dateTesting\",\"metadata\",\"createdAt\",\"equals\",\"string_contains\",\"string_starts_with\",\"string_ends_with\",\"array_starts_with\",\"array_ends_with\",\"array_contains\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"in\",\"notIn\",\"contains\",\"startsWith\",\"endsWith\",\"clientId\",\"birthdate\",\"gender\",\"ethnicity\",\"every\",\"some\",\"none\",\"patientId_dateTesting\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "dRQgCgQAAEwAIC4AAEcAMC8AAAkAEDAAAEcAMDEBAAAAATVAAEsAIUcBAAAAAUhAAEkAIUkCAEoAIUoCAEoAIQEAAAABACAJAwAAUAAgLgAATgAwLwAAAwAQMAAATgAwMQEASAAhMgEASAAhM0AASwAhNAAATwAgNUAASwAhAQMAAG8AIAoDAABQACAuAABOADAvAAADABAwAABOADAxAQAAAAEyAQBIACEzQABLACE0AABPACA1QABLACFOAABNACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAMAIAEAAAABACAKBAAATAAgLgAARwAwLwAACQAQMAAARwAwMQEASAAhNUAASwAhRwEASAAhSEAASQAhSQIASgAhSgIASgAhBAQAAG4AIEgAAFgAIEkAAFgAIEoAAFgAIAMAAAAJACABAAAKADACAAABACADAAAACQAgAQAACgAwAgAAAQAgAwAAAAkAIAEAAAoAMAIAAAEAIAcEAABtACAxAQAAAAE1QAAAAAFHAQAAAAFIQAAAAAFJAgAAAAFKAgAAAAEBCwAADgAgBjEBAAAAATVAAAAAAUcBAAAAAUhAAAAAAUkCAAAAAUoCAAAAAQELAAAQADABCwAAEAAwBwQAAGAAIDEBAFQAITVAAFUAIUcBAFQAIUhAAF4AIUkCAF8AIUoCAF8AIQIAAAABACALAAATACAGMQEAVAAhNUAAVQAhRwEAVAAhSEAAXgAhSQIAXwAhSgIAXwAhAgAAAAkAIAsAABUAIAIAAAAJACALAAAVACADAAAAAQAgEgAADgAgEwAAEwAgAQAAAAEAIAEAAAAJACAIBQAAWQAgGAAAWgAgGQAAXQAgGgAAXAAgGwAAWwAgSAAAWAAgSQAAWAAgSgAAWAAgCS4AAD8AMC8AABwAEDAAAD8AMDEBADYAITVAADcAIUcBADYAIUhAAEAAIUkCAEEAIUoCAEEAIQMAAAAJACABAAAbADAXAAAcACADAAAACQAgAQAACgAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAGAwAAVwAgMQEAAAABMgEAAAABM0AAAAABNIAAAAABNUAAAAABAQsAACQAIAUxAQAAAAEyAQAAAAEzQAAAAAE0gAAAAAE1QAAAAAEBCwAAJgAwAQsAACYAMAYDAABWACAxAQBUACEyAQBUACEzQABVACE0gAAAAAE1QABVACECAAAABQAgCwAAKQAgBTEBAFQAITIBAFQAITNAAFUAITSAAAAAATVAAFUAIQIAAAADACALAAArACACAAAAAwAgCwAAKwAgAwAAAAUAIBIAACQAIBMAACkAIAEAAAAFACABAAAAAwAgAwUAAFEAIBoAAFMAIBsAAFIAIAguAAA1ADAvAAAyABAwAAA1ADAxAQA2ACEyAQA2ACEzQAA3ACE0AAA4ACA1QAA3ACEDAAAAAwAgAQAAMQAwFwAAMgAgAwAAAAMAIAEAAAQAMAIAAAUAIAguAAA1ADAvAAAyABAwAAA1ADAxAQA2ACEyAQA2ACEzQAA3ACE0AAA4ACA1QAA3ACEOBQAAOQAgGgAAPgAgGwAAPgAgNgEAAAABPQEAAAABPgEAAAABPwEAAAABQAEAAAABQQEAPQAhQgEAAAAEQwEAAAAERAEAAAABRQEAAAABRgEAAAABCwUAADkAIBoAADwAIBsAADwAIDZAAAAAAT1AAAAAAT5AAAAAAT9AAAAAAUBAAAAAAUFAADsAIUJAAAAABENAAAAABA8FAAA5ACAaAAA6ACAbAAA6ACA2gAAAAAE3AQAAAAE4AQAAAAE5AQAAAAE6gAAAAAE7gAAAAAE8gAAAAAE9gAAAAAE-gAAAAAE_gAAAAAFAgAAAAAFBgAAAAAEINgIAAAABPQIAAAABPgIAAAABPwIAAAABQAIAAAABQQIAOQAhQgIAAAAEQwIAAAAEDDaAAAAAATcBAAAAATgBAAAAATkBAAAAATqAAAAAATuAAAAAATyAAAAAAT2AAAAAAT6AAAAAAT-AAAAAAUCAAAAAAUGAAAAAAQsFAAA5ACAaAAA8ACAbAAA8ACA2QAAAAAE9QAAAAAE-QAAAAAE_QAAAAAFAQAAAAAFBQAA7ACFCQAAAAARDQAAAAAQINkAAAAABPUAAAAABPkAAAAABP0AAAAABQEAAAAABQUAAPAAhQkAAAAAEQ0AAAAAEDgUAADkAIBoAAD4AIBsAAD4AIDYBAAAAAT0BAAAAAT4BAAAAAT8BAAAAAUABAAAAAUEBAD0AIUIBAAAABEMBAAAABEQBAAAAAUUBAAAAAUYBAAAAAQs2AQAAAAE9AQAAAAE-AQAAAAE_AQAAAAFAAQAAAAFBAQA-ACFCAQAAAARDAQAAAAREAQAAAAFFAQAAAAFGAQAAAAEJLgAAPwAwLwAAHAAQMAAAPwAwMQEANgAhNUAANwAhRwEANgAhSEAAQAAhSQIAQQAhSgIAQQAhCwUAAEMAIBoAAEYAIBsAAEYAIDZAAAAAAT1AAAAAAT5AAAAAAT9AAAAAAUBAAAAAAUFAAEUAIUJAAAAABUNAAAAABQ0FAABDACAYAABEACAZAABDACAaAABDACAbAABDACA2AgAAAAE9AgAAAAE-AgAAAAE_AgAAAAFAAgAAAAFBAgBCACFCAgAAAAVDAgAAAAUNBQAAQwAgGAAARAAgGQAAQwAgGgAAQwAgGwAAQwAgNgIAAAABPQIAAAABPgIAAAABPwIAAAABQAIAAAABQQIAQgAhQgIAAAAFQwIAAAAFCDYCAAAAAT0CAAAAAT4CAAAAAT8CAAAAAUACAAAAAUECAEMAIUICAAAABUMCAAAABQg2CAAAAAE9CAAAAAE-CAAAAAE_CAAAAAFACAAAAAFBCABEACFCCAAAAAVDCAAAAAULBQAAQwAgGgAARgAgGwAARgAgNkAAAAABPUAAAAABPkAAAAABP0AAAAABQEAAAAABQUAARQAhQkAAAAAFQ0AAAAAFCDZAAAAAAT1AAAAAAT5AAAAAAT9AAAAAAUBAAAAAAUFAAEYAIUJAAAAABUNAAAAABQoEAABMACAuAABHADAvAAAJABAwAABHADAxAQBIACE1QABLACFHAQBIACFIQABJACFJAgBKACFKAgBKACELNgEAAAABPQEAAAABPgEAAAABPwEAAAABQAEAAAABQQEAPgAhQgEAAAAEQwEAAAAERAEAAAABRQEAAAABRgEAAAABCDZAAAAAAT1AAAAAAT5AAAAAAT9AAAAAAUBAAAAAAUFAAEYAIUJAAAAABUNAAAAABQg2AgAAAAE9AgAAAAE-AgAAAAE_AgAAAAFAAgAAAAFBAgBDACFCAgAAAAVDAgAAAAUINkAAAAABPUAAAAABPkAAAAABP0AAAAABQEAAAAABQUAAPAAhQkAAAAAEQ0AAAAAEA0sAAAMAIEwAAAMAIE0AAAMAIAIyAQAAAAEzQAAAAAEJAwAAUAAgLgAATgAwLwAAAwAQMAAATgAwMQEASAAhMgEASAAhM0AASwAhNAAATwAgNUAASwAhDDaAAAAAATcBAAAAATgBAAAAATkBAAAAATqAAAAAATuAAAAAATyAAAAAAT2AAAAAAT6AAAAAAT-AAAAAAUCAAAAAAUGAAAAAAQwEAABMACAuAABHADAvAAAJABAwAABHADAxAQBIACE1QABLACFHAQBIACFIQABJACFJAgBKACFKAgBKACFPAAAJACBQAAAJACAAAAABVAEAAAABAVRAAAAAAQUSAABxACATAAB0ACBRAAByACBSAABzACBXAAABACADEgAAcQAgUQAAcgAgVwAAAQAgAAAAAAAAAVRAAAAAAQVUAgAAAAFaAgAAAAFbAgAAAAFcAgAAAAFdAgAAAAELEgAAYQAwEwAAZgAwUQAAYgAwUgAAYwAwUwAAZAAgVAAAZQAwVQAAZQAwVgAAZQAwVwAAZQAwWAAAZwAwWQAAaAAwBDEBAAAAATNAAAAAATSAAAAAATVAAAAAAQIAAAAFACASAABsACADAAAABQAgEgAAbAAgEwAAawAgAQsAAHAAMAoDAABQACAuAABOADAvAAADABAwAABOADAxAQAAAAEyAQBIACEzQABLACE0AABPACA1QABLACFOAABNACACAAAABQAgCwAAawAgAgAAAGkAIAsAAGoAIAguAABoADAvAABpABAwAABoADAxAQBIACEyAQBIACEzQABLACE0AABPACA1QABLACEILgAAaAAwLwAAaQAQMAAAaAAwMQEASAAhMgEASAAhM0AASwAhNAAATwAgNUAASwAhBDEBAFQAITNAAFUAITSAAAAAATVAAFUAIQQxAQBUACEzQABVACE0gAAAAAE1QABVACEEMQEAAAABM0AAAAABNIAAAAABNUAAAAABBBIAAGEAMFEAAGIAMFMAAGQAIFcAAGUAMAAEBAAAbgAgSAAAWAAgSQAAWAAgSgAAWAAgBDEBAAAAATNAAAAAATSAAAAAATVAAAAAAQYxAQAAAAE1QAAAAAFHAQAAAAFIQAAAAAFJAgAAAAFKAgAAAAECAAAAAQAgEgAAcQAgAwAAAAkAIBIAAHEAIBMAAHUAIAgAAAAJACALAAB1ACAxAQBUACE1QABVACFHAQBUACFIQABeACFJAgBfACFKAgBfACEGMQEAVAAhNUAAVQAhRwEAVAAhSEAAXgAhSQIAXwAhSgIAXwAhAgQGAgUAAwEDAAEBBAcAAAAABQUACBgACRkAChoACxsADAAAAAAABQUACBgACRkAChoACxsADAEDAAEBAwABAwUAERoAEhsAEwAAAAMFABEaABIbABMGAgEHCAEICwEJDAEKDQEMDwENEQQOEgUPFAEQFgQRFwYUGAEVGQEWGgQcHQcdHg0eHwIfIAIgIQIhIgIiIwIjJQIkJwQlKA4mKgInLAQoLQ8pLgIqLwIrMAQsMxAtNBQ"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve().then(() => __importStar(require('node:buffer')));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"))),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js")));
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map